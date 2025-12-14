@echo off
echo ==========================================
echo      Node.js Automatic Installer
echo ==========================================
echo.
echo Downloading Node.js v20.18.0 LTS...
echo This may take a minute...
echo.

:: Try curl first
curl --fail --location --output node_installer.msi https://nodejs.org/dist/v20.18.0/node-v20.18.0-x64.msi

:: If curl failed, try PowerShell
if not exist node_installer.msi (
    echo curl not found or failed, trying PowerShell...
    powershell -Command "Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.18.0/node-v20.18.0-x64.msi' -OutFile 'node_installer.msi'"
)

:: Check if file exists
if exist node_installer.msi (
    echo.
    echo Download Complete!
    echo Launching Installer...
    echo.
    echo ******************************************************
    echo * PLEASE FOLLOW THE SETUP WIZARD                   *
    echo * IMPORTANT: CHECK 'Add to PATH' if asked          *
    echo ******************************************************
    echo.
    msiexec /i node_installer.msi
) else (
    echo.
    echo [ERROR] Failed to download Node.js installer.
    echo Please visit https://nodejs.org/ to download and install manually.
)

pause
