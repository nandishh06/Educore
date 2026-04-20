// Mock the modules BEFORE importing AuthService
jest.mock('../../utils/jwt', () => ({
  JWTUtils: {
    verifyToken: jest.fn(),
    generateToken: jest.fn(),
    comparePassword: jest.fn(),
    hashPassword: jest.fn(),
  },
}))

jest.mock('../../config/database', () => ({
  isDatabaseConfigured: jest.fn(() => true),
  getSupabaseClient: jest.fn(),
}))

// Now import AuthService after mocks are set up
const { AuthService } = require('../../services/authService')

describe('AuthService Basic Tests', () => {
  let JWTUtils

  beforeEach(() => {
    // Get the mocked module
    JWTUtils = require('../../utils/jwt').JWTUtils
    
    // Reset all mocks
    jest.clearAllMocks()
  })

  describe('verifyToken', () => {
    it('should return success for valid token', async () => {
      const mockToken = 'valid-token'
      const mockPayload = {
        userId: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'admin'
      }

      // Set up the mock
      JWTUtils.verifyToken.mockReturnValue(mockPayload)

      // Debug: check if mock is set up correctly
      console.log('Mock setup:', JWTUtils.verifyToken.getMockImplementation())
      console.log('Mock calls:', JWTUtils.verifyToken.mock.calls)

      const result = await AuthService.verifyToken(mockToken)

      // Debug: check the actual result
      console.log('Actual result:', result)

      expect(result.success).toBe(true)
      expect(result.user).toEqual(mockPayload)
      expect(result.message).toBe('Token is valid')
    })

    it('should return error for invalid token', async () => {
      const mockToken = 'invalid-token'
      
      // Set up the mock to throw an error
      JWTUtils.verifyToken = jest.fn().mockImplementation(() => {
        throw new Error('Invalid token')
      })

      const result = await AuthService.verifyToken(mockToken)

      expect(result.success).toBe(false)
      expect(result.message).toBe('Invalid token')
    })
  })

  describe('database configuration checks', () => {
    it('should return database error when not configured', async () => {
      // Mock database configuration to return false
      const { isDatabaseConfigured } = require('../../config/database')
      isDatabaseConfigured.mockReturnValue(false)

      const loginResult = await AuthService.login({
        email: 'test@example.com',
        password: 'password123'
      })

      expect(loginResult.success).toBe(false)
      expect(loginResult.message).toContain('Database not configured')

      const registerResult = await AuthService.register({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        role: 'admin'
      })

      expect(registerResult.success).toBe(false)
      expect(registerResult.message).toContain('Database not configured')
    })
  })
})
