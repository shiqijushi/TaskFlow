@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

echo 🎨 启动 TaskFlow 静态原型展示
echo ================================
echo.

rem 检查Python是否安装
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未找到 Python，请先安装 Python
    echo 💡 提示: 您也可以直接用浏览器打开 index.html 文件
    pause
    exit /b 1
)

echo ✅ 环境检查通过
echo.

rem 启动HTML原型服务器
echo 🌐 启动原型展示服务器 (端口 8000)...
start "TaskFlow 静态原型" python -m http.server 8000

rem 等待服务器启动
timeout /t 3 /nobreak >nul

echo.
echo 🎉 TaskFlow 静态原型启动完成！
echo ================================
echo 🖥️  原型展示: http://localhost:8000
echo 📋 主要功能:
echo    - 仪表盘展示
echo    - 任务管理界面
echo    - 时间追踪
echo    - 报表统计
echo    - 日历视图
echo    - 系统设置
echo.
echo 提示：
echo - 这是静态HTML原型，展示界面设计
echo - 所有页面都可以正常浏览和交互
echo - 关闭此窗口前，请先关闭服务器窗口
echo.

rem 打开浏览器
start http://localhost:8000

echo 如需停止服务，请关闭服务器窗口
pause