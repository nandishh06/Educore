import { z } from 'zod';

export const createDepartmentSchema = z.object({
  name: z.string().min(2, 'Department name must be at least 2 characters long').max(100, 'Department name must not exceed 100 characters'),
  code: z.string().min(2, 'Department code must be at least 2 characters long').max(10, 'Department code must not exceed 10 characters').toUpperCase(),
  description: z.string().min(10, 'Description must be at least 10 characters long').max(500, 'Description must not exceed 500 characters'),
  headOfDepartment: z.string().uuid('Invalid HOD user ID').optional(),
  establishedYear: z.number().min(1900, 'Invalid establishment year').max(new Date().getFullYear(), 'Establishment year cannot be in the future'),
  building: z.string().min(1, 'Building name is required'),
  floor: z.string().optional(),
  room: z.string().optional(),
  contactEmail: z.string().email('Invalid contact email').optional(),
  contactPhone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid contact phone number').optional(),
  isActive: z.boolean().default(true)
});

export const updateDepartmentSchema = createDepartmentSchema.partial();

export const getDepartmentsSchema = z.object({
  page: z.string().regex(/^\d+$/, 'Page must be a positive integer').transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/, 'Limit must be a positive integer').transform(Number).default('10'),
  search: z.string().optional(),
  isActive: z.enum(['true', 'false']).transform(val => val === 'true').optional(),
  sortBy: z.enum(['name', 'code', 'establishedYear']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc')
});

export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;
export type GetDepartmentsInput = z.infer<typeof getDepartmentsSchema>;

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  headOfDepartment?: string;
  establishedYear: number;
  building: string;
  floor?: string;
  room?: string;
  contactEmail?: string;
  contactPhone?: string;
  isActive: boolean;
  created_at: string;
  updated_at: string;
}
