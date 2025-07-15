import express from "express";
import {
  createLogbookPenggunaanSmartDoorGate,
  getAllLogbookPenggunaanSmartDoorGate,
  getLogbookPenggunaanSmartDoorGateById,
  updateLogbookPenggunaanSmartDoorGate,
  deleteLogbookPenggunaanSmartDoorGate
} from "../controllers/logbook_penggunaan_smart_door_gate_controller.js";

const router = express.Router();

router.post("/", createLogbookPenggunaanSmartDoorGate);
router.get("/", getAllLogbookPenggunaanSmartDoorGate);
router.get("/:id", getLogbookPenggunaanSmartDoorGateById);
router.put("/:id", updateLogbookPenggunaanSmartDoorGate);
router.delete("/:id", deleteLogbookPenggunaanSmartDoorGate);

export default router; 