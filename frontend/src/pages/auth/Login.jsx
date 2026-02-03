import { useState, useContext } from "react";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", { email, password });

      const user = {
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
      };

      login(user, res.data.token);

      const role = user.role;
      if (role === "admin") window.location.href = "/admin";
      else if (role === "teacher") window.location.href = "/teacher";
      else if (role === "parent") window.location.href = "/parent";
      else window.location.href = "/dashboard";
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-200 px-4">

      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border">

        {/* Logo + Title */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="/tsinseta.jpg"
            alt="Tsinseta Le Mariam School Logo"
            className="w-20 h-20 rounded-full shadow mb-3"
          />
          <h1 className="text-xl font-bold text-gray-800 text-center">
            Tsinseta Le Mariam Secondary School
          </h1>
          <p className="text-sm text-gray-500">Learning Management System</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-400 text-red-600 px-3 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin}>

          <label className="text-sm font-semibold text-gray-600">
            Email
          </label>
          <input
            type="email"
            className="w-full p-2 mt-1 mb-4 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="text-sm font-semibold text-gray-600">
            Password
          </label>
          <input
            type="password"
            className="w-full p-2 mt-1 mb-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Forgot Password Link */}
          <div className="flex justify-end mb-4">
            <a
              href="/forgot-password"
              className="text-xs text-blue-600 hover:underline"
            >
              Forgot your password?
            </a>
          </div>

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
          >
            Login
          </button>

        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          © {new Date().getFullYear()} Tsinseta Le Mariam Secondary School
        </p>

      </div>
    </div>
  );
};

export default Login;
