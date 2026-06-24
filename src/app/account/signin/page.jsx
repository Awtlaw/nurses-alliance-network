import { useState } from "react";
import { Link } from "react-router-dom";
import { HeartPulse, Eye, EyeOff } from "lucide-react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }
      
      window.location.href = "/admin";
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-slate-100 font-sans">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl mb-4">
            <HeartPulse size={22} className="text-white animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold text-white">NAN Admin Portal</h1>
          <p className="text-slate-400 mt-2 text-sm">
            Sign in to manage portal settings and inquiries.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="bg-slate-900/60 rounded-2xl p-8 border border-slate-800 shadow-2xl"
        >
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-350 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@nursesalliancenetwork.org"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-650 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-350 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 pr-12 text-white placeholder-slate-650 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-500 hover:to-cyan-400 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg text-sm"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>

          <div className="flex justify-between items-center mt-6 text-sm text-slate-500">
            <Link
              to="/account/forgot-password"
              className="text-teal-400 hover:text-teal-300"
            >
              Forgot Password?
            </Link>
          </div>
        </form>

        <p className="text-center mt-6">
          <Link
            to="/"
            className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
          >
            &larr; Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}
