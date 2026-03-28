import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const router = Router();

router.post('/setup', async (req, res) => {
    const { email, farmName, location, ph, nitrogen, phosphorus, potassium } = req.body;
    
    if (!email) return res.status(400).json({ success: false, message: "User email missing" });
    if (!farmName || !location) return res.status(400).json({ success: false, message: "Farm details required" });

    try {
        // Find or create user
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            user = await prisma.user.create({ data: { email } });
        }

        // 1. Create Farm record
        const farm = await prisma.farm.create({
            data: {
                name: farmName,
                location: location,
                userId: user.id
            }
        });

        // 2. Create Soil record for the current user
        await prisma.soilData.create({
            data: {
                ph,
                nitrogen,
                phosphorus,
                potassium,
                userId: user.id
            }
        });

        res.status(200).json({ success: true, message: "Farm and soil data integrated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to persist farm data" });
    }
});

export default router;
