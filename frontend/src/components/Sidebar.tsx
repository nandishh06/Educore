import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'

interface SidebarProps {
  open?: boolean
  onClose: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const navigate = useNavigate()
  const [isFeaturesDropdownOpen, setIsFeaturesDropdownOpen] = useState(false)

  return (
    <>
      {/* Mobile Sidebar */}
      {open && (
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg lg:hidden">
          <div className="p-4">
            <button
              onClick={onClose}
              className="mb-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕ Close
            </button>
            <div className="space-y-2">
              <button
                onClick={() => {
                  onClose()
                  navigate('/teachers')
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
              >
                <span className="mr-3">👨‍🏫</span>
                Teachers
              </button>
              <button
                onClick={() => {
                  onClose()
                  navigate('/departments')
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
              >
                <span className="mr-3">🏢</span>
                Departments
              </button>
              <button
                onClick={() => {
                  onClose()
                  navigate('/timetable')
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
              >
                <span className="mr-3">📅</span>
                Timetable
              </button>
              <button
                onClick={() => {
                  onClose()
                  navigate('/calendar')
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
              >
                <span className="mr-3">🗓️</span>
                Calendar
              </button>
              <button
                onClick={() => {
                  onClose()
                  navigate('/classes')
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
              >
                <span className="mr-3">📚</span>
                Classes
              </button>
              <button
                onClick={() => {
                  onClose()
                  navigate('/subjects')
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
              >
                <span className="mr-3">📖</span>
                Subjects
              </button>
              <button
                onClick={() => {
                  onClose()
                  navigate('/marks-and-results')
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
              >
                <span className="mr-3">📊</span>
                Marks & Results
              </button>
              <button
                onClick={() => {
                  onClose()
                  navigate('/attendance-percentage')
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
              >
                <span className="mr-3">📈</span>
                Attendance %
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Features Dropdown */}
      <div className="relative mr-4 hidden lg:block">
        <button
          onClick={() => setIsFeaturesDropdownOpen(!isFeaturesDropdownOpen)}
          className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <span className="text-lg">📋</span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Features</span>
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isFeaturesDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Features Dropdown */}
        {isFeaturesDropdownOpen && (
          <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
            <div className="py-2">
              <button
                onClick={() => {
                  setIsFeaturesDropdownOpen(false)
                  navigate('/teachers')
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <span className="mr-3">👨‍🏫</span>
                Teachers
              </button>
              <button
                onClick={() => {
                  setIsFeaturesDropdownOpen(false)
                  navigate('/departments')
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <span className="mr-3">🏢</span>
                Departments
              </button>
              <button
                onClick={() => {
                  setIsFeaturesDropdownOpen(false)
                  navigate('/timetable')
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <span className="mr-3">📅</span>
                Timetable
              </button>
              <button
                onClick={() => {
                  setIsFeaturesDropdownOpen(false)
                  navigate('/calendar')
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <span className="mr-3">🗓️</span>
                Calendar
              </button>
              <button
                onClick={() => {
                  setIsFeaturesDropdownOpen(false)
                  navigate('/classes')
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <span className="mr-3">📚</span>
                Classes
              </button>
              <button
                onClick={() => {
                  setIsFeaturesDropdownOpen(false)
                  onClose()
                  navigate('/subjects')
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <span className="mr-3">📖</span>
                Subjects
              </button>
              <button
                onClick={() => {
                  setIsFeaturesDropdownOpen(false)
                  onClose()
                  navigate('/marks-and-results')
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <span className="mr-3">📊</span>
                Marks & Results
              </button>
              <button
                onClick={() => {
                  setIsFeaturesDropdownOpen(false)
                  onClose()
                  navigate('/attendance-percentage')
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <span className="mr-3">📈</span>
                Attendance %
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Overlay for desktop dropdown */}
      {isFeaturesDropdownOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsFeaturesDropdownOpen(false)}
        />
      )}
    </>
  )
}

export default Sidebar
