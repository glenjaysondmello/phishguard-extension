import cron from "node-cron";
import {
  updatePhishTank,
  updateOpenPhish,
  updateUrlHaus,
} from "../services/feedServices";

export const initScheduler = () => {
  console.log("Threat Intelligence Scheduler Initialized");

  // OpenPhish & URLhaus: Run every 6 hours
  cron.schedule("0 */6 * * *", async () => {
    console.log("Starting scheduled feed updates...");
    await Promise.allSettled([updateOpenPhish(), updateUrlHaus()]);
  });

  // PhishTank: Run once a day (large file) at 3 AM
  cron.schedule("0 3 * * *", async () => {
    console.log("Starting PhishTank update...");
    await updatePhishTank();
  });
};

// OPTIONAL: Manual Trigger for testing via Postman
import { Request, Response } from "express";
export const manualUpdateController = async (req: Request, res: Response) => {
  res.send({ message: "Update started in background." });

  // Run async without blocking response
  await Promise.allSettled([
    updateOpenPhish(),
    updateUrlHaus(),
    updatePhishTank(),
  ]);
};
