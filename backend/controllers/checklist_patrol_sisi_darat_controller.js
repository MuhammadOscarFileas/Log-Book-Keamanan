import ChecklistPatrolSisiDarat from "../models/checklist_patrol_sisi_darat_model.js";

export const createChecklistPatrolSisiDarat = async (req, res) => {
  try {
    const data = await ChecklistPatrolSisiDarat.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllChecklistPatrolSisiDarat = async (req, res) => {
  try {
    const data = await ChecklistPatrolSisiDarat.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getChecklistPatrolSisiDaratById = async (req, res) => {
  try {
    const data = await ChecklistPatrolSisiDarat.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: "Data not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateChecklistPatrolSisiDarat = async (req, res) => {
  try {
    const [updated] = await ChecklistPatrolSisiDarat.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: "Data not found" });
    res.json({ message: "Data updated" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteChecklistPatrolSisiDarat = async (req, res) => {
  try {
    const deleted = await ChecklistPatrolSisiDarat.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: "Data not found" });
    res.json({ message: "Data deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 