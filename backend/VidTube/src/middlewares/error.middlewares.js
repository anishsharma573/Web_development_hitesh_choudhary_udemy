import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
    let error = err;

    // Wrap non-ApiError exceptions
    if (!(error instanceof ApiError)) {
        const statusCode = err.statusCode || (err instanceof mongoose.Error ? 400 : 500);
        const message = err.message || "Something went wrong";
        error = new ApiError(statusCode, message, err?.errors || [], err.stack);
    }

    // Format error response
    const errorResponse = {
        success: error.success,
        statusCode: error.statusCode,
        message: error.message,
        errors: error.errors,
        ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    };

    // Ensure status code is set
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json(errorResponse);
};

export { errorHandler };
