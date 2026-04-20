import { Router } from 'express';
import { TeacherController } from '../controllers/teacherController';
import { authenticateToken } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';

const router = Router();

// All teacher routes require authentication
router.use(authenticateToken);

// Read operations
router.get('/', requirePermission('teachers:read'), TeacherController.getTeachers);
router.get('/:id', requirePermission('teachers:read'), TeacherController.getTeacherById);

// Write operations (higher permissions)
router.post('/', requirePermission('teachers:create'), TeacherController.createTeacher);
router.put('/:id', requirePermission('teachers:update'), TeacherController.updateTeacher);
router.delete('/:id', requirePermission('teachers:delete'), TeacherController.deleteTeacher);

export default router;
