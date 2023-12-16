import { FastifyReply, FastifyRequest } from "fastify";
import { User } from "./user.model";
import UserService from "./user.service";
//import types only from zod schema
import type * as userTypes from "./user.schemas";

class UserController {
  userServices: UserService;
  constructor() {
    this.userServices = new UserService();
  }
  async getAllUsers(request: FastifyRequest, reply: FastifyReply) {
    try {
      const users = await this.userServices.getAllUsers();
      reply.send(users);
    } catch (err) {
      reply.code(500).send(err);
    }
  }

  async getUserById(
    request: FastifyRequest<{ Params: userTypes.userGetByIdType }>,
    reply: FastifyReply
  ) {
    try {
      const id = Number(request.params.id);
      const user = await this.userServices.getUserById(id);
      if (!user) {
        reply.code(404).send({ message: "User not found" });
      } else {
        reply.send(user);
      }
    } catch (err) {
      reply.code(500).send(err);
    }
  }

  async createUser(
    request: FastifyRequest<{ Body: userTypes.createUserType }>,
    reply: FastifyReply
  ) {
    try {
      const user = request.body;
      const newUser = await this.userServices.createUser(user);
      reply.code(201).send(newUser);
    } catch (err) {
      reply.code(500).send(err);
    }
  }

  async updateUser(
    request: FastifyRequest<{ Params: userTypes.userGetByIdType }>,
    reply: FastifyReply
  ) {
    try {
      const id = Number(request.params.id);
      const user: User = request.body as User;
      const updatedUser = await this.userServices.updateUser(id, user);
      if (!updatedUser) {
        reply.code(404).send({ message: "User not found" });
      } else {
        reply.send(updatedUser);
      }
    } catch (err) {
      reply.code(500).send(err);
    }
  }

  async deleteUser(
    request: FastifyRequest<{ Params: userTypes.userGetByIdType }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const result = await this.userServices.deleteUser(id);
      if (!result.deleted) {
        reply.code(404).send({ message: "User not found" });
      } else {
        reply.send({ deleted: true });
      }
    } catch (err) {
      reply.code(500).send(err);
    }
  }
}

export default new UserController();
