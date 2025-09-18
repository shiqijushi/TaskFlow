@echo off
chcp 65001 >nul
echo 📦 安装 TaskFlow 项目依赖
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

echo 📦 正在安装根目录依赖...
npm install
echo ✅ 根目录依赖安装完成
echo.

echo 📦 正在安装前端依赖...
cd frontend
npm install
cd ..
echo ✅ 前端依赖安装完成
echo.

echo 📦 正在安装后端依赖...
cd backend
npm install
cd ..
echo ✅ 后端依赖安装完成
echo.

echo 🎉 所有依赖安装完成！
echo ================================
echo 🚀 现在可以运行 start-prototype.bat 启动开发环境
echo.
pause