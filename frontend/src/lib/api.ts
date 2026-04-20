import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

// API Response interface
export interface ApiResponse<T = any> {
  status: string
  message: string
  data?: T
  user?: T
  token?: string
  error?: string
  timestamp: string
}

// API Error interface
export interface ApiError {
  message: string
  status?: number
  code?: string
  details?: any
}

// Create base API instance
const createApiInstance = (): AxiosInstance => {
  const baseURL = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:3000/api'
  
  const instance = axios.create({
    baseURL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      // Add auth token if available
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      
      // Add request timestamp
      config.metadata = { startTime: new Date() }
      
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`)
      return config
    },
    (error) => {
      console.error('[API Request Error]', error)
      return Promise.reject(error)
    }
  )

  // Response interceptor
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      const config = response.config as any
      const duration = new Date().getTime() - config.metadata?.startTime?.getTime()
      
      console.log(`[API Response] ${response.status} ${config.method?.toUpperCase()} ${config.url} (${duration}ms)`)
      
      return response
    },
    (error: AxiosError) => {
      const config = error.config as any
      const duration = config?.metadata?.startTime 
        ? new Date().getTime() - config.metadata.startTime.getTime()
        : 0
      
      console.error(`[API Error] ${error.response?.status || 'Network'} ${config?.method?.toUpperCase()} ${config?.url} (${duration}ms)`, error)
      
      // Handle common error cases
      if (error.response?.status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token')
        window.location.href = '/login'
        return Promise.reject(error)
      }
      
      if (error.response?.status === 403) {
        // Forbidden - insufficient permissions
        const errorData: ApiError = {
          message: 'You do not have permission to perform this action',
          status: 403,
          code: 'INSUFFICIENT_PERMISSIONS'
        }
        return Promise.reject(errorData)
      }
      
      if (error.code === 'ECONNABORTED') {
        // Request timeout
        const errorData: ApiError = {
          message: 'Request timed out. Please try again.',
          code: 'REQUEST_TIMEOUT'
        }
        return Promise.reject(errorData)
      }
      
      if (!error.response) {
        // Network error
        const errorData: ApiError = {
          message: 'Network error. Please check your connection.',
          code: 'NETWORK_ERROR'
        }
        return Promise.reject(errorData)
      }
      
      // Server error
      const responseData = error.response.data as any
      const errorData: ApiError = {
        message: responseData?.message || 'An unexpected error occurred',
        status: error.response.status,
        code: responseData?.code || 'SERVER_ERROR',
        details: responseData
      }
      
      return Promise.reject(errorData)
    }
  )

  return instance
}

// Create API instance
export const api = createApiInstance()

// Generic API methods
export const apiRequest = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    api.get<ApiResponse<T>>(url, config).then(res => res.data),
    
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    api.post<T>(url, data, config).then(res => res.data as ApiResponse<T>),
    
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    api.put<ApiResponse<T>>(url, data, config).then(res => res.data),
    
  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    api.patch<ApiResponse<T>>(url, data, config).then(res => res.data),
    
  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    api.delete<ApiResponse<T>>(url, config).then(res => res.data),
}

// Extend AxiosRequestConfig to include metadata
declare module 'axios' {
  interface AxiosRequestConfig {
    metadata?: {
      startTime: Date
    }
  }
}

export default api
