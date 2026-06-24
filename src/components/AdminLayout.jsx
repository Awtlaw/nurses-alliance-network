import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FolderOpen,
  Wrench,
  Tag,
  MessageSquare,
  Mail,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  HeartPulse,
  ChevronRight,
  Shield,
} from "lucide-react";
import useUser from "@/utils/useUser";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Initiatives", icon: FolderOpen },
  { href: "/admin/services", label: "Programs", icon: Wrench },
  { href: "/admin/pricing", label: "Memberships", icon: Tag },
  { href: "/admin/testimonials", label: "Spotlights", icon: MessageSquare },
  { href: "/admin/inquiries", label: "Inquiries", icon: Mail },
  { href: "/admin/blog", label: "News & Blogs", icon: FileText },
  { href: "/admin/content", label: "Site Content", icon: Settings },
  { href: "/admin/security", label: "Security", icon: Shield },
];

export default function AdminLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: user } = useUser();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="min-h-screen bg-[#0F172A] flex">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#0A1120] border-r border-white/5 flex flex-col z-30 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <HeartPulse size={16} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">NAN Admin</p>
              <p className="text-slate-500 text-xs">Content Manager</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  isActive
                    ? "bg-teal-600/20 text-teal-400 border border-teal-500/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={17} />
                <span className="flex-1">{item.label}</span>
                {isActive && (
                  <ChevronRight size={14} className="text-teal-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User + logout */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold font-sans">
              {user?.name?.[0]?.toUpperCase() ||
                user?.email?.[0]?.toUpperCase() ||
                "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">
                {user?.name || "Admin"}
              </p>
              <p className="text-slate-500 text-xs truncate">{user?.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              to="/"
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 text-xs transition-colors"
            >
              View Site
            </Link>
            <Link
              to="/account/logout"
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 text-xs transition-colors"
            >
              <LogOut size={13} />
              Sign Out
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Top bar */}
        <header className="bg-[#0A1120] border-b border-white/5 px-4 sm:px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex-1">
            <h1 className="text-white font-semibold text-lg">{title}</h1>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
