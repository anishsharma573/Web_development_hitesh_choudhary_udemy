import mongoose ,{Schema} from "mongoose";

import mongooseAggregatePaginate from "mongoose-aggregate-paginate";
const videoSchema = new Schema(
    {
 videoFile:{     // cloudinary url
      type:String,
      required:true
 },
 thumbnail:{     // cloudinary url
    type:String,
    required:true
},
title:{    
    type:String,
    required:true
},
description:{    
    type:String,
},
views:{    
    type:Number,
    required:true
},
duration:{    
    type:Number,
    default:0
},
isPublished:{
    type:Boolean,
    default:true
},
owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
}


    },{timestamps:true}
)


videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video",videoSchema)