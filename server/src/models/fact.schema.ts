// create Node schema using zod with infer type
import { buildJsonSchemas } from "fastify-zod";

import { z } from "zod";
const factCreateSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  schema: z.string(),
  createdBy: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce
    .date()
    .transform((val) => val || null)
    .optional()
    .nullable(),
});

const factQueryCriteriaSchema = z.object({
  term: z.string().optional(),
});

export type factQueryCriteriaType = z.infer<typeof factQueryCriteriaSchema>;

export type factSchemaType = z.infer<typeof factCreateSchema>;

const factGetByIdSchema = z.object({
  id: z.coerce.number(),
});

export type factGetByIdType = z.infer<typeof factGetByIdSchema>;

const factReplySchema = z.object({
  id: z.number(),
  ...factCreateSchema.shape,
});

export type factReplySchema = z.infer<typeof factReplySchema>;

const factsReplySchema = z.array(factReplySchema);
export type factsReplySchema = z.infer<typeof factsReplySchema>;

export const { schemas: factSchemas, $ref } = buildJsonSchemas(
  {
    factGetByIdSchema,
    factCreateSchema,
    factsReplySchema,
    factReplySchema,
    factQueryCriteriaSchema,
  },
  { $id: "Fact" }
);
