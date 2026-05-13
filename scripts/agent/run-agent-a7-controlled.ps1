$ErrorActionPreference = "Stop"

$RepoPath = "C:\dev\yelkenli-yasam-tycoon"
$LogDir = "logs\agent"
Set-Location $RepoPath

if (-not (Test-Path $LogDir)) {
    New-Item -ItemType Directory -Force $LogDir | Out-Null
}

$RunStamp = Get-Date -Format "yyyyMMdd-HHmmss"
$RunLog = Join-Path $LogDir "agent-a7-controlled-$RunStamp.log"

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
        "^progress\.md$",
        "^errors_log\.md$",
        "^docs/agent/A7_POST_CSS_PATCH_AUDIT\.md$",
        "^docs/agent/A7_NEXT_LOW_RISK_UI_CANDIDATES\.md$",
        "^docs/agent/A7_FINAL_REPORT\.md$",
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
    if ($length -lt 100) {
        Write-AgentLog "REQUIRED OUTPUT TOO SMALL OR EMPTY: $Path ($length bytes)"
        throw "Task failed: $TaskName"
    }
}

function Write-A7FinalReport {
    param([string[]]$CompletedPackages, [string[]]$BlockedPackages)

    $now = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $changed = git status --short | Out-String

    $report = @(
        "# Agent Batch A7 Final Report",
        "",
        "## Date",
        $now,
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
        "## Source files modified",
        "Expected: NONE.",
        "",
        "## Build status",
        "Build not required because A7 is docs-only planning/audit.",
        "",
        "## Safety result",
        $(if ($BlockedPackages.Count -gt 0) { "A7 finished with blocked packages. Review logs." } else { "A7 controlled docs-only run completed successfully." }),
        "",
        "## Log file",
        $RunLog,
        "",
        "## Next step",
        "Agent Batch A8 - One selected low-risk UI/CSS change with build."
    )

    $report | Set-Content -Encoding UTF8 docs/agent/A7_FINAL_REPORT.md
}

Write-AgentLog "=== Agent Batch A7 controlled run started ==="
$branch = git branch --show-current
Write-AgentLog "Current branch: $branch"

$status = git status --porcelain
if ($status) {
    Write-AgentLog "Working tree is not clean. Stopping."
    git status | Out-String | Add-Content -Encoding UTF8 -Path $RunLog
    exit 1
}

$AiderBase = @(
    "--model", "ollama_chat/qwen2.5-coder:7b",
    "--no-auto-commits",
    "--map-tokens", "0",
    "--disable-playwright"
)

$tasks = @(
    @{
        Name = "PACKET A7-1 - Post CSS Patch Audit"
        MessageFile = "docs/agent/tasks/PACKET_A7_1_POST_CSS_PATCH_AUDIT.md"
        Files = @("docs/agent/A7_POST_CSS_PATCH_AUDIT.md", "progress.md", "errors_log.md")
        RequiredOutput = "docs/agent/A7_POST_CSS_PATCH_AUDIT.md"
    },
    @{
        Name = "PACKET A7-2 - Next Low Risk UI Candidates"
        MessageFile = "docs/agent/tasks/PACKET_A7_2_NEXT_LOW_RISK_UI_CANDIDATES.md"
        Files = @("docs/agent/A7_NEXT_LOW_RISK_UI_CANDIDATES.md", "progress.md", "errors_log.md")
        RequiredOutput = "docs/agent/A7_NEXT_LOW_RISK_UI_CANDIDATES.md"
    }
)

$CompletedPackages = @()
$BlockedPackages = @()

foreach ($task in $tasks) {
    Write-AgentLog ""
    Write-AgentLog "=== Running: $($task.Name) ==="

    try {
        $args = @()
        $args += $AiderBase
        $args += @("--message-file", $task.MessageFile)

        foreach ($file in $task.Files) {
            if (-not (Test-Path $file)) {
                New-Item -ItemType File -Force $file | Out-Null
            }
            $args += @("--file", $file)
        }

        & aider @args

        Write-AgentLog "Aider finished: $($task.Name)"
        git status --short | Out-String | Add-Content -Encoding UTF8 -Path $RunLog

        Test-AllowedChangesOnly
        Test-RequiredOutput -Path $task.RequiredOutput -TaskName $task.Name

        $CompletedPackages += "- $($task.Name)"
        Write-AgentLog "Safety check passed for: $($task.Name)"
        Write-AgentLog "Required output check passed: $($task.RequiredOutput)"
    }
    catch {
        $BlockedPackages += "- $($task.Name): $($_.Exception.Message)"
        Add-Content -Encoding UTF8 errors_log.md "- BLOCKED $($task.Name): $($_.Exception.Message)"
        Write-AgentLog "BLOCKED: $($task.Name) - $($_.Exception.Message)"
        break
    }
}

try {
    Test-AllowedChangesOnly
    Write-A7FinalReport -CompletedPackages $CompletedPackages -BlockedPackages $BlockedPackages
    Test-RequiredOutput -Path "docs/agent/A7_FINAL_REPORT.md" -TaskName "A7 Final Report"
    Write-AgentLog "=== Agent Batch A7 controlled run completed ==="
    git status | Out-String | Add-Content -Encoding UTF8 -Path $RunLog
    git status
}
catch {
    Add-Content -Encoding UTF8 errors_log.md "- A7 FINAL REPORT ERROR: $($_.Exception.Message)"
    Write-AgentLog "A7 FINAL REPORT ERROR: $($_.Exception.Message)"
    git status
    exit 1
}
