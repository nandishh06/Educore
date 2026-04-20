import React, { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Building2,
  CalendarCheck,
  LogOut,
  Settings,
  ChevronDown,
} from 'lucide-react'

interface SidebarProps {
  onClose: () => void
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'principal', 'hod', 'teacher'] },
  { name: 'Attendance', href: '/attendance', icon: CalendarCheck, roles: ['admin', 'principal', 'hod', 'teacher'] },
  { name: 'Students', href: '/students', icon: Users, roles: ['admin', 'principal', 'hod', 'teacher'] },
  { name: 'Teachers', href: '/teachers', icon: GraduationCap, roles: ['admin', 'principal', 'hod'] },
  { name: 'Departments', href: '/departments', icon: Building2, roles: ['admin', 'principal', 'hod'] },
  { name: 'Settings', href: '/settings', icon: Settings, roles: ['admin'] },
]

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const location = useLocation()
  const { user, logout } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const filteredNavigation = navigation.filter(item =>
    user?.role && item.roles.includes(user.role)
  )

  return (
    <>
      {/* Single Dropdown Menu */}
      <div className="relative">
        {/* Dropdown Trigger */}
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-3 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">EduCore</h3>
              <p className="text-sm text-gray-500">School Management System</p>
            </div>

            {/* Navigation Items */}
            <div className="py-2">
              {filteredNavigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => {
                      setIsDropdownOpen(false)
                      onClose()
                    }}
                    className={`flex items-center px-4 py-2 text-sm ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 py-2">
              <button
                onClick={() => {
                  logout()
                  setIsDropdownOpen(false)
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <LogOut className="mr-3 h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Overlay for mobile */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </>
  )
}

export default Sidebar
