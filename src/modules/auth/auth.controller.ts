import { HttpStatus } from "@/utils";
import { BaseController, SetContext } from "../base.controller";
import { AuthSessionLogsService } from "../auth-session-logs/auth-session-logs.service";
import { AuthService } from "./auth.service";
import { SignInDto } from "./auth.dto";

type JwtContext = {
  sign: (payload: {
    sub: string;
    email: string;
    name: string;
    userRoleId: number;
    userRoleName: string;
    exp?: string | number;
  }) => Promise<string>;
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
      exp: "7d",
    });

    set.status = HttpStatus.OK;
    return {
      success: true,
      user: this.authService.toLoginResponse(user),
      token,
    };
  };

  public requestPasswordReset = async (body: any, set: SetContext) => {
    set.status = 200;

    return {
      success: true,
      body,
    };
  };
}
