import InventarisInput from "../models/inventaris_input_model.js";

export const createInventarisInput = async (req, res) => {
  try {
    const input = await InventarisInput.create(req.body);
    res.status(201).json(input);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllInventarisInput = async (req, res) => {
  try {
    const input = await InventarisInput.findAll();
    res.json(input);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getInventarisInputById = async (req, res) => {
  try {
    const input = await InventarisInput.findByPk(req.params.id);
    if (!input) return res.status(404).json({ error: "InventarisInput not found" });
    res.json(input);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateInventarisInput = async (req, res) => {
  try {
    const [updated] = await InventarisInput.update(req.body, { where: { inv_input_id: req.params.id } });
    if (!updated) return res.status(404).json({ error: "InventarisInput not found" });
    res.json({ message: "InventarisInput updated" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteInventarisInput = async (req, res) => {
  try {
    const deleted = await InventarisInput.destroy({ where: { inv_input_id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: "InventarisInput not found" });
    res.json({ message: "InventarisInput deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 