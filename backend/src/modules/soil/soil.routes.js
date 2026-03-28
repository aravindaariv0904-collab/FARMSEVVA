import { Router } from 'express';
import { soilController } from './soil.controller.js';
import { authenticateJWT } from '../../middleware/auth.middleware.js';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Existing soil save logic
router.post('/save', authenticateJWT, async (req, res) => {
    const { ph, nitrogen, phosphorus, potassium, farmId } = req.body;
    const userId = req.user.userId;

    try {
        const soil = await prisma.soilData.create({
            data: {
                ph, nitrogen, phosphorus, potassium,
                userId: userId
            }
        });

        res.status(200).json({ success: true, message: "Soil data saved", data: soil });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Database Error" });
    }
});

// GPS Auto-Fetch Method 5
router.get('/auto-fetch', authenticateJWT, soilController.autoFetch.bind(soilController));

export default router;
