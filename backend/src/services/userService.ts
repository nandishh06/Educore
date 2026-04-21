import { getSupabaseClient, isDatabaseConfigured } from '../config/database';
import { JWTUtils } from '../utils/jwt';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'principal' | 'hod' | 'teacher';
  department?: string;
  grade?: string;
  section?: string;
  subject?: string;
  phone?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
    email?: string;
  };
  employeeId?: string;
  hireDate?: string;
  isActive: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateUserInput {
  email: string;
  name: string;
  role: 'admin' | 'principal' | 'hod' | 'teacher';
  department?: string;
  grade?: string;
  section?: string;
  subject?: string;
  phone?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
    email?: string;
  };
  employeeId?: string;
  hireDate?: string;
  password: string;
}

export interface UpdateUserInput {
  name?: string;
  department?: string;
  grade?: string;
  section?: string;
  subject?: string;
  phone?: string;
  address?: string;
  emergencyContact?: {
    name?: string;
    phone?: string;
    relationship?: string;
    email?: string;
  };
  employeeId?: string;
  hireDate?: string;
  isActive?: boolean;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: 'admin' | 'principal' | 'hod' | 'teacher';
  department?: string;
  grade?: string;
  section?: string;
  isActive?: boolean;
  sortBy?: 'name' | 'email' | 'role' | 'department' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}

export interface UserResponse {
  success: boolean;
  message: string;
  data?: User[];
  total?: number;
  page?: number;
  totalPages?: number;
}

export interface UserCountResponse {
  success: boolean;
  message: string;
  data: {
    total: number;
    byRole: {
      admin: number;
      principal: number;
      hod: number;
      teacher: number;
    };
    byDepartment: Array<{
      department: string;
      count: number;
    }>;
  };
}

