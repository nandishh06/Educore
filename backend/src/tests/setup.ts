import { beforeAll, afterAll, beforeEach, afterEach } from '@jest/globals'

// Mock environment variables
process.env['NODE_ENV'] = 'test'
process.env['JWT_SECRET'] = 'test-jwt-secret'
process.env['DATABASE_URL'] = 'postgresql://test:test@localhost:5432/test_db'

// Mock Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      offset: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
    })),
    auth: {
      signUp: jest.fn(),
      signIn: jest.fn(),
      signOut: jest.fn(),
      getUser: jest.fn(),
    },
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(),
        download: jest.fn(),
        remove: jest.fn(),
      })),
    },
  })),
}))

// Global test setup
beforeAll(async () => {
  // Setup test database or mocks
  console.log('Setting up test environment...')
})

afterAll(async () => {
  // Cleanup test database or mocks
  console.log('Cleaning up test environment...')
})

beforeEach(() => {
  // Reset mocks before each test
  jest.clearAllMocks()
})

afterEach(() => {
  // Cleanup after each test
  jest.restoreAllMocks()
})

// Add custom matchers if needed
expect.extend({
  toBeValidToken(received: string) {
    const pass = typeof received === 'string' && received.length > 0
    return {
      message: () =>
        pass
          ? `expected ${received} not to be a valid token`
          : `expected ${received} to be a valid token`,
      pass,
    }
  },
})

// Extend Jest types
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidToken(): R
    }
  }
}
