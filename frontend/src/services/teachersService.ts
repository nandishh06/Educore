import { apiRequest, ApiResponse } from '../lib/api'

// Teacher interfaces
export interface Teacher {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  department: string
  specialization: string
  employeeId: string
  hireDate: string
  isActive: boolean
  created_at: string
  updated_at: string
}

export interface CreateTeacherData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  department: string
  specialization: string
  employeeId: string
  hireDate: string
  isActive?: boolean
}

export interface UpdateTeacherData extends Partial<CreateTeacherData> {}

export interface TeachersQueryParams {
  page?: number
  limit?: number
  search?: string
  department?: string
  isActive?: boolean
  sortBy?: 'firstName' | 'lastName' | 'email' | 'department' | 'employeeId' | 'hireDate'
  sortOrder?: 'asc' | 'desc'
}

export interface TeachersResponse {
  teachers: Teacher[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface TeacherStatistics {
  total: number
  active: number
  inactive: number
  byDepartment: Record<string, number>
}

// Teachers service
export class TeachersService {
  private static readonly BASE_URL = '/teachers'

  static async getTeachers(params?: TeachersQueryParams): Promise<ApiResponse<TeachersResponse>> {
    return apiRequest<TeachersResponse>('GET', this.BASE_URL, { params })
  }

  static async getTeacherById(id: string): Promise<ApiResponse<Teacher>> {
    return apiRequest<Teacher>('GET', `${this.BASE_URL}/${id}`)
  }

  static async createTeacher(data: CreateTeacherData): Promise<ApiResponse<Teacher>> {
    return apiRequest<Teacher>('POST', this.BASE_URL, { data })
  }

  static async updateTeacher(id: string, data: UpdateTeacherData): Promise<ApiResponse<Teacher>> {
    return apiRequest<Teacher>('PUT', `${this.BASE_URL}/${id}`, { data })
  }

  static async deleteTeacher(id: string): Promise<ApiResponse<void>> {
    return apiRequest<void>('DELETE', `${this.BASE_URL}/${id}`)
  }

  static async getStatistics(): Promise<ApiResponse<TeacherStatistics>> {
    return apiRequest<TeacherStatistics>('GET', `${this.BASE_URL}/statistics`)
  }
}
