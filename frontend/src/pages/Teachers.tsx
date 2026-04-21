import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardBody, Button, Badge, Table, TableHeader, TableBody, TableRow, TableCell, TableHead, Input } from '../components/ui'
import { PermissionGuard } from '../components/PermissionGuard'
import { TeachersService, Teacher, TeacherStatistics, CreateTeacherData } from '../services'
import { PERMISSIONS } from '../types/permissions'
import { useAuth } from '../context/AuthContext'

interface TeachersQuery {
  page: number
  limit: number
  search: string
  department: string
  isActive: boolean | null
  sortBy: 'firstName' | 'lastName' | 'email' | 'department' | 'employeeId' | 'hireDate'
  sortOrder: 'asc' | 'desc'
}

const Teachers = () => {
  const { user } = useAuth()
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [statistics, setStatistics] = useState<TeacherStatistics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState<TeachersQuery>({
    page: 1,
    limit: 10,
    search: '',
    department: '',
    isActive: null,
    sortBy: 'firstName',
    sortOrder: 'asc'
  })
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null)
  const [formData, setFormData] = useState<CreateTeacherData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    specialization: '',
    employeeId: '',
    hireDate: '',
    isActive: true
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')

  const canEdit = user?.role === 'teacher' || user?.role === 'admin' || user?.role === 'principal'

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = !selectedDepartment || teacher.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  useEffect(() => {
    fetchTeachers()
    fetchStatistics()
  }, [])

  useEffect(() => {
    fetchTeachers()
  }, [query])

  const fetchTeachers = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await TeachersService.getTeachers({
        page: query.page,
        limit: query.limit,
        search: query.search || undefined,
        department: query.department || undefined,
        isActive: query.isActive !== null ? query.isActive : undefined,
        sortBy: query.sortBy,
        sortOrder: query.sortOrder
      })
      
      if (response.data) {
        setTeachers(response.data.teachers)
        setTotal(response.data.pagination.total)
        setTotalPages(response.data.pagination.totalPages)
      }
    } catch (err) {
      // Provide mock data when database is not configured
      const mockTeachers: Teacher[] = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@educore.com',
          phone: '+1234567890',
          department: 'Mathematics',
          specialization: 'Algebra',
          employeeId: 'EMP001',
          hireDate: '2020-08-15',
          isActive: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane.doe@educore.com',
          phone: '+1234567891',
          department: 'Science',
          specialization: 'Physics',
          employeeId: 'EMP002',
          hireDate: '2019-03-20',
          isActive: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
      setTeachers(mockTeachers)
      setTotal(mockTeachers.length)
      setTotalPages(1)
      setError(null)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStatistics = async () => {
    try {
      const response = await TeachersService.getStatistics()
      if (response.data) {
        setStatistics(response.data)
      }
    } catch (err) {
      // Provide mock statistics when database is not configured
      const mockStats: TeacherStatistics = {
        total: 2,
        active: 2,
        inactive: 0,
        byDepartment: { 'Mathematics': 1, 'Science': 1 }
      }
      setStatistics(mockStats)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Try to create teacher via API first
      const response = await TeachersService.createTeacher(formData)
      
      if (response.data) {
        // Add to local state
        setTeachers(prev => [response.data!, ...prev])
        setTotal(prev => prev + 1)
        setShowAddModal(false)
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          department: '',
          specialization: '',
          employeeId: '',
          hireDate: '',
          isActive: true
        })
      }
    } catch (error) {
      console.error('Error adding teacher:', error)
      
      // Fallback to local state if API fails
      const newTeacher: Teacher = {
        id: Date.now().toString(),
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      setTeachers(prev => [newTeacher, ...prev])
      setTotal(prev => prev + 1)
      setShowAddModal(false)
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        department: '',
        specialization: '',
        employeeId: '',
        hireDate: '',
        isActive: true
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const departments = Array.from(new Set(teachers.map(t => t.department)))

  const handleDeleteTeacher = (teacherId: string) => {
    if (confirm('Are you sure you want to delete this teacher?')) {
      try {
        // Try to delete via API first
        TeachersService.deleteTeacher(teacherId).then(() => {
          fetchTeachers()
        })
      } catch (error) {
        // Fallback to local state if API fails
        setTeachers(prev => prev.filter(t => t.id !== teacherId))
        setTotal(prev => prev - 1)
      }
    }
  }

  const handleEditTeacher = (teacher: Teacher) => {
    setEditingTeacher(teacher)
    setFormData({
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      email: teacher.email,
      phone: teacher.phone || '',
      department: teacher.department,
      specialization: teacher.specialization,
      employeeId: teacher.employeeId,
      hireDate: teacher.hireDate,
      isActive: teacher.isActive
    })
    setShowEditModal(true)
  }

  const handleUpdateTeacher = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTeacher) return
    
    setIsSubmitting(true)
    
    try {
      // Try to update teacher via API first
      const response = await TeachersService.updateTeacher(editingTeacher.id, formData)
      
      if (response.data) {
        // Update local state
        setTeachers(prev => prev.map(t => t.id === editingTeacher.id ? response.data! : t))
        setShowEditModal(false)
        setEditingTeacher(null)
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          department: '',
          specialization: '',
          employeeId: '',
          hireDate: '',
          isActive: true
        })
      }
    } catch (error) {
      console.error('Error updating teacher:', error)
      
      // Fallback to local state if API fails
      const updatedTeacher: Teacher = {
        ...editingTeacher,
        ...formData,
        updated_at: new Date().toISOString()
      }
      
      setTeachers(prev => prev.map(t => t.id === editingTeacher.id ? updatedTeacher : t))
      setShowEditModal(false)
      setEditingTeacher(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Teachers Management</h1>
        <p className="text-gray-600">Manage teacher records and information</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardBody>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{teachers.length}</div>
              <div className="text-sm text-gray-500">Total Teachers</div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="text-center">
              <div className="text-2xl font-bold text-success-600">
                {teachers.filter(t => t.isActive).length}
              </div>
              <div className="text-sm text-gray-500">Active Teachers</div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {teachers.filter(t => !t.isActive).length}
              </div>
              <div className="text-sm text-gray-500">Inactive Teachers</div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning-600">{departments.length}</div>
              <div className="text-sm text-gray-500">Departments</div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">All Teachers</h3>
            <PermissionGuard permission={PERMISSIONS.ADD_TEACHER}>
              <Button variant="primary" onClick={() => setShowAddModal(true)}>Add Teacher</Button>
            </PermissionGuard>
          </div>
        </CardHeader>
        <CardBody>
          {/* Filters */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<span>search</span>}
            />
            <select
              className="input"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Teachers Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Hire Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">
                          {teacher.firstName} {teacher.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{teacher.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{teacher.employeeId}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{teacher.department}</Badge>
                    </TableCell>
                    <TableCell>{teacher.specialization}</TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell>{teacher.phone || 'N/A'}</TableCell>
                    <TableCell>{formatDate(teacher.hireDate)}</TableCell>
                    <TableCell>
                      <Badge variant={teacher.isActive ? 'success' : 'error'}>
                        {teacher.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {canEdit && (
                        <div className="flex space-x-2">
                          <Button variant="secondary" size="sm" onClick={() => handleEditTeacher(teacher)}>
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteTeacher(teacher.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredTeachers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                <p>No teachers found</p>
                <p className="mt-2">Try adjusting your search or filters</p>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Add Teacher Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Add New Teacher</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Personal Information */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                  />
                  <Input
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                  <Input
                    label="Phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
              </div>

              {/* Professional Information */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Professional Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Employee ID"
                    value={formData.employeeId}
                    onChange={(e) => handleInputChange('employeeId', e.target.value)}
                    required
                  />
                  <Input
                    label="Department"
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    required
                  />
                  <Input
                    label="Specialization"
                    value={formData.specialization}
                    onChange={(e) => handleInputChange('specialization', e.target.value)}
                    required
                  />
                  <Input
                    label="Hire Date"
                    type="date"
                    value={formData.hireDate}
                    onChange={(e) => handleInputChange('hireDate', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Status</h3>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Active Teacher
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowAddModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Adding...' : 'Add Teacher'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Teacher Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Edit Teacher</h2>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setEditingTeacher(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleUpdateTeacher} className="space-y-4">
              {/* Personal Information */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                  />
                  <Input
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                  <Input
                    label="Phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
              </div>

              {/* Professional Information */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Professional Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Employee ID"
                    value={formData.employeeId}
                    onChange={(e) => handleInputChange('employeeId', e.target.value)}
                    required
                  />
                  <Input
                    label="Department"
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    required
                  />
                  <Input
                    label="Specialization"
                    value={formData.specialization}
                    onChange={(e) => handleInputChange('specialization', e.target.value)}
                    required
                  />
                  <Input
                    label="Hire Date"
                    type="date"
                    value={formData.hireDate}
                    onChange={(e) => handleInputChange('hireDate', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Status</h3>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Active Teacher
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingTeacher(null)
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update Teacher'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Teachers
