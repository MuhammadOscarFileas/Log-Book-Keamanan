import express from "express";
import {
  createTemuanSenjataApiDenganPeluru,
  getAllTemuanSenjataApiDenganPeluru,
  getTemuanSenjataApiDenganPeluruById,
  updateTemuanSenjataApiDenganPeluru,
  deleteTemuanSenjataApiDenganPeluru
} from "../controllers/temuan_senjata_api_dengan_peluru_controller.js";

const router = express.Router();

router.post("/", createTemuanSenjataApiDenganPeluru);
router.get("/", getAllTemuanSenjataApiDenganPeluru);
router.get("/:id", getTemuanSenjataApiDenganPeluruById);
router.put("/:id", updateTemuanSenjataApiDenganPeluru);
router.delete("/:id", deleteTemuanSenjataApiDenganPeluru);

export default router; 