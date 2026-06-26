import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Check } from "lucide-react";

export default function PricingPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["membership-packages"],
    queryFn: async () => {
      const res = await fetch("/api/pricing?status=published");
      if (!res.ok) throw new Error("Failed to fetch packages");
      return res.json();
    }
  });

  const packages = data?.packages || [];

  return (
    <div className="bg-white min-h-screen text-[#1F2937] font-sans">
      <Navbar />

      <section className="pt-44 pb-24 relative overflow-hidden bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-[#1F2937] mb-6">Membership Tiers</h1>
            <p className="text-slate-600 text-lg leading-relaxed">
              Join a nationwide community of nursing professionals. Support clinical advocacy, gain access to continuous education credits, and advance your nursing career.
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-16">
              <div className="w-10 h-10 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-500 text-sm">Loading membership tiers...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
              {packages.length > 0 ? (
                packages.map((pkg) => {
                  let parsedFeatures = [];
                  if (pkg.features) {
                    try {
                      parsedFeatures = typeof pkg.features === 'string' ? JSON.parse(pkg.features) : pkg.features;
                    } catch {
                      parsedFeatures = [];
                    }
                  }
                  // Let's check if it's the middle one or a specific name to mark as popular, otherwise standard styling
                  const isPopular = pkg.name?.toLowerCase().includes("professional") || pkg.name?.toLowerCase().includes("rn");
                  return (
                    <div
                      key={pkg.id}
                      className={`bg-white border p-8 rounded-2xl flex flex-col justify-between transition-all group hover:-translate-y-1 relative ${
                        isPopular
                          ? "border-[#10B981] ring-1 ring-[#10B981] shadow-sm hover:shadow-md"
                          : "border-slate-200 hover:border-[#2563EB]/40 hover:shadow-md"
                      }`}
                    >
                      {isPopular && (
                        <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-[#10B981] text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                          Popular
                        </span>
                      )}
                      <div>
                        <h3 className="text-xl font-bold text-[#1F2937] mb-2">{pkg.name}</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                          <span className="text-3xl sm:text-4xl font-extrabold text-[#1F2937]">
                            ${parseFloat(pkg.price).toFixed(2)}
                          </span>
                          <span className="text-slate-500 text-sm">/ year</span>
                        </div>
                        <ul className="space-y-4 mb-8">
                          {parsedFeatures && parsedFeatures.map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-slate-600 text-sm">
                              <Check size={16} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <a
                        href="/contact"
                        className={`w-full text-center py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                          isPopular
                            ? "bg-[#10B981] hover:bg-[#0d9488] text-white"
                            : "bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
                        }`}
                      >
                        Register Member
                      </a>
                    </div>
                  );
                })
              ) : (
                // Static Default Tiers
                <>
                  <div className="bg-white border border-slate-200 p-8 rounded-2xl flex flex-col justify-between hover:border-[#2563EB]/40 hover:shadow-md transition-all group hover:-translate-y-1">
                    <div>
                      <h3 className="text-xl font-bold text-[#1F2937] mb-2">Student Nurse</h3>
                      <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-3xl sm:text-4xl font-extrabold text-[#1F2937]">$25.00</span>
                        <span className="text-slate-500 text-sm">/ year</span>
                      </div>
                      <ul className="space-y-4 mb-8">
                        <li className="flex items-start gap-2.5 text-slate-600 text-sm">
                          <Check size={16} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                          <span>Student networking group access</span>
                        </li>
                        <li className="flex items-start gap-2.5 text-slate-600 text-sm">
                          <Check size={16} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                          <span>Digital study guides & nursing templates</span>
                        </li>
                        <li className="flex items-start gap-2.5 text-slate-600 text-sm">
                          <Check size={16} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                          <span>Access to scholarship opportunities</span>
                        </li>
                      </ul>
                    </div>
                    <a
                      href="/contact"
                      className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-center py-3 rounded-full text-sm font-semibold transition-all duration-300"
                    >
                      Register Member
                    </a>
                  </div>

                  <div className="bg-white border-2 border-[#10B981] p-8 rounded-2xl flex flex-col justify-between hover:shadow-md transition-all group hover:-translate-y-1 relative">
                    <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-[#10B981] text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                      Popular
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-[#1F2937] mb-2">Professional (RN / NP)</h3>
                      <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-3xl sm:text-4xl font-extrabold text-[#1F2937]">$120.00</span>
                        <span className="text-slate-500 text-sm">/ year</span>
                      </div>
                      <ul className="space-y-4 mb-8">
                        <li className="flex items-start gap-2.5 text-slate-600 text-sm">
                          <Check size={16} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                          <span>Full CE certificate tracking & registry</span>
                        </li>
                        <li className="flex items-start gap-2.5 text-slate-600 text-sm">
                          <Check size={16} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                          <span>Staffing standards advocacy & legal consultations</span>
                        </li>
                        <li className="flex items-start gap-2.5 text-slate-600 text-sm">
                          <Check size={16} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                          <span>Mentorship board representation & networking</span>
                        </li>
                      </ul>
                    </div>
                    <a
                      href="/contact"
                      className="w-full bg-[#10B981] hover:bg-[#0d9488] text-white text-center py-3 rounded-full text-sm font-semibold transition-all duration-300"
                    >
                      Register Member
                    </a>
                  </div>

                  <div className="bg-white border border-slate-200 p-8 rounded-2xl flex flex-col justify-between hover:border-[#2563EB]/40 hover:shadow-md transition-all group hover:-translate-y-1">
                    <div>
                      <h3 className="text-xl font-bold text-[#1F2937] mb-2">Clinical Sponsor</h3>
                      <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-3xl sm:text-4xl font-extrabold text-[#1F2937]">$500.00</span>
                        <span className="text-slate-500 text-sm">/ year</span>
                      </div>
                      <ul className="space-y-4 mb-8">
                        <li className="flex items-start gap-2.5 text-slate-600 text-sm">
                          <Check size={16} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                          <span>Hospital sponsor badge display</span>
                        </li>
                        <li className="flex items-start gap-2.5 text-slate-600 text-sm">
                          <Check size={16} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                          <span>Group membership discounts for 10+ staff</span>
                        </li>
                        <li className="flex items-start gap-2.5 text-slate-600 text-sm">
                          <Check size={16} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                          <span>Legislative panel invites & research data access</span>
                        </li>
                      </ul>
                    </div>
                    <a
                      href="/contact"
                      className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-center py-3 rounded-full text-sm font-semibold transition-all duration-300"
                    >
                      Register Member
                    </a>
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
