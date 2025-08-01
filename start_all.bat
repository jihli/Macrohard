@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo 🚀 Macrohard 财富管理系统 - 一键启动 (Windows)
echo ================================================
echo.

:: 检查Python
echo [INFO] 检查Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python未安装，请先安装Python 3.11+
    pause
    exit /b 1
)
echo [SUCCESS] Python检查完成

:: 检查Node.js
echo [INFO] 检查Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js未安装，请先安装Node.js 18+
    pause
    exit /b 1
)
echo [SUCCESS] Node.js检查完成

:: 检查npm
echo [INFO] 检查npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm未安装，请先安装npm
    pause
    exit /b 1
)
echo [SUCCESS] npm检查完成

:: 检查环境变量文件
if not exist ".env" (
    echo [WARNING] .env文件不存在，正在从示例文件创建...
    if exist "env.example" (
        copy env.example .env >nul
        echo [WARNING] 请编辑.env文件，设置您的API密钥和数据库配置
        echo [WARNING] 特别是NEWS_API_KEY和DATABASE_URL
    ) else (
        echo [ERROR] env.example文件不存在
        pause
        exit /b 1
    )
)

:: 安装Python依赖
echo [INFO] 安装Python依赖...
if exist "requirements.txt" (
    pip install -r requirements.txt
    echo [SUCCESS] Python依赖安装完成
) else (
    echo [ERROR] requirements.txt文件不存在
    pause
    exit /b 1
)

:: 安装Node.js依赖
echo [INFO] 安装Node.js依赖...
if exist "Frontend_new" (
    cd Frontend_new
    if not exist "node_modules" (
        npm install
        echo [SUCCESS] Node.js依赖安装完成
    ) else (
        echo [INFO] Node.js依赖已存在，跳过安装
    )
    cd ..
) else (
    echo [ERROR] Frontend_new目录不存在
    pause
    exit /b 1
)

:: 设置环境变量
set FLASK_APP=backend.app
set FLASK_ENV=development
set FLASK_RUN_HOST=0.0.0.0
set FLASK_RUN_PORT=5003

:: 启动后端服务
echo [INFO] 启动后端服务...
start "Backend" cmd /k "python -m flask run --host=0.0.0.0 --port=5003"

:: 等待后端启动
timeout /t 3 /nobreak >nul

:: 启动前端服务
echo [INFO] 启动前端服务...
cd Frontend_new
start "Frontend" cmd /k "npm run dev"
cd ..

:: 等待前端启动
timeout /t 5 /nobreak >nul

echo.
echo [SUCCESS] 🎉 所有服务启动完成！
echo.
echo 📊 服务状态:
echo   后端 API:  http://localhost:5003
echo   前端应用:  http://localhost:3001
echo.
echo 🛑 停止服务:
echo   关闭对应的命令行窗口，或运行 stop_all.bat
echo.
echo 🔍 查看日志:
echo   在对应的命令行窗口中查看实时日志
echo.
pause 