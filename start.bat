@echo off
chcp 65001 >nul
title 脑洞星球

set PROJECT_DIR=C:\Users\admin\WorkBuddy\2026-05-31-17-09-19\brainhole
set PORT=3456
set URL=http://localhost:%PORT%/NetWork/

cd /d "%PROJECT_DIR%"

echo.
echo === 脑洞星球 - 启动中 ===
echo.

:: 检查端口是否已被占用
netstat -ano 2>nul | findstr "LISTENING" | findstr ":%PORT% " >nul
if not errorlevel 1 (
    echo [OK] 服务器已在运行，正在打开浏览器...
    start "" "%URL%"
    goto :end
)

:: 启动开发服务器
echo [..] 正在启动...
start "脑洞星球" cmd /c "C:\Users\admin\.workbuddy\binaries\node\versions\22.22.2\npx.cmd next dev --port %PORT% & pause"

:: 等待服务器就绪
echo [..] 等待服务器启动...
set attempt=0
:wait_loop
set /a attempt+=1
if %attempt% gtr 30 (
    echo [!!] 启动超时，请手动打开：%URL%
    start "" "%URL%"
    goto :end
)
ping -n 2 127.0.0.1 >nul
netstat -ano 2>nul | findstr "LISTENING" | findstr ":%PORT% " >nul
if errorlevel 1 goto :wait_loop

echo [OK] 服务器就绪！
start "" "%URL%"

:end
echo.
echo 访问地址：%URL%
echo.
pause
