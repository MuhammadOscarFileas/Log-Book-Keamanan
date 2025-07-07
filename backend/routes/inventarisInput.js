import express from "express";
import { createInventarisInput, getAllInventarisInput, getInventarisInputById, updateInventarisInput, deleteInventarisInput } from "../controllers/inventarisInputController.js";
import { verifyToken } from "../middleware/verifytoken.js";

const router = express.Router();

// router.post("/",verifyToken, createInventarisInput);
// router.get("/",verifyToken, getAllInventarisInput);
// router.get("/:id",verifyToken, getInventarisInputById);
// router.put("/:id",verifyToken, updateInventarisInput);
// router.delete("/:id",verifyToken, deleteInventarisInput);

router.post("/", createInventarisInput);
router.get("/", getAllInventarisInput);
router.get("/:id", getInventarisInputById);
router.put("/:id", updateInventarisInput);
router.delete("/:id", deleteInventarisInput);

export default router; 