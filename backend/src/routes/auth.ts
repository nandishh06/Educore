import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/verify-token', AuthController.verifyToken);

// Protected routes
router.get('/profile', authenticateToken, AuthController.getProfile);

export default router;
