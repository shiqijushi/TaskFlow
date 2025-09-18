#!/bin/bash

# TaskFlow 高保真原型启动脚本

echo \"🎨 启动 TaskFlow 高保真原型展示\"
echo \"================================\"
echo \"\"

# 检查Python是否安装
if ! command -v python3 &> /dev/null; then
    if ! command -v python &> /dev/null; then
        echo \"❌ 错误: 未找到 Python，请先安装 Python\"
        echo \"💡 提示: 您也可以直接用浏览器打开 index.html 文件\"
        exit 1
    fi
    PYTHON_CMD=python
else
    PYTHON_CMD=python3
fi

echo \"✅ 环境检查通过\"
echo \"\"

# 启动HTML原型服务器
echo \"🌐 启动原型展示服务器 (端口 8000)...\"
$PYTHON_CMD -m http.server 8000 &
SERVER_PID=$!
echo \"服务器 PID: $SERVER_PID\"

# 等待服务器启动
sleep 3

echo \"\"
echo \"🎉 TaskFlow 高保真原型启动完成！\"
echo \"================================\"
echo \"🖥️  原型展示: http://localhost:8000\"
echo \"📋 主要功能:\"
echo \"   - 仪表盘展示\"
echo \"   - 任务管理界面\"
echo \"   - 时间追踪\"
echo \"   - 报表统计\"
echo \"   - 日历视图\"
echo \"   - 系统设置\"
echo \"\"
echo \"提示：\"
echo \"- 这是静态HTML原型，展示界面设计\"
echo \"- 所有页面都可以正常浏览和交互\"
echo \"- 按 Ctrl+C 停止服务\"
echo \"\"

# 保存PID到文件，便于停止
echo $SERVER_PID > .prototype.pid

# 尝试打开浏览器
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:8000
elif command -v open &> /dev/null; then
    open http://localhost:8000
else
    echo \"请手动在浏览器中打开: http://localhost:8000\"
fi

# 等待用户中断
trap 'echo \"\"; echo \"🛑 停止服务中...\"; kill $SERVER_PID 2>/dev/null; rm -f .prototype.pid 2>/dev/null; echo \"✅ 原型服务已停止\"; exit 0' INT

# 保持脚本运行
while true; do
    sleep 1
done