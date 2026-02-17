const express = require("express");
const { registerUser,loginUser , updateProfile,getUsers ,getUserById,deleteProfile} = require("../controllers/userController");
const { protect} = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");
const User = require("../models/User");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});
router.get("/", getUsers);
router.put("/profile", protect, updateProfile);
router.get("/:id", getUserById);
router.delete("/profile", protect, deleteProfile);
router.delete("/:id", protect, adminOnly, async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({ message: "User deleted by admin" });
});
module.exports = router;
