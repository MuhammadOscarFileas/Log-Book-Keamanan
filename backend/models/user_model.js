import { DataTypes } from "sequelize";
import db from "../config/database.js";

const UserModel = db.define("users", {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  nama_lengkap: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lokasi: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM("superadmin", "supervisor", "officer"),
    allowNull: false,
  },
  first_login: {
    type: DataTypes.BOOLEAN,
    defaultValue: true, // Artinya belum pernah login
  }
}, {
  timestamps: true,
  createdAt: "created_at",
  updatedAt: false,
});

export default UserModel;
