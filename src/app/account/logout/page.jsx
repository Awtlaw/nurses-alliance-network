import { useEffect } from "react";

export default function LogoutPage() {
  useEffect(() => {
    const handleLogout = async () => {
      try {
        await fetch("/api/auth/logout", { method: "POST" });
      } catch (err) {
        console.error("Logout failed", err);
      } finally {
        window.location.href = "/";
      }
    };
    handleLogout();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-sans">
      <p>Signing out of Nurses Alliance Network...</p>
    </div>
  );
}
