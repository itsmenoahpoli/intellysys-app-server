import { Elysia } from "elysia";
import type { AuthUserContext } from "@/types/auth";
import { AccountController } from "./account.controller";
import { TUpdateMyAccount, TUpdateMyPassword } from "./account.dto";

type AuthedContext = {
  authUser: AuthUserContext;
  set: Parameters<AccountController["getMe"]>[1];
};

export const AccountRouter = (controller: AccountController) => {
  return new Elysia({ prefix: "/account" })
    .get("/me", (ctx) => {
      const { authUser, set } = ctx as typeof ctx & AuthedContext;
      return controller.getMe(authUser, set);
    })
    .patch("/me", (ctx) => {
      const { authUser, body, set } = ctx as typeof ctx & AuthedContext & {
        body: { name?: string; email?: string };
      };
      return controller.updateMe(authUser, body, set);
    }, {
      body: TUpdateMyAccount,
    })
    .patch(
      "/password",
      (ctx) => {
        const { authUser, body, set } = ctx as typeof ctx & AuthedContext & {
          body: { currentPassword: string; newPassword: string };
        };
        return controller.updatePassword(authUser, body, set);
      },
      { body: TUpdateMyPassword },
    );
};
