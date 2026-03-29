import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateJWT } from '../../middleware/auth.middleware.js';

const prisma = new PrismaClient();
const router = Router();

router.post('/save-farm', authenticateJWT, async (req, res) => {
    const { latitude, longitude, accuracy, boundary, timestamp, farmName } = req.body;
    const userId = req.user.userId;

    // 1. Validation
    if (accuracy > 50) {
        return res.status(400).json({ success: false, message: "GPS accuracy is insufficient (> 50m). Please wait for stabilization." });
    }

    if (!boundary || !boundary.geometry || !boundary.geometry.coordinates) {
        return res.status(400).json({ success: false, message: "Farm boundary polygon is required." });
    }

    try {
        const farm = await prisma.farm.create({
            data: {
                name: farmName || "New Field Mapping",
                location: "Guntur Region", // Placeholder or from geocoder
                gpsLat: parseFloat(latitude),
                gpsLng: parseFloat(longitude),
                gpsAccuracy: parseFloat(accuracy),
                boundary: JSON.stringify(boundary),
                userId: userId
            }
        });

        res.status(200).json({ success: true, message: "Farm field saved successfully!", farmId: farm.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Database error during farm save" });
    }
});

export default router;
