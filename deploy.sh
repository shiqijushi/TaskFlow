#!/bin/bash

# TaskFlow 部署脚本
# 使用方法: ./deploy.sh [环境] [选项]
# 环境: dev, staging, production
# 选项: --build, --no-cache, --logs

set -e

# 默认值
ENVIRONMENT="production"
BUILD_FLAG=""
CACHE_FLAG=""
LOGS_FLAG=false

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 显示帮助信息
show_help() {
    cat << EOF
TaskFlow 部署脚本

使用方法:
    $0 [环境] [选项]

环境:
    dev         开发环境
    staging     测试环境  
    production  生产环境 (默认)

选项:
    --build     强制重新构建镜像
    --no-cache  构建时不使用缓存
    --logs      部署后显示日志
    --help      显示此帮助信息

示例:
    $0 production --build
    $0 dev --logs
    $0 staging --build --no-cache

EOF
}

# 解析命令行参数
parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            dev|staging|production)
                ENVIRONMENT="$1"
                shift
                ;;
            --build)
                BUILD_FLAG="--build"
                shift
                ;;
            --no-cache)
                CACHE_FLAG="--no-cache"
                shift
                ;;
            --logs)
                LOGS_FLAG=true
                shift
                ;;
            --help)
                show_help
                exit 0
                ;;
            *)
                log_error "未知选项: $1"
                show_help
                exit 1
                ;;
        esac
    done
}

# 检查必要的工具
check_dependencies() {
    log_info "检查依赖工具..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker 未安装，请先安装 Docker"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose 未安装，请先安装 Docker Compose"
        exit 1
    fi
    
    log_success "依赖检查完成"
}

# 检查环境文件
check_env_files() {
    log_info "检查环境配置文件..."
    
    case $ENVIRONMENT in
        dev)
            if [[ ! -f "./frontend/.env" ]]; then
                log_warning "开发环境配置文件不存在，将使用默认配置"
            fi
            ;;
        staging|production)
            if [[ ! -f "./frontend/.env.production" ]]; then
                log_error "生产环境配置文件 .env.production 不存在"
                exit 1
            fi
            if [[ ! -f "./backend/.env" ]]; then
                log_error "后端环境配置文件 .env 不存在"
                exit 1
            fi
            ;;
    esac
    
    log_success "环境配置检查完成"
}

# 停止现有服务
stop_services() {
    log_info "停止现有服务..."
    
    case $ENVIRONMENT in
        dev)
            docker-compose -f docker-compose.dev.yml down
            ;;
        *)
            docker-compose down
            ;;
    esac
    
    log_success "服务已停止"
}

# 清理资源
cleanup() {
    log_info "清理未使用的资源..."
    
    # 清理未使用的镜像
    docker image prune -f
    
    # 清理未使用的容器
    docker container prune -f
    
    # 清理未使用的网络
    docker network prune -f
    
    log_success "资源清理完成"
}

# 部署服务
deploy_services() {
    log_info "部署 TaskFlow 服务 (环境: $ENVIRONMENT)..."
    
    case $ENVIRONMENT in
        dev)
            docker-compose -f docker-compose.dev.yml up -d $BUILD_FLAG $CACHE_FLAG
            ;;
        *)
            docker-compose up -d $BUILD_FLAG $CACHE_FLAG
            ;;
    esac
    
    log_success "服务部署完成"
}

# 等待服务启动
wait_for_services() {
    log_info "等待服务启动..."
    
    # 等待后端服务
    local backend_url="http://localhost:5000/api/health"
    local max_attempts=30
    local attempt=1
    
    while [[ $attempt -le $max_attempts ]]; do
        if curl -f $backend_url &> /dev/null; then
            log_success "后端服务已启动"
            break
        fi
        
        log_info "等待后端服务启动... ($attempt/$max_attempts)"
        sleep 5
        ((attempt++))
    done
    
    if [[ $attempt -gt $max_attempts ]]; then
        log_error "后端服务启动超时"
        exit 1
    fi
    
    # 等待前端服务
    local frontend_url="http://localhost"
    if [[ $ENVIRONMENT == "dev" ]]; then
        frontend_url="http://localhost:3001"
    fi
    
    attempt=1
    while [[ $attempt -le $max_attempts ]]; do
        if curl -f $frontend_url &> /dev/null; then
            log_success "前端服务已启动"
            break
        fi
        
        log_info "等待前端服务启动... ($attempt/$max_attempts)"
        sleep 5
        ((attempt++))
    done
    
    if [[ $attempt -gt $max_attempts ]]; then
        log_error "前端服务启动超时"
        exit 1
    fi
}

# 显示服务状态
show_status() {
    log_info "服务状态:"
    
    case $ENVIRONMENT in
        dev)
            docker-compose -f docker-compose.dev.yml ps
            ;;
        *)
            docker-compose ps
            ;;
    esac
    
    echo ""
    log_info "访问地址:"
    if [[ $ENVIRONMENT == "dev" ]]; then
        echo "  前端: http://localhost:3001"
    else
        echo "  前端: http://localhost"
    fi
    echo "  后端: http://localhost:5000"
    echo "  API文档: http://localhost:5000/api-docs"
    echo "  健康检查: http://localhost:5000/api/health"
}

# 显示日志
show_logs() {
    if [[ $LOGS_FLAG == true ]]; then
        log_info "显示服务日志 (按 Ctrl+C 退出)..."
        
        case $ENVIRONMENT in
            dev)
                docker-compose -f docker-compose.dev.yml logs -f
                ;;
            *)
                docker-compose logs -f
                ;;
        esac
    fi
}

# 主函数
main() {
    echo "==================================="
    echo "    TaskFlow 自动部署脚本"
    echo "==================================="
    echo ""
    
    parse_args "$@"
    check_dependencies
    check_env_files
    stop_services
    cleanup
    deploy_services
    wait_for_services
    show_status
    show_logs
    
    echo ""
    log_success "🚀 TaskFlow 部署完成！"
}

# 错误处理
trap 'log_error "部署过程中发生错误"; exit 1' ERR

# 执行主函数
main "$@"