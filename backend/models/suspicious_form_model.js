import { DataTypes } from "sequelize";
import db from "../config/database.js";

const SuspiciousForm = db.define(
  "suspicious_form",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "user_id"
      }
    },
    jam: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    petugas: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lokasi: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tindak_lanjut_laporan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
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

export default SuspiciousForm; 