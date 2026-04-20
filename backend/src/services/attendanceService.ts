import { getSupabaseClient, isDatabaseConfigured } from '../config/database';
import { CreateAttendanceInput, UpdateAttendanceInput, GetAttendanceInput, BulkAttendanceInput, Attendance } from '../validations/attendanceValidation';

export interface AttendanceResponse {
  success: boolean;
  message: string;
  attendance?: Attendance;
  attendances?: Attendance[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  statistics?: any;
  error?: string | undefined;
}

export class AttendanceService {
  static async createAttendance(attendanceData: CreateAttendanceInput): Promise<AttendanceResponse> {
    if (!isDatabaseConfigured()) {
      return {
        success: false,
        message: 'Database not configured. Please configure Supabase to enable attendance management.'
      };
    }

    try {
      const supabase = getSupabaseClient()!;

      // Check if attendance already exists for this student on this date
      const { data: existingAttendance } = await supabase
        .from('attendance')
        .select('id')
        .eq('studentId', attendanceData.studentId)
        .eq('date', attendanceData.date)
        .single();

      if (existingAttendance) {
        return {
          success: false,
          message: 'Attendance already marked for this student on this date'
        };
      }

      // Create attendance
      const { data: attendance, error } = await supabase
        .from('attendance')
        .insert(attendanceData)
        .select()
        .single();

      if (error || !attendance) {
        return {
          success: false,
          message: 'Failed to create attendance',
          error: error?.message
        };
      }

      return {
        success: true,
        message: 'Attendance marked successfully',
        attendance: attendance as Attendance
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create attendance'
      };
    }
  }

  static async bulkCreateAttendance(bulkData: BulkAttendanceInput): Promise<AttendanceResponse> {
    if (!isDatabaseConfigured()) {
      return {
        success: false,
        message: 'Database not configured. Please configure Supabase to enable attendance management.'
      };
    }

    try {
      const supabase = getSupabaseClient()!;

      const attendanceRecords = bulkData.attendances.map(record => ({
        studentId: record.studentId,
        date: bulkData.date,
        status: record.status,
        remarks: record.remarks,
        markedBy: bulkData.markedBy,
        subject: bulkData.subject,
        period: bulkData.period
      }));

      // Create bulk attendance
      const { data: attendances, error } = await supabase
        .from('attendance')
        .insert(attendanceRecords)
        .select();

      if (error) {
        return {
          success: false,
          message: 'Failed to create bulk attendance',
          error: error.message
        };
      }

      return {
        success: true,
        message: `Successfully marked attendance for ${attendances?.length || 0} students`,
        attendances: attendances as Attendance[]
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create bulk attendance'
      };
    }
  }

  static async getAttendance(params: GetAttendanceInput): Promise<AttendanceResponse> {
    if (!isDatabaseConfigured()) {
      return {
        success: false,
        message: 'Database not configured. Please configure Supabase to enable attendance management.'
      };
    }

    try {
      const supabase = getSupabaseClient()!;
      
      let query = supabase
        .from('attendance')
        .select('*', { count: 'exact' });

      // Apply filters
      if (params.studentId) {
        query = query.eq('studentId', params.studentId);
      }

      if (params.date) {
        query = query.eq('date', params.date);
      }

      if (params.status) {
        query = query.eq('status', params.status);
      }

      if (params.startDate && params.endDate) {
        query = query.gte('date', params.startDate).lte('date', params.endDate);
      }

      // Apply sorting
      const sortColumn = params.sortBy === 'date' ? 'date' : 
                        params.sortBy === 'studentId' ? 'studentId' : 'status';
      
      query = query.order(sortColumn, { ascending: params.sortOrder === 'asc' });

      // Apply pagination
      const offset = (params.page - 1) * params.limit;
      query = query.range(offset, offset + params.limit - 1);

      const { data: attendances, error, count } = await query;

      if (error) {
        return {
          success: false,
          message: 'Failed to retrieve attendance',
          error: error.message
        };
      }

      const total = count || 0;
      const totalPages = Math.ceil(total / params.limit);

      return {
        success: true,
        message: 'Attendance retrieved successfully',
        attendances: attendances as Attendance[],
        pagination: {
          page: params.page,
          limit: params.limit,
          total,
          totalPages
        }
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to retrieve attendance'
      };
    }
  }

