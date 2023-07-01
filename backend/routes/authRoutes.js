import express from "express";
import {
  alreadyFollowing,
  editProfile,
  follow,
  getUserProfile,
  loginUser,
  logoutUser,
  registerUser,
  searchUser,
  unfollow,
} from "../controllers/authControllers.js";
import protect from "../middleware/protect.js";
const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/logout", protect, logoutUser);
router.get("/:username", protect, getUserProfile);
router.put("/:username/edit", protect, editProfile);
router.put("/:username/follow", protect, follow);
router.put("/:username/unfollow", protect, unfollow);
router.get("/:username/alreadyFollowing", protect, alreadyFollowing);
router.get("/user/search", protect, searchUser);

export default router;
