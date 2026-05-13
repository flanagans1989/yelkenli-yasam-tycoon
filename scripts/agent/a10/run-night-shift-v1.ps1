param(
    [string]$RepoPath = 'C:\dev\yelkenli-yasam-tycoon',
    [string]$ExpectedBranch = 'agent/day-01',
    [bool]$DryRun = $true,
    [string]$QueuePath = 'docs/agent/a10/queues/A10_NIGHT_SHIFT_SAFE_QUEUE_01.json'
)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

function New-RunId {
    return 'A10-RUN-' + (Get-Date -Format 'yyyyMMdd-HHmmss')
}

function Ensure-Directory {
    param([string]$Path)
    if (-not (Test-Path -LiteralPath $Path)) {
        New-Item -Path $Path -ItemType Directory -Force | Out-Null
    }
}

$runId = New-RunId
$startedAt = Get-Date
$timestampIso = $startedAt.ToString('o')
$currentBranch = ''
$finalStatus = 'UNKNOWN'
$exitCode = 2
$failureReason = $null
$requiredDocsResult = 'FAIL'
$gitStatusLines = @()
$gitStatusSummary = 'NOT_CHECKED'
$queueValidationResult = 'NOT_CHECKED'
$queueId = ''
$queueSafetyLevel = ''
$queueTaskCount = 0
$expectedOutputFolder = 'docs/agent/a10/night-shift-01/'
$expectedOutputFolderStatus = 'NOT_CHECKED'
$taskValidationRows = @()

$canonicalTaskTypes = @(
    'docs-only',
    'css-patch-proposal',
    'css-patch-apply',
    'script-only',
    'build-check',
    'audit/checklist'
)

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

function Append-RunLog {
    param([string]$Message)
    $line = "[{0}] {1}" -f (Get-Date -Format 'yyyy-MM-ddTHH:mm:ssK'), $Message
    Add-Content -Path $runLogPath -Value $line -Encoding UTF8
}

function Resolve-QueuePath {
    param(
        [string]$BaseRepoPath,
        [string]$InputQueuePath
    )

    if ([System.IO.Path]::IsPathRooted($InputQueuePath)) {
        return $InputQueuePath
    }

    return (Join-Path -Path $BaseRepoPath -ChildPath $InputQueuePath)
}

function Test-AllowedOutputFile {
    param([string]$PathValue)

    if ([string]::IsNullOrWhiteSpace($PathValue)) {
        return $false
    }

    if (-not $PathValue.StartsWith('docs/agent/a10/night-shift-01/')) {
        return $false
    }

    if ($PathValue.Contains('..')) {
        return $false
    }

    if ($PathValue -match '^[A-Za-z]:\\') {
        return $false
    }

    if ($PathValue.StartsWith('/')) {
        return $false
    }

    return $true
}

function Get-TaskFieldString {
    param(
        $Task,
        [string]$FieldName
    )

    $value = $Task.$FieldName
    if ($null -eq $value) {
        return ''
    }

    return [string]$value
}

function Write-FinalReport {
    $gitSummaryBlock = if ($gitStatusLines.Count -eq 0) { '- clean' } else { ($gitStatusLines | ForEach-Object { "- $_" }) -join "`r`n" }

    $taskTableLines = @(
        '| task_id | title | task_type | allowed_output_file | validation_result |',
        '|---|---|---|---|---|'
    )

    if ($taskValidationRows.Count -eq 0) {
        $taskTableLines += '| - | - | - | - | NOT_CHECKED |'
    }
    else {
        foreach ($row in $taskValidationRows) {
            $taskTableLines += "| $($row.task_id) | $($row.title) | $($row.task_type) | $($row.allowed_output_file) | $($row.validation_result) |"
        }
    }

    $body = @"
# A10 Night Shift v1 Dry-Run Final Report

- Run ID: $runId
- Started time: $timestampIso
- Repo path: $RepoPath
- Branch: $currentBranch
- DryRun: $DryRun
- Required docs validation result: $requiredDocsResult
- Queue path: $resolvedQueuePath
- Queue ID: $queueId
- Queue safety level: $queueSafetyLevel
- Queue task count: $queueTaskCount
- Queue validation result: $queueValidationResult
- Expected output folder status: $expectedOutputFolderStatus
- Git status summary: $gitStatusSummary
- Final status: $finalStatus

## Task Validation Table
$($taskTableLines -join "`r`n")

## Git Status Lines
$gitSummaryBlock

## Notes
- Dry-run only.
- No task execution, no AI calls, no patch apply, no build.
"@

    if ($failureReason) {
        $body += "`r`n- Failure reason: $failureReason`r`n"
    }

    Set-Content -Path $finalReportPath -Value $body -Encoding UTF8
}

$resolvedQueuePath = Resolve-QueuePath -BaseRepoPath $RepoPath -InputQueuePath $QueuePath

