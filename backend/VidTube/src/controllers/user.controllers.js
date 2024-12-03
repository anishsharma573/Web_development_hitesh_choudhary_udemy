import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.models.js";
import {uploadOnCloudinary,deleteFromCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";


const generateRefreshAndRefreshToken = async (userId) => {
    try {
        console.log("Generating tokens for User ID:", userId);

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            console.error("User not found for ID:", userId);
            throw new ApiError(404, "User not found");
        }

        // Generate tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        console.log("Access Token Generated:", accessToken);
        console.log("Refresh Token Generated:", refreshToken);

        // Save refresh token to user document
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        console.error("Error in generateRefreshAndRefreshToken:", error.message);
        throw new ApiError(
            500,
            "Something went wrong while generating the access token and refresh token"
        );
    }
};


const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res


    const {fullName, email, username, password } = req.body
    //console.log("email: ", email);

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
    //console.log(req.files);

    const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0]?.path
    }
    

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }
   

try {
        const newUser = await User.create({
            fullName,
            avatar: avatar.url,
            coverImage: coverImage?.url || "",
            email, 
            password,
            username: username.toLowerCase()
        })
    
        const createdUser = await User.findById(newUser._id).select(
            "-password -refreshToken"
        )
    
        if (!createdUser) {
            throw new ApiError(500, "Something went wrong while registering the user")
        }
    
        return res.status(201).json(
            new ApiResponse(200, createdUser, "User registered Successfully")
        )
} catch (error) {
    console.log('User creation failed ');
    if(avatar){
        await deleteFromCloudinary(avatar.public_id)
    }

    if(coverImage){
        await deleteFromCloudinary(coverImage.public_id)
    }

    throw new ApiError(500, "Something went wrong while registering the user and images were deleted from the cloudinary")
}

})


const loginUser = asyncHandler(async (req,res)=>{
    //get the data from the body

    const {username,email,password}=req.body

    //validation 
    if ((!username && !email) || !password) {
        throw new ApiError(400, "Username or email and password are required");
    }

    const user  = await User.findOne({
        $or:[{username},{email}]
    })

    if(!user){
        throw new ApiError(400,"user Not found ,Register before login ")
    }

    // validation password
const isPasswordvalid=await user.isPasswordCorrect(password)


if(!isPasswordvalid){
throw new ApiError(400, "Email and password does not match")
}

const {accessToken,refreshToken} = await generateRefreshAndRefreshToken(user._id)

const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
if(!loggedInUser){
    throw new ApiError(400,"Logged in user is not there")
}

const options ={
    httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
}



return res
.status(200)
.cookie("accessToken",accessToken,options)
.cookie("refreshToken",refreshToken,options)
.json(new ApiResponse(
    200,
    {user:loggedInUser,accessToken,refreshToken}
))
// .json(new ApiResponse(200,loggedInUser,"user Logged in Successfully"))


})

const logoutUser = asyncHandler(async (req,res)=>{
await  User.findByIdAndUpdate(
 req.user._id,
 {
    $set:{
        refreshToken:undefined
    }
 },
 {new:true}
)

const options ={
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
}
return res
.status(200)
.clearCookie("accessToken",options)
.clearCookie("refreshToken",options)
.json(new  ApiResponse(200,{},"User Logged out successfully "))
})

const refreshAccessToken = asyncHandler(async (req,res)=>{

const incomingRfereshtoken= req.cookies.refreshToken || req.body.refreshToken

if(!incomingRfereshtoken){
    throw new ApiError(400, "Refredh token not found")
}



try {
    const decodedToken =  jwt.verify(
 incomingRfereshtoken,
 process.env.REFRESH_TOKEN_SECRET || "defaultRefreshTokenSecret",  
)

const user = await User.findById(decodedToken?._id)
if(!user){
    throw new ApiError(401,"Invalid Refresh token.. user not found by id")
}

if( incomingRfereshtoken!==user?.refreshToken ){
        throw new ApiError(401,"invalid refresh token ,=== token expired")
}

const options ={
    httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
}

const {accessToken, refreshToken:newRefreshToken}=await generateRefreshAndRefreshToken(user._id)
return res
.status(200)
.cookie("accessToken",accessToken,options)
.cookie("refreshToken",newRefreshToken,options)
.json(new ApiResponse(
    200,{accessToken,refreshAccessToken:newRefreshToken},"Access token Refreshed successfully"))

} catch (error) {
    throw new ApiError(500,"Something went wrong while generating the access token")
}
})


