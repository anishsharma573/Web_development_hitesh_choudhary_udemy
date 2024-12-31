const { getDataFromToken } = require("@/helpers/getDataFromToken");

import User from "@/models/userModel";
import connect from "@/dbConfig/dbConfig";
import { NextRequest,NextResponse } from "next/server";

connect()

export async function GET(request){
    try {
       const userID = await getDataFromToken(request)
       const user = await User.findById({_id:userID}).select('-password')
     return NextResponse.json({
        message:"User found",
        data:user
     })
    } catch (error) {
        return NextResponse.json(
            
            { message: "Error" },
            {status:400}
        )

    }
}