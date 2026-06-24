import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HeartPulse } from "lucide-react";

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["all-projects"],
    queryFn: async () => {
      const res = await fetch("/api/projects?status=published");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    }
  });

  const projects = data?.projects || [];
  const categories = ["all", "Advocacy", "Community Outreach", "Research", "Education"];

  const filtered = selectedCategory === "all"
    ? projects
    : projects.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="bg-[#0F172A] min-h-screen text-slate-100 font-sans">
      <Navbar />

      <section className="pt-32 pb-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">Active Campaigns & Initiatives</h1>
            <p className="text-slate-400">
              NAN leads policy reform, educational resources, and local hospital safety standard campaigns. Check out our active and completed initiatives below.
            </p>
          </div>

          {/* Categories bar */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 border ${
                  selectedCategory === cat
                    ? "bg-teal-500 text-white border-teal-500 shadow-lg shadow-teal-500/20"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="text-center py-16">
              <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-500 text-sm">Loading initiatives...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.length > 0 ? (
                filtered.map((proj) => (
                  <div
                    key={proj.id}
                    className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden hover:border-teal-500/40 transition-all duration-300 group flex flex-col h-full"
                  >
                    <div className="relative h-52 overflow-hidden bg-slate-800">
                      {proj.image_url ? (
                        <img
                          src={proj.image_url}
                          alt={proj.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-900/30 to-slate-950">
                          <HeartPulse size={48} className="text-teal-600/25" />
                        </div>
                      )}
                      <span className="absolute top-4 left-4 bg-teal-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                        {proj.category || "Campaign"}
                      </span>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-white mb-2">{proj.title}</h3>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-3 leading-relaxed">{proj.short_description}</p>
                      <div className="text-xs text-slate-500 mb-6 leading-relaxed flex-1">
                        {proj.description}
                      </div>
                      <div className="mt-auto pt-4 border-t border-slate-800 flex gap-2 flex-wrap">
                        {proj.tags && proj.tags.map((tag) => (
                          <span key={tag} className="text-xs text-slate-500 bg-slate-800/40 px-2.5 py-1 rounded-md">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-slate-500 py-16">
                  No active campaigns found in this category.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
