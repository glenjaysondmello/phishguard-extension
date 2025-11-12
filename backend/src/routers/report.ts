import { Router } from "express";
import { createReport, listReports } from "../controllers/reports";
import { requireAuth } from "../middleware/requireAuth";

const reportRouter = Router();

reportRouter.get("/", requireAuth, listReports);
reportRouter.post("/", createReport);

export default reportRouter;