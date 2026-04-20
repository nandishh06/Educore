import { Router } from 'express';
import { RbacController } from '../controllers/rbacController';
import { authenticateToken } from '../middleware/auth';
import { requireRole, requirePermission } from '../middleware/rbac';

const router = Router();

// Get all available permissions (public)
router.get('/permissions', RbacController.getPermissions);

// Get current user's permissions (authenticated)
router.get('/my-permissions', authenticateToken, RbacController.getUserPermissions);

// Role-based access test endpoints
router.get('/admin-only', authenticateToken, requireRole(['admin']), RbacController.adminOnly);
router.get('/principal-or-above', authenticateToken, requireRole(['principal', 'admin']), RbacController.principalOrAbove);
router.get('/teacher-or-above', authenticateToken, requireRole(['teacher', 'hod', 'principal', 'admin']), RbacController.teacherOrAbove);

// Permission-based access test endpoints
router.get('/student-management', authenticateToken, requirePermission('students:read'), RbacController.studentManagementDemo);
router.get('/user-creation', authenticateToken, requirePermission('users:create'), RbacController.userCreationDemo);

export default router;
