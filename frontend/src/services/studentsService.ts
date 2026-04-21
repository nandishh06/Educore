import { apiRequest, ApiResponse } from '../lib/api'

// Student interfaces
export interface Student {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  dateOfBirth: string
  gender: 'male' | 'female' | 'other'
  address: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  emergencyContact: {
    name: string
    relationship: string
    phone: string
    email?: string
  }
  academicInfo: {
    rollNumber: string
    grade: string
    section: string
    admissionDate: string
    guardian: {
      fatherName: string
      motherName: string
      guardianPhone: string
      guardianEmail: string
    }
  }
  isActive: boolean
  created_at: string
  updated_at: string
}

export interface CreateStudentData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  dateOfBirth: string
  gender: 'male' | 'female' | 'other'
  address: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  emergencyContact: {
    name: string
    relationship: string
    phone: string
    email?: string
  }
  academicInfo: {
    rollNumber: string
    grade: string
    section: string
    admissionDate: string
    guardian: {
      fatherName: string
      motherName: string
      guardianPhone: string
      guardianEmail: string
    }
  }
}

export interface UpdateStudentData extends Partial<CreateStudentData> {}

export interface StudentsQueryParams {
  page?: number
  limit?: number
  search?: string
  grade?: string
  section?: string
  isActive?: boolean
  sortBy?: 'firstName' | 'lastName' | 'email' | 'rollNumber' | 'grade' | 'created_at'
  sortOrder?: 'asc' | 'desc'
}

