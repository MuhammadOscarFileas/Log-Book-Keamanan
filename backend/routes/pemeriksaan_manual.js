import express from "express";
import {
  createPemeriksaanManual,
  getAllPemeriksaanManual,
  getPemeriksaanManualById,
  updatePemeriksaanManual,
  deletePemeriksaanManual
} from "../controllers/pemeriksaan_manual_controller.js";

const router = express.Router();

router.post("/", createPemeriksaanManual);
router.get("/", getAllPemeriksaanManual);
router.get("/:id", getPemeriksaanManualById);
router.put("/:id", updatePemeriksaanManual);
router.delete("/:id", deletePemeriksaanManual);

export default router; 