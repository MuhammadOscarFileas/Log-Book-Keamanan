import express from "express";
import {
  createLogbookKargo,
  getAllLogbookKargo,
  getLogbookKargoById,
  updateLogbookKargo,
  deleteLogbookKargo
} from "../controllers/logbook_kargo_controller.js";

const router = express.Router();

router.post("/", createLogbookKargo);
router.get("/", getAllLogbookKargo);
router.get("/:id", getLogbookKargoById);
router.put("/:id", updateLogbookKargo);
router.delete("/:id", deleteLogbookKargo);

export default router; 