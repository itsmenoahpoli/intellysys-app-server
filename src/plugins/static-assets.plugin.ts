import { Elysia } from "elysia";
import { staticPlugin } from "@elysia/static";

export const staticAssetsPlugin = new Elysia().use(staticPlugin());
