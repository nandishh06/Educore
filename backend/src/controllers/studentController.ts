import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { StudentService } from '../services/studentService';
import { CreateStudentInput, UpdateStudentInput, GetStudentsInput, createStudentSchema, updateStudentSchema, getStudentsSchema } from '../validations/studentValidation';

export class StudentController {
  static async createStudent(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // Validate input
      const validationResult = createStudentSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        res.status(400).json({
          status: 'Error',
          message: 'Validation failed',
          errors: validationResult.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          })),
          timestamp: new Date().toISOString()
        });
        return;
      }

      const studentData: CreateStudentInput = validationResult.data;
      const result = await StudentService.createStudent(studentData);

      if (result.success) {
        res.status(201).json({
          status: 'Success',
          message: result.message,
          student: result.student,
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(400).json({
          status: 'Error',
          message: result.message,
          error: result.error,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 'Error',
        message: 'Failed to create student',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }

  static async getStudents(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // Validate query parameters
      const validationResult = getStudentsSchema.safeParse(req.query);
      
      if (!validationResult.success) {
        res.status(400).json({
          status: 'Error',
          message: 'Invalid query parameters',
          errors: validationResult.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          })),
          timestamp: new Date().toISOString()
        });
        return;
      }

      const params: GetStudentsInput = validationResult.data;
      const result = await StudentService.getStudents(params);

      if (result.success) {
        res.status(200).json({
          status: 'Success',
          message: result.message,
          students: result.students,
          pagination: result.pagination,
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(400).json({
          status: 'Error',
          message: result.message,
          error: result.error,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 'Error',
        message: 'Failed to retrieve students',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }

  static async getStudentById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          status: 'Error',
          message: 'Student ID is required',
          timestamp: new Date().toISOString()
        });
        return;
      }

      const result = await StudentService.getStudentById(id);

      if (result.success) {
        res.status(200).json({
          status: 'Success',
          message: result.message,
          student: result.student,
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(404).json({
          status: 'Error',
          message: result.message,
          error: result.error,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 'Error',
        message: 'Failed to retrieve student',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }

  static async updateStudent(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          status: 'Error',
          message: 'Student ID is required',
          timestamp: new Date().toISOString()
        });
        return;
      }

      // Validate input
      const validationResult = updateStudentSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        res.status(400).json({
          status: 'Error',
          message: 'Validation failed',
          errors: validationResult.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          })),
          timestamp: new Date().toISOString()
        });
        return;
      }

      const updateData: UpdateStudentInput = validationResult.data;
      const result = await StudentService.updateStudent(id, updateData);

      if (result.success) {
        res.status(200).json({
          status: 'Success',
          message: result.message,
          student: result.student,
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(400).json({
          status: 'Error',
          message: result.message,
          error: result.error,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 'Error',
        message: 'Failed to update student',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }

  static async deleteStudent(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          status: 'Error',
          message: 'Student ID is required',
          timestamp: new Date().toISOString()
        });
        return;
      }

      const result = await StudentService.deleteStudent(id);

      if (result.success) {
        res.status(200).json({
          status: 'Success',
          message: result.message,
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(400).json({
          status: 'Error',
          message: result.message,
          error: result.error,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 'Error',
        message: 'Failed to delete student',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }

  static async getStudentStats(_req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const result = await StudentService.getStudentStats();

      if (result.success) {
        res.status(200).json({
          status: 'Success',
          message: result.message,
          stats: result.stats,
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(400).json({
          status: 'Error',
          message: result.message,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 'Error',
        message: 'Failed to retrieve student statistics',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }
}
