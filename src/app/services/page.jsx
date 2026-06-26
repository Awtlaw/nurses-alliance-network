import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BookOpen, ShieldCheck, HeartPulse, Check } from "lucide-react";

export default function ServicesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["all-services"],
    queryFn: async () => {
      const res = await fetch("/api/services?status=published");
      if (!res.ok) throw new Error("Failed to fetch services");
      return res.json();
    }
  });

  const services = data?.services || [];

  return (
    <div className="bg-white min-h-screen text-[#1F2937] font-sans">
      <Navbar />

      <section className="pt-44 pb-24 relative overflow-hidden bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-[#1F2937] mb-6">Alliance Programs & Benefits</h1>
            <p className="text-slate-600 text-lg leading-relaxed">
              NAN supports member nurses through continuing education certifications, legislative representation, and localized clinical resource toolkits.
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-16">
              <div className="w-10 h-10 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-500 text-sm">Loading programs...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.length > 0 ? (
                services.map((item) => {
                  let parsedFeatures = [];
                  if (item.features) {
                    try {
                      parsedFeatures = typeof item.features === 'string' ? JSON.parse(item.features) : item.features;
                    } catch {
                      parsedFeatures = [];
                    }
                  }
                  return (
                    <div
                      key={item.id}
                      className="bg-white border border-slate-200 p-8 rounded-2xl hover:border-[#2563EB]/40 hover:shadow-md transition-all duration-300 group flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-12 h-12 bg-[#2563EB]/10 border border-[#2563EB]/20 rounded-xl flex items-center justify-center text-[#2563EB] mb-6 group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-300">
                          <HeartPulse size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-[#1F2937] mb-3">{item.title}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed mb-6">
                          {item.short_description}
                        </p>
                        {parsedFeatures.length > 0 && (
                          <ul className="space-y-3 mb-6">
                            {parsedFeatures.map((feat, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                                <Check size={14} className="text-[#10B981] flex-shrink-0" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                // Static Defaults
                <>
                  <div className="bg-white border border-slate-200 p-8 rounded-2xl hover:border-[#2563EB]/40 hover:shadow-md transition-all duration-300 group flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 bg-[#2563EB]/10 border border-[#2563EB]/20 rounded-xl flex items-center justify-center text-[#2563EB] mb-6 group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-300">
                        <BookOpen size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-[#1F2937] mb-3">Continuing Education (CE)</h3>
                      <p className="text-slate-600 text-sm leading-relaxed mb-6">
                        Earn fully-accredited certificates from ANA-aligned training, digital medical seminars, and clinical diagnostics.
                      </p>
                      <ul className="space-y-3 mb-6">
                        <li className="flex items-center gap-2 text-xs text-slate-600">
                          <Check size={14} className="text-[#10B981] flex-shrink-0" />
                          <span>50+ free CE units annually</span>
                        </li>
                        <li className="flex items-center gap-2 text-xs text-slate-600">
                          <Check size={14} className="text-[#10B981] flex-shrink-0" />
                          <span>Digital CE tracker and automated report upload</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 p-8 rounded-2xl hover:border-[#2563EB]/40 hover:shadow-md transition-all duration-300 group flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 bg-[#2563EB]/10 border border-[#2563EB]/20 rounded-xl flex items-center justify-center text-[#2563EB] mb-6 group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-300">
                        <ShieldCheck size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-[#1F2937] mb-3">Legislative Advocacy</h3>
                      <p className="text-slate-600 text-sm leading-relaxed mb-6">
                        NAN ensures state and federal leaders support optimal staffing ratios, nurses' well-being reforms, and hospital safety regulations.
                      </p>
                      <ul className="space-y-3 mb-6">
                        <li className="flex items-center gap-2 text-xs text-slate-600">
                          <Check size={14} className="text-[#10B981] flex-shrink-0" />
                          <span>Staffing ratio lobbying panels</span>
                        </li>
                        <li className="flex items-center gap-2 text-xs text-slate-600">
                          <Check size={14} className="text-[#10B981] flex-shrink-0" />
                          <span>Legal representation for hospital compliance issues</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 p-8 rounded-2xl hover:border-[#2563EB]/40 hover:shadow-md transition-all duration-300 group flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 bg-[#2563EB]/10 border border-[#2563EB]/20 rounded-xl flex items-center justify-center text-[#2563EB] mb-6 group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-300">
                        <HeartPulse size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-[#1F2937] mb-3">Nurse Mentorship & Career</h3>
                      <p className="text-slate-600 text-sm leading-relaxed mb-6">
                        Guidance board for graduates, professional clinical counseling, resume review panels, and job placements in top networks.
                      </p>
                      <ul className="space-y-3 mb-6">
                        <li className="flex items-center gap-2 text-xs text-slate-600">
                          <Check size={14} className="text-[#10B981] flex-shrink-0" />
                          <span>Direct peer-NP advisor matches</span>
                        </li>
                        <li className="flex items-center gap-2 text-xs text-slate-600">
                          <Check size={14} className="text-[#10B981] flex-shrink-0" />
                          <span>Resume counseling and hospital recruiting panels</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
