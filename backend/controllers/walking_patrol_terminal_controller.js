import WalkingPatrolTerminal from "../models/walking_patrol_terminal_model.js";

export const createWalkingPatrolTerminal = async (req, res) => {
  try {
    const data = await WalkingPatrolTerminal.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllWalkingPatrolTerminal = async (req, res) => {
  try {
    const data = await WalkingPatrolTerminal.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getWalkingPatrolTerminalById = async (req, res) => {
  try {
    const data = await WalkingPatrolTerminal.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: "Data not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateWalkingPatrolTerminal = async (req, res) => {
  try {
    const [updated] = await WalkingPatrolTerminal.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: "Data not found" });
    res.json({ message: "Data updated" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteWalkingPatrolTerminal = async (req, res) => {
  try {
    const deleted = await WalkingPatrolTerminal.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: "Data not found" });
    res.json({ message: "Data deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 