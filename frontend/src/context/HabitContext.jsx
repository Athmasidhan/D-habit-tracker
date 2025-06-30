import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cookie from "js-cookie";
import { toast } from "react-toastify";
import axios from "axios";

// Create Context
export const HabitContext = createContext();

const HabitContextProvider = ({ children }) => {
    const navigate = useNavigate();
    const [token, setToken] = useState(!!cookie.get("token"));
    const [habitData, setHabitData] = useState([]);

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

    const getAuthToken = () => cookie.get("token");

    const authConfig = () => ({
        headers: {
            Authorization: `Bearer ${getAuthToken()}`
        }
    });

    // 🔄 Fetch Habits
    const fetchHabits = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/habits`, authConfig());
            if (data.success) setHabitData(data.data || []);
        } catch (error) {
            console.error("Fetch Habits Error:", error);
            toast.error("Failed to fetch habits.");
        }
    };

    // 📝 Register
    const handleRegister = async (name, email, password) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/user/register`,
                { name, email, password },
                { headers: { "Content-Type": "application/json" } }
            );

            if (data.success) {
                cookie.set("token", data.token, { expires: 7 });
                setToken(true);
                toast.success(data.message || "Registered successfully");
                navigate("/Habits", { replace: true });
            }
        } catch (error) {
            console.error("Register Error:", error);
            toast.error(error?.response?.data?.message || "Registration failed");
        }
    };

    // 🔐 Login
    const handleLogin = async (email, password) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/user/login`,
                { email, password },
                { headers: { "Content-Type": "application/json" } }
            );

            if (data.success) {
                cookie.set("token", data.token, { expires: 7 });
                setToken(true);
                toast.success(data.message || "Login successful");
                navigate("/Habits", { replace: true });
            }
        } catch (error) {
            console.error("Login Error:", error);
            toast.error(error?.response?.data?.message || "Login failed");
        }
    };

    // ➕ Add Habit
    const addHabit = async (name, description, frequency, logs = []) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/user/habits`,
                { name, description, frequency, logs },
                authConfig()
            );

            if (data.success) {
                toast.success(data.message || "Habit added successfully");
                fetchHabits();
                navigate("/Habits");
            }
        } catch (error) {
            console.error("Add Habit Error:", error);
            toast.error(error?.response?.data?.message || "Failed to add habit");
        }
    };

    // ❌ Delete Habit
    const deleteHabit = async (id) => {
        try {
            const { data } = await axios.delete(
                `${backendUrl}/api/user/habits/${id}`,
                authConfig()
            );

            if (data.success) {
                toast.success(data.message || "Habit deleted");
                fetchHabits();
            }
        } catch (error) {
            console.error("Delete Habit Error:", error);
            toast.error("Failed to delete habit");
        }
    };

    // ✅ Mark Habit Complete
    const markComplete = async (id) => {
        try {
            const { data } = await axios.put(
                `${backendUrl}/api/user/habits/completed/${id}`,
                {},
                authConfig()
            );

            if (data.success) {
                fetchHabits();
            }
        } catch (error) {
            console.error("Complete Habit Error:", error);
            toast.error("Failed to mark habit as complete");
        }
    };

    // 🔁 Auto-fetch habits on login
    useEffect(() => {
        if (token) fetchHabits();
    }, [token]);

    return (
        <HabitContext.Provider
            value={{
                token,
                setToken,
                habitData,
                setHabitData,
                fetchHabits,
                handleRegister,
                handleLogin,
                addHabit,
                deleteHabit,
                markComplete
            }}
        >
            {children}
        </HabitContext.Provider>
    );
};

export default HabitContextProvider;
