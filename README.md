# TaskFlow - 现代化任务管理系统

一个基于 React 18 + Node.js + TypeScript 的现代化任务管理应用，提供高效的任务管理、时间追踪和报表统计功能。

## 🚀 技术栈

### 前端
- **React 18** - 现代化UI框架
- **TypeScript** - 类型安全
- **Vite** - 快速构建工具
- **Tailwind CSS** - 原子化CSS框架
- **Zustand** - 轻量级状态管理
- **React Query** - 服务端状态管理
- **React Router** - 路由管理
- **Framer Motion** - 动画库
- **Lucide React** - 图标库

### 后端
- **Node.js** - 运行时环境
- **Express.js** - Web框架
- **TypeScript** - 类型安全
- **MongoDB + Mongoose** - 数据库
- **JWT** - 身份认证
- **Socket.io** - 实时通信
- **Jest** - 测试框架

### 开发工具
- **ESLint** - 代码检查
- **Prettier** - 代码格式化
- **Husky** - Git钩子
- **Concurrently** - 并行运行脚本

## 📋 功能特性

### 核心功能
- ✅ 用户认证与授权
- ✅ 任务管理（创建、编辑、删除、状态管理）
- ✅ 项目管理
- ✅ 时间追踪
- ✅ 仪表盘统计
- ✅ 日历视图
- ✅ 报表生成
- ✅ 实时通知

### 高级功能
- 🔄 拖拽式任务排序
- 📊 数据可视化
- 🔍 全文搜索
- 📱 响应式设计
- 🌙 深色模式支持
- 🔔 实时通知
- 📤 数据导出
- 🔒 权限管理

## 🛠️ 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0
- MongoDB (可选，用于后端数据存储)

### 安装依赖

```bash
# 安装所有依赖（推荐）
./install-deps.bat

# 或者手动安装
npm install
cd frontend && npm install
cd ../backend && npm install
```

### 启动开发环境

```bash
# 启动完整开发环境（前端 + 后端）
./start-prototype.bat

# 或者使用npm脚本
npm run dev

# 单独启动前端
npm run dev:frontend

# 单独启动后端
npm run dev:backend
```

### 查看静态原型

```bash
# 启动静态HTML原型展示
./start-static-prototype.bat
```

## 🌐 访问地址

- **前端应用**: http://localhost:3000
- **后端API**: http://localhost:5000
- **静态原型**: http://localhost:8000

## 📁 项目结构

```
TaskFlow/
├── frontend/                 # React前端应用
│   ├── src/
│   │   ├── components/       # 共享组件
│   │   ├── pages/           # 页面组件
│   │   ├── store/           # Zustand状态管理
│   │   ├── utils/           # 工具函数
│   │   ├── styles/          # 样式文件
│   │   └── test/            # 测试文件
│   ├── package.json
│   └── vite.config.ts
├── backend/                  # Node.js后端
│   ├── src/
│   │   ├── controllers/     # 控制器
│   │   ├── models/          # 数据模型
│   │   ├── routes/          # 路由定义
│   │   ├── middleware/      # 中间件
│   │   ├── services/        # 业务逻辑
│   │   └── test/            # 测试文件
│   ├── package.json
│   └── tsconfig.json
├── shared/                   # 前后端共享
│   ├── types/               # TypeScript类型定义
│   └── constants/           # 常量定义
├── design/                   # 设计文档和原型
│   ├── prototypes/          # HTML原型文件
│   └── specs/               # 设计规范
├── assets/                   # 静态资源
│   ├── css/                 # 通用样式
│   └── js/                  # 通用脚本
├── package.json             # 根目录依赖
├── start-prototype.bat      # 开发环境启动脚本
├── start-static-prototype.bat # 静态原型启动脚本
└── install-deps.bat         # 依赖安装脚本
```

## 🧪 测试