export interface StudentsResponse {
  students: Student[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface StudentStatistics {
  total: number
  active: number
  inactive: number
  byGrade: Record<string, number>
  byGender: Record<string, number>
}

// Students service
export class StudentsService {
  static async getStudents(params: StudentsQueryParams = {}): Promise<ApiResponse<StudentsResponse>> {
    try {
      // Use mock data for now since database is not configured
      // This would normally make API calls:
      // const queryParams = new URLSearchParams()
      // if (params.page) queryParams.append('page', params.page.toString())
      // if (params.limit) queryParams.append('limit', params.limit.toString())
      // if (params.search) queryParams.append('search', params.search)
      // if (params.grade) queryParams.append('grade', params.grade)
      // if (params.section) queryParams.append('section', params.section)
      // if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString())
      // if (params.sortBy) queryParams.append('sortBy', params.sortBy)
      // if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder)
      // const url = `/students${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      // const response = await apiRequest.get<StudentsResponse>(url)
      // return response

      // Mock data for students
      const mockStudents: Student[] = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@educore.com',
          phone: '+1234567890',
          dateOfBirth: '2005-05-15',
          gender: 'male',
          address: {
            street: '123 Main St',
            city: 'Springfield',
            state: 'IL',
            postalCode: '62701',
            country: 'USA'
          },
          emergencyContact: {
            name: 'Jane Doe',
            relationship: 'Mother',
            phone: '+1234567890',
            email: 'jane.doe@educore.com'
          },
          academicInfo: {
            rollNumber: 'STU001',
            grade: '10',
            section: 'A',
            admissionDate: '2023-06-01',
            guardian: {
              fatherName: 'John Doe Sr.',
              motherName: 'Jane Doe',
              guardianPhone: '+1234567890',
              guardianEmail: 'guardian@educore.com'
            }
          },
          isActive: true,
          created_at: '2023-06-01T00:00:00.000Z',
          updated_at: '2023-06-01T00:00:00.000Z'
        },
        {
          id: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@educore.com',
          phone: '+1234567890',
          dateOfBirth: '2006-03-22',
          gender: 'female',
          address: {
            street: '456 Oak Ave',
            city: 'Springfield',
            state: 'IL',
            postalCode: '62702',
            country: 'USA'
          },
          emergencyContact: {
            name: 'Robert Smith',
            relationship: 'Father',
            phone: '+1234567890',
            email: 'robert.smith@educore.com'
          },
          academicInfo: {
            rollNumber: 'STU002',
            grade: '10',
            section: 'B',
            admissionDate: '2023-06-01',
            guardian: {
              fatherName: 'Robert Smith',
              motherName: 'Mary Smith',
              guardianPhone: '+1234567890',
              guardianEmail: 'guardian2@educore.com'
            }
          },
          isActive: true,
          created_at: '2023-06-01T00:00:00.000Z',
          updated_at: '2023-06-01T00:00:00.000Z'
        }
      ];

      // Apply filters to mock data
      let filteredStudents = mockStudents;
      
      if (params.search) {
        const searchLower = params.search.toLowerCase();
        filteredStudents = filteredStudents.filter(student => 
          student.firstName.toLowerCase().includes(searchLower) ||
          student.lastName.toLowerCase().includes(searchLower) ||
          student.email.toLowerCase().includes(searchLower)
        );
      }

      if (params.grade) {
        filteredStudents = filteredStudents.filter(student => 
          student.academicInfo.grade === params.grade
        );
      }

      if (params.section) {
        filteredStudents = filteredStudents.filter(student => 
          student.academicInfo.section === params.section
        );
      }

      if (params.isActive !== undefined) {
        filteredStudents = filteredStudents.filter(student =>
          student.isActive === params.isActive
        );
      }

      // Apply sorting
      if (params.sortBy) {
        filteredStudents.sort((a, b) => {
          let aValue = '';
          let bValue = '';
          
          if (params.sortBy === 'firstName') {
            aValue = a.firstName.toLowerCase();
            bValue = b.firstName.toLowerCase();
          } else if (params.sortBy === 'lastName') {
            aValue = a.lastName.toLowerCase();
            bValue = b.lastName.toLowerCase();
          } else if (params.sortBy === 'email') {
            aValue = a.email.toLowerCase();
            bValue = b.email.toLowerCase();
          }
          
          const comparison = params.sortOrder === 'desc' ? -1 : 1;
          return aValue.localeCompare(bValue) * comparison;
        });
      }

      // Apply pagination
      const page = params.page || 1;
      const limit = params.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

      return {
        status: 'Success',
        message: 'Students retrieved successfully',
        data: {
          students: paginatedStudents,
          pagination: {
            page,
            limit,
            total: filteredStudents.length,
            totalPages: Math.ceil(filteredStudents.length / limit)
          }
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw error
    }
  }

  static async getStudentById(id: string): Promise<ApiResponse<Student>> {
    try {
      const response = await apiRequest.get<Student>(`/students/${id}`)
      return response
    } catch (error) {
      throw error
    }
  }

  static async createStudent(studentData: CreateStudentData): Promise<ApiResponse<Student>> {
    try {
      const response = await apiRequest.post<Student>('/students', studentData)
      return response
    } catch (error) {
      throw error
    }
  }

  static async updateStudent(id: string, updateData: UpdateStudentData): Promise<ApiResponse<Student>> {
    try {
      const response = await apiRequest.put<Student>(`/students/${id}`, updateData)
      return response
    } catch (error) {
      throw error
    }
  }

  static async deleteStudent(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiRequest.delete<void>(`/students/${id}`)
      return response
    } catch (error) {
      throw error
    }
  }

  static async getStatistics(): Promise<ApiResponse<StudentStatistics>> {
    try {
      // Use mock data for now since database is not configured
      // This would normally make API call:
      // const response = await apiRequest.get<StudentStatistics>('/students/stats')
      // return response

      // Mock student statistics
      const mockStats: StudentStatistics = {
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
      };

      return {
        status: 'Success',
        message: 'Student statistics retrieved successfully',
        data: mockStats,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw error
    }
  }

  // Utility methods
  static getFullName(student: Student): string {
    return `${student.firstName} ${student.lastName}`
  }

  static getAge(student: Student): number {
    const birthDate = new Date(student.dateOfBirth)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  static formatStudent(student: Student): Student & { fullName: string; age: number } {
    return {
      ...student,
      fullName: this.getFullName(student),
      age: this.getAge(student)
    }
  }
}

export default StudentsService
