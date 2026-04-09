import app from "./app.js";
import { ENV } from "./lib/env.js";

const port = ENV.PORT || 5000;

app.listen(port, () => {
  console.log(`✅✅ Server running on port ${port}...`);
});
