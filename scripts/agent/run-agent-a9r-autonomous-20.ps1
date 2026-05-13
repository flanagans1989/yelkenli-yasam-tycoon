# ============================================================
# A9R - Autonomous 20-task local agent (Aider + Ollama)
# Project : Yelkenli Yasam Tycoon
# Repo    : C:\dev\yelkenli-yasam-tycoon
# Runner  : Windows PowerShell 5+ / PowerShell 7
# Usage   : powershell -ExecutionPolicy Bypass -File .\scripts\agent\run-agent-a9r-autonomous-20.ps1
# Notes   : Script does NOT git add / commit / push. User commits manually.
# ============================================================

[CmdletBinding()]
param(
    [string]$RepoPath        = 'C:\dev\yelkenli-yasam-tycoon',
    [string]$AgentBranch     = 'agent/day-01',
    [string]$AiderModel      = 'ollama_chat/qwen2.5-coder:7b',
    [int]   $AiderTimeoutSec = 900,
    [int]   $BuildTimeoutSec = 600
)

$ErrorActionPreference = 'Stop'
$ProgressPreference    = 'SilentlyContinue'

# ============================================================
# CONFIG
# ============================================================
$RunId      = 'A9R'
$Stamp      = Get-Date -Format 'yyyyMMdd-HHmmss'
$LogDir     = Join-Path $RepoPath 'logs\agent'
$DocsDir    = Join-Path $RepoPath 'docs\agent'
$TasksDir   = Join-Path $DocsDir 'tasks'
$PatchesDir = Join-Path $DocsDir 'patches'
$AppCss     = Join-Path $RepoPath 'src\App.css'
$RunLog     = Join-Path $LogDir  ("$RunId-run-$Stamp.log")

# Whitelist of paths that may change during this run (regex, forward slash form)
$AllowedPathPatterns = @(
    '^src/App\.css$',
    '^progress\.md$',
    '^errors_log\.md$',
    '^docs/agent/A9R_.*\.md$',
    '^docs/agent/tasks/A9R_TASK_.*\.md$',
    '^docs/agent/patches/A9R_.*\.css$',
    '^logs/agent/.*$'
)

$ForbiddenCssPatterns = @(
    '@import',
    'url\(',
    'position\s*:\s*fixed',
    '!important'
)

$Successes = New-Object System.Collections.ArrayList
$Failures  = New-Object System.Collections.ArrayList
$HardStop  = $false
$HardStopReason = ''

# ============================================================
# UTILS
# ============================================================
function Write-Utf8File {
    param([string]$Path, [string]$Content)
    $dir = Split-Path -Parent $Path
    if ($dir -and -not (Test-Path $dir)) {
        New-Item -ItemType Directory -Force -Path $dir | Out-Null
    }
    [System.IO.File]::WriteAllText($Path, $Content, [System.Text.UTF8Encoding]::new($false))
}

function Write-AgentLog {
    param([string]$Msg, [string]$Level = 'INFO')
    $line = '[{0}] [{1}] {2}' -f (Get-Date -Format 'HH:mm:ss'), $Level, $Msg
    Write-Host $line
    try { Add-Content -LiteralPath $RunLog -Value $line -Encoding utf8 } catch {}
}

function Append-ErrorsLog {
    param([string]$TaskId, [string]$Reason)
    $errPath = Join-Path $RepoPath 'errors_log.md'
    $entry = "`r`n## $RunId / $TaskId - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')`r`n$Reason`r`n"
    try { Add-Content -LiteralPath $errPath -Value $entry -Encoding utf8 } catch {}
}

function Append-Progress {
    param([string]$TaskId, [string]$Status, [string]$Note = '')
    $progPath = Join-Path $RepoPath 'progress.md'
    $entry = "- [$Status] $RunId / $TaskId  $(Get-Date -Format 'HH:mm:ss')  $Note`r`n"
    try { Add-Content -LiteralPath $progPath -Value $entry -Encoding utf8 } catch {}
}

