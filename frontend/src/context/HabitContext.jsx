import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cookie from "js-cookie";
import { toast } from "react-toastify";
import axios from "axios";

// Context creation
export const HabitContext = createContext();

const HabitContextProvider = ({ children }) => {
    const navigate = useNavigate();

    // States
    const [token, setToken] = useState(!!cookie.get("token"));
    const [habitData, setHabitData] = useState([]);

    // Backend URL
    const backendUrl = "http://localhost:3000";

    // Helper: Get auth token from cookies
    const getAuthToken = () => cookie.get("token");

    // ✅ Fetch all habits
    const fetchHabits = async () => {
        try {
            const token = getAuthToken();
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const { data } = await axios.get(`${backendUrl}/api/user/habits`, config);

            if (data.success) {
                setHabitData(data.data || []);
            }
        } catch (error) {
            console.error("Fetch Habits Error:", error);
            toast.error("Failed to fetch habits.");
        }
    };
    
    
    // ✅ Register new user
    const handleRegister = async (name, email, password) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/user/register`,
                { name, email, password },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                }
            );

            if (data.success) {
                cookie.set("token", data.token, { expires: 7 });
                setToken(true);
                setHabitData(data.data || []);
                toast.success(data.message || "Registered successfully");
                navigate("/Habits");
            }
        } catch (error) {
            console.error("Register Error:", error);
            toast.error(error?.response?.data?.message || "Registration failed");
        }
    };

    // ✅ User login
    const handleLogin = async (email, password) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/user/login`,
                { email, password },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                }
            );

            if (data.success) {
                cookie.set("token", data.token, { expires: 7 });
                setToken(true);
                setHabitData(data.data || []);
                toast.success(data.message || "Login successful");
                navigate("/Habits");
            }
        } catch (error) {
            console.error("Login Error:", error);
            toast.error(error?.response?.data?.message || "Login failed");
        }
    };

    // ✅ Add new habit
    const addHabit = async (name, description, frequency, logs = []) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/user/add-habits`,
                { name, description, frequency, logs },
                {
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`
                    }
                }
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

    // ✅ Delete habit
    const deleteHabit = async (id) => {
        try {
            const { data } = await axios.delete(
                `${backendUrl}/api/user/habits/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`
                    }
                }
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

    // ✅ Mark habit complete
    const markComplete = async (id) => {
        try {
            const { data } = await axios.put(
                `${backendUrl}/api/user/habits/completed/${id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`
                    }
                }
            );

            if (data.success) fetchHabits();
        } catch (error) {
            console.error("Complete Habit Error:", error);
            toast.error("Failed to mark habit as complete");
        }
    };
    

    // Fetch habits when token is available
    useEffect(() => {
        if (token) fetchHabits();
    }, [token]);

    // Provide context values
    return (
        <HabitContext.Provider
            value={{
                token,
                setToken,
                habitData,
                setHabitData,
                backendUrl,
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
