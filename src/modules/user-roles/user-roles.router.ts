import { Elysia } from "elysia";
import { UserRolesController } from "./user-roles.controller";

export const UserRolesRouter = (controller: UserRolesController) => {
  return new Elysia({ prefix: "/user-roles" }).get("/", ({ set }) =>
    controller.list(set),
  );
};

