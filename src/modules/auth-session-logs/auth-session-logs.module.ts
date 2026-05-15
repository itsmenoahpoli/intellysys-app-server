import { AuthSessionLogsController } from "./auth-session-logs.controller";
import { AuthSessionLogsRouter } from "./auth-session-logs.router";
import { AuthSessionLogsService } from "./auth-session-logs.service";

export const AuthSessionLogsModule = () => {
  const service = new AuthSessionLogsService();
  const controller = new AuthSessionLogsController(service);
  return AuthSessionLogsRouter(controller);
};
