import { UsersController } from "./users.controller";
import { UsersRouter } from "./users.router";
import { UsersService } from "./users.service";
import { EmailNotificationsModule } from "../email-notifications/email-notifications.module";

export const UsersModule = () => {
  const emailNotifications = EmailNotificationsModule();
  const service = new UsersService(emailNotifications);
  const controller = new UsersController(service);
  return UsersRouter(controller);
};

