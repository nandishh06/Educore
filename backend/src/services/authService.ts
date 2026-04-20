import { getSupabaseClient, isDatabaseConfigured } from '../config/database';
import { JWTUtils, JWTPayload } from '../utils/jwt';
import { LoginInput, RegisterInput } from '../validations/authValidation';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  password: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: Omit<User, 'password'>;
  token?: string;
}

export class AuthService {
  static async login(credentials: LoginInput): Promise<AuthResponse> {
    // Temporarily bypass database check for testing
    if (!isDatabaseConfigured()) {
      // Mock authentication for testing - password optional
      if (credentials.email === 'admin@educore.com' && (!credentials.password || credentials.password === 'admin123')) {
        const mockUser = {
          id: '1',
          email: 'admin@educore.com',
          name: 'Admin User',
          role: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        const token = JWTUtils.generateToken({
          userId: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          role: mockUser.role
        });
        
        return {
          success: true,
          message: 'Login successful',
          user: mockUser,
          token
        };
      }
      
      return {
        success: false,
        message: 'Invalid email or password'
      };
    }

    try {
      const supabase = getSupabaseClient()!;

      // Find user by email
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', credentials.email)
        .single();

      if (error || !user) {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }

      // Compare password
      const isPasswordValid = await JWTUtils.comparePassword(credentials.password, user.password);
      
      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }

      // Generate JWT token
      const payload: JWTPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      };

      const token = JWTUtils.generateToken(payload);

      // Remove password from user object
      const { password, ...userWithoutPassword } = user;

      return {
        success: true,
        message: 'Login successful',
        user: userWithoutPassword,
        token
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Login failed'
      };
    }
  }

  static async register(userData: RegisterInput): Promise<AuthResponse> {
    if (!isDatabaseConfigured()) {
      return {
        success: false,
        message: 'Database not configured. Please configure Supabase to enable authentication.'
      };
    }

    try {
      const supabase = getSupabaseClient()!;

      // Check if user already exists
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

      // Hash password
      const hashedPassword = await JWTUtils.hashPassword(userData.password);

      // Create user
      const { data: user, error } = await supabase
        .from('users')
        .insert({
          email: userData.email,
          name: userData.name,
          role: userData.role,
          password: hashedPassword
        })
        .select()
        .single();

      if (error || !user) {
        return {
          success: false,
          message: 'Failed to create user'
        };
      }

      // Generate JWT token
      const payload: JWTPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      };

      const token = JWTUtils.generateToken(payload);

      // Remove password from user object
      const { password, ...userWithoutPassword } = user;

      return {
        success: true,
        message: 'Registration successful',
        user: userWithoutPassword,
        token
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Registration failed'
      };
    }
  }

  static async verifyToken(token: string): Promise<{ success: boolean; user?: JWTPayload; message: string }> {
    try {
      const payload = JWTUtils.verifyToken(token);
      
      return {
        success: true,
        user: payload,
        message: 'Token is valid'
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Token verification failed'
      };
    }
  }
}
