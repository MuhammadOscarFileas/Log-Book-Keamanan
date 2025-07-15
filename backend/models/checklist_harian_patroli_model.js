import { DataTypes } from "sequelize";
import db from "../config/database.js";

const ChecklistHarianPatroli = db.define(
  "checklist_harian_patroli",
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
    kategori: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    kondisi: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: false, freezeTableName: true }
);

export default ChecklistHarianPatroli; 