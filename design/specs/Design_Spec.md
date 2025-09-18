# TaskFlow 设计规范说明文档

## 1. 项目概述
这是一个任务管理Web应用的高保真HTML原型，采用现代UI设计风格，基于Tailwind CSS和FontAwesome实现。应用旨在帮助用户高效管理任务、项目和时间，提供直观的仪表盘、任务列表、时间追踪和报表统计功能。

## 2. 颜色方案
### 主色调
- **主色**：深蓝色 (#165DFF) - 代表专业和信任，用于主要按钮、导航高亮和重要元素
- **辅助色**：浅绿色 (#00B42A) - 用于成功状态、已完成任务
- **警告色**：橙色 (#FF7D00) - 用于警告状态、重要且紧急任务
- **错误色**：红色 (#F53F3F) - 用于错误状态、已过期任务

### 中性色
- **深灰** (#1D2129) - 主要文本、标题
- **中灰** (#4E5969) - 次要文本、描述
- **浅灰** (#86909C) - 占位文本、辅助信息
- **超浅灰** (#F2F3F5) - 背景色、分隔区域
- **白色** (#FFFFFF) - 卡片背景、内容区域

### 颜色应用示例
```html
<!-- 主色应用 -->
<button class="bg-primary text-white hover:bg-primary/90">主要按钮</button>

<!-- 成功色应用 -->
<span class="text-success"><i class="fa fa-check-circle"></i> 已完成</span>

<!-- 警告色应用 -->
<span class="bg-warning/10 text-warning px-2 py-1 rounded-full text-xs">重要且紧急</span>

<!-- 错误色应用 -->
<span class="bg-danger/10 text-danger px-2 py-1 rounded-full text-xs">已过期</span>
```

## 3. 排版规范
- **主标题**：Inter, 24px, 字重600, 行高1.3
- **副标题**：Inter, 20px, 字重500, 行高1.4
- **正文**：Inter, 14px, 字重400, 行高1.5
- **小文本**：Inter, 12px, 字重400, 行高1.4

### 排版应用示例
```html
<h1 class="text-2xl font-bold text-dark">主标题</h1>
<h2 class="text-xl font-semibold text-dark">副标题</h2>
<p class="text-gray-600">正文内容</p>
<span class="text-xs text-gray-400">辅助信息</span>
```

## 4. 组件规范

### 按钮
- **默认按钮**：圆角4px, 高度40px, 填充16px, 背景色#165DFF, 文字白色
- **悬停状态**：背景色#165DFF/90, 轻微放大(1.02倍)
- **禁用状态**：背景色#86909C, 光标不可用
- **文本按钮**：无背景, 文字颜色#165DFF

```html
<!-- 主要按钮 -->
<button class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">主要按钮</button>

<!-- 文本按钮 -->
<button class="text-primary hover:bg-primary/10 px-2 py-1 rounded-md transition-colors">文本按钮</button>
```

### 卡片
- **基础卡片**：圆角8px, 阴影0 2px 10px rgba(0,0,0,0.05), 背景白色, 边框1px solid #F2F3F5
- **悬停状态**：阴影0 4px 20px rgba(0,0,0,0.1), 轻微上浮
- **统计卡片**：圆角12px, 填充24px, 边框1px solid #F2F3F5

```html
<!-- 任务卡片 -->
<div class="task-card bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-all hover:shadow-md">
  <h3 class="font-medium text-dark">任务标题</h3>
  <p class="text-gray-400 text-sm mt-1">任务描述</p>
</div>
```

### 输入框
- **默认状态**：圆角4px, 高度40px, 边框1px solid #E5E6EB, 背景白色
- **聚焦状态**：边框颜色#165DFF, 轻微阴影
- **错误状态**：边框颜色#F53F3F

```html
<input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary">
```

### 导航栏
- **顶部导航**：高度60px, 背景色白色, 边框底部1px solid #E5E6EB
- **侧边导航**：宽度64px(折叠)/200px(展开), 背景色白色, 边框右侧1px solid #E5E6EB
- **导航项**：高度40px, 填充0 16px, 悬停背景#F2F3F5

### 标签
- **默认标签**：圆角9999px, 填充4px 8px, 文字12px
- **状态标签**：根据不同状态使用不同颜色

```html
<span class="pill bg-primary/10 text-primary">进行中</span>
<span class="pill bg-success/10 text-success">已完成</span>
<span class="pill bg-warning/10 text-warning">高优先级</span>
<span class="pill bg-danger/10 text-danger">已过期</span>
```

## 5. 交互规范
- **按钮悬停**：轻微放大(1.02倍)和阴影加深
- **卡片悬停**：阴影加深和轻微上浮
- **输入框聚焦**：边框颜色变化为主色调，添加轻微阴影
- **页面切换**：平滑过渡动画，持续时间300ms
- **列表项悬停**：背景色变为#F2F3F5
- **滚动行为**：平滑滚动

### 交互实现示例
```css
/* 按钮悬停效果 */
.button-hover {
  transition: all 0.2s ease;
}
.button-hover:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.15);
}

/* 平滑滚动 */
html {
  scroll-behavior: smooth;
}
```

## 6. 响应式设计
- **桌面端**：>= 1200px - 完整布局，多列显示
- **平板端**：768px - 1199px - 调整布局，减少列数
- **移动端**：< 768px - 单列布局，折叠菜单

### 响应式实现示例
```html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  <!-- 响应式卡片网格 -->
</div>

<!-- 移动端菜单按钮 -->
<button class="lg:hidden" id="mobileMenuButton">
  <i class="fa fa-bars"></i>
</button>
```

## 7. 图标规范
- 使用FontAwesome v6图标库
- 图标尺寸：主要为16px和24px
- 图标颜色：根据上下文使用相应的颜色
- 图标间距：与文本之间保持适当间距(通常为8px)

```html
<!-- 图标使用示例 -->
<div class="flex items-center">
  <i class="fa fa-tasks w-5 h-5 mr-3 text-primary"></i>
  <span>任务管理</span>
</div>
```

## 8. 代码规范
- HTML结构：语义化标签，清晰的层次结构
- CSS命名：使用Tailwind CSS工具类，自定义工具类添加到style标签中
- JavaScript：简洁明了，避免全局污染，事件处理函数统一管理
- 文件组织：按功能模块组织文件，保持目录结构清晰

### 代码组织示例
```
project/
├── design/
│   ├── prototypes/
│   │   ├── dashboard.html
│   │   ├── tasks.html
│   │   ├── calendar.html
│   │   └── ...
│   └── specs/
│       └── Design_Spec.md
├── docs/
│   ├── PRD.md
│   └── User_Story_Map.md
└── index.html
```