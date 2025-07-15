import WalkingPatrolNonTerminal from "../models/walking_patrol_nonterminal_model.js";

export const createWalkingPatrolNonTerminal = async (req, res) => {
  try {
    const data = await WalkingPatrolNonTerminal.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllWalkingPatrolNonTerminal = async (req, res) => {
  try {
    const data = await WalkingPatrolNonTerminal.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getWalkingPatrolNonTerminalById = async (req, res) => {
  try {
    const data = await WalkingPatrolNonTerminal.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: "Data not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateWalkingPatrolNonTerminal = async (req, res) => {
  try {
    const [updated] = await WalkingPatrolNonTerminal.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: "Data not found" });
    res.json({ message: "Data updated" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteWalkingPatrolNonTerminal = async (req, res) => {
  try {
    const deleted = await WalkingPatrolNonTerminal.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: "Data not found" });
    res.json({ message: "Data deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 