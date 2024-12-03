import jwt from "jsonwebtoken"

import { User } from "../models/user.models.js"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"






export const verifyJWT = asyncHandler(async(req,res,next)=>{
    const token= req.cookies.refreshToken || req.header("Authorization").replace("Bearer ","")

    if(!token){
        throw new ApiError(401,"Unauthorized")
    }

    try {
        
       const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || "defaultRefreshTokenSecret", )

      const user = await User.findById(decodedToken._id).select("-password -refreshToken")


      if(!user){
        throw new ApiError(401,"Invalid Refresh token.. user not found by id")
    }

    req.user = user
    next( )


    } catch (error) {
        throw new ApiError(401,error?.message || 
            "Invalid access token "
        )
    }
})

