import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Middleware to verify JWT token
 */
export const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Expecting "Bearer <token>"

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ success: false, message: "Invalid or expired token" });
            }

            req.user = user;
            next();
        });
    } else {
        res.status(401).json({ success: false, message: "Authorization header missing" });
    }
};
