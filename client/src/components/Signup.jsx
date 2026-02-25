// components/Signup.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LockKeyhole, LockIcon, Mail, UserRound } from "lucide-react";
const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log("Account created successfully!");
        navigate("/login"); // Redirect to home page
      } else {
        setError(data.msg || "Signup failed");
      }
    } catch (err) {
      setError("Signup failed: " + err.message);
      console.error("Signup failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSignup}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h2 className="text-xl font-bold mb-4">Sign Up</h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-4">
            {error}
          </div>
        )}

        <div className="relative mb-3">
          <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border w-full p-2 mb-3 rounded-lg"
          required
          disabled={loading}
        />
        <UserRound className="absolute right-3 top-1/3 bottom-1/3 -translate-y-1/2 text-gray-500"/>
        </div>

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
          <Mail className="absolute right-3 top-1/3 bottom-1/3 -translate-y-1/2 text-gray-500" />
        </div>
        <div className=" relative mb-3">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border w-full p-2 mb-3 rounded-lg"
            required
            disabled={loading}
          />
          <LockIcon className="absolute right-3 top-1/3 bottom-1/3 -translate-y-1/2 text-gray-500" />
        </div>
        <div className="relative mb-3">
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border w-full p-2 mb-3 rounded-lg"
            required
            disabled={loading}
          />
          <LockKeyhole className="absolute right-3 top-1/3 bottom-1/3 -translate-y-1/2 text-gray-500" />
        </div>

        <div className="flex justify-center">  
        <button
          className="bg-blue-500 text-white w-[50%] p-2 rounded-full hover:bg-blue-600 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
</div>
        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
