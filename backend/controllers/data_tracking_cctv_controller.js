import DataTrackingCCTV from "../models/data_tracking_cctv_model.js";

export const createDataTrackingCCTV = async (req, res) => {
  try {
    const data = await DataTrackingCCTV.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllDataTrackingCCTV = async (req, res) => {
  try {
    const data = await DataTrackingCCTV.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDataTrackingCCTVById = async (req, res) => {
  try {
    const data = await DataTrackingCCTV.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: "Data not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateDataTrackingCCTV = async (req, res) => {
  try {
    const [updated] = await DataTrackingCCTV.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: "Data not found" });
    res.json({ message: "Data updated" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteDataTrackingCCTV = async (req, res) => {
  try {
    const deleted = await DataTrackingCCTV.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: "Data not found" });
    res.json({ message: "Data deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 