  static async getAttendanceById(id: string): Promise<AttendanceResponse> {
    if (!isDatabaseConfigured()) {
      return {
        success: false,
        message: 'Database not configured. Please configure Supabase to enable attendance management.'
      };
    }

    try {
      const supabase = getSupabaseClient()!;

      const { data: attendance, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !attendance) {
        return {
          success: false,
          message: 'Attendance record not found'
        };
      }

      return {
        success: true,
        message: 'Attendance retrieved successfully',
        attendance: attendance as Attendance
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to retrieve attendance'
      };
    }
  }

  static async updateAttendance(id: string, updateData: UpdateAttendanceInput): Promise<AttendanceResponse> {
    if (!isDatabaseConfigured()) {
      return {
        success: false,
        message: 'Database not configured. Please configure Supabase to enable attendance management.'
      };
    }

    try {
      const supabase = getSupabaseClient()!;

      // Check if attendance exists
      const { data: existingAttendance } = await supabase
        .from('attendance')
        .select('id')
        .eq('id', id)
        .single();

      if (!existingAttendance) {
        return {
          success: false,
          message: 'Attendance record not found'
        };
      }

      // Update attendance
      const { data: attendance, error } = await supabase
        .from('attendance')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error || !attendance) {
        return {
          success: false,
          message: 'Failed to update attendance',
          error: error?.message
        };
      }

      return {
        success: true,
        message: 'Attendance updated successfully',
        attendance: attendance as Attendance
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update attendance'
      };
    }
  }

  static async deleteAttendance(id: string): Promise<AttendanceResponse> {
    if (!isDatabaseConfigured()) {
      return {
        success: false,
        message: 'Database not configured. Please configure Supabase to enable attendance management.'
      };
    }

    try {
      const supabase = getSupabaseClient()!;

      // Check if attendance exists
      const { data: existingAttendance } = await supabase
        .from('attendance')
        .select('id')
        .eq('id', id)
        .single();

      if (!existingAttendance) {
        return {
          success: false,
          message: 'Attendance record not found'
        };
      }

      // Delete attendance
      const { error } = await supabase
        .from('attendance')
        .delete()
        .eq('id', id);

      if (error) {
        return {
          success: false,
          message: 'Failed to delete attendance',
          error: error.message
        };
      }

      return {
        success: true,
        message: 'Attendance deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete attendance'
      };
    }
  }

  static async getAttendanceStatistics(studentId?: string, startDate?: string, endDate?: string): Promise<AttendanceResponse> {
    if (!isDatabaseConfigured()) {
      return {
        success: false,
        message: 'Database not configured. Please configure Supabase to enable attendance management.'
      };
    }

    try {
      const supabase = getSupabaseClient()!;

      let query = supabase
        .from('attendance')
        .select('status');

      if (studentId) {
        query = query.eq('studentId', studentId);
      }

      if (startDate && endDate) {
        query = query.gte('date', startDate).lte('date', endDate);
      }

      const { data: attendanceRecords, error } = await query;

      if (error) {
        return {
          success: false,
          message: 'Failed to retrieve attendance statistics',
          error: error.message
        };
      }

      // Calculate statistics
      const stats = {
        total: attendanceRecords?.length || 0,
        present: attendanceRecords?.filter(record => record.status === 'present').length || 0,
        absent: attendanceRecords?.filter(record => record.status === 'absent').length || 0,
        late: attendanceRecords?.filter(record => record.status === 'late').length || 0,
        excused: attendanceRecords?.filter(record => record.status === 'excused').length || 0,
        attendanceRate: 0
      };

      if (stats.total > 0) {
        stats.attendanceRate = ((stats.present + stats.late + stats.excused) / stats.total) * 100;
      }

      return {
        success: true,
        message: 'Attendance statistics retrieved successfully',
        statistics: stats
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to retrieve attendance statistics'
      };
    }
  }
}
