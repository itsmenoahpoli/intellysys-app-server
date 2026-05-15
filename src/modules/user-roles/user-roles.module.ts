import { UserRolesController } from "./user-roles.controller";
import { UserRolesRouter } from "./user-roles.router";
import { UserRolesService } from "./user-roles.service";

export const UserRolesModule = () => {
  const service = new UserRolesService();
  const controller = new UserRolesController(service);
  return UserRolesRouter(controller);
};

