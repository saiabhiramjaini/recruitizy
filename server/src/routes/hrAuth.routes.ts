import { Router } from "express";
import { logout, signin, profile } from "../controllers/hrAuth.controllers";
import { hrAuthMiddleware } from "../middlewares/hrAuth.middleware";

const hrAuthRouter: Router = Router();

hrAuthRouter.post("/signin", signin as any);
hrAuthRouter.get("/profile", hrAuthMiddleware as any, profile as any);
hrAuthRouter.get("/logout", hrAuthMiddleware as any, logout as any);

export default hrAuthRouter;
