import app from "./app.js";
import connectToDB from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { connectToTransporter } from "./lib/nodemailer.js";
import { connectToRedis } from "./lib/redis.js";

const port = ENV.PORT || 5000;

(async function () {
  app.listen(port, () => {
    console.log(`✅✅ Server running on port ${port}...`);
  });
  connectToDB();
  await connectToTransporter();
  await connectToRedis();
})();
