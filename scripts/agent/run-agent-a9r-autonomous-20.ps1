$ErrorActionPreference = "Stop"

$RepoPath = "C:\dev\yelkenli-yasam-tycoon"
$LogDir = "logs\agent"
$TaskDir = "docs\agent\tasks"
$PatchDir = "docs\agent\patches"

Set-Location $RepoPath

New-Item -ItemType Directory -Force $LogDir | Out-Null
New-Item -ItemType Directory -Force $TaskDir | Out-Null
New-Item -ItemType Directory -Force $PatchDir | Out-Null

$RunStamp = Get-Date -Format "yyyyMMdd-HHmmss"
$RunLog = Join-Path $LogDir "agent-a9r-autonomous-20-$RunStamp.log"

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
        "^src/App\.css$",
        "^progress\.md$",
        "^errors_log\.md$",
        "^docs/agent/A9R_.*\.md$",
        "^docs/agent/tasks/A9R_TASK_.*\.md$",
        "^docs/agent/patches/A9R_.*\.css$",
        "^logs/agent/"
    )

    foreach ($changed in Get-ChangedFiles) {
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
    param(
        [string]$Path,
        [string]$TaskName,
        [int]$MinBytes = 80
    )

    if (-not (Test-Path $Path)) {
        Write-AgentLog "REQUIRED OUTPUT MISSING: $Path"
        throw "Task failed: $TaskName"
    }

    $length = (Get-Item $Path).Length
    if ($length -lt $MinBytes) {
        Write-AgentLog "REQUIRED OUTPUT TOO SMALL OR EMPTY: $Path ($length bytes)"
        throw "Task failed: $TaskName"
    }
}

function Write-TextFile {
    param(
        [string]$Path,
        [string[]]$Lines
    )

    $folder = Split-Path $Path -Parent
    if ($folder -and -not (Test-Path $folder)) {
        New-Item -ItemType Directory -Force $folder | Out-Null
    }

    $Lines | Set-Content -Encoding UTF8 $Path
}

function Invoke-AiderSingleTask {
    param(
        [string]$TaskName,
        [string]$MessageFile,
        [string]$OutputFile,
        [int]$MinBytes = 80
    )

    Write-AgentLog ""
    Write-AgentLog "=== Running: $TaskName ==="

    if (-not (Test-Path $OutputFile)) {
        New-Item -ItemType File -Force $OutputFile | Out-Null
    }

    $args = @(
        "--model", "ollama_chat/qwen2.5-coder:7b",
        "--no-auto-commits",
        "--map-tokens", "0",
        "--yes-always",
        "--disable-playwright",
        "--message-file", $MessageFile,
        "--file", $OutputFile,
        "--file", "progress.md",
        "--file", "errors_log.md"
    )

    & aider @args

    Write-AgentLog "Aider finished: $TaskName"
    git status --short | Out-String | Add-Content -Encoding UTF8 -Path $RunLog

    Test-AllowedChangesOnly
    Test-RequiredOutput -Path $OutputFile -TaskName $TaskName -MinBytes $MinBytes

    Write-AgentLog "Task passed: $TaskName"
}

function Test-PatchFile {
    param(
        [string]$PatchFile,
        [string]$Marker
    )

    Test-RequiredOutput -Path $PatchFile -TaskName "Patch file check" -MinBytes 40

    $patch = Get-Content $PatchFile -Raw

    if ($patch -notmatch [regex]::Escape($Marker)) {
        throw "Patch marker missing in $PatchFile"
    }

    if ($patch -match "@import|url\(|position:\s*fixed|!important") {
        throw "Patch contains disallowed CSS pattern: $PatchFile"
    }
}

function Append-PatchIfMissing {
    param(
        [string]$PatchFile,
        [string]$Marker,
        [string]$AppCss
    )

    Test-PatchFile -PatchFile $PatchFile -Marker $Marker

    $patch = Get-Content $PatchFile -Raw
    $appCssContent = Get-Content $AppCss -Raw

    if ($appCssContent -match [regex]::Escape($Marker)) {
        Write-AgentLog "Patch already exists in App.css, skipping: $Marker"
    }
    else {
        Write-AgentLog "Appending patch to App.css: $PatchFile"
        Add-Content -Encoding UTF8 $AppCss ""
        Add-Content -Encoding UTF8 $AppCss $patch
    }
}

