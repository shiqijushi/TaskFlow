import React from 'react'

export const CalendarPage: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">日历</h1>
        <p className="mt-2 text-gray-600">查看和管理您的日程安排</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center py-12">
          <div className="text-6xl text-gray-400 mb-4">📅</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">日历功能</h3>
          <p className="text-gray-600">日历组件正在开发中，敬请期待...</p>
        </div>
      </div>
    </div>
  )
}