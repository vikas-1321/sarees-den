import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("user");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const payload = { email, role, fullName };

    if (isLogin) {
      login(payload);
    } else {
      register(payload);
    }

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#fffaf5] flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">

        {/* Heading */}
        <h2 className="text-3xl font-bold text-center text-[#7b1e1e] mb-6">
          {isLogin ? "Login" : "Create Account"}
        </h2>

        {/* Toggle */}
        <div className="flex mb-6 rounded-lg overflow-hidden border">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 ${
              isLogin ? "bg-[#7b1e1e] text-white" : "bg-white"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 ${
              !isLogin ? "bg-[#7b1e1e] text-white" : "bg-white"
            }`}
          >
            Register
          </button>
        </div>

        {/* Role */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Account Type</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="user">Customer</option>
            <option value="admin">Seller</option>
          </select>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            />
          )}

          <input
            type="email"
            placeholder="Email address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />

          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            />
          )}

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-[#7b1e1e] text-white py-3 rounded-lg font-semibold hover:bg-[#5e1515]"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          {isLogin
            ? "New here? Switch to Register"
            : "Already have an account? Switch to Login"}
        </p>
      </div>
    </div>
  );
};

export default Auth;
