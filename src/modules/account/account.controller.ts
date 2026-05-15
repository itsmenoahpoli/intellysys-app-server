import { HttpStatus } from "@/utils";
import type { AuthUserContext } from "@/types/auth";
import type { SetContext } from "../base.controller";
import { AccountService } from "./account.service";
import type { UpdateMyAccountDto, UpdateMyPasswordDto } from "./account.dto";

export class AccountController {
  constructor(private readonly account: AccountService) {}

  public getMe = async (authUser: AuthUserContext, set: SetContext) => {
    const profile = await this.account.getMyAccount(authUser.userId);
    if (!profile) {
      set.status = HttpStatus.NOT_FOUND;
      return { success: false, message: "User not found" };
    }

    set.status = HttpStatus.OK;
    return { success: true, data: profile };
  };

  public updateMe = async (
    authUser: AuthUserContext,
    body: UpdateMyAccountDto,
    set: SetContext,
  ) => {
    try {
      const profile = await this.account.updateMyAccount(authUser.userId, body);
      if (!profile) {
        set.status = HttpStatus.NOT_FOUND;
        return { success: false, message: "User not found" };
      }

      set.status = HttpStatus.OK;
      return { success: true, data: profile };
    } catch (e: unknown) {
      set.status = HttpStatus.BAD_REQUEST;
      return {
        success: false,
        message: e instanceof Error ? e.message : "Update failed",
      };
    }
  };

  public updatePassword = async (
    authUser: AuthUserContext,
    body: UpdateMyPasswordDto,
    set: SetContext,
  ) => {
    try {
      const updated = await this.account.updateMyPassword(authUser.userId, body);
      if (!updated) {
        set.status = HttpStatus.NOT_FOUND;
        return { success: false, message: "User not found" };
      }

      set.status = HttpStatus.OK;
      return { success: true, message: "Password updated successfully" };
    } catch (e: unknown) {
      set.status = HttpStatus.BAD_REQUEST;
      return {
        success: false,
        message: e instanceof Error ? e.message : "Password update failed",
      };
    }
  };
}
