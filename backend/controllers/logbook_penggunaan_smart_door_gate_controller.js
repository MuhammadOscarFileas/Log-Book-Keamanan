import LogbookPenggunaanSmartDoorGate from "../models/logbook_penggunaan_smart_door_gate_model.js";

export const createLogbookPenggunaanSmartDoorGate = async (req, res) => {
  try {
    const data = await LogbookPenggunaanSmartDoorGate.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllLogbookPenggunaanSmartDoorGate = async (req, res) => {
  try {
    const data = await LogbookPenggunaanSmartDoorGate.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getLogbookPenggunaanSmartDoorGateById = async (req, res) => {
  try {
    const data = await LogbookPenggunaanSmartDoorGate.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: "Data not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateLogbookPenggunaanSmartDoorGate = async (req, res) => {
  try {
    const [updated] = await LogbookPenggunaanSmartDoorGate.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: "Data not found" });
    res.json({ message: "Data updated" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteLogbookPenggunaanSmartDoorGate = async (req, res) => {
  try {
    const deleted = await LogbookPenggunaanSmartDoorGate.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: "Data not found" });
    res.json({ message: "Data deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 