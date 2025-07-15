import ChecklistPatrolSisiUdara from "../models/checklist_patrol_sisi_udara_model.js";

export const createChecklistPatrolSisiUdara = async (req, res) => {
  try {
    const data = await ChecklistPatrolSisiUdara.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllChecklistPatrolSisiUdara = async (req, res) => {
  try {
    const data = await ChecklistPatrolSisiUdara.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getChecklistPatrolSisiUdaraById = async (req, res) => {
  try {
    const data = await ChecklistPatrolSisiUdara.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: "Data not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateChecklistPatrolSisiUdara = async (req, res) => {
  try {
    const [updated] = await ChecklistPatrolSisiUdara.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: "Data not found" });
    res.json({ message: "Data updated" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteChecklistPatrolSisiUdara = async (req, res) => {
  try {
    const deleted = await ChecklistPatrolSisiUdara.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: "Data not found" });
    res.json({ message: "Data deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 