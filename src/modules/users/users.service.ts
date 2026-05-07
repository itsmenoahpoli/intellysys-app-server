import { prisma } from "@/database";
import { BaseService } from "../base.service";
import { DBService } from "../db.service";

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
}
