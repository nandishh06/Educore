import { getSupabaseClient, isDatabaseConfigured } from '../config/database';
import { CreateStudentInput, UpdateStudentInput, GetStudentsInput, Student } from '../validations/studentValidation';

export interface StudentResponse {
  success: boolean;
  message: string;
  student?: Student;
  students?: Student[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string | undefined;
}

export class StudentService {
  static async createStudent(studentData: CreateStudentInput): Promise<StudentResponse> {
    if (!isDatabaseConfigured()) {
      return {
        success: false,
        message: 'Database not configured. Please configure Supabase to enable student management.'
      };
    }

    try {
      const supabase = getSupabaseClient()!;

      // Check if student with same email or roll number already exists
      const { data: existingStudent } = await supabase
        .from('students')
        .select('id')
        .or(`email.eq.${studentData.email},academicInfo->>rollNumber.eq.${studentData.academicInfo.rollNumber}`)
        .single();

      if (existingStudent) {
        return {
          success: false,
          message: 'Student with this email or roll number already exists'
        };
      }

      // Create student
      const { data: student, error } = await supabase
        .from('students')
        .insert({
          ...studentData,
          isActive: true
        })
        .select()
        .single();

      if (error || !student) {
        return {
          success: false,
          message: 'Failed to create student',
          error: error?.message
        };
      }

      return {
        success: true,
        message: 'Student created successfully',
        student: student as Student
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create student'
      };
    }
  }

  static async getStudents(params: GetStudentsInput): Promise<StudentResponse> {
    if (!isDatabaseConfigured()) {
      return {
        success: false,
        message: 'Database not configured. Please configure Supabase to enable student management.'
      };
    }

    try {
      const supabase = getSupabaseClient()!;
      
      let query = supabase
        .from('students')
        .select('*', { count: 'exact' });

      // Apply filters
      if (params.search) {
        query = query.or(`firstName.ilike.%${params.search}%,lastName.ilike.%${params.search}%,email.ilike.%${params.search}%`);
      }

      if (params.grade) {
        query = query.eq('academicInfo->>grade', params.grade);
      }

      if (params.section) {
        query = query.eq('academicInfo->>section', params.section);
      }

      if (params.departmentId) {
        query = query.eq('academicInfo->>departmentId', params.departmentId);
      }

      // Apply sorting
      const sortColumn = params.sortBy === 'firstName' ? 'firstName' : 
                        params.sortBy === 'lastName' ? 'lastName' : 
                        params.sortBy === 'rollNumber' ? 'academicInfo->>rollNumber' : 
                        'academicInfo->>admissionDate';
      
      query = query.order(sortColumn, { ascending: params.sortOrder === 'asc' });

      // Apply pagination
      const offset = (params.page - 1) * params.limit;
      query = query.range(offset, offset + params.limit - 1);

      const { data: students, error, count } = await query;

      if (error) {
        return {
          success: false,
          message: 'Failed to retrieve students',
          error: error.message
        };
      }

      const total = count || 0;
      const totalPages = Math.ceil(total / params.limit);

      return {
        success: true,
        message: 'Students retrieved successfully',
        students: students as Student[],
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
        message: error instanceof Error ? error.message : 'Failed to retrieve students'
      };
    }
  }

  static async getStudentById(id: string): Promise<StudentResponse> {
    if (!isDatabaseConfigured()) {
      return {
        success: false,
        message: 'Database not configured. Please configure Supabase to enable student management.'
      };
    }

    try {
      const supabase = getSupabaseClient()!;

      const { data: student, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !student) {
        return {
          success: false,
          message: 'Student not found'
        };
      }

      return {
        success: true,
        message: 'Student retrieved successfully',
        student: student as Student
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to retrieve student'
      };
    }
  }

  static async updateStudent(id: string, updateData: UpdateStudentInput): Promise<StudentResponse> {
    if (!isDatabaseConfigured()) {
      return {
        success: false,
        message: 'Database not configured. Please configure Supabase to enable student management.'
      };
    }

    try {
      const supabase = getSupabaseClient()!;

      // Check if student exists
      const { data: existingStudent } = await supabase
        .from('students')
        .select('id')
        .eq('id', id)
        .single();

      if (!existingStudent) {
        return {
          success: false,
          message: 'Student not found'
        };
      }

      // Check for duplicate email or roll number if they are being updated
      if (updateData.email || updateData.academicInfo?.rollNumber) {
        let duplicateCheck = supabase.from('students').select('id').neq('id', id);
        
        if (updateData.email) {
          duplicateCheck = duplicateCheck.eq('email', updateData.email);
        }
        if (updateData.academicInfo?.rollNumber) {
          duplicateCheck = duplicateCheck.eq('academicInfo->>rollNumber', updateData.academicInfo.rollNumber);
        }

        const { data: duplicate } = await duplicateCheck.single();
        
        if (duplicate) {
          return {
            success: false,
            message: 'Another student with this email or roll number already exists'
          };
        }
      }

      // Update student
      const { data: student, error } = await supabase
        .from('students')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error || !student) {
        return {
          success: false,
          message: 'Failed to update student',
          error: error?.message
        };
      }

      return {
        success: true,
        message: 'Student updated successfully',
        student: student as Student
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update student'
      };
    }
  }

  static async deleteStudent(id: string): Promise<StudentResponse> {
    if (!isDatabaseConfigured()) {
      return {
        success: false,
        message: 'Database not configured. Please configure Supabase to enable student management.'
      };
    }

    try {
      const supabase = getSupabaseClient()!;

      // Check if student exists
      const { data: existingStudent } = await supabase
        .from('students')
        .select('id')
        .eq('id', id)
        .single();

      if (!existingStudent) {
        return {
          success: false,
          message: 'Student not found'
        };
      }

      // Soft delete by setting isActive to false
      const { error } = await supabase
        .from('students')
        .update({ isActive: false })
        .eq('id', id);

      if (error) {
        return {
          success: false,
          message: 'Failed to delete student',
          error: error.message
        };
      }

      return {
        success: true,
        message: 'Student deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete student'
      };
    }
  }

  static async getStudentStats(): Promise<{ success: boolean; message: string; stats?: any }> {
    if (!isDatabaseConfigured()) {
      return {
        success: false,
        message: 'Database not configured. Please configure Supabase to enable student management.'
      };
    }

    try {
      const supabase = getSupabaseClient()!;

      // Get total students count
      const { count: totalStudents } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })
        .eq('isActive', true);

      // Get students by grade
      const { data: gradeStats } = await supabase
        .from('students')
        .select('academicInfo->>grade')
        .eq('isActive', true);

      // Count by grade
      const gradeCounts: Record<string, number> = {};
      gradeStats?.forEach((student: any) => {
        const grade = student.academicInfo?.grade;
        if (grade) {
          gradeCounts[grade] = (gradeCounts[grade] || 0) + 1;
        }
      });

      // Get gender distribution
      const { data: genderStats } = await supabase
        .from('students')
        .select('gender')
        .eq('isActive', true);

      const genderCounts: Record<string, number> = {};
      genderStats?.forEach((student: any) => {
        const gender = student.gender;
        if (gender) {
          genderCounts[gender] = (genderCounts[gender] || 0) + 1;
        }
      });

      return {
        success: true,
        message: 'Student statistics retrieved successfully',
        stats: {
          totalStudents: totalStudents || 0,
          gradeDistribution: gradeCounts,
          genderDistribution: genderCounts
        }
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to retrieve student statistics'
      };
    }
  }
}
