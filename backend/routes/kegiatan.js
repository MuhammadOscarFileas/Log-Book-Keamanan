import express from "express";
import { createKegiatan, getAllKegiatan, getKegiatanById, updateKegiatan, deleteKegiatan } from "../controllers/kegiatanController.js";
import { verifyToken } from "../middleware/verifytoken.js";

const router = express.Router();

// router.post("/",verifyToken, createKegiatan);
// router.get("/",verifyToken, getAllKegiatan);
// router.get("/:id",verifyToken, getKegiatanById);
// router.put("/:id",verifyToken, updateKegiatan);
// router.delete("/:id",verifyToken, deleteKegiatan);

router.post("/", createKegiatan);
router.get("/", getAllKegiatan);
router.get("/:id", getKegiatanById);
router.put("/:id", updateKegiatan);
router.delete("/:id", deleteKegiatan);

export default router; 