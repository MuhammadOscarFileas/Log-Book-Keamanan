import express from "express";
import { register, login, getAllUsers, getUserById, updateUser, deleteUser, getUserRoleCounts, updatePasswordFirstLogin } from "../controllers/userController.js";
import { verifyToken } from "../middleware/verifytoken.js";

const router = express.Router();

// router.post("/register", register);
// router.post("/login", login);
// router.get("/", verifyToken, getAllUsers);
// router.get("/:id",verifyToken, getUserById);
// router.put("/:id",verifyToken, updateUser);
// router.delete("/:id",verifyToken, deleteUser);

router.post("/register", register);
router.post("/login", login);
router.get("/", getAllUsers);
router.get("/role-counts", getUserRoleCounts);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.put("/:id/password", updatePasswordFirstLogin);
router.delete("/:id", deleteUser);

export default router; 