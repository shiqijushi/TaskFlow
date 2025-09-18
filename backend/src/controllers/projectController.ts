import { Request, Response } from 'express'
import { prisma } from '../services/database.service'

export class ProjectController {
  // 获取项目列表
  async getProjects(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId
      const { 
        page = 1, 
        limit = 10, 
        status, 
        search 
      } = req.query

      // 构建查询条件
      const where: any = {
        OR: [
          {
            projectMembers: {
              some: {
                userId: userId
              }
            }
          },
          {
            createdBy: userId
          }
        ]
      }

      if (status) where.status = status

      // 搜索条件
      if (search) {
        where.AND = [
          where.OR ? { OR: where.OR } : {},
          {
            OR: [
              {
                name: {
                  contains: search as string,
                  mode: 'insensitive'
                }
              },
              {
                description: {
                  contains: search as string,
                  mode: 'insensitive'
                }
              }
            ]
          }
        ]
        delete where.OR
      }

      // 分页参数
      const pageNum = parseInt(page as string)
      const limitNum = parseInt(limit as string)
      const skip = (pageNum - 1) * limitNum

      // 查询项目和总数
      const [projects, total] = await Promise.all([
        prisma.project.findMany({
          where,
          include: {
            projectMembers: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    avatar: true
                  }
                }
              }
            },
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            tasks: {
              select: {
                id: true,
                title: true,
                status: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          skip,
          take: limitNum
        }),
        prisma.project.count({
          where
        })
      ])

      // 处理项目成员数据格式
      const formattedProjects = projects.map(project => ({
        id: project.id,
        name: project.name,
        description: project.description,
        status: project.status,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        createdBy: project.createdBy,
        members: project.projectMembers.map(member => member.user),
        taskCount: project.tasks.length
      }))

