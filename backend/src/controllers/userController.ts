import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { CreateUserInput, UpdateUserInput } from '../validations/userValidation';

export class UserController {
  // Get all users with filtering and pagination
  static async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const params: {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        search: req.query.search as string || '',
        role: req.query.role as 'admin' | 'principal' | 'hod' | 'teacher' | undefined,
        department: req.query.department as string || '',
        grade: req.query.grade as string || '',
        section: req.query.section as string || '',
        isActive: req.query.isActive ? req.query.isActive === 'true' : undefined,
        sortBy: req.query.sortBy as 'name' | 'email' | 'role' | 'department' | 'created_at' || 'created_at',
        sortOrder: req.query.sortOrder as 'asc' | 'desc' || 'asc'
      };

      const result = await UserService.getUsers(params);
      
      res.status(200).json({
        status: 'Success',
        message: 'Users retrieved successfully',
        data: result.data,
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        status: 'Error',
        message: 'Failed to retrieve users',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }

  // Get user by ID
  static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        res.status(400).json({
          status: 'Error',
          message: 'User ID is required',
          timestamp: new Date().toISOString()
        });
        return;
      }

      const result = await UserService.getUserById(userId);
      
      if (!result.success) {
        res.status(404).json({
          status: 'Error',
          message: result.message,
          timestamp: new Date().toISOString()
        });
        return;
      }

      res.status(200).json({
        status: 'Success',
        message: 'User retrieved successfully',
        data: result.data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        status: 'Error',
        message: 'Failed to retrieve user',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }

  // Create new user
  static async createUser(req: Request, res: Response): Promise<void> {
    try {
      const result = await UserService.createUser(req.body);
      
      res.status(201).json({
        status: 'Success',
        message: 'User created successfully',
        data: result.data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        status: 'Error',
        message: 'Failed to create user',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }

  // Update user
  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        res.status(400).json({
          status: 'Error',
          message: 'User ID is required',
          timestamp: new Date().toISOString()
        });
        return;
      }

      const result = await UserService.updateUser(userId, req.body);
      
      if (!result.success) {
        res.status(404).json({
          status: 'Error',
          message: result.message,
          timestamp: new Date().toISOString()
        });
        return;
      }

      res.status(200).json({
        status: 'Success',
        message: 'User updated successfully',
        data: result.data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        status: 'Error',
        message: 'Failed to update user',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }

  // Delete user
  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        res.status(400).json({
          status: 'Error',
          message: 'User ID is required',
          timestamp: new Date().toISOString()
        });
        return;
      }

      const result = await UserService.deleteUser(userId);
      
      res.status(200).json({
        status: 'Success',
        message: 'User deleted successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        status: 'Error',
        message: 'Failed to delete user',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }

  // Get user counts
  static async getUserCounts(req: Request, res: Response): Promise<void> {
    try {
      const result = await UserService.getUserCounts();
      
      res.status(200).json({
        status: 'Success',
        message: 'User counts retrieved successfully',
        data: result.data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        status: 'Error',
        message: 'Failed to retrieve user counts',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }

  // Get users by department
  static async getUsersByDepartment(req: Request, res: Response): Promise<void> {
    try {
      const { department } = req.params;
      
      if (!department) {
        res.status(400).json({
          status: 'Error',
          message: 'Department is required',
          timestamp: new Date().toISOString()
        });
        return;
      }

      const users = await UserService.getUsersByDepartment(department);
      
      res.status(200).json({
        status: 'Success',
        message: 'Department users retrieved successfully',
        data: users,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        status: 'Error',
        message: 'Failed to retrieve department users',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }
}
