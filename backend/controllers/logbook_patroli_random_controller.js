import LogbookPatroliRandom from "../models/logbook_patroli_random_model.js";

export const createLogbookPatroliRandom = async (req, res) => {
  try {
    const data = await LogbookPatroliRandom.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllLogbookPatroliRandom = async (req, res) => {
  try {
    const data = await LogbookPatroliRandom.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getLogbookPatroliRandomById = async (req, res) => {
  try {
    const data = await LogbookPatroliRandom.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: "Data not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateLogbookPatroliRandom = async (req, res) => {
  try {
    const [updated] = await LogbookPatroliRandom.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: "Data not found" });
    res.json({ message: "Data updated" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteLogbookPatroliRandom = async (req, res) => {
  try {
    const deleted = await LogbookPatroliRandom.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: "Data not found" });
    res.json({ message: "Data deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 