import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals'
import request from 'supertest'
import { app } from '../../app'

// Mock the database service
jest.mock('../../services/databaseService', () => ({
  DatabaseService: {
    user: {
      findByEmail: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}))

describe('Authentication Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        role: 'admin'
      }

      const mockUser = {
        id: 'user123',
        email: userData.email,
        name: userData.name,
        role: userData.role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { DatabaseService } = require('../../services/databaseService')
      DatabaseService.user.findByEmail.mockResolvedValue(null)
      DatabaseService.user.create.mockResolvedValue(mockUser)

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201)

      expect(response.body).toHaveProperty('status', 'success')
      expect(response.body).toHaveProperty('message', 'User registered successfully')
      expect(response.body).toHaveProperty('data')
      expect(response.body.data).toHaveProperty('user')
      expect(response.body.data).toHaveProperty('token')
      expect(response.body.data.user.email).toBe(userData.email)
      expect(response.body.data.user.name).toBe(userData.name)
      expect(response.body.data.user.role).toBe(userData.role)
      expect(response.body.data.user).not.toHaveProperty('password')
    })

    it('should return error for duplicate email', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Test User',
        role: 'admin'
      }

      const { DatabaseService } = require('../../services/databaseService')
      DatabaseService.user.findByEmail.mockResolvedValue({
        id: 'existing-user',
        email: userData.email
      })

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400)

      expect(response.body).toHaveProperty('status', 'error')
      expect(response.body).toHaveProperty('message', 'User already exists')
    })

    it('should return error for invalid email format', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'password123',
        name: 'Test User',
        role: 'admin'
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400)

      expect(response.body).toHaveProperty('status', 'error')
      expect(response.body).toHaveProperty('message')
    })

    it('should return error for short password', async () => {
      const userData = {
        email: 'test@example.com',
        password: '123',
        name: 'Test User',
        role: 'admin'
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400)

      expect(response.body).toHaveProperty('status', 'error')
      expect(response.body).toHaveProperty('message')
    })

    it('should return error for missing required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({})
        .expect(400)

      expect(response.body).toHaveProperty('status', 'error')
      expect(response.body).toHaveProperty('message')
    })
  })

  describe('POST /api/auth/login', () => {
    it('should login user successfully', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      }

      const mockUser = {
        id: 'user123',
        email: loginData.email,
        name: 'Test User',
        role: 'admin',
        password: 'hashed-password',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { DatabaseService } = require('../../services/databaseService')
      DatabaseService.user.findByEmail.mockResolvedValue(mockUser)

      // Mock password comparison
      const bcrypt = require('bcryptjs')
      bcrypt.compare.mockResolvedValue(true)

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200)

      expect(response.body).toHaveProperty('status', 'success')
      expect(response.body).toHaveProperty('message', 'Login successful')
      expect(response.body).toHaveProperty('data')
      expect(response.body.data).toHaveProperty('user')
      expect(response.body.data).toHaveProperty('token')
      expect(response.body.data.user.email).toBe(loginData.email)
      expect(response.body.data.user).not.toHaveProperty('password')
    })

    it('should return error for invalid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrong-password'
      }

      const { DatabaseService } = require('../../services/databaseService')
      DatabaseService.user.findByEmail.mockResolvedValue({
        id: 'user123',
        email: loginData.email,
        password: 'hashed-password'
      })

      // Mock password comparison
      const bcrypt = require('bcryptjs')
      bcrypt.compare.mockResolvedValue(false)

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401)

      expect(response.body).toHaveProperty('status', 'error')
      expect(response.body).toHaveProperty('message', 'Invalid credentials')
    })

    it('should return error for non-existent user', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123'
      }

      const { DatabaseService } = require('../../services/databaseService')
      DatabaseService.user.findByEmail.mockResolvedValue(null)

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401)

      expect(response.body).toHaveProperty('status', 'error')
      expect(response.body).toHaveProperty('message', 'Invalid credentials')
    })

    it('should return error for missing email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ password: 'password123' })
        .expect(400)

      expect(response.body).toHaveProperty('status', 'error')
      expect(response.body).toHaveProperty('message')
    })

    it('should return error for missing password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com' })
        .expect(400)

      expect(response.body).toHaveProperty('status', 'error')
      expect(response.body).toHaveProperty('message')
    })
  })

  describe('POST /api/auth/verify-token', () => {
    it('should verify valid token', async () => {
      const mockToken = 'valid-jwt-token'
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'admin'
      }

      // Mock JWT verification
      const jwt = require('jsonwebtoken')
      jwt.verify.mockReturnValue({ userId: mockUser.id, email: mockUser.email })

      const { DatabaseService } = require('../../services/databaseService')
      DatabaseService.user.findById.mockResolvedValue(mockUser)

      const response = await request(app)
        .post('/api/auth/verify-token')
        .set('Authorization', `Bearer ${mockToken}`)
        .expect(200)

      expect(response.body).toHaveProperty('status', 'success')
      expect(response.body).toHaveProperty('message', 'Token is valid')
      expect(response.body).toHaveProperty('data')
      expect(response.body.data).toHaveProperty('valid', true)
      expect(response.body.data).toHaveProperty('user')
    })

    it('should return error for invalid token', async () => {
      const mockToken = 'invalid-token'

      // Mock JWT verification to throw error
      const jwt = require('jsonwebtoken')
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token')
      })

      const response = await request(app)
        .post('/api/auth/verify-token')
        .set('Authorization', `Bearer ${mockToken}`)
        .expect(401)

      expect(response.body).toHaveProperty('status', 'error')
      expect(response.body).toHaveProperty('message', 'Invalid token')
    })

    it('should return error for missing token', async () => {
      const response = await request(app)
        .post('/api/auth/verify-token')
        .expect(401)

      expect(response.body).toHaveProperty('status', 'error')
      expect(response.body).toHaveProperty('message', 'No token provided')
    })
  })

  describe('POST /api/auth/logout', () => {
    it('should logout user successfully', async () => {
      const mockToken = 'valid-jwt-token'

      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${mockToken}`)
        .expect(200)

      expect(response.body).toHaveProperty('status', 'success')
      expect(response.body).toHaveProperty('message', 'Logout successful')
    })
  })
})
