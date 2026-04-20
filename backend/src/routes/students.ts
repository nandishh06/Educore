import { Router } from 'express';
import { StudentController } from '../controllers/studentController';
import { authenticateToken } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';

const router = Router();

// All student routes require authentication
router.use(authenticateToken);

// Public endpoints for authenticated users
router.get('/', requirePermission('students:read'), StudentController.getStudents);
router.get('/stats', requirePermission('students:read'), StudentController.getStudentStats);
router.get('/:id', requirePermission('students:read'), StudentController.getStudentById);

// Protected endpoints requiring higher permissions
router.post('/', requirePermission('students:create'), StudentController.createStudent);
router.put('/:id', requirePermission('students:update'), StudentController.updateStudent);
router.delete('/:id', requirePermission('students:delete'), StudentController.deleteStudent);

export default router;
