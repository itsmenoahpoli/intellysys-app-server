import { HttpStatus } from "@/utils";
import { BaseController, SetContext } from "../base.controller";
import { AuthSessionLogsService } from "../auth-session-logs/auth-session-logs.service";
import { revokeJwtToken } from "../token-blacklist/token-blacklist.service";
import { AuthService } from "./auth.service";
import { SignInDto } from "./auth.dto";

type JwtContext = {
  sign: (payload: {
    sub: string;
    email: string;
    name: string;
    userRoleId: number;
    userRoleName: string;
    jti: string;
    exp?: string | number;
  }) => Promise<string>;
  verify: (token: string) => Promise<any>;
};

type RequestContext = {
  request: Request;
};

export class AuthController extends BaseController {
  constructor(
    private authService: AuthService,
    private authSessionLogs: AuthSessionLogsService,
  ) {
    super();
  }

  private getBearerToken(request: Request) {
    const raw =
      request.headers.get("authorization") || request.headers.get("Authorization");
    if (!raw) return null;
    const v = raw.trim();
    if (!v.toLowerCase().startsWith("bearer ")) return null;
    const token = v.slice(7).trim();
    return token.length ? token : null;
  }

  public signIn = async (
    body: SignInDto,
    set: SetContext,
    jwt: JwtContext,
    requestCtx: RequestContext,
  ) => {
    const user = await this.authService.verifyCredentials(
      body.email,
      body.password,
    );

    if (!user) {
      set.status = HttpStatus.UNAUTHORIZED;
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    try {
      const headers = requestCtx.request.headers;
      const ipAddress =
        headers.get("x-forwarded-for") ||
        headers.get("x-real-ip") ||
        "unknown";
      const userAgent = headers.get("user-agent") || "unknown";

      await this.authSessionLogs.createLog({
        userId: user.id,
        action: "login",
        ipAddress,
        userAgent,
      });
    } catch {
      // silently fail - don't block login if logging fails
    }

    const token = await jwt.sign({
      sub: String(user.id),
      email: user.email,
      name: user.name,
      userRoleId: user.userRoleId,
      userRoleName: user.userRole.name,
      jti: crypto.randomUUID(),
      exp: "7d",
    });

    set.status = HttpStatus.OK;
    return {
      success: true,
      user: this.authService.toLoginResponse(user),
      token,
    };
  };

  public logout = async (set: SetContext, jwt: JwtContext, requestCtx: RequestContext) => {
    const token = this.getBearerToken(requestCtx.request);
    if (!token) {
      set.status = HttpStatus.UNAUTHORIZED;
      return { success: false, message: "Missing Authorization Bearer token" };
    }

    const payload = await jwt.verify(token);
    if (!payload) {
      set.status = HttpStatus.UNAUTHORIZED;
      return { success: false, message: "Invalid or expired token" };
    }

    const jti = payload?.jti as string | undefined;
    if (!jti) {
      set.status = HttpStatus.BAD_REQUEST;
      return { success: false, message: "Invalid token (missing jti)" };
    }

    const exp = payload?.exp as number | undefined;
    const expiresAt = typeof exp === "number" ? new Date(exp * 1000) : undefined;

    const sub = payload?.sub as string | undefined;
    const userId = sub && Number.isFinite(Number(sub)) ? Number(sub) : undefined;

    await revokeJwtToken({ jti, userId, expiresAt });

    try {
      const headers = requestCtx.request.headers;
      const ipAddress =
        headers.get("x-forwarded-for") ||
        headers.get("x-real-ip") ||
        "unknown";
      const userAgent = headers.get("user-agent") || "unknown";

      if (userId) {
        await this.authSessionLogs.createLog({
          userId,
          action: "logout",
          ipAddress,
          userAgent,
        });
      }
    } catch {
      // silently fail - don't block logout if logging fails
    }

    set.status = HttpStatus.OK;
    return { success: true };
  };

  public requestPasswordReset = async (body: any, set: SetContext) => {
    set.status = 200;

    return {
      success: true,
      body,
    };
  };
}
