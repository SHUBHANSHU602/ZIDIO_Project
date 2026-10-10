import "dotenv/config";
import { createApp } from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/db.js";

const port = Number(process.env.PORT || 5000);

async function start() {
  await connectDatabase();

  const app = createApp();
  const server = app.listen(port, () => {
    console.log(`IntellMeet API listening on port ${port}`);
  });

  const shutdown = async (signal) => {
    console.log(`${signal} received, shutting down`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
