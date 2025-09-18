import React, { useState } from 'react'
import { Plus, Search, CheckSquare, Calendar, User } from 'lucide-react'
import type { Task } from '@shared/types'
import { TaskStatus, TaskPriority } from '@shared/types'



const mockTasks: Task[] = [
  {
    id: '1',
    title: '设计用户界面',
    description: '为新功能创建用户界面设计',
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.HIGH,
    creatorId: '1',
    projectId: '1',
    assigneeId: '1',
    dueDate: new Date('2024-01-15'),
    tags: ['设计', 'UI'],
    attachments: [],
    comments: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    title: '实现登录功能',
    description: '开发用户登录和认证系统',
    status: TaskStatus.TODO,
    priority: TaskPriority.URGENT,
    creatorId: '1',
    projectId: '2',
    assigneeId: '2',
    dueDate: new Date('2024-01-12'),
    tags: ['开发', '后端'],
    attachments: [],
    comments: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    title: '编写测试用例',
    description: '为核心功能编写单元测试',
    status: TaskStatus.COMPLETED,
    priority: TaskPriority.MEDIUM,
    creatorId: '1',
    projectId: '1',
    assigneeId: '3',
    dueDate: new Date('2024-01-10'),
    tags: ['测试', '质量保证'],
    attachments: [],
    comments: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    title: '优化数据库查询',
    description: '提高数据库查询性能',
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.LOW,
    creatorId: '1',
    projectId: '3',
    assigneeId: '4',
    dueDate: new Date('2024-01-20'),
    tags: ['数据库', '性能'],
    attachments: [],
    comments: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

const statusColors = {
  [TaskStatus.TODO]: 'bg-gray-100 text-gray-800',
  [TaskStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
  [TaskStatus.IN_REVIEW]: 'bg-purple-100 text-purple-800',
  [TaskStatus.COMPLETED]: 'bg-green-100 text-green-800',
  [TaskStatus.CANCELLED]: 'bg-red-100 text-red-800'
}

const priorityColors = {
  [TaskPriority.LOW]: 'bg-gray-100 text-gray-800',
  [TaskPriority.MEDIUM]: 'bg-yellow-100 text-yellow-800',
  [TaskPriority.HIGH]: 'bg-orange-100 text-orange-800',
  [TaskPriority.URGENT]: 'bg-red-100 text-red-800'
}

const statusLabels = {
  [TaskStatus.TODO]: '待开始',
  [TaskStatus.IN_PROGRESS]: '进行中',
  [TaskStatus.IN_REVIEW]: '待审核',
  [TaskStatus.COMPLETED]: '已完成',
  [TaskStatus.CANCELLED]: '已取消'
}

const priorityLabels = {
  [TaskPriority.LOW]: '低',
  [TaskPriority.MEDIUM]: '中',
  [TaskPriority.HIGH]: '高',
  [TaskPriority.URGENT]: '紧急'
}

export const TasksPage: React.FC = () => {
  const [tasks] = useState<Task[]>(mockTasks)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [showNewTaskModal, setShowNewTaskModal] = useState(false)

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">任务管理</h1>
            <p className="mt-2 text-gray-600">管理和跟踪您的所有工作任务</p>
          </div>
          <button
            onClick={() => setShowNewTaskModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            新建任务
          </button>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索任务..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">所有状态</option>
              <option value={TaskStatus.TODO}>待开始</option>
              <option value={TaskStatus.IN_PROGRESS}>进行中</option>
              <option value={TaskStatus.IN_REVIEW}>待审核</option>
              <option value={TaskStatus.COMPLETED}>已完成</option>
              <option value={TaskStatus.CANCELLED}>已取消</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">所有优先级</option>
              <option value={TaskPriority.LOW}>低优先级</option>
              <option value={TaskPriority.MEDIUM}>中优先级</option>
              <option value={TaskPriority.HIGH}>高优先级</option>
              <option value={TaskPriority.URGENT}>紧急</option>
            </select>
          </div>
        </div>
      </div>

      {/* 任务统计 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-gray-900">{tasks.length}</div>
          <div className="text-sm text-gray-600">总任务数</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-blue-600">
            {tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length}
          </div>
          <div className="text-sm text-gray-600">进行中</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-green-600">
            {tasks.filter(t => t.status === TaskStatus.COMPLETED).length}
          </div>
          <div className="text-sm text-gray-600">已完成</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-red-600">
            {tasks.filter(t => t.priority === TaskPriority.URGENT).length}
          </div>
          <div className="text-sm text-gray-600">紧急任务</div>
        </div>
      </div>

      {/* 任务列表 */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  任务
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  优先级
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  负责人
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  截止日期
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  项目
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">操作</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <CheckSquare className="flex-shrink-0 h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {task.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {task.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[task.status]}`}>
                      {statusLabels[task.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${priorityColors[task.priority]}`}>
                      {priorityLabels[task.priority]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      {task.assigneeId || '未分配'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      {task.dueDate ? task.dueDate.toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      }) : '无截止日期'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {task.projectId || '无项目'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-2">
                      编辑
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <CheckSquare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">没有找到任务</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                ? '尝试调整搜索条件或筛选器'
                : '开始创建您的第一个任务'}
            </p>
          </div>
        )}
      </div>

      {/* 新建任务模态框占位符 */}
      {showNewTaskModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">新建任务</h3>
              <p className="text-sm text-gray-500 mb-4">任务创建功能正在开发中...</p>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowNewTaskModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}