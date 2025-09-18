import React, { useState } from 'react'
import type { Project } from '@shared/types'
import { ProjectStatus } from '@shared/types'

const mockProjects: Project[] = [
  {
    id: '1',
    name: '移动端应用开发',
    description: '开发跨平台移动应用',
    color: '#3B82F6',
    status: ProjectStatus.ACTIVE,
    ownerId: '1',
    members: [],
    progress: 65,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Web平台重构',
    description: '重构现有Web平台架构',
    color: '#10B981',
    status: ProjectStatus.ACTIVE,
    ownerId: '1',
    members: [],
    progress: 30,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export const ProjectsPage: React.FC = () => {
  const [projects] = useState<Project[]>(mockProjects)

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">项目管理</h1>
        <p className="mt-2 text-gray-600">管理和跟踪您的所有项目</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
            <p className="text-gray-600 mb-4">{project.description}</p>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>进度</span>
                <span>{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>成员数量: {project.members.length}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                project.status === ProjectStatus.ACTIVE ? 'bg-green-100 text-green-800' :
                project.status === ProjectStatus.COMPLETED ? 'bg-blue-100 text-blue-800' :
                project.status === ProjectStatus.ON_HOLD ? 'bg-yellow-100 text-yellow-800' :
                project.status === ProjectStatus.PLANNING ? 'bg-gray-100 text-gray-800' :
                'bg-red-100 text-red-800'
              }`}>
                {project.status === ProjectStatus.ACTIVE ? '进行中' :
                 project.status === ProjectStatus.COMPLETED ? '已完成' : 
                 project.status === ProjectStatus.ON_HOLD ? '暂停' :
                 project.status === ProjectStatus.PLANNING ? '计划中' : '已取消'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}