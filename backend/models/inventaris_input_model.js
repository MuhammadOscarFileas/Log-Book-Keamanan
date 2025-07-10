import { DataTypes } from "sequelize";
import db from "../config/database.js";

const InventarisInput = db.define("inventaris_input", {
  inv_input_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  laporan_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nama_barang: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  jumlah: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
  createdAt: "created_at",
  updatedAt: false,
});

export default InventarisInput;
