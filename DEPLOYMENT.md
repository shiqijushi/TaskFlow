# TaskFlow 部署指南

## 目录

1. [环境要求](#环境要求)
2. [快速开始](#快速开始)
3. [开发环境部署](#开发环境部署)
4. [生产环境部署](#生产环境部署)
5. [监控和日志](#监控和日志)
6. [故障排除](#故障排除)
7. [性能优化](#性能优化)

## 环境要求

### 系统要求

- **操作系统**: Linux, macOS, Windows 10/11
- **内存**: 最小 4GB RAM，推荐 8GB+
- **磁盘空间**: 最小 10GB 可用空间
- **网络**: 互联网连接（用于拉取镜像）

### 软件依赖

- **Docker**: 版本 20.10+ 
- **Docker Compose**: 版本 2.0+
- **Node.js**: 版本 18+ （仅开发环境）
- **Git**: 版本 2.0+

### 端口要求

| 服务 | 端口 | 说明 |
|------|------|------|
| 前端 | 80, 443 | HTTP/HTTPS |
| 后端 | 5000 | API 服务 |
| MongoDB | 27017 | 数据库 |
| Redis | 6379 | 缓存 |
| Prometheus | 9090 | 监控 |
| Grafana | 3000 | 可视化 |

## 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd TaskFlow
```

### 2. 环境配置

```bash
# 复制环境配置文件
cp .env.example .env
cp frontend/.env.example frontend/.env
cp .env.production.example .env.production

# 编辑配置文件
nano .env
```

### 3. 启动服务

```bash
# 使用 Docker Compose
docker-compose up -d

# 或使用自动化脚本
./deploy.sh production
```

### 4. 验证部署

```bash
# 检查服务状态
docker-compose ps

# 访问应用
curl http://localhost/
curl http://localhost:5000/api/health
```

## 开发环境部署

### 使用 Docker

```bash
# 启动开发环境
docker-compose -f docker-compose.dev.yml up

# 后台运行
docker-compose -f docker-compose.dev.yml up -d
```

### 本地开发

```bash
# 安装依赖
make install

# 启动前端开发服务器
cd frontend && npm run dev

# 启动后端开发服务器
cd backend && npm run dev
```

### 开发环境特性

- **热重载**: 前后端代码变更自动重启
- **调试模式**: 详细错误信息和日志
- **API 文档**: 访问 http://localhost:5000/api-docs
- **数据库工具**: MongoDB Compass 连接

## 生产环境部署

### 1. 准备工作

```bash
# 创建生产环境目录
mkdir -p /opt/taskflow
cd /opt/taskflow

# 克隆代码
git clone <repository-url> .

# 设置权限
chmod +x deploy.sh
chmod +x build.bat
```

### 2. 环境配置

```bash
# 生产环境配置
cp .env.production.example .env.production
cp frontend/.env.production.example frontend/.env.production

# 编辑配置文件
vim .env.production
```

**重要配置项：**

```env
# 数据库
DATABASE_URL=mongodb://root:STRONG_PASSWORD@mongodb:27017/taskflow?authSource=admin

# JWT 密钥（必须修改）
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters

# CORS 设置
CORS_ORIGIN=https://your-domain.com

# 邮件服务
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 3. SSL 证书配置

```bash
# 创建 SSL 证书目录
mkdir -p nginx/ssl

# 使用 Let's Encrypt
certbot certonly --standalone -d your-domain.com

# 复制证书
cp /etc/letsencrypt/live/your-domain.com/fullchain.pem nginx/ssl/
cp /etc/letsencrypt/live/your-domain.com/privkey.pem nginx/ssl/
```

### 4. 高可用部署

```bash
# 使用生产环境配置
docker-compose -f docker-compose.production.yml up -d

# 启用监控
docker-compose -f docker-compose.monitoring.yml up -d
```

### 5. 负载均衡配置

参考 `nginx/nginx.conf` 配置文件，支持：

- **负载均衡**: 多个后端实例
- **SSL 终止**: HTTPS 支持
- **缓存策略**: 静态资源缓存
- **压缩**: Gzip 压缩
- **安全头**: 安全策略

## 监控和日志

### Prometheus + Grafana

```bash
# 启动监控服务
docker-compose -f docker-compose.monitoring.yml up -d

# 访问监控面板
# Grafana: http://localhost:3000 (admin/admin123)
# Prometheus: http://localhost:9090
```

### 日志收集 (ELK Stack)

```bash
# 查看实时日志
docker-compose logs -f

# 特定服务日志
docker-compose logs -f backend

# 访问 Kibana
# http://localhost:5601
```

### 健康检查

```bash
# 自动健康检查脚本
./scripts/health-check.sh

# 手动检查
curl -f http://localhost:5000/api/health
curl -f http://localhost/
```

## 故障排除

### 常见问题

#### 1. 容器启动失败

```bash
# 查看容器状态
docker-compose ps

# 查看启动日志
docker-compose logs [service-name]

# 重新构建镜像
docker-compose build --no-cache
```

#### 2. 数据库连接失败

```bash
# 检查 MongoDB 状态
docker exec taskflow-mongodb mongo --eval "db.runCommand('ping')"

# 检查网络连接
docker network ls
docker network inspect taskflow_taskflow-network
```

#### 3. 权限问题

```bash
# 修复文件权限
sudo chown -R $(whoami):$(whoami) .
chmod +x *.sh

# Docker 权限
sudo usermod -aG docker $USER
```

#### 4. 端口冲突

```bash
# 检查端口占用
netstat -tlnp | grep :80
netstat -tlnp | grep :5000

# 修改端口配置
vim docker-compose.yml
```

### 日志分析

```bash
# 错误日志
grep -i error logs/*.log

# 性能日志
grep -i "slow" logs/*.log

# 用户访问日志
tail -f logs/nginx/access.log
```

## 性能优化

### 数据库优化

```bash
# MongoDB 索引优化
docker exec taskflow-mongodb mongo taskflow --eval "
  db.users.getIndexes();
  db.tasks.getIndexes();
  db.projects.getIndexes();
"

# 查询性能分析
docker exec taskflow-mongodb mongo taskflow --eval "
  db.setProfilingLevel(2);
"
```

### 缓存优化

```bash
# Redis 缓存状态
docker exec taskflow-redis redis-cli info memory
docker exec taskflow-redis redis-cli info stats
```

### 网络优化

```bash
# 启用 CDN
# 配置 nginx 缓存策略
# 优化静态资源

# 压缩优化
gzip on;
gzip_comp_level 6;
gzip_types text/css application/javascript;
```

### 容器资源限制

```yaml
# docker-compose.yml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

## 备份和恢复

### 数据库备份

```bash
# 自动备份脚本
./scripts/backup-database.sh

# 手动备份
docker exec taskflow-mongodb mongodump --out /backup
```

### 应用备份

```bash
# 完整备份
tar -czf taskflow-backup-$(date +%Y%m%d).tar.gz \
  --exclude=node_modules \
  --exclude=.git \
  .
```

### 灾难恢复

```bash
# 恢复数据库
docker exec taskflow-mongodb mongorestore /backup

# 恢复应用
tar -xzf taskflow-backup-20231201.tar.gz
docker-compose up -d
```

## 更新和升级

### 应用更新

```bash
# 拉取最新代码
git pull origin main

# 重新构建和部署
./deploy.sh production --build

# 滚动更新（零停机）
./scripts/rolling-update.sh
```

### 数据库迁移

```bash
# 运行数据库迁移
docker exec taskflow-backend npm run migrate

# 检查迁移状态
docker exec taskflow-backend npm run migrate:status
```

## 安全建议

1. **定期更新**: 保持系统和依赖库最新
2. **强密码**: 使用复杂的数据库和 JWT 密钥
3. **防火墙**: 配置适当的网络安全规则
4. **SSL/TLS**: 生产环境必须使用 HTTPS
5. **日志审计**: 定期检查访问和错误日志
6. **备份加密**: 对备份文件进行加密存储

## 支持和联系

- **问题反馈**: 创建 GitHub Issue
- **功能请求**: 提交 Feature Request
- **安全问题**: 发送邮件至 security@taskflow.com
- **文档**: 查看 `/docs` 目录

---

更新日期: 2024-01-01
版本: 1.0.0