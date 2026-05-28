import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';

export type UserRole = 'admin' | 'principal' | 'hod' | 'teacher' | 'student' | 'parent';

export interface RolePermissions {
  [key: string]: {
    canAccess: UserRole[];
    description: string;
  };
}

// Define role hierarchy (higher number = more permissions)
export const roleHierarchy: Record<UserRole, number> = {
  admin: 5,
  hod: 4,
  teacher: 3,
  principal: 2, // principal is view-only — lower than teacher in write hierarchy
  student: 1,
  parent: 1
};

// Define permissions for different resources
export const permissions: RolePermissions = {
  // User management — admin only
  'users:read': {
    canAccess: ['admin'],
    description: 'Read user information'
  },
  'users:create': {
    canAccess: ['admin'],
    description: 'Create new users'
  },
  'users:update': {
    canAccess: ['admin'],
    description: 'Update user information'
  },
  'users:delete': {
    canAccess: ['admin'],
    description: 'Delete users'
  },

  // Student management
  'students:read': {
    canAccess: ['admin', 'principal', 'hod', 'teacher', 'student', 'parent'],
    description: 'Read student information'
  },
  'students:create': {
    canAccess: ['admin', 'hod'],
    description: 'Create new students'
  },
  'students:update': {
    canAccess: ['admin', 'hod'],
    description: 'Update student information'
  },
  'students:delete': {
    canAccess: ['admin'],
    description: 'Delete students'
  },

  // Teacher management
  'teachers:read': {
    canAccess: ['admin', 'principal', 'hod'],
    description: 'Read teacher information'
  },
  'teachers:create': {
    canAccess: ['admin', 'hod'],
    description: 'Create new teachers'
  },
  'teachers:update': {
    canAccess: ['admin', 'hod'],
    description: 'Update teacher information'
  },
  'teachers:delete': {
    canAccess: ['admin'],
    description: 'Delete teachers'
  },

  // Department management
  'departments:read': {
    canAccess: ['admin', 'principal', 'hod', 'teacher'],
    description: 'Read department information'
  },
  'departments:create': {
    canAccess: ['admin'],
    description: 'Create new departments'
  },
  'departments:update': {
    canAccess: ['admin', 'hod'],
    description: 'Update department information'
  },
  'departments:delete': {
    canAccess: ['admin'],
    description: 'Delete departments'
  },

  // Attendance management
  'attendance:read': {
    canAccess: ['admin', 'principal', 'hod', 'teacher', 'student', 'parent'],
    description: 'Read attendance records'
  },
  'attendance:create': {
    canAccess: ['admin', 'hod', 'teacher'],
    description: 'Create attendance records'
  },
  'attendance:update': {
    canAccess: ['admin', 'hod', 'teacher'],
    description: 'Update attendance records'
  },
  'attendance:delete': {
    canAccess: ['admin'],
    description: 'Delete attendance records'
  },

  // Marks management
  'marks:read': {
    canAccess: ['admin', 'principal', 'hod', 'teacher', 'student', 'parent'],
    description: 'Read marks and grades'
  },
  'marks:create': {
    canAccess: ['admin', 'hod', 'teacher'],
    description: 'Create marks and grades'
  },
  'marks:update': {
    canAccess: ['admin', 'hod', 'teacher'],
    description: 'Update marks and grades'
  },

  // Fees management
  'fees:read': {
    canAccess: ['admin', 'principal'],
    description: 'Read fee information'
  },
  'fees:create': {
    canAccess: ['admin'],
    description: 'Create fee records'
  },
  'fees:update': {
    canAccess: ['admin'],
    description: 'Update fee records'
  },

  // Timetable management
  'timetable:read': {
    canAccess: ['admin', 'principal', 'hod', 'teacher', 'student', 'parent'],
    description: 'Read timetable information'
  },
  'timetable:create': {
    canAccess: ['admin', 'hod'],
    description: 'Create timetable'
  },
  'timetable:update': {
    canAccess: ['admin', 'hod'],
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
    .filter(([_key, config]) => config.canAccess.includes(role))
    .map(([permission, _config]) => permission);
};

// Helper function to check if user can access their own data
export const canAccessOwnData = (req: AuthenticatedRequest, targetUserId: string): boolean => {
  if (!req.user) return false;
  
  // Users can always access their own data
  if (req.user.userId === targetUserId) return true;
  
  // Admin can access any data
  if (req.user.role === 'admin') return true;
  
  return false;
};
