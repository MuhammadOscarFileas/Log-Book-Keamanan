import { DataTypes } from "sequelize";
import db from "../config/database.js";

const LogbookPenggunaanSmartDoorGate = db.define(
  "logbook_penggunaan_smart_door_gate",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "user_id"
      }
    },
    tanggal: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    gate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    instansi: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nama_petugas: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    keperluan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jam_buka: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    jam_tutup: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    petugas_avsec: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  { timestamps: false }
);

export default LogbookPenggunaanSmartDoorGate; 