import UserModel from "./user_model.js";
import LaporanModel from "./laporan_model.js";
import KegiatanModel from "./kegiatan_model.js";
import InventarisInput from "./inventaris_input_model.js";

// Relasi User - Laporan
UserModel.hasMany(LaporanModel, { foreignKey: "user_pembuat", as: "laporan_dibuat" });
LaporanModel.belongsTo(UserModel, { foreignKey: "user_pembuat", as: "pembuat" });
LaporanModel.belongsTo(UserModel, { foreignKey: "user_penerima", as: "penerima" });
LaporanModel.belongsTo(UserModel, { foreignKey: "user_supervisor", as: "supervisor" });

// Relasi Laporan - Kegiatan
LaporanModel.hasMany(KegiatanModel, { foreignKey: "laporan_id", as: "kegiatan" });
KegiatanModel.belongsTo(LaporanModel, { foreignKey: "laporan_id" });

// Relasi Laporan - InventarisInput
LaporanModel.hasMany(InventarisInput, { foreignKey: "laporan_id", as: "inventaris_input" });
InventarisInput.belongsTo(LaporanModel, { foreignKey: "laporan_id" });

export {
  UserModel,
  LaporanModel,
  KegiatanModel,
  InventarisInput
}; 