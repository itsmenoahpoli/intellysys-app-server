import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_ROLES = [
  "super admin",
  "it admin",
  "manager",
  "employee",
] as const;

type DefaultRoleName = (typeof DEFAULT_ROLES)[number];

const ROLE_ALIASES: Record<DefaultRoleName, string[]> = {
  "super admin": ["superadmin", "super admin", "super-administrator", "superadministrator"],
  "it admin": ["itadmin", "it admin", "it-administrator", "itadministrator"],
  manager: ["manager"],
  employee: ["employee"],
};

function norm(raw: string) {
  return raw.trim().toLowerCase().replace(/\s+/g, " ");
}

const DEFAULT_USERS: Array<{
  role: DefaultRoleName;
  name: string;
  email: string;
  password: string;
}> = [
  {
    role: "super admin",
    name: process.env.SEED_SUPERADMIN_NAME ?? "Super Admin",
    email: process.env.SEED_SUPERADMIN_EMAIL ?? "superadmin@intellysys.local",
    password: process.env.SEED_SUPERADMIN_PASSWORD ?? "Intellysys@123",
  },
  {
    role: "it admin",
    name: "IT Admin",
    email: "itadmin@intellysys.local",
    password: "Intellysys@123",
  },
  {
    role: "manager",
    name: "Manager",
    email: "manager@intellysys.local",
    password: "Intellysys@123",
  },
  {
    role: "employee",
    name: "Employee",
    email: "employee@intellysys.local",
    password: "Intellysys@123",
  },
];

async function main() {
  // 1) Normalize roles (merge duplicates like `superadmin` vs `super admin`)
  const existingRoles = await prisma.userRole.findMany({ orderBy: { id: "asc" } });

  const keepRoleIdByCanonical = new Map<DefaultRoleName, number>();

  for (const canonical of DEFAULT_ROLES) {
    const aliases = ROLE_ALIASES[canonical].map(norm);

    const matches = existingRoles.filter((r) => aliases.includes(norm(r.name)));
    let keep = matches[0] ?? null;

    if (!keep) {
      keep = await prisma.userRole.create({ data: { name: canonical } });
      keepRoleIdByCanonical.set(canonical, keep.id);
      continue;
    }

    // Ensure kept role has canonical name
    if (norm(keep.name) !== norm(canonical)) {
      keep = await prisma.userRole.update({
        where: { id: keep.id },
        data: { name: canonical },
      });
    }

    keepRoleIdByCanonical.set(canonical, keep.id);

    const duplicates = matches.filter((r) => r.id !== keep!.id);
    for (const dup of duplicates) {
      // Move users to the kept role then delete the duplicate
      await prisma.user.updateMany({
        where: { userRoleId: dup.id },
        data: { userRoleId: keep!.id },
      });
      await prisma.userRole.delete({ where: { id: dup.id } });
    }
  }

  // 2) Seed default users (one per role)
  const rolesByName = new Map<DefaultRoleName, { id: number; name: string }>();
  for (const canonical of DEFAULT_ROLES) {
    const id = keepRoleIdByCanonical.get(canonical);
    if (!id) continue;
    rolesByName.set(canonical, { id, name: canonical });
  }

  for (const u of DEFAULT_USERS) {
    const role = rolesByName.get(u.role);
    if (!role) continue;

    const passwordHash = await Bun.password.hash(u.password, {
      algorithm: "bcrypt",
      cost: 10,
    });

    await prisma.user.upsert({
      where: { email: u.email },
      create: {
        email: u.email,
        passwordHash,
        name: u.name,
        userRoleId: role.id,
      },
      update: {
        passwordHash,
        name: u.name,
        userRoleId: role.id,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
