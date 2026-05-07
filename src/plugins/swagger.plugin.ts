import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";

export const swaggerPlugin = new Elysia().use(
  swagger({
    documentation: {
      info: {
        title: "Intellysys API Docs",
        version: "1.0.0",
        description:
          "A automated swagger API documentation for Inventala backend application",
      },
    },
    scalarConfig: {
      hideDarkModeToggle: true,
      showDeveloperTools: "never",
      hideSearch: true,
      hideDownloadButton: true,
      showSidebar: false,
    } as any,
  }),
);
