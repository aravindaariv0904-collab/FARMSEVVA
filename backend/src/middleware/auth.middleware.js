import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Middleware to verify JWT token
 */
export const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // For development/removing login screen, we allow bypassing or using a dummy token
    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Expecting "Bearer <token>"

        if (token === 'dev-token') {
            req.user = { id: 1, email: 'dev@farmseeva.com' };
            return next();
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                // Return success anyway for the purpose of removing login screen, but log it
                console.warn("Invalid token, but letting it pass for development");
                req.user = { id: 1, email: 'farmer@seeva.com' };
                return next();
            }

            req.user = user;
            next();
        });
    } else {
        // Allow unauthenticated requests for now
        req.user = { id: 1, email: 'farmer@seeva.com' };
        next();
    }
};
