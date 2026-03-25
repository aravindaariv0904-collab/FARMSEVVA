import jwt from 'jsonwebtoken';
import { prisma } from '../../db';

export class AuthService {
  private jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

  async login(phoneNumber: string) {
    // In production, you would send an OTP here. 
    // For MVP, we auto-create/find user and return a token.
    let user = await prisma.user.findUnique({
      where: { phoneNumber },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { phoneNumber },
      });
    }

    const token = jwt.sign({ userId: user.id, phone: user.phoneNumber }, this.jwtSecret, {
      expiresIn: '24h',
    });

    return { user, token };
  }
}

export const authService = new AuthService();
