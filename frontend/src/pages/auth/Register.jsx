import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

const Register = () => {
  const { login } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); // reset error
   const navigate = useNavigate();

useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (!storedUser || storedUser.role !== "admin") {
    navigate("/login"); // or /unauthorized
  }
}, []);

    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      // backend returns user info at root of res.data
      const user = {
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
      };
      const token = res.data.token;

      // check user and token exist
      if (!user || !token) {
        setError("Invalid response from server");
        return;
      }

      // auto-login
      login(user, token);

      // redirect based on role
      const userRole = user?.role || "student";
      if (userRole === "admin") window.location.href = "/admin";
      else if (userRole === "teacher") window.location.href = "/teacher";
      else if (userRole === "library-admin") window.location.href = "/library";
      else window.location.href = "/dashboard";

    } catch (err) {
      console.log("Registration error:", err);
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Register</h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-2 border rounded mb-3"
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-3"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-3"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <select
          className="w-full p-2 border rounded mb-3"
          onChange={(e) => setRole(e.target.value)}
          defaultValue="student"
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="library-admin">Library Admin</option>
          <option value="admin">Admin</option>
        </select>

        <button className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition">
          Create Account
        </button>

        <p className="text-center text-sm mt-3">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;
