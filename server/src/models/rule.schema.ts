// create Node schema using zod with infer type
import { buildJsonSchemas } from "fastify-zod";

import { z } from "zod";
const ruleCreateSchema = z.object({
  title: z.string(),
  factId: z.number(),
  rule: z.string(),
  startAt: z.coerce.date().optional(),
  endAt: z.coerce.date().optional(),
  description: z.string().optional(),
  priority: z.number(),
  priority2: z.number(),
  tags: z.string().optional(),
  groups: z.string().optional(),
  createdBy: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce
    .date()
    .transform((val) => val || null)
    .optional()
    .nullable(),
});

const ruleQueryCriteriaSchema = z.object({
  term: z.string().optional(),
});

export type ruleQueryCriteriaType = z.infer<typeof ruleQueryCriteriaSchema>;

export type ruleSchemaType = z.infer<typeof ruleCreateSchema>;

const ruleGetByIdSchema = z.object({
  id: z.coerce.number(),
});

export type ruleGetByIdType = z.infer<typeof ruleGetByIdSchema>;

const ruleReplySchema = z.object({
  id: z.number(),
  ...ruleCreateSchema.shape,
});

export type ruleReplySchema = z.infer<typeof ruleReplySchema>;

const rulesReplySchema = z.array(ruleReplySchema);
export type rulesReplySchema = z.infer<typeof rulesReplySchema>;

export const { schemas: ruleSchemas, $ref } = buildJsonSchemas(
  {
    ruleGetByIdSchema,
    ruleCreateSchema,
    rulesReplySchema,
    ruleReplySchema,
    ruleQueryCriteriaSchema,
  },
  { $id: "Rule" }
);
