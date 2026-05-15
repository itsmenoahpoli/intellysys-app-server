import { Elysia, t } from "elysia";
import { UsersController } from "./users.controller";
import { TCreateUser, TUpdateUser, TUsersQuery } from "./users.dto";

export const UsersRouter = (controller: UsersController) => {
  return new Elysia({ prefix: "/users" })
    .get("/", ({ query, set }) => controller.list(query, set), {
      query: TUsersQuery,
    })
    .get("/stats", ({ set }) => controller.stats(set))
    .get(
      "/:id",
      ({ params, set }) => controller.getById(Number(params.id), set),
      {
        params: t.Object({ id: t.String() }),
      },
    )
    .post("/", ({ body, set }) => controller.create(body, set), {
      body: TCreateUser,
    })
    .patch(
      "/:id",
      ({ params, body, set }) => controller.update(Number(params.id), body, set),
      { params: t.Object({ id: t.String() }), body: TUpdateUser },
    )
    .delete(
      "/:id",
      ({ params, set }) => controller.remove(Number(params.id), set),
      { params: t.Object({ id: t.String() }) },
    );
};

