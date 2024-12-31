import connect from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";

export async function POST(request) {
    try {
        const reqBody = await request.json();
        const { token } = reqBody;

        if (!token) {
            return NextResponse.json(
                { message: "Token is required", success: false },
                { status: 400 }
            );
        }

        // Decode the token
        const decodedToken = decodeURIComponent(token);

        // Find the user with a matching token and check token expiry
        const user = await User.findOne({
            verifyToken: decodedToken,
            verifyTokenExpiry: {
                $gt: new Date(), // Ensure the token has not expired
            },
        });

        if (!user) {
            return NextResponse.json(
                { message: "Invalid or expired token", success: false },
                { status: 401 }
            );
        }

        // Mark user as verified
        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;
        await user.save();

        return NextResponse.json(
            { message: "Email verified successfully", success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error during email verification:", error.message);
        return NextResponse.json(
            {
                message: "An error occurred during email verification",
                success: false,
                error: error.message,
            },
            { status: 500 }
        );
    }
}