export class UserService {
  // Get users with filtering and pagination
  static async getUsers(params?: UserQueryParams): Promise<UserResponse> {
    try {
      if (!isDatabaseConfigured()) {
        // Mock data for testing
        const mockUsers: User[] = [
          {
            id: '1',
            email: 'admin@educore.com',
            name: 'Admin User',
            role: 'admin',
            department: 'Administration',
            isActive: true,
            created_at: new Date('2024-01-01').toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '2',
            email: 'principal@educore.com',
            name: 'Principal User',
            role: 'principal',
            department: 'Academic Affairs',
            isActive: true,
            created_at: new Date('2024-01-15').toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '3',
            email: 'hod@educore.com',
            name: 'HOD Mathematics',
            role: 'hod',
            department: 'Mathematics',
            grade: '10',
            section: 'A',
            subject: 'Mathematics',
            isActive: true,
            created_at: new Date('2024-02-01').toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '4',
            email: 'teacher@educore.com',
            name: 'Teacher User',
            role: 'teacher',
            department: 'Mathematics',
            grade: '10',
            section: 'B',
            subject: 'Mathematics',
            isActive: true,
            created_at: new Date('2024-02-15').toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '5',
            email: 'teacher2@educore.com',
            name: 'Teacher User 2',
            role: 'teacher',
            department: 'Science',
            grade: '9',
            section: 'A',
            subject: 'Science',
            isActive: true,
            created_at: new Date('2024-03-01').toISOString(),
            updated_at: new Date().toISOString()
          }
        ];

        // Apply filters
        let filteredUsers = mockUsers.filter(user => {
          if (params?.role && user.role !== params.role) return false;
          if (params?.department && user.department !== params.department) return false;
          if (params?.grade && user.grade !== params.grade) return false;
          if (params?.section && user.section !== params.section) return false;
          if (params?.isActive !== undefined && user.isActive !== params.isActive) return false;
          if (params?.search) {
            const searchLower = params.search.toLowerCase();
            return user.name.toLowerCase().includes(searchLower) ||
                   user.email.toLowerCase().includes(searchLower) ||
                   user.department?.toLowerCase().includes(searchLower);
          }
          return true;
        });

        // Apply sorting
        if (params?.sortBy) {
          filteredUsers.sort((a, b) => {
            let aValue = a[params.sortBy];
            let bValue = b[params.sortBy];
            
            if (aValue === undefined) aValue = '';
            if (bValue === undefined) bValue = '';
            
            const comparison = params.sortOrder === 'asc' 
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue);
              
            return comparison;
          });
        }

        // Apply pagination
        const page = params?.page || 1;
        const limit = params?.limit || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

        return {
          success: true,
          message: 'Users retrieved successfully',
          data: paginatedUsers,
          total: filteredUsers.length,
          page,
          totalPages: Math.ceil(filteredUsers.length / limit)
        };
      }

      // Database implementation
      const supabase = getSupabaseClient();
      let query = supabase.from('users').select('*');

      // Apply filters
      if (params?.role) {
        query = query.eq('role', params.role);
      }
      if (params?.department) {
        query = query.eq('department', params.department);
      }
      if (params?.grade) {
        query = query.eq('grade', params.grade);
      }
      if (params?.section) {
        query = query.eq('section', params.section);
      }
      if (params?.isActive !== undefined) {
        query = query.eq('isActive', params.isActive);
      }
      if (params?.search) {
        query = query.or(`name.ilike.%${params.search}%,email.ilike.%${params.search}%,department.ilike.%${params.search}%`);
      }

      // Apply sorting
      if (params?.sortBy) {
        query = query.order(params.sortBy, { ascending: params?.sortOrder === 'asc' });
      }

      // Get total count
      const { count: totalCount } = await query;

      // Apply pagination
      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const startIndex = (page - 1) * limit;
      
      const { data: users } = await query
        .range(startIndex, limit)
        .order(params?.sortBy || 'created_at', { ascending: params?.sortOrder === 'asc' });

      return {
        success: true,
        message: 'Users retrieved successfully',
        data: users,
        total: totalCount,
        page,
        totalPages: Math.ceil(totalCount / limit)
      };
    } catch (error) {
      throw error;
    }
  }

  // Get user by ID
  static async getUserById(userId: string): Promise<{ success: boolean; message: string; data?: User }> {
    try {
      if (!isDatabaseConfigured()) {
        // Mock data for testing
        const mockUsers: User[] = [
          {
            id: '1',
            email: 'admin@educore.com',
            name: 'Admin User',
            role: 'admin',
            department: 'Administration',
            isActive: true,
            created_at: new Date('2024-01-01').toISOString(),
            updated_at: new Date().toISOString()
          },
          // ... other mock users
        ];

        const user = mockUsers.find(u => u.id === userId);
        
        if (user) {
          return {
            success: true,
            message: 'User retrieved successfully',
            data: user
          };
        } else {
          return {
            success: false,
            message: 'User not found'
          };
        }
      }

      // Database implementation
      const supabase = getSupabaseClient();
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      return {
        success: true,
        message: 'User retrieved successfully',
        data: user as User
      };
    } catch (error) {
      throw error;
    }
  }

  // Create new user
  static async createUser(userData: CreateUserInput): Promise<{ success: boolean; message: string; data?: User }> {
    try {
      if (!isDatabaseConfigured()) {
        // Mock implementation for testing
        const newUser: User = {
          id: Date.now().toString(),
          email: userData.email,
          name: userData.name,
          role: userData.role,
          department: userData.department || '',
          grade: userData.grade || '',
          section: userData.section || '',
          subject: userData.subject || '',
          phone: userData.phone || '',
          address: userData.address || '',
          emergencyContact: userData.emergencyContact || {
            name: '',
            phone: '',
            relationship: '',
            email: ''
          },
          employeeId: userData.employeeId || '',
          hireDate: userData.hireDate || '',
          isActive: userData.isActive !== undefined ? userData.isActive : true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        return {
          success: true,
          message: 'User created successfully',
          data: newUser
        };
      }

      // Database implementation
      const supabase = getSupabaseClient();
      
      // Check if user with this email already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', userData.email)
        .single();

      if (existingUser) {
        return {
          success: false,
          message: 'User with this email already exists'
        };
      }

      // Create new user
      const { data: user, error } = await supabase
        .from('users')
        .insert([{
          email: userData.email,
          name: userData.name,
          role: userData.role,
          department: userData.department || null,
          grade: userData.grade || null,
          section: userData.section || null,
          subject: userData.subject || null,
          phone: userData.phone || null,
          address: userData.address || null,
          emergencyContact: userData.emergencyContact || null,
          employeeId: userData.employeeId || null,
          hireDate: userData.hireDate || null,
          isActive: userData.isActive !== undefined ? userData.isActive : true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error || !user) {
        return {
          success: false,
          message: 'Failed to create user',
          error: error.message
        };
      }

      return {
        success: true,
        message: 'User created successfully',
        data: user as User
      };
    } catch (error) {
      throw error;
    }
  }

  // Update user
  static async updateUser(userId: string, updateData: UpdateUserInput): Promise<{ success: boolean; message: string; data?: User }> {
    try {
      if (!isDatabaseConfigured()) {
        // Mock implementation for testing
        return {
          success: false,
          message: 'User update not available in demo mode'
        };
      }

      // Database implementation
      const supabase = getSupabaseClient();
      
      const { data: user, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single();

      if (error || !user) {
        return {
          success: false,
          message: 'Failed to update user',
          error: error.message
        };
      }

      return {
        success: true,
        message: 'User updated successfully',
        data: user as User
      };
    } catch (error) {
      throw error;
    }
  }

  // Delete user
  static async deleteUser(userId: string): Promise<{ success: boolean; message: string }> {
    try {
      if (!isDatabaseConfigured()) {
        // Mock implementation for testing
        return {
          success: false,
          message: 'User deletion not available in demo mode'
        };
      }

      // Database implementation
      const supabase = getSupabaseClient();
      
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) {
        return {
          success: false,
          message: 'Failed to delete user',
          error: error.message
        };
      }

      return {
        success: true,
        message: 'User deleted successfully'
      };
    } catch (error) {
      throw error;
    }
  }

  // Get user counts by role and department
  static async getUserCounts(): Promise<UserCountResponse> {
    try {
      if (!isDatabaseConfigured()) {
        // Mock data for testing
        return {
          success: true,
          message: 'User counts retrieved successfully',
          data: {
            total: 5,
            byRole: {
              admin: 1,
              principal: 1,
              hod: 1,
              teacher: 2
            },
            byDepartment: [
              { department: 'Administration', count: 1 },
              { department: 'Academic Affairs', count: 1 },
              { department: 'Mathematics', count: 2 },
              { department: 'Science', count: 1 },
              { department: 'English', count: 1 }
            ]
          }
        };
      }

      // Database implementation
      const supabase = getSupabaseClient();
      
      // Get total users by role
      const { data: users } = await supabase.from('users').select('role');
      const roleCounts = users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Get users by department
      const { data: deptUsers } = await supabase.from('users').select('department');
      const deptCounts = deptUsers.reduce((acc, user) => {
        if (user.department) {
          acc[user.department] = (acc[user.department] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      return {
        success: true,
        message: 'User counts retrieved successfully',
        data: {
          total: users.length,
          byRole: roleCounts,
          byDepartment: Object.entries(deptCounts).map(([dept, count]) => ({ department: dept, count }))
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Get users by department
  static async getUsersByDepartment(department: string): Promise<User[]> {
    try {
      if (!isDatabaseConfigured()) {
        // Mock data for testing
        const mockUsers: User[] = [
          {
            id: '3',
            email: 'hod@educore.com',
            name: 'HOD Mathematics',
            role: 'hod',
            department: 'Mathematics',
            grade: '10',
            section: 'A',
            subject: 'Mathematics',
            isActive: true,
            created_at: new Date('2024-02-01').toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '4',
            email: 'teacher@educore.com',
            name: 'Teacher User',
            role: 'teacher',
            department: 'Mathematics',
            grade: '10',
            section: 'B',
            subject: 'Mathematics',
            isActive: true,
            created_at: new Date('2024-02-15').toISOString(),
            updated_at: new Date().toISOString()
          }
        ];

        return mockUsers.filter(user => user.department === department);
      }

      // Database implementation
      const supabase = getSupabaseClient();
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('department', department)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return users || [];
    } catch (error) {
      throw error;
    }
  }
}
