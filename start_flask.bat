@echo off
echo 🚀 启动Flask应用...

REM 设置Flask应用环境变量
set FLASK_APP=backend.app
set FLASK_ENV=development
set FLASK_RUN_HOST=0.0.0.0
set FLASK_RUN_PORT=5001

echo 📍 应用路径: %FLASK_APP%
echo 🌐 访问地址: http://localhost:%FLASK_RUN_PORT%
echo.

REM 启动Flask应用
flask run --host=%FLASK_RUN_HOST% --port=%FLASK_RUN_PORT% 