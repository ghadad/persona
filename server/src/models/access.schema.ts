// create Node schema using zod with infer type
import { buildJsonSchemas } from "fastify-zod";

import { z } from "zod";
const accessCreateSchema = z.object({
  username: z.string(),
  role: z.string().optional(),
  readonly: z.boolean().optional(),
  createdBy: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce
    .date()
    .transform((val) => val || null)
    .optional()
    .nullable(),
});

const accessQueryCriteriaSchema = z.object({
  term: z.string().optional(),
});

export type accessQueryCriteriaType = z.infer<typeof accessQueryCriteriaSchema>;

export type accessSchemaType = z.infer<typeof accessCreateSchema>;

const accessGetByIdSchema = z.object({
  id: z.coerce.number(),
});

export type accessGetByIdType = z.infer<typeof accessGetByIdSchema>;

const accessReplySchema = z.object({
  id: z.number(),
  ...accessCreateSchema.shape,
});

export type accessReplySchema = z.infer<typeof accessReplySchema>;

const accessesReplySchema = z.array(accessReplySchema);
export type accessesReplySchema = z.infer<typeof accessReplySchema>;

export const { schemas: accessSchemas, $ref } = buildJsonSchemas(
  {
    accessGetByIdSchema,
    accessCreateSchema,
    accessesReplySchema,
    accessReplySchema,
    accessQueryCriteriaSchema,
  },
  { $id: "Access" }
);
