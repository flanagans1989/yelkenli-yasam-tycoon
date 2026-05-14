$ErrorActionPreference = "Stop"

function Get-AndroidVersionInfo {
    param(
        [string]$PackageVersion
    )

    if ($PackageVersion -notmatch '^\d+\.\d+\.\d+$') {
        throw "package.json version must be strict semver (x.y.z). Current value: $PackageVersion"
    }

    $parts = $PackageVersion.Split('.') | ForEach-Object { [int]$_ }
    $versionCode = ($parts[0] * 10000) + ($parts[1] * 100) + $parts[2]

    [PSCustomObject]@{
        VersionName = $PackageVersion
        VersionCode = $versionCode
    }
}

function Write-Section {
    param(
        [string]$Title
    )

    Write-Host ""
    Write-Host "========================================"
    Write-Host $Title
    Write-Host "========================================"
}

$packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
$androidVersion = Get-AndroidVersionInfo -PackageVersion $packageJson.version

Write-Section "Preflight: Android Version"
Write-Host "package.json version : $($androidVersion.VersionName)"
Write-Host "Android versionCode  : $($androidVersion.VersionCode)"

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
