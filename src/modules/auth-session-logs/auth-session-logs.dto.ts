import { t } from "elysia";

export const TAuthSessionLogsQuery = t.Object({
  page: t.Optional(t.String()),
  limit: t.Optional(t.String()),
  q: t.Optional(t.String()),
  userId: t.Optional(t.String()),
  action: t.Optional(t.String()),
  sortBy: t.Optional(t.String()),
  sortOrder: t.Optional(t.String()),
  startDate: t.Optional(t.String()),
  endDate: t.Optional(t.String()),
});

export type AuthSessionLogsQueryDto = {
  page?: string;
  limit?: string;
  q?: string;
  userId?: string;
  action?: string;
  sortBy?: string;
  sortOrder?: string;
  startDate?: string;
  endDate?: string;
};

export type CreateAuthSessionLogDto = {
  userId: number;
  action: string;
  ipAddress?: string;
  userAgent?: string;
};
