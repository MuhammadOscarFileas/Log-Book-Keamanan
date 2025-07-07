import { DataTypes } from "sequelize";
import db from "../config/database.js";

const InventarisModel = db.define("inventaris", {
  inventaris_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nama_barang: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
  createdAt: "created_at",
  updatedAt: false,
});

export default InventarisModel;
