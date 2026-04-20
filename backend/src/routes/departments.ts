import { Router } from 'express';
import { DepartmentController } from '../controllers/departmentController';
import { authenticateToken } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';

const router = Router();

// All department routes require authentication
router.use(authenticateToken);

// Read operations
router.get('/', requirePermission('departments:read'), DepartmentController.getDepartments);
router.get('/:id', requirePermission('departments:read'), DepartmentController.getDepartmentById);

// Write operations (higher permissions)
router.post('/', requirePermission('departments:create'), DepartmentController.createDepartment);
router.put('/:id', requirePermission('departments:update'), DepartmentController.updateDepartment);
router.delete('/:id', requirePermission('departments:delete'), DepartmentController.deleteDepartment);

export default router;
