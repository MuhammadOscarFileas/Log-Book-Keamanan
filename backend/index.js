import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/database.js";

// Import semua routes
import userRoutes from "./routes/user.js";
import laporanRoutes from "./routes/laporan.js";
import kegiatanRoutes from "./routes/kegiatan.js";
import inventarisInputRoutes from "./routes/inventarisInput.js";

// Import relasi antar model jika ada (opsional)
// import "./models/association.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware global
app.use(cors({
  origin: ['http://localhost:3000', 'https://bdce956c916f.ngrok-free.app', 'https://w50hv1z0-3000.asse.devtunnels.ms','https://vfd44k84-3000.asse.devtunnels.ms'],
  credentials: true
}));

 // izinkan semua origin, cocok untuk testing

app.use(express.json());

// Daftarkan semua route API
app.use("/api/users", userRoutes);
app.use("/api/laporan", laporanRoutes);
app.use("/api/kegiatan", kegiatanRoutes);
app.use("/api/inventaris-input", inventarisInputRoutes);

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
