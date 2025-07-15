import express from "express";
import {
  createLogbookRA,
  getAllLogbookRA,
  getLogbookRAById,
  updateLogbookRA,
  deleteLogbookRA
} from "../controllers/logbook_ra_controller.js";

const router = express.Router();

router.post("/", createLogbookRA);
router.get("/", getAllLogbookRA);
router.get("/:id", getLogbookRAById);
router.put("/:id", updateLogbookRA);
router.delete("/:id", deleteLogbookRA);

export default router; 