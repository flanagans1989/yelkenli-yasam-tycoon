param(
    [string]$RepoPath = 'C:\dev\yelkenli-yasam-tycoon',
    [string]$ExpectedBranch = 'agent/day-01',
    [bool]$DryRun = $true,
    [string]$QueuePath = 'docs/agent/a10/queues/A10_NIGHT_SHIFT_SAFE_QUEUE_01.json',
    [string]$ExecuteTaskId = '',
    [string]$ExecuteMode = '',
    [int]$MaxTasks = 1
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

function Resolve-QueuePath {
    param(
        [string]$BaseRepoPath,
        [string]$InputQueuePath
    )

    if ([System.IO.Path]::IsPathRooted($InputQueuePath)) {
        return $InputQueuePath
    }

    return Join-Path -Path $BaseRepoPath -ChildPath $InputQueuePath
}

function Append-RunLog {
    param([string]$Message)
    $line = "[{0}] {1}" -f (Get-Date -Format 'yyyy-MM-ddTHH:mm:ssK'), $Message
    Add-Content -Path $runLogPath -Value $line -Encoding UTF8
}

function Test-AllowedOutputFile {
    param([string]$PathValue)

    if ([string]::IsNullOrWhiteSpace($PathValue)) { return $false }
    if (-not $PathValue.StartsWith('docs/agent/a10/night-shift-01/')) { return $false }
    if ($PathValue.Contains('..')) { return $false }
    if ($PathValue -match '^[A-Za-z]:\\') { return $false }
    if ($PathValue.StartsWith('/')) { return $false }
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

function New-PlaceholderContent {
    param(
        [string]$TaskId,
        [string]$TaskTitle
    )

    return @"
# $TaskId — $TaskTitle

## 1. Amac
Bu dosya deterministic A10 placeholder queue execution ciktisidir.
Bu adimda gercek AI cagrisi yapilmaz ve icerik sabit kuralla uretilir.

## 2. Kontrol Edilecek Seyler
Kuyruktaki gorev kimligi ve izinli cikti yolu dogrulanir.
No Aider/Ollama was called.
No source code or package files were modified.

## 3. Basarili Durum
Dosya tek hedefe yazilir ve validasyon kurallarini gecer.
Task basligi ve sabit ifade icerikte bulunur.
A10 Placeholder Queue Execution ifadesi gorunur.

## 4. Hata Durumlari
Yanlis cikti yolu hard stop olarak ele alinir.
Dosya olusmazsa veya boyut yetersizse validation fail olusur.
Gorev tipi izinli degilse SKIP_WITH_NOTE verilir.

## 5. Hard Stop Kurallari
Kuyruk disi yol, path traversal veya mutlak yol kabul edilmez.
Kaynak kod, package veya CSS apply islemi bu modda yasaktir.
Kurala aykiri istekler calismayi durdurur.

## 6. Sabah Inceleme Notu
Manual review is required before commit.
Bu cikti Batch 10 PlaceholderQueue modu kapsaminda uretilmistir.
"@
}

function Test-OutputContent {
    param(
        [string]$FullPath,
        [string]$TaskTitle
    )

    if (-not (Test-Path -LiteralPath $FullPath)) {
        return 'VALIDATION_FAIL_FILE_MISSING'
    }

    $fileInfo = Get-Item -LiteralPath $FullPath
    if ($fileInfo.Length -lt 400) {
        return 'VALIDATION_FAIL_TOO_SHORT'
    }

    $content = Get-Content -Path $FullPath -Raw -Encoding UTF8
    if ($content -notmatch [Regex]::Escape($TaskTitle)) {
        return 'VALIDATION_FAIL_MISSING_TASK_TITLE'
    }

    if ($content -notmatch 'A10 Placeholder Queue Execution') {
        return 'VALIDATION_FAIL_MISSING_PLACEHOLDER_MARKER'
    }

    return 'PASS'
}

function Write-FinalReport {
    $gitSummaryBlock = if ($gitStatusLines.Count -eq 0) { '- clean' } else { ($gitStatusLines | ForEach-Object { "- $_" }) -join "`r`n" }

    $taskValidationTable = @(
        '| task_id | title | task_type | allowed_output_file | validation_result |',
        '|---|---|---|---|---|'
    )
    if ($taskValidationRows.Count -eq 0) {
        $taskValidationTable += '| - | - | - | - | NOT_CHECKED |'
    }
    else {
        foreach ($row in $taskValidationRows) {
            $taskValidationTable += "| $($row.task_id) | $($row.title) | $($row.task_type) | $($row.allowed_output_file) | $($row.validation_result) |"
        }
    }

    $executionTable = @(
        '| task_id | title | task_type | output_path | execution_status | validation_result |',
        '|---|---|---|---|---|---|'
    )
    if ($executionRows.Count -eq 0) {
        $executionTable += '| - | - | - | - | NOT_EXECUTED | NOT_CHECKED |'
    }
    else {
        foreach ($row in $executionRows) {
            $executionTable += "| $($row.task_id) | $($row.title) | $($row.task_type) | $($row.output_path) | $($row.execution_status) | $($row.validation_result) |"
        }
    }

    $body = @"
# A10 Night Shift v1 Dry-Run Final Report

- Run ID: $runId
- Started time: $timestampIso
- Repo path: $RepoPath
- Branch: $currentBranch
- DryRun: $DryRun
- ExecuteTaskId: $ExecuteTaskId
- ExecuteMode: $ExecuteMode
- MaxTasks: $MaxTasks
- executed_count: $executedCount
- skip_valid_count: $skipValidCount
- skip_with_note_count: $skipWithNoteCount
- validation_fail_count: $validationFailCount
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
$($taskValidationTable -join "`r`n")

## Task Execution Table
$($executionTable -join "`r`n")

## Git Status Lines
$gitSummaryBlock
"@

    if ($failureReason) {
        $body += "`r`n- Failure reason: $failureReason`r`n"
    }

    Set-Content -Path $finalReportPath -Value $body -Encoding UTF8
}

$runId = New-RunId
$timestampIso = (Get-Date).ToString('o')
$currentBranch = ''
$finalStatus = 'UNKNOWN'
$exitCode = 2
$failureReason = $null
$requiredDocsResult = 'FAIL'
$queueValidationResult = 'NOT_CHECKED'
$queueId = ''
$queueSafetyLevel = ''
$queueTaskCount = 0
$expectedOutputFolderStatus = 'NOT_CHECKED'
$gitStatusLines = @()
$gitStatusSummary = 'NOT_CHECKED'
$taskValidationRows = @()
$executionRows = @()
$executedCount = 0
$skipValidCount = 0
$skipWithNoteCount = 0
$validationFailCount = 0

$canonicalTaskTypes = @(
    'docs-only',
    'css-patch-proposal',
    'css-patch-apply',
    'script-only',
    'build-check',
    'audit/checklist'
)
$placeholderAllowedTaskTypes = @('docs-only', 'audit/checklist')

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
$resolvedQueuePath = Resolve-QueuePath -BaseRepoPath $RepoPath -InputQueuePath $QueuePath

try {
    if ($ExecuteTaskId -ne '' -and $ExecuteTaskId -ne 'Task 01') {
        $finalStatus = 'HARD_STOP'
        $queueValidationResult = 'HARD_STOP_INVALID_EXECUTE_TASK_ID'
        $failureReason = "Unsupported ExecuteTaskId: $ExecuteTaskId"
        $exitCode = 2
        throw [System.Exception]::new($failureReason)
    }

    if ($ExecuteMode -ne '' -and $ExecuteMode -ne 'PlaceholderQueue') {
        $finalStatus = 'HARD_STOP'
        $queueValidationResult = 'HARD_STOP_INVALID_EXECUTE_MODE'
        $failureReason = "Unsupported ExecuteMode: $ExecuteMode"
        $exitCode = 2
        throw [System.Exception]::new($failureReason)
    }

    if ($ExecuteTaskId -ne '' -and $ExecuteMode -ne '') {
        $finalStatus = 'HARD_STOP'
        $queueValidationResult = 'HARD_STOP_CONFLICTING_EXECUTION_INPUT'
        $failureReason = 'ExecuteTaskId and ExecuteMode cannot be used together.'
        $exitCode = 2
        throw [System.Exception]::new($failureReason)
    }

    if ($ExecuteMode -eq 'PlaceholderQueue' -and ($MaxTasks -lt 1 -or $MaxTasks -gt 10)) {
        $finalStatus = 'HARD_STOP'
        $queueValidationResult = 'HARD_STOP_INVALID_MAX_TASKS'
        $failureReason = "MaxTasks must be between 1 and 10. Current=$MaxTasks"
        $exitCode = 2
        throw [System.Exception]::new($failureReason)
    }

    if (-not (Test-Path -LiteralPath $RepoPath)) {
        throw "RepoPath not found: $RepoPath"
    }

    Ensure-Directory -Path $logsBase
    Ensure-Directory -Path $runLogDir
    Ensure-Directory -Path $reportDir

    Set-Content -Path $runLogPath -Value "[$timestampIso] A10 runner v1 started. DryRun=$DryRun QueuePath=$resolvedQueuePath ExecuteTaskId=$ExecuteTaskId ExecuteMode=$ExecuteMode MaxTasks=$MaxTasks" -Encoding UTF8

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
        $exitCode = 2
        throw [System.Exception]::new($failureReason)
    }

    try {
        $queueRaw = Get-Content -Path $resolvedQueuePath -Raw -Encoding UTF8
        $queue = $queueRaw | ConvertFrom-Json
        Append-RunLog 'Queue load success.'
    }
    catch {
        $finalStatus = 'HARD_STOP'
        $queueValidationResult = 'HARD_STOP_JSON_PARSE_FAIL'
        $failureReason = "Queue JSON parse failed: $($_.Exception.Message)"
        $exitCode = 2
        throw [System.Exception]::new($failureReason)
    }

    $queueId = [string]$queue.queue_id
    $queueSafetyLevel = [string]$queue.safety_level
    $queueTasks = @($queue.tasks)
    $queueTaskCount = $queueTasks.Count

    $headerIssues = @()
    if ([string]::IsNullOrWhiteSpace($queueId)) { $headerIssues += 'queue_id empty' }
    if ([string]$queue.created_for_branch -ne $ExpectedBranch) { $headerIssues += "created_for_branch mismatch (expected $ExpectedBranch)" }
    if ([string]$queue.safety_level -ne 'SAFE_DOCS_ONLY') { $headerIssues += 'safety_level must be SAFE_DOCS_ONLY' }
    if ($null -eq $queue.tasks -or $queueTaskCount -le 0) { $headerIssues += 'tasks must exist and contain at least one task' }

    if ($headerIssues.Count -gt 0) {
        $finalStatus = 'HARD_STOP'
        $queueValidationResult = 'HARD_STOP_QUEUE_HEADER_INVALID'
        $failureReason = 'Queue header validation failed: ' + ($headerIssues -join '; ')
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

        $forbiddenArray = @($task.forbidden_scope)
        if ($null -eq $task.forbidden_scope -or $forbiddenArray.Count -eq 0) {
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
            if ($taskValidationResult -eq 'OK') {
                $taskValidationResult = 'VALIDATION_FAIL: non_canonical_task_type'
            }
            else {
                $taskValidationResult = "$taskValidationResult, non_canonical_task_type"
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

    if ($hardStopAllowedOutput) {
        $finalStatus = 'HARD_STOP'
        $queueValidationResult = 'HARD_STOP_FORBIDDEN_OUTPUT_PATH'
        $failureReason = 'allowed_output_file validation failed for one or more tasks'
        $exitCode = 2
    }
    elseif ($nonHardValidationFailed) {
        $finalStatus = 'VALIDATION_FAIL'
        $queueValidationResult = 'VALIDATION_FAIL'
        $failureReason = 'One or more queue/task validations failed (non-hard).'
        $exitCode = 1
    }
    else {
        $queueValidationResult = 'PASS'
        $exitCode = 0
    }

    if ($exitCode -eq 0) {
        if ($ExecuteTaskId -eq 'Task 01') {
            $task01 = $queueTasks | Where-Object { ([string]$_.task_id) -eq 'Task 01' } | Select-Object -First 1
            if ($null -eq $task01) {
                $finalStatus = 'HARD_STOP'
                $queueValidationResult = 'HARD_STOP_TASK_01_MISSING'
                $failureReason = 'Task 01 not found in queue.'
                $exitCode = 2
                throw [System.Exception]::new($failureReason)
            }

            $expectedPath = 'docs/agent/a10/night-shift-01/T01_BRANCH_SAFETY_CHECK_PLAN.md'
            $task01OutputRel = [string]$task01.allowed_output_file
            if ($task01OutputRel -ne $expectedPath) {
                $finalStatus = 'HARD_STOP'
                $queueValidationResult = 'HARD_STOP_TASK_01_OUTPUT_MISMATCH'
                $failureReason = "Task 01 output path mismatch. Expected '$expectedPath' got '$task01OutputRel'"
                $exitCode = 2
                throw [System.Exception]::new($failureReason)
            }

            $task01OutputFull = Join-Path -Path $RepoPath -ChildPath $task01OutputRel
            Ensure-Directory -Path (Split-Path -Path $task01OutputFull -Parent)

            $placeholder = New-PlaceholderContent -TaskId 'Task 01' -TaskTitle ([string]$task01.title)
            Set-Content -Path $task01OutputFull -Value $placeholder -Encoding UTF8
            $singleValidation = Test-OutputContent -FullPath $task01OutputFull -TaskTitle ([string]$task01.title)

            $executionRows += [PSCustomObject]@{
                task_id = 'Task 01'
                title = [string]$task01.title
                task_type = [string]$task01.task_type
                output_path = $task01OutputRel
                execution_status = 'EXECUTED'
                validation_result = $singleValidation
            }

            Append-RunLog "Task 01 execution decision: EXECUTED output=$task01OutputRel"
            Append-RunLog "Task 01 output validation result: $singleValidation"

            if ($singleValidation -ne 'PASS') {
                $validationFailCount = 1
                $finalStatus = 'VALIDATION_FAIL'
                $failureReason = 'Task 01 output validation failed.'
                $exitCode = 1
            }
            else {
                $executedCount = 1
                $finalStatus = 'SUCCESS'
                $exitCode = 0
            }
        }
        elseif ($ExecuteMode -eq 'PlaceholderQueue') {
            Append-RunLog "PlaceholderQueue execution mode enabled. MaxTasks=$MaxTasks"
            foreach ($task in $queueTasks) {
                if ($executedCount -ge $MaxTasks) { break }

                $taskId = [string]$task.task_id
                $title = [string]$task.title
                $taskType = [string]$task.task_type
                $outputRel = [string]$task.allowed_output_file
                $outputFull = Join-Path -Path $RepoPath -ChildPath $outputRel

                if (-not ($placeholderAllowedTaskTypes -contains $taskType)) {
                    $skipWithNoteCount++
                    $executionRows += [PSCustomObject]@{
                        task_id = $taskId
                        title = $title
                        task_type = $taskType
                        output_path = $outputRel
                        execution_status = 'SKIP_WITH_NOTE'
                        validation_result = 'NOT_APPLICABLE_TASK_TYPE'
                    }
                    Append-RunLog "Task decision: $taskId SKIP_WITH_NOTE task_type=$taskType"
                    continue
                }

                if (Test-Path -LiteralPath $outputFull) {
                    $existingLength = (Get-Item -LiteralPath $outputFull).Length
                    if ($existingLength -ge 400) {
                        $skipValidCount++
                        $executionRows += [PSCustomObject]@{
                            task_id = $taskId
                            title = $title
                            task_type = $taskType
                            output_path = $outputRel
                            execution_status = 'SKIP_VALID'
                            validation_result = 'EXISTING_OUTPUT_VALID'
                        }
                        Append-RunLog "Task decision: $taskId SKIP_VALID existing_length=$existingLength"
                        continue
                    }
                }

                Ensure-Directory -Path (Split-Path -Path $outputFull -Parent)
                $placeholderContent = New-PlaceholderContent -TaskId $taskId -TaskTitle $title
                Set-Content -Path $outputFull -Value $placeholderContent -Encoding UTF8
                $validationResult = Test-OutputContent -FullPath $outputFull -TaskTitle $title

                $executionStatus = 'EXECUTED'
                if ($validationResult -ne 'PASS') {
                    $executionStatus = 'VALIDATION_FAIL'
                    $validationFailCount++
                }
                else {
                    $executedCount++
                }

                $executionRows += [PSCustomObject]@{
                    task_id = $taskId
                    title = $title
                    task_type = $taskType
                    output_path = $outputRel
                    execution_status = $executionStatus
                    validation_result = $validationResult
                }

                Append-RunLog "Task decision: $taskId $executionStatus output=$outputRel"
                Append-RunLog "Task output validation result: $taskId $validationResult"
            }

            Append-RunLog "PlaceholderQueue totals: executed_count=$executedCount skip_valid_count=$skipValidCount skip_with_note_count=$skipWithNoteCount validation_fail_count=$validationFailCount"

            if ($validationFailCount -gt 0) {
                $finalStatus = 'VALIDATION_FAIL'
                $failureReason = 'One or more placeholder outputs failed validation.'
                $exitCode = 1
            }
            else {
                $finalStatus = 'SUCCESS'
                $exitCode = 0
            }
        }
        else {
            $finalStatus = 'SUCCESS'
            $exitCode = 0
        }
    }

    Append-RunLog "Final execution totals: executed_count=$executedCount skip_valid_count=$skipValidCount skip_with_note_count=$skipWithNoteCount validation_fail_count=$validationFailCount"
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

    if ($exitCode -eq 0 -or $null -eq $exitCode) {
        $exitCode = 2
    }

    if (Test-Path -LiteralPath $runLogPath) {
        Append-RunLog "Failure captured. Status=$finalStatus Reason=$failureReason"
    }
}
finally {
    if (Test-Path -LiteralPath $reportDir) {
        Write-FinalReport
    }

    if (Test-Path -LiteralPath $runLogPath) {
        Append-RunLog "Final status: $finalStatus ExitCode=$exitCode ExecuteTaskId=$ExecuteTaskId ExecuteMode=$ExecuteMode MaxTasks=$MaxTasks"
    }
}

if ($exitCode -eq 0) {
    Write-Host "A10 v1 run succeeded. RunId=$runId ExecuteTaskId=$ExecuteTaskId ExecuteMode=$ExecuteMode"
    exit 0
}

if ($exitCode -eq 1) {
    Write-Host "A10 v1 run validation failed. RunId=$runId Reason=$failureReason"
    exit 1
}

Write-Host "A10 v1 run hard stop. RunId=$runId Reason=$failureReason"
exit 2
