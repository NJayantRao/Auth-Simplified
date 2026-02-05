import express from "express";
const app = express();
import { dbConnection } from "../config/db.js";

app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app