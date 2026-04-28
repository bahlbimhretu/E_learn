import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Menu } from "lucide-react";

const Navbar = ({ setOpen }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="bg-white px-4 py-3 shadow flex items-center justify-between">
      
      {/* LEFT */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(true)}
          className="md:hidden"
        >
          <Menu size={22} />
        </button>

        <h1 className="font-semibold text-sm sm:text-lg">
          Welcome, {user?.name}
        </h1>
      </div>

      {/* RIGHT */}
      <button
        onClick={() => {
          logout();
          navigate("/login");
        }}
        className="px-3 py-1 text-sm sm:text-base bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;