import express from "express";
import { rootRouter } from "./routes/root.routes.js";
import { authRouter } from "./routes/auth.routes.js";

const app = express();

app.use(express.json());

app.use("", rootRouter);
app.use("/api/v1/auth", authRouter);

export default app;
