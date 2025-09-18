import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../services/database.service'

export class AuthController {
  // 用户注册
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body

      // 验证必填字段
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: '请提供姓名、邮箱和密码'
        })
      }

      // 检查邮箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: '请提供有效的邮箱地址'
        })
      }

      // 检查密码强度
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: '密码至少需要6个字符'
        })
      }

      // 检查用户是否已存在
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: '该邮箱已被注册'
        })
      }

      // 加密密码
      const saltRounds = 12
      const hashedPassword = await bcrypt.hash(password, saltRounds)

      // 创建新用户
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          avatar: null,
          roles: ['MEMBER']
        }
      })

      // 生成JWT token
      const token = jwt.sign(
        { 
          userId: newUser.id, 
          email: newUser.email,
          roles: newUser.roles
        },
        process.env.JWT_SECRET || 'default-secret',
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
      )

      // 返回用户信息（不包含密码）
      const userResponse = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        roles: newUser.roles,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt
      }

      res.status(201).json({
        success: true,
        message: '注册成功',
        data: {
          user: userResponse,
          token
        }
      })
    } catch (error) {
      console.error('Registration error:', error)
      res.status(500).json({
        success: false,
        message: '服务器内部错误'
      })
    }
  }

  // 用户登录
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body

      // 验证必填字段
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: '请提供邮箱和密码'
        })
      }

      // 查找用户
      const user = await prisma.user.findUnique({
        where: { email }
      })
      if (!user) {
        return res.status(401).json({
          success: false,
          message: '邮箱或密码错误'
        })
      }

      // 验证密码
      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: '邮箱或密码错误'
        })
      }

      // 生成JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email,
          roles: user.roles
        },
        process.env.JWT_SECRET || 'default-secret',
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
      )

      // 更新最后登录时间
      await prisma.user.update({
        where: { id: user.id },
        data: { updatedAt: new Date() }
      })

      // 返回用户信息（不包含密码）
      const userResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        roles: user.roles,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }

      res.status(200).json({
        success: true,
        message: '登录成功',
        data: {
          user: userResponse,
          token
        }
      })
    } catch (error) {
      console.error('Login error:', error)
      res.status(500).json({
        success: false,
        message: '服务器内部错误'
      })
    }
  }

  // 获取当前用户信息
  async getProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId
      
      const user = await prisma.user.findUnique({
        where: { id: userId }
      })
      if (!user) {
        return res.status(404).json({
          success: false,
          message: '用户不存在'
        })
      }

      const userResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        roles: user.roles,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }

      res.status(200).json({
        success: true,
        data: { user: userResponse }
      })
    } catch (error) {
      console.error('Get profile error:', error)
      res.status(500).json({
        success: false,
        message: '服务器内部错误'
      })
    }
  }

  // 更新用户信息
  async updateProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId
      const { name, avatar } = req.body

      const user = await prisma.user.findUnique({
        where: { id: userId }
      })
      if (!user) {
        return res.status(404).json({
          success: false,
          message: '用户不存在'
        })
      }

      // 更新用户信息
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          ...(name && { name }),
          ...(avatar !== undefined && { avatar }),
          updatedAt: new Date()
        }
      })

      const userResponse = {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        roles: updatedUser.roles,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt
      }

      res.status(200).json({
        success: true,
        message: '用户信息更新成功',
        data: { user: userResponse }
      })
    } catch (error) {
      console.error('Update profile error:', error)
      res.status(500).json({
        success: false,
        message: '服务器内部错误'
      })
    }
  }

  // 用户登出
  async logout(req: Request, res: Response) {
    try {
      // 在实际应用中，可以在这里实现token黑名单机制
      res.status(200).json({
        success: true,
        message: '登出成功'
      })
    } catch (error) {
      console.error('Logout error:', error)
      res.status(500).json({
        success: false,
        message: '服务器内部错误'
      })
    }
  }
}

// 导出控制器实例
export const authController = new AuthController();