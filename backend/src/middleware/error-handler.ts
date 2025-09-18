// 自定义错误类
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

// 错误处理中间件
export const errorHandler = (
  err: any,
  req: any,
  res: any,
  next: any
): void => {
  let error = { ...err } as AppError;
  error.message = err.message;

  // 记录错误日志
  console.error(`错误: ${error.message}`, {
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  // 默认错误
  let message = '服务器内部错误';
  let statusCode = 500;

  if (error instanceof AppError) {
    message = error.message;
    statusCode = error.statusCode;
  }

  // 开发环境显示详细错误信息
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  if (isDevelopment) {
    res.status(statusCode).json({
      success: false,
      error: message,
      stack: error.stack,
    });
  } else {
    // 生产环境只显示基本错误信息
    res.status(statusCode).json({
      success: false,
      error: message,
    });
  }
};