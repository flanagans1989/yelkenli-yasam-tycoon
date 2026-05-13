$ErrorActionPreference = "Stop"

$RepoPath = "C:\dev\yelkenli-yasam-tycoon"
$LogDir = "logs\agent"
Set-Location $RepoPath

if (-not (Test-Path $LogDir)) {
    New-Item -ItemType Directory -Force $LogDir | Out-Null
}

$RunStamp = Get-Date -Format "yyyyMMdd-HHmmss"
$RunLog = Join-Path $LogDir "agent-a6r-css-$RunStamp.log"

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
        "^docs/agent/A6R_CSS_PATCH\.css$",
        "^docs/agent/A6R_TARGETED_CSS_TEST_REPORT\.md$",
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

Write-AgentLog "=== Agent Batch A6R targeted CSS patch started ==="

$branch = git branch --show-current
Write-AgentLog "Current branch: $branch"

$status = git status --porcelain
if ($status) {
    Write-AgentLog "Working tree is not clean. Stopping."
    git status | Out-String | Add-Content -Encoding UTF8 -Path $RunLog
    exit 1
}

$PatchFile = "docs/agent/A6R_CSS_PATCH.css"
$ReportFile = "docs/agent/A6R_TARGETED_CSS_TEST_REPORT.md"
$AppCss = "src/App.css"
$Marker = "/* A6R targeted mobile safety patch */"

if (-not (Test-Path $PatchFile)) {
    New-Item -ItemType File -Force $PatchFile | Out-Null
}

if (-not (Test-Path $ReportFile)) {
    New-Item -ItemType File -Force $ReportFile | Out-Null
}

$AiderArgs = @(
    "--model", "ollama_chat/qwen2.5-coder:7b",
    "--no-auto-commits",
    "--map-tokens", "0",
    "--disable-playwright",
    "--message-file", "docs/agent/tasks/PACKET_A6R_TARGETED_CSS_PATCH.md",
    "--file", $PatchFile,
    "--file", $ReportFile,
    "--file", "progress.md",
    "--file", "errors_log.md"
)

& aider @AiderArgs

Write-AgentLog "Aider finished A6R patch generation"
git status --short | Out-String | Add-Content -Encoding UTF8 -Path $RunLog

Test-RequiredOutput -Path $PatchFile -TaskName "A6R CSS Patch"
Test-RequiredOutput -Path $ReportFile -TaskName "A6R CSS Report"

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
    Write-AgentLog "Appending targeted CSS patch to src/App.css"
    Add-Content -Encoding UTF8 $AppCss ""
    Add-Content -Encoding UTF8 $AppCss $patch
}

Test-AllowedChangesOnly

Write-AgentLog "Running npm run build"
npm run build | Tee-Object -FilePath $RunLog -Append

Write-AgentLog "Build completed"
Test-AllowedChangesOnly

Write-AgentLog "=== Agent Batch A6R completed ==="
git status | Out-String | Add-Content -Encoding UTF8 -Path $RunLog
git status