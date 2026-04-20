import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';

export type UserRole = 'admin' | 'principal' | 'hod' | 'teacher';

export interface RolePermissions {
  [key: string]: {
    canAccess: UserRole[];
    description: string;
  };
}

// Define role hierarchy (higher number = more permissions)
export const roleHierarchy: Record<UserRole, number> = {
  admin: 4,
  principal: 3,
  hod: 2,
  teacher: 1
};

// Define permissions for different resources
export const permissions: RolePermissions = {
  // User management
  'users:read': {
    canAccess: ['admin', 'principal'],
    description: 'Read user information'
  },
  'users:create': {
    canAccess: ['admin'],
    description: 'Create new users'
  },
  'users:update': {
    canAccess: ['admin', 'principal'],
    description: 'Update user information'
  },
  'users:delete': {
    canAccess: ['admin'],
    description: 'Delete users'
  },

  // Student management
  'students:read': {
    canAccess: ['admin', 'principal', 'hod', 'teacher'],
    description: 'Read student information'
  },
  'students:create': {
    canAccess: ['admin', 'principal', 'hod'],
    description: 'Create new students'
  },
  'students:update': {
    canAccess: ['admin', 'principal', 'hod'],
    description: 'Update student information'
  },
  'students:delete': {
    canAccess: ['admin', 'principal'],
    description: 'Delete students'
  },

  // Teacher management
  'teachers:read': {
    canAccess: ['admin', 'principal', 'hod'],
    description: 'Read teacher information'
  },
  'teachers:create': {
    canAccess: ['admin', 'principal'],
    description: 'Create new teachers'
  },
  'teachers:update': {
    canAccess: ['admin', 'principal'],
    description: 'Update teacher information'
  },
  'teachers:delete': {
    canAccess: ['admin'],
    description: 'Delete teachers'
  },

  // Department management
  'departments:read': {
    canAccess: ['admin', 'principal', 'hod'],
    description: 'Read department information'
  },
  'departments:create': {
    canAccess: ['admin', 'principal'],
    description: 'Create new departments'
  },
  'departments:update': {
    canAccess: ['admin', 'principal'],
    description: 'Update department information'
  },
  'departments:delete': {
    canAccess: ['admin'],
    description: 'Delete departments'
  },

  // Attendance management
  'attendance:read': {
    canAccess: ['admin', 'principal', 'hod', 'teacher'],
    description: 'Read attendance records'
  },
  'attendance:create': {
    canAccess: ['admin', 'principal', 'hod', 'teacher'],
    description: 'Create attendance records'
  },
  'attendance:update': {
    canAccess: ['admin', 'principal', 'hod', 'teacher'],
    description: 'Update attendance records'
  },

  // Marks management
  'marks:read': {
    canAccess: ['admin', 'principal', 'hod', 'teacher'],
    description: 'Read marks and grades'
  },
  'marks:create': {
    canAccess: ['admin', 'principal', 'hod', 'teacher'],
    description: 'Create marks and grades'
  },
  'marks:update': {
    canAccess: ['admin', 'principal', 'hod', 'teacher'],
    description: 'Update marks and grades'
  },

  // Fees management
  'fees:read': {
    canAccess: ['admin', 'principal'],
    description: 'Read fee information'
  },
  'fees:create': {
    canAccess: ['admin', 'principal'],
    description: 'Create fee records'
  },
  'fees:update': {
    canAccess: ['admin', 'principal'],
    description: 'Update fee records'
  },

  // Timetable management
  'timetable:read': {
    canAccess: ['admin', 'principal', 'hod', 'teacher'],
    description: 'Read timetable information'
  },
  'timetable:create': {
    canAccess: ['admin', 'principal', 'hod'],
    description: 'Create timetable'
  },
  'timetable:update': {
    canAccess: ['admin', 'principal', 'hod'],
    description: 'Update timetable'
  },

  // System administration
  'system:admin': {
    canAccess: ['admin'],
    description: 'System administration tasks'
  }
};

// Check if user has permission for a specific action
export const hasPermission = (userRole: UserRole, permission: string): boolean => {
  const permissionConfig = permissions[permission];
  
  if (!permissionConfig) {
    return false;
  }

  return permissionConfig.canAccess.includes(userRole);
};

// Check if user has at least the required role level
export const hasMinimumRole = (userRole: UserRole, minimumRole: UserRole): boolean => {
  return roleHierarchy[userRole] >= roleHierarchy[minimumRole];
};

// Middleware factory for role-based access control
export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        status: 'Error',
        message: 'Authentication required',
        timestamp: new Date().toISOString()
      });
      return;
    }

    const userRole = req.user.role as UserRole;

    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({
        status: 'Error',
        message: 'Access denied. Insufficient permissions',
        required: allowedRoles,
        current: userRole,
        timestamp: new Date().toISOString()
      });
      return;
    }

    next();
  };
};

// Middleware factory for permission-based access control
export const requirePermission = (permission: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        status: 'Error',
        message: 'Authentication required',
        timestamp: new Date().toISOString()
      });
      return;
    }

    const userRole = req.user.role as UserRole;

    if (!hasPermission(userRole, permission)) {
      const permissionConfig = permissions[permission];
      res.status(403).json({
        status: 'Error',
        message: 'Access denied. Insufficient permissions',
        permission: permission,
        description: permissionConfig?.description || 'Unknown permission',
        required: permissionConfig?.canAccess || [],
        current: userRole,
        timestamp: new Date().toISOString()
      });
      return;
    }

    next();
  };
};

// Middleware for minimum role level
export const requireMinimumRole = (minimumRole: UserRole) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        status: 'Error',
        message: 'Authentication required',
        timestamp: new Date().toISOString()
      });
      return;
    }

    const userRole = req.user.role as UserRole;

    if (!hasMinimumRole(userRole, minimumRole)) {
      res.status(403).json({
        status: 'Error',
        message: 'Access denied. Insufficient role level',
        minimum: minimumRole,
        current: userRole,
        timestamp: new Date().toISOString()
      });
      return;
    }

    next();
  };
};

// Helper function to get all permissions for a role
export const getRolePermissions = (role: UserRole): string[] => {
  return Object.entries(permissions)
    .filter(([_, config]) => config.canAccess.includes(role))
    .map(([permission, _]) => permission);
};

// Helper function to check if user can access their own data
export const canAccessOwnData = (req: AuthenticatedRequest, targetUserId: string): boolean => {
  if (!req.user) return false;
  
  // Users can always access their own data
  if (req.user.userId === targetUserId) return true;
  
  // Admin can access any data
  if (req.user.role === 'admin') return true;
  
  // Principal can access most data
  if (req.user.role === 'principal') return true;
  
  return false;
};
