import { EmailNotificationsService } from "./email-notifications.service";

export const EmailNotificationsModule = () => {
  return new EmailNotificationsService();
};

