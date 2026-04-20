export interface User {
  userId: string
  email: string
  name: string
  role: 'admin' | 'principal' | 'hod' | 'teacher'
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
  role: 'admin' | 'principal' | 'hod' | 'teacher'
}
