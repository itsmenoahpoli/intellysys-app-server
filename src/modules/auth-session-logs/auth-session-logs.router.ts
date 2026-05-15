import { Elysia, t } from "elysia";
import { jwtPlugin } from "@/plugins/jwt.plugin";
import { AuthSessionLogsController } from "./auth-session-logs.controller";
import { TAuthSessionLogsQuery } from "./auth-session-logs.dto";

export const AuthSessionLogsRouter = (
  controller: AuthSessionLogsController,
) => {
  return new Elysia({ prefix: "/auth-session-logs" })
    .use(jwtPlugin)
    .get("/", ({ query, set }) => controller.list(query, set), {
      query: TAuthSessionLogsQuery,
    })
    .get(
      "/my-logs",
      ({ query, set, jwt }) =>
        controller.getMyLogs(Number((jwt as any).sub), query, set),
      {
        query: TAuthSessionLogsQuery,
      },
    )
    .get(
      "/:id",
      ({ params, set }) => controller.getById(Number(params.id), set),
      {
        params: t.Object({ id: t.String() }),
      },
    );
};
