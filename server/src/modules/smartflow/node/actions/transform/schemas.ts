// create schema for query model with zod schema
// properties are
// sql body : string
// sql params : array of string
// isDml : boolean

import { z } from "zod";

export const sqlSchema = z.object({
  sql: z.string(),
  params: z.array(z.string()),
  isDml: z.boolean().default(false),
});

export type sqlSchemaType = z.infer<typeof sqlSchema>;
