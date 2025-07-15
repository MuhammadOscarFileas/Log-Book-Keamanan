import express from "express";
import {
  createBehaviorForm,
  getAllBehaviorForm,
  getBehaviorFormById,
  updateBehaviorForm,
  deleteBehaviorForm
} from "../controllers/behavior_form_controller.js";

const router = express.Router();

router.post("/", createBehaviorForm);
router.get("/", getAllBehaviorForm);
router.get("/:id", getBehaviorFormById);
router.put("/:id", updateBehaviorForm);
router.delete("/:id", deleteBehaviorForm);

export default router; 