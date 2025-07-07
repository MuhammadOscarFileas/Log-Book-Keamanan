import InventarisModel from "../models/inventaris_model.js";

export const createInventaris = async (req, res) => {
  try {
    const inventaris = await InventarisModel.create(req.body);
    res.status(201).json(inventaris);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllInventaris = async (req, res) => {
  try {
    const inventaris = await InventarisModel.findAll();
    res.json(inventaris);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getInventarisById = async (req, res) => {
  try {
    const inventaris = await InventarisModel.findByPk(req.params.id);
    if (!inventaris) return res.status(404).json({ error: "Inventaris not found" });
    res.json(inventaris);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateInventaris = async (req, res) => {
  try {
    const [updated] = await InventarisModel.update(req.body, { where: { inventaris_id: req.params.id } });
    if (!updated) return res.status(404).json({ error: "Inventaris not found" });
    res.json({ message: "Inventaris updated" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteInventaris = async (req, res) => {
  try {
    const deleted = await InventarisModel.destroy({ where: { inventaris_id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: "Inventaris not found" });
    res.json({ message: "Inventaris deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 