import request, { SuperTest, Test } from 'supertest'
import { Express } from 'express'
import { User } from '../models/User'
import jwt from 'jsonwebtoken'

export const createTestUser = async () => {
  const userData = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    roles: ['user']
  }
  
  const user = new User(userData)
  await user.save()
  return user
}

export const createTestAdmin = async () => {
  const userData = {
    name: 'Test Admin',
    email: 'admin@example.com',
    password: 'password123',
    roles: ['admin']
  }
  
  const user = new User(userData)
  await user.save()
  return user
}

export const generateAuthToken = (userId: string, roles: string[] = ['user']) => {
  return jwt.sign(
    { userId, roles },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '1h' }
  )
}

// 创建带认证的请求对象
export const authenticatedRequest = (app: Express, token: string) => {
  return {
    get: (url: string) => request(app).get(url).set('Authorization', `Bearer ${token}`),
    post: (url: string) => request(app).post(url).set('Authorization', `Bearer ${token}`),
    put: (url: string) => request(app).put(url).set('Authorization', `Bearer ${token}`),
    delete: (url: string) => request(app).delete(url).set('Authorization', `Bearer ${token}`),
    patch: (url: string) => request(app).patch(url).set('Authorization', `Bearer ${token}`)
  }
}

export const loginUser = async (app: Express, email: string, password: string) => {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ email, password })
  
  return response.body.data.token
}

export const createTestTask = (userId: string) => ({
  title: 'Test Task',
  description: 'Test task description',
  status: 'todo',
  priority: 'medium',
  assignee: userId,
  project: 'Test Project',
  tags: ['test'],
  createdBy: userId
})

export const createTestProject = (userId: string) => ({
  name: 'Test Project',
  description: 'Test project description',
  status: 'active',
  members: [userId],
  createdBy: userId
})