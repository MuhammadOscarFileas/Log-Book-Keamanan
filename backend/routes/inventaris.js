import express from "express";
import { createInventaris, getAllInventaris, getInventarisById, updateInventaris, deleteInventaris } from "../controllers/inventarisController.js";
import { verifyToken } from "../middleware/verifytoken.js";

const router = express.Router();

// router.post("/",verifyToken, createInventaris);
// router.get("/",verifyToken, getAllInventaris);
// router.get("/:id",verifyToken, getInventarisById);
// router.put("/:id",verifyToken, updateInventaris);
// router.delete("/:id",verifyToken, deleteInventaris);

router.post("/", createInventaris);
router.get("/", getAllInventaris);
router.get("/:id", getInventarisById);
router.put("/:id", updateInventaris);
router.delete("/:id", deleteInventaris);

export default router; 