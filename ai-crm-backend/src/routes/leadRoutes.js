import express from "express";
import * as leadController from "../controller/leadController.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public: list and get can be limited by roles — here we require auth for all
router.get("/", authenticate, leadController.listLeads);
router.post("/", authenticate, authorizeRoles(["ADMIN", "AGENT"]), leadController.createLead);

router.get("/:id", authenticate, leadController.getLead);
router.put("/:id", authenticate, authorizeRoles(["ADMIN", "AGENT"]), leadController.updateLead);
router.delete("/:id", authenticate, authorizeRoles(["ADMIN"]), leadController.deleteLead);

// Convert lead to customer
router.post("/:id/convert", authenticate, authorizeRoles(["ADMIN", "AGENT"]), leadController.convertLead);

export default router;
