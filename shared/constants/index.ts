// API 端点常量
export const API_ENDPOINTS = {
  // 认证相关
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  // 用户相关
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
    SETTINGS: '/users/settings',
    AVATAR: '/users/avatar',
  },
  
  // 任务相关
  TASKS: {
    BASE: '/tasks',
    BY_ID: (id: string) => `/tasks/${id}`,
    COMMENTS: (id: string) => `/tasks/${id}/comments`,
    ATTACHMENTS: (id: string) => `/tasks/${id}/attachments`,
    TIME_ENTRIES: (id: string) => `/tasks/${id}/time-entries`,
  },
  
  // 项目相关
  PROJECTS: {
    BASE: '/projects',
    BY_ID: (id: string) => `/projects/${id}`,
    MEMBERS: (id: string) => `/projects/${id}/members`,
    TASKS: (id: string) => `/projects/${id}/tasks`,
    STATISTICS: (id: string) => `/projects/${id}/statistics`,
  },
  
  // 时间追踪相关
  TIME_TRACKING: {
    BASE: '/time-tracking',
    START: '/time-tracking/start',
    STOP: '/time-tracking/stop',
    CURRENT: '/time-tracking/current',
    ENTRIES: '/time-tracking/entries',
  },
  
  // 报表相关
  REPORTS: {
    BASE: '/reports',
    TASKS: '/reports/tasks',
    PROJECTS: '/reports/projects',
    TIME: '/reports/time',
    PRODUCTIVITY: '/reports/productivity',
    EXPORT: '/reports/export',
  },
  
  // 通知相关
  NOTIFICATIONS: {
    BASE: '/notifications',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
  },
  
  // 日历相关
  CALENDAR: {
    BASE: '/calendar',
    EVENTS: '/calendar/events',
    EVENT_BY_ID: (id: string) => `/calendar/events/${id}`,
  },
  
  // 文件上传
  UPLOAD: {
    BASE: '/upload',
    AVATAR: '/upload/avatar',
    ATTACHMENT: '/upload/attachment',
  },
} as const;

// 应用常量
export const APP_CONFIG = {
  NAME: 'TaskFlow',
  VERSION: '1.0.0',
  DESCRIPTION: '现代化任务管理系统',
  
  // 分页设置
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
  },
  
  // 文件上传限制
  UPLOAD_LIMITS: {
    AVATAR_MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ATTACHMENT_MAX_SIZE: 50 * 1024 * 1024, // 50MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    ALLOWED_ATTACHMENT_TYPES: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'text/csv',
    ],
  },
  
  // 时间格式
  DATE_FORMATS: {
    DISPLAY: 'yyyy-MM-dd',
    DISPLAY_WITH_TIME: 'yyyy-MM-dd HH:mm',
    ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
  },
  
  // 颜色主题
  COLORS: {
    PRIMARY: '#165DFF',
    SUCCESS: '#00B42A',
    WARNING: '#FF7D00',
    DANGER: '#F53F3F',
    DARK: '#1D2129',
    GRAY_600: '#4E5969',
    GRAY_400: '#86909C',
    GRAY_100: '#F2F3F5',
  },
  
  // 项目颜色选项
  PROJECT_COLORS: [
    '#165DFF', // 蓝色
    '#00B42A', // 绿色
    '#FF7D00', // 橙色
    '#F53F3F', // 红色
    '#722ED1', // 紫色
    '#00D9FF', // 青色
    '#FFB000', // 黄色
    '#F7BA1E', // 金色
    '#36CFC9', // 薄荷绿
    '#FF85C0', // 粉色
  ],
} as const;

// 本地存储键名
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'taskflow_access_token',
  REFRESH_TOKEN: 'taskflow_refresh_token',
  USER_PREFERENCES: 'taskflow_user_preferences',
  THEME: 'taskflow_theme',
  LANGUAGE: 'taskflow_language',
  SIDEBAR_COLLAPSED: 'taskflow_sidebar_collapsed',
} as const;

// 路由路径
export const ROUTES = {
  // 公共路由
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  
  // 应用路由
  DASHBOARD: '/dashboard',
  TASKS: '/tasks',
  TASK_DETAIL: '/tasks/:id',
  PROJECTS: '/projects',
  PROJECT_DETAIL: '/projects/:id',
  CALENDAR: '/calendar',
  TIME_TRACKING: '/time-tracking',
  REPORTS: '/reports',
  SETTINGS: '/settings',
  PROFILE: '/profile',
  
  // 管理员路由
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_PROJECTS: '/admin/projects',
  ADMIN_SETTINGS: '/admin/settings',
} as const;

