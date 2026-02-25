import React from "react";
import { SquareMenu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Account from "./Account";

const Navbar = () => {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="text-white flex flex-col px-8 sm:flex-row sm:items-center sm:gap-6 sm:py-4 bg-stone-200 rounded-lg">

      {/* Top Bar */}
      <div className="w-full flex justify-between items-center">

        {/* Left Side */}
        <div className="flex items-center gap-4">
          <Account />
        </div>

        {/* Menu Icon */}
        <SquareMenu
          size={30}
          className="cursor-pointer bg-stone-900"
          onClick={() => setOpen(!open)}
        />
      </div>

      {/* Toggle Menu */}
      {open && (
        <ul className="flex flex-col gap-4 items-center mt-4">

          <li
            className="font-bold text-gray-900 cursor-pointer"
            onClick={() => navigate("/home")}
          >
            Home
          </li>

          {/* 🔥 Admin Only Option */}
          {user?.role === "Admin" && (
            <li
              className="font-bold text-red-600 cursor-pointer"
              onClick={() => navigate("/admin-dashboard")}
            >
              Admin Dashboard
            </li>
          )}

          <li className="font-bold text-gray-900 cursor-pointer">
            About
          </li>

          <li className="font-bold text-gray-900 cursor-pointer">
            Contact
          </li>

          {/* Logout */}
          <li
            className="font-bold text-red-500 cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </li>

        </ul>
      )}
    </div>
  );
};

export default Navbar;