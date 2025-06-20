import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connection.on("connected", () => console.log("✅ Database connected"))

    try {
        await mongoose.connect(process.env.MONGODB_URI)
    } catch (err) {
        console.error("❌ MongoDB connection failed:", err.message)
        process.exit(1)
    }
}

export default connectDB
