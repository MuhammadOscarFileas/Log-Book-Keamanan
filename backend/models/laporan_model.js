import { DataTypes } from "sequelize";
import db from "../config/database.js";

const LaporanModel = db.define("laporan", {
  laporan_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  lokasi: {
    type: DataTypes.STRING, // sesuaikan daftar lokasi
    allowNull: false,
  },
  pos: {
    type: DataTypes.STRING, // sesuaikan daftar pos
    allowNull: false,
  },
  shift: {
    type: DataTypes.ENUM("pagi", "siang", "malam"),
    allowNull: false,
  },
  user_pembuat: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_penerima: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  user_supervisor: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ttd_pembuat: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  ttd_penerima: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  ttd_supervisor: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("draft", "submit to supervisor", "done"),
    defaultValue: "draft",
  },
}, {
  timestamps: true,
  createdAt: "created_at",
  updatedAt: false,
});

export default LaporanModel;
