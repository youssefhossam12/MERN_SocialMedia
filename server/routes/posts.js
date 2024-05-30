import express from "express";
import { getFeedPosts, getUserPosts, likePost, getComments, addComment,deleteComment, deletePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);
router.get("/:postId",verifyToken,getComments)
router.post("/:postId",verifyToken,addComment)
router.delete("/:postId/comment",verifyToken,deleteComment)
router.delete("/:postId/post",verifyToken, deletePost);
/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);

export default router;