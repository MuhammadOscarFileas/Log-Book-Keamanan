import { DataTypes } from "sequelize";
import db from "../config/database.js";

const ChecklistPatrolSisiDarat = db.define(
  "checklist_patrol_sisi_darat",
  {
    laporan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "laporan",
        key: "laporan_id"
      }
    },
    tanggal: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    area: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    clear: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    catatan_penting: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  { timestamps: false, freezeTableName: true }
);

export default ChecklistPatrolSisiDarat; 