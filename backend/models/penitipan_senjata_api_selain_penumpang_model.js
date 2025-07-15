import { DataTypes } from "sequelize";
import db from "../config/database.js";

const PenitipanSenjataApiSelainPenumpang = db.define(
  "penitipan_senjata_api_selain_penumpang",
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
    nama_pemilik_senjata: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    data_penumpang: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    no_simsa: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jenis_senjata_api: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nomor_senjata_api: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jumlah_amunisi: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    jam_titip: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    jam_ambil: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    no_telp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ttd: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  { timestamps: false }
);

export default PenitipanSenjataApiSelainPenumpang; 