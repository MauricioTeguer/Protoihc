import { z } from "zod";

const hexColorRegex = /^#([0-9A-F]{3}|[0-9A-F]{6})$/i;

export const categoryPayloadSchema = z.object({
  name: z.string().trim().min(1, "El nombre de la categoría es obligatorio").max(60),
  icon: z.string().trim().min(1).max(40).default("more-horizontal"),
  color: z
    .string()
    .trim()
    .regex(hexColorRegex, "El color debe ser un código hexadecimal válido")
    .default("#6B7280"),
});

export type CategoryPayload = z.infer<typeof categoryPayloadSchema>;
