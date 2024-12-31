import { Router } from "express";
import { toggleVideoLike, toggleCommentLike,toggleTweetLike, getLikedVideos } from "../controllers/like.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router()

router.route("/toggleVideoLike/:videoId").post(verifyJWT,toggleVideoLike)


router.route("/toggleCommentLike/:commentId").post(toggleCommentLike)
router.route("/toggleTweetLike/:TweetId").post(toggleTweetLike)


router.get("/videos/liked", verifyJWT, getLikedVideos);


export const likesRoute = router