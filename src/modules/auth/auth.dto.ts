import { t } from "elysia";

export const TSignIn = t.Object({
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 6, maxLength: 64 }),
});

export const TRequestPasswordReset = t.Object({
  email: t.String({ format: "email" }),
});

export type RequestPasswordResetDto = {
  email: string;
};

export type SignInDto = {
  email: string;
  password: string;
};
