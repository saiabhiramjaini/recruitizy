import { Router } from "express";
import {
  addCompany,
  addHr,
  getAllHrs,
  getCompanyDetails,
  getJobPostings,
} from "../controllers/admin.controllers";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware";

const adminRouter: Router = Router();

adminRouter.post("/company", adminAuthMiddleware as any, addCompany as any);
adminRouter.post("/hr", adminAuthMiddleware as any, addHr as any);
adminRouter.get(
  "/company",
  adminAuthMiddleware as any,
  getCompanyDetails as any
);
adminRouter.get("/hr", adminAuthMiddleware as any, getAllHrs as any);
adminRouter.get("/job-postings", adminAuthMiddleware as any, getJobPostings as any);

export default adminRouter;
