import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { LoginInput, RegisterInput, loginSchema, registerSchema } from '../validations/authValidation';

export class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      // Validate input
      const validationResult = loginSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        res.status(400).json({
          status: 'Error',
          message: 'Validation failed',
          errors: validationResult.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          })),
          timestamp: new Date().toISOString()
        });
        return;
      }

      const credentials: LoginInput = validationResult.data;
      const result = await AuthService.login(credentials);

      if (result.success) {
        res.status(200).json({
          status: 'Success',
          message: result.message,
          data: {
            user: result.user,
            token: result.token
          },
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(401).json({
          status: 'Error',
          message: result.message,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 'Error',
        message: 'Login failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }

  static async register(req: Request, res: Response): Promise<void> {
    try {
      // Validate input
      const validationResult = registerSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        res.status(400).json({
          status: 'Error',
          message: 'Validation failed',
          errors: validationResult.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          })),
          timestamp: new Date().toISOString()
        });
        return;
      }

      const userData: RegisterInput = validationResult.data;
      const result = await AuthService.register(userData);

      if (result.success) {
        res.status(201).json({
          status: 'Success',
          message: result.message,
          user: result.user,
          token: result.token,
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(400).json({
          status: 'Error',
          message: result.message,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 'Error',
        message: 'Registration failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }

  static async verifyToken(req: Request, res: Response): Promise<void> {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

      if (!token) {
        res.status(400).json({
          status: 'Error',
          message: 'Token is required',
          timestamp: new Date().toISOString()
        });
        return;
      }

      const result = await AuthService.verifyToken(token);

      if (result.success) {
        res.status(200).json({
          status: 'Success',
          message: result.message,
          user: result.user,
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(401).json({
          status: 'Error',
          message: result.message,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 'Error',
        message: 'Token verification failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }

  static async getProfile(req: any, res: Response): Promise<void> {
    try {
      // User is already authenticated via middleware
      const user = req.user;

      res.status(200).json({
        status: 'Success',
        message: 'Profile retrieved successfully',
        user: {
          userId: user.userId,
          email: user.email,
          name: user.name,
          role: user.role
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        status: 'Error',
        message: 'Failed to retrieve profile',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }

  static async logout(_req: Request, res: Response): Promise<void> {
    try {
      // For JWT-based authentication, logout is mainly client-side
      // The client should remove the token from storage
      // Server can optionally add token to a blacklist if needed

      res.status(200).json({
        status: 'Success',
        message: 'Logout successful',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        status: 'Error',
        message: 'Logout failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }
}
