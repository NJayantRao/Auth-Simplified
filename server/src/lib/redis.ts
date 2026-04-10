import { Redis } from "ioredis";

const client = new Redis();

if (!client) {
  throw new Error("Failed to create Redis client");
}

const connectToRedis = async () => {
  await client.ping();
  console.log("Redis connected successfully...");
  client.on("error", (err: any) => {
    console.error("❌❌ Redis connection error: ", err);
  });
};

export { client as redisClient, connectToRedis };
