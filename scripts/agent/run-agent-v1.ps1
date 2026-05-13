$ErrorActionPreference = "Stop"

$RepoPath = "C:\dev\yelkenli-yasam-tycoon"
$LogDir = "logs\agent"
$DryRun = $false

Set-Location $RepoPath

if (-not (Test-Path $LogDir)) {
    New-Item -ItemType Directory -Force $LogDir | Out-Null
}

$RunStamp = Get-Date -Format "yyyyMMdd-HHmmss"
$RunLog = Join-Path $LogDir "agent-run-$RunStamp.log"

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
    param(
        [string]$Path,
        [string]$TaskName
    )

    if (-not (Test-Path $Path)) {
        Write-AgentLog "REQUIRED OUTPUT MISSING: $Path"
        throw "Task failed: $TaskName"
    }

    $length = (Get-Item $Path).Length
    if ($length -lt 50) {
        Write-AgentLog "REQUIRED OUTPUT TOO SMALL OR EMPTY: $Path ($length bytes)"
        throw "Task failed: $TaskName"
    }
}

function Write-FinalReports {
    param(
        [string[]]$CompletedPackages,
        [string[]]$BlockedPackages
    )

    Write-AgentLog "Creating deterministic final reports"

    $now = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $changed = git status --short | Out-String

    $summary = @(
        "# Final Proof Summary",
        "",
        "## Test name",
        "Scripted Autonomous Agent Proof Test",
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
        "## Files expected to change",
        "- docs/agent/AUTONOMOUS_TEST_RUN.md",
        "- docs/agent/AGENT_WORK_SIMULATION.md",
        "- docs/agent/FINAL_PROOF_SUMMARY.md",
        "- docs/agent/FINAL_AGENT_REPORT.md",
        "- progress.md",
        "- errors_log.md",
        "- logs/agent/*.log",
        "",
        "## Source code touch status",
        "Source code should not be touched in this proof test.",
        "",
        "## Why git status check matters",
        "The script checks git status after each packet so forbidden source or project configuration changes are detected immediately.",
        "",
        "## Result",
        $(if ($BlockedPackages.Count -gt 0) { "The scripted runner finished with blocked packages. Review errors_log.md and logs/agent." } else { "The scripted runner completed the safe documentation-only proof flow." }),
        "",
        "## Recommended next step",
        "Agent Batch A4 - Run a longer docs-only night shift with 3 to 5 packets."
    )

    $report = @(
        "# Final Agent Report",
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
        "Current git status before commit:",
        "",
        "````text",
        $changed,
        "````",
        "",
        "## Source files modified",
        "Expected: NONE.",
        "",
        "## Build status",
        "Build not required because this proof test only changes documentation files.",
        "",
        "## Safety check result",
        $(if ($BlockedPackages.Count -gt 0) { "Some packet checks failed. Review logs." } else { "Forbidden source/config file check passed after each Aider packet." }),
        "",
        "## Log file",
        $RunLog,
        "",
        "## Next recommended agent batch",
        "Agent Batch A4 - Longer docs-only autonomous night shift."
    )

    $summary | Set-Content -Encoding UTF8 docs/agent/FINAL_PROOF_SUMMARY.md
    $report | Set-Content -Encoding UTF8 docs/agent/FINAL_AGENT_REPORT.md

    Add-Content -Encoding UTF8 progress.md "- PACKET 003 completed."
}

Write-AgentLog "=== Agent v1 started ==="

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
        Name = "PACKET 001 - Autonomous Mode Check"
        MessageFile = "docs/agent/tasks/PACKET_001_AUTONOMOUS_MODE_CHECK.md"
        Files = @(
            "docs/agent/AUTONOMOUS_TEST_RUN.md",
            "progress.md",
            "errors_log.md"
        )
        RequiredOutput = "docs/agent/AUTONOMOUS_TEST_RUN.md"
    },
    @{
        Name = "PACKET 002 - Agent Work Simulation"
        MessageFile = "docs/agent/tasks/PACKET_002_AGENT_WORK_SIMULATION.md"
        Files = @(
            "docs/agent/AGENT_WORK_SIMULATION.md",
            "progress.md",
            "errors_log.md"
        )
        RequiredOutput = "docs/agent/AGENT_WORK_SIMULATION.md"
    }
)

$CompletedPackages = @()
$BlockedPackages = @()

foreach ($task in $tasks) {
    Write-AgentLog ""
    Write-AgentLog "=== Running: $($task.Name) ==="

    try {
        if ($DryRun) {
            Write-AgentLog "DRY RUN: would run Aider for $($task.Name)"
        }
        else {
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
        }

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
    Write-FinalReports -CompletedPackages $CompletedPackages -BlockedPackages $BlockedPackages
    Test-RequiredOutput -Path "docs/agent/FINAL_AGENT_REPORT.md" -TaskName "PACKET 003 - Deterministic Final Report"
    Test-RequiredOutput -Path "docs/agent/FINAL_PROOF_SUMMARY.md" -TaskName "PACKET 003 - Deterministic Final Summary"

    if ($BlockedPackages.Count -eq 0) {
        Add-Content -Encoding UTF8 errors_log.md "- No blocking errors occurred during scripted autonomous proof test."
    }

    Write-AgentLog "=== Agent v1 completed ==="
    git status | Out-String | Add-Content -Encoding UTF8 -Path $RunLog
    git status
}
catch {
    Add-Content -Encoding UTF8 errors_log.md "- FINAL REPORT ERROR: $($_.Exception.Message)"
    Write-AgentLog "FINAL REPORT ERROR: $($_.Exception.Message)"
    git status
    exit 1
}