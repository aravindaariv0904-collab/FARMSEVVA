import { z } from 'zod';

export const cropRecommendSchema = z.object({
  body: z.object({
    ph: z.number().min(0).max(14),
    nitrogen: z.number().min(0).max(1000),
    phosphorus: z.number().min(0).max(1000),
    potassium: z.number().min(0).max(1000),
  })
});
