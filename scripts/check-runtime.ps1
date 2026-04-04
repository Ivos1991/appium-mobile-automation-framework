$ErrorActionPreference = 'Stop'

# Lightweight local readiness check for the single supported Android smoke path.
function Import-DotEnv {
  param([string]$Path)

  if (-not (Test-Path $Path)) {
    return
  }

  Get-Content $Path | ForEach-Object {
    $line = $_.Trim()

    if (-not $line -or $line.StartsWith('#')) {
      return
    }

    $parts = $line -split '=', 2

    if ($parts.Count -eq 2) {
      [Environment]::SetEnvironmentVariable($parts[0], $parts[1])
    }
  }
}

# Resolves a command without throwing when it is not available.
function Get-CommandLocation {
  param([string]$Name)

  $command = Get-Command $Name -ErrorAction SilentlyContinue

  if ($null -eq $command) {
    return $null
  }

  return $command.Source
}

Import-DotEnv '.env'

$repoRoot = (Get-Location).Path
$configuredAppPath = if ($env:ANDROID_APP_PATH) { $env:ANDROID_APP_PATH } else { 'apps/android/wdio-demo-app.apk' }
$appPath = [System.IO.Path]::GetFullPath((Join-Path $repoRoot $configuredAppPath))
$appiumCommand = if ($env:APPIUM_COMMAND) { $env:APPIUM_COMMAND } else { 'appium' }
$appiumHost = if ($env:APPIUM_HOST) { $env:APPIUM_HOST } else { '127.0.0.1' }
$appiumPort = if ($env:APPIUM_PORT) { $env:APPIUM_PORT } else { '4723' }
$automationName = if ($env:ANDROID_AUTOMATION_NAME) { $env:ANDROID_AUTOMATION_NAME } else { 'UiAutomator2' }
$deviceName = if ($env:ANDROID_DEVICE_NAME) { $env:ANDROID_DEVICE_NAME } else { 'Android Emulator' }
$platformVersion = if ($env:ANDROID_PLATFORM_VERSION) { $env:ANDROID_PLATFORM_VERSION } else { '(not set)' }
$localAppiumCommand = Join-Path $repoRoot 'node_modules/.bin/appium.cmd'
$localAndroidSdkRoot = Join-Path $repoRoot 'tools/android-sdk'
$localAdbCommand = Join-Path $localAndroidSdkRoot 'platform-tools/adb.exe'
$configuredAndroidSdkRoot = if ($env:ANDROID_SDK_ROOT) { $env:ANDROID_SDK_ROOT } elseif ($env:ANDROID_HOME) { $env:ANDROID_HOME } else { 'tools/android-sdk' }
$configuredAndroidUserHome = if ($env:ANDROID_USER_HOME) { $env:ANDROID_USER_HOME } else { 'artifacts/android-user-home' }
$androidUserHomePath = [System.IO.Path]::GetFullPath((Join-Path $repoRoot $configuredAndroidUserHome))

New-Item -ItemType Directory -Force $androidUserHomePath | Out-Null
$env:ANDROID_USER_HOME = $androidUserHomePath
$env:ANDROID_HOME = if ($env:ANDROID_HOME) { $env:ANDROID_HOME } else { [System.IO.Path]::GetFullPath((Join-Path $repoRoot $configuredAndroidSdkRoot)) }
$env:ANDROID_SDK_ROOT = if ($env:ANDROID_SDK_ROOT) { $env:ANDROID_SDK_ROOT } else { [System.IO.Path]::GetFullPath((Join-Path $repoRoot $configuredAndroidSdkRoot)) }
$env:HOME = $androidUserHomePath
$env:USERPROFILE = $androidUserHomePath

$checks = New-Object System.Collections.Generic.List[object]

$checks.Add([pscustomobject]@{
  Name = 'APK path exists'
  Ok = Test-Path $appPath
  Detail = "$configuredAppPath -> $appPath"
  Output = $null
})

$appiumResolved = Get-CommandLocation $appiumCommand
if (-not $appiumResolved -and $appiumCommand -eq 'appium' -and (Test-Path $localAppiumCommand)) {
  $appiumResolved = $localAppiumCommand
}

$checks.Add([pscustomobject]@{
  Name = 'Appium command available'
  Ok = [bool]$appiumResolved
  Detail = "command=$appiumCommand host=$appiumHost port=$appiumPort"
  Output = $appiumResolved
})

$adbResolved = Get-CommandLocation 'adb'
if (-not $adbResolved -and (Test-Path $localAdbCommand)) {
  $adbResolved = $localAdbCommand
}

$checks.Add([pscustomobject]@{
  Name = 'adb available'
  Ok = [bool]$adbResolved
  Detail = "device=$deviceName platformVersion=$platformVersion automation=$automationName sdk=$configuredAndroidSdkRoot"
  Output = $adbResolved
})

if ($adbResolved) {
  $adbOutput = & cmd /c """$adbResolved"" devices 2>&1" | Out-String
  $adbOutput = $adbOutput.Trim()
  $adbCallable = $LASTEXITCODE -eq 0 -or $adbOutput.Contains('List of devices attached')

  $checks.Add([pscustomobject]@{
    Name = 'adb device list callable'
    Ok = $adbCallable
    Detail = 'adb devices'
    Output = $adbOutput
  })

  if ($adbCallable) {
    $connectedDevice = $adbOutput -split "`r?`n" | Where-Object { $_ -match "`tdevice$" }

    $checks.Add([pscustomobject]@{
      Name = 'Android emulator/device detected'
      Ok = [bool]$connectedDevice
      Detail = "expected target name=$deviceName"
      Output = $adbOutput
    })
  }
}

$failed = $false
Write-Output 'Runtime readiness'

foreach ($check in $checks) {
  $status = if ($check.Ok) { 'PASS' } else { 'FAIL' }
  Write-Output ("- {0}: {1}" -f $status, $check.Name)
  Write-Output "  $($check.Detail)"

  if ($check.Output) {
    Write-Output "  $($check.Output)"
  }

  if (-not $check.Ok) {
    $failed = $true
  }
}

if ($failed) {
  Write-Error 'Runtime setup is not ready yet. Fix the failed checks above before running `npm run test:smoke`.'
}

Write-Output ''
Write-Output 'Runtime setup looks ready for a local smoke run with `npm run test:smoke`.'
