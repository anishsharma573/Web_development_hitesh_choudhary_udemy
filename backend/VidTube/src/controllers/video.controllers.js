import mongoose, {isValidObjectId} from "mongoose"
import { Video } from "../models/video.models.js"
import {User} from "../models/user.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {deleteFromCloudinary, uploadOnCloudinary} from "../utils/cloudinary.js"





const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const videoFilePath = req.files?.video?.[0]?.path; 
    const thumbnailFilePath = req.files?.thumbnail?.[0]?.path; 


    if (!title || !description || !videoFilePath || !thumbnailFilePath) {
        throw new ApiError(400, "Title, description, video, and thumbnail are required");
    }

    try {
       

        
        const videoFile = await uploadOnCloudinary(videoFilePath, "video");
        const thumbnailFile = await uploadOnCloudinary(thumbnailFilePath, "image");

        
        const newVideo = await Video.create({
            title,
            description,
            videoFile: videoFile.url,
            thumbnail: thumbnailFile.url,
            duration: 0, 
            views: 0,
            owner: req.user._id,
        });


        res.status(201).json(new ApiResponse(201, newVideo, "Video uploaded successfully"));
    } catch (error) {
        console.error("Error while uploading:", error);

    
        throw new ApiError(500, "Failed to upload video");
    }
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!videoId){
        throw new ApiError(400, "Video ID is required")
    }

    // check if the videoID is a valid mongoDb id
    if(!mongoose.isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video ID")
    }
 


    const video = await Video.findById(videoId).populate("owner", "name email");

    if(!video){
        throw new ApiError(404, "Video not found")
    }

    res.status(200).json(new ApiResponse(200,video,"video Fetched Successfully"))


})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
if(!videoId){
    throw new ApiError(400, "Video ID is required")
}
    
    const video = await Video.findById(videoId).populate("owner", "name email");

    if(!video){
        throw new ApiError(404, "Video not found")
    }
    

    const {title,description,thumbnail} = req.body

    video.title = title
    video.description = description
    video.thumbnail = thumbnail

    res.status(200).json(new ApiResponse(200, video,"video Updated Successfully"))


})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
   if(!videoId){
    throw new ApiError(400, "Video ID is required")
   }

   const video = await Video.findById(videoId)

   if(!video){
    throw new ApiError(404, "Video not found")
   }
   try {

const videoFilePath = req.files?.video?.[0]?.path
const thumbnail = req.files?.thumbnail?.[0]?.path; 

  await   deleteFromCloudinary(videoFilePath)
   await     deleteFromCloudinary(thumbnail)

    await video.deleteOne()
    res.status(200).json(new ApiResponse(200, null, "Video deleted successfully"));
   } catch (error) {
    console.error("Error while delelting the video",video);
    
   }
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if(!videoId){
        throw new ApiError(400, "Video ID is required")
    }

    const video = await Video.findById(videoId);

    if(!video){
        throw new ApiError(404, "Video not found")
    }

  video.isPublished = !video.isPublished

    video.save()

    res.status(200).json(new ApiResponse(200, video, "Video status updated successfully"))
})

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query = "", sortBy = "createdAt", sortType = "desc", userId } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Build filters
    const filters = [];
    if (query) {
        filters.push({
            $match: {
                title: { $regex: query, $options: "i" }, // Case-insensitive search for title
            },
        });
    }

    if (userId) {
        // Validate userId
        if (!mongoose.isValidObjectId(userId)) {
            throw new ApiError(400, "Invalid user ID");
        }
        filters.push({
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
            },
        });
    }

    // Build sorting options
    const sortOptions = {};
    sortOptions[sortBy] = sortType === "asc" ? 1 : -1;

    // Build the aggregation pipeline
    const pipeline = [
        ...filters,
        {
            $sort: sortOptions, // Sort based on sortBy and sortType
        },
        {
            $skip: (pageNumber - 1) * limitNumber, // Pagination skip
        },
        {
            $limit: limitNumber, // Pagination limit
        },
        {
            $lookup: {
                from: "users", // Join with the users collection
                localField: "owner", // Local field in the Video collection
                foreignField: "_id", // Foreign field in the User collection
                as: "owner", // Resulting field in the output
            },
        },
        {
            $unwind: "$owner", // Convert owner array to object
        },
    ];

    // Count total documents matching the filters
    const totalVideos = await Video.countDocuments(filters.length ? filters[0].$match : {});

    // Execute the aggregation pipeline
    const videos = await Video.aggregate(pipeline);

    // Respond with data
    res.status(200).json({
        success: true,
        statusCode: 200,
        data: {
            videos,
            pagination: {
                total: totalVideos,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(totalVideos / limitNumber),
            },
        },
        message: "Videos fetched successfully",
    });
});


export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}