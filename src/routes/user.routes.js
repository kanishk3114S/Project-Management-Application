import { Router } from "express";
import { registerUser } from "../controllers/auth.user.js";

const hamaraRouter = Router()
hamaraRouter.route("/register").post(registerUser)

export default hamaraRouter;

