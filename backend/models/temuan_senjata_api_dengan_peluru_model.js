import { DataTypes } from "sequelize";
import db from "../config/database.js";

const TemuanSenjataApiDenganPeluru = db.define(
  "temuan_senjata_api_dengan_peluru",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "user_id"
      }
    },
    nama_pax: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nama_instansi: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nomor_flight: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tujuan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jenis_senjata_api: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jml_senjata_api: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    jml_magazine: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    jml_peluru: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nomor_ijin_kepemilikan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ttd_airline: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ttd_airport_security: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  { timestamps: false }
);

export default TemuanSenjataApiDenganPeluru; 