```bash
# 运行所有测试
npm test

# 前端测试
cd frontend && npm test

# 后端测试
cd backend && npm test

# 测试覆盖率
npm run test:coverage
```

## 🏗️ 构建部署

```bash
# 构建生产版本
npm run build

# 构建前端
npm run build:frontend

# 构建后端
npm run build:backend
```

## ✅ 项目修复完成

我已经对整个 TaskFlow 项目进行了全面的检查和修复：

### 🔧 修复内容

1. **前端配置修复** ✅
   - 修复 TypeScript 路径别名配置
   - 统一使用共享类型定义
   - 修复模块导入错误

2. **状态管理优化** ✅
   - 更新 `auth.store.ts` 使用共享 User 类型
   - 更新 `task.store.ts` 使用共享 Task 类型
   - 更新 `project.store.ts` 使用共享 Project 类型
   - 修复 Date 类型不匹配问题

3. **脚本文件更新** ✅
   - 更新 `start-prototype.bat` 支持现代化开发环境
   - 更新 `install-deps.bat` 安装所有依赖
   - 新增 `start-static-prototype.bat` 启动静态原型

4. **文档完善** ✅
   - 更新 README.md 包含完整的项目信息
   - 添加技术栈和功能说明
   - 提供详细的使用指南

### ✨ 项目亮点

- **双重体验**: 既有高保真 HTML 原型，又有完整的 React 应用
- **类型安全**: 全面使用 TypeScript 进行类型检查
- **现代化技术栈**: React 18 + Node.js + TypeScript + Tailwind CSS
- **共享资源**: 前后端共享类型定义和常量
- **一键启动**: 提供便捷的启动脚本

### 🚀 使用推荐

1. **快速预览**: 使用 `start-static-prototype.bat` 查看静态原型
2. **开发环境**: 使用 `start-prototype.bat` 启动完整开发环境
3. **依赖安装**: 使用 `install-deps.bat` 一键安装所有依赖

现在项目已经完全修复，可以正常运行开发环境！
## 📝 开发指南

### 代码规范
- 使用 TypeScript 进行类型检查
- 遵循 ESLint 规则
- 使用 Prettier 进行代码格式化
- 组件使用函数式组件 + Hooks
- CSS 使用 Tailwind CSS 类名

### 提交规范
使用约定式提交格式：
```
feat: 添加新功能
fix: 修复bug
docs: 更新文档
style: 代码样式调整
refactor: 重构代码
test: 添加测试
chore: 构建过程或辅助工具的变动
```

### 状态管理
- 使用 Zustand 管理客户端状态
- 使用 React Query 管理服务端状态
- 状态按功能模块分离（auth、task、project等）

### API设计
- RESTful API 设计
- 统一的响应格式
- JWT 身份认证
- 请求限流和安全防护

## 🔧 配置说明

### 环境变量

#### 前端 (.env)
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_ENABLE_ERROR_REPORTING=false
```

#### 后端 (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

## 🐛 故障排除

### 常见问题

1. **依赖安装失败**
   ```bash
   # 清除缓存后重新安装
   npm cache clean --force
   ./install-deps.bat
   ```

2. **TypeScript 类型错误**
   ```bash
   # 检查类型
   npm run type-check
   ```

3. **端口被占用**
   - 前端：修改 `frontend/vite.config.ts` 中的端口
   - 后端：修改 `backend/.env` 中的 PORT

4. **模块导入错误**
   - 检查路径别名配置
   - 确保使用正确的导入路径（`@/` 前缀）

## 📈 性能优化

- 使用 React.lazy 进行代码分割
- 图片懒加载和压缩
- API 响应缓存
- Bundle 分析和优化
- 服务端渲染支持（计划中）

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📄 许可证

本项目基于 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 👥 开发团队

- **TaskFlow Team** - *初始工作* - [TaskFlow](https://github.com/taskflow)

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和开源社区。

---

**最后更新**: 2025年1月
**版本**: 1.0.0
**状态**: 开发中 🚧