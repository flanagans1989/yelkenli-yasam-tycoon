param(
    [string]$RepoPath      = 'C:\dev\yelkenli-yasam-tycoon',
    [string]$ExpectedBranch = 'agent/day-01',
    [string]$OllamaModel   = 'qwen2.5-coder:7b',
    [string]$OllamaUrl     = 'http://localhost:11434'
)

$masterLog = Join-Path $RepoPath 'logs\agent\a10\runs\ALL_QUEUES_MASTER.log'
$runner    = Join-Path $RepoPath 'scripts\agent\a10\run-night-shift-execute-v1.ps1'
$queues    = @('02', '03', '04')

function Write-Master([string]$msg) {
    $line = '[{0}] {1}' -f (Get-Date -Format 'yyyy-MM-ddTHH:mm:ssK'), $msg
    $fs = [System.IO.FileStream]::new($masterLog, [System.IO.FileMode]::Append, [System.IO.FileAccess]::Write, [System.IO.FileShare]::ReadWrite)
    $sw = [System.IO.StreamWriter]::new($fs, [System.Text.Encoding]::UTF8)
    try { $sw.WriteLine($line) } finally { $sw.Dispose(); $fs.Dispose() }
}

Write-Master '=== ALL_QUEUES_RUN started ==='

foreach ($n in $queues) {
    $qPath = "docs/agent/a10/queues/A10_NIGHT_SHIFT_SAFE_QUEUE_${n}.json"
    Write-Master "--- Queue $n START: $qPath ---"

    & $runner `
        -RepoPath       $RepoPath `
        -ExpectedBranch $ExpectedBranch `
        -QueuePath      $qPath `
        -OllamaModel    $OllamaModel `
        -OllamaUrl      $OllamaUrl `
        -DryRun         $false

    Write-Master "--- Queue $n DONE (exit=$LASTEXITCODE) ---"
}

Write-Master '=== ALL_QUEUES_RUN finished ==='
