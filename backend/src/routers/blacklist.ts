import { Router } from "express";
import {
  addToBlacklist,
  listBlacklist,
  removeFromBlacklist,
} from "../controllers/blacklist";
import { requireAuth } from "../middleware/requireAuth";

const blacklistRouter = Router();

blacklistRouter.get("/", requireAuth, listBlacklist);
blacklistRouter.post("/", requireAuth, addToBlacklist);
blacklistRouter.delete("/:domain", requireAuth, removeFromBlacklist);

export default blacklistRouter;
