import { Router } from "express";
import { healthCheck } from "../controllers/healthcheck.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { addComment } from "../controllers/comment.controllers.js";

const router = Router()

router.post("/addcomments/:videoId", verifyJWT, addComment);



export const CommentRoute = router