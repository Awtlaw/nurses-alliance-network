import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", inquiry_type: "general" });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const { data: settingsData } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const res = await fetch("/api/content");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    staleTime: 60000,
  });

  const s = settingsData?.settings || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "", inquiry_type: "general" });
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0F172A] min-h-screen text-slate-100 font-sans">
      <Navbar />

      <section className="pt-32 pb-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">Contact & Support</h1>
            <p className="text-slate-400">
              Get in touch with the Nurses Alliance Network offices. Whether you want to join, resolve an account concern, or partner with us, we are here to support you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="space-y-8">
              <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl flex items-start gap-4">
                <Mail className="text-teal-400 mt-1" size={20} />
                <div>
                  <h3 className="text-white font-bold text-sm mb-1">Email Support</h3>
                  <a href={`mailto:${s.contact_email || "info@nursesalliancenetwork.org"}`} className="text-slate-400 text-sm hover:text-white transition-colors">
                    {s.contact_email || "info@nursesalliancenetwork.org"}
                  </a>
                </div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl flex items-start gap-4">
                <Phone className="text-teal-400 mt-1" size={20} />
                <div>
                  <h3 className="text-white font-bold text-sm mb-1">Phone Helpline</h3>
                  <p className="text-slate-400 text-sm">{s.contact_phone || "0246418460"}</p>
                  <p className="text-slate-500 text-xs mt-1">Monday - Friday, 9AM - 5PM EST</p>
                </div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl flex items-start gap-4">
                <MapPin className="text-teal-400 mt-1" size={20} />
                <div>
                  <h3 className="text-white font-bold text-sm mb-1">HQ Address</h3>
                  <p className="text-slate-400 text-sm whitespace-pre-line">
                    {s.contact_address || "Nsawam Adoagyiri, Ghana"}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 p-8 rounded-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Your Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-teal-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Email Address</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-teal-500 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Inquiry Type</label>
                  <select
                    value={form.inquiry_type}
                    onChange={(e) => setForm({ ...form, inquiry_type: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-teal-500 transition-colors"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="membership">Membership Tiers</option>
                    <option value="advocacy">Campaigns & Advocacy</option>
                    <option value="education">Continuing Education</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Subject</label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-teal-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Message</label>
                  <textarea
                    rows="5"
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-teal-500 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-500 hover:to-cyan-400 text-white px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Submit Inquiry"}
                  <ArrowRight size={16} />
                </button>

                {status === "success" && (
                  <p className="text-teal-400 text-sm mt-4">✓ Message sent successfully! We will get back to you shortly.</p>
                )}
                {status === "error" && (
                  <p className="text-rose-400 text-sm mt-4">✗ Failed to send message. Please try again.</p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
