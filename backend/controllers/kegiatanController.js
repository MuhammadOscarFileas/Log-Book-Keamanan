import KegiatanModel from "../models/kegiatan_model.js";
import LaporanModel from "../models/laporan_model.js";

export const createKegiatan = async (req, res) => {
  try {
    const laporan = await LaporanModel.findByPk(req.body.laporan_id);
    if (!laporan) return res.status(404).json({ error: "Laporan not found" });
    if (laporan.status !== "draft") return res.status(403).json({ error: "Tidak bisa tambah kegiatan, laporan bukan draft" });
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
    const kegiatan = await KegiatanModel.findByPk(req.params.id);
    if (!kegiatan) return res.status(404).json({ error: "Kegiatan not found" });
    const laporan = await LaporanModel.findByPk(kegiatan.laporan_id);
    if (!laporan) return res.status(404).json({ error: "Laporan not found" });
    if (laporan.status !== "draft") return res.status(403).json({ error: "Tidak bisa edit kegiatan, laporan bukan draft" });
    await KegiatanModel.update(req.body, { where: { kegiatan_id: req.params.id } });
    res.json({ message: "Kegiatan updated" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteKegiatan = async (req, res) => {
  try {
    const kegiatan = await KegiatanModel.findByPk(req.params.id);
    if (!kegiatan) return res.status(404).json({ error: "Kegiatan not found" });
    const laporan = await LaporanModel.findByPk(kegiatan.laporan_id);
    if (!laporan) return res.status(404).json({ error: "Laporan not found" });
    if (laporan.status !== "draft") return res.status(403).json({ error: "Tidak bisa hapus kegiatan, laporan bukan draft" });
    await KegiatanModel.destroy({ where: { kegiatan_id: req.params.id } });
    res.json({ message: "Kegiatan deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 