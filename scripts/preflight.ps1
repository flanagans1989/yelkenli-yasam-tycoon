$ErrorActionPreference = "Stop"

function Write-Section {
    param(
        [string]$Title
    )

    Write-Host ""
    Write-Host "========================================"
    Write-Host $Title
    Write-Host "========================================"
}

Write-Section "Preflight: Git Status"
git status

Write-Section "Preflight: Build"
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Build failed. Stopping preflight."
    exit $LASTEXITCODE
}

Write-Host ""
Write-Host "Preflight completed successfully."
