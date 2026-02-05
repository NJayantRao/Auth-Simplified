import express from "express";
const app = express();
import { dbConnection } from "../config/db.js";
import { userRouter } from "./routes/user.route.js";

app.use(express.json())

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/health", (req, res) => {
  res.status(200).json({statusCode:200,message:"Server up n running..."})
});

app.use("/api/v1/user",userRouter)
export default app