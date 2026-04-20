import { getSupabaseClient, isDatabaseConfigured } from '../config/database';
import { CreateDepartmentInput, UpdateDepartmentInput, GetDepartmentsInput, Department } from '../validations/departmentValidation';

export interface DepartmentResponse {
  success: boolean;
  message: string;
  department?: Department;
  departments?: Department[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string | undefined;
}

export class DepartmentService {
  static async createDepartment(departmentData: CreateDepartmentInput): Promise<DepartmentResponse> {
    if (!isDatabaseConfigured()) {
      return {
        success: false,
        message: 'Database not configured. Please configure Supabase to enable department management.'
      };
    }

    try {
      const supabase = getSupabaseClient()!;

      // Check if department with same name or code already exists
      const { data: existingDepartment } = await supabase
        .from('departments')
        .select('id')
        .or(`name.eq.${departmentData.name},code.eq.${departmentData.code}`)
        .single();

      if (existingDepartment) {
        return {
          success: false,
          message: 'Department with this name or code already exists'
        };
      }

      // Create department
      const { data: department, error } = await supabase
        .from('departments')
        .insert(departmentData)
        .select()
        .single();

      if (error || !department) {
        return {
          success: false,
          message: 'Failed to create department',
          error: error?.message
        };
      }

      return {
        success: true,
        message: 'Department created successfully',
        department: department as Department
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create department'
      };
    }
  }

  static async getDepartments(params: GetDepartmentsInput): Promise<DepartmentResponse> {
    if (!isDatabaseConfigured()) {
      return {
        success: false,
        message: 'Database not configured. Please configure Supabase to enable department management.'
      };
    }

    try {
      const supabase = getSupabaseClient()!;
      
      let query = supabase
        .from('departments')
        .select('*', { count: 'exact' });

      // Apply filters
      if (params.search) {
        query = query.or(`name.ilike.%${params.search}%,code.ilike.%${params.search}%,description.ilike.%${params.search}%`);
      }

      if (params.isActive !== undefined) {
        query = query.eq('isActive', params.isActive);
      }

      // Apply sorting
      const sortColumn = params.sortBy === 'name' ? 'name' : 
                        params.sortBy === 'code' ? 'code' : 'establishedYear';
      
      query = query.order(sortColumn, { ascending: params.sortOrder === 'asc' });

      // Apply pagination
      const offset = (params.page - 1) * params.limit;
      query = query.range(offset, offset + params.limit - 1);

      const { data: departments, error, count } = await query;

      if (error) {
        return {
          success: false,
          message: 'Failed to retrieve departments',
          error: error.message
        };
      }

      const total = count || 0;
      const totalPages = Math.ceil(total / params.limit);

      return {
        success: true,
        message: 'Departments retrieved successfully',
        departments: departments as Department[],
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
        message: error instanceof Error ? error.message : 'Failed to retrieve departments'
      };
    }
  }

  static async getDepartmentById(id: string): Promise<DepartmentResponse> {
    if (!isDatabaseConfigured()) {
      return {
        success: false,
        message: 'Database not configured. Please configure Supabase to enable department management.'
      };
    }

    try {
      const supabase = getSupabaseClient()!;

      const { data: department, error } = await supabase
        .from('departments')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !department) {
        return {
          success: false,
          message: 'Department not found'
        };
      }

      return {
        success: true,
        message: 'Department retrieved successfully',
        department: department as Department
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to retrieve department'
      };
    }
  }

  static async updateDepartment(id: string, updateData: UpdateDepartmentInput): Promise<DepartmentResponse> {
    if (!isDatabaseConfigured()) {
      return {
        success: false,
        message: 'Database not configured. Please configure Supabase to enable department management.'
      };
    }

    try {
      const supabase = getSupabaseClient()!;

      // Check if department exists
      const { data: existingDepartment } = await supabase
        .from('departments')
        .select('id')
        .eq('id', id)
        .single();

      if (!existingDepartment) {
        return {
          success: false,
          message: 'Department not found'
        };
      }

      // Check for duplicate name or code if they are being updated
      if (updateData.name || updateData.code) {
        let duplicateCheck = supabase.from('departments').select('id').neq('id', id);
        
        if (updateData.name) {
          duplicateCheck = duplicateCheck.eq('name', updateData.name);
        }
        if (updateData.code) {
          duplicateCheck = duplicateCheck.eq('code', updateData.code);
        }

        const { data: duplicate } = await duplicateCheck.single();
        
        if (duplicate) {
          return {
            success: false,
            message: 'Another department with this name or code already exists'
          };
        }
      }

      // Update department
      const { data: department, error } = await supabase
        .from('departments')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error || !department) {
        return {
          success: false,
          message: 'Failed to update department',
          error: error?.message
        };
      }

      return {
        success: true,
        message: 'Department updated successfully',
        department: department as Department
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update department'
      };
    }
  }

  static async deleteDepartment(id: string): Promise<DepartmentResponse> {
    if (!isDatabaseConfigured()) {
      return {
        success: false,
        message: 'Database not configured. Please configure Supabase to enable department management.'
      };
    }

    try {
      const supabase = getSupabaseClient()!;

      // Check if department exists
      const { data: existingDepartment } = await supabase
        .from('departments')
        .select('id')
        .eq('id', id)
        .single();

      if (!existingDepartment) {
        return {
          success: false,
          message: 'Department not found'
        };
      }

      // Soft delete by setting isActive to false
      const { error } = await supabase
        .from('departments')
        .update({ isActive: false })
        .eq('id', id);

      if (error) {
        return {
          success: false,
          message: 'Failed to delete department',
          error: error.message
        };
      }

      return {
        success: true,
        message: 'Department deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete department'
      };
    }
  }
}
