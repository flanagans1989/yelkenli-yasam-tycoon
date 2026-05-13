param(
    [string]$RepoPath = 'C:\dev\yelkenli-yasam-tycoon',
    [string]$ExpectedBranch = 'agent/day-01',
    [bool]$DryRun = $true,
    [string]$QueuePath = 'docs/agent/a10/queues/A10_NIGHT_SHIFT_SAFE_QUEUE_01.json',
    [string]$ExecuteTaskId = ''
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
- ExecuteTaskId: $ExecuteTaskId
- Task 01 executed: $task01Executed
- Task 01 output path: $task01OutputPath
- Task 01 output validation: $task01OutputValidationResult
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
- Dry-run + controlled Task 01 execution support.
- No AI calls, no patch apply, no build.
"@

    if ($failureReason) {
        $body += "`r`n- Failure reason: $failureReason`r`n"
    }

    Set-Content -Path $finalReportPath -Value $body -Encoding UTF8
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
$expectedOutputFolderStatus = 'NOT_CHECKED'
$taskValidationRows = @()
$task01Executed = 'NO'
$task01OutputPath = '-'
$task01OutputValidationResult = 'NOT_EXECUTED'

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
$resolvedQueuePath = Resolve-QueuePath -BaseRepoPath $RepoPath -InputQueuePath $QueuePath

try {
    if ($ExecuteTaskId -ne '' -and $ExecuteTaskId -ne 'Task 01') {
        $finalStatus = 'HARD_STOP'
        $failureReason = "Unsupported ExecuteTaskId: $ExecuteTaskId"
        $queueValidationResult = 'HARD_STOP_INVALID_EXECUTE_TASK_ID'
        $exitCode = 2
        throw [System.Exception]::new($failureReason)
    }

    if (-not (Test-Path -LiteralPath $RepoPath)) {
        throw "RepoPath not found: $RepoPath"
    }

    Ensure-Directory -Path $logsBase
    Ensure-Directory -Path $runLogDir
    Ensure-Directory -Path $reportDir

    Set-Content -Path $runLogPath -Value "[$timestampIso] A10 runner v1 started. DryRun=$DryRun QueuePath=$resolvedQueuePath ExecuteTaskId=$ExecuteTaskId" -Encoding UTF8

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

    if ($exitCode -eq 0 -and $ExecuteTaskId -eq 'Task 01') {
        $task01 = $queueTasks | Where-Object { ([string]$_.task_id) -eq 'Task 01' } | Select-Object -First 1
        if ($null -eq $task01) {
            $finalStatus = 'HARD_STOP'
            $queueValidationResult = 'HARD_STOP_TASK_01_MISSING'
            $failureReason = 'Task 01 not found in queue.'
            $exitCode = 2
            throw [System.Exception]::new($failureReason)
        }

        $expectedTask01OutputRel = 'docs/agent/a10/night-shift-01/T01_BRANCH_SAFETY_CHECK_PLAN.md'
        $task01AllowedOutput = [string]$task01.allowed_output_file
        if ($task01AllowedOutput -ne $expectedTask01OutputRel) {
            $finalStatus = 'HARD_STOP'
            $queueValidationResult = 'HARD_STOP_TASK_01_OUTPUT_MISMATCH'
            $failureReason = "Task 01 output path mismatch. Expected '$expectedTask01OutputRel' got '$task01AllowedOutput'"
            $exitCode = 2
            throw [System.Exception]::new($failureReason)
        }

        $task01OutputFullPath = Join-Path -Path $RepoPath -ChildPath $task01AllowedOutput
        $task01OutputPath = $task01AllowedOutput
        Ensure-Directory -Path (Split-Path -Path $task01OutputFullPath -Parent)

        $placeholder = @"
# T01 Branch Safety Check Plan

## 1. Amaç
Bu belge A10 Batch 9 deterministic placeholder execution çıktısıdır.
Amaç, gece koşusunda branch güvenliğini tek görevlik kontrollü adımla doğrulamaktır.

## 2. Kontrol Edilecek Şeyler
Aktif branch adı kesin olarak agent/day-01 olmalıdır.
Repo yolu doğrulanmalı ve .git klasörü mevcut olmalıdır.
Görev sadece docs kapsamındadır; kaynak kod alanları kapsam dışıdır.

## 3. Başarılı Durum
Branch agent/day-01 ise kontrol başarılı kabul edilir.
Queue içindeki Task 01 allowed_output_file değeri sabit hedefle eşleşmelidir.
Çıktı dosyası tek dosya olarak yazılır ve doğrulama kurallarını karşılar.

## 4. Hata Durumları
Branch farklıysa işlem derhal başarısız olur.
Task 01 queue içinde bulunamazsa çalışma durdurulur.
Çıktı yolu beklenen değerden farklıysa hard stop uygulanır.

## 5. Hard Stop Kuralları
Yanlış branch hard stop sebebidir.
Kaynak kod veya package değişikliği bu görevde yasaktır.
No source/package changes are allowed in this controlled execution step.
Beklenmeyen output path veya çoklu görev denemesi hard stop sebebidir.

## 6. Sabah İnceleme Notu
Kullanıcı sabah yalnızca log ve final raporu üzerinden karar verir.
Manual commit/push zorunluluğu devam eder.
Bu çıktı gerçek AI üretimi değil, deterministic A10 Batch 9 placeholder execution örneğidir.
"@

        Set-Content -Path $task01OutputFullPath -Value $placeholder -Encoding UTF8
        $task01Executed = 'YES'

        if (-not (Test-Path -LiteralPath $task01OutputFullPath)) {
            $task01OutputValidationResult = 'VALIDATION_FAIL_FILE_MISSING'
            $finalStatus = 'VALIDATION_FAIL'
            $failureReason = 'Task 01 output file was not created.'
            $exitCode = 1
        }
        else {
            $fileInfo = Get-Item -LiteralPath $task01OutputFullPath
            $content = Get-Content -Path $task01OutputFullPath -Raw -Encoding UTF8

            if ($fileInfo.Length -lt 400) {
                $task01OutputValidationResult = 'VALIDATION_FAIL_TOO_SHORT'
                $finalStatus = 'VALIDATION_FAIL'
                $failureReason = 'Task 01 output file length is below 400 bytes.'
                $exitCode = 1
            }
            elseif ($content -notmatch 'T01 Branch Safety Check Plan') {
                $task01OutputValidationResult = 'VALIDATION_FAIL_MISSING_HEADING'
                $finalStatus = 'VALIDATION_FAIL'
                $failureReason = 'Task 01 output heading is missing.'
                $exitCode = 1
            }
            else {
                $task01OutputValidationResult = 'PASS'
                $finalStatus = 'SUCCESS'
                $failureReason = $null
                $exitCode = 0
            }
        }

        Append-RunLog "Task 01 execution result: executed=$task01Executed output=$task01OutputPath validation=$task01OutputValidationResult"
    }
    elseif ($exitCode -eq 0) {
        $task01Executed = 'NO'
        $task01OutputValidationResult = 'NOT_EXECUTED'
        $finalStatus = 'SUCCESS'
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
        Append-RunLog "Final status: $finalStatus ExitCode=$exitCode ExecuteTaskId=$ExecuteTaskId Task01Executed=$task01Executed Task01Validation=$task01OutputValidationResult"
    }
}

if ($exitCode -eq 0) {
    Write-Host "A10 v1 run succeeded. RunId=$runId ExecuteTaskId=$ExecuteTaskId"
    exit 0
}

if ($exitCode -eq 1) {
    Write-Host "A10 v1 run validation failed. RunId=$runId Reason=$failureReason"
    exit 1
}

Write-Host "A10 v1 run hard stop. RunId=$runId Reason=$failureReason"
exit 2
