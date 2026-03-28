import { authService } from './auth.service.js';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class AuthController {
    async sendOTP(req, res) {
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, message: "Email is required" });

        const result = await authService.sendOTP(email);
        res.status(200).json(result);
    }

    verifyOTP(req, res) {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ success: false, message: "Email and OTP are required" });

        const result = authService.verifyOTP(email, otp);
        if (result.success) {
            try {
                // Find or create user
                let user = await prisma.user.findUnique({ where: { email } });
                if (!user) {
                    user = await prisma.user.create({ data: { email } });
                }

                // Generate JWT token
                const token = jwt.sign(
                    { userId: user.id, email: user.email },
                    process.env.JWT_SECRET || 'fallback-secret',
                    { expiresIn: '7d' }
                );

                res.status(200).json({ 
                    success: true, 
                    message: "Authenticated successfully",
                    token,
                    user: { id: user.id, email: user.email }
                });
            } catch (error) {
                console.error("JWT creation error:", error);
                res.status(500).json({ success: false, message: "Internal Server Error" });
            }
        } else {
            res.status(401).json(result);
        }
    }
}

export const authController = new AuthController();
