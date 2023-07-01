import express from "express";
import protect from "../middleware/protect.js";
import {
  alreadyLiked,
  createComment,
  createPost,
  deletePost,
  getAllPosts,
  getMyPosts,
  getPost,
  like,
  unlikePost,
} from "../controllers/postControllers.js";
const router = express.Router();

router.route("/").get(protect, getAllPosts).post(protect, createPost);
router.route("/:username").get(protect, getMyPosts);
router.route("/:postId/like").put(protect, like);
router.route("/:postId/unlike").put(protect, unlikePost);
router.route("/:postId/alreadyLiked").get(protect, alreadyLiked);
router
  .route("/getPost/:postId")
  .get(protect, getPost)
  .delete(protect, deletePost);
router.route("/:postId/comment").post(protect, createComment);

export default router;
