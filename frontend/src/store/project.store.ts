import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Project } from '@shared/types'

interface ProjectState {
  projects: Project[]
  selectedProject: Project | null
  isLoading: boolean
  error: string | null
}

interface ProjectActions {
  setProjects: (projects: Project[]) => void
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  setSelectedProject: (project: Project | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useProjectStore = create<ProjectState & ProjectActions>()(
  persist(
    (set) => ({
      // State
      projects: [],
      selectedProject: null,
      isLoading: false,
      error: null,

      // Actions
      setProjects: (projects) => set({ projects }),
      
      addProject: (projectData) => {
        const newProject: Project = {
          ...projectData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        set((state) => ({
          projects: [...state.projects, newProject]
        }))
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id
              ? { ...project, ...updates, updatedAt: new Date() }
              : project
          )
        }))
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
          selectedProject: state.selectedProject?.id === id ? null : state.selectedProject
        }))
      },

      setSelectedProject: (project) => set({ selectedProject: project }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'project-storage',
      partialize: (state) => ({
        projects: state.projects,
        selectedProject: state.selectedProject,
      }),
    }
  )
)