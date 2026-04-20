import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { AttendanceService } from '../services/attendanceService';
import { CreateAttendanceInput, UpdateAttendanceInput, GetAttendanceInput, BulkAttendanceInput, createAttendanceSchema, updateAttendanceSchema, getAttendanceSchema, bulkAttendanceSchema } from '../validations/attendanceValidation';

export class AttendanceController {
  static async createAttendance(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const validationResult = createAttendanceSchema.safeParse(req.body);
      
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

      const attendanceData: CreateAttendanceInput = validationResult.data;
      const result = await AttendanceService.createAttendance(attendanceData);

      if (result.success) {
        res.status(201).json({
          status: 'Success',
          message: result.message,
          attendance: result.attendance,
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
        message: 'Failed to create attendance',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }

  static async bulkCreateAttendance(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const validationResult = bulkAttendanceSchema.safeParse(req.body);
      
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

      const bulkData: BulkAttendanceInput = validationResult.data;
      const result = await AttendanceService.bulkCreateAttendance(bulkData);

      if (result.success) {
        res.status(201).json({
          status: 'Success',
          message: result.message,
          attendances: result.attendances,
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
        message: 'Failed to create bulk attendance',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }

  static async getAttendance(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const validationResult = getAttendanceSchema.safeParse(req.query);
      
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

      const params: GetAttendanceInput = validationResult.data;
      const result = await AttendanceService.getAttendance(params);

      if (result.success) {
        res.status(200).json({
          status: 'Success',
          message: result.message,
          attendances: result.attendances,
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
        message: 'Failed to retrieve attendance',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }

  static async getAttendanceById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          status: 'Error',
          message: 'Attendance ID is required',
          timestamp: new Date().toISOString()
        });
        return;
      }

      const result = await AttendanceService.getAttendanceById(id);

      if (result.success) {
        res.status(200).json({
          status: 'Success',
          message: result.message,
          attendance: result.attendance,
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
        message: 'Failed to retrieve attendance',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }

  static async updateAttendance(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          status: 'Error',
          message: 'Attendance ID is required',
          timestamp: new Date().toISOString()
        });
        return;
      }

      const validationResult = updateAttendanceSchema.safeParse(req.body);
      
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

      const updateData: UpdateAttendanceInput = validationResult.data;
      const result = await AttendanceService.updateAttendance(id, updateData);

      if (result.success) {
        res.status(200).json({
          status: 'Success',
          message: result.message,
          attendance: result.attendance,
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
        message: 'Failed to update attendance',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }

  static async deleteAttendance(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          status: 'Error',
          message: 'Attendance ID is required',
          timestamp: new Date().toISOString()
        });
        return;
      }

      const result = await AttendanceService.deleteAttendance(id);

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
        message: 'Failed to delete attendance',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }

  static async getAttendanceStatistics(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { studentId, startDate, endDate } = req.query;

      const result = await AttendanceService.getAttendanceStatistics(
        studentId as string,
        startDate as string,
        endDate as string
      );

      if (result.success) {
        res.status(200).json({
          status: 'Success',
          message: result.message,
          statistics: result.statistics,
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
        message: 'Failed to retrieve attendance statistics',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }
}
