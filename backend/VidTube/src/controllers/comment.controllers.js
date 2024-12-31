import mongoose from "mongoose"
import {Comment} from "../models/comment.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"



const addComment = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const { videoId } = req.params;

    // Validate content
    if (!content) {
        throw new ApiError(400, "Content is required");
    }

///check video id exits for not

if(!videoId){
    throw new ApiError(400, " video Id is Required")
}


    // Validate videoId
    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }


    // Create a new comment
    const newComment = await Comment.create({
        content,
        video: videoId,
        user: req.user._id, // Assuming `req.user` is set by authentication middleware
    });

    res.status(200).json(new ApiResponse(200, newComment, "Comment added successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
const {content } = req.user
 const {CommentId} = req.params

if(!mongoose.isValidObjectId(CommentId)){
    throw new ApiError(400, "Invalid Comment ID");
}

if(!content){
    throw new ApiError(400,"Content is required")
} 

const comment = await Comment.findById(CommentId)

if(comment.user.toString !== req.user._id.toString()){
    throw new ApiError(403, "You are not authorized to update this comment")
}


comment.content = content

await comment.save()
res.status(200).json(200, comment,"Comment updated successfully")

})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
})



const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }