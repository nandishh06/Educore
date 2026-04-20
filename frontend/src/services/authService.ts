import { apiRequest, ApiResponse } from '../lib/api'

// Auth interfaces
export interface LoginCredentials {
  email: string
  password?: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
  role: 'admin' | 'principal' | 'hod' | 'teacher'
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    name: string
    role: 'admin' | 'principal' | 'hod' | 'teacher'
  }
  token: string
}

export interface UserProfile {
  id: string
  email: string
  name: string
  role: 'admin' | 'principal' | 'hod' | 'teacher'
  created_at: string
  updated_at: string
}

// Auth service
export class AuthService {
  static async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiRequest.post<AuthResponse>('/auth/login', credentials)
      // Backend returns user and token directly in the response
      return response
    } catch (error) {
      throw error
    }
  }

  static async register(userData: RegisterData): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiRequest.post<AuthResponse>('/auth/register', userData)
      // Backend returns user and token directly in the response
      return response
    } catch (error) {
      throw error
    }
  }

  static async verifyToken(): Promise<ApiResponse<{ valid: boolean; user?: UserProfile }>> {
    try {
      const response = await apiRequest.post<{ valid: boolean; user?: UserProfile }>('/auth/verify-token')
      return response
    } catch (error) {
      throw error
    }
  }

  static async getProfile(): Promise<ApiResponse<UserProfile>> {
    try {
      const response = await apiRequest.get<UserProfile>('/auth/profile')
      return response
    } catch (error) {
      throw error
    }
  }

  static async logout(): Promise<void> {
    // Clear local storage
    localStorage.removeItem('token')
    
    // Optional: Call server logout endpoint if available
    try {
      await apiRequest.post('/auth/logout')
    } catch (error) {
      // Ignore logout errors, just clear local storage
      console.warn('Logout API call failed:', error)
    }
  }

  // Utility methods
  static getToken(): string | null {
    return localStorage.getItem('token')
  }

  static setToken(token: string): void {
    localStorage.setItem('token', token)
  }

  static clearToken(): void {
    localStorage.removeItem('token')
  }

  static isAuthenticated(): boolean {
    const token = this.getToken()
    if (!token) return false
    
    try {
      // Basic token validation (you can add more sophisticated validation)
      const parts = token.split('.')
      if (parts.length !== 3) return false
      
      const payload = JSON.parse(atob(parts[1]!))
      const now = Date.now() / 1000
      return payload.exp > now
    } catch {
      return false
    }
  }

  static getUserFromToken(): UserProfile | null {
    const token = this.getToken()
    if (!token) return null
    
    try {
      const parts = token.split('.')
      if (parts.length !== 3) return null
      
      const payload = JSON.parse(atob(parts[1]!))
      return {
        id: payload.userId,
        email: payload.email,
        name: payload.name,
        role: payload.role,
        created_at: payload.iat.toString(),
        updated_at: payload.iat.toString()
      }
    } catch {
      return null
    }
  }
}

export default AuthService
