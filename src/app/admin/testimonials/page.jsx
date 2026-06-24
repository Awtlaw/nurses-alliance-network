import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";
import useUser from "@/utils/useUser";
import { Trash2, Edit2, Plus, X } from "lucide-react";

export default function AdminTestimonials() {
  const { data: user, loading } = useUser();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ member_name: "", member_title: "", workplace_facility: "", content: "", rating: "5", status: "published" });
  const [deleteId, setDeleteId] = useState(null);
  const qc = useQueryClient();

  useEffect(() => {
    if (!loading && !user && typeof window !== "undefined")
      window.location.href = "/account/signin";
  }, [user, loading]);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-testimonials-list"],
    queryFn: async () => {
      const res = await fetch("/api/testimonials");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    enabled: !!user,
  });

  const testimonials = data?.testimonials || [];

  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      const isEdit = !!editing;
      const url = isEdit ? `/api/testimonials/${editing.id}` : "/api/testimonials";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Save failed");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-testimonials-list"] });
      setModalOpen(false);
      setEditing(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-testimonials-list"] });
      setDeleteId(null);
    }
  });

  const handleOpenAdd = () => {
    setEditing(null);
    setForm({ member_name: "", member_title: "", workplace_facility: "", content: "", rating: "5", status: "published" });
    setModalOpen(true);
  };

  const handleOpenEdit = (t) => {
    setEditing(t);
    setForm({
      member_name: t.member_name,
      member_title: t.member_title || "",
      workplace_facility: t.workplace_facility || "",
      content: t.content,
      rating: String(t.rating || 5),
      status: t.status || "published"
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      rating: parseInt(form.rating) || 5
    };
    saveMutation.mutate(payload);
  };

  if (loading || !user) return null;

  return (
    <AdminLayout title="Manage Spotlights">
      <div className="max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-slate-400 text-sm">{testimonials.length} spotlights active</p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1 bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-xl text-xs font-semibold"
          >
            <Plus size={14} /> Add Spotlight
          </button>
        </div>

        <div className="bg-[#1E293B] border border-white/5 rounded-2xl overflow-hidden">
          {isLoading ? (
            <div className="text-center py-12 text-slate-500">Loading...</div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-16 text-slate-500">No spotlights found.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 bg-slate-900/30">
                  <th className="text-left text-xs text-slate-500 font-medium px-5 py-4">Member</th>
                  <th className="text-left text-xs text-slate-500 font-medium px-5 py-4 hidden sm:table-cell">Credentials / Workplace</th>
                  <th className="text-left text-xs text-slate-500 font-medium px-5 py-4 hidden md:table-cell">Status</th>
                  <th className="text-right text-xs text-slate-500 font-medium px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {testimonials.map((t) => (
                  <tr key={t.id} className="border-b border-white/5 last:border-0 hover:bg-white/2">
                    <td className="px-5 py-4 text-white text-sm font-medium">{t.member_name}</td>
                    <td className="px-5 py-4 text-slate-400 text-sm hidden sm:table-cell">
                      {t.member_title} - {t.workplace_facility}
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="text-xs text-slate-400 bg-white/5 px-2 py-1 rounded capitalize">{t.status}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(t)}
                          className="p-1.5 text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 rounded-lg"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteId(t.id)}
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

      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-white/10 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#1E293B]">
              <h2 className="text-white font-bold">{editing ? "Edit Spotlight" : "Add Spotlight"}</h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Member Name</label>
                <input
                  type="text"
                  required
                  value={form.member_name}
                  onChange={e => setForm({ ...form, member_name: e.target.value })}
                  placeholder="Sarah Mitchell"
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-teal-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Credentials</label>
                  <input
                    type="text"
                    value={form.member_title}
                    onChange={e => setForm({ ...form, member_title: e.target.value })}
                    placeholder="RN, BSN"
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Workplace Facility</label>
                  <input
                    type="text"
                    value={form.workplace_facility}
                    onChange={e => setForm({ ...form, workplace_facility: e.target.value })}
                    placeholder="General Hospital"
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-teal-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Rating (1 - 5 stars)</label>
                  <select
                    value={form.rating}
                    onChange={e => setForm({ ...form, rating: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-teal-500"
                  >
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-teal-500"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Review / Content</label>
                <textarea
                  rows="4"
                  required
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  placeholder="Tell us their success story or endorsement..."
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-teal-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-slate-300 py-2.5 rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isLoading}
                  className="flex-1 bg-teal-600 hover:bg-teal-500 text-white py-2.5 rounded-xl text-sm font-medium"
                >
                  {saveMutation.isLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-6 max-w-sm w-full text-center">
            <h3 className="text-white font-bold mb-2">Delete Spotlight?</h3>
            <p className="text-slate-400 text-sm mb-6">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 bg-white/5 text-slate-300 py-2.5 rounded-xl text-sm">
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
