import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateJWT } from '../../middleware/auth.middleware.js';

const prisma = new PrismaClient();
const router = Router();

router.post('/setup', authenticateJWT, async (req, res) => {
    const { farmName, location, lat, lon, ph, nitrogen, phosphorus, potassium } = req.body;
    const userId = req.user.userId;
    
    if (!farmName || !location) return res.status(400).json({ success: false, message: "Farm details required" });

    try {
        // 1. Create Farm record
        const farm = await prisma.farm.create({
            data: {
                name: farmName,
                location: location,
                gpsLat: parseFloat(lat),
                gpsLng: parseFloat(lon),
                userId: userId
            }
        });

        // 2. Create Soil record for the current user
        await prisma.soilData.create({
            data: {
                ph: parseFloat(ph || 0),
                nitrogen: parseFloat(nitrogen || 0),
                phosphorus: parseFloat(phosphorus || 0),
                potassium: parseFloat(potassium || 0),
                userId: userId
            }
        });

        res.status(200).json({ success: true, message: "Farm and initial soil data saved successfully", farmId: farm.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to persist farm data" });
    }
});

export default router;
