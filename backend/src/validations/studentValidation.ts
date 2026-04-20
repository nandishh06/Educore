import { z } from 'zod';

export const createStudentSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters long').max(50, 'First name must not exceed 50 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters long').max(50, 'Last name must not exceed 50 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number format').optional(),
  dateOfBirth: z.string().refine((date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime()) && parsedDate < new Date();
  }, 'Invalid date of birth'),
  gender: z.enum(['male', 'female', 'other'], {
    errorMap: () => ({ message: 'Gender must be one of: male, female, other' })
  }),
  address: z.object({
    street: z.string().min(5, 'Street address must be at least 5 characters long'),
    city: z.string().min(2, 'City must be at least 2 characters long'),
    state: z.string().min(2, 'State must be at least 2 characters long'),
    postalCode: z.string().regex(/^\d+$/, 'Postal code must contain only digits'),
    country: z.string().min(2, 'Country must be at least 2 characters long')
  }),
  emergencyContact: z.object({
    name: z.string().min(2, 'Emergency contact name must be at least 2 characters long'),
    relationship: z.string().min(2, 'Relationship must be at least 2 characters long'),
    phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid emergency contact phone number'),
    email: z.string().email('Invalid emergency contact email').optional()
  }),
  academicInfo: z.object({
    rollNumber: z.string().min(1, 'Roll number is required'),
    grade: z.string().min(1, 'Grade is required'),
    section: z.string().min(1, 'Section is required'),
    admissionDate: z.string().refine((date) => {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    }, 'Invalid admission date'),
    departmentId: z.string().uuid('Invalid department ID').optional()
  }),
  parentInfo: z.object({
    fatherName: z.string().min(2, 'Father name must be at least 2 characters long'),
    motherName: z.string().min(2, 'Mother name must be at least 2 characters long'),
    guardianName: z.string().optional(),
    parentPhone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid parent phone number'),
    parentEmail: z.string().email('Invalid parent email').optional(),
    occupation: z.string().optional()
  })
});

export const updateStudentSchema = createStudentSchema.partial();

export const getStudentsSchema = z.object({
  page: z.string().regex(/^\d+$/, 'Page must be a positive integer').transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/, 'Limit must be a positive integer').transform(Number).default('10'),
  search: z.string().optional(),
  grade: z.string().optional(),
  section: z.string().optional(),
  departmentId: z.string().uuid().optional(),
  sortBy: z.enum(['firstName', 'lastName', 'rollNumber', 'admissionDate']).default('firstName'),
  sortOrder: z.enum(['asc', 'desc']).default('asc')
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
export type GetStudentsInput = z.infer<typeof getStudentsSchema>;

export interface Student {
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
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };
  academicInfo: {
    rollNumber: string;
    grade: string;
    section: string;
    admissionDate: string;
    departmentId?: string;
  };
  parentInfo: {
    fatherName: string;
    motherName: string;
    guardianName?: string;
    parentPhone: string;
    parentEmail?: string;
    occupation?: string;
  };
  isActive: boolean;
  created_at: string;
  updated_at: string;
}
