import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import databaseRoutes from './routes/database';
import authRoutes from './routes/auth';
import rbacRoutes from './routes/rbac';
import studentRoutes from './routes/students';
import teacherRoutes from './routes/teachers';
import departmentRoutes from './routes/departments';
import attendanceRoutes from './routes/attendance';

// Load environment variables
dotenv.config();

const app = express();

// Export app for testing
export { app };
const PORT = process.env['PORT'] || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/database', databaseRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/rbac', rbacRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/attendance', attendanceRoutes);

// Health check route
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'EduCore Backend Server is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Root route
app.get('/', (_req, res) => {
  res.json({
    message: 'Welcome to EduCore School Management System API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      database: {
        test: '/api/database/test',
        tables: '/api/database/tables'
      },
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
        verifyToken: 'POST /api/auth/verify-token',
        profile: 'GET /api/auth/profile (protected)'
      },
      rbac: {
        permissions: 'GET /api/rbac/permissions',
        myPermissions: 'GET /api/rbac/my-permissions (protected)',
        adminOnly: 'GET /api/rbac/admin-only (admin only)',
        principalOrAbove: 'GET /api/rbac/principal-or-above (principal+)',
        teacherOrAbove: 'GET /api/rbac/teacher-or-above (all authenticated)',
        studentManagement: 'GET /api/rbac/student-management (permission-based)',
        userCreation: 'GET /api/rbac/user-creation (permission-based)'
      },
      students: {
        getAll: 'GET /api/students (students:read)',
        getStats: 'GET /api/students/stats (students:read)',
        getById: 'GET /api/students/:id (students:read)',
        create: 'POST /api/students (students:create)',
        update: 'PUT /api/students/:id (students:update)',
        delete: 'DELETE /api/students/:id (students:delete)'
      },
      teachers: {
        getAll: 'GET /api/teachers (teachers:read)',
        getById: 'GET /api/teachers/:id (teachers:read)',
        create: 'POST /api/teachers (teachers:create)',
        update: 'PUT /api/teachers/:id (teachers:update)',
        delete: 'DELETE /api/teachers/:id (teachers:delete)'
      },
      departments: {
        getAll: 'GET /api/departments (departments:read)',
        getById: 'GET /api/departments/:id (departments:read)',
        create: 'POST /api/departments (departments:create)',
        update: 'PUT /api/departments/:id (departments:update)',
        delete: 'DELETE /api/departments/:id (departments:delete)'
      },
      attendance: {
        getAll: 'GET /api/attendance (attendance:read)',
        getStats: 'GET /api/attendance/statistics (attendance:read)',
        getById: 'GET /api/attendance/:id (attendance:read)',
        create: 'POST /api/attendance (attendance:create)',
        bulkCreate: 'POST /api/attendance/bulk (attendance:create)',
        update: 'PUT /api/attendance/:id (attendance:update)',
        delete: 'DELETE /api/attendance/:id (attendance:update)'
      }
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`EduCore Backend Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
