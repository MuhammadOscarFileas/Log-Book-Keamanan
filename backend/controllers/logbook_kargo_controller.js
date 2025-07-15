import LogbookKargo from "../models/logbook_kargo_model.js";

export const createLogbookKargo = async (req, res) => {
  try {
    const data = await LogbookKargo.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllLogbookKargo = async (req, res) => {
  try {
    const data = await LogbookKargo.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getLogbookKargoById = async (req, res) => {
  try {
    const data = await LogbookKargo.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: "Data not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateLogbookKargo = async (req, res) => {
  try {
    const [updated] = await LogbookKargo.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: "Data not found" });
    res.json({ message: "Data updated" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteLogbookKargo = async (req, res) => {
  try {
    const deleted = await LogbookKargo.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: "Data not found" });
    res.json({ message: "Data deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 