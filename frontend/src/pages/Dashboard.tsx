import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardBody, Button, Badge } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import ReportGenerator from '../components/ReportGenerator'

interface DashboardStats {
  totalStudents: number
  totalTeachers: number
  totalDepartments: number
  attendanceRate: number
}

interface StudentStatistics {
  total: number
  active: number
  inactive: number
  byGrade: {
    'Grade 10': number
    'Grade 11': number
    'Grade 12': number
  }
  byGender?: {
    male: number
    female: number
  }
}

interface ActivityItem {
  id: string
  title: string
  description: string
  timestamp: string
  type: 'student' | 'teacher' | 'attendance' | 'other'
  isNew?: boolean
}

const Dashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalDepartments: 0,
    attendanceRate: 0
  })
  const [studentStats, setStudentStats] = useState<StudentStatistics | null>(null)
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        
        // Use mock data for now since database is not configured
        // This would normally fetch from API:
        // const studentStatsResponse = await StudentsService.getStatistics()
        // if (studentStatsResponse.data) {
        //   setStudentStats(studentStatsResponse.data)
        //   setStats(prev => ({
        //     ...prev,
        //     totalStudents: studentStatsResponse.data.total,
        //     attendanceRate: studentStatsResponse.data.total > 0 
        //       ? Math.round((studentStatsResponse.data.active / studentStatsResponse.data.total) * 100)
        //       : 0
        //   }))
        // }

        // Mock data for dashboard
        setStats({
          totalStudents: 245,
          totalTeachers: 56,
          totalDepartments: 8,
          attendanceRate: 87
        })

        // Mock student statistics
        setStudentStats({
          total: 245,
          active: 213,
          inactive: 32,
          byGrade: {
            'Grade 10': 85,
            'Grade 11': 78,
            'Grade 12': 82
          },
          byGender: {
            male: 125,
            female: 120
          }
        })

        // Mock recent activities (would be replaced with actual API calls)
        setActivities([
          {
            id: '1',
            title: 'New student registered',
            description: 'John Doe joined Grade 10',
            timestamp: '2 hours ago',
            type: 'student',
            isNew: true
          },
          {
            id: '2',
            title: 'Attendance marked',
            description: 'Class 10A attendance completed',
            timestamp: '4 hours ago',
            type: 'attendance'
          },
          {
            id: '3',
            title: 'New teacher added',
            description: 'Ms. Smith joined Mathematics department',
            timestamp: '1 day ago',
            type: 'teacher'
          }
        ])
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getActivityIcon = (type: ActivityItem['type']) => {
    const icons = {
      student: 'bg-blue-100',
      teacher: 'bg-green-100',
      attendance: 'bg-yellow-100',
      other: 'bg-gray-100'
    }
    return icons[type] || icons.other
  }

  const getActivityBadge = (activity: ActivityItem) => {
    if (activity.isNew) {
      return <Badge variant="success">New</Badge>
    }
    return null
  }

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardBody>
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back, {user?.name}! Here's what's happening at EduCore School Management System
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card hover>
          <CardBody>
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-100 rounded-lg p-3">
                <div className="w-6 h-6 bg-primary-600 rounded"></div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Students</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">{stats.totalStudents.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card hover>
          <CardBody>
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-success-100 rounded-lg p-3">
                <div className="w-6 h-6 bg-success-600 rounded"></div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Teachers</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">{stats.totalTeachers}</dd>
                </dl>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card hover>
          <CardBody>
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-warning-100 rounded-lg p-3">
                <div className="w-6 h-6 bg-warning-600 rounded"></div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Departments</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">{stats.totalDepartments}</dd>
                </dl>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card hover>
          <CardBody>
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-error-100 rounded-lg p-3">
                <div className="w-6 h-6 bg-error-600 rounded"></div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Attendance Rate</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">{stats.attendanceRate}%</dd>
                </dl>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Recent Activity" />
          <CardBody>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`h-8 w-8 ${getActivityIcon(activity.type)} rounded-full`}></div>
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{activity.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{activity.description}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{activity.timestamp}</p>
                  </div>
                  <div className="ml-auto">
                    {getActivityBadge(activity)}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {user?.role !== 'student' && user?.role !== 'parent' && (
          <Card>
            <CardHeader title="Quick Actions" />
            <CardBody>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="primary" onClick={() => navigate('/students')}>Add Student</Button>
                <Button variant="secondary" onClick={() => navigate('/attendance')}>Mark Attendance</Button>
                <Button variant="secondary" onClick={() => setIsReportModalOpen(true)}>Generate Report</Button>
                <Button variant="secondary" onClick={() => {
                  // TODO: Implement calendar view functionality
                  console.log('Calendar view feature coming soon!');
                  // For now, show a simple alert
                  alert('Calendar view feature is coming soon! This will display academic calendar, events, and important dates.');
                }}>View Calendar</Button>
              </div>
            </CardBody>
          </Card>
        )}
      </div>

      {studentStats && (
        <div className="mt-8">
          <Card>
            <CardHeader title="Student Statistics" />
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">{studentStats.total}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Total Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success-600">{studentStats.active}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Active Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">{studentStats.inactive}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Inactive Students</div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
      {/* Report Generation Modal */}
      <ReportGenerator
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  )
}

export default Dashboard
