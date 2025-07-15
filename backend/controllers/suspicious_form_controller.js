import SuspiciousForm from "../models/suspicious_form_model.js";

export const createSuspiciousForm = async (req, res) => {
  try {
    const data = await SuspiciousForm.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllSuspiciousForm = async (req, res) => {
  try {
    const data = await SuspiciousForm.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSuspiciousFormById = async (req, res) => {
  try {
    const data = await SuspiciousForm.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: "Data not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateSuspiciousForm = async (req, res) => {
  try {
    const [updated] = await SuspiciousForm.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: "Data not found" });
    res.json({ message: "Data updated" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteSuspiciousForm = async (req, res) => {
  try {
    const deleted = await SuspiciousForm.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: "Data not found" });
    res.json({ message: "Data deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 