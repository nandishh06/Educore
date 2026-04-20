import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals'
import { AuthService } from '../../services/authService'
import { JWTUtils } from '../../utils/jwt'

// Mock JWTUtils
jest.mock('../../utils/jwt', () => ({
  JWTUtils: {
    generateToken: jest.fn().mockReturnValue('mock-token') as any,
    verifyToken: jest.fn().mockReturnValue({ userId: 'test', email: 'test', role: 'admin', name: 'test' }) as any,
    comparePassword: jest.fn().mockResolvedValue(true) as any,
    hashPassword: jest.fn().mockResolvedValue('hashed-password') as any,
  },
}))

// Mock database configuration
jest.mock('../../config/database', () => ({
  isDatabaseConfigured: jest.fn(() => true),
  getSupabaseClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({ data: null, error: null })
        }))
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({ data: null, error: null })
        }))
      }))
    }))
  })),
}))

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('login', () => {
    it('should login user successfully', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      }

      const mockUser = {
        id: 'user123',
        email: credentials.email,
        name: 'Test User',
        role: 'admin',
        password: 'hashed-password',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const mockToken = 'mock-jwt-token'

      // Mock database responses
      const { getSupabaseClient } = require('../../config/database')
      const supabase = getSupabaseClient()
      
      // Mock user lookup
      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: mockUser,
              error: null
            })
          })
        })
      } as any)

      // Mock JWT generation
      ;(JWTUtils.comparePassword as jest.Mock).mockResolvedValue(true)
      ;(JWTUtils.generateToken as jest.Mock).mockReturnValue(mockToken)

      const result = await AuthService.login(credentials)

      expect(JWTUtils.comparePassword).toHaveBeenCalledWith(credentials.password, mockUser.password)
      expect(JWTUtils.generateToken).toHaveBeenCalledWith({
        userId: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
        name: mockUser.name
      })
      expect(result).toEqual({
        success: true,
        message: 'Login successful',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          role: mockUser.role,
          created_at: mockUser.created_at,
          updated_at: mockUser.updated_at
        },
        token: mockToken
      })
    })

    it('should return error for invalid credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'wrongpassword'
      }

      const { getSupabaseClient } = require('../../config/database')
      const supabase = getSupabaseClient()
      
      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: null
            })
          })
        })
      } as any)

      const result = await AuthService.login(credentials)

      expect(result).toEqual({
        success: false,
        message: 'Invalid email or password'
      })
    })

    it('should return error when database not configured', async () => {
      const { isDatabaseConfigured } = require('../../config/database')
      isDatabaseConfigured.mockReturnValue(false)

      const result = await AuthService.login({
        email: 'test@example.com',
        password: 'password123'
      })

      expect(result).toEqual({
        success: false,
        message: 'Database not configured. Please configure Supabase to enable authentication.'
      })
    })
  })

  describe('register', () => {
    it('should register user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        role: 'admin' as const
      }

      const mockUser = {
        id: 'user123',
        email: userData.email,
        name: userData.name,
        role: userData.role,
        password: 'hashed-password',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const mockToken = 'mock-jwt-token'

      const { getSupabaseClient } = require('../../config/database')
      const supabase = getSupabaseClient()
      
      // Mock existing user check (no existing user)
      supabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: null
            })
          })
        })
      } as any)

      // Mock user creation
      supabase.from.mockReturnValueOnce({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: mockUser,
              error: null
            })
          })
        })
      } as any)

      ;(JWTUtils.hashPassword as jest.Mock).mockResolvedValue('hashed-password')
      ;(JWTUtils.generateToken as jest.Mock).mockReturnValue(mockToken)

      const result = await AuthService.register(userData)

      expect(JWTUtils.hashPassword).toHaveBeenCalledWith(userData.password)
      expect(JWTUtils.generateToken).toHaveBeenCalledWith({
        userId: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
        name: mockUser.name
      })
      expect(result).toEqual({
        success: true,
        message: 'Registration successful',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          role: mockUser.role,
          created_at: mockUser.created_at,
          updated_at: mockUser.updated_at
        },
        token: mockToken
      })
    })

    it('should return error for existing user', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Test User',
        role: 'admin' as const
      }

      const { getSupabaseClient } = require('../../config/database')
      const supabase = getSupabaseClient()
      
      // Mock existing user check (user exists)
      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { id: 'existing-user' },
              error: null
            })
          })
        })
      } as any)

      const result = await AuthService.register(userData)

      expect(result).toEqual({
        success: false,
        message: 'User with this email already exists'
      })
    })
  })

  describe('verifyToken', () => {
    it('should verify valid token', async () => {
      const mockToken = 'valid-token'
      const mockPayload = {
        userId: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'admin'
      }

      ;(JWTUtils.verifyToken as jest.Mock).mockReturnValue(mockPayload)

      const result = await AuthService.verifyToken(mockToken)

      expect(JWTUtils.verifyToken).toHaveBeenCalledWith(mockToken)
      expect(result).toEqual({
        success: true,
        user: mockPayload,
        message: 'Token is valid'
      })
    })

    it('should return error for invalid token', async () => {
      const mockToken = 'invalid-token'
      
      ;(JWTUtils.verifyToken as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token')
      })

      const result = await AuthService.verifyToken(mockToken)

      expect(result).toEqual({
        success: false,
        message: 'Invalid token'
      })
    })
  })
})
