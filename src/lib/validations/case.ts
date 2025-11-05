import { z } from "zod";

export const createCaseSchema = z.object({
  case_number: z
    .string()
    .trim()
    .min(1, "El número de expediente es requerido")
    .max(50, "El número de expediente no puede exceder 50 caracteres")
    .regex(/^[A-Z0-9-]+$/, "Solo se permiten letras mayúsculas, números y guiones"),
  title: z
    .string()
    .trim()
    .min(3, "El título debe tener al menos 3 caracteres")
    .max(200, "El título no puede exceder 200 caracteres"),
  description: z
    .string()
    .trim()
    .max(2000, "La descripción no puede exceder 2000 caracteres")
    .optional()
    .nullable(),
  client_id: z
    .string()
    .uuid("ID de cliente inválido")
    .optional()
    .nullable(),
  lawyer_id: z
    .string()
    .uuid("ID de abogado inválido")
    .optional()
    .nullable(),
  status: z.enum(["new", "in_progress", "pending_review", "closed", "archived"], {
    errorMap: () => ({ message: "Estado inválido" }),
  }).default("new"),
});

export const updateCaseSchema = createCaseSchema.partial().extend({
  id: z.string().uuid("ID de expediente inválido"),
});

export type CreateCaseInput = z.infer<typeof createCaseSchema>;
export type UpdateCaseInput = z.infer<typeof updateCaseSchema>;
