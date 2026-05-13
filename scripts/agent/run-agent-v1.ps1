$ErrorActionPreference = "Stop"

$RepoPath = "C:\dev\yelkenli-yasam-tycoon"
Set-Location $RepoPath

Write-Host "=== Agent v1 started ==="

$branch = git branch --show-current
Write-Host "Current branch: $branch"

$status = git status --porcelain
if ($status) {
    Write-Host "Working tree is not clean. Stopping."
    git status
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
    },
    @{
        Name = "PACKET 002 - Agent Work Simulation"
        MessageFile = "docs/agent/tasks/PACKET_002_AGENT_WORK_SIMULATION.md"
        Files = @(
            "docs/agent/AGENT_WORK_SIMULATION.md",
            "progress.md",
            "errors_log.md"
        )
    },
    @{
        Name = "PACKET 003 - Final Proof Summary"
        MessageFile = "docs/agent/tasks/PACKET_003_FINAL_PROOF_SUMMARY.md"
        Files = @(
            "docs/agent/FINAL_PROOF_SUMMARY.md",
            "docs/agent/FINAL_AGENT_REPORT.md",
            "progress.md",
            "errors_log.md"
        )
    }
)

$ForbiddenPatterns = @(
    "^src/",
    "^package\.json$",
    "^package-lock\.json$",
    "^vite\.config",
    "^tsconfig",
    "^public/",
    "^index\.html$"
)

foreach ($task in $tasks) {
    Write-Host ""
    Write-Host "=== Running: $($task.Name) ==="

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

    Write-Host "=== Aider finished: $($task.Name) ==="
    git status --short

    $changedFiles = git status --porcelain | ForEach-Object {
        if ($_.Length -ge 4) { $_.Substring(3).Replace("\", "/").Trim('"') }
    }

    foreach ($changed in $changedFiles) {
        foreach ($pattern in $ForbiddenPatterns) {
            if ($changed -match $pattern) {
                Write-Host "FORBIDDEN CHANGE DETECTED: $changed"
                Write-Host "Stopping agent script."
                git status
                exit 1
            }
        }
    }

    Write-Host "Safety check passed for: $($task.Name)"
}

Write-Host ""
Write-Host "=== Agent v1 completed ==="
git status
