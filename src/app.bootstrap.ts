import { Elysia } from "elysia";
import { securityPlugin, swaggerPlugin, staticAssetsPlugin, authGuardPlugin } from "./plugins";
import { HttpStatus } from "./utils";
import {
  AccountModule,
  AuthModule,
  AuthSessionLogsModule,
  UserRolesModule,
  UsersModule,
} from "./modules";

export const app = new Elysia();

app.use(securityPlugin);
app.use(swaggerPlugin);
app.use(staticAssetsPlugin);

app.group("/api/v1", (app) => {
  return app
    .get("/health", ({ set }) => {
      set.status = HttpStatus.OK;

      return {
        status: "ok",
        uptime: process.uptime(),
      };
    })
    .use(AuthModule())
    .group("", (app) => {
      return app
        .use(authGuardPlugin)
        .use(AccountModule())
        .use(UsersModule())
        .use(UserRolesModule())
        .use(AuthSessionLogsModule());
    });
});
