import React from 'react'
import { Calendar, CheckSquare, Clock, TrendingUp, FolderOpen } from 'lucide-react'

const taskData = [
  { name: '已完成', value: 45, color: '#10B981' },
  { name: '进行中', value: 23, color: '#F59E0B' },
  { name: '待开始', value: 12, color: '#EF4444' },
  { name: '已暂停', value: 8, color: '#6B7280' },
]

const progressData = [
  { name: '周一', completed: 12, total: 20 },
  { name: '周二', completed: 15, total: 18 },
  { name: '周三', completed: 8, total: 25 },
  { name: '周四', completed: 18, total: 22 },
  { name: '周五', completed: 22, total: 24 },
  { name: '周六', completed: 14, total: 16 },
  { name: '周日', completed: 10, total: 12 },
]

const timeData = [
  { name: '1月', hours: 120 },
  { name: '2月', hours: 135 },
  { name: '3月', hours: 148 },
  { name: '4月', hours: 162 },
  { name: '5月', hours: 158 },
  { name: '6月', hours: 175 },
]

export const DashboardPage: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">仪表盘</h1>
        <p className="mt-2 text-gray-600">欢迎回到 TaskFlow，这里是您的工作概览</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckSquare className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">总任务数</p>
              <p className="text-2xl font-bold text-gray-900">88</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm font-medium">+12% 本周</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">完成率</p>
              <p className="text-2xl font-bold text-gray-900">78%</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm font-medium">+5% 本周</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">本周工时</p>
              <p className="text-2xl font-bold text-gray-900">42h</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-yellow-600 text-sm font-medium">+8% 本周</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FolderOpen className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">活跃项目</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-purple-600 text-sm font-medium">+2 本周</span>
          </div>
        </div>
      </div>

      {/* 简化图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* 任务状态分布 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">任务状态分布</h3>
          <div className="space-y-4">
            {taskData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-3" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-700">{item.name}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        backgroundColor: item.color, 
                        width: `${(item.value / 88) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 每日完成情况 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">本周完成情况</h3>
          <div className="space-y-3">
            {progressData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 w-12">{item.name}</span>
                <div className="flex-1 mx-4">
                  <div className="flex items-center space-x-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                      <div 
                        className="bg-green-500 h-4 rounded-full" 
                        style={{ width: `${(item.completed / item.total) * 100}%` }}
                      ></div>
                      <div 
                        className="absolute top-0 right-0 bg-gray-300 h-4 rounded-full" 
                        style={{ width: `${((item.total - item.completed) / item.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <span className="text-sm text-gray-600">{item.completed}/{item.total}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 工时趋势 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">工时趋势（最近6个月）</h3>
        <div className="flex items-end justify-between h-64 px-4">
          {timeData.map((item, index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div 
                className="bg-purple-500 rounded-t w-8" 
                style={{ height: `${(item.hours / 200) * 240}px` }}
              ></div>
              <span className="text-xs text-gray-600">{item.name}</span>
              <span className="text-xs font-medium text-gray-900">{item.hours}h</span>
            </div>
          ))}
        </div>
      </div>

      {/* 最近活动和快捷操作 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最近活动 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">最近活动</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">完成任务 "设计登录页面"</p>
                <p className="text-xs text-gray-500">2小时前</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">创建新项目 "移动端应用"</p>
                <p className="text-xs text-gray-500">4小时前</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">更新任务状态</p>
                <p className="text-xs text-gray-500">6小时前</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">参加团队会议</p>
                <p className="text-xs text-gray-500">1天前</p>
              </div>
            </div>
          </div>
        </div>

        {/* 快捷操作 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">快捷操作</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <CheckSquare className="h-8 w-8 text-blue-600 mb-2" />
              <p className="font-medium text-gray-900">新建任务</p>
              <p className="text-sm text-gray-500">创建新的工作任务</p>
            </button>
            <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <FolderOpen className="h-8 w-8 text-green-600 mb-2" />
              <p className="font-medium text-gray-900">新建项目</p>
              <p className="text-sm text-gray-500">开始新的项目</p>
            </button>
            <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Clock className="h-8 w-8 text-yellow-600 mb-2" />
              <p className="font-medium text-gray-900">时间跟踪</p>
              <p className="text-sm text-gray-500">记录工作时间</p>
            </button>
            <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Calendar className="h-8 w-8 text-purple-600 mb-2" />
              <p className="font-medium text-gray-900">查看日历</p>
              <p className="text-sm text-gray-500">管理日程安排</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}