import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardBody, Button, Badge, Input } from '../components/ui'
import { useAuth } from '../context/AuthContext'

interface Settings {
  schoolName: string
  schoolAddress: string
  schoolPhone: string
  schoolEmail: string
  academicYear: string
  semester: string
  gradingScale: string
  attendanceThreshold: number
  maxStudentsPerClass: number
  enableNotifications: boolean
  enableEmailAlerts: boolean
  enableSmsAlerts: boolean
}

const Settings = () => {
  const { user } = useAuth()
  const [settings, setSettings] = useState<Settings>({
    schoolName: 'EduCore School',
    schoolAddress: '123 Education Street, Learning City, LC 12345',
    schoolPhone: '+1-234-567-8900',
    schoolEmail: 'info@educore.com',
    academicYear: '2024-2025',
    semester: 'First Semester',
    gradingScale: 'A-F',
    attendanceThreshold: 75,
    maxStudentsPerClass: 30,
    enableNotifications: true,
    enableEmailAlerts: true,
    enableSmsAlerts: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      // Mock API call - replace with real API when backend is ready
      // const response = await SettingsService.getSettings()
      // if (response.data) {
      //   setSettings(response.data)
      // }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    }
  }

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Mock API call - replace with real API when backend is ready
      // await SettingsService.updateSettings(settings)
      
      // Show success message
      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Failed to save settings:', error)
      alert('Failed to save settings. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      setSettings({
        schoolName: 'EduCore School',
        schoolAddress: '123 Education Street, Learning City, LC 12345',
        schoolPhone: '+1-234-567-8900',
        schoolEmail: 'info@educore.com',
        academicYear: '2024-2025',
        semester: 'First Semester',
        gradingScale: 'A-F',
        attendanceThreshold: 75,
        maxStudentsPerClass: 30,
        enableNotifications: true,
        enableEmailAlerts: true,
        enableSmsAlerts: false
      })
    }
  }

  const tabs = [
    { id: 'general', label: 'General Settings', icon: 'settings' },
    { id: 'academic', label: 'Academic Settings', icon: 'book' },
    { id: 'notifications', label: 'Notifications', icon: 'bell' },
    { id: 'system', label: 'System Settings', icon: 'server' }
  ]

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Configure system settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardBody>
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <span className="mr-3">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </CardBody>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">
                {tabs.find(tab => tab.id === activeTab)?.label}
              </h3>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* General Settings */}
                {activeTab === 'general' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="School Name"
                        value={settings.schoolName}
                        onChange={(e) => handleInputChange('schoolName', e.target.value)}
                      />
                      <Input
                        label="School Phone"
                        value={settings.schoolPhone}
                        onChange={(e) => handleInputChange('schoolPhone', e.target.value)}
                      />
                    </div>
                    <Input
                      label="School Address"
                      value={settings.schoolAddress}
                      onChange={(e) => handleInputChange('schoolAddress', e.target.value)}
                    />
                    <Input
                      label="School Email"
                      type="email"
                      value={settings.schoolEmail}
                      onChange={(e) => handleInputChange('schoolEmail', e.target.value)}
                    />
                  </div>
                )}

                {/* Academic Settings */}
                {activeTab === 'academic' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Academic Year"
                        value={settings.academicYear}
                        onChange={(e) => handleInputChange('academicYear', e.target.value)}
                      />
                      <Input
                        label="Semester"
                        value={settings.semester}
                        onChange={(e) => handleInputChange('semester', e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Grading Scale</label>
                        <select
                          value={settings.gradingScale}
                          onChange={(e) => handleInputChange('gradingScale', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="A-F">A-F Scale</option>
                          <option value="1-10">1-10 Scale</option>
                          <option value="0-100">0-100 Scale</option>
                          <option value="GPA">GPA Scale</option>
                        </select>
                      </div>
                      <Input
                        label="Attendance Threshold (%)"
                        type="number"
                        min="0"
                        max="100"
                        value={settings.attendanceThreshold}
                        onChange={(e) => handleInputChange('attendanceThreshold', parseInt(e.target.value))}
                      />
                    </div>
                    <Input
                      label="Maximum Students Per Class"
                      type="number"
                      min="1"
                      max="100"
                      value={settings.maxStudentsPerClass}
                      onChange={(e) => handleInputChange('maxStudentsPerClass', parseInt(e.target.value))}
                    />
                  </div>
                )}

                {/* Notifications */}
                {activeTab === 'notifications' && (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Enable Notifications</h4>
                          <p className="text-sm text-gray-500">Receive system notifications</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.enableNotifications}
                          onChange={(e) => handleInputChange('enableNotifications', e.target.checked)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Enable Email Alerts</h4>
                          <p className="text-sm text-gray-500">Receive email notifications</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.enableEmailAlerts}
                          onChange={(e) => handleInputChange('enableEmailAlerts', e.target.checked)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Enable SMS Alerts</h4>
                          <p className="text-sm text-gray-500">Receive SMS notifications</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.enableSmsAlerts}
                          onChange={(e) => handleInputChange('enableSmsAlerts', e.target.checked)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* System Settings */}
                {activeTab === 'system' && (
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">System Information</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>EduCore Version: 1.0.0</p>
                        <p>Last Updated: {new Date().toLocaleDateString()}</p>
                        <p>User Role: {user?.role}</p>
                        <p>User Email: {user?.email}</p>
                      </div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-yellow-800 mb-2">Backup & Maintenance</h4>
                      <div className="space-y-2">
                        <Button variant="secondary" size="sm" className="w-full">
                          Export Data
                        </Button>
                        <Button variant="secondary" size="sm" className="w-full">
                          Backup Settings
                        </Button>
                        <Button variant="secondary" size="sm" className="w-full">
                          Clear Cache
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleReset}
                    disabled={isSubmitting}
                  >
                    Reset to Default
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Settings'}
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Settings
