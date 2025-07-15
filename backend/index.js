import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/database.js";

// Import semua routes
import userRoutes from "./routes/user.js";
import laporanRoutes from "./routes/laporan.js";
import kegiatanRoutes from "./routes/kegiatan.js";
import inventarisInputRoutes from "./routes/inventarisInput.js";
import checklistPatrolSisiDaratRoutes from "./routes/checklist_patrol_sisi_darat.js";
import checklistPatrolSisiUdaraRoutes from "./routes/checklist_patrol_sisi_udara.js";
import checklistHarianPatroliRoutes from "./routes/checklist_harian_patroli.js";
import walkingPatrolTerminalRoutes from "./routes/walking_patrol_terminal.js";
import walkingPatrolNonTerminalRoutes from "./routes/walking_patrol_nonterminal.js";
import pemeriksaanManualRoutes from "./routes/pemeriksaan_manual.js";
import logbookRaRoutes from "./routes/logbook_ra.js";
import logbookKargoRoutes from "./routes/logbook_kargo.js";
import logbookPatroliRandomRoutes from "./routes/logbook_patroli_random.js";
import dataTrackingCctvRoutes from "./routes/data_tracking_cctv.js";
import logbookPenggunaanSmartDoorGateRoutes from "./routes/logbook_penggunaan_smart_door_gate.js";
import temuanSenjataApiDenganPeluruRoutes from "./routes/temuan_senjata_api_dengan_peluru.js";
import penitipanSenjataApiSelainPenumpangRoutes from "./routes/penitipan_senjata_api_selain_penumpang.js";
import suspiciousFormRoutes from "./routes/suspicious_form.js";
import behaviorFormRoutes from "./routes/behavior_form.js";
import bukuPengunjungCctvRoutes from "./routes/buku_pengunjung_cctv.js";
import logbookExplosiveDetectorRoutes from "./routes/logbook_explosive_detector.js";

// Import relasi antar model jika ada (opsional)
// import "./models/association.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware global
app.use(cors({
  origin: ['http://localhost:3000', 'https://5884c30dbb72.ngrok-free.app', 'https://w50hv1z0-3000.asse.devtunnels.ms','https://vfd44k84-3000.asse.devtunnels.ms'],
  credentials: true
}));

 // izinkan semua origin, cocok untuk testing

app.use(express.json());

// Daftarkan semua route API
app.use("/api/users", userRoutes);
app.use("/api/laporan", laporanRoutes);
app.use("/api/kegiatan", kegiatanRoutes);
app.use("/api/inventaris-input", inventarisInputRoutes);
app.use("/api/checklist-patrol-sisi-darat", checklistPatrolSisiDaratRoutes);
app.use("/api/checklist-patrol-sisi-udara", checklistPatrolSisiUdaraRoutes);
app.use("/api/checklist-harian-patroli", checklistHarianPatroliRoutes);
app.use("/api/walking-patrol-terminal", walkingPatrolTerminalRoutes);
app.use("/api/walking-patrol-nonterminal", walkingPatrolNonTerminalRoutes);
app.use("/api/pemeriksaan-manual", pemeriksaanManualRoutes);
app.use("/api/logbook-ra", logbookRaRoutes);
app.use("/api/logbook-kargo", logbookKargoRoutes);
app.use("/api/logbook-patroli-random", logbookPatroliRandomRoutes);
app.use("/api/data-tracking-cctv", dataTrackingCctvRoutes);
app.use("/api/logbook-penggunaan-smart-door-gate", logbookPenggunaanSmartDoorGateRoutes);
app.use("/api/temuan-senjata-api-dengan-peluru", temuanSenjataApiDenganPeluruRoutes);
app.use("/api/penitipan-senjata-api-selain-penumpang", penitipanSenjataApiSelainPenumpangRoutes);
app.use("/api/suspicious-form", suspiciousFormRoutes);
app.use("/api/behavior-form", behaviorFormRoutes);
app.use("/api/buku-pengunjung-cctv", bukuPengunjungCctvRoutes);
app.use("/api/logbook-explosive-detector", logbookExplosiveDetectorRoutes);

// Root path
app.get("/", (req, res) => {
  res.json({ msg: "🌐 API Log Book Security aktif dan berjalan" });
});

// Start server
const startServer = async () => {
  try {
    await db.authenticate();
    console.log("✅ Database connected...");
         await db.sync({ alter: true }); // aktifkan jika ingin sync otomatis
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database connection error:", error);
  }
};

startServer();
