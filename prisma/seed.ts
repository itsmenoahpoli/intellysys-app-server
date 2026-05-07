import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SUPERADMIN_ROLE_NAME = "superadmin";

const seedEmail =
  process.env.SEED_SUPERADMIN_EMAIL ?? "superadmin@intellysys.local";
const seedPassword =
  process.env.SEED_SUPERADMIN_PASSWORD ?? "changeme";
const seedName = process.env.SEED_SUPERADMIN_NAME ?? "Super Admin";

async function main() {
  let superadminRole = await prisma.userRole.findFirst({
    where: { name: SUPERADMIN_ROLE_NAME },
  });

  if (!superadminRole) {
    superadminRole = await prisma.userRole.create({
      data: { name: SUPERADMIN_ROLE_NAME },
    });
  }

  const passwordHash = await Bun.password.hash(seedPassword, {
    algorithm: "bcrypt",
    cost: 10,
  });

  await prisma.user.upsert({
    where: { email: seedEmail },
    create: {
      email: seedEmail,
      passwordHash,
      name: seedName,
      userRoleId: superadminRole.id,
    },
    update: {
      passwordHash,
      name: seedName,
      userRoleId: superadminRole.id,
    },
  });
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
