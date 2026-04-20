import { getSupabaseClient, isDatabaseConfigured } from '../config/database';
import { CreateTeacherInput, UpdateTeacherInput, GetTeachersInput, Teacher } from '../validations/teacherValidation';

export interface TeacherResponse {
  success: boolean;
  message: string;
  teacher?: Teacher;
  teachers?: Teacher[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string | undefined;
}

export class TeacherService {
  static async createTeacher(teacherData: CreateTeacherInput): Promise<TeacherResponse> {
    if (!isDatabaseConfigured()) {
      return {
        success: false,
        message: 'Database not configured. Please configure Supabase to enable teacher management.'
      };
    }

    try {
      const supabase = getSupabaseClient()!;

      // Check if teacher with same email or employee ID already exists
      const { data: existingTeacher } = await supabase
        .from('teachers')
        .select('id')
        .or(`email.eq.${teacherData.email},employmentInfo->>employeeId.eq.${teacherData.employmentInfo.employeeId}`)
        .single();

      if (existingTeacher) {
        return {
          success: false,
          message: 'Teacher with this email or employee ID already exists'
        };
      }

      // Create teacher
      const { data: teacher, error } = await supabase
        .from('teachers')
        .insert({
          ...teacherData,
          isActive: true
        })
        .select()
        .single();

      if (error || !teacher) {
        return {
          success: false,
          message: 'Failed to create teacher',
          error: error?.message
        };
      }

      return {
        success: true,
        message: 'Teacher created successfully',
        teacher: teacher as Teacher
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create teacher'
      };
    }
  }

  static async getTeachers(params: GetTeachersInput): Promise<TeacherResponse> {
    if (!isDatabaseConfigured()) {
      return {
        success: false,
        message: 'Database not configured. Please configure Supabase to enable teacher management.'
      };
    }

    try {
      const supabase = getSupabaseClient()!;
      
      let query = supabase
        .from('teachers')
        .select('*', { count: 'exact' });

      // Apply filters
      if (params.search) {
        query = query.or(`firstName.ilike.%${params.search}%,lastName.ilike.%${params.search}%,email.ilike.%${params.search}%`);
      }

      if (params.departmentId) {
        query = query.eq('employmentInfo->>departmentId', params.departmentId);
      }

      if (params.designation) {
        query = query.eq('employmentInfo->>designation', params.designation);
      }

      if (params.employmentType) {
        query = query.eq('employmentInfo->>employmentType', params.employmentType);
      }

      // Apply sorting
      const sortColumn = params.sortBy === 'firstName' ? 'firstName' : 
                        params.sortBy === 'lastName' ? 'lastName' : 
                        params.sortBy === 'employeeId' ? 'employmentInfo->>employeeId' : 
                        'employmentInfo->>joiningDate';
      
      query = query.order(sortColumn, { ascending: params.sortOrder === 'asc' });

      // Apply pagination
      const offset = (params.page - 1) * params.limit;
      query = query.range(offset, offset + params.limit - 1);

      const { data: teachers, error, count } = await query;

      if (error) {
        return {
          success: false,
          message: 'Failed to retrieve teachers',
          error: error.message
        };
      }

      const total = count || 0;
      const totalPages = Math.ceil(total / params.limit);

      return {
        success: true,
        message: 'Teachers retrieved successfully',
        teachers: teachers as Teacher[],
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
        message: error instanceof Error ? error.message : 'Failed to retrieve teachers'
      };
    }
  }

  static async getTeacherById(id: string): Promise<TeacherResponse> {
    if (!isDatabaseConfigured()) {
      return {
        success: false,
        message: 'Database not configured. Please configure Supabase to enable teacher management.'
      };
    }

    try {
      const supabase = getSupabaseClient()!;

      const { data: teacher, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !teacher) {
        return {
          success: false,
          message: 'Teacher not found'
        };
      }

      return {
        success: true,
        message: 'Teacher retrieved successfully',
        teacher: teacher as Teacher
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to retrieve teacher'
      };
    }
  }

  static async updateTeacher(id: string, updateData: UpdateTeacherInput): Promise<TeacherResponse> {
    if (!isDatabaseConfigured()) {
      return {
        success: false,
        message: 'Database not configured. Please configure Supabase to enable teacher management.'
      };
    }

    try {
      const supabase = getSupabaseClient()!;

      // Check if teacher exists
      const { data: existingTeacher } = await supabase
        .from('teachers')
        .select('id')
        .eq('id', id)
        .single();

      if (!existingTeacher) {
        return {
          success: false,
          message: 'Teacher not found'
        };
      }

      // Check for duplicate email or employee ID if they are being updated
      if (updateData.email || updateData.employmentInfo?.employeeId) {
        let duplicateCheck = supabase.from('teachers').select('id').neq('id', id);
        
        if (updateData.email) {
          duplicateCheck = duplicateCheck.eq('email', updateData.email);
        }
        if (updateData.employmentInfo?.employeeId) {
          duplicateCheck = duplicateCheck.eq('employmentInfo->>employeeId', updateData.employmentInfo.employeeId);
        }

        const { data: duplicate } = await duplicateCheck.single();
        
        if (duplicate) {
          return {
            success: false,
            message: 'Another teacher with this email or employee ID already exists'
          };
        }
      }

      // Update teacher
      const { data: teacher, error } = await supabase
        .from('teachers')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error || !teacher) {
        return {
          success: false,
          message: 'Failed to update teacher',
          error: error?.message
        };
      }

      return {
        success: true,
        message: 'Teacher updated successfully',
        teacher: teacher as Teacher
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update teacher'
      };
    }
  }

  static async deleteTeacher(id: string): Promise<TeacherResponse> {
    if (!isDatabaseConfigured()) {
      return {
        success: false,
        message: 'Database not configured. Please configure Supabase to enable teacher management.'
      };
    }

    try {
      const supabase = getSupabaseClient()!;

      // Check if teacher exists
      const { data: existingTeacher } = await supabase
        .from('teachers')
        .select('id')
        .eq('id', id)
        .single();

      if (!existingTeacher) {
        return {
          success: false,
          message: 'Teacher not found'
        };
      }

      // Soft delete by setting isActive to false
      const { error } = await supabase
        .from('teachers')
        .update({ isActive: false })
        .eq('id', id);

      if (error) {
        return {
          success: false,
          message: 'Failed to delete teacher',
          error: error.message
        };
      }

      return {
        success: true,
        message: 'Teacher deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete teacher'
      };
    }
  }
}
