import { Request, Response } from 'express';
import { DatabaseService } from '../services/databaseService';

export class DatabaseController {
  static async testConnection(_req: Request, res: Response): Promise<void> {
    try {
      const result = await DatabaseService.testConnection();
      
      if (result.success) {
        res.status(200).json({
          status: 'OK',
          message: result.message,
          data: result.data,
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(500).json({
          status: 'Error',
          message: result.message,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 'Error',
        message: 'Database test failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }

  static async checkTables(_req: Request, res: Response): Promise<void> {
    try {
      const result = await DatabaseService.checkTables();
      
      if (result.success) {
        res.status(200).json({
          status: 'OK',
          message: result.message,
          tables: result.tables,
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(500).json({
          status: 'Error',
          message: result.message,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 'Error',
        message: 'Failed to check tables',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }
}
