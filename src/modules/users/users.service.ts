import { prisma } from "@/database";
import { DBService } from "../db.service";
import type { Prisma, User, UserRole } from "@prisma/client";
import type { CreateUserDto, UpdateUserDto, UsersQueryDto } from "./users.dto";

type PublicUser = Omit<User, "passwordHash"> & {
  userRole: UserRole;
  username: string;
  department: string;
  status: "Active" | "Inactive";
  lastLoginAt: Date;
};

type UsersListResult = {
  data: PublicUser[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

const clampInt = (raw: unknown, fallback: number, min: number, max: number) => {
  const n = typeof raw === "string" ? Number(raw) : Number(raw);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(n)));
};

const normalizeSort = (
  sortByRaw: string | undefined,
  sortOrderRaw: string | undefined,
): { sortBy: "name" | "email" | "createdAt" | "updatedAt"; sortOrder: "asc" | "desc" } => {
  const sortBy =
    sortByRaw === "email" || sortByRaw === "createdAt" || sortByRaw === "updatedAt"
      ? sortByRaw
      : "name";
  const sortOrder = sortOrderRaw?.toLowerCase() === "asc" ? "asc" : "desc";
  return { sortBy, sortOrder };
};

const usernameFromEmail = (email: string) => email.split("@")[0] || email;

const departmentFromRoleName = (roleName: string) => {
  const v = roleName.trim().toLowerCase();
  if (v.includes("super")) return "IT Operations";
  if (v.includes("admin")) return "Network Team";
  if (v.includes("operator")) return "NOC";
  if (v.includes("viewer")) return "IT Support";
  return "Infrastructure";
};

export class UsersService extends DBService<typeof prisma.user> {
  constructor() {
    super(prisma.user);
  }

  findByEmail(email: string) {
    return this.findFirst({
      where: { email },
      include: { userRole: true },
    });
  }

  private toPublicUser(user: User & { userRole: UserRole }): PublicUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      userRoleId: user.userRoleId,
      userRole: user.userRole,
      username: usernameFromEmail(user.email),
      department: departmentFromRoleName(user.userRole.name),
      status: "Active",
      lastLoginAt: user.updatedAt,
    };
  }

  private buildWhere(query: UsersQueryDto): Prisma.UserWhereInput {
    const where: Prisma.UserWhereInput = {};
    const q = query.q?.trim();
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
      ];
    }

    const roleId = query.roleId ? Number(query.roleId) : undefined;
    if (Number.isFinite(roleId)) {
      where.userRoleId = roleId as number;
    }

    return where;
  }

  async list(query: UsersQueryDto): Promise<UsersListResult> {
    const page = clampInt(query.page, 1, 1, 10_000);
    const limit = clampInt(query.limit, 10, 1, 100);
    const skip = (page - 1) * limit;

    const where = this.buildWhere(query);
    const { sortBy, sortOrder } = normalizeSort(query.sortBy, query.sortOrder);

    const [total, users] = await prisma.$transaction([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        include: { userRole: true },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
    ]);

    let data = users.map((u) => this.toPublicUser(u));

    const statusFilter = query.status?.trim().toLowerCase();
    if (statusFilter && statusFilter !== "all") {
      data = data.filter((u) => u.status.toLowerCase() === statusFilter);
    }

    const deptFilter = query.department?.trim().toLowerCase();
    if (deptFilter && deptFilter !== "all") {
      data = data.filter((u) => u.department.toLowerCase() === deptFilter);
    }

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
      data,
      meta: { page, limit, total, totalPages },
    };
  }

  async stats() {
    const totalUsers = await prisma.user.count();

    const roleCounts = await prisma.userRole.findMany({
      orderBy: { id: "asc" },
      include: { _count: { select: { users: true } } },
    });

    const byExactName = (name: string) => {
      const n = name.trim().toLowerCase();
      return roleCounts
        .filter((r) => r.name.trim().toLowerCase() === n)
        .reduce((acc, r) => acc + r._count.users, 0);
    };

    return {
      cards: {
        totalUsers,
        activeUsers: totalUsers,
        superAdmins: byExactName("super admin"),
        itAdmins: byExactName("it admin"),
        managers: byExactName("manager"),
        employees: byExactName("employee"),
      },
      roleDistribution: roleCounts.map((r) => ({
        id: r.id,
        name: r.name,
        count: r._count.users,
      })),
    };
  }

  async getById(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { userRole: true },
    });
    return user ? this.toPublicUser(user) : null;
  }

  async createUser(body: CreateUserDto) {
    const existing = await prisma.user.findFirst({ where: { email: body.email } });
    if (existing) {
      throw new Error("Email is already in use");
    }

    const role = await prisma.userRole.findUnique({ where: { id: body.userRoleId } });
    if (!role) {
      throw new Error("Invalid role");
    }

    const passwordHash = await Bun.password.hash(body.password, {
      algorithm: "bcrypt",
      cost: 10,
    });

    const created = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        passwordHash,
        userRoleId: body.userRoleId,
      },
      include: { userRole: true },
    });

    return this.toPublicUser(created);
  }

  async updateUser(id: number, body: UpdateUserDto) {
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return null;

    let passwordHash: string | undefined;
    if (body.password) {
      passwordHash = await Bun.password.hash(body.password, {
        algorithm: "bcrypt",
        cost: 10,
      });
    }

    if (body.email && body.email !== existing.email) {
      const emailUsed = await prisma.user.findFirst({ where: { email: body.email } });
      if (emailUsed) {
        throw new Error("Email is already in use");
      }
    }

    if (body.userRoleId) {
      const role = await prisma.userRole.findUnique({ where: { id: body.userRoleId } });
      if (!role) {
        throw new Error("Invalid role");
      }
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        name: body.name ?? undefined,
        email: body.email ?? undefined,
        passwordHash: passwordHash ?? undefined,
        userRoleId: body.userRoleId ?? undefined,
      },
      include: { userRole: true },
    });

    return this.toPublicUser(updated);
  }

  async removeUser(id: number) {
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return null;
    await prisma.user.delete({ where: { id } });
    return true;
  }
}
