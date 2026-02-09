import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();              // destroy session / token
    navigate("/login");    // redirect to login
  };

  return (
    <div className="bg-white p-4 shadow flex justify-between">
      <h1 className="font-semibold text-lg">Welcome, {user?.name}</h1>

      <button
        onClick={handleLogout}
        className="px-4 py-1 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