function Get-ChangedFiles {
    # --untracked-files=all forces git to list every untracked FILE, not just the new directory
    $raw = git -C $RepoPath status --porcelain --untracked-files=all 2>$null
    if (-not $raw) { return @() }
    $list = New-Object System.Collections.ArrayList
    foreach ($l in ($raw -split "`n")) {
        if (-not $l) { continue }
        $path = $l.Substring(3).Trim()
        if ($path -match ' -> ') { $path = ($path -split ' -> ')[1] }
        $path = $path.Trim('"').Replace('\','/')
        [void]$list.Add($path)
    }
    return ,$list.ToArray()
}

function Get-ForbiddenChanges {
    $bad = New-Object System.Collections.ArrayList
    foreach ($f in (Get-ChangedFiles)) {
        $ok = $false
        foreach ($p in $AllowedPathPatterns) {
            if ($f -match $p) { $ok = $true; break }
        }
        if (-not $ok) { [void]$bad.Add($f) }
    }
    return ,$bad.ToArray()
}

function Test-RequiredOutput {
    param([string]$Path, [int]$MinBytes = 200)
    if (-not (Test-Path $Path)) { return $false }
    return ((Get-Item $Path).Length -ge $MinBytes)
}

function Ensure-OutputStub {
    param([string]$Path, [string]$Kind, [string]$TaskId)
    if (Test-Path $Path) { return }
    if ($Kind -eq 'css') {
        $body = "/* === $TaskId PATCH START === */`r`n/* agent will replace this placeholder */`r`n/* === $TaskId PATCH END === */`r`n"
    } else {
        $name = Split-Path -Leaf $Path
        $body = "# $name`r`n`r`n_Placeholder. Agent will fill this._`r`n"
    }
    Write-Utf8File -Path $Path -Content $body
}

function To-RepoRel {
    param([string]$AbsPath)
    $r = $RepoPath.TrimEnd('\','/').Replace('\','/')
    $a = $AbsPath.Replace('\','/')
    if ($a.StartsWith($r + '/')) { return $a.Substring($r.Length + 1) }
    return $a
}

# ============================================================
# AIDER INVOCATION
# ============================================================
function Build-AiderPrompt {
    param([string]$OutputRel, [string]$Body, [string]$Kind, [string]$TaskId)
    $sb = New-Object System.Text.StringBuilder
    [void]$sb.AppendLine('You are operating inside a script-controlled, isolated agent run.')
    [void]$sb.AppendLine('Rules you MUST follow:')
    [void]$sb.AppendLine('- Edit ONLY the single file already added to chat.')
    [void]$sb.AppendLine('- Do NOT request, mention, open or add any other file.')
    [void]$sb.AppendLine('- Do NOT print explanations outside the file content.')
    [void]$sb.AppendLine('- Do NOT wrap the file content in markdown code fences.')
    [void]$sb.AppendLine('- Replace the existing placeholder content completely.')
    if ($Kind -eq 'css') {
        [void]$sb.AppendLine('- Output type: pure CSS.')
        [void]$sb.AppendLine("- Keep the two marker lines '=== $TaskId PATCH START ===' and '=== $TaskId PATCH END ===' intact.")
        [void]$sb.AppendLine('- Write CSS only BETWEEN those markers.')
        [void]$sb.AppendLine('- Forbidden in CSS: @import, url(...), position: fixed, !important.')
        [void]$sb.AppendLine('- Use class selectors only. Mobile-first. Minimum 30 lines of useful CSS.')
    } else {
        [void]$sb.AppendLine('- Output type: Markdown audit / report.')
        [void]$sb.AppendLine('- Minimum 40 lines of substantive content.')
        [void]$sb.AppendLine('- Use H2 sections. Be concrete, not generic.')
    }
    [void]$sb.AppendLine('')
    [void]$sb.AppendLine('---')
    [void]$sb.AppendLine('TASK:')
    [void]$sb.AppendLine($Body)
    return $sb.ToString()
}

function Invoke-AiderTask {
    param(
        [string]$TaskId,
        [string]$Prompt,
        [string]$OutputAbs,
        [string]$Kind
    )

    $taskFile = Join-Path $TasksDir "${RunId}_TASK_${TaskId}.md"
    Write-Utf8File -Path $taskFile -Content $Prompt

    Ensure-OutputStub -Path $OutputAbs -Kind $Kind -TaskId "${RunId}_${TaskId}"

    $aiderOut = Join-Path $LogDir "${RunId}-aider-${TaskId}-${Stamp}.out"
    $aiderErr = Join-Path $LogDir "${RunId}-aider-${TaskId}-${Stamp}.err"

    $aiderArgs = @(
        '--model', $AiderModel,
        '--no-auto-commits',
        '--map-tokens', '0',
        '--yes-always',
        '--no-stream',
        '--no-pretty',
        '--no-show-model-warnings',
        '--no-check-update',
        '--no-show-release-notes',
        '--no-suggest-shell-commands',
        '--message-file', $taskFile,
        '--file', $OutputAbs
    )

    Write-AgentLog "AIDER START $TaskId -> $(To-RepoRel $OutputAbs)"
    $p = $null
    try {
        $p = Start-Process -FilePath 'aider' -ArgumentList $aiderArgs `
            -WorkingDirectory $RepoPath -NoNewWindow -PassThru `
            -RedirectStandardOutput $aiderOut -RedirectStandardError $aiderErr
    } catch {
        Write-AgentLog "AIDER FAILED TO START $TaskId : $_" 'ERROR'
        return $false
    }

    $exitedInTime = $p.WaitForExit($AiderTimeoutSec * 1000)
    if (-not $exitedInTime) {
        try { $p.Kill(); $p.WaitForExit() } catch {}
        Write-AgentLog "AIDER TIMEOUT $TaskId after $AiderTimeoutSec s" 'ERROR'
        return $false
    }
    # Flush: parameterless WaitForExit() drains async output streams and guarantees ExitCode is set
    try { $p.WaitForExit() } catch {}
    $exit = $null
    try { $exit = $p.ExitCode } catch {}
    if ($null -eq $exit) {
        # Process exited within timeout but exit code unreadable (Start-Process quirk).
        # Trust the file-output validation gate instead of the exit code.
        Write-AgentLog "AIDER END   $TaskId exit=<unreadable, trusting file validation>" 'WARN'
        return $true
    }
    Write-AgentLog "AIDER END   $TaskId exit=$exit"
    return ($exit -eq 0)
}

# ============================================================
# PATCH HANDLING (script-side, not Aider)
# ============================================================
function Test-PatchFile {
    param([string]$PatchPath, [string]$TaskId)

    if (-not (Test-Path $PatchPath)) {
        return @{ Ok = $false; Reason = "Patch file missing: $(To-RepoRel $PatchPath)" }
    }
    $content = Get-Content -LiteralPath $PatchPath -Raw -Encoding utf8

    $markerStart = "$TaskId PATCH START"
    $markerEnd   = "$TaskId PATCH END"
    if ($content -notmatch [regex]::Escape($markerStart)) {
        return @{ Ok = $false; Reason = "Missing START marker in $(To-RepoRel $PatchPath)" }
    }
    if ($content -notmatch [regex]::Escape($markerEnd)) {
        return @{ Ok = $false; Reason = "Missing END marker in $(To-RepoRel $PatchPath)" }
    }
    foreach ($pat in $ForbiddenCssPatterns) {
        if ($content -match $pat) {
            return @{ Ok = $false; Reason = "Forbidden pattern '$pat' in $(To-RepoRel $PatchPath)" }
        }
    }
    if ($content.Length -lt 200) {
        return @{ Ok = $false; Reason = "Patch too small (<200 bytes): $(To-RepoRel $PatchPath)" }
    }
    return @{ Ok = $true; Reason = '' }
}

function Append-PatchIfMissing {
    param([string]$PatchPath, [string]$TaskId)

    $patch = Get-Content -LiteralPath $PatchPath -Raw -Encoding utf8
    $appCssContent = if (Test-Path $AppCss) {
        Get-Content -LiteralPath $AppCss -Raw -Encoding utf8
    } else { '' }

    $markerStart = "$TaskId PATCH START"
    if ($appCssContent -match [regex]::Escape($markerStart)) {
        return @{ Applied = $false; Reason = 'Already present in App.css' }
    }
    $append = "`r`n`r`n" + $patch.TrimEnd() + "`r`n"
    Add-Content -LiteralPath $AppCss -Value $append -Encoding utf8
    return @{ Applied = $true; Reason = 'Appended to App.css' }
}

# ============================================================
# BUILD
# ============================================================
function Invoke-NpmBuild {
    $buildOut = Join-Path $LogDir "${RunId}-build-${Stamp}.out"
    $buildErr = Join-Path $LogDir "${RunId}-build-${Stamp}.err"

    Write-AgentLog 'BUILD START npm run build'
    $p = Start-Process -FilePath 'cmd.exe' -ArgumentList '/c','npm','run','build' `
        -WorkingDirectory $RepoPath -NoNewWindow -PassThru `
        -RedirectStandardOutput $buildOut -RedirectStandardError $buildErr

    $exitedInTime = $p.WaitForExit($BuildTimeoutSec * 1000)
    if (-not $exitedInTime) {
        try { $p.Kill(); $p.WaitForExit() } catch {}
        Write-AgentLog "BUILD TIMEOUT after $BuildTimeoutSec s" 'ERROR'
        return @{ Ok = $false; Out = $buildOut; Err = $buildErr; Exit = -1 }
    }
    try { $p.WaitForExit() } catch {}
    $exit = $null
    try { $exit = $p.ExitCode } catch {}

    if ($null -ne $exit) {
        Write-AgentLog "BUILD END exit=$exit"
        return @{ Ok = ($exit -eq 0); Out = $buildOut; Err = $buildErr; Exit = $exit }
    }

    # Exit code unreadable - inspect log files for known error markers as fallback
    $stderrContent = if (Test-Path $buildErr) { Get-Content -LiteralPath $buildErr -Raw -Encoding utf8 } else { '' }
    $stdoutContent = if (Test-Path $buildOut) { Get-Content -LiteralPath $buildOut -Raw -Encoding utf8 } else { '' }
    if ($null -eq $stderrContent) { $stderrContent = '' }
    if ($null -eq $stdoutContent) { $stdoutContent = '' }
    $combined = $stderrContent + "`n" + $stdoutContent

    $errorPatterns = @(
        'npm ERR!',
        'Build failed',
        'error TS\d+',
        'vite.*error',
        'Cannot find module',
        'is not recognized as an internal',
        'ENOENT',
        'SyntaxError'
    )
    foreach ($pat in $errorPatterns) {
        if ($combined -match $pat) {
            Write-AgentLog "BUILD END exit=<unreadable, error pattern detected: $pat>" 'ERROR'
            return @{ Ok = $false; Out = $buildOut; Err = $buildErr; Exit = -1 }
        }
    }
    Write-AgentLog 'BUILD END exit=<unreadable, no error markers in logs, trusting success>' 'WARN'
    return @{ Ok = $true; Out = $buildOut; Err = $buildErr; Exit = 0 }
}

# ============================================================
# TASK DEFINITIONS
# ============================================================
function New-AiderTask {
    param($Id, $Title, $Body, $OutputAbs, $Kind, $MinBytes = 400)
    [pscustomobject]@{
        Id        = $Id
        Title     = $Title
        Body      = $Body
        Output    = $OutputAbs
        Kind      = $Kind
        MinBytes  = $MinBytes
        Type      = 'aider'
    }
}

function New-ScriptTask {
    param($Id, $Title, [scriptblock]$Action, $Output = $null, $MinBytes = 0)
    [pscustomobject]@{
        Id       = $Id
        Title    = $Title
        Action   = $Action
        Output   = $Output
        MinBytes = $MinBytes
        Type     = 'script'
    }
}

# --- Audit prompts (Aider) ---
$P01 = @'
Write a mobile UI risk audit for a React + Vite tycoon game called "Yelkenli Yasam Tycoon" (Sailing Life Tycoon).
Game loop: produce content -> earn money/followers -> upgrade boat -> sail route -> arrive at new port -> unlock new sponsors.
You CANNOT see the source code. Reason from general React/Vite mobile UI experience.
Cover sections (each as H2):
1. Tap target sizing risks (44px minimum, spacing)
2. Text legibility on small screens
3. Modal / overlay risks
4. Sticky / fixed positioning risks
5. Scroll trap risks
6. Loading-state risks
7. Toast / notification risks
8. Top 5 lowest-risk CSS-only improvements to apply first
Output language: Turkish.
'@

$P02 = @'
Write a "first 10 minutes player experience" review for the same tycoon game.
Sections (H2):
1. First impression of the captain selection screen
2. Friction risks in the onboarding flow
3. Clarity of money / follower / time HUD
4. Clarity of the produce-content action
5. Clarity of the upgrade-boat path
6. Clarity of the start-voyage path
7. Top 7 micro-frictions to fix
8. 5 lowest-risk CSS-only quick wins
Output language: Turkish. Concrete, no generic advice.
'@

$P03 = @'
Define guide-character ("Mico" - the boat dog) intervention points for the same game.
Sections (H2):
1. When Mico should speak (events, thresholds)
2. When Mico should stay silent
3. Tone of voice rules (short, warm, concrete)
4. 10 example one-liners covering: first content, first sponsor, first voyage, first upgrade, first arrival, low money, idle player, repeated failure, milestone, end of session
5. Anti-patterns to avoid
Output language: Turkish.
'@

$P04 = @'
Write a CTA / button weakness audit for the same React tycoon game.
Sections (H2):
1. Primary CTA discoverability risks
2. Secondary CTA confusion risks
3. Disabled state communication risks
4. Loading state on CTAs
5. Destructive action confirmation gaps
6. Mobile thumb-zone analysis (bottom 30% of screen)
7. Top 8 CSS-only CTA improvements
Output language: Turkish.
'@

$P05 = @'
Produce a short list of LOW-RISK CSS-only patch candidates for the same game.
Constraints: each candidate must be implementable in pure CSS only, must NOT use position: fixed, @import, url(), !important.
For each candidate provide:
- Title
- Target UI area (onboarding / captain selection / hub card / route CTA / arrival text)
- Problem it solves
- CSS approach (no actual code, just description)
- Risk level (must be LOW)
- Why it cannot break save/load or game logic
Provide exactly 5 candidates, one per section. Output language: Turkish.
'@

# --- CSS patch prompts (Aider) ---
function CssPrompt {
    param([string]$Area, [string]$Goal)
    @"
Generate a low-risk, mobile-first CSS patch for the "$Area" area of the game.
Goal: $Goal
Constraints:
- Use class selectors only. Do not assume specific class names exist; use generic, additive helper classes like .a9r-onboarding, .a9r-cta, .a9r-card, .a9r-hint, etc.
- Pure CSS only. No @import, no url(), no position: fixed, no !important.
- Mobile-first. Use min-width media queries for larger screens.
- Minimum 30 lines of useful CSS between the START and END markers.
- Include: typography tuning, spacing, tap target sizing (>= 44px), focus-visible states, prefers-reduced-motion fallbacks where animations are added.
Keep the marker lines intact. Replace ONLY the placeholder line between them.
"@
}

$P06 = CssPrompt 'onboarding' 'Make the first-time onboarding screen calmer, more readable on mobile, with clearer hierarchy and larger tap targets.'
$P07 = CssPrompt 'captain selection' 'Improve the captain selection card grid for mobile: better card spacing, clearer selected state, larger tap targets.'
$P08 = CssPrompt 'hub card' 'Improve the main hub card components: better contrast, clearer headings, comfortable spacing on small screens.'
$P09 = CssPrompt 'route CTA' 'Improve the "start voyage" route CTA: more prominent primary action, clearer disabled/loading states, thumb-friendly placement helpers.'
$P10 = CssPrompt 'arrival text' 'Improve the arrival / port-reached text screen: better line-height, max-width for readability, calmer reveal styling.'

# --- Final reports (Aider) ---
$P16 = @'
Write a "changed files report" plan for this autonomous run.
You CANNOT see the actual diff. Instead describe:
1. Which paths were expected to change (App.css, docs/agent/*, docs/agent/patches/*, progress.md, errors_log.md)
2. Why each change category is safe
3. How a reviewer should diff src/App.css (look for A9R_*_PATCH START markers)
4. Manual sanity-check steps
Output language: Turkish.
'@

$P17 = @'
Write a manual test checklist for the changes applied in this run.
Sections (H2):
1. Smoke (app launches, no console errors)
2. Onboarding flow on mobile viewport (375x667)
3. Captain selection
4. Hub / main screen
5. Produce content path
6. Sponsor accept path
7. Start voyage path
8. Arrival path
9. Save/load round-trip (critical - must not break)
10. AutoSave
Each item: one line of what to do, one line of expected result.
Output language: Turkish.
'@

$P18 = @'
Write a risk + rollback plan.
Sections (H2):
1. Risk register (likelihood / impact / mitigation) for: visual regression, performance hit, mobile-only breakage, save format change
2. Rollback procedure step-by-step for src/App.css (locate A9R markers, delete sections, retest)
3. Rollback procedure for docs-only changes
4. Decision matrix: when to keep, when to revert, when to partially revert
Output language: Turkish.
'@

$P19 = @'
Propose the NEXT 10 tasks for the next agent run, building on this one.
Constraints:
- All must be CSS-only or docs-only (no src/App.tsx, no package.json edits)
- Each task one paragraph: title, target area, hypothesis, expected output file name (A9S_NN_*.md or .css)
- Order by priority for mobile ergonomics
Output language: Turkish.
'@

$P20Body = @'
Write the FINAL autonomous run summary report.
Sections (H2):
1. Run goal (briefly recap A9R)
2. Architectural decisions enforced (1 task = 1 Aider call, script-side patch apply, script-side build, no auto commit)
3. Known limitations of this run (no source code visibility, CSS-only scope)
4. What a human reviewer should check first (priority order)
5. Next agent-run recommendations (high level, link to A9R_19)
Output language: Turkish.
NOTE: Do not include task pass/fail status here - the script appends that section separately.
'@

# --- Build task list ---
$tasks = @()

$tasks += New-AiderTask  '01' 'Mobile UI risk audit'           $P01 (Join-Path $DocsDir 'A9R_01_MOBILE_UI_RISK_AUDIT.md')      'md'
$tasks += New-AiderTask  '02' 'First 10 minutes review'        $P02 (Join-Path $DocsDir 'A9R_02_FIRST_10_MINUTES_REVIEW.md')   'md'
$tasks += New-AiderTask  '03' 'Mico guide points'              $P03 (Join-Path $DocsDir 'A9R_03_MICO_GUIDE_POINTS.md')         'md'
$tasks += New-AiderTask  '04' 'CTA weakness audit'             $P04 (Join-Path $DocsDir 'A9R_04_CTA_WEAKNESS_AUDIT.md')        'md'
$tasks += New-AiderTask  '05' 'Patch candidates'               $P05 (Join-Path $DocsDir 'A9R_05_PATCH_CANDIDATES.md')          'md'

$tasks += New-AiderTask  '06' 'Onboarding patch'        $P06 (Join-Path $PatchesDir 'A9R_06_ONBOARDING_PATCH.css')        'css'
$tasks += New-AiderTask  '07' 'Captain selection patch' $P07 (Join-Path $PatchesDir 'A9R_07_CAPTAIN_SELECTION_PATCH.css') 'css'
$tasks += New-AiderTask  '08' 'Hub card patch'          $P08 (Join-Path $PatchesDir 'A9R_08_HUB_CARD_PATCH.css')          'css'
$tasks += New-AiderTask  '09' 'Route CTA patch'         $P09 (Join-Path $PatchesDir 'A9R_09_ROUTE_CTA_PATCH.css')         'css'
$tasks += New-AiderTask  '10' 'Arrival text patch'      $P10 (Join-Path $PatchesDir 'A9R_10_ARRIVAL_TEXT_PATCH.css')      'css'

# Script-only tasks 11..15
$tasks += New-ScriptTask '11' 'Patch marker validation' {
    $report = New-Object System.Text.StringBuilder
    [void]$report.AppendLine('# A9R_11 Patch marker validation report')
    [void]$report.AppendLine('')
    $allOk = $true
    foreach ($patchId in '06','07','08','09','10') {
        $name = switch ($patchId) {
            '06' { 'A9R_06_ONBOARDING_PATCH.css' }
            '07' { 'A9R_07_CAPTAIN_SELECTION_PATCH.css' }
            '08' { 'A9R_08_HUB_CARD_PATCH.css' }
            '09' { 'A9R_09_ROUTE_CTA_PATCH.css' }
            '10' { 'A9R_10_ARRIVAL_TEXT_PATCH.css' }
        }
        $abs = Join-Path $PatchesDir $name
        $res = Test-PatchFile -PatchPath $abs -TaskId "A9R_$patchId"
        if ($res.Ok) {
            [void]$report.AppendLine("- OK   A9R_$patchId  $name")
        } else {
            [void]$report.AppendLine("- FAIL A9R_$patchId  $name  ($($res.Reason))")
            $allOk = $false
        }
    }
    Write-Utf8File -Path (Join-Path $DocsDir 'A9R_11_PATCH_MARKER_REPORT.md') -Content $report.ToString()
    return $allOk
} (Join-Path $DocsDir 'A9R_11_PATCH_MARKER_REPORT.md') 100

$tasks += New-ScriptTask '12' 'Append patches to App.css' {
    $report = New-Object System.Text.StringBuilder
    [void]$report.AppendLine('# A9R_12 Patch apply report')
    [void]$report.AppendLine('')
    foreach ($patchId in '06','07','08','09','10') {
        $name = switch ($patchId) {
            '06' { 'A9R_06_ONBOARDING_PATCH.css' }
            '07' { 'A9R_07_CAPTAIN_SELECTION_PATCH.css' }
            '08' { 'A9R_08_HUB_CARD_PATCH.css' }
            '09' { 'A9R_09_ROUTE_CTA_PATCH.css' }
            '10' { 'A9R_10_ARRIVAL_TEXT_PATCH.css' }
        }
        $abs = Join-Path $PatchesDir $name
        # gate again
        $chk = Test-PatchFile -PatchPath $abs -TaskId "A9R_$patchId"
        if (-not $chk.Ok) {
            [void]$report.AppendLine("- SKIP A9R_$patchId  $name  ($($chk.Reason))")
            continue
        }
        $r = Append-PatchIfMissing -PatchPath $abs -TaskId "A9R_$patchId"
        [void]$report.AppendLine("- $($r.Reason): A9R_$patchId  $name")
    }
    Write-Utf8File -Path (Join-Path $DocsDir 'A9R_12_PATCH_APPLY_REPORT.md') -Content $report.ToString()
    return $true
} (Join-Path $DocsDir 'A9R_12_PATCH_APPLY_REPORT.md') 100

$tasks += New-ScriptTask '13' 'Allowed change validation' {
    $bad = Get-ForbiddenChanges
    $sb = New-Object System.Text.StringBuilder
    [void]$sb.AppendLine('# A9R_13 Allowed change validation report')
    [void]$sb.AppendLine('')
    if ($bad.Count -eq 0) {
        [void]$sb.AppendLine('- OK: all working-tree changes are within the allow-list.')
        Write-Utf8File -Path (Join-Path $DocsDir 'A9R_13_ALLOWED_CHANGE_REPORT.md') -Content $sb.ToString()
        return $true
    }
    [void]$sb.AppendLine('- HARD STOP: forbidden file changes detected:')
    foreach ($f in $bad) { [void]$sb.AppendLine("  - $f") }
    Write-Utf8File -Path (Join-Path $DocsDir 'A9R_13_ALLOWED_CHANGE_REPORT.md') -Content $sb.ToString()
    $script:HardStop = $true
    $script:HardStopReason = "Forbidden file changes: $($bad -join ', ')"
    return $false
} (Join-Path $DocsDir 'A9R_13_ALLOWED_CHANGE_REPORT.md') 50

$tasks += New-ScriptTask '14' 'npm run build' {
    $b = Invoke-NpmBuild
    if (-not $b.Ok) {
        $script:HardStop = $true
        $script:HardStopReason = "Build failed (exit=$($b.Exit)). See $($b.Err)"
        return $false
    }
    return $true
} $null 0

$tasks += New-ScriptTask '15' 'Build report' {
    $latestOut = Get-ChildItem -LiteralPath $LogDir -Filter "${RunId}-build-*.out" -ErrorAction SilentlyContinue |
                 Sort-Object LastWriteTime -Descending | Select-Object -First 1
    $latestErr = Get-ChildItem -LiteralPath $LogDir -Filter "${RunId}-build-*.err" -ErrorAction SilentlyContinue |
                 Sort-Object LastWriteTime -Descending | Select-Object -First 1
    $sb = New-Object System.Text.StringBuilder
    [void]$sb.AppendLine('# A9R_15 Build report')
    [void]$sb.AppendLine('')
    [void]$sb.AppendLine("- Build stdout log: $($latestOut.FullName)")
    [void]$sb.AppendLine("- Build stderr log: $($latestErr.FullName)")
    if ($latestOut) {
        $tail = Get-Content -LiteralPath $latestOut.FullName -Tail 40 -ErrorAction SilentlyContinue
        [void]$sb.AppendLine('')
        [void]$sb.AppendLine('## Tail of stdout')
        [void]$sb.AppendLine('```')
        foreach ($l in $tail) { [void]$sb.AppendLine($l) }
        [void]$sb.AppendLine('```')
    }
    if ($latestErr -and ($latestErr.Length -gt 0)) {
        $etail = Get-Content -LiteralPath $latestErr.FullName -Tail 40 -ErrorAction SilentlyContinue
        [void]$sb.AppendLine('')
        [void]$sb.AppendLine('## Tail of stderr')
        [void]$sb.AppendLine('```')
        foreach ($l in $etail) { [void]$sb.AppendLine($l) }
        [void]$sb.AppendLine('```')
    }
    Write-Utf8File -Path (Join-Path $DocsDir 'A9R_15_BUILD_REPORT.md') -Content $sb.ToString()
    return $true
} (Join-Path $DocsDir 'A9R_15_BUILD_REPORT.md') 100

# Aider tasks 16..20
$tasks += New-AiderTask '16' 'Changed files report'     $P16     (Join-Path $DocsDir 'A9R_16_CHANGED_FILES_REPORT.md')   'md'
$tasks += New-AiderTask '17' 'Manual test checklist'    $P17     (Join-Path $DocsDir 'A9R_17_MANUAL_TEST_CHECKLIST.md')  'md'
$tasks += New-AiderTask '18' 'Risk rollback plan'       $P18     (Join-Path $DocsDir 'A9R_18_RISK_ROLLBACK_PLAN.md')     'md'
$tasks += New-AiderTask '19' 'Next 10 tasks'            $P19     (Join-Path $DocsDir 'A9R_19_NEXT_10_TASKS.md')          'md'
$tasks += New-AiderTask '20' 'Final summary'            $P20Body (Join-Path $DocsDir 'A9R_FINAL_AUTONOMOUS_REPORT.md')   'md'

# ============================================================
# FINAL REPORT (always tried)
# ============================================================
function Write-FinalAggregateReport {
    $path = Join-Path $DocsDir 'A9R_FINAL_AUTONOMOUS_REPORT.md'

    # If task 20 wrote a body, keep it. Append script-side aggregate section.
    $body = ''
    if (Test-Path $path) {
        $body = Get-Content -LiteralPath $path -Raw -Encoding utf8
    } else {
        $body = "# A9R Final Autonomous Report`r`n`r`n_(Task 20 did not run.)_`r`n"
    }

    $sb = New-Object System.Text.StringBuilder
    [void]$sb.AppendLine('')
    [void]$sb.AppendLine('---')
    [void]$sb.AppendLine('')
    [void]$sb.AppendLine('## Script-side aggregate (auto-appended)')
    [void]$sb.AppendLine("- Run ID: $RunId-$Stamp")
    [void]$sb.AppendLine("- Finished: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')")
    [void]$sb.AppendLine("- Branch: $(git -C $RepoPath rev-parse --abbrev-ref HEAD 2>$null)")
    [void]$sb.AppendLine("- Hard stop: $HardStop")
    if ($HardStop) { [void]$sb.AppendLine("- Hard stop reason: $HardStopReason") }
    [void]$sb.AppendLine('')
    [void]$sb.AppendLine('### Task results')
    [void]$sb.AppendLine('')
    foreach ($t in $Successes) { [void]$sb.AppendLine("- OK   $t") }
    foreach ($t in $Failures)  { [void]$sb.AppendLine("- FAIL $t") }
    [void]$sb.AppendLine('')
    [void]$sb.AppendLine('### Working tree (git status)')
    $changed = Get-ChangedFiles
    if ($changed.Count -eq 0) {
        [void]$sb.AppendLine('- (clean)')
    } else {
        foreach ($f in $changed) { [void]$sb.AppendLine("- $f") }
    }
    [void]$sb.AppendLine('')
    [void]$sb.AppendLine('### Logs')
    [void]$sb.AppendLine("- Run log: $RunLog")

    Write-Utf8File -Path $path -Content ($body + $sb.ToString())
    Write-AgentLog "FINAL REPORT -> $(To-RepoRel $path)"
}

# ============================================================
# MAIN LOOP
# ============================================================
try {
    Set-Location $RepoPath
    New-Item -ItemType Directory -Force -Path $LogDir, $DocsDir, $TasksDir, $PatchesDir | Out-Null

    Write-AgentLog "========== $RunId START =========="
    Write-AgentLog "RepoPath:   $RepoPath"
    Write-AgentLog "Model:      $AiderModel"
    Write-AgentLog "RunLog:     $RunLog"

    # Sanity checks
    if (-not (Test-Path (Join-Path $RepoPath '.git'))) {
        throw "Not a git repo: $RepoPath"
    }
    $currentBranch = (git -C $RepoPath rev-parse --abbrev-ref HEAD 2>$null).Trim()
    Write-AgentLog "Current branch: $currentBranch"
    if ($currentBranch -ne $AgentBranch) {
        Write-AgentLog "WARNING current branch is not '$AgentBranch'. Continuing anyway." 'WARN'
    }

    # Pre-run dirty-tree warning (informational; we don't fail)
    $preDirty = Get-ChangedFiles
    if ($preDirty.Count -gt 0) {
        Write-AgentLog "Working tree not clean at start ($($preDirty.Count) files). Proceeding." 'WARN'
    }

    foreach ($task in $tasks) {
        if ($HardStop) {
            Write-AgentLog "SKIP $($task.Id) due to hard stop: $HardStopReason" 'WARN'
            [void]$Failures.Add("$($task.Id) [SKIPPED: hard stop]")
            Append-Progress $task.Id 'SKIP' $HardStopReason
            continue
        }

        Write-AgentLog "----- TASK $($task.Id) : $($task.Title) -----"

        $taskOk = $true
        $taskReason = ''

        if ($task.Type -eq 'aider') {
            # Skip-if-valid: idempotent rerun. If the output already exists and meets MinBytes,
            # do NOT call Aider again. Saves ~2-6 min per task on partial reruns.
            if ((Test-Path $task.Output) -and (Test-RequiredOutput -Path $task.Output -MinBytes $task.MinBytes)) {
                Write-AgentLog "TASK $($task.Id) SKIP-AIDER : output already valid ($(To-RepoRel $task.Output))"
            }
            else {
                $aiderOk = Invoke-AiderTask -TaskId $task.Id -Prompt (Build-AiderPrompt -OutputRel (To-RepoRel $task.Output) -Body $task.Body -Kind $task.Kind -TaskId "A9R_$($task.Id)") -OutputAbs $task.Output -Kind $task.Kind
                if (-not $aiderOk) {
                    $taskOk = $false; $taskReason = 'Aider exited non-zero or timed out'
                }
                elseif (-not (Test-RequiredOutput -Path $task.Output -MinBytes $task.MinBytes)) {
                    $taskOk = $false; $taskReason = "Required output missing or below $($task.MinBytes) bytes"
                }
            }
        }
        elseif ($task.Type -eq 'script') {
            try {
                $r = & $task.Action
                if ($r -eq $false) { $taskOk = $false; $taskReason = 'Script step returned false' }
            } catch {
                $taskOk = $false; $taskReason = "Script step threw: $_"
            }
            if ($taskOk -and $task.Output) {
                if (-not (Test-RequiredOutput -Path $task.Output -MinBytes $task.MinBytes)) {
                    $taskOk = $false; $taskReason = "Required output missing or below $($task.MinBytes) bytes"
                }
            }
        }

        # Allow-list gate (after EVERY task)
        $bad = Get-ForbiddenChanges
        if ($bad.Count -gt 0) {
            $taskOk = $false
            $taskReason = "Forbidden file changes after task: $($bad -join ', ')"
            $HardStop = $true
            $HardStopReason = $taskReason
        }

        if ($taskOk) {
            [void]$Successes.Add("$($task.Id) $($task.Title)")
            Append-Progress $task.Id 'OK' $task.Title
            Write-AgentLog "TASK $($task.Id) OK"
        } else {
            [void]$Failures.Add("$($task.Id) $($task.Title) :: $taskReason")
            Append-Progress $task.Id 'FAIL' $taskReason
            Append-ErrorsLog $task.Id $taskReason
            Write-AgentLog "TASK $($task.Id) FAIL :: $taskReason" 'ERROR'
        }
    }
}
catch {
    Write-AgentLog "FATAL: $_" 'ERROR'
    $HardStop = $true
    $HardStopReason = "Fatal: $_"
}
finally {
    try { Write-FinalAggregateReport } catch { Write-AgentLog "Final report write failed: $_" 'ERROR' }
    Write-AgentLog "========== $RunId END =========="
    Write-AgentLog "Successes: $($Successes.Count)  Failures: $($Failures.Count)  HardStop: $HardStop"
}
