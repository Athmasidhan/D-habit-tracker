import express from 'express';
import {
    login,
    register
} from '../controllers/userController.js';
import authMiddleware from '../middleware/authmiddleware.js';
import {
    getUserHabits,
    addHabit,
    deleteHabit,
    editHabits,
    getHabits,
    markCompleted
} from '../controllers/habitController.js';

const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.post('/logout', (req, res) => {
    res.clearCookie("token");
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
});

userRouter.use(authMiddleware);

userRouter.post('/habits', addHabit);
userRouter.get('/habits/user', getUserHabits);
userRouter.get('/habits', getHabits);
userRouter.put('/habits/:id', editHabits);
userRouter.put('/habits/completed/:id', markCompleted);
userRouter.delete('/habits/:id', deleteHabit);

export default userRouter;
