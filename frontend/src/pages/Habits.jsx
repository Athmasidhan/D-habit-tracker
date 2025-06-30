import { useContext, useState } from "react";
import { HabitContext } from "../context/HabitContext";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import HabitAnalytics from "../components/HabitAnalytics";
import { toast } from "react-toastify";

const Habits = () => {
  const { habitData = [], markComplete, addHabit, deleteHabit } = useContext(HabitContext);

  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [showModal, setShowModal] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: "",
    description: "",
    frequency: [],
    logs: [],
  });

  const handleCompleteClick = async (id) => {
    try {
      await markComplete(id);
    } catch (error) {
      console.error("Complete Habit Error:", error);
      toast.error("Failed to mark as complete");
    }
  };

  const addHabitHandler = async (e) => {
    e.preventDefault();
    const currentDate = new Date().toISOString().split("T")[0];
    try {
      await addHabit(
        newHabit.name,
        newHabit.description,
        newHabit.frequency,
        [{ date: currentDate, completed: false }]
      );
      setShowModal(false);
      setNewHabit({ name: "", description: "", frequency: [], logs: [] });
    } catch (error) {
      console.error("Add Habit Error:", error);
      toast.error(error?.response?.data?.message || "An unexpected error occurred");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteHabit(id);
    } catch (error) {
      console.error("Delete Habit Error:", error);
      toast.error("Failed to delete habit");
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="lg:text-2xl text-lg font-bold text-white">Habit Tracker</h1>
        <div className="flex flex-col items-center">
          <label htmlFor="date" className="text-sm md:text-lg text-white">Pick the date</label>
          <input
            id="date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-400 rounded px-2 py-1 focus:outline-none shadow-lg"
          />
        </div>
      </div>

      {/* Add Habit Button */}
      <button
        onClick={() => setShowModal(true)}
        className="bg-red-600 px-4 py-2 text-white rounded-xl hover:scale-105 transition-all duration-300"
      >
        Add Habit
      </button>

      {/* Modal for Adding Habit */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add New Habit</h2>
            <form onSubmit={addHabitHandler}>
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                  className="w-full border px-2 py-1 rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea
                  value={newHabit.description}
                  onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                  className="w-full border px-2 py-2 rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Frequency</label>
                <select
                  multiple
                  value={newHabit.frequency}
                  onChange={(e) =>
                    setNewHabit({
                      ...newHabit,
                      frequency: Array.from(e.target.selectedOptions, (option) => option.value),
                    })
                  }
                  className="w-full border px-2 py-1 rounded"
                  required
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-[#140746] text-white px-4 py-2 rounded">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Habit List and Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Habit List */}
        <div className="col-span-2 bg-gray-100 p-4 rounded-3xl shadow">
          <h2 className="text-2xl text-[#140746] font-bold mb-4">Your Habits</h2>
          <div className="space-y-4 overflow-y-auto h-96">
            {habitData.length === 0 ? (
              <p className="text-gray-600">No habits yet. Add one to get started!</p>
            ) : (
              habitData.map((habit) => {
                const log = (habit.logs || []).find((l) => l.date === selectedDate);
                const completed = log?.completed;

                return (
                  <div
                    key={habit._id}
                    className="flex items-center justify-between p-3 bg-white rounded shadow-sm border"
                  >
                    <div>
                      <h3 className={`font-semibold text-gray-800 ${completed ? "line-through" : ""}`}>
                        {habit.name}
                      </h3>
                      <p className={`text-sm text-gray-600 ${completed ? "line-through" : ""}`}>
                        {habit.description}
                      </p>
                    </div>

                    <div className="flex gap-2 items-center">
                      {selectedDate === today && (
                        <>
                          <button
                            onClick={() => handleCompleteClick(habit._id)}
                            className="md:px-4 md:py-2 text-sm px-2 py-1 bg-[#140746] text-white rounded hover:scale-105 transition-all duration-300"
                          >
                            {completed ? "Completed" : "Mark as Done"}
                          </button>

                          <button aria-label="Edit">
                            <FaEdit className="text-2xl text-blue-500" />
                          </button>

                          <button onClick={() => handleDelete(habit._id)} aria-label="Delete">
                            <MdOutlineDeleteOutline className="text-2xl text-red-500" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Analytics */}
        <HabitAnalytics habits={habitData} selectedDate={selectedDate} />
      </div>
    </div>
  );
};

export default Habits;