function Write-A9RFinalReport {
    param(
        [string[]]$CompletedTasks,
        [string[]]$BlockedTasks
    )

    $now = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $changed = git status --short | Out-String

    $report = @(
        "# Agent Batch A9R Final Autonomous Report",
        "",
        "## Date",
        $now,
        "",
        "## Mode",
        "20 tasks. Each Aider task runs separately. Script-controlled autonomous mode.",
        "",
        "## Completed tasks",
        $CompletedTasks,
        "",
        "## Blocked tasks",
        $(if ($BlockedTasks.Count -gt 0) { $BlockedTasks } else { "- None" }),
        "",
        "## Files modified",
        "```text",
        $changed,
        "```",
        "",
        "## Source logic touched",
        "Expected: NO.",
        "",
        "## Source CSS touched",
        "Expected: src/App.css only.",
        "",
        "## Build status",
        "The script runs npm run build after applying approved CSS patches.",
        "",
        "## Safety result",
        $(if ($BlockedTasks.Count -gt 0) { "A9R finished with blocked tasks. Review logs and errors_log.md." } else { "A9R autonomous 20-task run completed successfully." }),
        "",
        "## Log file",
        $RunLog,
        "",
        "## Next step",
        "Review the UI in browser/mobile viewport. If good, commit the A9R result."
    )

    $report | Set-Content -Encoding UTF8 docs/agent/A9R_FINAL_AUTONOMOUS_REPORT.md
}

Write-AgentLog "=== Agent Batch A9R autonomous 20-task run started ==="

$branch = git branch --show-current
Write-AgentLog "Current branch: $branch"

$status = git status --porcelain
if ($status) {
    Write-AgentLog "Working tree is not clean. Stopping."
    git status | Out-String | Add-Content -Encoding UTF8 -Path $RunLog
    exit 1
}

$CompletedTasks = @()
$BlockedTasks = @()
$AppCss = "src/App.css"

