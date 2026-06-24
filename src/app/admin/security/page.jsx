import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import useUser from "@/utils/useUser";
import { Shield } from "lucide-react";

export default function AdminSecurity() {
  const { data: user, loading } = useUser();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [status, setStatus] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user && typeof window !== "undefined")
      window.location.href = "/account/signin";
  }, [user, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    setStatus(null);

    if (form.newPassword !== form.confirmPassword) {
      setStatus({ type: "error", message: "New passwords do not match" });
      setBtnLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to change password");

      setStatus({ type: "success", message: "Password updated successfully!" });
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setBtnLoading(false);
    }
  };

  if (loading || !user) return null;

  return (
    <AdminLayout title="Security Settings">
      <div className="max-w-xl space-y-6">
        <div className="bg-[#1E293B] border border-white/5 p-6 rounded-2xl">
          <h3 className="text-white font-bold text-sm border-b border-white/5 pb-2 mb-4 flex items-center gap-1.5">
            <Shield size={16} className="text-teal-400" /> Update Password
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Current Password</label>
              <input
                type="password"
                required
                value={form.currentPassword}
                onChange={e => setForm({ ...form, currentPassword: e.target.value })}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">New Password (min 8 chars)</label>
              <input
                type="password"
                required
                value={form.newPassword}
                onChange={e => setForm({ ...form, newPassword: e.target.value })}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Confirm New Password</label>
              <input
                type="password"
                required
                value={form.confirmPassword}
                onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-teal-500"
              />
            </div>

            <button
              type="submit"
              disabled={btnLoading}
              className="w-full bg-teal-600 hover:bg-teal-500 text-white py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md disabled:opacity-50"
            >
              {btnLoading ? "Updating..." : "Change Password"}
            </button>

            {status && (
              <p className={`text-center text-sm ${status.type === "success" ? "text-teal-400" : "text-rose-400"}`}>
                {status.message}
              </p>
            )}
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
