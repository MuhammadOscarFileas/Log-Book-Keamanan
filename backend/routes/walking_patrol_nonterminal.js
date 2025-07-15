import express from "express";
import {
  createWalkingPatrolNonTerminal,
  getAllWalkingPatrolNonTerminal,
  getWalkingPatrolNonTerminalById,
  updateWalkingPatrolNonTerminal,
  deleteWalkingPatrolNonTerminal
} from "../controllers/walking_patrol_nonterminal_controller.js";

const router = express.Router();

router.post("/", createWalkingPatrolNonTerminal);
router.get("/", getAllWalkingPatrolNonTerminal);
router.get("/:id", getWalkingPatrolNonTerminalById);
router.put("/:id", updateWalkingPatrolNonTerminal);
router.delete("/:id", deleteWalkingPatrolNonTerminal);

export default router; 