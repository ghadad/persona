//create zod achemas for user module
import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const createUserSchema = z.object({
  username: z.string(),
  email: z.string(),
  password: z.string(),
});

export type createUserType = z.infer<typeof createUserSchema>;

const userReplySchema = z.object({
  username: z.string(),
  email: z.string(),
});

const usersReplySchema = z.array(userReplySchema);
export type usersReplyType = z.infer<typeof usersReplySchema>;

const userGetByIdSchema = z.object({
  id: z.coerce.number(),
});

export type userGetByIdType = z.infer<typeof userGetByIdSchema>;

const userDeleteSchema = z.object({
  success: z.boolean(),
});

//add login schema and reply of login schema

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type loginType = z.infer<typeof loginSchema>;

const loginReplySchema = z.object({
  success: z.boolean(),
  username: z.string(),
});

export const { schemas: userSchemas, $ref } = buildJsonSchemas(
  {
    createUserSchema,
    userReplySchema,
    usersReplySchema,
    userGetByIdSchema,
    userDeleteSchema,
    loginSchema,
    loginReplySchema,
  },
  { $id: "User" }
);
