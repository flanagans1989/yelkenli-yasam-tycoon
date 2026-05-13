param(
    [string]$RepoPath = 'C:\dev\yelkenli-yasam-tycoon',
    [string]$ExpectedBranch = 'agent/day-01',
    [bool]$DryRun = $true
)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

function New-RunId {
    return 'A10-RUN-' + (Get-Date -Format 'yyyyMMdd-HHmmss')
}

$runId = New-RunId
$startedAt = Get-Date
$timestampIso = $startedAt.ToString('o')
$finalStatus = 'UNKNOWN'
$validationOk = $false
$gitStatusLines = @()
$gitStatusSummary = 'NOT_CHECKED'
$failureReason = $null

$requiredDocs = @(
    'docs/agent/a10/A10_TASK_TEMPLATE.md',
    'docs/agent/a10/A10_STATUS_CODES.md',
    'docs/agent/a10/A10_RETRY_TIMEOUT_POLICY.md',
    'docs/agent/a10/A10_LOG_SCHEMA.md',
    'docs/agent/a10/A10_GUARDRAILS_CHECKLIST.md',
    'docs/agent/a10/A10_NIGHT_SHIFT_FINAL_REPORT_TEMPLATE.md',
    'docs/agent/a10/A10_DOCS_CONSISTENCY_AUDIT.md'
)

$logsBase = Join-Path -Path $RepoPath -ChildPath 'logs/agent/a10'
$runLogDir = Join-Path -Path $RepoPath -ChildPath 'logs/agent/a10/runs'
$reportDir = Join-Path -Path $RepoPath -ChildPath 'docs/agent/a10/runs'

$runLogPath = Join-Path -Path $runLogDir -ChildPath ("$runId.log")
$finalReportPath = Join-Path -Path $reportDir -ChildPath ("$runId-dry-run-report.md")

function Ensure-Directory {
    param([string]$Path)
    if (-not (Test-Path -LiteralPath $Path)) {
        New-Item -Path $Path -ItemType Directory -Force | Out-Null
    }
}

function Append-RunLog {
    param([string]$Message)
    $line = "[{0}] {1}" -f (Get-Date -Format 'yyyy-MM-ddTHH:mm:ssK'), $Message
    Add-Content -Path $runLogPath -Value $line -Encoding UTF8
}

function Write-FinalReport {
    $requiredDocsResult = if ($validationOk) { 'PASS' } else { 'FAIL' }
    $gitSummaryBlock = if ($gitStatusLines.Count -eq 0) { '- clean' } else { ($gitStatusLines | ForEach-Object { "- $_" }) -join "`r`n" }

    $body = @"
# A10 Night Shift v1 Dry-Run Final Report

- Run ID: $runId
- Started time: $timestampIso
- Repo path: $RepoPath
- Branch: $currentBranch
- DryRun: $DryRun
- Required docs validation result: $requiredDocsResult
- Git status summary: $gitStatusSummary
- Final status: $finalStatus

## Git Status Lines
$gitSummaryBlock

## Notes
- Skeleton runner only.
- No task loading, no AI calls, no patch apply, no build.
"@

    if ($failureReason) {
        $body += "`r`n- Failure reason: $failureReason`r`n"
    }

    Set-Content -Path $finalReportPath -Value $body -Encoding UTF8
}

$currentBranch = ''

try {
    if (-not (Test-Path -LiteralPath $RepoPath)) {
        throw "RepoPath not found: $RepoPath"
    }

    Ensure-Directory -Path $logsBase
    Ensure-Directory -Path $runLogDir
    Ensure-Directory -Path $reportDir

    Set-Content -Path $runLogPath -Value "[$timestampIso] A10 runner v1 skeleton started. DryRun=$DryRun" -Encoding UTF8

    $gitDir = Join-Path -Path $RepoPath -ChildPath '.git'
    if (-not (Test-Path -LiteralPath $gitDir)) {
        throw ".git directory not found under RepoPath"
    }

    $currentBranch = (& git -C $RepoPath branch --show-current).Trim()
    if ([string]::IsNullOrWhiteSpace($currentBranch)) {
        throw 'Failed to resolve current branch.'
    }

    if ($currentBranch -ne $ExpectedBranch) {
        throw "Branch mismatch. Expected='$ExpectedBranch' Current='$currentBranch'"
    }

    $missingDocs = @()
    foreach ($docRelPath in $requiredDocs) {
        $docFullPath = Join-Path -Path $RepoPath -ChildPath $docRelPath
        if (-not (Test-Path -LiteralPath $docFullPath)) {
            $missingDocs += $docRelPath
        }
    }

    if ($missingDocs.Count -gt 0) {
        throw ("Required A10 docs missing: " + ($missingDocs -join ', '))
    }

    $statusRaw = & git -C $RepoPath status --porcelain --untracked-files=all
    $gitStatusLines = @($statusRaw | Where-Object { $_ -ne $null -and $_.Trim().Length -gt 0 })
    $gitStatusSummary = if ($gitStatusLines.Count -eq 0) { 'CLEAN' } else { "CHANGED ($($gitStatusLines.Count) entries)" }

    $validationOk = $true
    $finalStatus = 'DRY_RUN_VALIDATION_PASSED'
    Append-RunLog "Validation passed. Branch=$currentBranch GitStatus=$gitStatusSummary"
}
catch {
    $validationOk = $false
    $finalStatus = 'DRY_RUN_VALIDATION_FAILED'
    $failureReason = $_.Exception.Message
    Append-RunLog "Validation failed: $failureReason"
}
finally {
    Write-FinalReport
}

if (-not $validationOk) {
    Write-Host "A10 v1 dry-run failed: $failureReason"
    exit 1
}

Write-Host "A10 v1 dry-run skeleton validation succeeded. RunId=$runId Report=$finalReportPath"
exit 0
