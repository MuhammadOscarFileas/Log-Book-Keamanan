import BehaviorForm from "../models/behavior_form_model.js";

export const createBehaviorForm = async (req, res) => {
  try {
    const data = await BehaviorForm.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllBehaviorForm = async (req, res) => {
  try {
    const data = await BehaviorForm.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getBehaviorFormById = async (req, res) => {
  try {
    const data = await BehaviorForm.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: "Data not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateBehaviorForm = async (req, res) => {
  try {
    const [updated] = await BehaviorForm.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: "Data not found" });
    res.json({ message: "Data updated" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteBehaviorForm = async (req, res) => {
  try {
    const deleted = await BehaviorForm.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: "Data not found" });
    res.json({ message: "Data deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 