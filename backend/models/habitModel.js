import mongoose from "mongoose";

const habitSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: [true, "Habit name is required"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Habit description is required"],
        trim: true,
    },
    frequency: {
        type: [String],
        enum: ["Daily", "Weekly", "Monthly"], // Match frontend values (case-sensitive)
        required: [true, "Please select at least one frequency"],
    },
    logs: [
        {
            date: {
                type: Date,
                required: true,
            },
            completed: {
                type: Boolean,
                default: false,
            },
        },
    ],
}, {
    timestamps: true,
});

const Habit = mongoose.models.Habit || mongoose.model("Habit", habitSchema);
export default Habit;
