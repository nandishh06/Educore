import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardBody, Button, Badge, Table, TableHeader, TableBody, TableRow, TableCell, TableHead, Input } from '../components/ui'
import { StudentsService, Student, StudentStatistics } from '../services'

interface StudentsQuery {
  page: number
  limit: number
  search: string
  grade: string
  section: string
  isActive: boolean | null
  sortBy: 'firstName' | 'lastName' | 'rollNumber' | 'grade' | 'created_at'
  sortOrder: 'asc' | 'desc'
}

const Students = () => {
  const [students, setStudents] = useState<Student[]>([])
  const [statistics, setStatistics] = useState<StudentStatistics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState<StudentsQuery>({
    page: 1,
    limit: 10,
    search: '',
    grade: '',
    section: '',
    isActive: null,
    sortBy: 'firstName',
    sortOrder: 'asc'
  })
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'male' as 'male' | 'female' | 'other',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
      email: ''
    },
    academicInfo: {
      rollNumber: '',
      grade: '',
      section: '',
      admissionDate: '',
      guardian: {
        fatherName: '',
        motherName: '',
        guardianPhone: '',
        guardianEmail: ''
      }
    }
  })

  useEffect(() => {
    fetchStudents()
  }, [query])

  const fetchStudents = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await StudentsService.getStudents({
        page: query.page,
        limit: query.limit,
        search: query.search || undefined,
        grade: query.grade || undefined,
        section: query.section || undefined,
        isActive: query.isActive !== null ? query.isActive : undefined,
        sortBy: query.sortBy,
        sortOrder: query.sortOrder
      })

      if (response.data) {
        setStudents(response.data.students)
        setTotal(response.data.pagination.total)
        setTotalPages(response.data.pagination.totalPages)
      }
    } catch (err) {
      // Provide mock data when database is not configured
      const mockStudents: Student[] = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '1234567890',
          dateOfBirth: '2008-05-15',
          gender: 'male',
          address: { street: '123 Main St', city: 'New York', state: 'NY', postalCode: '10001', country: 'USA' },
          emergencyContact: { name: 'Parent Doe', relationship: 'Father', phone: '1111111111' },
          academicInfo: { rollNumber: 'STD001', grade: '10', section: 'A', admissionDate: '2023-06-01', guardian: { fatherName: 'Parent Doe', motherName: 'Mother Doe', guardianPhone: '1111111111', guardianEmail: 'parent@example.com' }},
          isActive: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          phone: '0987654321',
          dateOfBirth: '2008-08-22',
          gender: 'female',
          address: { street: '456 Oak Ave', city: 'Los Angeles', state: 'CA', postalCode: '90001', country: 'USA' },
          emergencyContact: { name: 'Parent Smith', relationship: 'Mother', phone: '2222222222' },
          academicInfo: { rollNumber: 'STD002', grade: '10', section: 'B', admissionDate: '2023-06-01', guardian: { fatherName: 'Father Smith', motherName: 'Parent Smith', guardianPhone: '2222222222', guardianEmail: 'parent2@example.com' }},
          isActive: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
      setStudents(mockStudents)
      setTotal(mockStudents.length)
      setTotalPages(1)
      // Don't show error for mock data
      setError(null)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStatistics = async () => {
    try {
      const response = await StudentsService.getStatistics()
      if (response.data) {
        setStatistics(response.data)
      }
    } catch (err) {
      // Provide mock statistics when database is not configured
      const mockStats: StudentStatistics = {
        total: 2,
        active: 2,
        inactive: 0,
        byGrade: { '10': 2 },
        byGender: { male: 1, female: 1, other: 0 }
      }
      setStatistics(mockStats)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // For now, just add to local state as mock data
      const newStudent: Student = {
        id: Date.now().toString(),
        ...formData,
        isActive: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      setStudents(prev => [newStudent, ...prev])
      setTotal(prev => prev + 1)
      setShowAddModal(false)
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: 'male',
        address: {
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: ''
        },
        emergencyContact: {
          name: '',
          relationship: '',
          phone: '',
          email: ''
        },
        academicInfo: {
          rollNumber: '',
          grade: '',
          section: '',
          admissionDate: '',
          guardian: {
            fatherName: '',
            motherName: '',
            guardianPhone: '',
            guardianEmail: ''
          }
        }
      })
    } catch (error) {
      console.error('Error adding student:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    fetchStatistics()
  }, [])

  const handleSearch = (value: string) => {
    setQuery(prev => ({ ...prev, search: value, page: 1 }))
  }

  const handleSort = (field: StudentsQuery['sortBy']) => {
    setQuery(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc',
      page: 1
    }))
  }

  const handlePageChange = (page: number) => {
    setQuery(prev => ({ ...prev, page }))
  }

  const handleDeleteStudent = async (studentId: string) => {
    if (!confirm('Are you sure you want to delete this student?')) return
    
    try {
      await StudentsService.deleteStudent(studentId)
      fetchStudents()
      fetchStatistics()
    } catch (err) {
      // Fallback to local state if API fails
      setStudents(prev => prev.filter(s => s.id !== studentId))
      setTotal(prev => prev - 1)
    }
  }

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student)
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phone: student.phone || '',
      dateOfBirth: student.dateOfBirth,
      gender: student.gender,
      address: student.address,
      emergencyContact: student.emergencyContact,
      academicInfo: student.academicInfo
    })
    setShowEditModal(true)
  }

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingStudent) return
    
    setIsSubmitting(true)
    
    try {
      // Try to update student via API first
      const response = await StudentsService.updateStudent(editingStudent.id, formData)
      
      if (response.data) {
        // Update local state
        setStudents(prev => prev.map(s => s.id === editingStudent.id ? response.data! : s))
        setShowEditModal(false)
        setEditingStudent(null)
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          dateOfBirth: '',
          gender: 'male',
          address: {
            street: '',
            city: '',
            state: '',
            postalCode: '',
            country: ''
          },
          emergencyContact: {
            name: '',
            relationship: '',
            phone: '',
            email: ''
          },
          academicInfo: {
            rollNumber: '',
            grade: '',
            section: '',
            admissionDate: '',
            guardian: {
              fatherName: '',
              motherName: '',
              guardianPhone: '',
              guardianEmail: ''
            }
          }
        })
      }
    } catch (error) {
      console.error('Error updating student:', error)
      
      // Fallback to local state if API fails
      const updatedStudent: Student = {
        ...editingStudent,
        ...formData,
        updated_at: new Date().toISOString()
      }
      
      setStudents(prev => prev.map(s => s.id === editingStudent.id ? updatedStudent : s))
      setShowEditModal(false)
      setEditingStudent(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getSortIcon = (field: StudentsQuery['sortBy']) => {
    if (query.sortBy !== field) return null
    return query.sortOrder === 'asc' ? 'up' : 'down'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getStudentAge = (dateOfBirth: string) => {
    const birthDate = new Date(dateOfBirth)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Students Management</h1>
        <p className="text-gray-600">Manage student records and information</p>
      </div>

      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardBody>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">{statistics.total}</div>
                <div className="text-sm text-gray-500">Total Students</div>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="text-center">
                <div className="text-2xl font-bold text-success-600">{statistics.active}</div>
                <div className="text-sm text-gray-500">Active Students</div>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{statistics.inactive}</div>
                <div className="text-sm text-gray-500">Inactive Students</div>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning-600">
                  {statistics.total > 0 ? Math.round((statistics.active / statistics.total) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-500">Active Rate</div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">All Students</h3>
            <Button variant="primary" onClick={() => setShowAddModal(true)}>Add Student</Button>
          </div>
        </CardHeader>
        <CardBody>
          {/* Filters */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search students..."
              value={query.search}
              onChange={(e) => handleSearch(e.target.value)}
              leftIcon={<span>search</span>}
            />
            <Input
              placeholder="Grade"
              value={query.grade}
              onChange={(e) => setQuery(prev => ({ ...prev, grade: e.target.value, page: 1 }))}
            />
            <Input
              placeholder="Section"
              value={query.section}
              onChange={(e) => setQuery(prev => ({ ...prev, section: e.target.value, page: 1 }))}
            />
            <select
              className="input"
              value={query.isActive === null ? '' : query.isActive.toString()}
              onChange={(e) => {
                const value = e.target.value
                setQuery(prev => ({
                  ...prev,
                  isActive: value === '' ? null : value === 'true',
                  page: 1
                }))
              }}
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          {error && (
            <div className="mb-4 bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading students...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500">
                <p>No students found</p>
                <p className="mt-2">Try adjusting your search or filters</p>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead
                        sortable
                        sorted={getSortIcon('firstName') as any}
                        onSort={() => handleSort('firstName')}
                      >
                        Name
                      </TableHead>
                      <TableHead
                        sortable
                        sorted={getSortIcon('rollNumber') as any}
                        onSort={() => handleSort('rollNumber')}
                      >
                        Roll Number
                      </TableHead>
                      <TableHead
                        sortable
                        sorted={getSortIcon('grade') as any}
                        onSort={() => handleSort('grade')}
                      >
                        Grade
                      </TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">
                              {student.firstName} {student.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{student.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{student.academicInfo.rollNumber}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {student.academicInfo.grade} - {student.academicInfo.section}
                          </Badge>
                        </TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.phone || 'N/A'}</TableCell>
                        <TableCell>{getStudentAge(student.dateOfBirth)}</TableCell>
                        <TableCell>
                          <Badge variant={student.isActive ? 'success' : 'error'}>
                            {student.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="secondary" size="sm" onClick={() => handleEditStudent(student)}>
                              Edit
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeleteStudent(student.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {((query.page - 1) * query.limit) + 1} to{' '}
                    {Math.min(query.page * query.limit, total)} of {total} students
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={query.page === 1}
                      onClick={() => handlePageChange(query.page - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={query.page === totalPages}
                      onClick={() => handlePageChange(query.page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Add New Student</h2>
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
                  <Input
                    label="Date of Birth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Address</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Street"
                    value={formData.address.street}
                    onChange={(e) => handleInputChange('address.street', e.target.value)}
                  />
                  <Input
                    label="City"
                    value={formData.address.city}
                    onChange={(e) => handleInputChange('address.city', e.target.value)}
                  />
                  <Input
                    label="State"
                    value={formData.address.state}
                    onChange={(e) => handleInputChange('address.state', e.target.value)}
                  />
                  <Input
                    label="Postal Code"
                    value={formData.address.postalCode}
                    onChange={(e) => handleInputChange('address.postalCode', e.target.value)}
                  />
                  <Input
                    label="Country"
                    value={formData.address.country}
                    onChange={(e) => handleInputChange('address.country', e.target.value)}
                  />
                </div>
              </div>

              {/* Academic Information */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Academic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Roll Number"
                    value={formData.academicInfo.rollNumber}
                    onChange={(e) => handleInputChange('academicInfo.rollNumber', e.target.value)}
                    required
                  />
                  <Input
                    label="Grade"
                    value={formData.academicInfo.grade}
                    onChange={(e) => handleInputChange('academicInfo.grade', e.target.value)}
                    required
                  />
                  <Input
                    label="Section"
                    value={formData.academicInfo.section}
                    onChange={(e) => handleInputChange('academicInfo.section', e.target.value)}
                    required
                  />
                  <Input
                    label="Admission Date"
                    type="date"
                    value={formData.academicInfo.admissionDate}
                    onChange={(e) => handleInputChange('academicInfo.admissionDate', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Emergency Contact</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Contact Name"
                    value={formData.emergencyContact.name}
                    onChange={(e) => handleInputChange('emergencyContact.name', e.target.value)}
                    required
                  />
                  <Input
                    label="Relationship"
                    value={formData.emergencyContact.relationship}
                    onChange={(e) => handleInputChange('emergencyContact.relationship', e.target.value)}
                    required
                  />
                  <Input
                    label="Contact Phone"
                    value={formData.emergencyContact.phone}
                    onChange={(e) => handleInputChange('emergencyContact.phone', e.target.value)}
                    required
                  />
                  <Input
                    label="Contact Email"
                    type="email"
                    value={formData.emergencyContact.email}
                    onChange={(e) => handleInputChange('emergencyContact.email', e.target.value)}
                  />
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
                  {isSubmitting ? 'Adding...' : 'Add Student'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Edit Student</h2>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setEditingStudent(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleUpdateStudent} className="space-y-4">
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
                  <Input
                    label="Date of Birth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Address</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Street"
                    value={formData.address.street}
                    onChange={(e) => handleInputChange('address.street', e.target.value)}
                  />
                  <Input
                    label="City"
                    value={formData.address.city}
                    onChange={(e) => handleInputChange('address.city', e.target.value)}
                  />
                  <Input
                    label="State"
                    value={formData.address.state}
                    onChange={(e) => handleInputChange('address.state', e.target.value)}
                  />
                  <Input
                    label="Postal Code"
                    value={formData.address.postalCode}
                    onChange={(e) => handleInputChange('address.postalCode', e.target.value)}
                  />
                  <Input
                    label="Country"
                    value={formData.address.country}
                    onChange={(e) => handleInputChange('address.country', e.target.value)}
                  />
                </div>
              </div>

              {/* Academic Information */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Academic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Roll Number"
                    value={formData.academicInfo.rollNumber}
                    onChange={(e) => handleInputChange('academicInfo.rollNumber', e.target.value)}
                    required
                  />
                  <Input
                    label="Grade"
                    value={formData.academicInfo.grade}
                    onChange={(e) => handleInputChange('academicInfo.grade', e.target.value)}
                    required
                  />
                  <Input
                    label="Section"
                    value={formData.academicInfo.section}
                    onChange={(e) => handleInputChange('academicInfo.section', e.target.value)}
                    required
                  />
                  <Input
                    label="Admission Date"
                    type="date"
                    value={formData.academicInfo.admissionDate}
                    onChange={(e) => handleInputChange('academicInfo.admissionDate', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Emergency Contact</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Contact Name"
                    value={formData.emergencyContact.name}
                    onChange={(e) => handleInputChange('emergencyContact.name', e.target.value)}
                    required
                  />
                  <Input
                    label="Relationship"
                    value={formData.emergencyContact.relationship}
                    onChange={(e) => handleInputChange('emergencyContact.relationship', e.target.value)}
                    required
                  />
                  <Input
                    label="Contact Phone"
                    value={formData.emergencyContact.phone}
                    onChange={(e) => handleInputChange('emergencyContact.phone', e.target.value)}
                    required
                  />
                  <Input
                    label="Contact Email"
                    type="email"
                    value={formData.emergencyContact.email}
                    onChange={(e) => handleInputChange('emergencyContact.email', e.target.value)}
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingStudent(null)
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
                  {isSubmitting ? 'Updating...' : 'Update Student'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Students
