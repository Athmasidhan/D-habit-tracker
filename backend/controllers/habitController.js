import habitModel from "../models/habitModel.js";
// Correct way to import userModel from inside /controllers
import User from "../models/userModel.js";


// ✅ Get User Habits (from user doc)
const getUserHabits = async (req, res) => {
  try {
    const userId = req.userId || req.user?.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Optional: populate habits if stored as references
    // const populatedUser = await user.populate('habits');

    res.status(200).json({
      success: true,
      data: user.habits || []
    });
  } catch (error) {
    console.error("Get Habits Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// ✅ Add Habit
const addHabit = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { name, description, frequency } = req.body;

    if (!name || !description || !frequency) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const currentDate = new Date().toISOString().split("T")[0];
    const newHabit = new habitModel({
      userId,
      name,
      description,
      frequency,
      logs: [{ date: currentDate, completed: false }]
    });

    const savedHabit = await newHabit.save();

    res.status(201).json({
      success: true,
      message: "Habit added successfully",
      data: savedHabit
    });
  } catch (error) {
    console.log("Add Habit Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

// ✅ Delete Habit
const deleteHabit = async (req, res) => {
  try {
    const habitId = req.params.id;
    const deletedHabit = await habitModel.findByIdAndDelete(habitId);

    if (!deletedHabit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Habit deleted successfully"
    });
  } catch (error) {
    console.log("Delete Habit Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

// ✅ Get All Habits for Authenticated User
const getHabits = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    const habits = await habitModel.find({ userId });

    res.status(200).json({
      success: true,
      data: habits
    });
  } catch (error) {
    console.log("Get Habits Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

// ✅ Edit Habit
const editHabits = async (req, res) => {
  try {
    const habitId = req.params.id;
    const userId = req.user?.id;
    const { name, description, frequency, logs } = req.body;

    const updatedHabit = await habitModel.findOneAndUpdate(
      { _id: habitId, userId },
      { name, description, frequency, logs },
      { new: true }
    );

    if (!updatedHabit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Habit updated successfully",
      data: updatedHabit
    });
  } catch (error) {
    console.log("Edit Habit Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

// ✅ Mark Today's Log as Completed
const markCompleted = async (req, res) => {
  const habitId = req.params.id;
  const today = new Date().toISOString().split("T")[0];

  try {
    const updatedHabit = await habitModel.findByIdAndUpdate(
      { _id: habitId },
      {
        $set: {
          "logs.$[log].completed": true
        }
      },
      {
        new: true,
        arrayFilters: [{ "log.date": today }]
      }
    );

    // If today's log doesn't exist, add it
    if (updatedHabit) {
      const found = updatedHabit.logs.find(log => log.date === today);
      if (!found) {
        updatedHabit.logs.push({ date: today, completed: true });
        await updatedHabit.save();
      }

      return res.status(200).json({
        success: true,
        message: "Habit marked as completed",
        data: updatedHabit
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Habit not found"
      });
    }
  } catch (error) {
    console.log("Mark Completed Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

// ✅ Export All
export {
  getUserHabits,
  addHabit,
  deleteHabit,
  getHabits,
  editHabits,
  markCompleted
};