const changeCurrentPassword = asyncHandler(async(req,res)=>{
    const {oldPassword , newPassword} = req.body

   const user = await User.findById(req.user?._id)
   const isPasswordvalid = await user.isPasswordCorrect(oldPassword)

   if(!isPasswordvalid){
    throw new ApiError(401, "old password is incorrect")
   }

   user.password = newPassword,
   await user.save({validateBeforeSave:false})
   return res
   .send(200)
   .json(new ApiResponse(200,{},"Password change successfully"))
})

const getCurrentUser = asyncHandler(async(req,res)=>{
    return res
    .send(200)
    .json(new ApiResponse(200,req.user,"Current User details"))

})



const updateAccountDetails = asyncHandler(async(req,res)=>{
    const {fullName, email} = req.body
    if(!fullName || !email){
        throw new ApiError(401,"Full name and email required" )
    }

   const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                fullName,
                email:email
            }
        },
        {new:true}
    ).select("-password")


    return res
    .send(200)
    .json(new ApiResponse(200,user,"Account  details updated successfully"))
})


const updateAvatar = asyncHandler(async(req,res)=>{

    const avatarLocalPath =req.file?.path
    if(!avatarLocalPath){
        throw new Error(400, "File required")
    }


    const avatar =await uploadOnCloudinary(avatarLocalPath)
    if(!avatar.url){
        throw new ApiError(500,"Something went wrong while uploading avatar")
    }


 const user =   await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar:avatar.url
            }
        },
        {new:true}
    ).select("-password -refreshToken")

    return res
    .send(200)
    .json(new ApiResponse(200,user,"Avatar updated successfully"))
})




const updateUserCoverImage = asyncHandler(async(req,res)=>{

    const coverImageLocalPath =req.file?.path
    if(!coverImageLocalPath){
        throw new Error(400, "File required")
    }


    const coverImage =await uploadOnCloudinary(coverImageLocalPath)
    if(!coverImage.url){
        throw new ApiError(500,"Something went wrong while uploading coverImage")
    }



   

 const user =   await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage:coverImage.url
            }
        },
        {new:true}
    ).select("-password -refreshToken")

    return res
    .send(200)
    .json(new ApiResponse(200,user,"Cover Image updated successfully"))

})



const getUSerChannelProfile = asyncHandler(async(req,res)=>{
    const {username} = req.params

    if(!username?.trim()){
        throw new Error(400, "Username is required")
    }
const channel = await User.aggregate(
    [
        {
            $match:{
            username:username?.toLowerCase()
        }
    },{
        $lookup:{
            from:"subscriptions",
            localField:"_id",
            foreignField:"channel",
            as:"subscribers"
        }
    },{
        $lookup:{
            from:"subscriptions",
            localField:"_id",
            foreignField:"subscriber",
            as:"subscribedTo"
        }
    },
    {
        $addFields:{
            subscriberCount:{
                $size:"$subscribers"
            },
            ChannelsSubscribedToCount:{
                $size:"$subscribedTo"
            },
            isSubscribed:{
                $cond:{
                    if:{
                        $in:[req.user?._id,"$subscribers.subscriber"]
                        
                    },
                    then:true,
                    else:false
                }
            }
        }
    },
    {
        // project onlu necessay data

        $project:{
            fullName:1,
            username:1,
            avatar:1,
            subscriberCount:1,
            ChannelsSubscribedToCount:1,
            isSubscribed:1,
            email:1
        }
    }
    ]
)

console.log(channel);
if(!channel.length()){
    throw new ApiError(404,"channel not found")


    return res.status(200).json(new ApiResponse(200, channel[0],
        "channel profile successfully fetched"
    ))
}


})

const getWatchedHistory = asyncHandler(async(req,res)=>{
const user = await User.aggregate(
    [
        {
            $match:{
            _id:new mongoose.Types.ObjectId(req.user?.id)
        }
        },
        {
            $lookup:{
                from:"videos",
                localField:"watchHistory",
                foreignField:"_id",
                as:"watchHistory",
            pipeline:[
                {
                    $lookup:{
                        from:"users",
                     localField:"owner",
                     foreignField:"_id",
                     as:"owner",
                    pipeline:[
                        {
                           $project:{
                            fullName:1,
                            username:1,
                            avatar:1
                           }
                        }
                    ]
                    }
                },
                {
                    $addFields:{
                        owner:{
                            $first:"$owner"
                        }
                    }
                }

            ]
            }
        }
    ]
)

return res.status(200).json(new ApiResponse(200,user[0].watchHistory, "Watched history fetched successfully", ))
})

export {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserCoverImage,
    updateAvatar,
  
    getUSerChannelProfile,
    getWatchedHistory
}

