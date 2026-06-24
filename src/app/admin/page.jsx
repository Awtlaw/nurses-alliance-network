import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import useUser from "@/utils/useUser";
import {
  FolderOpen,
  Wrench,
  Tag,
  MessageSquare,
  Mail,
  FileText,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export default function AdminDashboard() {
  const { data: user, loading } = useUser();

  useEffect(() => {
    if (!loading && !user && typeof window !== "undefined") {
      window.location.href = "/account/signin";
    }
  }, [user, loading]);

  const { data: projectsData } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      const res = await fetch("/api/projects");
      return res.json();
    },
    enabled: !!user,
  });

  const { data: inquiriesData } = useQuery({
    queryKey: ["admin-inquiries"],
    queryFn: async () => {
      const res = await fetch("/api/contact");
      return res.json();
    },
    enabled: !!user,
  });

  const { data: testimonialsData } = useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: async () => {
      const res = await fetch("/api/testimonials");
      return res.json();
    },
    enabled: !!user,
  });

  const { data: postsData } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: async () => {
      const res = await fetch("/api/blog");
      return res.json();
    },
    enabled: !!user,
  });

  const projects = projectsData?.projects || [];
  const inquiries = inquiriesData?.inquiries || [];
  const testimonials = testimonialsData?.testimonials || [];
  const posts = postsData?.posts || [];
  const newInquiries = inquiries.filter((i) => i.status === "new").length;

  const stats = [
    {
      label: "Total Initiatives",
      value: projects.length,
      icon: FolderOpen,
      color: "teal",
      href: "/admin/projects",
    },
    {
      label: "New Inquiries",
      value: newInquiries,
      icon: Mail,
      color: "emerald",
      href: "/admin/inquiries",
      badge: newInquiries > 0,
    },
    {
      label: "Member Spotlights",
      value: testimonials.length,
      icon: MessageSquare,
      color: "cyan",
      href: "/admin/testimonials",
    },
    {
      label: "Blog Posts",
      value: posts.length,
      icon: FileText,
      color: "blue",
      href: "/admin/blog",
    },
  ];

  const colorMap = {
    teal: "bg-teal-600/20 text-teal-400 border-teal-500/20",
    emerald: "bg-emerald-600/20 text-emerald-400 border-emerald-500/20",
    cyan: "bg-cyan-600/20 text-cyan-400 border-cyan-500/20",
    blue: "bg-blue-600/20 text-blue-400 border-blue-500/20",
  };

  const quickLinks = [
    {
      href: "/admin/projects",
      label: "Manage Initiatives",
      icon: FolderOpen,
      desc: "Add, edit, or remove campaign initiatives",
    },
    {
      href: "/admin/services",
      label: "Edit Member Programs",
      icon: Wrench,
      desc: "Update your clinical benefit programs",
    },
    {
      href: "/admin/pricing",
      label: "Update Memberships",
      icon: Tag,
      desc: "Adjust pricing and tier specifications",
    },
    {
      href: "/admin/content",
      label: "Site Content",
      icon: TrendingUp,
      desc: "Edit headlines, statistics and settings",
    },
    {
      href: "/admin/inquiries",
      label: "View Inquiries",
      icon: Mail,
      desc: `${newInquiries} new message${newInquiries !== 1 ? "s" : ""} waiting`,
    },
    {
      href: "/admin/blog",
      label: "Write News Post",
      icon: FileText,
      desc: "Create and publish new advocacy articles",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="text-teal-500">Loading Dashboard...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-8 max-w-6xl">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-teal-600/20 to-cyan-600/10 border border-teal-500/20 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-1">
            Welcome back, {user.name || user.email?.split("@")[0]} 👋
          </h2>
          <p className="text-slate-400 text-sm">
            Nurses Alliance Network portal is active. Here is a brief report on database resources and active inquiries.
          </p>
          <div className="flex gap-3 mt-4">
            <a
              href="/"
              target="_blank"
              className="text-sm text-teal-400 hover:text-teal-300 flex items-center gap-1 transition-colors"
            >
              View Live Portal <ArrowRight size={13} />
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <a
                key={stat.label}
                href={stat.href}
                className="bg-[#1E293B] border border-white/5 hover:border-teal-500/30 rounded-2xl p-5 transition-all hover:-translate-y-0.5 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-10 h-10 border rounded-xl flex items-center justify-center ${colorMap[stat.color]}`}
                  >
                    <Icon size={18} />
                  </div>
                  {stat.badge && (
                    <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                      New
                    </span>
                  )}
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </a>
            );
          })}
        </div>

        {/* Quick links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className="bg-[#1E293B] border border-white/5 hover:border-teal-500/30 rounded-xl p-5 flex gap-4 items-start transition-all hover:-translate-y-0.5 group"
                >
                  <div className="w-10 h-10 bg-teal-600/20 rounded-lg flex items-center justify-center flex-shrink-0 text-teal-400 group-hover:bg-teal-600/30 transition-colors">
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm mb-0.5">
                      {link.label}
                    </p>
                    <p className="text-slate-500 text-xs">{link.desc}</p>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-slate-600 group-hover:text-teal-400 transition-colors flex-shrink-0 mt-0.5"
                  />
                </a>
              );
            })}
          </div>
        </div>

        {/* Recent inquiries */}
        {inquiries.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Recent Inquiries</h3>
              <a
                href="/admin/inquiries"
                className="text-teal-400 hover:text-teal-300 text-sm flex items-center gap-1"
              >
                View all <ArrowRight size={13} />
              </a>
            </div>
            <div className="bg-[#1E293B] border border-white/5 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5 bg-slate-900/30">
                    <th className="text-left text-xs text-slate-500 font-medium px-5 py-3">
                      Name
                    </th>
                    <th className="text-left text-xs text-slate-500 font-medium px-5 py-3 hidden sm:table-cell">
                      Email
                    </th>
                    <th className="text-left text-xs text-slate-500 font-medium px-5 py-3 hidden md:table-cell">
                      Subject
                    </th>
                    <th className="text-left text-xs text-slate-500 font-medium px-5 py-3">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.slice(0, 5).map((inq) => (
                    <tr
                      key={inq.id}
                      className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors"
                    >
                      <td className="px-5 py-3 text-white text-sm font-medium">
                        {inq.name}
                      </td>
                      <td className="px-5 py-3 text-slate-400 text-sm hidden sm:table-cell">
                        {inq.email}
                      </td>
                      <td className="px-5 py-3 text-slate-400 text-sm hidden md:table-cell truncate max-w-xs">
                        {inq.subject || inq.inquiry_type}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${inq.status === "new" ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-slate-500"}`}
                        >
                          {inq.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
