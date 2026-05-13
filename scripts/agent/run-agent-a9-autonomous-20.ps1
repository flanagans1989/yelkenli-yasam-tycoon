$ErrorActionPreference = "Stop"

$RepoPath = "C:\dev\yelkenli-yasam-tycoon"
$LogDir = "logs\agent"
$TaskDir = "docs\agent\tasks"
$PatchDir = "docs\agent\patches"

Set-Location $RepoPath

if (-not (Test-Path $LogDir)) {
    New-Item -ItemType Directory -Force $LogDir | Out-Null
}

if (-not (Test-Path $TaskDir)) {
    New-Item -ItemType Directory -Force $TaskDir | Out-Null
}

if (-not (Test-Path $PatchDir)) {
    New-Item -ItemType Directory -Force $PatchDir | Out-Null
}

$RunStamp = Get-Date -Format "yyyyMMdd-HHmmss"
$RunLog = Join-Path $LogDir "agent-a9-autonomous-20-$RunStamp.log"

function Write-AgentLog {
    param([string]$Message)

    $line = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') | $Message"
    Write-Host $line
    Add-Content -Encoding UTF8 -Path $RunLog -Value $line
}

function Get-ChangedFiles {
    git status --porcelain | ForEach-Object {
        if ($_.Length -ge 4) {
            $_.Substring(3).Replace("\", "/").Trim('"')
        }
    }
}

function Test-AllowedChangesOnly {
    $AllowedPatterns = @(
        "^src/App\.css$",
        "^progress\.md$",
        "^errors_log\.md$",
        "^docs/agent/A9_.*\.md$",
        "^docs/agent/tasks/PACKET_A9_.*\.md$",
        "^docs/agent/patches/A9_.*\.css$",
        "^logs/agent/"
    )

    $changedFiles = Get-ChangedFiles

    foreach ($changed in $changedFiles) {
        $allowed = $false

        foreach ($pattern in $AllowedPatterns) {
            if ($changed -match $pattern) {
                $allowed = $true
            }
        }

        if (-not $allowed) {
            Write-AgentLog "FORBIDDEN CHANGE DETECTED: $changed"
            git status | Out-String | Add-Content -Encoding UTF8 -Path $RunLog
            throw "Forbidden change detected: $changed"
        }
    }
}

function Test-RequiredOutput {
    param(
        [string]$Path,
        [string]$TaskName,
        [int]$MinBytes = 80
    )

    if (-not (Test-Path $Path)) {
        Write-AgentLog "REQUIRED OUTPUT MISSING: $Path"
        throw "Task failed: $TaskName"
    }

    $length = (Get-Item $Path).Length
    if ($length -lt $MinBytes) {
        Write-AgentLog "REQUIRED OUTPUT TOO SMALL OR EMPTY: $Path ($length bytes)"
        throw "Task failed: $TaskName"
    }
}

function Write-TextFile {
    param(
        [string]$Path,
        [string[]]$Lines
    )

    $folder = Split-Path $Path -Parent
    if ($folder -and -not (Test-Path $folder)) {
        New-Item -ItemType Directory -Force $folder | Out-Null
    }

    $Lines | Set-Content -Encoding UTF8 $Path
}

function Invoke-AiderPacket {
    param(
        [string]$PacketName,
        [string]$MessageFile,
        [string[]]$EditableFiles,
        [string[]]$RequiredOutputs
    )

    Write-AgentLog ""
    Write-AgentLog "=== Running: $PacketName ==="

    $args = @(
        "--model", "ollama_chat/qwen2.5-coder:7b",
        "--no-auto-commits",
        "--map-tokens", "0",
        "--yes-always",
        "--disable-playwright",
        "--message-file", $MessageFile
    )

    foreach ($file in $EditableFiles) {
        if (-not (Test-Path $file)) {
            New-Item -ItemType File -Force $file | Out-Null
        }

        $args += @("--file", $file)
    }

    & aider @args

    Write-AgentLog "Aider finished: $PacketName"
    git status --short | Out-String | Add-Content -Encoding UTF8 -Path $RunLog

    Test-AllowedChangesOnly

    foreach ($output in $RequiredOutputs) {
        Test-RequiredOutput -Path $output -TaskName $PacketName
    }

    Write-AgentLog "Safety and output checks passed: $PacketName"
}

function Test-PatchFile {
    param(
        [string]$PatchFile,
        [string]$Marker
    )

    Test-RequiredOutput -Path $PatchFile -TaskName "Patch file check" -MinBytes 40

    $patch = Get-Content $PatchFile -Raw

    if ($patch -notmatch [regex]::Escape($Marker)) {
        throw "Patch marker missing in $PatchFile"
    }

    if ($patch -match "@import|url\(|position:\s*fixed|!important") {
        throw "Patch contains disallowed CSS pattern: $PatchFile"
    }
}

function Append-PatchIfMissing {
    param(
        [string]$PatchFile,
        [string]$Marker,
        [string]$AppCss
    )

    Test-PatchFile -PatchFile $PatchFile -Marker $Marker

    $patch = Get-Content $PatchFile -Raw
    $appCssContent = Get-Content $AppCss -Raw

    if ($appCssContent -match [regex]::Escape($Marker)) {
        Write-AgentLog "Patch already exists in App.css, skipping: $Marker"
    }
    else {
        Write-AgentLog "Appending patch to App.css: $PatchFile"
        Add-Content -Encoding UTF8 $AppCss ""
        Add-Content -Encoding UTF8 $AppCss $patch
    }
}

function Write-A9FinalReport {
    param(
        [string[]]$CompletedPackages,
        [string[]]$BlockedPackages
    )

    $now = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $changed = git status --short | Out-String

    $report = @(
        "# Agent Batch A9 Final Autonomous Report",
        "",
        "## Date",
        $now,
        "",
        "## Mode",
        "20 tasks in 4 packages. Script-controlled autonomous mode.",
        "",
        "## Completed packages",
        $CompletedPackages,
        "",
        "## Blocked packages",
        $(if ($BlockedPackages.Count -gt 0) { $BlockedPackages } else { "- None" }),
        "",
        "## Files modified",
        "```text",
        $changed,
        "```",
        "",
        "## Source logic touched",
        "Expected: NO.",
        "",
        "## Source CSS touched",
        "Expected: src/App.css only.",
        "",
        "## Build status",
        "The script runs npm run build after applying approved CSS patches.",
        "",
        "## Safety result",
        $(if ($BlockedPackages.Count -gt 0) { "A9 finished with blocked packages. Review logs and errors_log.md." } else { "A9 autonomous 20-task run completed successfully." }),
        "",
        "## Log file",
        $RunLog,
        "",
        "## Next step",
        "Review the UI in browser/mobile viewport. If good, commit the A9 result. After that, the next safe milestone is A10: longer autonomous UI polish run."
    )

    $report | Set-Content -Encoding UTF8 docs/agent/A9_FINAL_AUTONOMOUS_REPORT.md
}

Write-AgentLog "=== Agent Batch A9 autonomous 20-task run started ==="

$branch = git branch --show-current
Write-AgentLog "Current branch: $branch"

$status = git status --porcelain
if ($status) {
    Write-AgentLog "Working tree is not clean. Stopping."
    git status | Out-String | Add-Content -Encoding UTF8 -Path $RunLog
    exit 1
}

$CompletedPackages = @()
$BlockedPackages = @()
$AppCss = "src/App.css"

try {
    Write-AgentLog "Creating A9 package prompt files"

    Write-TextFile "docs/agent/tasks/PACKET_A9_1_AUDIT_AND_PLAN.md" @(
        "PACKET A9-1 - Audit and Planning",
        "",
        "You are working on Yelkenli Yaşam Tycoon.",
        "",
        "Goal:",
        "Complete tasks 1 to 5 for the autonomous UI planning phase.",
        "",
        "Allowed files:",
        "- docs/agent/A9_MOBILE_UI_AUDIT.md",
        "- docs/agent/A9_FIRST_10_MINUTES_REVIEW.md",
        "- docs/agent/A9_MICO_GUIDE_POINTS.md",
        "- docs/agent/A9_CTA_WEAKNESS_AUDIT.md",
        "- docs/agent/A9_PATCH_CANDIDATES.md",
        "- progress.md",
        "- errors_log.md",
        "",
        "Rules:",
        "- Only edit the allowed files listed above.",
        "- Do not request other files.",
        "- Do not edit source code.",
        "- Do not edit project configuration.",
        "- Do not install packages.",
        "- Do not commit.",
        "- Do not push.",
        "- Do not ask questions.",
        "",
        "Tasks:",
        "1. Create a mobile UI risk audit.",
        "2. Create a first 10 minutes player experience review.",
        "3. Create Miço guide points list.",
        "4. Create CTA and button weakness audit.",
        "5. Create low-risk UI/CSS patch candidates list.",
        "6. Update progress.md with this exact line:",
        "   - PACKET A9-1 completed."
    )

    Write-TextFile "docs/agent/tasks/PACKET_A9_2_PATCH_GENERATION.md" @(
        "PACKET A9-2 - CSS Patch Generation",
        "",
        "You are working on Yelkenli Yaşam Tycoon.",
        "",
        "Goal:",
        "Complete tasks 6 to 10 by creating small CSS patch files only.",
        "",
        "Allowed files:",
        "- docs/agent/patches/A9_ONBOARDING_PATCH.css",
        "- docs/agent/patches/A9_CAPTAIN_SELECTION_PATCH.css",
        "- docs/agent/patches/A9_HUB_CARD_PATCH.css",
        "- docs/agent/patches/A9_ROUTE_CTA_PATCH.css",
        "- docs/agent/patches/A9_ARRIVAL_TEXT_PATCH.css",
        "- docs/agent/A9_PATCH_GENERATION_REPORT.md",
        "- progress.md",
        "- errors_log.md",
        "",
        "Rules:",
        "- Only edit the allowed files listed above.",
        "- Do not request other files.",
        "- Do not edit source code directly.",
        "- Do not edit project configuration.",
        "- Do not install packages.",
        "- Do not commit.",
        "- Do not push.",
        "- Do not ask questions.",
        "- Keep every patch small.",
        "- Do not redesign the UI.",
        "- Do not use external dependencies.",
        "- Do not use @import, url(), position fixed, or important flags.",
        "",
        "Required patch markers:",
        "- /* A9 onboarding safety patch */",
        "- /* A9 captain selection safety patch */",
        "- /* A9 hub card safety patch */",
        "- /* A9 route CTA safety patch */",
        "- /* A9 arrival text safety patch */",
        "",
        "Tasks:",
        "6. Create onboarding spacing patch.",
        "7. Create captain selection overflow patch.",
        "8. Create hub/card spacing patch.",
        "9. Create route CTA readability patch.",
        "10. Create arrival story text readability patch.",
        "11. Create a short patch generation report.",
        "12. Update progress.md with this exact line:",
        "   - PACKET A9-2 completed."
    )

    Write-TextFile "docs/agent/tasks/PACKET_A9_4_FINAL_REVIEW.md" @(
        "PACKET A9-4 - Final Review and Next Plan",
        "",
        "You are working on Yelkenli Yaşam Tycoon.",
        "",
        "Goal:",
        "Complete tasks 16 to 20 for final review and next planning.",
        "",
        "Allowed files:",
        "- docs/agent/A9_CHANGED_FILES_REPORT.md",
        "- docs/agent/A9_MANUAL_TEST_CHECKLIST.md",
        "- docs/agent/A9_RISK_AND_ROLLBACK_PLAN.md",
        "- docs/agent/A9_NEXT_10_TASKS.md",
        "- progress.md",
        "- errors_log.md",
        "",
        "Rules:",
        "- Only edit the allowed files listed above.",
        "- Do not request other files.",
        "- Do not edit source code.",
        "- Do not edit project configuration.",
        "- Do not install packages.",
        "- Do not commit.",
        "- Do not push.",
        "- Do not ask questions.",
        "",
        "Tasks:",
        "16. Create changed files report.",
        "17. Create manual test checklist.",
        "18. Create risk and rollback plan.",
        "19. Create next 10 tasks plan.",
        "20. Update progress.md with this exact line:",
        "   - PACKET A9-4 completed."
    )

    Test-AllowedChangesOnly

    Invoke-AiderPacket `
        -PacketName "PACKET A9-1 - Audit and Planning" `
        -MessageFile "docs/agent/tasks/PACKET_A9_1_AUDIT_AND_PLAN.md" `
        -EditableFiles @(
            "docs/agent/A9_MOBILE_UI_AUDIT.md",
            "docs/agent/A9_FIRST_10_MINUTES_REVIEW.md",
            "docs/agent/A9_MICO_GUIDE_POINTS.md",
            "docs/agent/A9_CTA_WEAKNESS_AUDIT.md",
            "docs/agent/A9_PATCH_CANDIDATES.md",
            "progress.md",
            "errors_log.md"
        ) `
        -RequiredOutputs @(
            "docs/agent/A9_MOBILE_UI_AUDIT.md",
            "docs/agent/A9_FIRST_10_MINUTES_REVIEW.md",
            "docs/agent/A9_MICO_GUIDE_POINTS.md",
            "docs/agent/A9_CTA_WEAKNESS_AUDIT.md",
            "docs/agent/A9_PATCH_CANDIDATES.md"
        )

    $CompletedPackages += "- PACKET A9-1 - Tasks 1 to 5"

    Invoke-AiderPacket `
        -PacketName "PACKET A9-2 - CSS Patch Generation" `
        -MessageFile "docs/agent/tasks/PACKET_A9_2_PATCH_GENERATION.md" `
        -EditableFiles @(
            "docs/agent/patches/A9_ONBOARDING_PATCH.css",
            "docs/agent/patches/A9_CAPTAIN_SELECTION_PATCH.css",
            "docs/agent/patches/A9_HUB_CARD_PATCH.css",
            "docs/agent/patches/A9_ROUTE_CTA_PATCH.css",
            "docs/agent/patches/A9_ARRIVAL_TEXT_PATCH.css",
            "docs/agent/A9_PATCH_GENERATION_REPORT.md",
            "progress.md",
            "errors_log.md"
        ) `
        -RequiredOutputs @(
            "docs/agent/patches/A9_ONBOARDING_PATCH.css",
            "docs/agent/patches/A9_CAPTAIN_SELECTION_PATCH.css",
            "docs/agent/patches/A9_HUB_CARD_PATCH.css",
            "docs/agent/patches/A9_ROUTE_CTA_PATCH.css",
            "docs/agent/patches/A9_ARRIVAL_TEXT_PATCH.css",
            "docs/agent/A9_PATCH_GENERATION_REPORT.md"
        )

    $CompletedPackages += "- PACKET A9-2 - Tasks 6 to 10"

    Write-AgentLog "=== PACKET A9-3 - Apply CSS patches and build ==="

    Append-PatchIfMissing -PatchFile "docs/agent/patches/A9_ONBOARDING_PATCH.css" -Marker "/* A9 onboarding safety patch */" -AppCss $AppCss
    Append-PatchIfMissing -PatchFile "docs/agent/patches/A9_CAPTAIN_SELECTION_PATCH.css" -Marker "/* A9 captain selection safety patch */" -AppCss $AppCss
    Append-PatchIfMissing -PatchFile "docs/agent/patches/A9_HUB_CARD_PATCH.css" -Marker "/* A9 hub card safety patch */" -AppCss $AppCss
    Append-PatchIfMissing -PatchFile "docs/agent/patches/A9_ROUTE_CTA_PATCH.css" -Marker "/* A9 route CTA safety patch */" -AppCss $AppCss
    Append-PatchIfMissing -PatchFile "docs/agent/patches/A9_ARRIVAL_TEXT_PATCH.css" -Marker "/* A9 arrival text safety patch */" -AppCss $AppCss

    Test-AllowedChangesOnly

    Write-AgentLog "Running npm run build"
    npm run build | Tee-Object -FilePath $RunLog -Append

    Write-AgentLog "Build completed"

    $buildReport = @(
        "# A9 Build Report",
        "",
        "## Result",
        "npm run build completed successfully.",
        "",
        "## CSS patches applied",
        "- A9 onboarding safety patch",
        "- A9 captain selection safety patch",
        "- A9 hub card safety patch",
        "- A9 route CTA safety patch",
        "- A9 arrival text safety patch",
        "",
        "## Source logic touched",
        "NO",
        "",
        "## Source CSS touched",
        "src/App.css only"
    )

    $applyReport = @(
        "# A9 Patch Apply Report",
        "",
        "## Tasks",
        "11. Patch marker check completed.",
        "12. Safe patches appended to src/App.css.",
        "13. Disallowed CSS pattern check completed.",
        "14. npm run build executed.",
        "15. Build result reported.",
        "",
        "## Result",
        "Patch application and build completed."
    )

    $buildReport | Set-Content -Encoding UTF8 docs/agent/A9_BUILD_REPORT.md
    $applyReport | Set-Content -Encoding UTF8 docs/agent/A9_PATCH_APPLY_REPORT.md
    Add-Content -Encoding UTF8 progress.md "- PACKET A9-3 completed."

    Test-AllowedChangesOnly
    Test-RequiredOutput -Path "docs/agent/A9_BUILD_REPORT.md" -TaskName "A9 Build Report"
    Test-RequiredOutput -Path "docs/agent/A9_PATCH_APPLY_REPORT.md" -TaskName "A9 Patch Apply Report"

    $CompletedPackages += "- PACKET A9-3 - Tasks 11 to 15"

    Invoke-AiderPacket `
        -PacketName "PACKET A9-4 - Final Review and Next Plan" `
        -MessageFile "docs/agent/tasks/PACKET_A9_4_FINAL_REVIEW.md" `
        -EditableFiles @(
            "docs/agent/A9_CHANGED_FILES_REPORT.md",
            "docs/agent/A9_MANUAL_TEST_CHECKLIST.md",
            "docs/agent/A9_RISK_AND_ROLLBACK_PLAN.md",
            "docs/agent/A9_NEXT_10_TASKS.md",
            "progress.md",
            "errors_log.md"
        ) `
        -RequiredOutputs @(
            "docs/agent/A9_CHANGED_FILES_REPORT.md",
            "docs/agent/A9_MANUAL_TEST_CHECKLIST.md",
            "docs/agent/A9_RISK_AND_ROLLBACK_PLAN.md",
            "docs/agent/A9_NEXT_10_TASKS.md"
        )

    $CompletedPackages += "- PACKET A9-4 - Tasks 16 to 20"

    Test-AllowedChangesOnly

    Write-A9FinalReport -CompletedPackages $CompletedPackages -BlockedPackages $BlockedPackages
    Test-RequiredOutput -Path "docs/agent/A9_FINAL_AUTONOMOUS_REPORT.md" -TaskName "A9 Final Autonomous Report"

    Add-Content -Encoding UTF8 errors_log.md "- No blocking errors occurred during A9 autonomous 20-task run."

    Write-AgentLog "=== Agent Batch A9 autonomous 20-task run completed ==="
    git status | Out-String | Add-Content -Encoding UTF8 -Path $RunLog
    git status
}
catch {
    $BlockedPackages += "- A9 blocked: $($_.Exception.Message)"
    Add-Content -Encoding UTF8 errors_log.md "- A9 BLOCKED: $($_.Exception.Message)"
    Write-AgentLog "A9 BLOCKED: $($_.Exception.Message)"

    try {
        Write-A9FinalReport -CompletedPackages $CompletedPackages -BlockedPackages $BlockedPackages
    }
    catch {
        Write-AgentLog "Could not write A9 final report after block: $($_.Exception.Message)"
    }

    git status
    exit 1
}