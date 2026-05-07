import { Elysia } from "elysia";
import { jwtPlugin } from "@/plugins/jwt.plugin";
import { AuthController } from "./auth.controller";
import { TSignIn, TRequestPasswordReset } from "./auth.dto";

export const AuthRouter = (authController: AuthController) => {
  return new Elysia({ prefix: "/auth" })
    .use(jwtPlugin)
    .post(
      "/login",
      ({ body, set, jwt }) => authController.signIn(body, set, jwt),
      {
        body: TSignIn,
      },
    )
    .post(
      "/sign-in",
      ({ body, set, jwt }) => authController.signIn(body, set, jwt),
      {
        body: TSignIn,
      },
    )
    .post(
      "/request-password-reset",
      ({ body, set }) => authController.requestPasswordReset(body, set),
      { body: TRequestPasswordReset },
    );
};
