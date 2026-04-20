const { AuthService } = require('../../services/authService')
const { JWTUtils } = require('../../utils/jwt')

// Mock JWTUtils
jest.mock('../../utils/jwt', () => ({
  JWTUtils: {
    generateToken: jest.fn(),
    verifyToken: jest.fn(),
    comparePassword: jest.fn(),
    hashPassword: jest.fn(),
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

describe('AuthService (Simple)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
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

      // Set up the mock
      JWTUtils.verifyToken.mockReturnValue(mockPayload)

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
      
      // Set up the mock to throw an error
      JWTUtils.verifyToken.mockImplementation(() => {
        throw new Error('Invalid token')
      })

      const result = await AuthService.verifyToken(mockToken)

      expect(result).toEqual({
        success: false,
        message: 'Invalid token'
      })
    })
  })

  describe('login', () => {
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
    it('should return error when database not configured', async () => {
      const { isDatabaseConfigured } = require('../../config/database')
      isDatabaseConfigured.mockReturnValue(false)

      const result = await AuthService.register({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        role: 'admin'
      })

      expect(result).toEqual({
        success: false,
        message: 'Database not configured. Please configure Supabase to enable authentication.'
      })
    })
  })
})
