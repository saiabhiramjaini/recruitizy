import { Router } from "express";
import { hrAuthMiddleware } from "../middlewares/hrAuth.middleware";
import { getAllHrJobs, makeShortlistMembers,getStats, getJobStatusDistribution, getCandidateStatusDistribution } from "../controllers/hr.controllers";

const hrRouter: Router = Router();

hrRouter.get("/all-jobs", hrAuthMiddleware as any, getAllHrJobs as any);
hrRouter.post("/:id", hrAuthMiddleware as any, makeShortlistMembers as any);
hrRouter.get("/stats", hrAuthMiddleware as any, getStats as any);
hrRouter.get("/jobs/status-distribution", hrAuthMiddleware as any, getJobStatusDistribution as any);
hrRouter.get("/candidates/status-distribution", hrAuthMiddleware as any, getCandidateStatusDistribution as any); 

export default hrRouter;