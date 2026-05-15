import { Elysia } from "elysia";
import { jwtPlugin } from "@/plugins/jwt.plugin";
import { AuthController } from "./auth.controller";
import { TSignIn, TRequestPasswordReset } from "./auth.dto";

export const AuthRouter = (authController: AuthController) => {
  return new Elysia({ prefix: "/auth" })
    .use(jwtPlugin)
    .post(
      "/login",
      ({ body, set, jwt, request }) =>
        authController.signIn(body, set, jwt, { request }),
      {
        body: TSignIn,
      },
    )
    .post(
      "/sign-in",
      ({ body, set, jwt, request }) =>
        authController.signIn(body, set, jwt, { request }),
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
