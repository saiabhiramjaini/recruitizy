import { Router } from "express";
import { hrAuthMiddleware } from "../middlewares/hrAuth.middleware";
import { getAllHrJobs, makeShortlistMembers } from "../controllers/hr.controllers";

const hrRouter: Router = Router();

hrRouter.get("/:hrId", hrAuthMiddleware as any, getAllHrJobs as any);
hrRouter.post("/:id", hrAuthMiddleware as any, makeShortlistMembers as any);

export default hrRouter;