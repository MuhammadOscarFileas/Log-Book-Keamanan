import express from "express";
import { createLaporan, getAllLaporan, getLaporanById, updateLaporan, deleteLaporan, getLaporanNonDraft } from "../controllers/laporanController.js";
import { verifyToken } from "../middleware/verifytoken.js";

const router = express.Router();

// router.post("/",verifyToken, createLaporan);
// router.get("/",verifyToken, getAllLaporan);
// router.get("/:id",verifyToken, getLaporanById);
// router.put("/:id",verifyToken, updateLaporan);
// router.delete("/:id",verifyToken, deleteLaporan);

router.post("/", createLaporan);
router.get("/", getAllLaporan);
router.get("/non-draft", getLaporanNonDraft);
router.get("/:id", getLaporanById);
router.put("/:id", updateLaporan);
router.delete("/:id", deleteLaporan);

export default router; 