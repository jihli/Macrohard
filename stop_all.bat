@echo off
chcp 65001 >nul

echo 🛑 Macrohard 财富管理系统 - 停止所有服务 (Windows)
echo ================================================
echo.

:: 停止Flask进程
echo [INFO] 正在停止后端服务...
taskkill /f /im python.exe /fi "WINDOWTITLE eq Backend*" >nul 2>&1
taskkill /f /im python.exe /fi "COMMANDLINE eq *flask*" >nul 2>&1
echo [SUCCESS] 后端服务已停止

:: 停止Node.js进程
echo [INFO] 正在停止前端服务...
taskkill /f /im node.exe /fi "WINDOWTITLE eq Frontend*" >nul 2>&1
taskkill /f /im node.exe /fi "COMMANDLINE eq *next*" >nul 2>&1
echo [SUCCESS] 前端服务已停止

:: 停止端口占用的进程
echo [INFO] 检查端口占用...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5003') do (
    taskkill /f /pid %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do (
    taskkill /f /pid %%a >nul 2>&1
)

echo.
echo [SUCCESS] 🎉 所有服务已成功停止！
echo.
echo 🚀 重新启动服务:
echo   start_all.bat
echo.
pause 