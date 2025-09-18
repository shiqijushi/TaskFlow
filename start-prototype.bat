@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

echo 🎨 启动 TaskFlow 项目
echo ================================
echo.

rem 检查Node.js是否安装
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未找到 Node.js，请先安装 Node.js
    echo 💡 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js 环境检查通过
echo.

rem 检查依赖是否已安装
if not exist "frontend\node_modules" (
    echo 📦 正在安装前端依赖...
    cd frontend
    npm install
    cd ..
)

if not exist "backend\node_modules" (
    echo 📦 正在安装后端依赖...
    cd backend
    npm install
    cd ..
)

echo ✅ 依赖检查完成
echo.

echo 🚀 启动开发服务器...
echo --------------------------------
echo 🌐 前端服务: http://localhost:3000
echo 🔗 后端API: http://localhost:5000
echo.

rem 使用根目录的dev脚本启动前后端
start "TaskFlow Backend" cmd /k "cd backend && npm run dev"
timeout /t 2 /nobreak >nul
start "TaskFlow Frontend" cmd /k "cd frontend && npm run dev"

echo 🎉 TaskFlow 开发环境启动完成！
echo ================================
echo 📝 功能说明:
echo    - 现代化React前端应用
echo    - Express.js后端API
echo    - TypeScript支持
echo    - 热重载开发环境
echo.
echo 💡 提示: 同时启动了前端和后端服务窗口
echo    - 前端: http://localhost:3000
echo    - 后端: http://localhost:5000
echo.
echo ❌ 如需停止服务，请关闭相应的命令行窗口
echo.
pause