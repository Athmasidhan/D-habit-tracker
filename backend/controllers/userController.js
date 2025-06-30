import userModel from "../models/usermodel.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const register = async (req, res) => {
    try {
        const {
            name,
            email,
            password
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const existingUser = await userModel.findOne({
            email
        });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt());

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });
        await newUser.save();

        const token = jwt.sign({
            id: newUser._id,
            email: newUser.email
        }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: newUser._id,
                userName: newUser.name,
                email: newUser.email
            },
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error."
        });
    }
};

const login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const user = await userModel.findOne({
            email
        });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials."
            });
        }

        const token = jwt.sign({
            id: user._id,
            email: user.email
        }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                userName: user.name,
                email: user.email
            },
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error."
        });
    }
};

export {
    register,
    login
};
