import { UsersController } from "./users.controller";
import { UsersRouter } from "./users.router";
import { UsersService } from "./users.service";

export const UsersModule = () => {
  const service = new UsersService();
  const controller = new UsersController(service);
  return UsersRouter(controller);
};

