@echo off
chcp 65001 >nul
title BrainHole

set PROJECT_DIR=C:\Users\admin\WorkBuddy\2026-05-31-17-09-19\brainhole
set PORT=4190
set URL=http://localhost:%PORT%

cd /d "%PROJECT_DIR%"

echo.
echo === BrainHole - Launching ===
echo Project: %PROJECT_DIR%
echo Port:    %PORT%
echo.

:: Check if server already running
netstat -ano 2>nul | findstr ":%PORT% " >nul
if not errorlevel 1 (
    echo [OK] Server already running. Opening browser...
    start "" "%URL%"
    goto :end
)

:: Start dev server in a new window
echo [..] Starting Next.js dev server...
start "BrainHole-Server" cmd /c "npm run dev -- --port %PORT% & pause"

:: Wait for server to be ready
echo [..] Waiting for server...
set attempt=0
:wait_loop
set /a attempt+=1
if %attempt% gtr 20 (
    echo [!!] Timeout. Please refresh the browser manually.
    goto :open_browser
)
ping -n 2 127.0.0.1 >nul
netstat -ano 2>nul | findstr ":%PORT% " >nul
if errorlevel 1 goto :wait_loop

:open_browser
echo [OK] Server ready! Opening browser...
start "" "%URL%"

:end
echo.
echo If the page doesn't open, visit: %URL%
echo.
pause
