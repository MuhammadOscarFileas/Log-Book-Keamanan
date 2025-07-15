import { DataTypes } from "sequelize";
import db from "../config/database.js";

const LogbookPatroliRandom = db.define(
  "logbook_patroli_random",
  {
    jam: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    checkpoint: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    temuan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tindak_lanjut: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  { timestamps: false, freezeTableName: true }
);

export default LogbookPatroliRandom; 