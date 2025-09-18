import { Router } from 'express'
import { projectController } from '../controllers/projectController'
import { authMiddleware } from '../middleware/auth'

const router = Router()

// 所有项目路由都需要认证
router.use(authMiddleware)

// 项目CRUD操作
router.get('/', projectController.getProjects)
router.get('/:id', projectController.getProject)
router.post('/', projectController.createProject)
router.put('/:id', projectController.updateProject)
router.delete('/:id', projectController.deleteProject)

// 项目成员管理
router.post('/:id/members', projectController.addMember)
router.delete('/:id/members/:memberId', projectController.removeMember)

export default router