// 404 处理中间件
export const notFoundHandler = (req: any, res: any, next: any): void => {
  res.status(404).json({
    success: false,
    message: `路由 ${req.originalUrl} 不存在`,
    error: 'Not Found',
  });
};