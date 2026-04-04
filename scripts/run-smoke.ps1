$ErrorActionPreference = 'Stop'

# Loads local runtime settings without requiring the caller to export them manually.
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

# Normalizes relative repo paths before they are passed into Appium tooling.
function Resolve-ConfigPath {
  param(
    [string]$Root,
    [string]$Value
  )

  if ([System.IO.Path]::IsPathRooted($Value)) {
    return [System.IO.Path]::GetFullPath($Value)
  }

  return [System.IO.Path]::GetFullPath((Join-Path $Root $Value))
}

# Waits for a connected Android target to finish booting before WDIO starts.
function Wait-ForAndroidReady {
  param([string]$AdbPath)

  if (-not (Test-Path $AdbPath)) {
    return
  }

  & $AdbPath -P 5037 wait-for-device | Out-Null

  $deadline = (Get-Date).AddMinutes(3)

  do {
    $bootCompleted = (& $AdbPath -P 5037 shell getprop sys.boot_completed 2>$null | Out-String).Trim()
    $packageReady = (& $AdbPath -P 5037 shell pm path com.wdiodemoapp 2>$null | Out-String).Trim()

    if ($bootCompleted -eq '1' -and $packageReady) {
      Start-Sleep -Seconds 3
      return
    }

    Start-Sleep -Seconds 2
  } while ((Get-Date) -lt $deadline)

  throw 'Android emulator/device did not reach a ready state in time.'
}

# Returns only fully connected Android device serials.
function Get-ConnectedDeviceUdids {
  param([string]$AdbPath)

  if (-not (Test-Path $AdbPath)) {
    return @()
  }

  $deviceLines = & $AdbPath -P 5037 devices 2>$null

  return @(
    $deviceLines |
      Select-Object -Skip 1 |
      ForEach-Object { $_.Trim() } |
      Where-Object { $_ -and $_ -match "\sdevice$" } |
      ForEach-Object { ($_ -split "\s+")[0] }
  )
}

# Runs the single smoke scenario against the current Android target.
function Invoke-SmokeAttempt {
  param(
    [string]$WdioCommandPath,
    [string]$AdbPath,
    [int]$AttemptNumber
  )

  if (Test-Path $AdbPath) {
    Wait-ForAndroidReady -AdbPath $AdbPath
    & $AdbPath -P 5037 shell am force-stop com.wdiodemoapp | Out-Null
  }

  Write-Host "Starting smoke attempt $AttemptNumber..."
  & $WdioCommandPath run wdio.conf.ts --spec ./features/smoke.feature
  return $LASTEXITCODE
}

Import-DotEnv '.env'

$repoRoot = (Get-Location).Path
$androidSdkRoot = if ($env:ANDROID_SDK_ROOT) { $env:ANDROID_SDK_ROOT } else { 'tools/android-sdk' }
$androidHome = if ($env:ANDROID_HOME) { $env:ANDROID_HOME } else { $androidSdkRoot }
$androidUserHome = if ($env:ANDROID_USER_HOME) { $env:ANDROID_USER_HOME } else { 'artifacts/android-user-home' }
$defaultJavaHome = 'tools/android-jbr'
$javaHome = if (Test-Path (Join-Path $repoRoot $defaultJavaHome)) { $defaultJavaHome } elseif ($env:JAVA_HOME) { $env:JAVA_HOME } else { $defaultJavaHome }
$androidSdkRootPath = Resolve-ConfigPath $repoRoot $androidSdkRoot
$androidHomePath = Resolve-ConfigPath $repoRoot $androidHome
$androidUserHomePath = Resolve-ConfigPath $repoRoot $androidUserHome
$javaHomePath = Resolve-ConfigPath $repoRoot $javaHome
$adbPath = Join-Path $androidSdkRootPath 'platform-tools/adb.exe'
$wdioCommand = Join-Path $repoRoot 'node_modules/.bin/wdio.cmd'
$appiumPort = if ($env:APPIUM_PORT) { $env:APPIUM_PORT } else { '4723' }

New-Item -ItemType Directory -Force $androidUserHomePath | Out-Null

$env:ANDROID_SDK_ROOT = $androidSdkRootPath
$env:ANDROID_HOME = $androidHomePath
$env:ANDROID_USER_HOME = $androidUserHomePath
$env:JAVA_HOME = $javaHomePath
$env:PATH = "$javaHomePath\bin;$env:PATH"
$env:HOME = $androidUserHomePath
$env:USERPROFILE = $androidUserHomePath
$env:APPIUM_MANAGED_SERVICE = 'true'
$env:ANDROID_NO_RESET = 'false'

Get-NetTCPConnection -LocalPort $appiumPort -State Listen -ErrorAction SilentlyContinue |
  Select-Object -ExpandProperty OwningProcess -Unique |
  ForEach-Object {
    Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue
  }

if (Test-Path $adbPath) {
  Wait-ForAndroidReady -AdbPath $adbPath

  $deviceUdids = @(Get-ConnectedDeviceUdids -AdbPath $adbPath)
  if ($deviceUdids.Count -eq 1) {
    $env:ANDROID_UDID = [string]$deviceUdids[0]
  }
}

$maxAttempts = 2

for ($attempt = 1; $attempt -le $maxAttempts; $attempt++) {
  $exitCode = Invoke-SmokeAttempt -WdioCommandPath $wdioCommand -AdbPath $adbPath -AttemptNumber $attempt

  if ($exitCode -eq 0) {
    exit 0
  }

  if ($attempt -lt $maxAttempts) {
    Start-Sleep -Seconds 5
  }
}

exit $exitCode
