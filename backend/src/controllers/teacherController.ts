import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { TeacherService } from '../services/teacherService';
import { CreateTeacherInput, UpdateTeacherInput, GetTeachersInput, createTeacherSchema, updateTeacherSchema, getTeachersSchema } from '../validations/teacherValidation';

export class TeacherController {
  static async createTeacher(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const validationResult = createTeacherSchema.safeParse(req.body);
      
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

      const teacherData: CreateTeacherInput = validationResult.data;
      const result = await TeacherService.createTeacher(teacherData);

      if (result.success) {
        res.status(201).json({
          status: 'Success',
          message: result.message,
          teacher: result.teacher,
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
        message: 'Failed to create teacher',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }

  static async getTeachers(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const validationResult = getTeachersSchema.safeParse(req.query);
      
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

      const params: GetTeachersInput = validationResult.data;
      const result = await TeacherService.getTeachers(params);

      if (result.success) {
        res.status(200).json({
          status: 'Success',
          message: result.message,
          teachers: result.teachers,
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
        message: 'Failed to retrieve teachers',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }

  static async getTeacherById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          status: 'Error',
          message: 'Teacher ID is required',
          timestamp: new Date().toISOString()
        });
        return;
      }

      const result = await TeacherService.getTeacherById(id);

      if (result.success) {
        res.status(200).json({
          status: 'Success',
          message: result.message,
          teacher: result.teacher,
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(404).json({
          status: 'Error',
          message: result.message,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 'Error',
        message: 'Failed to retrieve teacher',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }

  static async updateTeacher(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          status: 'Error',
          message: 'Teacher ID is required',
          timestamp: new Date().toISOString()
        });
        return;
      }

      const validationResult = updateTeacherSchema.safeParse(req.body);
      
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

      const updateData: UpdateTeacherInput = validationResult.data;
      const result = await TeacherService.updateTeacher(id, updateData);

      if (result.success) {
        res.status(200).json({
          status: 'Success',
          message: result.message,
          teacher: result.teacher,
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
        message: 'Failed to update teacher',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }

  static async deleteTeacher(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          status: 'Error',
          message: 'Teacher ID is required',
          timestamp: new Date().toISOString()
        });
        return;
      }

      const result = await TeacherService.deleteTeacher(id);

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
        message: 'Failed to delete teacher',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }
}
