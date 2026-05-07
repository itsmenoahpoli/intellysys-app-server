import { type Context } from "elysia";

export type SetContext = Context["set"];

export class BaseController {
  private toJsonResponse = <T>(data: T) => {
    //
  };
}
