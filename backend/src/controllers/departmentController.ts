import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { DepartmentService } from '../services/departmentService';
import { CreateDepartmentInput, UpdateDepartmentInput, GetDepartmentsInput, createDepartmentSchema, updateDepartmentSchema, getDepartmentsSchema } from '../validations/departmentValidation';

export class DepartmentController {
  static async createDepartment(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const validationResult = createDepartmentSchema.safeParse(req.body);
      
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

      const departmentData: CreateDepartmentInput = validationResult.data;
      const result = await DepartmentService.createDepartment(departmentData);

      if (result.success) {
        res.status(201).json({
          status: 'Success',
          message: result.message,
          department: result.department,
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
        message: 'Failed to create department',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }

  static async getDepartments(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const validationResult = getDepartmentsSchema.safeParse(req.query);
      
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

      const params: GetDepartmentsInput = validationResult.data;
      const result = await DepartmentService.getDepartments(params);

      if (result.success) {
        res.status(200).json({
          status: 'Success',
          message: result.message,
          departments: result.departments,
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
        message: 'Failed to retrieve departments',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }

  static async getDepartmentById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          status: 'Error',
          message: 'Department ID is required',
          timestamp: new Date().toISOString()
        });
        return;
      }

      const result = await DepartmentService.getDepartmentById(id);

      if (result.success) {
        res.status(200).json({
          status: 'Success',
          message: result.message,
          department: result.department,
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
        message: 'Failed to retrieve department',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }

  static async updateDepartment(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          status: 'Error',
          message: 'Department ID is required',
          timestamp: new Date().toISOString()
        });
        return;
      }

      const validationResult = updateDepartmentSchema.safeParse(req.body);
      
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

      const updateData: UpdateDepartmentInput = validationResult.data;
      const result = await DepartmentService.updateDepartment(id, updateData);

      if (result.success) {
        res.status(200).json({
          status: 'Success',
          message: result.message,
          department: result.department,
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
        message: 'Failed to update department',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }

  static async deleteDepartment(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          status: 'Error',
          message: 'Department ID is required',
          timestamp: new Date().toISOString()
        });
        return;
      }

      const result = await DepartmentService.deleteDepartment(id);

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
        message: 'Failed to delete department',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }
}
