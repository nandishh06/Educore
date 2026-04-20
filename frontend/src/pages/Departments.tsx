import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardBody, Button, Badge, Table, TableHeader, TableBody, TableRow, TableCell, TableHead, Input } from '../components/ui'

interface Department {
  id: string
  name: string
  code: string
  description: string
  headOfDepartment: string
  hodEmail: string
  totalTeachers: number
  totalStudents: number
  isActive: boolean
  created_at: string
  updated_at: string
}

interface CreateDepartmentData {
  name: string
  code: string
  description: string
  headOfDepartment: string
  hodEmail: string
  isActive?: boolean
}

const Departments = () => {
  const [departments, setDepartments] = useState<Department[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState<CreateDepartmentData>({
    name: '',
    code: '',
    description: '',
    headOfDepartment: '',
    hodEmail: '',
    isActive: true
  })

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Mock data for now - replace with API call when backend is ready
      const mockDepartments: Department[] = [
        {
          id: '1',
          name: 'Mathematics',
          code: 'MATH',
          description: 'Mathematics and Applied Mathematics programs',
          headOfDepartment: 'Dr. John Smith',
          hodEmail: 'john.smith@educore.com',
          totalTeachers: 12,
          totalStudents: 245,
          isActive: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Science',
          code: 'SCI',
          description: 'Physics, Chemistry, and Biology programs',
          headOfDepartment: 'Dr. Jane Doe',
          hodEmail: 'jane.doe@educore.com',
          totalTeachers: 15,
          totalStudents: 312,
          isActive: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          name: 'English',
          code: 'ENG',
          description: 'English Language and Literature programs',
          headOfDepartment: 'Dr. Robert Johnson',
          hodEmail: 'robert.johnson@educore.com',
          totalTeachers: 8,
          totalStudents: 178,
          isActive: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
      
      setDepartments(mockDepartments)
    } catch (err) {
      setError('Failed to fetch departments')
    } finally {
      setIsLoading(false)
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
      // Mock API call - replace with real API when backend is ready
      const newDepartment: Department = {
        id: Date.now().toString(),
        ...formData,
        totalTeachers: 0,
        totalStudents: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      setDepartments(prev => [newDepartment, ...prev])
      setShowAddModal(false)
      
      // Reset form
      setFormData({
        name: '',
        code: '',
        description: '',
        headOfDepartment: '',
        hodEmail: '',
        isActive: true
      })
    } catch (error) {
      console.error('Error adding department:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteDepartment = (departmentId: string) => {
    if (confirm('Are you sure you want to delete this department?')) {
      setDepartments(prev => prev.filter(d => d.id !== departmentId))
    }
  }

  const filteredDepartments = departments.filter(department =>
    department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    department.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    department.headOfDepartment.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Departments Management</h1>
        <p className="text-gray-600">Manage academic departments and programs</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardBody>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {departments.length}
              </div>
              <div className="text-sm text-gray-500">Total Departments</div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="text-center">
              <div className="text-2xl font-bold text-success-600">
                {departments.filter(d => d.isActive).length}
              </div>
              <div className="text-sm text-gray-500">Active Departments</div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="text-center">
              <div className="text-2xl font-bold text-info-600">
                {departments.reduce((sum, d) => sum + d.totalTeachers, 0)}
              </div>
              <div className="text-sm text-gray-500">Total Teachers</div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning-600">
                {departments.reduce((sum, d) => sum + d.totalStudents, 0)}
              </div>
              <div className="text-sm text-gray-500">Total Students</div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">All Departments</h3>
            <Button variant="primary" onClick={() => setShowAddModal(true)}>Add Department</Button>
          </div>
        </CardHeader>
        <CardBody>
          {/* Search */}
          <div className="mb-6">
            <Input
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<span>search</span>}
            />
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-gray-500">Loading departments...</div>
            </div>
          ) : filteredDepartments.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500">
                <p>No departments found</p>
                <p className="mt-2">Try adjusting your search or add a new department</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Head of Department</TableHead>
                    <TableHead>Teachers</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDepartments.map((department) => (
                    <TableRow key={department.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{department.name}</div>
                          <div className="text-sm text-gray-500">{department.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{department.code}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{department.headOfDepartment}</div>
                          <div className="text-sm text-gray-500">{department.hodEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>{department.totalTeachers}</TableCell>
                      <TableCell>{department.totalStudents}</TableCell>
                      <TableCell>
                        <Badge variant={department.isActive ? 'success' : 'error'}>
                          {department.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="secondary" size="sm">
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteDepartment(department.id)}
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
          )}
        </CardBody>
      </Card>

      {/* Add Department Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Add New Department</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Basic Information */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Department Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                  <Input
                    label="Department Code"
                    value={formData.code}
                    onChange={(e) => handleInputChange('code', e.target.value)}
                    required
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={3}
                    required
                  />
                </div>
              </div>

              {/* Head of Department */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Head of Department</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="HOD Name"
                    value={formData.headOfDepartment}
                    onChange={(e) => handleInputChange('headOfDepartment', e.target.value)}
                    required
                  />
                  <Input
                    label="HOD Email"
                    type="email"
                    value={formData.hodEmail}
                    onChange={(e) => handleInputChange('hodEmail', e.target.value)}
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
                    Active Department
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
                  {isSubmitting ? 'Adding...' : 'Add Department'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Departments
