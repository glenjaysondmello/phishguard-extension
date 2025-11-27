import { Router } from "express";
import { createReport, removeReport,listReports } from "../controllers/reports";
import { requireAuth } from "../middleware/requireAuth";

const reportRouter = Router();

reportRouter.get("/", requireAuth, listReports);
reportRouter.post("/", createReport);
reportRouter.delete("/:reportId", requireAuth, removeReport);

export default reportRouter;