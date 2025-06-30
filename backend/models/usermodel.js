import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true, // ✅ Only use this OR schema.index() below (not both)
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    }
}, {
    timestamps: true
});

// ❌ REMOVE this to avoid duplicate index warning if `unique: true` is already in the schema
// userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