      res.status(200).json({
        success: true,
        data: {
          projects: formattedProjects,
          pagination: {
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
            limit: limitNum
          }
        }
      })
    } catch (error) {
      console.error('Get projects error:', error)
      res.status(500).json({
        success: false,
        message: '服务器内部错误'
      })
    }
  }

  // 获取单个项目
  async getProject(req: Request, res: Response) {
    try {
      const { id } = req.params
      const userId = (req as any).user.userId

      const project = await Project.findOne({
        _id: id,
        $or: [
          { members: userId },
          { createdBy: userId }
        ]
      })
        .populate('members', 'name email avatar')
        .populate('createdBy', 'name email')

      if (!project) {
        return res.status(404).json({
          success: false,
          message: '项目不存在'
        })
      }

      res.status(200).json({
        success: true,
        data: { project }
      })
    } catch (error) {
      console.error('Get project error:', error)
      res.status(500).json({
        success: false,
        message: '服务器内部错误'
      })
    }
  }

  // 创建项目
  async createProject(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId
      const {
        name,
        description,
        status = 'active',
        dueDate,
        members = []
      } = req.body

      // 验证必填字段
      if (!name) {
        return res.status(400).json({
          success: false,
          message: '请提供项目名称'
        })
      }

      // 确保创建者在成员列表中
      const allMembers = [...new Set([userId, ...members])]

      // 创建新项目
      const newProject = new Project({
        name,
        description,
        status,
        progress: 0,
        members: allMembers,
        dueDate: dueDate ? new Date(dueDate) : null,
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      await newProject.save()

      // 返回完整的项目信息
      const project = await Project.findById(newProject._id)
        .populate('members', 'name email avatar')
        .populate('createdBy', 'name email')

      res.status(201).json({
        success: true,
        message: '项目创建成功',
        data: { project }
      })
    } catch (error) {
      console.error('Create project error:', error)
      res.status(500).json({
        success: false,
        message: '服务器内部错误'
      })
    }
  }

  // 更新项目
  async updateProject(req: Request, res: Response) {
    try {
      const { id } = req.params
      const userId = (req as any).user.userId
      const updateData = req.body

      // 查找项目
      const project = await Project.findOne({
        _id: id,
        $or: [
          { members: userId },
          { createdBy: userId }
        ]
      })

      if (!project) {
        return res.status(404).json({
          success: false,
          message: '项目不存在'
        })
      }

      // 检查权限：只有创建者或管理员可以修改项目信息
      const userRoles = (req as any).user.roles || []
      if (project.createdBy.toString() !== userId && !userRoles.includes('admin')) {
        return res.status(403).json({
          success: false,
          message: '无权限修改项目信息'
        })
      }

      // 更新项目
      Object.keys(updateData).forEach(key => {
        if (key !== '_id' && key !== 'createdAt' && key !== 'createdBy') {
          (project as any)[key] = updateData[key]
        }
      })

      project.updatedAt = new Date()
      await project.save()

      // 返回更新后的项目
      const updatedProject = await Project.findById(project._id)
        .populate('members', 'name email avatar')
        .populate('createdBy', 'name email')

      res.status(200).json({
        success: true,
        message: '项目更新成功',
        data: { project: updatedProject }
      })
    } catch (error) {
      console.error('Update project error:', error)
      res.status(500).json({
        success: false,
        message: '服务器内部错误'
      })
    }
  }

  // 删除项目
  async deleteProject(req: Request, res: Response) {
    try {
      const { id } = req.params
      const userId = (req as any).user.userId

      const project = await Project.findOne({
        _id: id,
        createdBy: userId // 只有创建者可以删除项目
      })

      if (!project) {
        return res.status(404).json({
          success: false,
          message: '项目不存在或无权限删除'
        })
      }

      await Project.findByIdAndDelete(id)

      res.status(200).json({
        success: true,
        message: '项目删除成功'
      })
    } catch (error) {
      console.error('Delete project error:', error)
      res.status(500).json({
        success: false,
        message: '服务器内部错误'
      })
    }
  }

  // 添加项目成员
  async addMember(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { userId: memberId } = req.body
      const userId = (req as any).user.userId

      const project = await Project.findOne({
        _id: id,
        createdBy: userId
      })

      if (!project) {
        return res.status(404).json({
          success: false,
          message: '项目不存在或无权限'
        })
      }

      // 检查成员是否已存在
      if (project.members.includes(memberId)) {
        return res.status(400).json({
          success: false,
          message: '用户已是项目成员'
        })
      }

      // 添加成员
      project.members.push(memberId)
      project.updatedAt = new Date()
      await project.save()

      // 返回更新后的项目
      const updatedProject = await Project.findById(project._id)
        .populate('members', 'name email avatar')
        .populate('createdBy', 'name email')

      res.status(200).json({
        success: true,
        message: '成员添加成功',
        data: { project: updatedProject }
      })
    } catch (error) {
      console.error('Add member error:', error)
      res.status(500).json({
        success: false,
        message: '服务器内部错误'
      })
    }
  }

  // 移除项目成员
  async removeMember(req: Request, res: Response) {
    try {
      const { id, memberId } = req.params
      const userId = (req as any).user.userId

      const project = await Project.findOne({
        _id: id,
        createdBy: userId
      })

      if (!project) {
        return res.status(404).json({
          success: false,
          message: '项目不存在或无权限'
        })
      }

      // 不能移除项目创建者
      if (memberId === project.createdBy.toString()) {
        return res.status(400).json({
          success: false,
          message: '不能移除项目创建者'
        })
      }

      // 移除成员
      project.members = project.members.filter(
        member => member.toString() !== memberId
      )
      project.updatedAt = new Date()
      await project.save()

      // 返回更新后的项目
      const updatedProject = await Project.findById(project._id)
        .populate('members', 'name email avatar')
        .populate('createdBy', 'name email')

      res.status(200).json({
        success: true,
        message: '成员移除成功',
        data: { project: updatedProject }
      })
    } catch (error) {
      console.error('Remove member error:', error)
      res.status(500).json({
        success: false,
        message: '服务器内部错误'
      })
    }
  }
}