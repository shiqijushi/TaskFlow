import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@/test/utils'
import { LoginPage } from '@/pages/auth/LoginPage'
import userEvent from '@testing-library/user-event'

// Mock useAuthStore
const mockLogin = vi.fn()
const mockAuthStore = {
  login: mockLogin,
  isLoading: false,
  user: null,
  isAuthenticated: false,
  error: null
}

vi.mock('@/store/auth.store', () => ({
  useAuthStore: () => mockAuthStore
}))

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom') as any
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders login form correctly', () => {
    render(<LoginPage />)
    
    expect(screen.getByText('登录到 TaskFlow')).toBeInTheDocument()
    expect(screen.getByLabelText('邮箱地址')).toBeInTheDocument()
    expect(screen.getByLabelText('密码')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '登录' })).toBeInTheDocument()
    expect(screen.getByText('立即注册')).toBeInTheDocument()
  })

  it('shows validation errors for empty fields', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    
    const submitButton = screen.getByRole('button', { name: '登录' })
    await user.click(submitButton)
    
    expect(screen.getByText('请输入邮箱地址')).toBeInTheDocument()
    expect(screen.getByText('请输入密码')).toBeInTheDocument()
  })

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText('邮箱地址')
    const submitButton = screen.getByRole('button', { name: '登录' })
    
    await user.type(emailInput, 'invalid-email')
    await user.click(submitButton)
    
    expect(screen.getByText('请输入有效的邮箱地址')).toBeInTheDocument()
  })

  it('shows validation error for short password', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText('邮箱地址')
    const passwordInput = screen.getByLabelText('密码')
    const submitButton = screen.getByRole('button', { name: '登录' })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, '123')
    await user.click(submitButton)
    
    expect(screen.getByText('密码至少需要6个字符')).toBeInTheDocument()
  })

  it('submits form with valid data', async () => {
    const user = userEvent.setup()
    mockLogin.mockResolvedValue(undefined)
    
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText('邮箱地址')
    const passwordInput = screen.getByLabelText('密码')
    const submitButton = screen.getByRole('button', { name: '登录' })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123')
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
  })

  it('toggles password visibility', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    
    const passwordInput = screen.getByLabelText('密码')
    const toggleButton = screen.getByRole('button', { name: '' }) // 密码切换按钮
    
    expect(passwordInput).toHaveAttribute('type', 'password')
    
    await user.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'text')
    
    await user.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('shows loading state when submitting', () => {
    mockAuthStore.isLoading = true
    render(<LoginPage />)
    
    expect(screen.getByRole('button', { name: '登录' })).toBeDisabled()
  })
})