import TemuanSenjataApiDenganPeluru from "../models/temuan_senjata_api_dengan_peluru_model.js";

export const createTemuanSenjataApiDenganPeluru = async (req, res) => {
  try {
    const data = await TemuanSenjataApiDenganPeluru.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllTemuanSenjataApiDenganPeluru = async (req, res) => {
  try {
    const data = await TemuanSenjataApiDenganPeluru.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTemuanSenjataApiDenganPeluruById = async (req, res) => {
  try {
    const data = await TemuanSenjataApiDenganPeluru.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: "Data not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTemuanSenjataApiDenganPeluru = async (req, res) => {
  try {
    const [updated] = await TemuanSenjataApiDenganPeluru.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: "Data not found" });
    res.json({ message: "Data updated" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteTemuanSenjataApiDenganPeluru = async (req, res) => {
  try {
    const deleted = await TemuanSenjataApiDenganPeluru.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: "Data not found" });
    res.json({ message: "Data deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 