import { DataTypes } from "sequelize";
import db from "../config/database.js";

const LogbookRA = db.define(
  "logbook_ra",
  {
    jam: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    nomor_polisi: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nomor_seal: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    personel_avsec_ra: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    petugas_acceptance: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pengemudi_kargo_ra: {
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

export default LogbookRA; 