import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

interface AttendanceRecord {
  id: string
  studentName: string
  studentId: string
  grade: string
  section: string
  totalDays: number
  presentDays: number
  absentDays: number
  percentage: number
  month: string
  year: string
}

const AttendancePercentage: React.FC = () => {
  const { user } = useAuth()
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedGrade, setSelectedGrade] = useState<string>('')
  const [selectedSection, setSelectedSection] = useState<string>('')
  const [selectedMonth, setSelectedMonth] = useState<string>('')

  // Mock attendance data
  const mockAttendance: AttendanceRecord[] = [
    { id: '1', studentName: 'Alice Johnson', studentId: 'STU001', grade: '10', section: 'A', totalDays: 22, presentDays: 20, absentDays: 2, percentage: 91, month: 'April', year: '2024' },
    { id: '2', studentName: 'Bob Smith', studentId: 'STU002', grade: '10', section: 'A', totalDays: 22, presentDays: 18, absentDays: 4, percentage: 82, month: 'April', year: '2024' },
    { id: '3', studentName: 'Charlie Brown', studentId: 'STU003', grade: '10', section: 'A', totalDays: 22, presentDays: 21, absentDays: 1, percentage: 95, month: 'April', year: '2024' },
    { id: '4', studentName: 'Diana Prince', studentId: 'STU004', grade: '10', section: 'A', totalDays: 22, presentDays: 15, absentDays: 7, percentage: 68, month: 'April', year: '2024' },
    { id: '5', studentName: 'Ethan Hunt', studentId: 'STU005', grade: '10', section: 'A', totalDays: 22, presentDays: 19, absentDays: 3, percentage: 86, month: 'April', year: '2024' },
    { id: '6', studentName: 'Fiona Gallagher', studentId: 'STU006', grade: '10', section: 'B', totalDays: 22, presentDays: 17, absentDays: 5, percentage: 77, month: 'April', year: '2024' },
    { id: '7', studentName: 'George Martin', studentId: 'STU007', grade: '10', section: 'B', totalDays: 22, presentDays: 20, absentDays: 2, percentage: 91, month: 'April', year: '2024' },
    { id: '8', studentName: 'Hannah Montana', studentId: 'STU008', grade: '10', section: 'B', totalDays: 22, presentDays: 22, absentDays: 0, percentage: 100, month: 'April', year: '2024' },
  ]

  useEffect(() => {
    setAttendance(mockAttendance)
  }, [])

  const canEdit = user?.role === 'admin' || user?.role === 'teacher'

  const handleAddRecord = () => {
    setSelectedRecord(null)
    setIsEditing(false)
    setShowModal(true)
  }

  const handleEditRecord = (record: AttendanceRecord) => {
    setSelectedRecord(record)
    setIsEditing(true)
    setShowModal(true)
  }

  const handleDeleteRecord = (id: string) => {
    if (confirm('Are you sure you want to delete this attendance record?')) {
      setAttendance(attendance.filter(record => record.id !== id))
    }
  }

  const handleSaveRecord = (recordData: Omit<AttendanceRecord, 'id'>) => {
    if (isEditing && selectedRecord) {
      setAttendance(attendance.map(record =>
        record.id === selectedRecord.id
          ? { ...recordData, id: selectedRecord.id }
          : record
      ))
    } else {
      const newRecord = {
        ...recordData,
        id: Date.now().toString()
      }
      setAttendance([...attendance, newRecord])
    }
    setShowModal(false)
    setSelectedRecord(null)
  }

  const calculatePercentage = (present: number, total: number): number => {
    if (total === 0) return 0
    return Math.round((present / total) * 100)
  }

  const getAttendanceColor = (percentage: number): string => {
    if (percentage >= 90) return 'bg-green-500'
    if (percentage >= 75) return 'bg-blue-500'
    if (percentage >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getAttendanceStatus = (percentage: number): string => {
    if (percentage >= 90) return 'Excellent'
    if (percentage >= 75) return 'Good'
    if (percentage >= 60) return 'Average'
    return 'Poor'
  }

  const filteredAttendance = attendance.filter(record => {
    const matchesGrade = !selectedGrade || record.grade === selectedGrade
    const matchesSection = !selectedSection || record.section === selectedSection
    const matchesMonth = !selectedMonth || record.month === selectedMonth
    return matchesGrade && matchesSection && matchesMonth
  })

  const grades = Array.from(new Set(attendance.map(a => a.grade)))
  const sections = Array.from(new Set(attendance.map(a => a.section)))
  const months = Array.from(new Set(attendance.map(a => a.month)))

  const averageAttendance = filteredAttendance.length > 0
    ? Math.round(filteredAttendance.reduce((sum, record) => sum + record.percentage, 0) / filteredAttendance.length)
    : 0

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Attendance Percentage</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {canEdit ? 'Manage student attendance records' : 'View student attendance statistics'}
          </p>
        </div>
        {canEdit && (
          <button
            onClick={handleAddRecord}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Add Record
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Grade</label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">All Grades</option>
              {grades.map(grade => (
                <option key={grade} value={grade}>Grade {grade}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">All Sections</option>
              {sections.map(section => (
                <option key={section} value={section}>Section {section}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">All Months</option>
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600">{filteredAttendance.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Students</div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{averageAttendance}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Average Attendance</div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {filteredAttendance.filter(r => r.percentage >= 75).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Good Attendance</div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">
              {filteredAttendance.filter(r => r.percentage < 60).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Poor Attendance</div>
          </div>
        </div>
      </div>

      {/* Attendance Graph */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Attendance Graph</h2>
        <div className="space-y-4">
          {filteredAttendance.map((record) => (
            <div key={record.id} className="flex items-center space-x-4">
              <div className="w-32 flex-shrink-0">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{record.studentName}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{record.studentId}</div>
              </div>
              <div className="flex-1">
                <div className="relative">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6">
                    <div
                      className={`h-6 rounded-full transition-all duration-300 ${getAttendanceColor(record.percentage)}`}
                      style={{ width: `${record.percentage}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{record.presentDays}/{record.totalDays} days</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{record.percentage}%</span>
                </div>
              </div>
              <div className="w-20 flex-shrink-0 text-right">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  record.percentage >= 90 ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                  record.percentage >= 75 ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                  record.percentage >= 60 ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                  'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                }`}>
                  {getAttendanceStatus(record.percentage)}
                </span>
              </div>
              {canEdit && (
                <div className="w-24 flex-shrink-0">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditRecord(record)}
                      className="text-xs text-primary-600 hover:text-primary-900 dark:text-primary-400"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteRecord(record.id)}
                      className="text-xs text-red-600 hover:text-red-900 dark:text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Grade/Section</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total Days</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Present</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Absent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Percentage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Month</th>
                {canEdit && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAttendance.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900 dark:text-gray-100">{record.studentName}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{record.studentId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {record.grade} - {record.section}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {record.totalDays}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {record.presentDays}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {record.absentDays}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {record.percentage}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      record.percentage >= 90 ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                      record.percentage >= 75 ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                      record.percentage >= 60 ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                      'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                    }`}>
                      {getAttendanceStatus(record.percentage)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {record.month} {record.year}
                  </td>
                  {canEdit && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditRecord(record)}
                          className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(record.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {isEditing ? 'Edit Attendance Record' : 'Add Attendance Record'}
            </h2>
            <AttendanceRecordForm
              record={selectedRecord}
              onSave={handleSaveRecord}
              onCancel={() => {
                setShowModal(false)
                setSelectedRecord(null)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

const AttendanceRecordForm: React.FC<{
  record: AttendanceRecord | null
  onSave: (recordData: Omit<AttendanceRecord, 'id'>) => void
  onCancel: () => void
}> = ({ record, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<AttendanceRecord, 'id'>>({
    studentName: record?.studentName || '',
    studentId: record?.studentId || '',
    grade: record?.grade || '10',
    section: record?.section || 'A',
    totalDays: record?.totalDays || 22,
    presentDays: record?.presentDays || 0,
    absentDays: record?.absentDays || 0,
    percentage: record?.percentage || 0,
    month: record?.month || 'April',
    year: record?.year || '2024',
  })

  const calculatePercentage = (present: number, total: number): number => {
    if (total === 0) return 0
    return Math.round((present / total) * 100)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const percentage = calculatePercentage(formData.presentDays, formData.totalDays)
    onSave({
      ...formData,
      percentage,
      absentDays: formData.totalDays - formData.presentDays
    })
  }

  const handleChange = (field: keyof Omit<AttendanceRecord, 'id'>, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Student Name</label>
        <input
          type="text"
          value={formData.studentName}
          onChange={(e) => handleChange('studentName', e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Student ID</label>
        <input
          type="text"
          value={formData.studentId}
          onChange={(e) => handleChange('studentId', e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Grade</label>
          <select
            value={formData.grade}
            onChange={(e) => handleChange('grade', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          >
            <option value="10">Grade 10</option>
            <option value="11">Grade 11</option>
            <option value="12">Grade 12</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Section</label>
          <select
            value={formData.section}
            onChange={(e) => handleChange('section', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          >
            <option value="A">Section A</option>
            <option value="B">Section B</option>
            <option value="C">Section C</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Days</label>
          <input
            type="number"
            value={formData.totalDays}
            onChange={(e) => handleChange('totalDays', parseInt(e.target.value))}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Present Days</label>
          <input
            type="number"
            value={formData.presentDays}
            onChange={(e) => handleChange('presentDays', parseInt(e.target.value))}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Month</label>
          <select
            value={formData.month}
            onChange={(e) => handleChange('month', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          >
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year</label>
          <input
            type="text"
            value={formData.year}
            onChange={(e) => handleChange('year', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          {record ? 'Update' : 'Add'}
        </button>
      </div>
    </form>
  )
}

export default AttendancePercentage
