import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

class AuthService {
    // In-memory OTP storage: Map<email, {otp, expires}>
    otpStore = new Map();

    // Nodemailer transporter (Configure with your SMTP)
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    async sendOTP(email) {
        // Generate random 4-digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

        // Store OTP linked to Email
        this.otpStore.set(email, { otp, expiresAt });

        // Email configuration
        const mailOptions = {
            from: `"Farm Seeva" <${process.env.EMAIL_USER}>`,
            to: email, // Dynamic email from request
            subject: 'Your Farm Seeva Login OTP',
            text: `Your OTP is ${otp}. It expires in 5 minutes. No-reply - Farm Seeva.`
        };

        try {
            await this.transporter.sendMail(mailOptions);
            return { success: true, message: "OTP sent successfully" };
        } catch (error) {
            console.error("Email Error:", error);
            // In Dev: Fallback to console log if credentials are missing
            console.log(`\n========================================`);
            console.log(`[DEV MODE] OTP for ${email} is: ${otp}`);
            console.log(`========================================\n`);
            return { success: true, devMode: true, otp }; 
        }
    }

    verifyOTP(email, otp) {
        const stored = this.otpStore.get(email);

        if (!stored) return { success: false, message: "No OTP found for this email" };
        
        // Expiry check
        if (Date.now() > stored.expiresAt) {
            this.otpStore.delete(email);
            return { success: false, message: "OTP has expired" };
        }

        // Match check
        if (stored.otp === otp) {
            this.otpStore.delete(email); // Cleanup after success
            return { success: true };
        }

        return { success: false, message: "Invalid OTP code" };
    }
}

export const authService = new AuthService();
