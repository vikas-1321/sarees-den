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
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation for Registration
    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        // Firebase Login Logic
        await login(email, password);
      } else {
        // Firebase Registration Logic with Firestore Role Storage
        await register(email, password, role, fullName);
      }
      navigate("/");
    } catch (err) {
      console.error("AUTH_ERROR:", err.code);
      
      // Map Firebase error codes to user-friendly messages
      switch (err.code) {
        case "auth/user-not-found":
          setError("No account found with this email.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password. Please try again.");
          break;
        case "auth/email-already-in-use":
          setError("This email is already registered.");
          break;
        case "auth/weak-password":
          setError("Password should be at least 6 characters.");
          break;
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;
        default:
          setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffaf5] flex items-center justify-center px-4 font-serif">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 border border-[#f5e6d3]">

        {/* Heading */}
        <h2 className="text-3xl font-light text-center text-[#7b1e1e] mb-8 uppercase tracking-widest">
          {isLogin ? "Welcome Back" : "Join the Heritage"}
        </h2>

        {/* Login/Register Toggle */}
        <div className="flex mb-8 rounded-sm overflow-hidden border border-gray-200 p-1">
          <button
            onClick={() => { setIsLogin(true); setError(""); }}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
              isLogin ? "bg-[#7b1e1e] text-white" : "bg-white text-gray-500 hover:text-[#7b1e1e]"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(""); }}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
              !isLogin ? "bg-[#7b1e1e] text-white" : "bg-white text-gray-500 hover:text-[#7b1e1e]"
            }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Role Selection (Only visible during Registration) */}
          {!isLogin && (
            <div className="animate-fadeIn">
              <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">
                Account Type
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border-b border-gray-300 focus:border-[#7b1e1e] outline-none px-0 py-2 text-sm transition-colors"
              >
                <option value="user">Customer</option>
                <option value="admin">Seller (Admin)</option>
              </select>
            </div>
          )}

          {!isLogin && (
            <input
              type="text"
              placeholder="FULL NAME"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border-b border-gray-300 focus:border-[#7b1e1e] outline-none px-0 py-2 text-sm placeholder:text-gray-300"
            />
          )}

          <input
            type="email"
            placeholder="EMAIL ADDRESS"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-b border-gray-300 focus:border-[#7b1e1e] outline-none px-0 py-2 text-sm placeholder:text-gray-300"
          />

          <input
            type="password"
            placeholder="PASSWORD"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-b border-gray-300 focus:border-[#7b1e1e] outline-none px-0 py-2 text-sm placeholder:text-gray-300"
          />

          {!isLogin && (
            <input
              type="password"
              placeholder="CONFIRM PASSWORD"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border-b border-gray-300 focus:border-[#7b1e1e] outline-none px-0 py-2 text-sm placeholder:text-gray-300"
            />
          )}

          {error && (
            <p className="text-xs text-red-600 bg-red-50 p-2 text-center italic">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7b1e1e] text-white py-4 rounded-sm font-bold uppercase tracking-[0.2em] text-xs hover:bg-black transition-all disabled:opacity-50 mt-4 shadow-md"
          >
            {loading ? "AUTHENTICATING..." : isLogin ? "LOG IN" : "CREATE ACCOUNT"}
          </button>
        </form>

        <div className="text-center mt-8">
            <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-[10px] text-gray-400 uppercase tracking-widest hover:text-[#7b1e1e] transition-colors"
            >
                {isLogin ? "Need an account? Sign Up" : "Already have an account? Log In"}
            </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;