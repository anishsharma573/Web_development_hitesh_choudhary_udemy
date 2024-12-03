import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import dotenv from "dotenv"
import { log } from "console";
dotenv.config()

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY, 
  api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        console.log("error on cloudinary",error);

        
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

const deleteFromCloudinary = async (publicId)=>{
    try {
     const result = await  cloudinary.uploader.destroy(publicId)
    console.log("DELETED FROM CLOUDINARY");
    return result

    
    } catch (error) {
        console.log("ERROR DELETING FROM CLOUDINARY",error);
        
    }
}



export {uploadOnCloudinary,deleteFromCloudinary}