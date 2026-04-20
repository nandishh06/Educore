import { z } from 'zod';

export const createTeacherSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters long').max(50, 'First name must not exceed 50 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters long').max(50, 'Last name must not exceed 50 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number format').optional(),
  dateOfBirth: z.string().refine((date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime()) && parsedDate < new Date();
  }, 'Invalid date of birth'),
  gender: z.enum(['male', 'female', 'other']),
  address: z.object({
    street: z.string().min(5, 'Street address must be at least 5 characters long'),
    city: z.string().min(2, 'City must be at least 2 characters long'),
    state: z.string().min(2, 'State must be at least 2 characters long'),
    postalCode: z.string().regex(/^\d+$/, 'Postal code must contain only digits'),
    country: z.string().min(2, 'Country must be at least 2 characters long')
  }),
  employmentInfo: z.object({
    employeeId: z.string().min(1, 'Employee ID is required'),
    departmentId: z.string().uuid('Invalid department ID'),
    designation: z.string().min(2, 'Designation must be at least 2 characters long'),
    specialization: z.array(z.string()).optional(),
    qualification: z.string().min(2, 'Qualification must be at least 2 characters long'),
    experience: z.number().min(0, 'Experience must be a positive number'),
    joiningDate: z.string().refine((date) => {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    }, 'Invalid joining date'),
    employmentType: z.enum(['full-time', 'part-time', 'contract', 'visiting']),
    salary: z.number().min(0, 'Salary must be a positive number').optional()
  }),
  bankDetails: z.object({
    bankName: z.string().min(2, 'Bank name must be at least 2 characters long'),
    accountNumber: z.string().min(8, 'Account number must be at least 8 characters long'),
    ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code format'),
    accountType: z.enum(['savings', 'current', 'salary'])
  }).optional()
});

export const updateTeacherSchema = createTeacherSchema.partial();

export const getTeachersSchema = z.object({
  page: z.string().regex(/^\d+$/, 'Page must be a positive integer').transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/, 'Limit must be a positive integer').transform(Number).default('10'),
  search: z.string().optional(),
  departmentId: z.string().uuid().optional(),
  designation: z.string().optional(),
  employmentType: z.enum(['full-time', 'part-time', 'contract', 'visiting']).optional(),
  sortBy: z.enum(['firstName', 'lastName', 'employeeId', 'joiningDate']).default('firstName'),
  sortOrder: z.enum(['asc', 'desc']).default('asc')
});

export type CreateTeacherInput = z.infer<typeof createTeacherSchema>;
export type UpdateTeacherInput = z.infer<typeof updateTeacherSchema>;
export type GetTeachersInput = z.infer<typeof getTeachersSchema>;

export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  employmentInfo: {
    employeeId: string;
    departmentId: string;
    designation: string;
    specialization?: string[];
    qualification: string;
    experience: number;
    joiningDate: string;
    employmentType: 'full-time' | 'part-time' | 'contract' | 'visiting';
    salary?: number;
  };
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    accountType: 'savings' | 'current' | 'salary';
  };
  isActive: boolean;
  created_at: string;
  updated_at: string;
}
