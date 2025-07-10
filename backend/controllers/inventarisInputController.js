import InventarisInput from "../models/inventaris_input_model.js";
import LaporanModel from "../models/laporan_model.js";

export const createInventarisInput = async (req, res) => {
  try {
    const laporan = await LaporanModel.findByPk(req.body.laporan_id);
    if (!laporan) return res.status(404).json({ error: "Laporan not found" });
    if (laporan.status !== "draft") return res.status(403).json({ error: "Tidak bisa tambah inventaris, laporan bukan draft" });
    const input = await InventarisInput.create(req.body);
    res.status(201).json(input);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllInventarisInput = async (req, res) => {
  try {
    const input = await InventarisInput.findAll();
    res.json(input);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getInventarisInputById = async (req, res) => {
  try {
    const input = await InventarisInput.findByPk(req.params.id);
    if (!input) return res.status(404).json({ error: "InventarisInput not found" });
    res.json(input);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateInventarisInput = async (req, res) => {
  try {
    const input = await InventarisInput.findByPk(req.params.id);
    if (!input) return res.status(404).json({ error: "InventarisInput not found" });
    const laporan = await LaporanModel.findByPk(input.laporan_id);
    if (!laporan) return res.status(404).json({ error: "Laporan not found" });
    if (laporan.status !== "draft") return res.status(403).json({ error: "Tidak bisa edit inventaris, laporan bukan draft" });
    await InventarisInput.update(req.body, { where: { inv_input_id: req.params.id } });
    res.json({ message: "InventarisInput updated" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteInventarisInput = async (req, res) => {
  try {
    const input = await InventarisInput.findByPk(req.params.id);
    if (!input) return res.status(404).json({ error: "InventarisInput not found" });
    const laporan = await LaporanModel.findByPk(input.laporan_id);
    if (!laporan) return res.status(404).json({ error: "Laporan not found" });
    if (laporan.status !== "draft") return res.status(403).json({ error: "Tidak bisa hapus inventaris, laporan bukan draft" });
    await InventarisInput.destroy({ where: { inv_input_id: req.params.id } });
    res.json({ message: "InventarisInput deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 