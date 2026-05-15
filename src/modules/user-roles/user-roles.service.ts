import { prisma } from "@/database";
import { DBService } from "../db.service";

export class UserRolesService extends DBService<typeof prisma.userRole> {
  constructor() {
    super(prisma.userRole);
  }

  async list() {
    const roles = await prisma.userRole.findMany({ orderBy: { id: "asc" } });
    const seen = new Set<string>();
    return roles.filter((r) => {
      const key = r.name.trim().toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
}

