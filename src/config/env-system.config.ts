import { NodeEnvs } from "@/types/env.d";
import { getEnvValue } from "./env-variables.config";

export const getEnvironment = () => {
  return getEnvValue<string>("NODE_ENV").toUpperCase();
};

export const isDevelopmentEnv = () => {
  return getEnvironment() === NodeEnvs.DEVELOPMENT;
};

export const isStagingEnv = () => {
  return getEnvironment() === NodeEnvs.STAGING;
};

export const isProductionEnv = () => {
  return getEnvironment() === NodeEnvs.PRODUCTION;
};
