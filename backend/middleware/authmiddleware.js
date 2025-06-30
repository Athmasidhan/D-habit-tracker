import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: No token provided"
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded?.id || !Types.ObjectId.isValid(decoded.id)) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Invalid user ID"
            });
        }

        req.user = { id: decoded.id };
        next();
    } catch (error) {
        console.error("❌ JWT Error:", error.message);
        return res.status(401).json({
            success: false,
            message: "Unauthorized: Invalid or expired token"
        });
    }
};

export default authMiddleware;
