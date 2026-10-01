import { z } from 'zod';

export const createRepairSchema = z.object({
  customerName: z.string().trim().min(1, 'Escribe el nombre del cliente').max(120),
  customerPhone: z.string().trim().max(40).optional().default(''),
  deviceCategory: z.enum(['smartphone', 'tablet', 'computer', 'console', 'other']),
  deviceBrand: z.string().trim().min(1, 'Escribe la marca').max(80),
  deviceModel: z.string().trim().min(1, 'Escribe el modelo').max(120),
  issue: z.string().trim().min(1, 'Describe la avería').max(2000),
});

export type CreateRepairInput = z.infer<typeof createRepairSchema>;
