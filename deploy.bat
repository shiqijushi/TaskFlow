@echo off
setlocal enabledelayedexpansion

REM TaskFlow Windows 部署脚本
REM 使用方法: deploy.bat [环境] [选项]

set ENVIRONMENT=production
set BUILD_FLAG=
set CACHE_FLAG=
set LOGS_FLAG=false

REM 解析命令行参数
:parse_args
if "%~1"=="" goto :check_deps
if "%~1"=="dev" (
    set ENVIRONMENT=dev
    shift
    goto :parse_args
)
if "%~1"=="staging" (
    set ENVIRONMENT=staging
    shift
    goto :parse_args
)
if "%~1"=="production" (
    set ENVIRONMENT=production
    shift
    goto :parse_args
)
if "%~1"=="--build" (
    set BUILD_FLAG=--build
    shift
    goto :parse_args
)
if "%~1"=="--no-cache" (
    set CACHE_FLAG=--no-cache
    shift
    goto :parse_args
)
if "%~1"=="--logs" (
    set LOGS_FLAG=true
    shift
    goto :parse_args
)
if "%~1"=="--help" (
    goto :show_help
)
echo 未知选项: %~1
goto :show_help

:show_help
echo TaskFlow Windows 部署脚本
echo.
echo 使用方法:
echo     %0 [环境] [选项]
echo.
echo 环境:
echo     dev         开发环境
echo     staging     测试环境
echo     production  生产环境 (默认)
echo.
echo 选项:
echo     --build     强制重新构建镜像
echo     --no-cache  构建时不使用缓存
echo     --logs      部署后显示日志
echo     --help      显示此帮助信息
echo.
echo 示例:
echo     %0 production --build
echo     %0 dev --logs
echo.
goto :eof

:check_deps
echo [INFO] 检查依赖工具...
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker 未安装，请先安装 Docker
    exit /b 1
)

docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker Compose 未安装，请先安装 Docker Compose
    exit /b 1
)
echo [SUCCESS] 依赖检查完成

:stop_services
echo [INFO] 停止现有服务...
if "%ENVIRONMENT%"=="dev" (
    docker-compose -f docker-compose.dev.yml down
) else (
    docker-compose down
)
echo [SUCCESS] 服务已停止

:cleanup
echo [INFO] 清理未使用的资源...
docker image prune -f
docker container prune -f
docker network prune -f
echo [SUCCESS] 资源清理完成

:deploy
echo [INFO] 部署 TaskFlow 服务 (环境: %ENVIRONMENT%)...
if "%ENVIRONMENT%"=="dev" (
    docker-compose -f docker-compose.dev.yml up -d %BUILD_FLAG% %CACHE_FLAG%
) else (
    docker-compose up -d %BUILD_FLAG% %CACHE_FLAG%
)
echo [SUCCESS] 服务部署完成

:wait_services
echo [INFO] 等待服务启动...
timeout /t 10 /nobreak >nul
echo [SUCCESS] 服务已启动

:show_status
echo [INFO] 服务状态:
if "%ENVIRONMENT%"=="dev" (
    docker-compose -f docker-compose.dev.yml ps
) else (
    docker-compose ps
)

echo.
echo [INFO] 访问地址:
if "%ENVIRONMENT%"=="dev" (
    echo   前端: http://localhost:3001
) else (
    echo   前端: http://localhost
)
echo   后端: http://localhost:5000
echo   API文档: http://localhost:5000/api-docs
echo   健康检查: http://localhost:5000/api/health

if "%LOGS_FLAG%"=="true" (
    echo [INFO] 显示服务日志 (按 Ctrl+C 退出)...
    if "%ENVIRONMENT%"=="dev" (
        docker-compose -f docker-compose.dev.yml logs -f
    ) else (
        docker-compose logs -f
    )
)

echo.
echo [SUCCESS] 🚀 TaskFlow 部署完成！