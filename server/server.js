import app from "./src/app.js"
import { ENV } from "./src/lib/env.js";

const port = ENV.PORT || 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
