import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface AuthRequest extends Request {
  user?: {
    userId: string
    email: string
    roles: string[]
  }
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '访问被拒绝，未提供令牌'
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as any
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      roles: decoded.roles || ['user']
    }
    
    next()
  } catch (error) {
    res.status(401).json({
      success: false,
      message: '令牌无效'
    })
  }
}

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '未认证'
      })
    }

    if (!req.user.roles.includes('admin')) {
      return res.status(403).json({
        success: false,
        message: '需要管理员权限'
      })
    }

    next()
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    })
  }
}