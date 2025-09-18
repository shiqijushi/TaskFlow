// 用户相关类型
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  roles: Role[];
  createdAt: Date;
  updatedAt: Date;
}

export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  MEMBER = 'MEMBER'
}

// 为了兼容性保留旧的枚举
export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  MEMBER = 'MEMBER'
}

export interface UserProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  timezone: string;
  language: string;
  theme: ThemeType;
}

export enum ThemeType {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system'
}

// 认证相关类型
export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

// 任务相关类型
export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: Priority;
  assigneeId: string;
  createdBy: string;
  projectId?: string | null;
  tags: string[];
  dueDate?: Date | null;
  assignee?: User;
  creator?: User;
  project?: Project | null;
  createdAt: Date;
  updatedAt: Date;
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_REVIEW = 'IN_REVIEW',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

// 为了兼容性保留旧的枚举
export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority: Priority;
  assigneeId: string;
  projectId?: string;
  tags?: string[];
  dueDate?: Date;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  assigneeId?: string;
  projectId?: string;
  tags?: string[];
  dueDate?: Date;
}

// 项目相关类型
export interface Project {
  id: string;
  name: string;
  description?: string | null;
  status: ProjectStatus;
  progress: number;
  dueDate?: Date | null;
  createdBy: string;
  members: User[];
  tasks?: Task[];
  createdAt: Date;
  updatedAt: Date;
}

export enum ProjectStatus {
  PLANNING = 'PLANNING',
  ACTIVE = 'ACTIVE',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface ProjectMember {
  userId: string;
  role: ProjectRole;
  joinedAt: Date;
}

export enum ProjectRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
  VIEWER = 'viewer'
}

// 时间追踪相关类型
export interface TimeEntry {
  id: string;
  taskId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // 秒数
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimeTrackingSession {
  id: string;
  taskId: string;
  userId: string;
  startTime: Date;
  isActive: boolean;
}

// 评论和附件类型
export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Attachment {
  id: string;
  taskId: string;
  userId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: Date;
}

// 通知相关类型
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: Date;
}

export enum NotificationType {
  TASK_ASSIGNED = 'task_assigned',
  TASK_COMPLETED = 'task_completed',
  TASK_OVERDUE = 'task_overdue',
  PROJECT_INVITATION = 'project_invitation',
  COMMENT_MENTION = 'comment_mention'
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 查询参数类型
export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TaskQueryParams extends QueryParams {
  status?: TaskStatus[];
  priority?: Priority[];
  projectId?: string;
  assigneeId?: string;
  tags?: string[];
  dueDateFrom?: Date;
  dueDateTo?: Date;
}

// 报表相关类型
export interface TaskStatistics {
  total: number;
  completed: number;
  inProgress: number;
  overdue: number;
  completionRate: number;
}

export interface ProjectStatistics {
  total: number;
  active: number;
  completed: number;
  onHold: number;
  avgProgress: number;
}

export interface TimeStatistics {
  totalHours: number;
  todayHours: number;
  weekHours: number;
  monthHours: number;
  avgDailyHours: number;
}

export interface UserProductivityStats {
  tasksCompleted: number;
  hoursWorked: number;
  productivityScore: number;
  completionRate: number;
}

// 日历事件类型
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
  type: EventType;
  relatedId?: string; // 关联的任务或项目ID
  userId: string;
  color?: string;
}

export enum EventType {
  TASK = 'task',
  MEETING = 'meeting',
  DEADLINE = 'deadline',
  PERSONAL = 'personal'
}

// 设置相关类型
export interface UserSettings {
  id: string;
  userId: string;
  notifications: NotificationSettings;
  appearance: AppearanceSettings;
  preferences: UserPreferences;
}

export interface NotificationSettings {
  email: boolean;
  browser: boolean;
  taskAssigned: boolean;
  taskCompleted: boolean;
  taskOverdue: boolean;
  projectUpdates: boolean;
  weeklyReport: boolean;
}

export interface AppearanceSettings {
  theme: ThemeType;
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
}

export interface UserPreferences {
  defaultView: 'list' | 'board' | 'calendar';
  tasksPerPage: number;
  autoStartTimer: boolean;
  showCompletedTasks: boolean;
  groupTasksBy: 'none' | 'project' | 'priority' | 'assignee';
}