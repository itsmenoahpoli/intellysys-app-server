import { t } from "elysia";

export const TUpdateMyAccount = t.Object({
  name: t.Optional(t.String({ minLength: 1, maxLength: 120 })),
  email: t.Optional(t.String({ format: "email" })),
});

export type UpdateMyAccountDto = {
  name?: string;
  email?: string;
};

export const TUpdateMyPassword = t.Object({
  currentPassword: t.String({ minLength: 1, maxLength: 64 }),
  newPassword: t.String({ minLength: 6, maxLength: 64 }),
});

export type UpdateMyPasswordDto = {
  currentPassword: string;
  newPassword: string;
};
