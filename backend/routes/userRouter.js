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
    markCompleted,
} from '../controllers/habitController.js';

const userRouter = express.Router();

// Auth Routes
userRouter.post('/register', register);
userRouter.post('/login', login);

// Habit Routes
userRouter.post('/add-habits', authMiddleware, addHabit);
userRouter.get('/habits/user', authMiddleware, getUserHabits); // changed path to avoid conflict
// userRouter.post('/habits', authMiddleware, addHabit); // standardized route
userRouter.delete('/habits/:id', authMiddleware, deleteHabit); // added missing middleware
userRouter.get('/habits', authMiddleware, getHabits);
userRouter.put('/habits/:id', authMiddleware, editHabits);
userRouter.put('/habits/completed/:id', authMiddleware, markCompleted)

export default userRouter;
