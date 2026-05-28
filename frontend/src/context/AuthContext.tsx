import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { User } from '../types/auth'
import { AuthService, LoginCredentials, RegisterData } from '../services'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (userData: RegisterData) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      }
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    default:
      return state
  }
}

const initialState: AuthState = {
  user: null,
  token: AuthService.getToken(),
  isAuthenticated: AuthService.isAuthenticated(),
  isLoading: false,
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    const initializeAuth = async () => {
      const token = AuthService.getToken()
      if (token && AuthService.isAuthenticated()) {
        dispatch({ type: 'SET_LOADING', payload: true })
        
        try {
          const response = await AuthService.verifyToken()
          // Backend returns { status, user: { userId, email, name, role } }
          // The axios wrapper puts the whole response body as the returned object
          const userData = (response as any).user ?? response.data?.user
          if (userData) {
            const user: User = {
              userId: userData.userId ?? userData.id,
              email: userData.email,
              name: userData.name,
              role: userData.role as User['role']
            }
            
            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: { user, token }
            })
          } else {
            AuthService.clearToken()
            dispatch({ type: 'LOGIN_FAILURE' })
          }
        } catch (error) {
          AuthService.clearToken()
          dispatch({ type: 'LOGIN_FAILURE' })
        }
      }
      dispatch({ type: 'SET_LOADING', payload: false })
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' })
    try {
      const credentials: LoginCredentials = { email, password }
      const response = await AuthService.login(credentials)
      
      if (response.data?.user && response.data?.token) {
        const u = response.data.user
        const user: User = {
          userId: (u as any).userId ?? u.id,
          email: u.email,
          name: u.name,
          role: u.role as User['role']
        }
        
        AuthService.setToken(response.data.token)
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, token: response.data.token },
        })
      } else {
        dispatch({ type: 'LOGIN_FAILURE' })
        throw new Error('Invalid response from server')
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' })
      throw error
    }
  }

  const logout = async () => {
    try {
      await AuthService.logout()
    } catch (error) {
      console.warn('Logout API call failed:', error)
    }
    
    dispatch({ type: 'LOGOUT' })
  }

  const register = async (userData: RegisterData) => {
    dispatch({ type: 'LOGIN_START' })
    try {
      const response = await AuthService.register(userData)
      
      if (response.data?.user && response.data?.token) {
        const user: User = {
          userId: response.data.user.id,
          email: response.data.user.email,
          name: response.data.user.name,
          role: response.data.user.role
        }
        
        AuthService.setToken(response.data.token)
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, token: response.data.token },
        })
      } else {
        dispatch({ type: 'LOGIN_FAILURE' })
        throw new Error('Invalid response from server')
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' })
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
