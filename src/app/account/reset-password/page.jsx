import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { HeartPulse } from "lucide-react";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    if (password !== confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match" });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, token, newPassword: password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Reset failed");

      setStatus({ type: "success", message: "Password reset successfully!" });
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setStatus({ type: "error", message: err.message });
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
          <h1 className="text-2xl font-bold text-white">Reset Password</h1>
          <p className="text-slate-400 mt-2 text-sm">
            Enter your new password below.
          </p>
        </div>

        <form onSubmit={onSubmit} className="bg-slate-900/60 rounded-2xl p-8 border border-slate-800 shadow-2xl space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-350 mb-2">New Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-650 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-350 mb-2">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-650 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors text-sm"
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
            {loading ? "Resetting..." : "Reset Password"}
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
