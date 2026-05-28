import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long')
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  role: z.enum(['admin', 'principal', 'hod', 'teacher'], {
    errorMap: () => ({ message: 'Role must be one of: admin, principal, hod, teacher' })
  })
});

export type RegisterInput = z.infer<typeof registerSchema>;
