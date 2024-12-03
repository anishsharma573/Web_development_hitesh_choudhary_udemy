import express from "express";




import { upload } from "../middlewares/multer.middlewares.js";
import { publishAVideo } from "../controllers/video.controllers.js";
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

export const VideoRoute =router;
