import { t } from "elysia";

export const TUsersQuery = t.Object({
  page: t.Optional(t.String()),
  limit: t.Optional(t.String()),
  q: t.Optional(t.String()),
  roleId: t.Optional(t.String()),
  status: t.Optional(t.String()),
  department: t.Optional(t.String()),
  sortBy: t.Optional(t.String()),
  sortOrder: t.Optional(t.String()),
});

export type UsersQueryDto = {
  page?: string;
  limit?: string;
  q?: string;
  roleId?: string;
  status?: string;
  department?: string;
  sortBy?: string;
  sortOrder?: string;
};

export const TCreateUser = t.Object({
  name: t.String({ minLength: 1, maxLength: 120 }),
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 6, maxLength: 64 }),
  userRoleId: t.Number(),
});

export type CreateUserDto = {
  name: string;
  email: string;
  password: string;
  userRoleId: number;
};

export const TUpdateUser = t.Object({
  name: t.Optional(t.String({ minLength: 1, maxLength: 120 })),
  email: t.Optional(t.String({ format: "email" })),
  password: t.Optional(t.String({ minLength: 6, maxLength: 64 })),
  userRoleId: t.Optional(t.Number()),
});

export type UpdateUserDto = {
  name?: string;
  email?: string;
  password?: string;
  userRoleId?: number;
};

