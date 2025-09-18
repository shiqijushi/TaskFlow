import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@shared/types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (email: string, password: string, name: string) => Promise<void>
  updateUser: (userData: Partial<User>) => void
  setLoading: (loading: boolean) => void
  loginAsDemo: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      token: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          if (!email || !password) {
            throw new Error('邮箱和密码不能为空')
          }
          
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.message || '登录失败')
          }

          const { user, token } = data.data
          
          set({
            user,
            isAuthenticated: true,
            token,
            isLoading: false
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      register: async (email: string, password: string, name: string) => {
        set({ isLoading: true })
        try {
          if (!email || !password || !name) {
            throw new Error('邮箱、密码和姓名不能为空')
          }
          if (password.length < 6) {
            throw new Error('密码长度不能少于6位')
          }
          
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, name })
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.message || '注册失败')
          }

          const { user, token } = data.data
          
          set({
            user,
            isAuthenticated: true,
            token,
            isLoading: false
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          token: null,
          isLoading: false
        })
      },

      updateUser: (userData: Partial<User>) => {
        const { user } = get()
        if (user) {
          set({
            user: { ...user, ...userData }
          })
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      loginAsDemo: () => {
        const demoUser: User = {
          id: 'demo-user-001',
          email: 'demo@taskflow.com',
          name: '演示用户',
          avatar: null,
          roles: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
        
        set({
          user: demoUser,
          isAuthenticated: true,
          token: 'demo-token',
          isLoading: false
        })
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token
      })
    }
  )
)