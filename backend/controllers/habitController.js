import habitModel from "../models/habitModel.js";
import User from "../models/usermodel.js";

const getUserHabits = async (req, res) => {
  try {
    const user = await User.findById(req.user ?.id);
    if (!user) return res.status(404).json({
      success: false,
      message: "User not found"
    });
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

const addHabit = async (req, res) => {
  try {
    const {
      name,
      description,
      frequency
    } = req.body;
    const newHabit = new habitModel({
      userId: req.user.id,
      name,
      description,
      frequency,
      logs: [{
        date: new Date(),
        completed: false
      }]
    });
    const savedHabit = await newHabit.save();
    res.status(201).json({
      success: true,
      message: "Habit added successfully",
      data: savedHabit
    });
  } catch (error) {
    console.error("Add Habit Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

const deleteHabit = async (req, res) => {
  try {
    const deletedHabit = await habitModel.findByIdAndDelete(req.params.id);
    if (!deletedHabit) return res.status(404).json({
      success: false,
      message: "Habit not found"
    });
    res.status(200).json({
      success: true,
      message: "Habit deleted successfully"
    });
  } catch (error) {
    console.error("Delete Habit Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

const getHabits = async (req, res) => {
  try {
    const habits = await habitModel.find({
      userId: req.user.id
    });
    res.status(200).json({
      success: true,
      data: habits
    });
  } catch (error) {
    console.error("Get Habits Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

const editHabits = async (req, res) => {
  try {
    const updatedHabit = await habitModel.findOneAndUpdate({
        _id: req.params.id,
        userId: req.user.id
      },
      req.body, {
        new: true
      }
    );
    if (!updatedHabit) return res.status(404).json({
      success: false,
      message: "Habit not found"
    });
    res.status(200).json({
      success: true,
      message: "Habit updated successfully",
      data: updatedHabit
    });
  } catch (error) {
    console.error("Edit Habit Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

const markCompleted = async (req, res) => {
  const today = new Date().setHours(0, 0, 0, 0);
  try {
    const updatedHabit = await habitModel.findByIdAndUpdate({
      _id: req.params.id
    }, {
      $set: {
        "logs.$[log].completed": true
      }
    }, {
      new: true,
      arrayFilters: [{
        "log.date": {
          $eq: new Date(today)
        }
      }]
    });

    if (!updatedHabit) return res.status(404).json({
      success: false,
      message: "Habit not found"
    });

    const logExists = updatedHabit.logs.some(log => new Date(log.date).setHours(0, 0, 0, 0) === today);
    if (!logExists) {
      updatedHabit.logs.push({
        date: new Date(today),
        completed: true
      });
      await updatedHabit.save();
    }

    res.status(200).json({
      success: true,
      message: "Habit marked as completed",
      data: updatedHabit
    });
  } catch (error) {
    console.error("Mark Completed Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

export {
  getUserHabits,
  addHabit,
  deleteHabit,
  getHabits,
  editHabits,
  markCompleted
};
