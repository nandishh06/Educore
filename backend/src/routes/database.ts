import { Router } from 'express';
import { DatabaseController } from '../controllers/databaseController';

const router = Router();

// Test database connection
router.get('/test', DatabaseController.testConnection);

// Check available tables
router.get('/tables', DatabaseController.checkTables);

export default router;