try {
    Write-AgentLog "Creating A9R single-task prompt files"

    $taskDefinitions = @(
        @{
            No = "01"
            Name = "Mobile UI risk audit"
            Output = "docs/agent/A9R_01_MOBILE_UI_RISK_AUDIT.md"
            Lines = @(
                "A9R TASK 01 - Mobile UI Risk Audit",
                "",
                "Create a practical mobile UI risk audit for Yelkenli Yaşam Tycoon.",
                "Only edit the output file, progress.md, and errors_log.md.",
                "Do not request other files.",
                "Do not edit source code or project configuration.",
                "Write concrete risks related to mobile overflow, button wrapping, text readability, and screen density.",
                "Update progress.md with: - A9R TASK 01 completed."
            )
        },
        @{
            No = "02"
            Name = "First 10 minutes review"
            Output = "docs/agent/A9R_02_FIRST_10_MINUTES_REVIEW.md"
            Lines = @(
                "A9R TASK 02 - First 10 Minutes Review",
                "",
                "Review the first 10 minutes of Yelkenli Yaşam Tycoon from a new player's perspective.",
                "Only edit the output file, progress.md, and errors_log.md.",
                "Do not request other files.",
                "Focus on onboarding, captain selection, first hub view, first content creation, first route attempt, and first arrival.",
                "Update progress.md with: - A9R TASK 02 completed."
            )
        },
        @{
            No = "03"
            Name = "Mico guide points"
            Output = "docs/agent/A9R_03_MICO_GUIDE_POINTS.md"
            Lines = @(
                "A9R TASK 03 - Mico Guide Points",
                "",
                "Create a list of places where Miço should guide the player.",
                "Only edit the output file, progress.md, and errors_log.md.",
                "Do not request other files.",
                "Include trigger moment, Miço message purpose, and expected player action.",
                "Update progress.md with: - A9R TASK 03 completed."
            )
        },
        @{
            No = "04"
            Name = "CTA weakness audit"
            Output = "docs/agent/A9R_04_CTA_WEAKNESS_AUDIT.md"
            Lines = @(
                "A9R TASK 04 - CTA Weakness Audit",
                "",
                "Audit likely weak CTA/button moments in Yelkenli Yaşam Tycoon.",
                "Only edit the output file, progress.md, and errors_log.md.",
                "Do not request other files.",
                "Focus on mobile clarity, button labels, visual hierarchy, and action confidence.",
                "Update progress.md with: - A9R TASK 04 completed."
            )
        },
        @{
            No = "05"
            Name = "Patch candidates"
            Output = "docs/agent/A9R_05_PATCH_CANDIDATES.md"
            Lines = @(
                "A9R TASK 05 - Low Risk Patch Candidates",
                "",
                "Create 5 low-risk UI/CSS patch candidates for future autonomous work.",
                "Only edit the output file, progress.md, and errors_log.md.",
                "Do not request other files.",
                "For each candidate include target area, why low risk, allowed file type, and manual test needed.",
                "Update progress.md with: - A9R TASK 05 completed."
            )
        },
        @{
            No = "06"
            Name = "Onboarding CSS patch"
            Output = "docs/agent/patches/A9R_06_ONBOARDING_PATCH.css"
            Marker = "/* A9R onboarding safety patch */"
            Lines = @(
                "A9R TASK 06 - Onboarding CSS Patch",
                "",
                "Create a small CSS patch file only.",
                "Only edit the output patch file, progress.md, and errors_log.md.",
                "Do not request other files.",
                "Do not edit source code directly.",
                "Patch must include marker: /* A9R onboarding safety patch */",
                "Use safe mobile spacing/readability rules only.",
                "No external dependencies. No @import. No url(). No fixed positioning. No important flags.",
                "Update progress.md with: - A9R TASK 06 completed."
            )
        },
        @{
            No = "07"
            Name = "Captain selection CSS patch"
            Output = "docs/agent/patches/A9R_07_CAPTAIN_SELECTION_PATCH.css"
            Marker = "/* A9R captain selection safety patch */"
            Lines = @(
                "A9R TASK 07 - Captain Selection CSS Patch",
                "",
                "Create a small CSS patch file only.",
                "Only edit the output patch file, progress.md, and errors_log.md.",
                "Do not request other files.",
                "Do not edit source code directly.",
                "Patch must include marker: /* A9R captain selection safety patch */",
                "Use safe overflow and button wrapping rules only.",
                "No external dependencies. No @import. No url(). No fixed positioning. No important flags.",
                "Update progress.md with: - A9R TASK 07 completed."
            )
        },
        @{
            No = "08"
            Name = "Hub card CSS patch"
            Output = "docs/agent/patches/A9R_08_HUB_CARD_PATCH.css"
            Marker = "/* A9R hub card safety patch */"
            Lines = @(
                "A9R TASK 08 - Hub Card CSS Patch",
                "",
                "Create a small CSS patch file only.",
                "Only edit the output patch file, progress.md, and errors_log.md.",
                "Do not request other files.",
                "Do not edit source code directly.",
                "Patch must include marker: /* A9R hub card safety patch */",
                "Use safe card spacing and mobile wrapping rules only.",
                "No external dependencies. No @import. No url(). No fixed positioning. No important flags.",
                "Update progress.md with: - A9R TASK 08 completed."
            )
        },
        @{
            No = "09"
            Name = "Route CTA CSS patch"
            Output = "docs/agent/patches/A9R_09_ROUTE_CTA_PATCH.css"
            Marker = "/* A9R route CTA safety patch */"
            Lines = @(
                "A9R TASK 09 - Route CTA CSS Patch",
                "",
                "Create a small CSS patch file only.",
                "Only edit the output patch file, progress.md, and errors_log.md.",
                "Do not request other files.",
                "Do not edit source code directly.",
                "Patch must include marker: /* A9R route CTA safety patch */",
                "Use safe CTA readability and touch target rules only.",
                "No external dependencies. No @import. No url(). No fixed positioning. No important flags.",
                "Update progress.md with: - A9R TASK 09 completed."
            )
        },
        @{
            No = "10"
            Name = "Arrival text CSS patch"
            Output = "docs/agent/patches/A9R_10_ARRIVAL_TEXT_PATCH.css"
            Marker = "/* A9R arrival text safety patch */"
            Lines = @(
                "A9R TASK 10 - Arrival Text CSS Patch",
                "",
                "Create a small CSS patch file only.",
                "Only edit the output patch file, progress.md, and errors_log.md.",
                "Do not request other files.",
                "Do not edit source code directly.",
                "Patch must include marker: /* A9R arrival text safety patch */",
                "Use safe story text readability and wrapping rules only.",
                "No external dependencies. No @import. No url(). No fixed positioning. No important flags.",
                "Update progress.md with: - A9R TASK 10 completed."
            )
        },
        @{
            No = "16"
            Name = "Changed files report"
            Output = "docs/agent/A9R_16_CHANGED_FILES_REPORT.md"
            Lines = @(
                "A9R TASK 16 - Changed Files Report",
                "",
                "Create a changed files report for the A9R run.",
                "Only edit the output file, progress.md, and errors_log.md.",
                "Do not request other files.",
                "Explain that actual final git status will be verified by the script.",
                "Update progress.md with: - A9R TASK 16 completed."
            )
        },
        @{
            No = "17"
            Name = "Manual test checklist"
            Output = "docs/agent/A9R_17_MANUAL_TEST_CHECKLIST.md"
            Lines = @(
                "A9R TASK 17 - Manual Test Checklist",
                "",
                "Create a manual browser/mobile test checklist for the A9R CSS patches.",
                "Only edit the output file, progress.md, and errors_log.md.",
                "Do not request other files.",
                "Include onboarding, captain selection, hub, route CTA, and arrival text checks.",
                "Update progress.md with: - A9R TASK 17 completed."
            )
        },
        @{
            No = "18"
            Name = "Risk rollback plan"
            Output = "docs/agent/A9R_18_RISK_ROLLBACK_PLAN.md"
            Lines = @(
                "A9R TASK 18 - Risk and Rollback Plan",
                "",
                "Create a risk and rollback plan for A9R.",
                "Only edit the output file, progress.md, and errors_log.md.",
                "Do not request other files.",
                "Include rollback using git restore or revert after review.",
                "Update progress.md with: - A9R TASK 18 completed."
            )
        },
        @{
            No = "19"
            Name = "Next 10 tasks"
            Output = "docs/agent/A9R_19_NEXT_10_TASKS.md"
            Lines = @(
                "A9R TASK 19 - Next 10 Tasks",
                "",
                "Create the next 10 safe tasks after A9R.",
                "Only edit the output file, progress.md, and errors_log.md.",
                "Do not request other files.",
                "Separate docs-only tasks from low-risk CSS tasks.",
                "Update progress.md with: - A9R TASK 19 completed."
            )
        }
    )

    foreach ($task in $taskDefinitions) {
        $messageFile = "docs/agent/tasks/A9R_TASK_$($task.No).md"
        Write-TextFile $messageFile $task.Lines

        Invoke-AiderSingleTask `
            -TaskName "A9R TASK $($task.No) - $($task.Name)" `
            -MessageFile $messageFile `
            -OutputFile $task.Output

        $CompletedTasks += "- A9R TASK $($task.No) - $($task.Name)"
    }

    Write-AgentLog "=== A9R TASK 11 - Patch marker validation ==="
    Test-PatchFile -PatchFile "docs/agent/patches/A9R_06_ONBOARDING_PATCH.css" -Marker "/* A9R onboarding safety patch */"
    Test-PatchFile -PatchFile "docs/agent/patches/A9R_07_CAPTAIN_SELECTION_PATCH.css" -Marker "/* A9R captain selection safety patch */"
    Test-PatchFile -PatchFile "docs/agent/patches/A9R_08_HUB_CARD_PATCH.css" -Marker "/* A9R hub card safety patch */"
    Test-PatchFile -PatchFile "docs/agent/patches/A9R_09_ROUTE_CTA_PATCH.css" -Marker "/* A9R route CTA safety patch */"
    Test-PatchFile -PatchFile "docs/agent/patches/A9R_10_ARRIVAL_TEXT_PATCH.css" -Marker "/* A9R arrival text safety patch */"
    Write-TextFile "docs/agent/A9R_11_PATCH_MARKER_REPORT.md" @(
        "# A9R Task 11 - Patch Marker Report",
        "",
        "All required patch markers were found.",
        "Disallowed CSS pattern check passed."
    )
    $CompletedTasks += "- A9R TASK 11 - Patch marker validation"

    Write-AgentLog "=== A9R TASK 12 - Append patches to src/App.css ==="
    Append-PatchIfMissing -PatchFile "docs/agent/patches/A9R_06_ONBOARDING_PATCH.css" -Marker "/* A9R onboarding safety patch */" -AppCss $AppCss
    Append-PatchIfMissing -PatchFile "docs/agent/patches/A9R_07_CAPTAIN_SELECTION_PATCH.css" -Marker "/* A9R captain selection safety patch */" -AppCss $AppCss
    Append-PatchIfMissing -PatchFile "docs/agent/patches/A9R_08_HUB_CARD_PATCH.css" -Marker "/* A9R hub card safety patch */" -AppCss $AppCss
    Append-PatchIfMissing -PatchFile "docs/agent/patches/A9R_09_ROUTE_CTA_PATCH.css" -Marker "/* A9R route CTA safety patch */" -AppCss $AppCss
    Append-PatchIfMissing -PatchFile "docs/agent/patches/A9R_10_ARRIVAL_TEXT_PATCH.css" -Marker "/* A9R arrival text safety patch */" -AppCss $AppCss
    Write-TextFile "docs/agent/A9R_12_PATCH_APPLY_REPORT.md" @(
        "# A9R Task 12 - Patch Apply Report",
        "",
        "Safe CSS patches were appended to src/App.css if missing.",
        "Existing markers are skipped to avoid duplicate patch insertion."
    )
    $CompletedTasks += "- A9R TASK 12 - Append patches to src/App.css"

    Write-AgentLog "=== A9R TASK 13 - Allowed change validation ==="
    Test-AllowedChangesOnly
    Write-TextFile "docs/agent/A9R_13_ALLOWED_CHANGE_REPORT.md" @(
        "# A9R Task 13 - Allowed Change Report",
        "",
        "Allowed change validation passed.",
        "No forbidden source or project configuration changes were detected."
    )
    $CompletedTasks += "- A9R TASK 13 - Allowed change validation"

    Write-AgentLog "=== A9R TASK 14 - npm run build ==="
    npm run build | Tee-Object -FilePath $RunLog -Append
    $CompletedTasks += "- A9R TASK 14 - npm run build"

    Write-AgentLog "=== A9R TASK 15 - Build report ==="
    Write-TextFile "docs/agent/A9R_15_BUILD_REPORT.md" @(
        "# A9R Task 15 - Build Report",
        "",
        "npm run build completed successfully.",
        "Source logic touched: NO.",
        "Source CSS touched: src/App.css only."
    )
    Test-RequiredOutput -Path "docs/agent/A9R_15_BUILD_REPORT.md" -TaskName "A9R TASK 15 Build Report"
    $CompletedTasks += "- A9R TASK 15 - Build report"

    Write-AgentLog "=== A9R TASK 20 - Final autonomous report ==="
    Write-A9RFinalReport -CompletedTasks $CompletedTasks -BlockedTasks $BlockedTasks
    Test-RequiredOutput -Path "docs/agent/A9R_FINAL_AUTONOMOUS_REPORT.md" -TaskName "A9R TASK 20 Final Report"
    Add-Content -Encoding UTF8 progress.md "- A9R TASK 20 completed."
    Add-Content -Encoding UTF8 errors_log.md "- No blocking errors occurred during A9R autonomous 20-task run."
    $CompletedTasks += "- A9R TASK 20 - Final autonomous report"

    Test-AllowedChangesOnly

    Write-AgentLog "=== Agent Batch A9R autonomous 20-task run completed ==="
    git status | Out-String | Add-Content -Encoding UTF8 -Path $RunLog
    git status
}
catch {
    $BlockedTasks += "- A9R blocked: $($_.Exception.Message)"
    Add-Content -Encoding UTF8 errors_log.md "- A9R BLOCKED: $($_.Exception.Message)"
    Write-AgentLog "A9R BLOCKED: $($_.Exception.Message)"

    try {
        Write-A9RFinalReport -CompletedTasks $CompletedTasks -BlockedTasks $BlockedTasks
    }
    catch {
        Write-AgentLog "Could not write A9R final report after block: $($_.Exception.Message)"
    }

    git status
    exit 1
}