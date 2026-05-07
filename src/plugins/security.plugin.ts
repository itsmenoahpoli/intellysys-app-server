import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
// import { helmet } from "elysia-helmet";
import { rateLimit } from "elysia-rate-limit";
// import { EnvSystemConfig } from "@/config";

// const { isProductionEnv } = EnvSystemConfig;
// const PROD_CSP_CONFIG = {
//   directives: {
//     directives: {
//       defaultSrc: ["'self'"],

//       scriptSrc: [
//         "'self'",
//         "'unsafe-inline'",
//         "'unsafe-eval'",
//         "https://cdn.jsdelivr.net",
//       ],

//       connectSrc: [
//         "'self'",
//         "http://localhost:*",
//         "ws://localhost:*",
//         "https://api.scalar.com",
//       ],

//       imgSrc: ["'self'", "data:", "https://cdn.jsdelivr.net"],
//     },
//   },
// } as any;

export const securityPlugin = new Elysia()
  // TODO: fix implementation of CSP for localhost
  // .use(
  //   helmet({
  //     contentSecurityPolicy: isProductionEnv() ? undefined : PROD_CSP_CONFIG,
  //   }),
  // )
  .use(
    cors({
      origin: ["*"],
      credentials: true,
    }),
  )
  .use(
    rateLimit({
      max: 60,
      duration: 60_000,
      generator: (request) => {
        return request.headers.get("x-forwarded-for") || "127.0.0.1";
      },
    }),
  );
