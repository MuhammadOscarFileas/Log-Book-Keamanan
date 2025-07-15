import express from "express";
import {
  createChecklistPatrolSisiUdara,
  getAllChecklistPatrolSisiUdara,
  getChecklistPatrolSisiUdaraById,
  updateChecklistPatrolSisiUdara,
  deleteChecklistPatrolSisiUdara
} from "../controllers/checklist_patrol_sisi_udara_controller.js";

const router = express.Router();

router.post("/", createChecklistPatrolSisiUdara);
router.get("/", getAllChecklistPatrolSisiUdara);
router.get("/:id", getChecklistPatrolSisiUdaraById);
router.put("/:id", updateChecklistPatrolSisiUdara);
router.delete("/:id", deleteChecklistPatrolSisiUdara);

export default router; 