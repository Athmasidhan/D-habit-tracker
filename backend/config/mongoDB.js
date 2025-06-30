import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || "mongodb://mongo:27017/habit-tracker";

        await mongoose.connect(uri);
        console.log("✅ Database connected");
    } catch (err) {
        console.error("❌ MongoDB connection failed:", err.message);
        process.exit(1);
    }
};

export default connectDB;
