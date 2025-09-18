import request from 'supertest'
import { app } from '../../index'
import { User } from '../../models/User'
import { createTestUser, loginUser } from '../utils'

describe('Auth Controller', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123'
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.user.email).toBe(userData.email)
      expect(response.body.data.user.name).toBe(userData.name)
      expect(response.body.data.token).toBeDefined()

      // 验证用户已保存到数据库
      const savedUser = await User.findOne({ email: userData.email })
      expect(savedUser).toBeTruthy()
      expect(savedUser?.name).toBe(userData.name)
    })

    it('should not register user with invalid email', async () => {
      const userData = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123'
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('邮箱')
    })

    it('should not register user with short password', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: '123'
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('密码')
    })

    it('should not register user with existing email', async () => {
      await createTestUser()

      const userData = {
        name: 'Another User',
        email: 'test@example.com',
        password: 'password123'
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(409)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('已被注册')
    })
  })

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await createTestUser()
    })

    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      }

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.user.email).toBe(loginData.email)
      expect(response.body.data.token).toBeDefined()
    })

    it('should not login with invalid email', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123'
      }

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('邮箱或密码错误')
    })

    it('should not login with invalid password', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      }

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('邮箱或密码错误')
    })
  })

  describe('GET /api/auth/profile', () => {
    it('should get user profile with valid token', async () => {
      const user = await createTestUser()
      const token = await loginUser(app, 'test@example.com', 'password123')

      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.user.email).toBe(user.email)
      expect(response.body.data.user.password).toBeUndefined()
    })

    it('should not get profile without token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .expect(401)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('未提供令牌')
    })

    it('should not get profile with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('令牌无效')
    })
  })
})