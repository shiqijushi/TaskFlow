import { Router } from 'express'
import { authController } from '../controllers/authController'
import { authMiddleware } from '../middleware/auth'

const router = Router()

// 公开路由
router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/logout', authController.logout)

// 受保护的路由
router.get('/profile', authMiddleware, authController.getProfile)
router.put('/profile', authMiddleware, authController.updateProfile)

export default router