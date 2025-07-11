import LaporanModel from "../models/laporan_model.js";
import { Op } from "sequelize";

export const createLaporan = async (req, res) => {
  try {
    const laporan = await LaporanModel.create(req.body);
    res.status(201).json(laporan);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllLaporan = async (req, res) => {
  try {
    const laporan = await LaporanModel.findAll();
    res.json(laporan); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getLaporanById = async (req, res) => {
  try {
    const laporan = await LaporanModel.findByPk(req.params.id);
    if (!laporan) return res.status(404).json({ error: "Laporan not found" });
    res.json(laporan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateLaporan = async (req, res) => {
  try {
    const laporan = await LaporanModel.findByPk(req.params.id);
    if (!laporan) return res.status(404).json({ error: "Laporan not found" });

    // Jika status bukan draft, tolak edit kecuali hanya mengubah status ke 'submit to supervisor'
    if (laporan.status !== "draft") {
      // Izinkan update status ke 'submit to supervisor' saja
      if (
        req.body.status &&
        req.body.status === "submit to supervisor" &&
        laporan.status !== "submit to supervisor"
      ) {
        laporan.status = "submit to supervisor";
        // Update signature jika ada di body
        if (req.body.ttd_pembuat) laporan.ttd_pembuat = req.body.ttd_pembuat;
        if (req.body.ttd_penerima) laporan.ttd_penerima = req.body.ttd_penerima;
        if (req.body.ttd_shift_selanjutnya) laporan.ttd_penerima = req.body.ttd_shift_selanjutnya;
        await laporan.save();
        return res.json({ message: "Laporan submitted to supervisor" });
      }
      return res.status(403).json({ error: "Laporan tidak bisa diedit karena status bukan draft" });
    }

    // Jika officer ingin mengubah status ke 'submit to supervisor', izinkan
    if (req.body.status && req.body.status === "submit to supervisor") {
      laporan.status = "submit to supervisor";
      await laporan.save();
      return res.json({ message: "Laporan submitted to supervisor" });
    }

    // Update field lain hanya jika status draft
    await LaporanModel.update(req.body, { where: { laporan_id: req.params.id } });
    res.json({ message: "Laporan updated" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteLaporan = async (req, res) => {
  try {
    const deleted = await LaporanModel.destroy({ where: { laporan_id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: "Laporan not found" });
    res.json({ message: "Laporan deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const countPendingSupervisor = async (req, res) => {
  try {
    const jumlah = await LaporanModel.count({
      where: {
        [Op.or]: [
          { status: 'submit to supervisor' },
          { ttd_supervisor: null },
          { ttd_supervisor: '' }, 
        ],
      },
    });

    res.json({ pending_supervisor: jumlah });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghitung laporan", error: error.message });
  }
};

export const getLaporanNonDraft = async (req, res) => {
  try {
    const laporan = await LaporanModel.findAll({
      where: {
        status: {
          [Op.ne]: 'draft'
        }
      },
      order: [['created_at', 'DESC']],
    });

    res.json(laporan);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil laporan", error: error.message });
  }
};