param(
    [string]$RepoPath         = 'C:\dev\yelkenli-yasam-tycoon',
    [string]$ExpectedBranch   = 'agent/day-01',
    [string]$QueuePath        = 'docs/agent/a10/queues/A10_NIGHT_SHIFT_SAFE_QUEUE_01.json',
    [string]$OllamaUrl        = 'http://localhost:11434',
    [string]$OllamaModel      = 'qwen2.5-coder:7b',
    [bool]  $DryRun           = $true,
    [int]   $OllamaTimeoutSec = 600
)

$ErrorActionPreference = 'Stop'
$ProgressPreference    = 'SilentlyContinue'

$AllowedOutputPrefix = 'docs/agent/a10/night-shift-01/'
$CanonicalTaskTypes  = @('docs-only','css-patch-proposal','css-patch-apply','script-only','build-check','audit/checklist')

$runId        = 'A10-EXEC-' + (Get-Date -Format 'yyyyMMdd-HHmmss')
$startedAt    = Get-Date
$timestampIso = $startedAt.ToString('o')

$runLogDir       = Join-Path $RepoPath 'logs/agent/a10/runs'
$reportDir       = Join-Path $RepoPath 'docs/agent/a10/runs'
$runLogPath      = Join-Path $runLogDir "$runId.log"
$finalReportPath = Join-Path $reportDir "$runId-execute-report.md"

$finalStatus      = 'UNKNOWN'
$taskResults      = [System.Collections.Generic.List[hashtable]]::new()
$hardStopOccurred = $false
$hardStopReason   = $null
$currentBranch    = ''
$queueObj         = $null
$baselineDirty    = [System.Collections.Generic.HashSet[string]]::new()

function Ensure-Dir([string]$p) {
    if (-not (Test-Path -LiteralPath $p)) {
        New-Item -Path $p -ItemType Directory -Force | Out-Null
    }
}

function Write-Log([string]$msg) {
    $line = '[{0}] {1}' -f (Get-Date -Format 'yyyy-MM-ddTHH:mm:ssK'), $msg
    $fs = [System.IO.FileStream]::new($runLogPath, [System.IO.FileMode]::Append, [System.IO.FileAccess]::Write, [System.IO.FileShare]::ReadWrite)
    $sw = [System.IO.StreamWriter]::new($fs, [System.Text.Encoding]::UTF8)
    try { $sw.WriteLine($line) } finally { $sw.Dispose(); $fs.Dispose() }
}

function Get-MinLineCount([string]$rule) {
    if ($rule -match '(\d+)\s*satir') { return [int]$Matches[1] }
    if ($rule -match '(\d+)\s*line')  { return [int]$Matches[1] }
    return 10
}

function Build-TaskPrompt($task) {
    $ctx = ''
    $maxContextChars = 1500
    foreach ($f in $task.allowed_input_context) {
        $fp = Join-Path $RepoPath $f
        if (Test-Path -LiteralPath $fp) {
            $content = [System.IO.File]::ReadAllText($fp, [System.Text.Encoding]::UTF8)
            if ($content.Length -gt $maxContextChars) {
                $content = $content.Substring(0, $maxContextChars) + "`n...(truncated)"
            }
            $ctx += ('=== ' + $f + ' ===' + "`n" + $content + "`n`n")
        } else {
            $ctx += ('=== ' + $f + ' === (not found)' + "`n`n")
        }
    }

    $lines = @(
        'Sen "Yelkenli Yasam Tycoon" mobil oyun gelistirme projesi icin teknik dokumantasyon yazarisin.',
        '',
        ('GOREV: ' + $task.task_id + ' - ' + $task.title),
        ('HEDEF: ' + $task.goal),
        ('CIKTI DOSYASI: ' + $task.allowed_output_file),
        ('GOREV TIPI: ' + $task.task_type),
        ('KOMUT TIPI: ' + $task.agent_command_type),
        '',
        'BAGIAM DOSYALARI:',
        $ctx,
        ('DOGRULAMA KURALI: ' + $task.validation_rule),
        ('MINIMUM CIKTI: ' + $task.minimum_output_rule),
        ('YASAK KAPSAM: ' + ($task.forbidden_scope -join ', ')),
        '',
        'KURALLAR:',
        '- Turkce yaz.',
        '- Markdown formatinda yaz, basliklar kullan (##, ###).',
        ('- Yalnizca ' + $task.allowed_output_file + ' dosyasinin icerigini yaz.'),
        '- Onsoz, aciklama veya meta yorum ekleme. Dogrudan icerikle basla.',
        ('- ' + $task.minimum_output_rule + ' sartini zorunlu karsilamayi tut.'),
        '- Her baslik altinda somut, pratik icerik yaz.'
    )
    return $lines -join "`n"
}

