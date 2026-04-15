import * as arctic from "arctic";
import { ENV } from "../lib/env.js";

export const google = new arctic.Google(
  ENV.CLIENT_ID,
  ENV.CLIENT_SECRET,
  "http://localhost:5000/api/v1/auth/google/callback"
);
