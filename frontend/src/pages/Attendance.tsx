import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardBody, Button, Badge, Table, TableHeader, TableBody, TableRow, TableCell, TableHead, Input } from '../components/ui'
import { PermissionGuard } from '../components/PermissionGuard'
import { PERMISSIONS } from '../types/permissions'

interface AttendanceRecord {
  id: string
  studentId: string
  studentName: string
  grade: string
  section: string
  date: string
  status: 'present' | 'absent' | 'late' | 'excused'
  markedBy: string
  markedAt: string
  notes?: string
}

interface CreateAttendanceData {
  grade: string
  section: string
  date: string
  attendance: Array<{
    studentId: string
    studentName: string
    status: 'present' | 'absent' | 'late' | 'excused'
    notes?: string
  }>
}

const Attendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showMarkModal, setShowMarkModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedGrade, setSelectedGrade] = useState('')
  const [selectedSection, setSelectedSection] = useState('')
  const [attendanceData, setAttendanceData] = useState<CreateAttendanceData>({
    grade: '',
    section: '',
    date: new Date().toISOString().split('T')[0],
    attendance: []
  })

  useEffect(() => {
    fetchAttendanceRecords()
  }, [])

  const fetchAttendanceRecords = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Mock data for now - replace with API call when backend is ready
      const mockAttendance: AttendanceRecord[] = [
        {
          id: '1',
          studentId: '1',
          studentName: 'John Doe',
          grade: '10',
          section: 'A',
          date: new Date().toISOString().split('T')[0],
          status: 'present',
          markedBy: 'Admin',
          markedAt: new Date().toISOString(),
          notes: ''
        },
        {
          id: '2',
          studentId: '2',
          studentName: 'Jane Smith',
          grade: '10',
          section: 'A',
          date: new Date().toISOString().split('T')[0],
          status: 'absent',
          markedBy: 'Admin',
          markedAt: new Date().toISOString(),
          notes: 'Sick leave'
        },
        {
          id: '3',
          studentId: '3',
          studentName: 'Robert Johnson',
          grade: '9',
          section: 'B',
          date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
          status: 'late',
          markedBy: 'Admin',
          markedAt: new Date(Date.now() - 86400000).toISOString(),
          notes: 'Traffic delay'
        }
      ]
      
      setAttendanceRecords(mockAttendance)
    } catch (err) {
      setError('Failed to fetch attendance records')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAttendance = () => {
    // Mock students data - replace with API call to get students by grade and section
    const mockStudents = [
      { id: '1', name: 'John Doe' },
      { id: '2', name: 'Jane Smith' },
      { id: '4', name: 'Alice Brown' },
      { id: '5', name: 'Bob Wilson' }
    ]
    
    setAttendanceData({
      grade: selectedGrade || '10',
      section: selectedSection || 'A',
      date: selectedDate,
      attendance: mockStudents.map(student => ({
        studentId: student.id,
        studentName: student.name,
        status: 'present' as const,
        notes: ''
      }))
    })
    setShowMarkModal(true)
  }

  const handleAttendanceChange = (studentId: string, status: 'present' | 'absent' | 'late' | 'excused', notes?: string) => {
    setAttendanceData(prev => ({
      ...prev,
      attendance: prev.attendance.map(student =>
        student.studentId === studentId
          ? { ...student, status, notes: notes || student.notes }
          : student
      )
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Mock API call - replace with real API when backend is ready
      const newRecords: AttendanceRecord[] = attendanceData.attendance.map(student => ({
        id: Date.now().toString() + student.studentId,
        studentId: student.studentId,
        studentName: student.studentName,
        grade: attendanceData.grade,
        section: attendanceData.section,
        date: attendanceData.date,
        status: student.status,
        markedBy: 'Admin',
        markedAt: new Date().toISOString(),
        notes: student.notes
      }))
      
      setAttendanceRecords(prev => [...newRecords, ...prev])
      setShowMarkModal(false)
      
      // Reset form
      setAttendanceData({
        grade: '',
        section: '',
        date: new Date().toISOString().split('T')[0],
        attendance: []
      })
    } catch (error) {
      console.error('Error marking attendance:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteAttendance = (recordId: string) => {
    if (confirm('Are you sure you want to delete this attendance record?')) {
      setAttendanceRecords(prev => prev.filter(r => r.id !== recordId))
    }
  }

  const filteredRecords = attendanceRecords.filter(record =>
    record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.date.includes(searchTerm)
  )

  const getStatusBadge = (status: string) => {
    const variants = {
      present: 'success',
      absent: 'error',
      late: 'warning',
      excused: 'secondary'
    } as const
    
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
        <p className="text-gray-600">Track and manage student attendance</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardBody>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {attendanceRecords.length}
              </div>
              <div className="text-sm text-gray-500">Total Records</div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="text-center">
              <div className="text-2xl font-bold text-success-600">
                {attendanceRecords.filter(r => r.status === 'present').length}
              </div>
              <div className="text-sm text-gray-500">Present Today</div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="text-center">
              <div className="text-2xl font-bold text-error-600">
                {attendanceRecords.filter(r => r.status === 'absent').length}
              </div>
              <div className="text-sm text-gray-500">Absent Today</div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning-600">
                {attendanceRecords.filter(r => r.status === 'late').length}
              </div>
              <div className="text-sm text-gray-500">Late Today</div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Attendance Records</h3>
            <PermissionGuard permission={PERMISSIONS.MARK_ATTENDANCE}>
              <Button variant="primary" onClick={handleMarkAttendance}>Mark Attendance</Button>
            </PermissionGuard>
          </div>
        </CardHeader>
        <CardBody>
          {/* Filters */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<span>search</span>}
            />
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <Input
              placeholder="Grade"
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
            />
            <Input
              placeholder="Section"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-gray-500">Loading attendance records...</div>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500">
                <p>No attendance records found</p>
                <p className="mt-2">Try adjusting your search or mark new attendance</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Marked By</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.studentName}</TableCell>
                      <TableCell>{record.grade}</TableCell>
                      <TableCell>{record.section}</TableCell>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell>{record.markedBy}</TableCell>
                      <TableCell>{record.notes || '-'}</TableCell>
                      <TableCell>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteAttendance(record.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Mark Attendance Modal */}
      {showMarkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Mark Attendance</h2>
              <button
                onClick={() => setShowMarkModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Attendance Details */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Attendance Details</h3>
                <div className="grid grid-cols-3 gap-4">
                  <Input
                    label="Grade"
                    value={attendanceData.grade}
                    onChange={(e) => setAttendanceData(prev => ({ ...prev, grade: e.target.value }))}
                    required
                  />
                  <Input
                    label="Section"
                    value={attendanceData.section}
                    onChange={(e) => setAttendanceData(prev => ({ ...prev, section: e.target.value }))}
                    required
                  />
                  <Input
                    label="Date"
                    type="date"
                    value={attendanceData.date}
                    onChange={(e) => setAttendanceData(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {/* Student Attendance */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Mark Student Attendance</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {attendanceData.attendance.map((student) => (
                    <div key={student.studentId} className="flex items-center space-x-4 p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{student.studentName}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700">Status:</label>
                        <select
                          value={student.status}
                          onChange={(e) => handleAttendanceChange(student.studentId, e.target.value as any)}
                          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="present">Present</option>
                          <option value="absent">Absent</option>
                          <option value="late">Late</option>
                          <option value="excused">Excused</option>
                        </select>
                      </div>
                      <Input
                        placeholder="Notes (optional)"
                        value={student.notes || ''}
                        onChange={(e) => handleAttendanceChange(student.studentId, student.status, e.target.value)}
                        className="w-48"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowMarkModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Marking...' : 'Mark Attendance'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Attendance
