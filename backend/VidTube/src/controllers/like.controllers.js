import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.models.js"
const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
  

    if(!videoId){
        throw new ApiError(400, "Video id is required")
    }

    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(404, "Video not found")
    }
const user = req.user._id
    const existingLike = await Like.findOne({
        video:videoId,
        likedBy:user
    })
    if (existingLike) {
        // Unlike the video
        await existingLike.deleteOne();
        return res.status(200).json(new ApiResponse(200, null, "Video unliked successfully"));
    }

    // Add a like
 const videoData =    await Like.create({
        video: videoId,
        likedBy: req.user._id,
    });

    return res.status(200).json(new ApiResponse(200, videoData, "Video liked successfully"));
});



const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params



    if(!commentId){
        throw new ApiError(400, "Comment id is required")
    }


     const existingLiked = await Like.findOne({
        Comment:commentId,
        likedBy:req.user._id
     })


     if(existingLiked){
        await existingLiked.deleteOne()
        return res.status(200).json(new ApiResponse(200, null, "Comment unliked successfully"));
     }

     await Like.create({
        Comment:commentId,
        likedBy:req.user._id
     })
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params

    if(!tweetId){
        throw new ApiError(400," Tweet id is required")
    }


    const user = req.user._id


    const existingLiked = await Like.findOne({
        tweet:tweetId,
        likedBy:user
    })

    if(!existingLiked){
        await existingLiked.deleteOne()
        req.status(200).json(new ApiResponse(200, null , "Tweet Unliked successfullty"))
    }

    const TweetLikedData = await Like.create({
        tweet:tweetId,
        likedBy:user
    })

    res.status(200).json(new ApiResponse(200, TweetLikedData, "Tweet Liked successfully "))

})
const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Fetch all likes for videos by the current user
    const likedVideos = await Like.find({
        likedBy: userId,
        video: { $exists: true }, // Ensure the like is associated with a video
    })
        .populate("video", "title thumbnail owner") // Populate video details
        .populate("video.owner", "username fullName avatar"); // Populate video owner's details

    if (!likedVideos.length) {
        return res.status(200).json(new ApiResponse(200, [], "No liked videos found"));
    }

    res.status(200).json(new ApiResponse(200, likedVideos, "Liked videos fetched successfully"));
});


export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}