// 全局错误处理工具

export interface ErrorReport {
  message: string
  stack?: string
  componentStack?: string
  timestamp: string
  userAgent: string
  url: string
  userId?: string
  sessionId?: string
  extra?: Record<string, any>
}

export class GlobalErrorHandler {
  private static instance: GlobalErrorHandler
  private errorQueue: ErrorReport[] = []
  private isOnline = navigator.onLine

  private constructor() {
    this.setupGlobalErrorHandlers()
    this.setupOnlineStatusHandlers()
  }

  static getInstance(): GlobalErrorHandler {
    if (!GlobalErrorHandler.instance) {
      GlobalErrorHandler.instance = new GlobalErrorHandler()
    }
    return GlobalErrorHandler.instance
  }

  private setupGlobalErrorHandlers() {
    // 处理JavaScript运行时错误
    window.addEventListener('error', (event) => {
      this.handleError({
        message: event.message,
        stack: event.error?.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        extra: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          type: 'javascript'
        }
      })
    })

    // 处理Promise未捕获的拒绝
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        extra: {
          type: 'unhandled-promise-rejection',
          reason: event.reason
        }
      })
    })

    // 处理资源加载错误
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.handleError({
          message: `Resource loading failed: ${(event.target as any)?.src || (event.target as any)?.href}`,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
          extra: {
            type: 'resource-loading',
            elementType: (event.target as any)?.tagName,
            source: (event.target as any)?.src || (event.target as any)?.href
          }
        })
      }
    }, true)
  }

  private setupOnlineStatusHandlers() {
    window.addEventListener('online', () => {
      this.isOnline = true
      this.flushErrorQueue()
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
    })
  }

  private handleError(errorReport: ErrorReport) {
    // 添加用户和会话信息
    const enhancedReport = {
      ...errorReport,
      userId: this.getCurrentUserId(),
      sessionId: this.getSessionId()
    }

    // 输出到控制台
    console.error('Global error captured:', enhancedReport)

    // 如果在线，立即发送；否则加入队列
    if (this.isOnline) {
      this.sendErrorReport(enhancedReport)
    } else {
      this.errorQueue.push(enhancedReport)
    }
  }

  private async sendErrorReport(errorReport: ErrorReport) {
    // 检查是否启用错误报告
    if (import.meta.env.VITE_ENABLE_ERROR_REPORTING !== 'true') {
      return
    }

    try {
      // 这里应该发送到实际的错误监控服务
      // 例如 Sentry, LogRocket, Bugsnag 等
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(errorReport)
      })
    } catch (error) {
      // 发送失败，加入重试队列
      console.warn('Failed to send error report:', error)
      this.errorQueue.push(errorReport)
    }
  }

  private flushErrorQueue() {
    while (this.errorQueue.length > 0 && this.isOnline) {
      const errorReport = this.errorQueue.shift()
      if (errorReport) {
        this.sendErrorReport(errorReport)
      }
    }
  }

  private getCurrentUserId(): string | undefined {
    try {
      const authStorage = localStorage.getItem('auth-storage')
      if (authStorage) {
        const authData = JSON.parse(authStorage)
        return authData.state?.user?.id
      }
    } catch (error) {
      console.warn('Failed to get user ID:', error)
    }
    return undefined
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('session-id')
    if (!sessionId) {
      sessionId = crypto.randomUUID()
      sessionStorage.setItem('session-id', sessionId)
    }
    return sessionId
  }

  // 手动报告错误的方法
  reportError(error: Error, context?: Record<string, any>) {
    this.handleError({
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      extra: {
        type: 'manual',
        context
      }
    })
  }

  // 设置用户上下文
  setUserContext(userId: string, userInfo?: Record<string, any>) {
    // 在实际应用中，这里可以设置用户上下文信息
    if (import.meta.env.DEV) {
      console.log('User context set:', { userId, userInfo })
    }
  }

  // 添加面包屑（用户操作轨迹）
  addBreadcrumb(message: string, category: string, data?: Record<string, any>) {
    // 在实际应用中，这里可以记录用户操作轨迹
    if (import.meta.env.DEV) {
      console.log('Breadcrumb added:', { message, category, data, timestamp: new Date().toISOString() })
    }
  }
}

// 导出单例实例
export const globalErrorHandler = GlobalErrorHandler.getInstance()

// 初始化全局错误处理
export const initializeErrorHandling = () => {
  return globalErrorHandler
}