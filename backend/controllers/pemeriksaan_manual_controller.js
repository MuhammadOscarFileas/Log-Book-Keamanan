import PemeriksaanManual from "../models/pemeriksaan_manual_model.js";

export const createPemeriksaanManual = async (req, res) => {
  try {
    const data = await PemeriksaanManual.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllPemeriksaanManual = async (req, res) => {
  try {
    const data = await PemeriksaanManual.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPemeriksaanManualById = async (req, res) => {
  try {
    const data = await PemeriksaanManual.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: "Data not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updatePemeriksaanManual = async (req, res) => {
  try {
    const [updated] = await PemeriksaanManual.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: "Data not found" });
    res.json({ message: "Data updated" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deletePemeriksaanManual = async (req, res) => {
  try {
    const deleted = await PemeriksaanManual.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: "Data not found" });
    res.json({ message: "Data deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 