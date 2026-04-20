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
  sortBy?: 'firstName' | 'lastName' | 'rollNumber' | 'grade' | 'created_at'
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
      const queryParams = new URLSearchParams()
      
      if (params.page) queryParams.append('page', params.page.toString())
      if (params.limit) queryParams.append('limit', params.limit.toString())
      if (params.search) queryParams.append('search', params.search)
      if (params.grade) queryParams.append('grade', params.grade)
      if (params.section) queryParams.append('section', params.section)
      if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString())
      if (params.sortBy) queryParams.append('sortBy', params.sortBy)
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder)

      const url = `/students${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      const response = await apiRequest.get<StudentsResponse>(url)
      return response
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
      const response = await apiRequest.get<StudentStatistics>('/students/stats')
      return response
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
