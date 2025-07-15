import express from "express";
import {
  createChecklistHarianPatroli,
  getAllChecklistHarianPatroli,
  getChecklistHarianPatroliById,
  updateChecklistHarianPatroli,
  deleteChecklistHarianPatroli
} from "../controllers/checklist_harian_patroli_controller.js";

const router = express.Router();

router.post("/", createChecklistHarianPatroli);
router.get("/", getAllChecklistHarianPatroli);
router.get("/:id", getChecklistHarianPatroliById);
router.put("/:id", updateChecklistHarianPatroli);
router.delete("/:id", deleteChecklistHarianPatroli);

export default router; 