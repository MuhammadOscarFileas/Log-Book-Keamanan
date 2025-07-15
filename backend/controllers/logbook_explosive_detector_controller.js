import LogbookExplosiveDetector from "../models/logbook_explosive_detector_model.js";

export const createLogbookExplosiveDetector = async (req, res) => {
  try {
    const data = await LogbookExplosiveDetector.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllLogbookExplosiveDetector = async (req, res) => {
  try {
    const data = await LogbookExplosiveDetector.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getLogbookExplosiveDetectorById = async (req, res) => {
  try {
    const data = await LogbookExplosiveDetector.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: "Data not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateLogbookExplosiveDetector = async (req, res) => {
  try {
    const [updated] = await LogbookExplosiveDetector.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: "Data not found" });
    res.json({ message: "Data updated" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteLogbookExplosiveDetector = async (req, res) => {
  try {
    const deleted = await LogbookExplosiveDetector.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: "Data not found" });
    res.json({ message: "Data deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 