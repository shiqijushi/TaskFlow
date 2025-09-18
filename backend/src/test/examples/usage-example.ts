// 使用示例：如何正确使用修复后的 authenticatedRequest 函数

import { Express } from 'express'
import { authenticatedRequest, generateAuthToken } from '../utils'

// 示例用法
async function testExample(app: Express) {
  // 1. 生成测试token
  const token = generateAuthToken('userId123', ['user'])
  
  // 2. 创建带认证的请求对象
  const authRequest = authenticatedRequest(app, token)
  
  // 3. 使用不同的HTTP方法
  
  // GET 请求示例
  const getResponse = await authRequest.get('/api/tasks')
    .expect(200)
  
  // POST 请求示例  
  const postResponse = await authRequest.post('/api/tasks')
    .send({
      title: 'New Task',
      description: 'Task description'
    })
    .expect(201)
  
  // PUT 请求示例
  const putResponse = await authRequest.put('/api/tasks/123')
    .send({
      title: 'Updated Task',
      status: 'completed'
    })
    .expect(200)
  
  // DELETE 请求示例
  const deleteResponse = await authRequest.delete('/api/tasks/123')
    .expect(204)
    
  // PATCH 请求示例
  const patchResponse = await authRequest.patch('/api/tasks/123')
    .send({
      status: 'in-progress'
    })
    .expect(200)
}

// 修复前的错误用法（会导致 ts(2339) 错误）：
// const badExample = (app: Express, token: string) => {
//   return request(app).set('Authorization', `Bearer ${token}`) // ❌ 错误：SuperTest<Test> 上不存在 set 属性
// }

// 修复后的正确用法：
// const goodExample = (app: Express, token: string) => {
//   return {
//     get: (url: string) => request(app).get(url).set('Authorization', `Bearer ${token}`), // ✅ 正确
//     post: (url: string) => request(app).post(url).set('Authorization', `Bearer ${token}`), // ✅ 正确
//     // ... 其他HTTP方法
//   }
// }

export { testExample }