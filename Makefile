# TaskFlow 项目 Makefile
# 使用方法: make [目标]

.PHONY: help install dev build test clean deploy docker-build docker-run docker-stop logs

# 默认目标
help:
	@echo "TaskFlow 项目构建命令"
	@echo ""
	@echo "可用的命令:"
	@echo "  help              显示此帮助信息"
	@echo "  install           安装所有依赖"
	@echo "  install-frontend  仅安装前端依赖"
	@echo "  install-backend   仅安装后端依赖"
	@echo "  dev               启动开发环境"
	@echo "  dev-frontend      仅启动前端开发服务器"
	@echo "  dev-backend       仅启动后端开发服务器"
	@echo "  build             构建生产版本"
	@echo "  build-frontend    仅构建前端"
	@echo "  build-backend     仅构建后端"
	@echo "  test              运行所有测试"
	@echo "  test-frontend     仅运行前端测试"
	@echo "  test-backend      仅运行后端测试"
	@echo "  lint              运行代码检查"
	@echo "  lint-fix          自动修复代码问题"
	@echo "  clean             清理构建文件"
	@echo "  docker-build      构建 Docker 镜像"
	@echo "  docker-run        运行 Docker 容器"
	@echo "  docker-stop       停止 Docker 容器"
	@echo "  deploy-dev        部署到开发环境"
	@echo "  deploy-prod       部署到生产环境"
	@echo "  logs              显示应用日志"

# 安装依赖
install: install-frontend install-backend

install-frontend:
	@echo "安装前端依赖..."
	cd frontend && npm install

install-backend:
	@echo "安装后端依赖..."
	cd backend && npm install

# 开发环境
dev:
	@echo "启动开发环境..."
	docker-compose -f docker-compose.dev.yml up

dev-frontend:
	@echo "启动前端开发服务器..."
	cd frontend && npm run dev

dev-backend:
	@echo "启动后端开发服务器..."
	cd backend && npm run dev

# 构建
build: build-frontend build-backend

build-frontend:
	@echo "构建前端..."
	cd frontend && npm run build

build-backend:
	@echo "构建后端..."
	cd backend && npm run build

# 测试
test: test-frontend test-backend

test-frontend:
	@echo "运行前端测试..."
	cd frontend && npm run test

test-backend:
	@echo "运行后端测试..."
	cd backend && npm run test

# 代码检查
lint:
	@echo "运行代码检查..."
	cd frontend && npm run lint
	cd backend && npm run lint

lint-fix:
	@echo "自动修复代码问题..."
	cd frontend && npm run lint:fix
	cd backend && npm run lint:fix

# 清理
clean:
	@echo "清理构建文件..."
	rm -rf frontend/dist
	rm -rf frontend/build
	rm -rf backend/dist
	rm -rf node_modules
	rm -rf frontend/node_modules
	rm -rf backend/node_modules

# Docker 操作
docker-build:
	@echo "构建 Docker 镜像..."
	docker-compose build

docker-run:
	@echo "运行 Docker 容器..."
	docker-compose up -d

docker-stop:
	@echo "停止 Docker 容器..."
	docker-compose down

# 部署
deploy-dev:
	@echo "部署到开发环境..."
	./deploy.sh dev

deploy-prod:
	@echo "部署到生产环境..."
	./deploy.sh production --build

# 日志
logs:
	@echo "显示应用日志..."
	docker-compose logs -f

# 数据库操作
db-backup:
	@echo "备份数据库..."
	docker exec taskflow-mongodb mongodump --out /backup

db-restore:
	@echo "恢复数据库..."
	docker exec taskflow-mongodb mongorestore /backup

# 监控
status:
	@echo "检查服务状态..."
	docker-compose ps

health:
	@echo "检查服务健康状态..."
	curl -f http://localhost:5000/api/health || echo "后端服务不可用"
	curl -f http://localhost/ || echo "前端服务不可用"