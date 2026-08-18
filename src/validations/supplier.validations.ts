import { z } from 'zod';

export const createSupplierSchema = z.object({
  companyName: z.string().min(1, 'Company name is required').trim(),
  vatId: z.string().min(1, 'VAT ID is required').trim(),
  country: z.string().min(1, 'Country is required').trim(),
  contactEmail: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .trim(),
});

export type CreateSupplierFormValues = z.infer<typeof createSupplierSchema>;

export const rejectSupplierSchema = z.object({
  reason: z.string().min(1, 'Rejection reason is required').trim(),
});

export type RejectSupplierFormValues = z.infer<typeof rejectSupplierSchema>;