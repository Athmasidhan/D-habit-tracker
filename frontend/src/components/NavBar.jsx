import { useContext } from "react";
import { HabitContext } from "../context/HabitContext";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo4.png";
import cookie from "js-cookie";

const NavBar = () => {
  const { token, setToken } = useContext(HabitContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    cookie.remove("token");
    setToken(false);
    navigate("/login");
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-[#0f0932]">
      {/* Logo */}
      <div className="flex items-center">
        <img
          src={logo}
          alt="App Logo"
          className="w-44 cursor-pointer"
          onClick={() => navigate("/")}
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col md:flex-row items-center gap-3 mt-4 md:mt-0">
        {token ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 py-2 px-4 rounded-lg text-white font-semibold"
            aria-label="Logout"
          >
            Logout
          </button>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="bg-red-500 py-2 px-4 rounded-lg text-white font-semibold"
              aria-label="Sign In"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/register")}
              className="border border-red-500 py-2 px-4 rounded-lg text-red-500 font-semibold"
              aria-label="Sign Up"
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
