import { Router } from "express";
import {
  forgotPassword,
  logout,
  signin,
  signup,
  profile,
  resetPassword,
} from "../controllers/adminAuth.controllers";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware";

const adminAuthRouter: Router = Router();

adminAuthRouter.post("/signup", signup as any);
adminAuthRouter.post("/signin", signin as any);
adminAuthRouter.post("/forgot-password", forgotPassword as any);
adminAuthRouter.get("/profile", adminAuthMiddleware as any, profile as any);
adminAuthRouter.post(
  "/reset-password/:token",
  adminAuthMiddleware as any,
  resetPassword as any
);
adminAuthRouter.post("/logout", logout as any);

export default adminAuthRouter;
