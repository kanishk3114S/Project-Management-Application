import { Router } from "express";
import { HealthCheck } from "../controllers/healthCheck.controllers.js";

const router = Router();

router.route("/").get(HealthCheck); //router which will route to the health check//

export default router;