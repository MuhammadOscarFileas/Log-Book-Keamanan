import express from "express";
import {
  createChecklistPatrolSisiDarat,
  getAllChecklistPatrolSisiDarat,
  getChecklistPatrolSisiDaratById,
  updateChecklistPatrolSisiDarat,
  deleteChecklistPatrolSisiDarat
} from "../controllers/checklist_patrol_sisi_darat_controller.js";

const router = express.Router();

router.post("/", createChecklistPatrolSisiDarat);
router.get("/", getAllChecklistPatrolSisiDarat);
router.get("/:id", getChecklistPatrolSisiDaratById);
router.put("/:id", updateChecklistPatrolSisiDarat);
router.delete("/:id", deleteChecklistPatrolSisiDarat);

export default router; 