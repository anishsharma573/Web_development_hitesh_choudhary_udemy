import mongoose from "mongoose";

const connect = async function () {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined in the environment variables.");
        }

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const connection = mongoose.connection;

        connection.on("connected", () => {
            console.log("Connected to MongoDB");
        });

        connection.on("error", (err) => {
            console.error("MongoDB connection error:", err);
            process.exit(1); // Exit the process with failure code
        });

        connection.on("disconnected", () => {
            console.warn("MongoDB connection lost. Attempting to reconnect...");
        });
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1); // Exit the process with failure code
    }
};

// Graceful shutdown
process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("MongoDB connection closed due to application termination");
    process.exit(0); // Exit the process gracefully
});

export default connect;
