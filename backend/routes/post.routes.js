import express from 'express';
import { protectRoute } from '../middleware/protectedRoute.js';
import { createPost, deletePost, commentPost, likePost, getAllPosts, getLikedPosts, getFollowingPosts, getUserPosts } from '../controllers/post.controller.js';

const router = express.Router();

router.get('/all', protectRoute, getAllPosts);
router.get('/following', protectRoute, getFollowingPosts);
router.get('/likes/:id', protectRoute, getLikedPosts);
router.get('/user/:username', protectRoute, getUserPosts);
router.post('/create', protectRoute, createPost);
router.post('/like/:id', protectRoute, likePost);
router.post('/comment/:id', protectRoute, commentPost);
router.delete('/:id', protectRoute, deletePost);





export default router;  