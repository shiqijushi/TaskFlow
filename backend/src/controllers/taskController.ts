import { Request, Response } from 'express'
import { prisma } from '../services/database.service'

export class TaskController {
  // 获取任务列表
  async getTasks(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId
      const { 
        page = 1, 
        limit = 20, 
        status, 
        priority, 
        projectId, 
        search 
      } = req.query

      // 构建查询条件
      const where: any = {
        OR: [
          { assigneeId: userId },
          { createdBy: userId }
        ]
      }

      if (status) where.status = status
      if (priority) where.priority = priority
      if (projectId) where.projectId = projectId as string
      if (search) {
        where.OR = [
          { title: { contains: search as string, mode: 'insensitive' } },
          { description: { contains: search as string, mode: 'insensitive' } }
        ]
      }

      // 分页参数
      const pageNum = parseInt(page as string)
      const limitNum = parseInt(limit as string)
      const skip = (pageNum - 1) * limitNum

      // 查询任务
      const [tasks, total] = await Promise.all([
        prisma.task.findMany({
          where,
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            },
            creator: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            project: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limitNum
        }),
        prisma.task.count({ where })
      ])

      res.status(200).json({
        success: true,
        data: {
          tasks,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            pages: Math.ceil(total / limitNum)
          }
        }
      })
    } catch (error) {
      console.error('Get tasks error:', error)
      res.status(500).json({
        success: false,
        message: '服务器内部错误'
      })
    }
  }

  // 获取单个任务
  async getTask(req: Request, res: Response) {
    try {
      const { id } = req.params
      const userId = (req as any).user.userId

      const task = await prisma.task.findFirst({
        where: {
          id,
          OR: [
            { assigneeId: userId },
            { createdBy: userId }
          ]
        },
        include: {
          assignee: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          },
          creator: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          project: {
            select: {
              id: true,
              name: true
            }
          }
        }
      })

      if (!task) {
        return res.status(404).json({
          success: false,
          message: '任务不存在'
        })
      }

      res.status(200).json({
        success: true,
        data: { task }
      })
    } catch (error) {
      console.error('Get task error:', error)
      res.status(500).json({
        success: false,
        message: '服务器内部错误'
      })
    }
  }

  // 创建任务
  async createTask(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId
      const {
        title,
        description,
        status = 'TODO',
        priority = 'MEDIUM',
        assigneeId,
        dueDate,
        projectId,
        tags = []
      } = req.body

      // 验证必填字段
      if (!title) {
        return res.status(400).json({
          success: false,
          message: '请提供任务标题'
        })
      }

      if (!assigneeId) {
        return res.status(400).json({
          success: false,
          message: '请指定任务执行人'
        })
      }

      // 创建新任务
      const newTask = await prisma.task.create({
        data: {
          title,
          description,
          status: status,
          priority: priority,
          assigneeId,
          createdBy: userId,
          projectId,
          tags,
          dueDate: dueDate ? new Date(dueDate) : null
        },
        include: {
          assignee: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          },
          creator: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          project: {
            select: {
              id: true,
              name: true
            }
          }
        }
      })

      res.status(201).json({
        success: true,
        message: '任务创建成功',
        data: { task: newTask }
      })
    } catch (error) {
      console.error('Create task error:', error)
      res.status(500).json({
        success: false,
        message: '服务器内部错误'
      })
    }
  }

  // 更新任务
  async updateTask(req: Request, res: Response) {
    try {
      const { id } = req.params
      const userId = (req as any).user.userId
      const updateData = req.body

      // 查找任务
      const existingTask = await prisma.task.findFirst({
        where: {
          id,
          OR: [
            { assigneeId: userId },
            { createdBy: userId }
          ]
        }
      })

      if (!existingTask) {
        return res.status(404).json({
          success: false,
          message: '任务不存在'
        })
      }

      // 准备更新数据
      const dataToUpdate: any = {}
      if (updateData.title) dataToUpdate.title = updateData.title
      if (updateData.description !== undefined) dataToUpdate.description = updateData.description
      if (updateData.status) dataToUpdate.status = updateData.status
      if (updateData.priority) dataToUpdate.priority = updateData.priority
      if (updateData.assigneeId) dataToUpdate.assigneeId = updateData.assigneeId
      if (updateData.projectId !== undefined) dataToUpdate.projectId = updateData.projectId
      if (updateData.tags) dataToUpdate.tags = updateData.tags
      if (updateData.dueDate !== undefined) {
        dataToUpdate.dueDate = updateData.dueDate ? new Date(updateData.dueDate) : null
      }

      // 更新任务
      const updatedTask = await prisma.task.update({
        where: { id },
        data: dataToUpdate,
        include: {
          assignee: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          },
          creator: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          project: {
            select: {
              id: true,
              name: true
            }
          }
        }
      })

      res.status(200).json({
        success: true,
        message: '任务更新成功',
        data: { task: updatedTask }
      })
    } catch (error) {
      console.error('Update task error:', error)
      res.status(500).json({
        success: false,
        message: '服务器内部错误'
      })
    }
  }

  // 删除任务
  async deleteTask(req: Request, res: Response) {
    try {
      const { id } = req.params
      const userId = (req as any).user.userId

      const task = await prisma.task.findFirst({
        where: {
          id,
          createdBy: userId // 只有创建者可以删除任务
        }
      })

      if (!task) {
        return res.status(404).json({
          success: false,
          message: '任务不存在或无权限删除'
        })
      }

      await prisma.task.delete({
        where: { id }
      })

      res.status(200).json({
        success: true,
        message: '任务删除成功'
      })
    } catch (error) {
      console.error('Delete task error:', error)
      res.status(500).json({
        success: false,
        message: '服务器内部错误'
      })
    }
  }

  // 获取任务统计
  async getTaskStats(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId

      const whereClause = {
        OR: [
          { assigneeId: userId },
          { createdBy: userId }
        ]
      }

      const [statusStats, priorityStats] = await Promise.all([
        prisma.task.groupBy({
          by: ['status'],
          where: whereClause,
          _count: {
            id: true
          }
        }),
        prisma.task.groupBy({
          by: ['priority'],
          where: whereClause,
          _count: {
            id: true
          }
        })
      ])

      const formattedStatusStats = statusStats.map(stat => ({
        _id: stat.status,
        count: stat._count.id
      }))

      const formattedPriorityStats = priorityStats.map(stat => ({
        _id: stat.priority,
        count: stat._count.id
      }))

      res.status(200).json({
        success: true,
        data: {
          statusStats: formattedStatusStats,
          priorityStats: formattedPriorityStats
        }
      })
    } catch (error) {
      console.error('Get task stats error:', error)
      res.status(500).json({
        success: false,
        message: '服务器内部错误'
      })
    }
  }
}

// 导出控制器实例
export const taskController = new TaskController();