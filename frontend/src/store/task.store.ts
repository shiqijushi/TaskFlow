import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task } from '@shared/types'



interface TaskState {
  tasks: Task[]
  selectedTask: Task | null
  isLoading: boolean
  error: string | null
}

interface TaskActions {
  setTasks: (tasks: Task[]) => void
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  setSelectedTask: (task: Task | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useTaskStore = create<TaskState & TaskActions>()(
  persist(
    (set) => ({
      // State
      tasks: [],
      selectedTask: null,
      isLoading: false,
      error: null,

      // Actions
      setTasks: (tasks) => set({ tasks }),
      
      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        set((state) => ({
          tasks: [...state.tasks, newTask]
        }))
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date() }
              : task
          )
        }))
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
          selectedTask: state.selectedTask?.id === id ? null : state.selectedTask
        }))
      },

      setSelectedTask: (task) => set({ selectedTask: task }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'task-storage',
      partialize: (state) => ({
        tasks: state.tasks,
        selectedTask: state.selectedTask,
      }),
    }
  )
)