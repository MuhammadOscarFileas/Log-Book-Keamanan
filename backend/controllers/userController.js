import UserModel from "../models/user_model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";
const JWT_EXPIRES_IN = "1d"; // 1 hari

export const register = async (req, res) => {
  try {
    const { nama_lengkap, email, password, lokasi, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ nama_lengkap, email, password: hashedPassword, lokasi, role });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: "User not found" });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid password" });
    const token = jwt.sign({ user_id: user.user_id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.json({ token, user: user.toJSON() });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const where = {};
    if (req.query.role) {
      where.role = req.query.role;
    }
    const users = await UserModel.findAll({ where });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await UserModel.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    let updateData = { ...rest };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    const [updated] = await UserModel.update(updateData, { where: { user_id: req.params.id } });
    if (!updated) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User updated" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const deleted = await UserModel.destroy({ where: { user_id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserRoleCounts = async (req, res) => {
  try {
    const users = await UserModel.findAll();
    const counts = { officer: 0, supervisor: 0, superadmin: 0 };
    users.forEach(u => {
      if (u.role === 'officer') counts.officer++;
      if (u.role === 'supervisor') counts.supervisor++;
      if (u.role === 'superadmin') counts.superadmin++;
    });
    res.json(counts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updatePasswordFirstLogin = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password minimal 6 karakter' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const [updated] = await UserModel.update(
      { password: hashedPassword, first_login: false },
      { where: { user_id: req.params.id } }
    );
    if (!updated) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'Password updated, first_login set to false' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}; 