import { Router } from "express";
import { hrAuthMiddleware } from "../middlewares/hrAuth.middleware";
import {
  getAllHrJobs,
  getStats,
  getJobStatusDistribution,
  getCandidateStatusDistribution,
  confirmCandidateDecision,
  overrideShortlistToReject,
  overrideRejectToShortlist,
  sendAiAcceptanceEmailController,
  sendAiRejectionEmailController,
} from "../controllers/hr.controllers";

const hrRouter: Router = Router();

hrRouter.get("/all-jobs", hrAuthMiddleware as any, getAllHrJobs as any);
hrRouter.post("/confirm/:id", confirmCandidateDecision as any);
hrRouter.post("/override/reject/:id", overrideShortlistToReject as any);
hrRouter.post("/override/shortlist/:id", overrideRejectToShortlist as any);
hrRouter.get("/stats", hrAuthMiddleware as any, getStats as any);
hrRouter.get(
  "/jobs/status-distribution",
  hrAuthMiddleware as any,
  getJobStatusDistribution as any
);
hrRouter.get(
  "/candidates/status-distribution",
  hrAuthMiddleware as any,
  getCandidateStatusDistribution as any
);

hrRouter.post(
  "/send-email/acceptance/:id",
  hrAuthMiddleware as any,
  sendAiAcceptanceEmailController as any
);

hrRouter.post(
  "/send-email/reject/:id",
  hrAuthMiddleware as any,
  sendAiRejectionEmailController as any
);

export default hrRouter;