function Invoke-Ollama([string]$prompt) {
    $pyScript = Join-Path $RepoPath 'scripts/agent/a10/ollama_call.py'
    if (-not (Test-Path -LiteralPath $pyScript)) { throw ('ollama_call.py not found: ' + $pyScript) }

    $inputObj  = [ordered]@{ model = $OllamaModel; prompt = $prompt; url = $OllamaUrl }
    $inputJson = $inputObj | ConvertTo-Json -Depth 3 -Compress

    $result = $inputJson | python $pyScript 2>&1
    if ($LASTEXITCODE -ne 0) { throw ('ollama_call.py failed exit=' + $LASTEXITCODE + ' err=' + ($result -join ' ')) }

    $text = $result -join "`n"
    if ([string]::IsNullOrWhiteSpace($text)) { throw 'ollama_call.py returned empty response' }
    return $text
}

function Get-DirtyFiles {
    $raw = & git -C $RepoPath status --porcelain --untracked-files=all 2>&1
    return @($raw | Where-Object { $_ -and $_.Trim() -ne '' })
}

$ForbiddenPrefixes = @('src/','public/','dist/','node_modules/')
$ForbiddenFiles    = @('package.json','package-lock.json','vite.config.ts','tsconfig.json','tsconfig.node.json')

function Test-ForbiddenChanges([string]$allowedOutputFile) {
    $dirty    = Get-DirtyFiles
    $problems = @()
    foreach ($line in $dirty) {
        if (-not $line -or $line.Trim() -eq '') { continue }
        $relPath = $line.Substring(3).Trim().Replace('\','/')
        if ($baselineDirty.Contains($relPath)) { continue }
        $norm = $relPath.Replace('\','/')
        $bad  = $false
        foreach ($fp in $ForbiddenPrefixes) { if ($norm.StartsWith($fp)) { $bad = $true; break } }
        if (-not $bad -and ($ForbiddenFiles -contains $norm)) { $bad = $true }
        if ($bad) { $problems += $relPath }
    }
    return $problems
}

function Write-FinalReport {
    $durationSec = [int]((Get-Date) - $startedAt).TotalSeconds

    $rows = @()
    foreach ($r in $taskResults) {
        $rows += ('| ' + $r.task_id + ' | ' + $r.status + ' | ' + $r.lines + ' | ' + $r.notes + ' |')
    }
    $tableHeader = '| Task | Status | Lines | Notes |'
    $tableSep    = '|------|--------|-------|-------|'
    $table       = if ($rows.Count -gt 0) { ($tableHeader + "`n" + $tableSep + "`n" + ($rows -join "`n")) } else { '(none)' }

    $sc = ($taskResults | Where-Object { $_.status -eq 'SUCCESS'   }).Count
    $fc = ($taskResults | Where-Object { $_.status -eq 'SOFT_FAIL' }).Count
    $hc = ($taskResults | Where-Object { $_.status -eq 'HARD_STOP' }).Count
    $sk = ($taskResults | Where-Object { $_.status -eq 'SKIPPED'   }).Count

    $hsNote = if ($hardStopOccurred) { 'HARD STOP: ' + $hardStopReason } else { 'No hard stop.' }

    $bodyLines = @(
        '# A10 Night Shift Execute Report',
        '',
        ('- Run ID       : ' + $runId),
        ('- Started      : ' + $timestampIso),
        ('- Duration     : ' + $durationSec + 's'),
        ('- Branch       : ' + $currentBranch),
        ('- Queue        : ' + $QueuePath),
        ('- Model        : ' + $OllamaModel),
        ('- DryRun       : ' + $DryRun),
        ('- Final status : ' + $finalStatus),
        '',
        '## Task Results',
        '',
        $table,
        '',
        '## Counts',
        '',
        ('- SUCCESS   : ' + $sc),
        ('- SOFT_FAIL : ' + $fc),
        ('- HARD_STOP : ' + $hc),
        ('- SKIPPED   : ' + $sk),
        ('- Total     : ' + $taskResults.Count),
        '',
        '## Hard Stop',
        '',
        $hsNote
    )
    Set-Content -Path $finalReportPath -Value ($bodyLines -join "`n") -Encoding UTF8
}

# ============================================================
# MAIN
# ============================================================

try {
    if (-not (Test-Path -LiteralPath $RepoPath)) { throw ('RepoPath not found: ' + $RepoPath) }

    Ensure-Dir (Join-Path $RepoPath 'logs/agent/a10')
    Ensure-Dir $runLogDir
    Ensure-Dir $reportDir

    Set-Content -Path $runLogPath -Value ('[' + $timestampIso + '] A10 execute runner v1 started. DryRun=' + $DryRun + ' Model=' + $OllamaModel) -Encoding UTF8

    foreach ($bl in (Get-DirtyFiles)) {
        if ($bl -and $bl.Trim() -ne '') {
            $baselineDirty.Add($bl.Substring(3).Trim().Replace('\','/')) | Out-Null
        }
    }
    Write-Log ('Baseline dirty files: ' + $baselineDirty.Count)

    if (-not (Test-Path -LiteralPath (Join-Path $RepoPath '.git'))) { throw '.git directory not found' }

    $currentBranch = (& git -C $RepoPath branch --show-current).Trim()
    if ([string]::IsNullOrWhiteSpace($currentBranch)) { throw 'Cannot resolve current branch.' }
    if ($currentBranch -ne $ExpectedBranch) {
        throw ('Branch mismatch. Expected=' + $ExpectedBranch + ' Got=' + $currentBranch)
    }
    Write-Log ('Branch OK: ' + $currentBranch)

    $queueFullPath = Join-Path $RepoPath $QueuePath
    if (-not (Test-Path -LiteralPath $queueFullPath)) { throw ('Queue file not found: ' + $queueFullPath) }

    $queueJson = [System.IO.File]::ReadAllText($queueFullPath, [System.Text.Encoding]::UTF8)
    $queueObj  = $queueJson | ConvertFrom-Json
    Write-Log 'Queue JSON parsed OK.'

    if ([string]::IsNullOrWhiteSpace($queueObj.queue_id)) { throw 'Queue missing queue_id' }
    if ($queueObj.created_for_branch -ne $ExpectedBranch) {
        throw ('Queue branch mismatch. Queue=' + $queueObj.created_for_branch + ' Expected=' + $ExpectedBranch)
    }
    if ($queueObj.safety_level -ne 'SAFE_DOCS_ONLY') {
        throw ('Unexpected safety_level: ' + $queueObj.safety_level + ' - expected SAFE_DOCS_ONLY')
    }
    if ($null -eq $queueObj.tasks -or $queueObj.tasks.Count -eq 0) { throw 'Queue has no tasks' }
    Write-Log ('Queue header OK. ID=' + $queueObj.queue_id + ' Tasks=' + $queueObj.tasks.Count)

    $cardErrors = @()
    foreach ($t in $queueObj.tasks) {
        $id = if ($t.task_id) { $t.task_id } else { '(no-id)' }
        if ([string]::IsNullOrWhiteSpace($t.task_id))             { $cardErrors += ($id + ': missing task_id') }
        if ([string]::IsNullOrWhiteSpace($t.title))               { $cardErrors += ($id + ': missing title') }
        if ([string]::IsNullOrWhiteSpace($t.allowed_output_file)) { $cardErrors += ($id + ': missing allowed_output_file') }
        elseif (-not $t.allowed_output_file.Replace('\','/').StartsWith($AllowedOutputPrefix)) {
            $cardErrors += ($id + ': output path outside allowed prefix')
        }
        elseif ($t.allowed_output_file -match '\.\.') { $cardErrors += ($id + ': path traversal in output path') }
        elseif ($t.allowed_output_file -match '^[A-Za-z]:\\') { $cardErrors += ($id + ': absolute path in output') }
        if ($CanonicalTaskTypes -notcontains $t.task_type) {
            $cardErrors += ($id + ': non-canonical task_type ' + $t.task_type)
        }
        if ([string]::IsNullOrWhiteSpace($t.validation_rule)) { $cardErrors += ($id + ': missing validation_rule') }
        if ([string]::IsNullOrWhiteSpace($t.hard_stop_rule))  { $cardErrors += ($id + ': missing hard_stop_rule') }
        if ([string]::IsNullOrWhiteSpace($t.soft_fail_rule))  { $cardErrors += ($id + ': missing soft_fail_rule') }
    }
    if ($cardErrors.Count -gt 0) {
        throw ('Task card validation failed: ' + ($cardErrors -join '; '))
    }
    Write-Log ('All ' + $queueObj.tasks.Count + ' task cards validated OK.')

    if ($DryRun) {
        Write-Log 'DryRun=true - skipping execution, logging task list only.'
        foreach ($t in $queueObj.tasks) {
            Write-Log ('  WOULD RUN: ' + $t.task_id + ' -> ' + $t.allowed_output_file)
            $taskResults.Add(@{ task_id = $t.task_id; status = 'SKIPPED'; lines = 0; notes = 'dry-run mode' })
        }
        $finalStatus = 'DRY_RUN_QUEUE_VALIDATED'
    }

    if (-not $DryRun) {
        $ollamaOk = $false
        try {
            $tags       = Invoke-RestMethod -Uri "$OllamaUrl/api/tags" -TimeoutSec 10 -UseBasicParsing
            $modelNames = $tags.models | ForEach-Object { $_.name }
            if ($modelNames -notcontains $OllamaModel) {
                throw ('Model ' + $OllamaModel + ' not found. Available: ' + ($modelNames -join ', '))
            }
            Write-Log ('Ollama OK. Model confirmed: ' + $OllamaModel)
            $ollamaOk = $true
        } catch {
            throw ('Ollama preflight failed: ' + $_.Exception.Message)
        }

        $outputDir = Join-Path $RepoPath ($AllowedOutputPrefix.TrimEnd('/'))
        Ensure-Dir $outputDir
        Write-Log ('Output dir ready: ' + $outputDir)

        foreach ($task in $queueObj.tasks) {
            Write-Log ('--- START ' + $task.task_id + ': ' + $task.title + ' ---')

            $taskStatus = 'UNKNOWN'
            $taskLines  = 0
            $taskNotes  = ''

            try {
                $prompt = Build-TaskPrompt $task
                Write-Log ($task.task_id + ': prompt ready chars=' + $prompt.Length)

                Write-Log ($task.task_id + ': calling Ollama...')
                $aiResponse = Invoke-Ollama $prompt
                Write-Log ($task.task_id + ': response received chars=' + $aiResponse.Length)

                if ([string]::IsNullOrWhiteSpace($aiResponse)) {
                    throw ('Ollama returned empty response for ' + $task.task_id)
                }

                $outFullPath = Join-Path $RepoPath $task.allowed_output_file
                [System.IO.File]::WriteAllText($outFullPath, $aiResponse, [System.Text.Encoding]::UTF8)
                Write-Log ($task.task_id + ': written to ' + $task.allowed_output_file)

                $taskLines = ($aiResponse -split "`n").Count
                $minLines  = Get-MinLineCount $task.minimum_output_rule

                if ($taskLines -lt $minLines) {
                    $taskStatus = 'SOFT_FAIL'
                    $taskNotes  = 'lines=' + $taskLines + ' min=' + $minLines
                    Write-Log ($task.task_id + ': SOFT_FAIL - ' + $taskNotes)
                } else {
                    $taskStatus = 'SUCCESS'
                    Write-Log ($task.task_id + ': SUCCESS lines=' + $taskLines)
                }

                $forbidden = Test-ForbiddenChanges $task.allowed_output_file
                if ($forbidden.Count -gt 0) {
                    $hardStopOccurred = $true
                    $hardStopReason   = 'Forbidden area changes after ' + $task.task_id + ': ' + ($forbidden -join '; ')
                    $taskStatus = 'HARD_STOP'
                    $taskNotes  = $hardStopReason
                    Write-Log ('HARD_STOP: ' + $hardStopReason)
                    $taskResults.Add(@{ task_id = $task.task_id; status = $taskStatus; lines = $taskLines; notes = $taskNotes })
                    break
                }
            }
            catch {
                $errMsg = $_.Exception.Message
                $isTimeout = ($errMsg -match 'zaman' -or $errMsg -match 'timeout' -or $errMsg -match 'Timeout' -or $errMsg -match 'timed out')
                if ($isTimeout) {
                    $taskStatus = 'SOFT_FAIL'
                    $taskNotes  = 'TIMEOUT: ' + $errMsg
                    Write-Log ($task.task_id + ': SOFT_FAIL timeout - continuing to next task')
                    $taskResults.Add(@{ task_id = $task.task_id; status = $taskStatus; lines = 0; notes = $taskNotes })
                } else {
                    $hardStopOccurred = $true
                    $hardStopReason   = 'Exception in ' + $task.task_id + ': ' + $errMsg
                    $taskStatus = 'HARD_STOP'
                    $taskNotes  = $errMsg
                    Write-Log ('HARD_STOP exception: ' + $hardStopReason)
                    $taskResults.Add(@{ task_id = $task.task_id; status = $taskStatus; lines = $taskLines; notes = $taskNotes })
                    break
                }
            }

            $taskResults.Add(@{ task_id = $task.task_id; status = $taskStatus; lines = $taskLines; notes = $taskNotes })
        }

        $finalStatus = if ($hardStopOccurred) { 'HARD_STOP' } else { 'COMPLETED' }
    }
}
catch {
    $finalStatus    = 'PREFLIGHT_FAILED'
    $hardStopReason = $_.Exception.Message
    if (Test-Path -LiteralPath $runLogPath) {
        Add-Content -Path $runLogPath -Value ('[' + (Get-Date -Format 'o') + '] FATAL: ' + $hardStopReason) -Encoding UTF8
    }
}
finally {
    Write-FinalReport
}

$exitCode = if ($finalStatus -in @('COMPLETED','DRY_RUN_QUEUE_VALIDATED')) { 0 } else { 1 }
Write-Host ('A10 execute runner done. RunId=' + $runId + ' Status=' + $finalStatus + ' DryRun=' + $DryRun)
Write-Host ('Report: ' + $finalReportPath)
exit $exitCode
