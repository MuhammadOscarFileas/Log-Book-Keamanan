import express from "express";
import {
  createSuspiciousForm,
  getAllSuspiciousForm,
  getSuspiciousFormById,
  updateSuspiciousForm,
  deleteSuspiciousForm
} from "../controllers/suspicious_form_controller.js";

const router = express.Router();

router.post("/", createSuspiciousForm);
router.get("/", getAllSuspiciousForm);
router.get("/:id", getSuspiciousFormById);
router.put("/:id", updateSuspiciousForm);
router.delete("/:id", deleteSuspiciousForm);

export default router; 