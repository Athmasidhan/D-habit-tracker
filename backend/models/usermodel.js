import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    }
}, {
    timestamps: true
});

// Prevent model overwrite issues in dev environments
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;