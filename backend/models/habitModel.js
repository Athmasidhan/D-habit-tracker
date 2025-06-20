import mongoose from "mongoose";

const habitSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // ✅ match the exported model name from userModel
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    frequency: [{
        type: String,
        required: true
    }],
    logs: [{
        date: {
            type: String,
            required: true
        },
        completed: {
            type: Boolean,
            default: false
        }
    }]
}, {
    timestamps: true
});

const habitModel = mongoose.models.Habit || mongoose.model("Habit", habitSchema);

export default habitModel;
