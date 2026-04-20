import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { getRolePermissions, permissions, UserRole } from '../middleware/rbac';

export class RbacController {
  static async getPermissions(_req: Request, res: Response): Promise<void> {
    try {
      res.status(200).json({
        status: 'Success',
        message: 'All available permissions',
        permissions: Object.entries(permissions).map(([key, config]) => ({
          permission: key,
          description: config.description,
          roles: config.canAccess
        })),
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        status: 'Error',
        message: 'Failed to retrieve permissions',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }

  static async getUserPermissions(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          status: 'Error',
          message: 'Authentication required',
          timestamp: new Date().toISOString()
        });
        return;
      }

      const userRole = req.user.role as UserRole;
      const userPermissions = getRolePermissions(userRole);

      res.status(200).json({
        status: 'Success',
        message: 'User permissions retrieved successfully',
        user: {
          userId: req.user.userId,
          email: req.user.email,
          name: req.user.name,
          role: userRole
        },
        permissions: userPermissions,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        status: 'Error',
        message: 'Failed to retrieve user permissions',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }

  static async adminOnly(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      res.status(200).json({
        status: 'Success',
        message: 'Admin access granted',
        user: {
          userId: req.user?.userId,
          name: req.user?.name,
          role: req.user?.role
        },
        data: 'This is admin-only content',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        status: 'Error',
        message: 'Admin endpoint failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }

  static async principalOrAbove(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      res.status(200).json({
        status: 'Success',
        message: 'Principal or higher access granted',
        user: {
          userId: req.user?.userId,
          name: req.user?.name,
          role: req.user?.role
        },
        data: 'This content is accessible to Principal and Admin',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        status: 'Error',
        message: 'Principal endpoint failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }

  static async teacherOrAbove(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      res.status(200).json({
        status: 'Success',
        message: 'Teacher or higher access granted',
        user: {
          userId: req.user?.userId,
          name: req.user?.name,
          role: req.user?.role
        },
        data: 'This content is accessible to all authenticated users',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        status: 'Error',
        message: 'Teacher endpoint failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }

  static async studentManagementDemo(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      res.status(200).json({
        status: 'Success',
        message: 'Student management access granted',
        user: {
          userId: req.user?.userId,
          name: req.user?.name,
          role: req.user?.role
        },
        data: 'This endpoint demonstrates student:read permission',
        action: 'Reading student data',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        status: 'Error',
        message: 'Student management endpoint failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }

  static async userCreationDemo(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      res.status(200).json({
        status: 'Success',
        message: 'User creation access granted',
        user: {
          userId: req.user?.userId,
          name: req.user?.name,
          role: req.user?.role
        },
        data: 'This endpoint demonstrates users:create permission',
        action: 'Creating new user',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        status: 'Error',
        message: 'User creation endpoint failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }
}
