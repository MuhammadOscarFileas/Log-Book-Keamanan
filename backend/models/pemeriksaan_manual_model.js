import { DataTypes } from "sequelize";
import db from "../config/database.js";

const PemeriksaanManual = db.define(
  "pemeriksaan_manual",
  {
    jam: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    nama_petugas: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pax: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    flight: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    orang: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    barang: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    temuan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  { timestamps: false, freezeTableName: true }
);

export default PemeriksaanManual; 