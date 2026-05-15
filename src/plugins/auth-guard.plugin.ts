import { Elysia } from "elysia";
import { HttpStatus } from "@/utils";
import { jwtPlugin } from "./jwt.plugin";
import { isJwtTokenRevoked } from "@/modules/token-blacklist/token-blacklist.service";
import type { AuthUserContext } from "@/types/auth";

const getBearerToken = (req: Request) => {
  const raw = req.headers.get("authorization") || req.headers.get("Authorization");
  if (!raw) return null;
  const v = raw.trim();
  if (!v.toLowerCase().startsWith("bearer ")) return null;
  const token = v.slice(7).trim();
  return token.length ? token : null;
};

export const authGuardPlugin = new Elysia({ name: "authGuard" })
  .use(jwtPlugin)
  .derive(async ({ request, jwt }) => {
    const token = getBearerToken(request);
    if (!token) {
      return { authUser: null as AuthUserContext | null };
    }

    const payload = await jwt.verify(token);
    if (!payload) {
      return { authUser: null as AuthUserContext | null };
    }

    const jti = (payload as { jti?: string }).jti;
    if (!jti) {
      return { authUser: null as AuthUserContext | null };
    }

    const revoked = await isJwtTokenRevoked(jti);
    if (revoked) {
      return { authUser: null as AuthUserContext | null };
    }

    const userId = Number((payload as { sub?: string }).sub);
    if (!Number.isFinite(userId)) {
      return { authUser: null as AuthUserContext | null };
    }

    const authUser: AuthUserContext = {
      userId,
      email: String((payload as { email?: string }).email ?? ""),
      name: String((payload as { name?: string }).name ?? ""),
      userRoleId: Number((payload as { userRoleId?: number }).userRoleId ?? 0),
      userRoleName: String((payload as { userRoleName?: string }).userRoleName ?? ""),
    };

    return { authUser };
  })
  .onBeforeHandle(({ authUser, set }) => {
    if (!authUser) {
      set.status = HttpStatus.UNAUTHORIZED;
      return { success: false, message: "Unauthorized" };
    }
  });
