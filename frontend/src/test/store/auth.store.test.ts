import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAuthStore } from '@/store/auth.store'

// Mock crypto.randomUUID
const mockUUID = 'mock-uuid-123'
vi.stubGlobal('crypto', {
  randomUUID: () => mockUUID
})

describe('useAuthStore', () => {
  beforeEach(() => {
    // 清理store状态
    useAuthStore.getState().logout()
    vi.clearAllMocks()
  })

  it('has correct initial state', () => {
    const { result } = renderHook(() => useAuthStore())
    
    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.token).toBeNull()
  })

  it('handles successful login', async () => {
    const { result } = renderHook(() => useAuthStore())
    
    await act(async () => {
      await result.current.login('test@example.com', 'password123')
    })
    
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user).toMatchObject({
      email: 'test@example.com',
      name: 'test'
    })
    expect(result.current.token).toContain('mock-jwt-token-')
    expect(result.current.isLoading).toBe(false)
  })

  it('handles successful registration', async () => {
    const { result } = renderHook(() => useAuthStore())
    
    await act(async () => {
      await result.current.register('test@example.com', 'password123', 'Test User')
    })
    
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user).toMatchObject({
      email: 'test@example.com',
      name: 'Test User'
    })
    expect(result.current.token).toContain('mock-jwt-token-')
    expect(result.current.isLoading).toBe(false)
  })

  it('handles logout', async () => {
    const { result } = renderHook(() => useAuthStore())
    
    // 先登录
    await act(async () => {
      await result.current.login('test@example.com', 'password123')
    })
    
    expect(result.current.isAuthenticated).toBe(true)
    
    // 然后登出
    act(() => {
      result.current.logout()
    })
    
    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.token).toBeNull()
    expect(result.current.isLoading).toBe(false)
  })

  it('updates user profile', async () => {
    const { result } = renderHook(() => useAuthStore())
    
    // 先登录
    await act(async () => {
      await result.current.login('test@example.com', 'password123')
    })
    
    const updatedData = { name: 'Updated Name', avatar: 'new-avatar.jpg' }
    
    act(() => {
      result.current.updateUser(updatedData)
    })
    
    expect(result.current.user).toMatchObject(updatedData)
  })

  it('sets loading state correctly', async () => {
    const { result } = renderHook(() => useAuthStore())
    
    act(() => {
      result.current.setLoading(true)
    })
    
    expect(result.current.isLoading).toBe(true)
    
    act(() => {
      result.current.setLoading(false)
    })
    
    expect(result.current.isLoading).toBe(false)
  })
})