import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
    name: string;
  };
}

export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        status: 'Error',
        message: 'Access token required',
        timestamp: new Date().toISOString()
      });
      return;
    }

    const result = await AuthService.verifyToken(token);
    
    if (!result.success || !result.user) {
      res.status(401).json({
        status: 'Error',
        message: result.message,
        timestamp: new Date().toISOString()
      });
      return;
    }

    req.user = result.user;
    next();
  } catch (error) {
    res.status(401).json({
      status: 'Error',
      message: 'Authentication failed',
      timestamp: new Date().toISOString()
    });
  }
};

export const optionalAuth = async (req: AuthenticatedRequest, _res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (token) {
      const result = await AuthService.verifyToken(token);
      if (result.success && result.user) {
        req.user = result.user;
      }
    }
    
    next();
  } catch (error) {
    // For optional auth, we don't send an error, just continue without user
    next();
  }
};
