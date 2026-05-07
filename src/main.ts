import "dotenv/config";
import { app } from "./app.bootstrap";
import { logger } from "./utils";
import { EnvVariablesConfig } from "./config";

const { getEnvValue, validateRequiredEnv } = EnvVariablesConfig;

validateRequiredEnv();

const PORT = getEnvValue<number>("APP_PORT");

app.listen(PORT, () => {
  logger.info(
    `[Inventala API] API baseurl running in http://localhost:${PORT}`,
  );
  logger.info(
    `[Inventala API] API swagger docs running in http://localhost:${PORT}/swagger`,
  );
});

const gracefulShutdown = async (signal: string) => {
  logger.info(`[Inventala API] Received ${signal}. Shutting down!`);

  try {
    await app.stop?.();
    logger.info(`[Inventala API] Graceful shutdown successfully`);
    process.exit(0);
  } catch (error) {
    logger.error(`[Inventala API] Gracefull shutdown failed due to ${error}`);
    process.exit(1);
  }
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
