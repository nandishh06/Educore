import { Router } from 'express';
import { AttendanceController } from '../controllers/attendanceController';
import { authenticateToken } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';

const router = Router();

// All attendance routes require authentication
router.use(authenticateToken);

// Read operations
router.get('/', requirePermission('attendance:read'), AttendanceController.getAttendance);
router.get('/statistics', requirePermission('attendance:read'), AttendanceController.getAttendanceStatistics);
router.get('/:id', requirePermission('attendance:read'), AttendanceController.getAttendanceById);

// Write operations
router.post('/', requirePermission('attendance:create'), AttendanceController.createAttendance);
router.post('/bulk', requirePermission('attendance:create'), AttendanceController.bulkCreateAttendance);
router.put('/:id', requirePermission('attendance:update'), AttendanceController.updateAttendance);
router.delete('/:id', requirePermission('attendance:update'), AttendanceController.deleteAttendance);

export default router;
