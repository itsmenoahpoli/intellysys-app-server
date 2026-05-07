import { Elysia } from "elysia";
import { jwt } from "@elysia/jwt";
import { EnvVariablesConfig } from "@/config";

const { getEnvValue } = EnvVariablesConfig;

export const jwtPlugin = new Elysia().use(
  jwt({
    name: "jwt",
    secret: getEnvValue<string>("APP_JWT_SECRET"),
  }),
);
