import { DataTypes } from "sequelize";
import db from "../config/database.js";

const KegiatanModel = db.define("kegiatan", {
  kegiatan_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  laporan_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  jam_mulai: {
    type: DataTypes.TIME,
  },
  jam_selesai: {
    type: DataTypes.TIME,
  },
  kegiatan: {
    type: DataTypes.TEXT,
  },
  keterangan: {
    type: DataTypes.TEXT,
  },
}, {
  timestamps: false,
});

export default KegiatanModel;
