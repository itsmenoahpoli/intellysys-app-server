import { prisma } from "@/database";
import { clampInt, normalizeSort } from "@/utils";
import { DBService } from "../db.service";
import type { Prisma, AuthSessionLog, User, UserRole } from "@prisma/client";
import type { CreateAuthSessionLogDto, AuthSessionLogsQueryDto } from "./auth-session-logs.dto";

type AuthSessionLogWithUser = AuthSessionLog & {
  user: User & { userRole: UserRole };
};

type AuthSessionLogsListResult = {
  data: AuthSessionLogWithUser[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

const ALLOWED_SORT_FIELDS = ["createdAt", "action", "ipAddress"] as const;

export class AuthSessionLogsService extends DBService<typeof prisma.authSessionLog> {
  constructor() {
    super(prisma.authSessionLog);
  }

  private buildWhere(query: AuthSessionLogsQueryDto): Prisma.AuthSessionLogWhereInput {
    const where: Prisma.AuthSessionLogWhereInput = {};

    const userId = query.userId ? Number(query.userId) : undefined;
    if (Number.isFinite(userId)) {
      where.userId = userId;
    }

    const action = query.action?.trim().toLowerCase();
    if (action && (action === "login" || action === "logout")) {
      where.action = action;
    }

    const q = query.q?.trim();
    if (q) {
      where.user = {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
        ],
      };
    }

    const startDate = query.startDate?.trim();
    const endDate = query.endDate?.trim();
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        const start = new Date(startDate);
        if (!isNaN(start.getTime())) {
          where.createdAt.gte = start;
        }
      }
      if (endDate) {
        const end = new Date(endDate);
        if (!isNaN(end.getTime())) {
          end.setHours(23, 59, 59, 999);
          where.createdAt.lte = end;
        }
      }
    }

    return where;
  }

  async list(query: AuthSessionLogsQueryDto): Promise<AuthSessionLogsListResult> {
    const page = clampInt(query.page, 1, 1, 10_000);
    const limit = clampInt(query.limit, 10, 1, 100);
    const skip = (page - 1) * limit;

    const where = this.buildWhere(query);
    const { sortBy, sortOrder } = normalizeSort(
      query.sortBy,
      query.sortOrder,
      ALLOWED_SORT_FIELDS,
      "createdAt",
    );

    const [total, logs] = await prisma.$transaction([
      prisma.authSessionLog.count({ where }),
      prisma.authSessionLog.findMany({
        where,
        include: {
          user: {
            include: { userRole: true },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
      data: logs,
      meta: { page, limit, total, totalPages },
    };
  }

  async createLog(data: CreateAuthSessionLogDto): Promise<AuthSessionLog> {
    return this.create({
      data: {
        userId: data.userId,
        action: data.action,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });
  }

  async getById(id: number): Promise<AuthSessionLogWithUser | null> {
    return prisma.authSessionLog.findUnique({
      where: { id },
      include: {
        user: {
          include: { userRole: true },
        },
      },
    });
  }

  async getUserLogs(userId: number, query: AuthSessionLogsQueryDto): Promise<AuthSessionLogsListResult> {
    return this.list({ ...query, userId: String(userId) });
  }
}
