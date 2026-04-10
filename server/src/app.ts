import express from "express";
import { rootRouter } from "./routes/root.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger-output.json" with { type: "json" };
import cookieParser from "cookie-parser";
import { rateLimiter } from "./middlewares/rate-limit-middleware.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", 1);
app.use(rateLimiter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("", rootRouter);
app.use("/api/v1/auth", authRouter);

export default app;
