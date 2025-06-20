import userModel from "../models/usermodel.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const register = async (req, res) => {
    try {
        const {
            name,
            email,
            password
        } = req.body

        if (!name || !email || !password) {
            return res.status(401).json({
                success: false,
                message: "All fields required"
            })
        }

        const existingUser = await userModel.findOne({
            email
        })

        if (existingUser) {
            return res.status(401).json({
                success: false,
                message: "User already exists."
            })
        }

        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })

        await newUser.save()

        const token = jwt.sign({
            id: newUser._id,
            email: newUser.email
        }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        })

        res.cookie(token, {
            httpOnly: false,
            secure: false,
            sameSite: 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        const userResponse = {
            id: newUser._id,
            userName: newUser.name,
            email: newUser.email
        }

        res.status(201).json({
            success: true,
            message: "User register successfully",
            user: userResponse,
            token: token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error."
        })
    }
}

const login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body

        if (!email, !password) {
            return res.status(401).json({
                success: false,
                message: "All fields required"
            })
        }

        const user = await userModel.findOne({
            email
        })

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found."
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials."
            })
        }

        const token = jwt.sign({
            id: user._id,
            email: user.email
        }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        })

        res.cookie(token, {
            httpOnly: false,
            secure: false,
            sameSite: 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        const userResponse = {
            id: user._id,
            userName: user.name,
            email: user.email
        }

        res.status(200).json({
            success: true,
            message: "Login successfull",
            user: userResponse,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error."
        })
    }
}

export { register, login }