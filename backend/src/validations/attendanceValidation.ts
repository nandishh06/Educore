import { z } from 'zod';

export const createAttendanceSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  date: z.string().refine((date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  }, 'Invalid date format'),
  status: z.enum(['present', 'absent', 'late', 'excused']),
  remarks: z.string().optional(),
  markedBy: z.string().uuid('Invalid teacher ID'),
  subject: z.string().optional(),
  period: z.number().min(1).max(10).optional()
});

export const updateAttendanceSchema = createAttendanceSchema.partial();

export const getAttendanceSchema = z.object({
  page: z.string().regex(/^\d+$/, 'Page must be a positive integer').transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/, 'Limit must be a positive integer').transform(Number).default('10'),
  studentId: z.string().uuid().optional(),
  date: z.string().optional(),
  status: z.enum(['present', 'absent', 'late', 'excused']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sortBy: z.enum(['date', 'studentId', 'status']).default('date'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

export const bulkAttendanceSchema = z.object({
  date: z.string().refine((date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  }, 'Invalid date format'),
  attendances: z.array(z.object({
    studentId: z.string().uuid('Invalid student ID'),
    status: z.enum(['present', 'absent', 'late', 'excused']),
    remarks: z.string().optional()
  })).min(1, 'At least one attendance record is required'),
  markedBy: z.string().uuid('Invalid teacher ID'),
  subject: z.string().optional(),
  period: z.number().min(1).max(10).optional()
});

export type CreateAttendanceInput = z.infer<typeof createAttendanceSchema>;
export type UpdateAttendanceInput = z.infer<typeof updateAttendanceSchema>;
export type GetAttendanceInput = z.infer<typeof getAttendanceSchema>;
export type BulkAttendanceInput = z.infer<typeof bulkAttendanceSchema>;

export interface Attendance {
  id: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  remarks?: string;
  markedBy: string;
  subject?: string;
  period?: number;
  created_at: string;
  updated_at: string;
}
