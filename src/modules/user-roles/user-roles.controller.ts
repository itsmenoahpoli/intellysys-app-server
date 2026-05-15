import { HttpStatus } from "@/utils";
import type { SetContext } from "../base.controller";
import { UserRolesService } from "./user-roles.service";

export class UserRolesController {
  constructor(private readonly roles: UserRolesService) {}

  public list = async (set: SetContext) => {
    const data = await this.roles.list();
    set.status = HttpStatus.OK;
    return { success: true, data };
  };
}

