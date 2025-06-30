import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const HabitAnalytics = ({ habits, selectedDate }) => {
  if (!Array.isArray(habits)) return null;

  const today = new Date().toISOString().split("T")[0];
  const dateObj = new Date(selectedDate);
  dateObj.setDate(dateObj.getDate() - 1);
  const yesterday = dateObj.toISOString().split("T")[0];

  const completedToday = habits.filter((habit) =>
    habit.logs?.some((log) =>
      log.date?.slice(0, 10) === selectedDate && log.completed
    )
  ).length;

  const completedYesterday = habits.filter((habit) =>
    habit.logs?.some((log) =>
      log.date?.slice(0, 10) === yesterday && log.completed
    )
  ).length;

  const totalHabits = habits.length;
  const progressToday = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;

  return (
    <div className="bg-white p-6 h-auto rounded-3xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Analytics</h2>

      {selectedDate === today && (
        <div className="mb-5">
          <p className="text-xl font-semibold text-gray-700">
            Total Habits Added:{" "}
            <span className="ml-2 text-2xl font-bold text-gray-900">
              {totalHabits}
            </span>
          </p>
        </div>
      )}

      <div className="mb-5">
        <p className="text-xl font-semibold text-gray-700">
          Completed Habits{" "}
          {selectedDate === today ? "Today" : `on ${selectedDate}`}:
          <span className="ml-1 font-bold">{completedToday}</span>
        </p>
      </div>

      <div className="mb-5 flex items-center justify-center mt-4">
        <div style={{ width: "200px", height: "200px" }}>
          <CircularProgressbar
            value={progressToday}
            text={`${Math.round(progressToday)}%`}
            styles={buildStyles({
              pathColor: "#140746",
              textColor: "#333",
              trailColor: "#eee",
              textSize: "11px",
              pathTransition: "stroke-dashoffset 0.5s ease 0s"
            })}
          />
        </div>
      </div>

      <div className="flex flex-row items-center justify-start">
        <p className="text-xl font-semibold text-gray-700">
          {completedYesterday} Habit{completedYesterday !== 1 ? "s" : ""} completed yesterday ({yesterday})
        </p>
      </div>
    </div>
  );
};

export default HabitAnalytics;
