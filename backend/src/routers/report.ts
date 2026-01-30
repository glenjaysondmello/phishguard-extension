import { Router } from "express";
import { createReport, removeReport,listReports, updateReportStatus } from "../controllers/reports";
import { requireAuth } from "../middleware/requireAuth";

const reportRouter = Router();

reportRouter.get("/", requireAuth, listReports);
reportRouter.post("/", createReport);
reportRouter.patch("/:reportId/status", requireAuth, updateReportStatus);
reportRouter.delete("/:reportId", requireAuth, removeReport);

export default reportRouter;