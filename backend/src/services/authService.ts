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

// Mock users for development / when DB is not configured
const MOCK_USERS: Array<{ email: string; password: string; id: string; name: string; role: string }> = [
  { id: '1', email: 'admin@educore.com',     password: 'admin123',     name: 'Admin User',      role: 'admin'      },
  { id: '2', email: 'principal@educore.com', password: 'principal123', name: 'Principal User',  role: 'principal'  },
  { id: '3', email: 'hod@educore.com',       password: 'hod123',       name: 'HOD Mathematics', role: 'hod'        },
  { id: '4', email: 'teacher@educore.com',   password: 'teacher123',   name: 'Teacher User',    role: 'teacher'    },
  { id: '5', email: 'student@educore.com',   password: 'student123',   name: 'Student User',    role: 'student'    },
  { id: '6', email: 'parent@educore.com',    password: 'parent123',    name: 'Parent User',     role: 'parent'     },
];

function mockLogin(credentials: LoginInput): AuthResponse {
  const match = MOCK_USERS.find(
    u => u.email === credentials.email && u.password === credentials.password
  );

  if (!match) {
    return { success: false, message: 'Invalid email or password' };
  }

  const mockUser = {
    id: match.id,
    email: match.email,
    name: match.name,
    role: match.role,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const token = JWTUtils.generateToken({
    userId: mockUser.id,
    email: mockUser.email,
    name: mockUser.name,
    role: mockUser.role
  });

  return { success: true, message: 'Login successful', user: mockUser, token };
}

export class AuthService {
  static async login(credentials: LoginInput): Promise<AuthResponse> {
    // Use mock auth if DB is not properly configured
    if (!isDatabaseConfigured()) {
      return mockLogin(credentials);
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
        return { success: false, message: 'Invalid email or password' };
      }

      // Compare password
      const isPasswordValid = await JWTUtils.comparePassword(credentials.password, user.password);

      if (!isPasswordValid) {
        return { success: false, message: 'Invalid email or password' };
      }

      // Generate JWT token
      const payload: JWTPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      };

      const token = JWTUtils.generateToken(payload);
      const { password, ...userWithoutPassword } = user;

      return { success: true, message: 'Login successful', user: userWithoutPassword, token };
    } catch (error) {
      console.error('[AuthService] DB query failed:', error);
      // Only fall back to mock auth in development
      if (process.env['NODE_ENV'] !== 'production') {
        console.warn('[AuthService] Falling back to mock auth (dev only)');
        return mockLogin(credentials);
      }
      return { success: false, message: 'Invalid email or password' };
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
