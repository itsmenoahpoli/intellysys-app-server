import { HttpStatus } from "@/utils";
import type { SetContext } from "../base.controller";
import type { CreateUserDto, UpdateUserDto, UsersQueryDto } from "./users.dto";
import { UsersService } from "./users.service";

export class UsersController {
  constructor(private readonly users: UsersService) {}

  public list = async (query: UsersQueryDto, set: SetContext) => {
    const result = await this.users.list(query);
    set.status = HttpStatus.OK;
    return { success: true, ...result };
  };

  public stats = async (set: SetContext) => {
    const result = await this.users.stats();
    set.status = HttpStatus.OK;
    return { success: true, ...result };
  };

  public getById = async (id: number, set: SetContext) => {
    const user = await this.users.getById(id);
    if (!user) {
      set.status = HttpStatus.NOT_FOUND;
      return { success: false, message: "User not found" };
    }
    set.status = HttpStatus.OK;
    return { success: true, data: user };
  };

  public create = async (body: CreateUserDto, set: SetContext) => {
    try {
      const user = await this.users.createUser(body);
      set.status = HttpStatus.CREATED;
      return { success: true, data: user };
    } catch (e: any) {
      set.status = HttpStatus.BAD_REQUEST;
      return {
        success: false,
        message: typeof e?.message === "string" ? e.message : "Create failed",
      };
    }
  };

  public update = async (id: number, body: UpdateUserDto, set: SetContext) => {
    try {
      const user = await this.users.updateUser(id, body);
      if (!user) {
        set.status = HttpStatus.NOT_FOUND;
        return { success: false, message: "User not found" };
      }
      set.status = HttpStatus.OK;
      return { success: true, data: user };
    } catch (e: any) {
      set.status = HttpStatus.BAD_REQUEST;
      return {
        success: false,
        message: typeof e?.message === "string" ? e.message : "Update failed",
      };
    }
  };

  public remove = async (id: number, set: SetContext) => {
    const removed = await this.users.removeUser(id);
    if (!removed) {
      set.status = HttpStatus.NOT_FOUND;
      return { success: false, message: "User not found" };
    }
    set.status = HttpStatus.NO_CONTENT;
    return null;
  };
}

