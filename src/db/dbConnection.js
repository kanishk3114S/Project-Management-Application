import mongoose from "mongoose";

// mongoose acts as a connection helper between the server and MongoDB

const connectDB = async () => {
    const uri = process.env.MONGO_URI && process.env.MONGO_URI.trim();
    if (!uri) {
        console.error("MONGO_URI is not set. Please add MONGO_URI to your .env file.");
        process.exit(1);
    }

    if (!/^mongodb(\+srv)?:\/\//i.test(uri)) {
        console.error(
            "Invalid MONGO_URI scheme. Expected 'mongodb://' or 'mongodb+srv://'. Found:",
            uri
        );
        process.exit(1);
    }

    try {
        await mongoose.connect(uri);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("Mongo error:", error);
        process.exit(1);
    }
};

export default connectDB;