import { prisma } from "@/database";

export type RevokeJwtInput = {
  jti: string;
  userId?: number;
  expiresAt?: Date;
};

export async function revokeJwtToken(input: RevokeJwtInput) {
  return prisma.revokedJwt.upsert({
    where: { jti: input.jti },
    create: {
      jti: input.jti,
      userId: input.userId,
      expiresAt: input.expiresAt,
    },
    update: {
      userId: input.userId,
      expiresAt: input.expiresAt,
    },
  });
}

export async function isJwtTokenRevoked(jti: string) {
  const row = await prisma.revokedJwt.findUnique({ where: { jti } });
  if (!row) return false;
  if (!row.expiresAt) return true;
  return row.expiresAt.getTime() > Date.now();
}

