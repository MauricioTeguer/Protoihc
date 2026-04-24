import { createServer } from "node:http";
import { env } from "./config/env.js";
import { prisma } from "./config/prisma.js";
import { createApp } from "./app.js";

const app = createApp();
const server = createServer(app);

server.listen(env.PORT, () => {
  console.log(`ExpenTra backend running on http://localhost:${env.PORT}`);
});

async function shutdown(signal: string) {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});
