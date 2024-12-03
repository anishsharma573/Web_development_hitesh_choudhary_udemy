// /routers/user.routes.js
import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateAvatar,
    updateUserCoverImage,
    getUSerChannelProfile,
    getWatchedHistory,
} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

// Public Routes (No authentication required)
router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 },
    ]),
    registerUser
);

router.route("/login").post(loginUser);

// Secured Routes (Require Authentication)
router.use(verifyJWT); // Apply JWT middleware to all routes below

router.route("/logout").get(logoutUser);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/current-user").get(getCurrentUser);

router.route("/change-password").post(changeCurrentPassword);

router.route("/update-account").put(updateAccountDetails);

router
    .route("/update-avatar")
    .post(upload.single("avatar"), updateAvatar);

router
    .route("/update-cover-image")
    .post(upload.single("coverImage"), updateUserCoverImage);

router.route("/channel/:username").get(getUSerChannelProfile);

router.route("/watched-history").get(getWatchedHistory);

export default router;
