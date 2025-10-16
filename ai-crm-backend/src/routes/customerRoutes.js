import express from "express";
import * as customerController from "../controller/customerController.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, customerController.listCustomers);
router.post("/", authenticate, authorizeRoles(["ADMIN", "AGENT"]), customerController.createCustomer);

router.get("/:id", authenticate, customerController.getCustomer);
router.put("/:id", authenticate, authorizeRoles(["ADMIN", "AGENT"]), customerController.updateCustomer);
router.delete("/:id", authenticate, authorizeRoles(["ADMIN"]), customerController.deleteCustomer);

export default router;
