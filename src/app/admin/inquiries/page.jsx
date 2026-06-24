import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";
import useUser from "@/utils/useUser";
import { Mail, Trash2, Eye, X } from "lucide-react";

export default function AdminInquiries() {
  const { data: user, loading } = useUser();
  const [selected, setSelected] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [filter, setFilter] = useState("all");
  const qc = useQueryClient();

  useEffect(() => {
    if (!loading && !user && typeof window !== "undefined")
      window.location.href = "/account/signin";
  }, [user, loading]);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-inquiries"],
    queryFn: async () => {
      const res = await fetch("/api/contact");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    enabled: !!user,
  });

  const inquiries = data?.inquiries || [];
  const filtered =
    filter === "all" ? inquiries : inquiries.filter((i) => i.status === filter);

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-inquiries"] });
      setDeleteId(null);
      setSelected(null);
    },
  });

  const openInquiry = (inq) => {
    setSelected(inq);
  };

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "";

  if (loading || !user) return null;

  const newCount = inquiries.filter((i) => i.status === "new").length;

  return (
    <AdminLayout title="Contact Inquiries">
      <div className="max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-slate-400 text-sm">
            {inquiries.length} total, {newCount} new
          </p>
          <div className="flex gap-2">
            {["all", "new", "read"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${filter === f ? "bg-teal-600 text-white" : "bg-white/5 text-slate-400 hover:text-white"}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#1E293B] border border-white/5 rounded-2xl overflow-hidden">
          {isLoading ? (
            <div className="text-center py-12 text-slate-500">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Mail size={32} className="text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No inquiries found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 bg-slate-900/30">
                  <th className="text-left text-xs text-slate-500 font-medium px-5 py-4">
                    Name
                  </th>
                  <th className="text-left text-xs text-slate-500 font-medium px-5 py-4 hidden sm:table-cell">
                    Email
                  </th>
                  <th className="text-left text-xs text-slate-500 font-medium px-5 py-4 hidden md:table-cell">
                    Type
                  </th>
                  <th className="text-left text-xs text-slate-500 font-medium px-5 py-4 hidden lg:table-cell">
                    Date
                  </th>
                  <th className="text-right text-xs text-slate-500 font-medium px-5 py-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inq) => (
                  <tr
                    key={inq.id}
                    className={`border-b border-white/5 last:border-0 hover:bg-white/2 cursor-pointer ${inq.status === "new" ? "bg-teal-500/5" : ""}`}
                  >
                    <td className="px-5 py-4" onClick={() => openInquiry(inq)}>
                      <div className="flex items-center gap-2">
                        {inq.status === "new" && (
                          <span className="w-2 h-2 bg-emerald-400 rounded-full flex-shrink-0" />
                        )}
                        <div>
                          <p className="text-white text-sm font-medium">
                            {inq.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td
                      className="px-5 py-4 text-slate-400 text-sm hidden sm:table-cell"
                      onClick={() => openInquiry(inq)}
                    >
                      {inq.email}
                    </td>
                    <td
                      className="px-5 py-4 hidden md:table-cell"
                      onClick={() => openInquiry(inq)}
                    >
                      <span className="text-xs text-slate-400 capitalize bg-white/5 px-2 py-1 rounded">
                        {inq.inquiry_type}
                      </span>
                    </td>
                    <td
                      className="px-5 py-4 text-slate-500 text-xs hidden lg:table-cell"
                      onClick={() => openInquiry(inq)}
                    >
                      {formatDate(inq.created_at)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openInquiry(inq)}
                          className="p-1.5 text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 rounded-lg"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteId(inq.id)}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* View modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/5 sticky top-0 bg-[#1E293B]">
              <h2 className="text-white font-bold">
                Inquiry from {selected.name}
              </h2>
              <button
                onClick={() => setSelected(null)}
                className="text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                {[
                  ["Name", selected.name],
                  ["Email", selected.email],
                  ["Type", selected.inquiry_type],
                  ["Date", formatDate(selected.created_at)],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                      {label}
                    </p>
                    <p className="text-white text-sm">{value}</p>
                  </div>
                ))}
              </div>
              {selected.subject && (
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                    Subject
                  </p>
                  <p className="text-white text-sm">{selected.subject}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">
                  Message
                </p>
                <div className="bg-[#0F172A] rounded-xl p-4 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {selected.message}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${selected.subject || "Your inquiry"}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
                >
                  <Mail size={14} /> Reply via Email
                </a>
                <button
                  onClick={() => {
                    setDeleteId(selected.id);
                    setSelected(null);
                  }}
                  className="px-4 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-6 max-w-sm w-full text-center">
            <h3 className="text-white font-bold mb-2">Delete Inquiry?</h3>
            <p className="text-slate-400 text-sm mb-6">This cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 bg-white/5 text-slate-300 py-2.5 rounded-xl text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteId)}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2.5 rounded-xl text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
