import { Router } from "express";
import {
  createInitialAdmin,
  login,
  refresh,
  logout,
} from "../controllers/auth";

const authRouter = Router();

// --- Auth Routes ---
authRouter.post("/create-admin", createInitialAdmin);
authRouter.post("/login", login);
authRouter.post("/refresh", refresh);
authRouter.post("/logout", logout);

export default authRouter;