try {
    if (-not (Test-Path -LiteralPath $RepoPath)) {
        throw "RepoPath not found: $RepoPath"
    }

    Ensure-Directory -Path $logsBase
    Ensure-Directory -Path $runLogDir
    Ensure-Directory -Path $reportDir

    Set-Content -Path $runLogPath -Value "[$timestampIso] A10 runner v1 started. DryRun=$DryRun QueuePath=$resolvedQueuePath" -Encoding UTF8

    $gitDir = Join-Path -Path $RepoPath -ChildPath '.git'
    if (-not (Test-Path -LiteralPath $gitDir)) {
        throw '.git directory not found under RepoPath'
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
        throw ('Required A10 docs missing: ' + ($missingDocs -join ', '))
    }

    $requiredDocsResult = 'PASS'

    $statusRaw = & git -C $RepoPath status --porcelain --untracked-files=all
    $gitStatusLines = @($statusRaw | Where-Object { $_ -ne $null -and $_.Trim().Length -gt 0 })
    $gitStatusSummary = if ($gitStatusLines.Count -eq 0) { 'CLEAN' } else { "CHANGED ($($gitStatusLines.Count) entries)" }

    $expectedOutputFolderFull = Join-Path -Path $RepoPath -ChildPath 'docs/agent/a10/night-shift-01'
    if (Test-Path -LiteralPath $expectedOutputFolderFull) {
        $expectedOutputFolderStatus = 'EXISTS'
    }
    else {
        $expectedOutputFolderStatus = 'OUTPUT_DIR_NOT_YET_CREATED_EXPECTED'
    }

    if (-not (Test-Path -LiteralPath $resolvedQueuePath)) {
        $finalStatus = 'HARD_STOP'
        $queueValidationResult = 'HARD_STOP_QUEUE_FILE_MISSING'
        $failureReason = "Queue file not found: $resolvedQueuePath"
        Append-RunLog "Queue load failure. Status=HARD_STOP Reason=$failureReason"
        $exitCode = 2
        throw [System.Exception]::new($failureReason)
    }

    $queue = $null
    try {
        $queueRaw = Get-Content -Path $resolvedQueuePath -Raw -Encoding UTF8
        $queue = $queueRaw | ConvertFrom-Json
        Append-RunLog 'Queue load success.'
    }
    catch {
        $finalStatus = 'HARD_STOP'
        $queueValidationResult = 'HARD_STOP_JSON_PARSE_FAIL'
        $failureReason = "Queue JSON parse failed: $($_.Exception.Message)"
        Append-RunLog "Queue load failure. Status=HARD_STOP Reason=$failureReason"
        $exitCode = 2
        throw [System.Exception]::new($failureReason)
    }

    $queueId = [string]$queue.queue_id
    $queueSafetyLevel = [string]$queue.safety_level
    $queueTasks = @($queue.tasks)
    $queueTaskCount = $queueTasks.Count

    $headerIssues = @()
    if ([string]::IsNullOrWhiteSpace($queueId)) {
        $headerIssues += 'queue_id empty'
    }
    if ([string]::IsNullOrWhiteSpace([string]$queue.created_for_branch) -or [string]$queue.created_for_branch -ne $ExpectedBranch) {
        $headerIssues += "created_for_branch mismatch (expected $ExpectedBranch)"
    }
    if ([string]$queue.safety_level -ne 'SAFE_DOCS_ONLY') {
        $headerIssues += 'safety_level must be SAFE_DOCS_ONLY'
    }
    if ($null -eq $queue.tasks -or $queueTaskCount -le 0) {
        $headerIssues += 'tasks must exist and contain at least one task'
    }

    if ($headerIssues.Count -gt 0) {
        $finalStatus = 'HARD_STOP'
        $queueValidationResult = 'HARD_STOP_QUEUE_HEADER_INVALID'
        $failureReason = 'Queue header validation failed: ' + ($headerIssues -join '; ')
        Append-RunLog "Queue header validation failed. Status=HARD_STOP Issues=$($headerIssues -join ' | ')"
        $exitCode = 2
        throw [System.Exception]::new($failureReason)
    }

    Append-RunLog 'Queue header validation result: PASS'

    $nonHardValidationFailed = $false
    $hardStopAllowedOutput = $false

    foreach ($task in $queueTasks) {
        $taskId = Get-TaskFieldString -Task $task -FieldName 'task_id'
        $title = Get-TaskFieldString -Task $task -FieldName 'title'
        $taskType = Get-TaskFieldString -Task $task -FieldName 'task_type'
        $goal = Get-TaskFieldString -Task $task -FieldName 'goal'
        $allowedOutputFile = Get-TaskFieldString -Task $task -FieldName 'allowed_output_file'
        $validationRule = Get-TaskFieldString -Task $task -FieldName 'validation_rule'
        $softFailRule = Get-TaskFieldString -Task $task -FieldName 'soft_fail_rule'
        $hardStopRule = Get-TaskFieldString -Task $task -FieldName 'hard_stop_rule'

        $taskIssues = @()
        if ([string]::IsNullOrWhiteSpace($taskId)) { $taskIssues += 'task_id empty' }
        if ([string]::IsNullOrWhiteSpace($title)) { $taskIssues += 'title empty' }
        if ([string]::IsNullOrWhiteSpace($taskType)) { $taskIssues += 'task_type empty' }
        if ([string]::IsNullOrWhiteSpace($goal)) { $taskIssues += 'goal empty' }
        if ([string]::IsNullOrWhiteSpace($allowedOutputFile)) { $taskIssues += 'allowed_output_file empty' }
        if ([string]::IsNullOrWhiteSpace($validationRule)) { $taskIssues += 'validation_rule empty' }
        if ([string]::IsNullOrWhiteSpace($softFailRule)) { $taskIssues += 'soft_fail_rule empty' }
        if ([string]::IsNullOrWhiteSpace($hardStopRule)) { $taskIssues += 'hard_stop_rule empty' }

        $forbiddenScopeValid = $true
        if ($null -eq $task.forbidden_scope) {
            $forbiddenScopeValid = $false
        }
        elseif (($task.forbidden_scope -is [string]) -and [string]::IsNullOrWhiteSpace([string]$task.forbidden_scope)) {
            $forbiddenScopeValid = $false
        }
        else {
            $forbiddenArray = @($task.forbidden_scope)
            if ($forbiddenArray.Count -eq 0) {
                $forbiddenScopeValid = $false
            }
        }

        if (-not $forbiddenScopeValid) {
            $taskIssues += 'forbidden_scope missing_or_empty'
        }

        if (-not (Test-AllowedOutputFile -PathValue $allowedOutputFile)) {
            $hardStopAllowedOutput = $true
            $taskIssues += 'allowed_output_file invalid'
        }

        $taskValidationResult = 'OK'
        if ($taskIssues.Count -gt 0) {
            $taskValidationResult = 'VALIDATION_FAIL: ' + ($taskIssues -join ', ')
            $nonHardValidationFailed = $true
        }

        if (-not ($canonicalTaskTypes -contains $taskType)) {
            $taskValidationResult = if ($taskValidationResult -eq 'OK') {
                'VALIDATION_FAIL: non_canonical_task_type'
            }
            else {
                "$taskValidationResult, non_canonical_task_type"
            }
            $nonHardValidationFailed = $true
        }

        $taskValidationRows += [PSCustomObject]@{
            task_id = if ([string]::IsNullOrWhiteSpace($taskId)) { '-' } else { $taskId }
            title = if ([string]::IsNullOrWhiteSpace($title)) { '-' } else { $title }
            task_type = if ([string]::IsNullOrWhiteSpace($taskType)) { '-' } else { $taskType }
            allowed_output_file = if ([string]::IsNullOrWhiteSpace($allowedOutputFile)) { '-' } else { $allowedOutputFile }
            validation_result = $taskValidationResult
        }
    }

    $taskPassCount = @($taskValidationRows | Where-Object { $_.validation_result -eq 'OK' }).Count
    $taskFailCount = $taskValidationRows.Count - $taskPassCount
    Append-RunLog "Per-task validation summary: total=$($taskValidationRows.Count) pass=$taskPassCount fail=$taskFailCount"

    if ($hardStopAllowedOutput) {
        $finalStatus = 'HARD_STOP'
        $queueValidationResult = 'HARD_STOP_FORBIDDEN_OUTPUT_PATH'
        $failureReason = 'allowed_output_file validation failed for one or more tasks'
        Append-RunLog 'Final status=HARD_STOP due to allowed_output_file validation failure.'
        $exitCode = 2
    }
    elseif ($nonHardValidationFailed) {
        $finalStatus = 'VALIDATION_FAIL'
        $queueValidationResult = 'VALIDATION_FAIL'
        $failureReason = 'One or more queue/task validations failed (non-hard).'
        Append-RunLog 'Final status=VALIDATION_FAIL due to non-hard validation failures.'
        $exitCode = 1
    }
    else {
        $finalStatus = 'SUCCESS'
        $queueValidationResult = 'PASS'
        Append-RunLog 'Final status=SUCCESS. All queue validations passed.'
        $exitCode = 0
    }

    Append-RunLog "Queue header validation result: PASS; QueueId=$queueId Safety=$queueSafetyLevel TaskCount=$queueTaskCount"
}
catch {
    if (-not $failureReason) {
        $failureReason = $_.Exception.Message
    }

    if ($finalStatus -eq 'UNKNOWN') {
        $finalStatus = 'HARD_STOP'
    }

    if ($queueValidationResult -eq 'NOT_CHECKED') {
        $queueValidationResult = 'HARD_STOP'
    }

    if ($exitCode -eq 0 -or $exitCode -eq $null) {
        $exitCode = 2
    }

    Append-RunLog "Failure captured. Status=$finalStatus Reason=$failureReason"
}
finally {
    Write-FinalReport
    Append-RunLog "Final status: $finalStatus ExitCode=$exitCode"
}

if ($exitCode -eq 0) {
    Write-Host "A10 v1 dry-run validation succeeded. RunId=$runId"
    exit 0
}

if ($exitCode -eq 1) {
    Write-Host "A10 v1 dry-run validation failed (non-hard). RunId=$runId Reason=$failureReason"
    exit 1
}

Write-Host "A10 v1 dry-run hard stop. RunId=$runId Reason=$failureReason"
exit 2
