import { Router } from "express";
import { applyJob } from "../controllers/candidate.controllers";

const candidateRouter: Router = Router();

candidateRouter.post("/apply/:jobId",  applyJob as any);

export default candidateRouter;