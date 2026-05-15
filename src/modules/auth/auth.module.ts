import { AuthSessionLogsService } from "../auth-session-logs/auth-session-logs.service";
import { UsersService } from "../users/users.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthRouter } from "./auth.router";

export const AuthModule = () => {
  const usersService = new UsersService();
  const authSessionLogsService = new AuthSessionLogsService();
  const service = new AuthService(usersService);
  const controller = new AuthController(service, authSessionLogsService);

  return AuthRouter(controller);
};
