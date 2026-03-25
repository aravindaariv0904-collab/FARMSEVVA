import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    phoneNumber: z.string()
      .min(10, 'Phone number must be at least 10 digits')
      .max(15, 'Phone number exceeds maximum length')
      .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
  })
});
