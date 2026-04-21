import { z } from 'zod';

export const CreateUserInput = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['admin', 'principal', 'hod', 'teacher'], { message: 'Invalid role' }),
  department: z.string().optional(),
  grade: z.string().optional(),
  section: z.string().optional(),
  subject: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  emergencyContact: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    relationship: z.string().optional(),
    email: z.string().email('Invalid emergency contact email').optional()
  }).optional(),
  employeeId: z.string().optional(),
  hireDate: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  isActive: z.boolean().default(true)
});

export const UpdateUserInput = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  department: z.string().optional(),
  grade: z.string().optional(),
  section: z.string().optional(),
  subject: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  emergencyContact: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    relationship: z.string().optional(),
    email: z.string().email('Invalid emergency contact email').optional()
  }).optional(),
  employeeId: z.string().optional(),
  hireDate: z.string().optional(),
  isActive: z.boolean().optional()
});

export type CreateUserInputType = z.infer<typeof CreateUserInput>;
export type UpdateUserInputType = z.infer<typeof UpdateUserInput>;
