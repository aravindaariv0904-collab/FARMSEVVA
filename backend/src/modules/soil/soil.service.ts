import { prisma } from '../../db';
import { AppError } from '../../middleware/errorHandler';

export class SoilService {
  async saveSoilData(userId: string, data: { ph: number; nitrogen: number; phosphorus: number; potassium: number }) {
    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new AppError(404, 'User not found');
    }

    return await prisma.soilData.create({
      data: {
        userId,
        ph: data.ph,
        nitrogen: data.nitrogen,
        phosphorus: data.phosphorus,
        potassium: data.potassium,
      },
    });
  }

  async getLatestSoilData(userId: string) {
    const data = await prisma.soilData.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (!data) {
        return null;
    }
    return data;
  }
}

export const soilService = new SoilService();
