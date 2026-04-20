import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
}

export class JWTUtils {
  private static readonly secret: string = process.env['JWT_SECRET'] || 'fallback_secret_key';
  private static readonly expiresIn: string = process.env['JWT_EXPIRES_IN'] || '7d';

  static generateToken(payload: JWTPayload): string {
    try {
      return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn as any });
    } catch (error) {
      throw new Error('Failed to generate JWT token');
    }
  }

  static verifyToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, this.secret) as JWTPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token has expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token');
      } else {
        throw new Error('Token verification failed');
      }
    }
  }

  static async hashPassword(password: string): Promise<string> {
    try {
      const saltRounds = 12;
      return await bcrypt.hash(password, saltRounds);
    } catch (error) {
      throw new Error('Failed to hash password');
    }
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      throw new Error('Failed to compare password');
    }
  }
}
