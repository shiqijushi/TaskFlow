import { Router } from 'express'
import { taskController } from '../controllers/taskController'
import { authMiddleware } from '../middleware/auth'

const router = Router()

// 所有任务路由都需要认证
router.use(authMiddleware)

// 任务CRUD操作
router.get('/', taskController.getTasks)
router.get('/stats', taskController.getTaskStats)
router.get('/:id', taskController.getTask)
router.post('/', taskController.createTask)
router.put('/:id', taskController.updateTask)
router.delete('/:id', taskController.deleteTask)

export default router