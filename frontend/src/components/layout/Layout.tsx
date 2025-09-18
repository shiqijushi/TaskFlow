import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar.tsx'
import { Header } from './Header.tsx'

export const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}