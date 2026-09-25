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

    // Connection Lifecycle Monitoring
    mongoose.connection.on("connected", () => {
        console.log("⚡ [Mongoose] Connection established successfully");
    });

    mongoose.connection.on("error", (err) => {
        console.error("❌ [Mongoose] Connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
        console.warn("⚠️ [Mongoose] Connection lost / disconnected");
    });

    try {
        await mongoose.connect(uri, {
            // How long driver waits to find a primary replica node (default is 30000ms)
            serverSelectionTimeoutMS: 5000, 
            
            // Keep up to 10 socket connections open in pool for fast concurrent queries
            maxPoolSize: 10,
            
            // Keep at least 2 sockets alive to avoid reconnect latency on idle requests
            minPoolSize: 2,
            
            // Close sockets after 45 seconds of inactivity
            socketTimeoutMS: 45000,
        });

        console.log("MongoDB connected");
    } catch (error) {
        console.error("Mongo error:", error);
        process.exit(1);
    }
};

export default connectDB;