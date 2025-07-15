import { DataTypes } from "sequelize";
import db from "../config/database.js";

const LogbookKargo = db.define(
  "logbook_kargo",
  {
    jam: { 
      type: DataTypes.TIME,
      allowNull: false,
    },
    nopol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    no_seal: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nama_personel_avsec_ra: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nama_petugas_acceptance: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nama_pengemudi_ra: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  { timestamps: false, freezeTableName: true }
);

export default LogbookKargo; 