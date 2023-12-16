import { FastifyPluginAsync } from "fastify";
import UserController from "./user.controller";
import { userSchemas, $ref, loginType, createUserType } from "./user.schemas";
import UserService from "./user.service";
import ldapService from "../../services/ldap";
const routes: FastifyPluginAsync = async (server, opts): Promise<void> => {
  const userService = new UserService();
  // add schemas to fastify  for swagger documentation
  for (const schema of [...userSchemas]) {
    server.addSchema(schema);
  }

  server.post<{ Body: loginType }>(
    "/login",
    {
      schema: {
        description: "Login",
        tags: ["user"],
        summary: "Login",
        body: $ref("loginSchema"),
        response: {
          200: $ref("loginReplySchema"),
        },
      },
      config: { auth: false },
    },
    async function (request, reply) {
      const { username, password } = request.body;
      const user = await userService.getUserByUsername(username);
      if (user == null) {
        return reply.status(403).send({ error: "User not found" });
      }

      const encryptPassword = userService.encryptPassword(password);
      if (await ldapService.authenticate(username, encryptPassword)) {
        const token = server.jwt.sign({ username });
        // add token to secure cookie , expired 1d
        return reply
          .setCookie("token", token, {
            path: "/",
            httpOnly: true,
            sameSite: "lax",
            secure: false,
          })
          .send({ success: true, username: username });
      }
      reply.status(403).send({ success: false });
    }
  );

  server.get(
    "/logout",
    {
      schema: {
        description: "Logout",
        tags: ["user"],
        summary: "Logout",
        response: {
          200: $ref("loginReplySchema"),
        },
      },
      config: { auth: true },
    },
    async function (request, reply) {
      reply.clearCookie("token").send({ success: true });
    }
  );

  server.post<{ Body: createUserType }>(
    "/register",
    {
      config: { auth: false },
      schema: {
        description: "Register",
        tags: ["user"],
        summary: "Register",
        body: $ref("createUserSchema"),
      },
    },
    async function (request, reply) {
      const { username, password, email } = request.body;
      request.log.info("registering user", request.body);
      const user = await userService.createUser({ username, password, email });
      reply.send({ user });
    }
  );

  server.get(
    "/users",
    {
      schema: {
        tags: ["user"],
        summary: "Get all users",
        description: "Get all users",

        response: {
          200: $ref("usersReplySchema"),
        },
      },
    },
    UserController.getAllUsers
  );

  server.get(
    "/:id",
    {
      schema: {
        description: "Get user by id",
        tags: ["user"],

        summary: "Get user by id",
        params: $ref("userGetByIdSchema"),
        response: {
          200: $ref("userReplySchema"),
        },
      },
    },
    UserController.getUserById
  );

  server.post(
    "/",
    {
      schema: {
        tags: ["user"],
        summary: "Create user",
        body: $ref("createUserSchema"),
        response: {
          201: $ref("userReplySchema"),
        },
      },
    },
    UserController.createUser
  );

  server.put(
    "/:id",
    {
      schema: {
        tags: ["user"],
        summary: "Update user by id",
        params: $ref("userGetByIdSchema"),
        body: $ref("createUserSchema"),
        response: {
          200: $ref("userReplySchema"),
        },
      },
    },
    UserController.updateUser
  );

  server.delete(
    "/:id",
    {
      schema: {
        tags: ["user"],
        summary: "Delete user by id",
        params: $ref("userGetByIdSchema"),
        response: {
          200: $ref("userDeleteSchema"),
        },
      },
    },
    UserController.deleteUser
  );
};

export default routes;
