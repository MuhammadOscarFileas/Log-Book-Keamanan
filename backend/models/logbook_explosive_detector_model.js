import { DataTypes } from "sequelize";
import db from "../config/database.js";

const LogbookExplosiveDetector = db.define(
  "logbook_explosive_detector",
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
    jam: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    flight_penumpang: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nama_penumpang: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    operator_etd: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ttd: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  { timestamps: false }
);

export default LogbookExplosiveDetector; 