import { Router } from 'express';
import { UserController } from '../controllers/userController';

const router = Router();

// Get all users
router.get('/', UserController.getUsers);

// Get user by ID
router.get('/:userId', UserController.getUserById);

// Create new user
router.post('/', UserController.createUser);

// Update user
router.put('/:userId', UserController.updateUser);

// Delete user
router.delete('/:userId', UserController.deleteUser);

// Get user counts
router.get('/counts', UserController.getUserCounts);

// Get users by department
router.get('/department/:department', UserController.getUsersByDepartment);

export default router;
