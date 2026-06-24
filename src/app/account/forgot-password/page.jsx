import { useState } from "react";
import { Link } from "react-router-dom";
import { HeartPulse } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      setStatus({ type: "success", message: data.message || "Reset link generated in server logs" });
    } catch {
      setStatus({ type: "error", message: "Failed to generate link" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-slate-100 font-sans">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl mb-4">
            <HeartPulse size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Forgot Password</h1>
          <p className="text-slate-400 mt-2 text-sm">
            Enter your email to receive a password reset link.
          </p>
        </div>

        <form onSubmit={onSubmit} className="bg-slate-900/60 rounded-2xl p-8 border border-slate-800 shadow-2xl space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-350 mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-650 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors text-sm"
              placeholder="admin@nursesalliancenetwork.org"
            />
          </div>

          {status && (
            <div className={`p-3 rounded-lg text-sm border ${status.type === "success" ? "bg-teal-500/10 border-teal-500/20 text-teal-400" : "bg-red-500/10 border-red-500/20 text-red-450"}`}>
              {status.message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-500 hover:to-cyan-400 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg text-sm"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center mt-6">
          <Link to="/account/signin" className="text-slate-500 hover:text-slate-350 text-sm transition-colors">
            &larr; Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
