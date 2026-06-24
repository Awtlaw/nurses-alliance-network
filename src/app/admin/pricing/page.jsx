import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";
import useUser from "@/utils/useUser";
import { Trash2, Edit2, Plus, X } from "lucide-react";

export default function AdminPricing() {
  const { data: user, loading } = useUser();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", price: "", features: "", status: "published" });
  const [deleteId, setDeleteId] = useState(null);
  const qc = useQueryClient();

  useEffect(() => {
    if (!loading && !user && typeof window !== "undefined")
      window.location.href = "/account/signin";
  }, [user, loading]);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-pricing-list"],
    queryFn: async () => {
      const res = await fetch("/api/pricing");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    enabled: !!user,
  });

  const packages = data?.packages || [];

  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      const isEdit = !!editing;
      const url = isEdit ? `/api/pricing/${editing.id}` : "/api/pricing";
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
      qc.invalidateQueries({ queryKey: ["admin-pricing-list"] });
      setModalOpen(false);
      setEditing(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/pricing/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-pricing-list"] });
      setDeleteId(null);
    }
  });

  const handleOpenAdd = () => {
    setEditing(null);
    setForm({ name: "", price: "", features: "", status: "published" });
    setModalOpen(true);
  };

  const handleOpenEdit = (pkg) => {
    setEditing(pkg);
    setForm({
      name: pkg.name,
      price: pkg.price ? String(pkg.price) : "",
      features: Array.isArray(pkg.features) ? pkg.features.join("\n") : pkg.features || "",
      status: pkg.status || "published"
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: parseFloat(form.price) || 0,
      features: form.features.split("\n").map(f => f.trim()).filter(Boolean)
    };
    saveMutation.mutate(payload);
  };

  if (loading || !user) return null;

  return (
    <AdminLayout title="Manage Memberships">
      <div className="max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-slate-400 text-sm">{packages.length} memberships active</p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1 bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-xl text-xs font-semibold"
          >
            <Plus size={14} /> Add Membership
          </button>
        </div>

        <div className="bg-[#1E293B] border border-white/5 rounded-2xl overflow-hidden">
          {isLoading ? (
            <div className="text-center py-12 text-slate-500">Loading...</div>
          ) : packages.length === 0 ? (
            <div className="text-center py-16 text-slate-500">No memberships found.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 bg-slate-900/30">
                  <th className="text-left text-xs text-slate-500 font-medium px-5 py-4">Name</th>
                  <th className="text-left text-xs text-slate-500 font-medium px-5 py-4">Price</th>
                  <th className="text-left text-xs text-slate-500 font-medium px-5 py-4 hidden sm:table-cell">Status</th>
                  <th className="text-right text-xs text-slate-500 font-medium px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg) => (
                  <tr key={pkg.id} className="border-b border-white/5 last:border-0 hover:bg-white/2">
                    <td className="px-5 py-4 text-white text-sm font-medium">{pkg.name}</td>
                    <td className="px-5 py-4 text-slate-400 text-sm">${parseFloat(pkg.price).toFixed(2)} / yr</td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span className="text-xs text-slate-400 bg-white/5 px-2 py-1 rounded capitalize">{pkg.status}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(pkg)}
                          className="p-1.5 text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 rounded-lg"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteId(pkg.id)}
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
              <h2 className="text-white font-bold">{editing ? "Edit Membership" : "Add Membership"}</h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Tier Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Registered Nurse (RN)"
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-teal-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Price (USD / year)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    placeholder="120.00"
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-teal-500"
                  />
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
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Features (one per line)</label>
                <textarea
                  rows="4"
                  value={form.features}
                  onChange={e => setForm({ ...form, features: e.target.value })}
                  placeholder="CE Credits Tracking&#10;Advocacy consultations"
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
            <h3 className="text-white font-bold mb-2">Delete Membership?</h3>
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
