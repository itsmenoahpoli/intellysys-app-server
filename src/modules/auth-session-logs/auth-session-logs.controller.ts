import { HttpStatus } from "@/utils";
import type { SetContext } from "../base.controller";
import type { AuthSessionLogsQueryDto } from "./auth-session-logs.dto";
import { AuthSessionLogsService } from "./auth-session-logs.service";

export class AuthSessionLogsController {
  constructor(private readonly authSessionLogs: AuthSessionLogsService) {}

  public list = async (query: AuthSessionLogsQueryDto, set: SetContext) => {
    const result = await this.authSessionLogs.list(query);
    set.status = HttpStatus.OK;
    return { success: true, ...result };
  };

  public getById = async (id: number, set: SetContext) => {
    const log = await this.authSessionLogs.getById(id);
    if (!log) {
      set.status = HttpStatus.NOT_FOUND;
      return { success: false, message: "Auth session log not found" };
    }
    set.status = HttpStatus.OK;
    return { success: true, data: log };
  };

  public getMyLogs = async (
    userId: number,
    query: AuthSessionLogsQueryDto,
    set: SetContext,
  ) => {
    const result = await this.authSessionLogs.getUserLogs(userId, query);
    set.status = HttpStatus.OK;
    return { success: true, ...result };
  };
}
