import { Elysia } from "elysia";
import { securityPlugin, swaggerPlugin, staticAssetsPlugin } from "./plugins";
import { HttpStatus } from "./utils";
import { AuthModule } from "./modules";

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
    .use(AuthModule());
});
