import express from "express";
import {
  createLogbookExplosiveDetector,
  getAllLogbookExplosiveDetector,
  getLogbookExplosiveDetectorById,
  updateLogbookExplosiveDetector,
  deleteLogbookExplosiveDetector
} from "../controllers/logbook_explosive_detector_controller.js";

const router = express.Router();

router.post("/", createLogbookExplosiveDetector);
router.get("/", getAllLogbookExplosiveDetector);
router.get("/:id", getLogbookExplosiveDetectorById);
router.put("/:id", updateLogbookExplosiveDetector);
router.delete("/:id", deleteLogbookExplosiveDetector);

export default router; 