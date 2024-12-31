import express from "express";




import { upload } from "../middlewares/multer.middlewares.js";
import { deleteVideo, getAllVideos, getVideoById, publishAVideo, togglePublishStatus, updateVideo } from "../controllers/video.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = express.Router();


router.post(
    "/publish",
    verifyJWT,
    upload.fields([
        { name: "video", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 },
    ]),
    publishAVideo
);


router.get("/:videoId", verifyJWT, getVideoById);
router.route("/update/:videoId").patch(verifyJWT, updateVideo);
router.route("/:videoId").delete(verifyJWT, deleteVideo);
router.route("/togglevideostatus/:videoId").post(verifyJWT, togglePublishStatus);
router.route('/').get(verifyJWT, getAllVideos);

export const VideoRoute =router;
