import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ErrorBoundary } from '@/components/ErrorBoundary'

// 创建测试用的Wrapper组件
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </ErrorBoundary>
  )
}

// 自定义render函数
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// 重新导出everything
export * from '@testing-library/react'

// 覆盖render方法
export { customRender as render }

// 常用的测试工具函数
export const createMockUser = () => ({
  id: 'test-user-id',
  name: 'Test User',
  email: 'test@example.com',
  avatar: null,
  role: 'MEMBER' as const,
  createdAt: new Date(),
  updatedAt: new Date()
})

export const createMockTask = () => ({
  id: 'test-task-id',
  title: 'Test Task',
  description: 'Test task description',
  status: 'todo' as const,
  priority: 'medium' as const,
  creatorId: 'test-user-id',
  assigneeId: 'test-user-id',
  projectId: 'test-project-id',
  dueDate: new Date(),
  tags: ['test'],
  attachments: [],
  comments: [],
  createdAt: new Date(),
  updatedAt: new Date()
})

export const createMockProject = () => ({
  id: 'test-project-id',
  name: 'Test Project',
  description: 'Test project description',
  color: '#3B82F6',
  status: 'active' as const,
  ownerId: 'test-user-id',
  members: [],
  progress: 50,
  createdAt: new Date(),
  updatedAt: new Date()
})