import express from "express";
import {
  createDataTrackingCCTV,
  getAllDataTrackingCCTV,
  getDataTrackingCCTVById,
  updateDataTrackingCCTV,
  deleteDataTrackingCCTV
} from "../controllers/data_tracking_cctv_controller.js";

const router = express.Router();

router.post("/", createDataTrackingCCTV);
router.get("/", getAllDataTrackingCCTV);
router.get("/:id", getDataTrackingCCTVById);
router.put("/:id", updateDataTrackingCCTV);
router.delete("/:id", deleteDataTrackingCCTV);

export default router; 