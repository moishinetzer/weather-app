import { remember } from "@epic-web/remember";
import { PrismaClient } from "@prisma/client";

// Remix restarts the server on changes, so this utility helps make
// sure that a singleton instance of PrismaClient is used across.
// p.s. Remix on Vite does not have this issue.
export const db = remember("db", () => {
  return new PrismaClient();
});
