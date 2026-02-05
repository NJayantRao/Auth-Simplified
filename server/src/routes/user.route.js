import express from "express"
import { userRegister } from "../controllers/user.controller.js"
import { registerUserValidation } from "../middlewares/validator.js"

const router= express.Router()
const userRouter= router

router.post("/register",registerUserValidation,userRegister)

export {userRouter}