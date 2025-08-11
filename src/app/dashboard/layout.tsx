import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Menu, 
  X, 
  User, 
  Building2, 
  Briefcase, 
  MessageSquare, 
  FileText, 
  Settings,
  LogOut,
  Bell
} from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

interface DashboardLayoutProps {
  children: React.ReactNode
  userType: 'consultant' | 'client'
}

export default function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Briefcase,
      current: location.pathname === '/dashboard'
    },
    {
      name: userType === 'consultant' ? 'My Profile' : 'Company Profile',
      href: '/dashboard/profile',
      icon: User,
      current: location.pathname === '/dashboard/profile'
    },
    {
      name: 'Projects',
      href: '/dashboard/projects',
      icon: FileText,
      current: location.pathname === '/dashboard/projects'
    },
    {
      name: 'Messages',
      href: '/dashboard/messages',
      icon: MessageSquare,
      current: location.pathname === '/dashboard/messages'
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
      current: location.pathname === '/dashboard/settings'
    }
  ]

  const handleLogout = () => {
    // TODO: Implement Supabase auth logout
    console.log('Logging out...')
    navigate('/auth/login')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200">
          <h1 className="text-xl font-bold text-[#012E46]">GigExecs</h1>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${item.current
                      ? 'bg-[#012E46] text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className={`
                    mr-3 h-5 w-5 flex-shrink-0
                    ${item.current ? 'text-white' : 'text-slate-400 group-hover:text-slate-500'}
                  `} />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* User info and logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-[#4885AA] rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {userType === 'consultant' ? 'C' : 'B'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {userType === 'consultant' ? 'Consultant' : 'Client'} Account
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button
            type="button"
            variant="ghost"
            className="-m-2.5 p-2.5 text-slate-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center">
              <h2 className="text-lg font-semibold text-slate-900">
                {navigation.find(item => item.current)?.name || 'Dashboard'}
              </h2>
            </div>
            
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5 text-slate-400" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </Button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

