$ErrorActionPreference = "Stop"

$RepoPath = "C:\dev\yelkenli-yasam-tycoon"
$LogDir = "logs\agent"
Set-Location $RepoPath

if (-not (Test-Path $LogDir)) {
    New-Item -ItemType Directory -Force $LogDir | Out-Null
}

$RunStamp = Get-Date -Format "yyyyMMdd-HHmmss"
$RunLog = Join-Path $LogDir "agent-a8-autonomous-$RunStamp.log"

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
        "^docs/agent/A8_UI_SAFETY_PATCH\.css$",
        "^docs/agent/A8_AUTONOMOUS_RUN_REPORT\.md$",
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
    param([string]$Path, [string]$TaskName)

    if (-not (Test-Path $Path)) {
        Write-AgentLog "REQUIRED OUTPUT MISSING: $Path"
        throw "Task failed: $TaskName"
    }

    $length = (Get-Item $Path).Length
    if ($length -lt 80) {
        Write-AgentLog "REQUIRED OUTPUT TOO SMALL OR EMPTY: $Path ($length bytes)"
        throw "Task failed: $TaskName"
    }
}

Write-AgentLog "=== Agent Batch A8 autonomous run started ==="

$branch = git branch --show-current
Write-AgentLog "Current branch: $branch"

$status = git status --porcelain
if ($status) {
    Write-AgentLog "Working tree is not clean. Stopping."
    git status | Out-String | Add-Content -Encoding UTF8 -Path $RunLog
    exit 1
}

$PatchFile = "docs/agent/A8_UI_SAFETY_PATCH.css"
$ReportFile = "docs/agent/A8_AUTONOMOUS_RUN_REPORT.md"
$AppCss = "src/App.css"
$Marker = "/* A8 autonomous mobile UI safety patch */"

New-Item -ItemType File -Force $PatchFile | Out-Null
New-Item -ItemType File -Force $ReportFile | Out-Null

$AiderArgs = @(
    "--model", "ollama_chat/qwen2.5-coder:7b",
    "--no-auto-commits",
    "--map-tokens", "0",
    "--disable-playwright",
    "--message-file", "docs/agent/tasks/PACKET_A8_AUTONOMOUS_UI_PATCH.md",
    "--file", $PatchFile,
    "--file", $ReportFile,
    "--file", "progress.md",
    "--file", "errors_log.md"
)

& aider @AiderArgs

Write-AgentLog "Aider finished A8 patch generation"

Test-RequiredOutput -Path $PatchFile -TaskName "A8 CSS Patch"
Test-RequiredOutput -Path $ReportFile -TaskName "A8 Report"

$patch = Get-Content $PatchFile -Raw

if ($patch -notmatch [regex]::Escape($Marker)) {
    Write-AgentLog "PATCH MARKER MISSING"
    throw "Patch marker missing: $Marker"
}

if ($patch -match "@import|url\(|position:\s*fixed|!important") {
    Write-AgentLog "PATCH CONTAINS DISALLOWED CSS PATTERN"
    throw "Patch contains disallowed CSS pattern"
}

$appCssContent = Get-Content $AppCss -Raw

if ($appCssContent -match [regex]::Escape($Marker)) {
    Write-AgentLog "Patch marker already exists in src/App.css. Skipping append."
}
else {
    Write-AgentLog "Appending A8 patch to src/App.css"
    Add-Content -Encoding UTF8 $AppCss ""
    Add-Content -Encoding UTF8 $AppCss $patch
}

Test-AllowedChangesOnly

Write-AgentLog "Running npm run build"
npm run build | Tee-Object -FilePath $RunLog -Append

Write-AgentLog "Build completed"
Test-AllowedChangesOnly

Write-AgentLog "=== Agent Batch A8 autonomous run completed ==="
git status | Out-String | Add-Content -Encoding UTF8 -Path $RunLog
git status