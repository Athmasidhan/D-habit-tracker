import { useContext, useState } from "react";
import { HabitContext } from "../context/HabitContext";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const { handleLogin } = useContext(HabitContext);
  const navigate = useNavigate();

  const [userFormData, setUserFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    const { email, password } = userFormData;
    if (email && password) {
      handleLogin(email, password);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#140746]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Sign in</h2>
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={userFormData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={userFormData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#140746] text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Sign in
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Don&apos;t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-400 underline cursor-pointer"
          >
            Create Account
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
