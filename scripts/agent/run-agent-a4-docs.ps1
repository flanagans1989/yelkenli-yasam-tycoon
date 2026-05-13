$ErrorActionPreference = "Stop"

$RepoPath = "C:\dev\yelkenli-yasam-tycoon"
$LogDir = "logs\agent"
Set-Location $RepoPath

if (-not (Test-Path $LogDir)) {
    New-Item -ItemType Directory -Force $LogDir | Out-Null
}

$RunStamp = Get-Date -Format "yyyyMMdd-HHmmss"
$RunLog = Join-Path $LogDir "agent-a4-docs-$RunStamp.log"

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

function Test-ForbiddenChanges {
    $ForbiddenPatterns = @(
        "^src/",
        "^package\.json$",
        "^package-lock\.json$",
        "^vite\.config",
        "^tsconfig",
        "^public/",
        "^index\.html$"
    )

    $changedFiles = Get-ChangedFiles
    foreach ($changed in $changedFiles) {
        foreach ($pattern in $ForbiddenPatterns) {
            if ($changed -match $pattern) {
                Write-AgentLog "FORBIDDEN CHANGE DETECTED: $changed"
                git status | Out-String | Add-Content -Encoding UTF8 -Path $RunLog
                throw "Forbidden change detected: $changed"
            }
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

function Write-A4FinalReport {
    param([string[]]$CompletedPackages, [string[]]$BlockedPackages)

    $now = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $changed = git status --short | Out-String

    $report = @(
        "# Agent Batch A4 Final Report",
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
        "Build not required because A4 is docs-only.",
        "",
        "## Safety result",
        $(if ($BlockedPackages.Count -gt 0) { "A4 finished with blocked packages. Review logs." } else { "A4 docs-only autonomous run completed successfully." }),
        "",
        "## Log file",
        $RunLog,
        "",
        "## Next step",
        "Agent Batch A5 - First longer autonomous dry-run or first low-risk CSS/code test after review."
    )

    $report | Set-Content -Encoding UTF8 docs/agent/A4_FINAL_REPORT.md
}

Write-AgentLog "=== Agent Batch A4 docs-only run started ==="
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
        Name = "PACKET 004 - Night Shift Protocol"
        MessageFile = "docs/agent/tasks/PACKET_004_NIGHT_SHIFT_PROTOCOL.md"
        Files = @("docs/agent/NIGHT_SHIFT_PROTOCOL.md", "progress.md", "errors_log.md")
        RequiredOutput = "docs/agent/NIGHT_SHIFT_PROTOCOL.md"
    },
    @{
        Name = "PACKET 005 - Agent Limits and Failure Scenarios"
        MessageFile = "docs/agent/tasks/PACKET_005_AGENT_LIMITS_AND_FAILURES.md"
        Files = @("docs/agent/AGENT_LIMITS_AND_FAILURES.md", "progress.md", "errors_log.md")
        RequiredOutput = "docs/agent/AGENT_LIMITS_AND_FAILURES.md"
    },
    @{
        Name = "PACKET 006 - Next Autonomous Batch Plan"
        MessageFile = "docs/agent/tasks/PACKET_006_NEXT_AUTONOMOUS_BATCH_PLAN.md"
        Files = @("docs/agent/NEXT_AUTONOMOUS_BATCH_PLAN.md", "progress.md", "errors_log.md")
        RequiredOutput = "docs/agent/NEXT_AUTONOMOUS_BATCH_PLAN.md"
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

        Test-ForbiddenChanges
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
    Test-ForbiddenChanges
    Write-A4FinalReport -CompletedPackages $CompletedPackages -BlockedPackages $BlockedPackages
    Test-RequiredOutput -Path "docs/agent/A4_FINAL_REPORT.md" -TaskName "A4 Final Report"

    if ($BlockedPackages.Count -eq 0) {
        Add-Content -Encoding UTF8 errors_log.md "- No blocking errors occurred during Agent Batch A4 docs-only run."
    }

    Write-AgentLog "=== Agent Batch A4 docs-only run completed ==="
    git status | Out-String | Add-Content -Encoding UTF8 -Path $RunLog
    git status
}
catch {
    Add-Content -Encoding UTF8 errors_log.md "- A4 FINAL REPORT ERROR: $($_.Exception.Message)"
    Write-AgentLog "A4 FINAL REPORT ERROR: $($_.Exception.Message)"
    git status
    exit 1
}
