import { Router } from "express";
import { createJob, getAllJobs, getJobById } from "../controllers/job.controllers";
import { hrAuthMiddleware } from "../middlewares/hrAuth.middleware";

const jobRouter: Router = Router();

jobRouter.post("/", hrAuthMiddleware as any, createJob as any);
jobRouter.get("/",  getAllJobs as any); 
jobRouter.get("/:id",  getJobById as any);

export default jobRouter;