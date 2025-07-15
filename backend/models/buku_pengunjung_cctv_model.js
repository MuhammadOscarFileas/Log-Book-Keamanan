import { DataTypes } from "sequelize";
import db from "../config/database.js";

const BukuPengunjungCCTV = db.define(
  "buku_pengunjung_cctv",
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
    nama_petugas: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nama_pengunjung: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    instansi: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    no_telp: {
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

export default BukuPengunjungCCTV; 