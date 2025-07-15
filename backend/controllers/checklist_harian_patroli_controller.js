import ChecklistHarianPatroli from "../models/checklist_harian_patroli_model.js";

export const createChecklistHarianPatroli = async (req, res) => {
  try {
    const data = await ChecklistHarianPatroli.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllChecklistHarianPatroli = async (req, res) => {
  try {
    const data = await ChecklistHarianPatroli.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getChecklistHarianPatroliById = async (req, res) => {
  try {
    const data = await ChecklistHarianPatroli.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: "Data not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateChecklistHarianPatroli = async (req, res) => {
  try {
    const [updated] = await ChecklistHarianPatroli.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: "Data not found" });
    res.json({ message: "Data updated" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteChecklistHarianPatroli = async (req, res) => {
  try {
    const deleted = await ChecklistHarianPatroli.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: "Data not found" });
    res.json({ message: "Data deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 