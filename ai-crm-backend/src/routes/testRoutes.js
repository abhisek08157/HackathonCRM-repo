import express from "express";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only logged-in users
router.get("/me", authenticate, (req, res) => {
  res.json({ user: req.user });
});

// Only admin
router.get("/admin", authenticate, authorizeRoles(["ADMIN"]), (req, res) => {
  res.json({ secret: "Admin access granted" });
});

export default router;
