import { AccountController } from "./account.controller";
import { AccountRouter } from "./account.router";
import { AccountService } from "./account.service";

export const AccountModule = () => {
  const service = new AccountService();
  const controller = new AccountController(service);
  return AccountRouter(controller);
};
