import { DataTypes } from "sequelize";
import db from "../config/database.js";

const DataTrackingCCTV = db.define(
  "data_tracking_cctv",
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
    nama_petugas_jaga: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nama_pemohon: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    waktu: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    kejadian: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    file_foto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    file_video: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  { timestamps: false }
);

export default DataTrackingCCTV; 