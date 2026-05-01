import { z } from "zod";

const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;

export const expensePayloadSchema = z.object({
  amount: z.coerce.number().positive("El monto del gasto debe ser mayor que cero"),
  categoryId: z.string().trim().min(1, "La categoría es obligatoria"),
  date: z
    .string()
    .trim()
    .regex(dateOnlyRegex, "La fecha debe tener formato YYYY-MM-DD"),
  note: z
    .string()
    .trim()
    .min(1, "La descripción es obligatoria")
    .max(240, "La nota no puede superar los 240 caracteres")
    .transform((value: string) => value),
});

export const expenseQuerySchema = z.object({
  month: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}$/, "El mes debe tener formato YYYY-MM")
    .optional(),
  categoryId: z.string().trim().min(1).optional(),
  startDate: z
    .string()
    .trim()
    .regex(dateOnlyRegex, "La fecha de inicio debe tener formato YYYY-MM-DD")
    .optional(),
  endDate: z
    .string()
    .trim()
    .regex(dateOnlyRegex, "La fecha de fin debe tener formato YYYY-MM-DD")
    .optional(),
});

export type ExpensePayload = z.infer<typeof expensePayloadSchema>;
export type ExpenseQuery = z.infer<typeof expenseQuerySchema>;
