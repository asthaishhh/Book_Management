// components/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { LockKeyhole, Mail } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "omit",
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log("Logged in successfully!");
        navigate("/home"); // Redirect to home page
      } else {
        setError(data.msg || "Login failed");
      }
    } catch (err) {
      setError("Login failed: " + err.message);
      console.error("Login failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleLogin}
        className="bg-stone-100 p-6 rounded shadow-md w-80"
      >
        <h2 className="text-xl font-bold mb-4">Login</h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-4">
            {error}
          </div>
        )}

        <div className="relative mb-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border w-full p-2 mb-3 rounded-lg"
            required
            disabled={loading}
          />
          <Mail
            className="absolute right-3 top-1/3 bottom-1/3 -translate-y-1/2 text-gray-500"
            size={18}
          />
        </div>

        <div className="relative mb-3">
          {" "}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border w-full p-2 mb-3 rounded-lg"
            required
            disabled={loading}
          />
          <LockKeyhole
            className="absolute right-3 top-1/3 bottom-1/3 -translate-y-1/2 text-gray-500"
            size={18}
          />
        </div>

        <div className="flex justify-center"> 
          <button
          className="bg-blue-500 text-white w-[50%] p-2 rounded-full hover:bg-blue-600 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        </div>
        

        <p className="text-center mt-4 text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
