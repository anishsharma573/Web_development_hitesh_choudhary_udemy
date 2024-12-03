import mongoose, {isValidObjectId} from "mongoose"
import { Video } from "../models/video.models.js"
import {User} from "../models/user.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"




const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const videoFilePath = req.files?.video?.[0]?.path; // Access the first file in the "video" field
    const thumbnailFilePath = req.files?.thumbnail?.[0]?.path; // Access the first file in the "thumbnail" field

    // Validate required fields
    if (!title || !description || !videoFilePath || !thumbnailFilePath) {
        throw new ApiError(400, "Title, description, video, and thumbnail are required");
    }

    try {
        // Get video duration
        // const duration = await getVideoDurationInMinutes(videoFilePath);

        // Upload video and thumbnail to Cloudinary
        const videoFile = await uploadOnCloudinary(videoFilePath, "video");
        const thumbnailFile = await uploadOnCloudinary(thumbnailFilePath, "image");

        // Create video record in the database
        const newVideo = await Video.create({
            title,
            description,
            videoFile: videoFile.url,
            thumbnail: thumbnailFile.url,
            duration: 0, // Round duration to nearest whole number
            views: 0,
            owner: req.user._id,
        });

        // Respond with success
        res.status(201).json(new ApiResponse(201, newVideo, "Video uploaded successfully"));
    } catch (error) {
        console.error("Error while uploading:", error);

        // Respond with error
        throw new ApiError(500, "Failed to upload video");
    }
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})
export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}