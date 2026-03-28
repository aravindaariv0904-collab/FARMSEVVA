import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const router = Router();

router.post('/recommend', async (req, res) => {
    const { email } = req.body;
    
    try {
        const user = await prisma.user.findUnique({ 
            where: { email },
            include: { soilData: { orderBy: { createdAt: 'desc' }, take: 1 } }
        });

        if (!user || !user.soilData.length) {
            return res.status(200).json({ recommendations: [] });
        }

        const data = user.soilData[0];
        
        // Simple logic for Demo/Refactor:
        // pH 6-7, Nitrogen > 40: Rice, Maize
        // pH 5-6: Wheat, Potato
        const suggestions = [];

        if (data.ph >= 6.0 && data.ph <= 7.0) {
            suggestions.push({ 
                name: "Rice (వరి)", 
                icon: "🌾", 
                description: "Your soil pH is perfect for high-yield rice varieties. Ensure adequate watering during the growth phase." 
            });
            suggestions.push({ 
                name: "Maize (మొక్కజొన్న)", 
                icon: "🌽", 
                description: "The nitrogen levels are suitable for maize. Good drainage will lead to excellent results." 
            });
        } else if (data.ph < 6.0) {
            suggestions.push({ 
                name: "Wheat (గోధుమ)", 
                icon: "🌾", 
                description: "Slightly acidic soil is manageable for wheat. Focus on phosphorus-rich fertilizers." 
            });
        } else {
            suggestions.push({ 
                name: "Sugarcane (చెరకు)", 
                icon: "🎍", 
                description: "Higher pH levels are okay for sugarcane. Ensure rich organic matter in the soil." 
            });
        }

        res.status(200).json({ recommendations: suggestions });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Database Error" });
    }
});

export default router;
