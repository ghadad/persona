// create Node schema using zod with infer type
import { buildJsonSchemas } from "fastify-zod";

import { z } from "zod";
const flowCreateSchema = z.object({
  name: z.string(),
  title: z.string(),
  description: z.string().optional(),
  tags: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce
    .date()
    .transform((val) => val || null)
    .optional()
    .nullable(),
});

const flowQueryCriteriaSchema = z.object({
  term: z.string().optional(),
});

export type flowQueryCriteriaType = z.infer<typeof flowQueryCriteriaSchema>;

export type flowSchemaType = z.infer<typeof flowCreateSchema>;

const flowGetByIdSchema = z.object({
  id: z.coerce.number(),
});

export type flowGetByIdType = z.infer<typeof flowGetByIdSchema>;

const flowReplySchema = z.object({
  id: z.number(),
  ...flowCreateSchema.shape,
});

export type flowReplySchema = z.infer<typeof flowReplySchema>;

const flowsReplySchema = z.array(flowReplySchema);
export type flowsReplySchema = z.infer<typeof flowsReplySchema>;

export const { schemas: flowSchemas, $ref } = buildJsonSchemas(
  {
    flowGetByIdSchema,
    flowCreateSchema,
    flowsReplySchema,
    flowReplySchema,
    flowQueryCriteriaSchema,
  },
  { $id: "Flow" }
);
