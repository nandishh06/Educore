// Export all services
export { default as AuthService } from './authService'
export { default as StudentsService } from './studentsService'
export { TeachersService } from './teachersService'

// Export types
export type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  UserProfile
} from './authService'

export type {
  Student,
  CreateStudentData,
  UpdateStudentData,
  StudentsQueryParams,
  StudentsResponse,
  StudentStatistics
} from './studentsService'

export type {
  Teacher,
  CreateTeacherData,
  UpdateTeacherData,
  TeachersQueryParams,
  TeachersResponse,
  TeacherStatistics
} from './teachersService'
