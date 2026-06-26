import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HeartPulse, Award, Shield, Users } from "lucide-react";

export default function AboutPage() {
  const [boardMembers, setBoardMembers] = useState([
    { name: "Dr. Evelyn Carter, DNP, RN", title: "President & Founder", facility: "University Medical Center" },
    { name: "Marcus Thompson, MSN, APRN", title: "VP of Legislation & Advocacy", facility: "County Public Health" },
    { name: "Dr. Alicia Vance, PhD, RN", title: "Director of Continuing Education", facility: "School of Nursing Sciences" }
  ]);

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

  useEffect(() => {
    if (s.about_leadership) {
      try {
        const parsed = JSON.parse(s.about_leadership);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBoardMembers(parsed);
        }
      } catch (e) {
        console.error("Error parsing board settings:", e);
      }
    }
  }, [s.about_leadership]);

  return (
    <div className="bg-white min-h-screen text-[#1F2937] font-sans">
      <Navbar />

      {/* Header Banner */}
      <section 
        className="relative pt-44 pb-32 overflow-hidden bg-cover bg-center text-white"
        style={{ backgroundImage: "url('https://res.cloudinary.com/dxeqbpehj/image/upload/q_auto/f_auto/v1782049925/program3_vkywia.jpg')" }}
      >
        <div className="absolute inset-0 bg-slate-950/70" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">About the Alliance</h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            {s.about_description || "The Nurses Alliance Network (NAN) is a premier professional organization that brings together registered nurses, nurse practitioners, and students to collaborate, learn, and grow."}
          </p>
        </div>
      </section>

      {/* Mission & Core Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
            <div>
              <h2 className="text-3xl font-bold text-[#1F2937] mb-6">Our Mission & Vision</h2>
              <div className="space-y-6 text-[#1F2937]/90 text-base leading-relaxed">
                <p>
                  {s.about_mission || "Our mission is to empower nursing professionals through clinical education, active workforce advocacy, peer collaboration, and career development tools. We aim to ensure nursing voices lead the reform in safety and healthcare quality."}
                </p>
                <p>
                  {s.about_vision || "We envision a health sector where nurses are equipped with premium academic resources, backed by legal representation, and supported by a diverse nationwide community that fosters well-being and clinical excellence."}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:border-[#2563EB]/40 transition-all duration-300">
                <HeartPulse className="text-[#10B981] mb-4" size={32} />
                <h3 className="text-lg font-bold text-[#1F2937] mb-2">Member Support</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Active counseling, mentorship, and clinical resource accessibility.
                </p>
              </div>
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:border-[#2563EB]/40 transition-all duration-300">
                <Award className="text-[#10B981] mb-4" size={32} />
                <h3 className="text-lg font-bold text-[#1F2937] mb-2">Continuing Ed</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Fully accredited clinical training certificates and credits.
                </p>
              </div>
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:border-[#2563EB]/40 transition-all duration-300">
                <Shield className="text-[#10B981] mb-4" size={32} />
                <h3 className="text-lg font-bold text-[#1F2937] mb-2">Safe Staffing</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Advocating for legislative standards in clinical staffing.
                </p>
              </div>
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:border-[#2563EB]/40 transition-all duration-300">
                <Users className="text-[#10B981] mb-4" size={32} />
                <h3 className="text-lg font-bold text-[#1F2937] mb-2">Community</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Networking, peer-learning, and active local union groups.
                </p>
              </div>
            </div>
          </div>

          {/* Alliance Leadership */}
          <div className="border-t border-slate-200 pt-20">
            <h2 className="text-3xl font-bold text-[#1F2937] text-center mb-12">Alliance Leadership</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {boardMembers.map((member) => (
                <div key={member.name} className="bg-white border border-slate-200 p-8 rounded-3xl text-center shadow-sm hover:shadow-xl hover:border-[#2563EB]/40 transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-xl font-bold mx-auto mb-6 shadow-md shadow-blue-500/10">
                    {member.name[4] === "." ? member.name[5] : member.name[0]}
                  </div>
                  <h3 className="text-lg font-bold text-[#1F2937] mb-1">{member.name}</h3>
                  <p className="text-[#2563EB] text-sm font-semibold mb-2">{member.title}</p>
                  <p className="text-slate-500 text-sm">{member.facility}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
