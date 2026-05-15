import { prisma } from "@/database";
import type { User, UserRole } from "@prisma/client";
import type { UpdateMyAccountDto, UpdateMyPasswordDto } from "./account.dto";

export type MyAccountProfile = {
  id: number;
  name: string;
  email: string;
  userRoleId: number;
  userRole: Pick<UserRole, "id" | "name">;
  createdAt: Date;
  updatedAt: Date;
};

export class AccountService {
  private toProfile(user: User & { userRole: UserRole }): MyAccountProfile {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      userRoleId: user.userRoleId,
      userRole: { id: user.userRole.id, name: user.userRole.name },
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async getMyAccount(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { userRole: true },
    });
    return user ? this.toProfile(user) : null;
  }

  async updateMyAccount(userId: number, body: UpdateMyAccountDto) {
    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (!existing) return null;

    if (!body.name && !body.email) {
      throw new Error("No changes provided");
    }

    if (body.email && body.email !== existing.email) {
      const emailUsed = await prisma.user.findFirst({ where: { email: body.email } });
      if (emailUsed) {
        throw new Error("Email is already in use");
      }
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        name: body.name ?? undefined,
        email: body.email ?? undefined,
      },
      include: { userRole: true },
    });

    return this.toProfile(updated);
  }

  async updateMyPassword(userId: number, body: UpdateMyPasswordDto) {
    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (!existing) return null;

    const valid = await Bun.password.verify(body.currentPassword, existing.passwordHash);
    if (!valid) {
      throw new Error("Current password is incorrect");
    }

    if (body.currentPassword === body.newPassword) {
      throw new Error("New password must be different from current password");
    }

    const passwordHash = await Bun.password.hash(body.newPassword, {
      algorithm: "bcrypt",
      cost: 10,
    });

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return true;
  }
}
