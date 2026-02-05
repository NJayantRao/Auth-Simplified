import mongoose from "mongoose";
import { ENV } from "../src/lib/env.js";

mongoose.connect(ENV.MONGO_DB_URL)
const dbConnection= mongoose.connection

dbConnection.on("connected",()=>{
    console.log("Database connected successfully") 
})

dbConnection.on("error",(err)=>{
    console.log("Database connection failed", err) 
})

dbConnection.on("disconnected",()=>{
    console.log("Database disconnected") 
})

export {dbConnection}