// 查询键（用于React Query）
export const QUERY_KEYS = {
  // 用户相关
  USER: 'user',
  USER_PROFILE: 'user-profile',
  USER_SETTINGS: 'user-settings',
  
  // 任务相关
  TASKS: 'tasks',
  TASK: 'task',
  TASK_COMMENTS: 'task-comments',
  TASK_ATTACHMENTS: 'task-attachments',
  TASK_TIME_ENTRIES: 'task-time-entries',
  
  // 项目相关
  PROJECTS: 'projects',
  PROJECT: 'project',
  PROJECT_MEMBERS: 'project-members',
  PROJECT_TASKS: 'project-tasks',
  PROJECT_STATISTICS: 'project-statistics',
  
  // 时间追踪
  TIME_TRACKING_SESSION: 'time-tracking-session',
  TIME_ENTRIES: 'time-entries',
  
  // 报表
  TASK_STATISTICS: 'task-statistics',
  PROJECT_STATS: 'project-stats',
  TIME_STATISTICS: 'time-statistics',
  PRODUCTIVITY_STATS: 'productivity-stats',
  
  // 通知
  NOTIFICATIONS: 'notifications',
  
  // 日历
  CALENDAR_EVENTS: 'calendar-events',
} as const;

// 错误消息
export const ERROR_MESSAGES = {
  // 通用错误
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  SERVER_ERROR: '服务器错误，请稍后重试',
  UNAUTHORIZED: '登录已过期，请重新登录',
  FORBIDDEN: '没有权限执行此操作',
  NOT_FOUND: '请求的资源不存在',
  
  // 验证错误
  REQUIRED_FIELD: '此字段是必填的',
  INVALID_EMAIL: '请输入有效的邮箱地址',
  INVALID_PASSWORD: '密码至少需要8个字符',
  PASSWORD_MISMATCH: '两次输入的密码不一致',
  INVALID_DATE: '请输入有效的日期',
  INVALID_FILE_TYPE: '不支持的文件类型',
  FILE_TOO_LARGE: '文件大小超出限制',
  
  // 业务错误
  LOGIN_FAILED: '邮箱或密码错误',
  EMAIL_ALREADY_EXISTS: '该邮箱已被注册',
  TASK_NOT_FOUND: '任务不存在',
  PROJECT_NOT_FOUND: '项目不存在',
  INSUFFICIENT_PERMISSION: '权限不足',
} as const;

// 成功消息
export const SUCCESS_MESSAGES = {
  // 用户操作
  LOGIN_SUCCESS: '登录成功',
  REGISTER_SUCCESS: '注册成功',
  LOGOUT_SUCCESS: '退出登录成功',
  PROFILE_UPDATED: '个人资料更新成功',
  PASSWORD_CHANGED: '密码修改成功',
  
  // 任务操作
  TASK_CREATED: '任务创建成功',
  TASK_UPDATED: '任务更新成功',
  TASK_DELETED: '任务删除成功',
  TASK_COMPLETED: '任务标记为已完成',
  
  // 项目操作
  PROJECT_CREATED: '项目创建成功',
  PROJECT_UPDATED: '项目更新成功',
  PROJECT_DELETED: '项目删除成功',
  
  // 其他操作
  FILE_UPLOADED: '文件上传成功',
  SETTINGS_SAVED: '设置保存成功',
  TIME_TRACKING_STARTED: '开始计时',
  TIME_TRACKING_STOPPED: '停止计时',
} as const;

// WebSocket 事件类型
export const WS_EVENTS = {
  // 连接相关
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  
  // 任务相关
  TASK_CREATED: 'task:created',
  TASK_UPDATED: 'task:updated',
  TASK_DELETED: 'task:deleted',
  TASK_ASSIGNED: 'task:assigned',
  
  // 项目相关
  PROJECT_UPDATED: 'project:updated',
  PROJECT_MEMBER_ADDED: 'project:member_added',
  PROJECT_MEMBER_REMOVED: 'project:member_removed',
  
  // 通知相关
  NOTIFICATION_RECEIVED: 'notification:received',
  
  // 时间追踪相关
  TIME_TRACKING_STARTED: 'time_tracking:started',
  TIME_TRACKING_STOPPED: 'time_tracking:stopped',
} as const;

// 响应式断点
export const BREAKPOINTS = {
  SM: 640,   // 手机
  MD: 768,   // 平板
  LG: 1024,  // 桌面
  XL: 1280,  // 大桌面
  '2XL': 1536, // 超大桌面
} as const;

// 动画持续时间
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;