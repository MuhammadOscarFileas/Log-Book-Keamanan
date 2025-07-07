import KegiatanModel from "../models/kegiatan_model.js";

export const createKegiatan = async (req, res) => {
  try {
    const kegiatan = await KegiatanModel.create(req.body);
    res.status(201).json(kegiatan);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllKegiatan = async (req, res) => {
  try {
    const kegiatan = await KegiatanModel.findAll();
    res.json(kegiatan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getKegiatanById = async (req, res) => {
  try {
    const kegiatan = await KegiatanModel.findByPk(req.params.id);
    if (!kegiatan) return res.status(404).json({ error: "Kegiatan not found" });
    res.json(kegiatan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateKegiatan = async (req, res) => {
  try {
    const [updated] = await KegiatanModel.update(req.body, { where: { kegiatan_id: req.params.id } });
    if (!updated) return res.status(404).json({ error: "Kegiatan not found" });
    res.json({ message: "Kegiatan updated" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteKegiatan = async (req, res) => {
  try {
    const deleted = await KegiatanModel.destroy({ where: { kegiatan_id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: "Kegiatan not found" });
    res.json({ message: "Kegiatan deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 