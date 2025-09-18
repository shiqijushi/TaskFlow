@echo off
setlocal enabledelayedexpansion

:: TaskFlow Windows 构建和部署脚本
:: 使用方法: build.bat [命令] [选项]

set SCRIPT_NAME=%~n0
set PROJECT_ROOT=%~dp0
set DEFAULT_ENV=production

:: 颜色定义（Windows 10/11支持ANSI转义码）
set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

:: 显示帮助信息
if "%1"=="help" goto :show_help
if "%1"=="/?" goto :show_help
if "%1"=="" goto :show_help

:: 解析命令
set COMMAND=%1
shift

:: 执行对应的命令
if "%COMMAND%"=="install" goto :install
if "%COMMAND%"=="build" goto :build
if "%COMMAND%"=="test" goto :test
if "%COMMAND%"=="clean" goto :clean
if "%COMMAND%"=="dev" goto :dev
if "%COMMAND%"=="deploy" goto :deploy
if "%COMMAND%"=="docker-build" goto :docker_build
if "%COMMAND%"=="docker-run" goto :docker_run
if "%COMMAND%"=="docker-stop" goto :docker_stop
if "%COMMAND%"=="logs" goto :logs
if "%COMMAND%"=="status" goto :status

echo %RED%[ERROR]%NC% 未知命令: %COMMAND%
goto :show_help

:show_help
echo.
echo TaskFlow Windows 构建脚本
echo.
echo 使用方法:
echo   %SCRIPT_NAME% [命令] [选项]
echo.
echo 可用命令:
echo   install       安装所有依赖
echo   build         构建生产版本
echo   test          运行所有测试
echo   clean         清理构建文件
echo   dev           启动开发环境
echo   deploy        部署应用
echo   docker-build  构建 Docker 镜像
echo   docker-run    运行 Docker 容器
echo   docker-stop   停止 Docker 容器
echo   logs          显示应用日志
echo   status        检查服务状态
echo   help          显示此帮助信息
echo.
echo 示例:
echo   %SCRIPT_NAME% install
echo   %SCRIPT_NAME% build
echo   %SCRIPT_NAME% deploy production
echo.
goto :eof

:install
echo %BLUE%[INFO]%NC% 安装项目依赖...
echo.
echo %BLUE%[INFO]%NC% 安装前端依赖...
cd /d "%PROJECT_ROOT%frontend"
call npm install
if errorlevel 1 (
    echo %RED%[ERROR]%NC% 前端依赖安装失败
    exit /b 1
)

echo.
echo %BLUE%[INFO]%NC% 安装后端依赖...
cd /d "%PROJECT_ROOT%backend"
call npm install
if errorlevel 1 (
    echo %RED%[ERROR]%NC% 后端依赖安装失败
    exit /b 1
)

echo.
echo %GREEN%[SUCCESS]%NC% 所有依赖安装完成
goto :eof

:build
echo %BLUE%[INFO]%NC% 构建生产版本...
echo.
echo %BLUE%[INFO]%NC% 构建前端...
cd /d "%PROJECT_ROOT%frontend"
call npm run build
if errorlevel 1 (
    echo %RED%[ERROR]%NC% 前端构建失败
    exit /b 1
)

echo.
echo %BLUE%[INFO]%NC% 构建后端...
cd /d "%PROJECT_ROOT%backend"
call npm run build
if errorlevel 1 (
    echo %RED%[ERROR]%NC% 后端构建失败
    exit /b 1
)

echo.
echo %GREEN%[SUCCESS]%NC% 构建完成
goto :eof

:test
echo %BLUE%[INFO]%NC% 运行测试...
echo.
echo %BLUE%[INFO]%NC% 运行前端测试...
cd /d "%PROJECT_ROOT%frontend"
call npm run test
if errorlevel 1 (
    echo %YELLOW%[WARNING]%NC% 前端测试有失败的用例
)

echo.
echo %BLUE%[INFO]%NC% 运行后端测试...
cd /d "%PROJECT_ROOT%backend"
call npm run test
if errorlevel 1 (
    echo %YELLOW%[WARNING]%NC% 后端测试有失败的用例
)

echo.
echo %GREEN%[SUCCESS]%NC% 测试完成
goto :eof

:clean
echo %BLUE%[INFO]%NC% 清理构建文件...
cd /d "%PROJECT_ROOT%"

if exist "frontend\dist" (
    echo 删除 frontend\dist...
    rmdir /s /q "frontend\dist"
)

if exist "frontend\build" (
    echo 删除 frontend\build...
    rmdir /s /q "frontend\build"
)

if exist "backend\dist" (
    echo 删除 backend\dist...
    rmdir /s /q "backend\dist"
)

echo.
echo %GREEN%[SUCCESS]%NC% 清理完成
goto :eof

:dev
echo %BLUE%[INFO]%NC% 启动开发环境...
cd /d "%PROJECT_ROOT%"
docker-compose -f docker-compose.dev.yml up
goto :eof

:deploy
set ENV=%1
if "%ENV%"=="" set ENV=%DEFAULT_ENV%
echo %BLUE%[INFO]%NC% 部署到 %ENV% 环境...
cd /d "%PROJECT_ROOT%"
call deploy.bat %ENV%
goto :eof

:docker_build
echo %BLUE%[INFO]%NC% 构建 Docker 镜像...
cd /d "%PROJECT_ROOT%"
docker-compose build
if errorlevel 1 (
    echo %RED%[ERROR]%NC% Docker 镜像构建失败
    exit /b 1
)
echo %GREEN%[SUCCESS]%NC% Docker 镜像构建完成
goto :eof

:docker_run
echo %BLUE%[INFO]%NC% 启动 Docker 容器...
cd /d "%PROJECT_ROOT%"
docker-compose up -d
if errorlevel 1 (
    echo %RED%[ERROR]%NC% Docker 容器启动失败
    exit /b 1
)
echo %GREEN%[SUCCESS]%NC% Docker 容器启动完成
goto :eof

:docker_stop
echo %BLUE%[INFO]%NC% 停止 Docker 容器...
cd /d "%PROJECT_ROOT%"
docker-compose down
echo %GREEN%[SUCCESS]%NC% Docker 容器已停止
goto :eof

:logs
echo %BLUE%[INFO]%NC% 显示应用日志...
cd /d "%PROJECT_ROOT%"
docker-compose logs -f
goto :eof

:status
echo %BLUE%[INFO]%NC% 检查服务状态...
cd /d "%PROJECT_ROOT%"
docker-compose ps
echo.
echo %BLUE%[INFO]%NC% 检查健康状态...
curl -f http://localhost:5000/api/health || echo %YELLOW%[WARNING]%NC% 后端服务不可用
curl -f http://localhost/ || echo %YELLOW%[WARNING]%NC% 前端服务不可用
goto :eof

:eof