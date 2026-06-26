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
    <div className="bg-slate-50 min-h-screen text-slate-800 font-sans">
      <Navbar />

      {/* Header Banner */}
      <section 
        className="relative pt-44 pb-32 overflow-hidden bg-cover bg-center text-white"
        style={{ backgroundImage: "url('https://res.cloudinary.com/dxeqbpehj/image/upload/q_auto/f_auto/v1782000427/program2_noptim.jpg')" }}
      >
        <div className="absolute inset-0 bg-slate-950/70" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">Contact & Support</h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            Get in touch with the Nurses Alliance Network offices. Whether you want to join, resolve an account concern, or partner with us, we are here to support you.
          </p>
        </div>
      </section>

      {/* Form & Info Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="space-y-8">
              <div className="bg-white border border-slate-200 shadow-sm p-8 rounded-2xl flex items-start gap-4 hover:shadow-xl hover:border-[#2563EB]/20 transition-all duration-300">
                <Mail className="text-[#10B981] mt-1" size={20} />
                <div>
                  <h3 className="text-slate-900 font-bold text-sm mb-1">Email Support</h3>
                  <a href={`mailto:${s.contact_email || "info@nursesalliancenetwork.org"}`} className="text-slate-600 text-sm hover:text-[#2563EB] transition-colors">
                    {s.contact_email || "info@nursesalliancenetwork.org"}
                  </a>
                </div>
              </div>
              <div className="bg-white border border-slate-200 shadow-sm p-8 rounded-2xl flex items-start gap-4 hover:shadow-xl hover:border-[#2563EB]/20 transition-all duration-300">
                <Phone className="text-[#10B981] mt-1" size={20} />
                <div>
                  <h3 className="text-slate-900 font-bold text-sm mb-1">Phone Helpline</h3>
                  <p className="text-slate-600 text-sm">{s.contact_phone || "0246418460"}</p>
                  <p className="text-slate-500 text-xs mt-1">Monday - Friday, 9AM - 5PM EST</p>
                </div>
              </div>
              <div className="bg-white border border-slate-200 shadow-sm p-8 rounded-2xl flex items-start gap-4 hover:shadow-xl hover:border-[#2563EB]/20 transition-all duration-300">
                <MapPin className="text-[#10B981] mt-1" size={20} />
                <div>
                  <h3 className="text-slate-900 font-bold text-sm mb-1">HQ Address</h3>
                  <p className="text-slate-600 text-sm whitespace-pre-line">
                    {s.contact_address || "Nsawam Adoagyiri, Ghana"}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white border border-slate-200 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:border-[#2563EB]/20 transition-all duration-300">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Your Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-[#2563EB]/10 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Email Address</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-[#2563EB]/10 transition-all outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Inquiry Type</label>
                  <select
                    value={form.inquiry_type}
                    onChange={(e) => setForm({ ...form, inquiry_type: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-[#2563EB]/10 transition-all outline-none"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="membership">Membership Tiers</option>
                    <option value="advocacy">Campaigns & Advocacy</option>
                    <option value="education">Continuing Education</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Subject</label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-[#2563EB]/10 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Message</label>
                  <textarea
                    rows="5"
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-[#2563EB]/10 transition-all outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 bg-[#10B981] hover:bg-[#0d9488] text-white px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-sm disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Submit Inquiry"}
                  <ArrowRight size={16} />
                </button>

                {status === "success" && (
                  <p className="text-[#10B981] text-sm mt-4 font-medium">✓ Message sent successfully! We will get back to you shortly.</p>
                )}
                {status === "error" && (
                  <p className="text-rose-600 text-sm mt-4 font-medium">✗ Failed to send message. Please try again.</p>
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
