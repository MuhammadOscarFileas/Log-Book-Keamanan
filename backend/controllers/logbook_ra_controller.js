import LogbookRA from "../models/logbook_ra_model.js";

export const createLogbookRA = async (req, res) => {
  try {
    const data = await LogbookRA.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllLogbookRA = async (req, res) => {
  try {
    const data = await LogbookRA.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getLogbookRAById = async (req, res) => {
  try {
    const data = await LogbookRA.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: "Data not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateLogbookRA = async (req, res) => {
  try {
    const [updated] = await LogbookRA.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: "Data not found" });
    res.json({ message: "Data updated" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteLogbookRA = async (req, res) => {
  try {
    const deleted = await LogbookRA.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: "Data not found" });
    res.json({ message: "Data deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 