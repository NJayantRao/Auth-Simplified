import * as arctic from "arctic";
import { ENV } from "../lib/env.js";

export const github = new arctic.GitHub(
  ENV.GITHUB_CLIENT_ID,
  ENV.GITHUB_CLIENT_SECRET,
  "http://localhost:5000/api/v1/auth/github/callback"
);
