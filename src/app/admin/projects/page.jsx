import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";
import useUser from "@/utils/useUser";
import { Trash2, Edit2, Plus, X } from "lucide-react";

export default function AdminProjects() {
  const { data: user, loading } = useUser();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", short_description: "", category: "Advocacy", tags: "", status: "published", featured: false });
  const [deleteId, setDeleteId] = useState(null);
  const qc = useQueryClient();

  useEffect(() => {
    if (!loading && !user && typeof window !== "undefined")
      window.location.href = "/account/signin";
  }, [user, loading]);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-projects-list"],
    queryFn: async () => {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    enabled: !!user,
  });

  const projects = data?.projects || [];

  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      const isEdit = !!editing;
      const url = isEdit ? `/api/projects/${editing.id}` : "/api/projects";
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
      qc.invalidateQueries({ queryKey: ["admin-projects-list"] });
      setModalOpen(false);
      setEditing(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-projects-list"] });
      setDeleteId(null);
    }
  });

  const handleOpenAdd = () => {
    setEditing(null);
    setForm({ title: "", description: "", short_description: "", category: "Advocacy", tags: "", status: "published", featured: false });
    setModalOpen(true);
  };

  const handleOpenEdit = (proj) => {
    setEditing(proj);
    setForm({
      title: proj.title,
      description: proj.description || "",
      short_description: proj.short_description || "",
      category: proj.category || "Advocacy",
      tags: Array.isArray(proj.tags) ? proj.tags.join(", ") : proj.tags || "",
      status: proj.status || "published",
      featured: proj.featured || false
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean)
    };
    saveMutation.mutate(payload);
  };

  if (loading || !user) return null;

  return (
    <AdminLayout title="Manage Initiatives">
      <div className="max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-slate-400 text-sm">{projects.length} initiatives active</p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1 bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-xl text-xs font-semibold"
          >
            <Plus size={14} /> Add Initiative
          </button>
        </div>

        <div className="bg-[#1E293B] border border-white/5 rounded-2xl overflow-hidden">
          {isLoading ? (
            <div className="text-center py-12 text-slate-500">Loading...</div>
          ) : projects.length === 0 ? (
            <div className="text-center py-16 text-slate-500">No initiatives found.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 bg-slate-900/30">
                  <th className="text-left text-xs text-slate-500 font-medium px-5 py-4">Title</th>
                  <th className="text-left text-xs text-slate-500 font-medium px-5 py-4 hidden sm:table-cell">Category</th>
                  <th className="text-left text-xs text-slate-500 font-medium px-5 py-4 hidden md:table-cell">Status</th>
                  <th className="text-right text-xs text-slate-500 font-medium px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((proj) => (
                  <tr key={proj.id} className="border-b border-white/5 last:border-0 hover:bg-white/2">
                    <td className="px-5 py-4 text-white text-sm font-medium">{proj.title}</td>
                    <td className="px-5 py-4 text-slate-400 text-sm hidden sm:table-cell">{proj.category}</td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="text-xs text-slate-400 bg-white/5 px-2 py-1 rounded capitalize">{proj.status}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(proj)}
                          className="p-1.5 text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 rounded-lg"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteId(proj.id)}
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
              <h2 className="text-white font-bold">{editing ? "Edit Initiative" : "Add Initiative"}</h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Short Description</label>
                <input
                  type="text"
                  value={form.short_description}
                  onChange={e => setForm({ ...form, short_description: e.target.value })}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Full Description</label>
                <textarea
                  rows="3"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-teal-500 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-teal-500"
                  >
                    <option value="Advocacy">Advocacy</option>
                    <option value="Community Outreach">Community Outreach</option>
                    <option value="Research">Research</option>
                    <option value="Education">Education</option>
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
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Tags (comma separated)</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={e => setForm({ ...form, tags: e.target.value })}
                  placeholder="ratios, health, clinic"
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-teal-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={form.featured}
                  onChange={e => setForm({ ...form, featured: e.target.checked })}
                  className="bg-slate-950/60 border border-slate-800 rounded focus:ring-teal-500 h-4 w-4 text-teal-600"
                />
                <label htmlFor="featured" className="text-xs font-semibold text-slate-400 uppercase">Featured Campaign</label>
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
            <h3 className="text-white font-bold mb-2">Delete Initiative?</h3>
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
