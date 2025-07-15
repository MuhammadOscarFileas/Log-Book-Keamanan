import express from "express";
import {
  createWalkingPatrolTerminal,
  getAllWalkingPatrolTerminal,
  getWalkingPatrolTerminalById,
  updateWalkingPatrolTerminal,
  deleteWalkingPatrolTerminal
} from "../controllers/walking_patrol_terminal_controller.js";

const router = express.Router();

router.post("/", createWalkingPatrolTerminal);
router.get("/", getAllWalkingPatrolTerminal);
router.get("/:id", getWalkingPatrolTerminalById);
router.put("/:id", updateWalkingPatrolTerminal);
router.delete("/:id", deleteWalkingPatrolTerminal);

export default router; 