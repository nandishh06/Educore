import React, { useState } from 'react'
import { Menu, ChevronDown, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

interface HeaderProps {
  onMenuClick: () => void
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)

  // All available users for switching
  const allUsers = [
    { id: 1, name: 'Admin User', email: 'admin@educore.com', role: 'admin' },
    { id: 2, name: 'Teacher User', email: 'teacher@educore.com', role: 'teacher' },
    { id: 3, name: 'Student User', email: 'student@educore.com', role: 'student' },
    { id: 4, name: 'Principal User', email: 'principal@educore.com', role: 'principal' },
    { id: 5, name: 'Parent User', email: 'parent@educore.com', role: 'parent' },
  ]

  const handleUserSwitch = (selectedUser: typeof allUsers[0]) => {
    // For now, just reload the page with the selected user
    // In a real app, this would involve re-authentication
    alert(`Switching to ${selectedUser.name} (${selectedUser.role})\n\nIn a production app, this would require re-authentication.\nFor now, this is a demo feature.`)
    setIsUserDropdownOpen(false)
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Page title */}
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* User info with dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                  </div>
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown */}
              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">EduCore</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Switch User Account</p>
                      </div>
                      <button
                        onClick={toggleTheme}
                        className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {isDark ? '☀️' : '🌙'}
                      </button>
                    </div>
                  </div>

                  {/* All Users */}
                  <div className="py-2 max-h-96 overflow-y-auto">
                    {allUsers.map((currentUser) => (
                      <button
                        key={currentUser.id}
                        onClick={() => handleUserSwitch(currentUser)}
                        className={`w-full flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                          user?.email === currentUser.email
                            ? 'bg-gray-50 dark:bg-gray-700 border-l-4 border-primary-500'
                            : 'border-l-4 border-transparent'
                        }`}
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            user?.email === currentUser.email
                              ? 'bg-primary-500'
                              : 'bg-gray-400 dark:bg-gray-600'
                          }`}>
                            <span className="text-white text-sm font-medium">
                              {currentUser.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="text-left flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {currentUser.name}
                              {user?.email === currentUser.email && (
                                <span className="ml-2 text-xs text-primary-600 dark:text-primary-400 font-semibold">
                                  (Current)
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{currentUser.role}</p>
                          </div>
                        </div>
                        {user?.email === currentUser.email && (
                          <span className="text-green-500 text-xs">✓</span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="border-t border-gray-200 dark:border-gray-700 py-2">
                    <button
                      onClick={() => {
                        logout()
                        setIsUserDropdownOpen(false)
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
