// create Node schema using zod with infer type
import { buildJsonSchemas } from "fastify-zod";

import { z } from "zod";
const operatorCreateSchema = z.object({
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

const operatorQueryCriteriaSchema = z.object({
  term: z.string().optional(),
});

export type operatorQueryCriteriaType = z.infer<
  typeof operatorQueryCriteriaSchema
>;

export type operatorSchemaType = z.infer<typeof operatorCreateSchema>;

const operatorGetByIdSchema = z.object({
  id: z.coerce.number(),
});

export type operatorGetByIdType = z.infer<typeof operatorGetByIdSchema>;

const operatorReplySchema = z.object({
  id: z.number(),
  ...operatorCreateSchema.shape,
});

export type operatorReplySchema = z.infer<typeof operatorReplySchema>;

const operatorsReplySchema = z.array(operatorReplySchema);
export type operatorsReplySchema = z.infer<typeof operatorsReplySchema>;

export const { schemas: operatorSchemas, $ref } = buildJsonSchemas(
  {
    operatorGetByIdSchema,
    operatorCreateSchema,
    operatorsReplySchema,
    operatorReplySchema,
    operatorQueryCriteriaSchema,
  },
  { $id: "Operator" }
);
