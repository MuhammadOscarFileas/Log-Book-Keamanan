import express from "express";
import {
  createLogbookPatroliRandom,
  getAllLogbookPatroliRandom,
  getLogbookPatroliRandomById,
  updateLogbookPatroliRandom,
  deleteLogbookPatroliRandom
} from "../controllers/logbook_patroli_random_controller.js";

const router = express.Router();

router.post("/", createLogbookPatroliRandom);
router.get("/", getAllLogbookPatroliRandom);
router.get("/:id", getLogbookPatroliRandomById);
router.put("/:id", updateLogbookPatroliRandom);
router.delete("/:id", deleteLogbookPatroliRandom);

export default router; 