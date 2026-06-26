import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  HeartPulse,
  Award,
  BookOpen,
  Users,
  CheckCircle,
  Play,
  Newspaper,
  ShieldCheck,
  Stethoscope
} from "lucide-react";

export default function HomePage() {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });
  const [contactStatus, setContactStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);


  // Fetch site settings
  const { data: settingsData } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const res = await fetch("/api/content");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    staleTime: 60000,
  });

  // Fetch featured initiatives
  const { data: projectsData } = useQuery({
    queryKey: ["featured-projects"],
    queryFn: async () => {
      const res = await fetch("/api/projects?featured=true&status=published");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  // Fetch featured spotlights (testimonials)
  const { data: testimonialsData } = useQuery({
    queryKey: ["featured-testimonials"],
    queryFn: async () => {
      const res = await fetch("/api/testimonials?featured=true&status=published");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  // Fetch programs (services)
  const { data: servicesData } = useQuery({
    queryKey: ["featured-services"],
    queryFn: async () => {
      const res = await fetch("/api/services?status=published");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const s = settingsData?.settings || {};
  const projects = projectsData?.projects || [];
  const testimonials = testimonialsData?.testimonials || [];
  const services = (servicesData?.services || []).slice(0, 3);

  const [heroImages, setHeroImages] = useState([
    "https://res.cloudinary.com/dxeqbpehj/image/upload/q_auto/f_auto/v1781993378/program15_xq4n5j.jpg",
    "https://res.cloudinary.com/dxeqbpehj/image/upload/q_auto/f_auto/v1782047326/program4_z9jabx.jpg",
    "https://res.cloudinary.com/dxeqbpehj/image/upload/q_auto/f_auto/v1782049925/program3_vkywia.jpg",
    "https://res.cloudinary.com/dxeqbpehj/image/upload/q_auto/f_auto/v1782000427/program2_noptim.jpg"
  ]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  useEffect(() => {
    if (s.hero_slider_images) {
      try {
        const parsed = JSON.parse(s.hero_slider_images);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHeroImages(parsed);
        }
      } catch (e) {
        console.error("Error parsing hero images from settings:", e);
      }
    }
  }, [s.hero_slider_images]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroImages]);

  const stats = [
    {
      value: s.about_stat_1_value || "5,000+",
      label: s.about_stat_1_label || "Active Members",
    },
    {
      value: s.about_stat_2_value || "94%",
      label: s.about_stat_2_label || "Retention Rate",
    },
    {
      value: s.about_stat_3_value || "50+",
      label: s.about_stat_3_label || "CE Hours Offered",
    },
    {
      value: s.about_stat_4_value || "15+",
      label: s.about_stat_4_label || "Advocacy Campaigns",
    },
  ];

  const handleContact = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...contactForm, inquiry_type: "general" }),
      });
      if (!res.ok) throw new Error("Failed");
      setContactStatus("success");
      setContactForm({ name: "", email: "", subject: "General Inquiry", message: "" });
    } catch {
      setContactStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen text-[#1F2937] font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-950">
        {/* Background Slider with Fading transition */}
        <div className="absolute inset-0 z-0">
          {heroImages.map((img, idx) => (
            <div
              key={img}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1500ms] ease-in-out ${
                idx === currentHeroIndex ? "opacity-30 scale-105" : "opacity-0 scale-100"
              }`}
              style={{ 
                backgroundImage: `url(${img})`,
                transitionProperty: "opacity, transform"
              }}
            />
          ))}
          <div className="absolute inset-0 bg-slate-950/70" />
        </div>

        {/* Hero Slider Dots */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentHeroIndex(idx)}
              className={`h-2.5 rounded-full transition-all duration-500 ${
                idx === currentHeroIndex ? "w-8 bg-blue-600" : "w-2.5 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200/80 rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              <span className="text-blue-700 text-sm font-medium">
                Advocating for Nursing Excellence Worldwide
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6">
              {s.hero_headline || "Empowering Nurses, Advancing Health, Building Community"}
            </h1>

            <p className="text-lg sm:text-xl text-slate-350 leading-relaxed mb-10 max-w-2xl">
              {s.hero_subheadline ||
                "We are a dedicated professional network supporting nurses with continuing education, career resources, advocacy, and collaborative health campaigns."}
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href={s.hero_cta_url || "/pricing"}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-base font-semibold transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                {s.hero_cta_text || "Join the Alliance"}
                <ArrowRight size={18} />
              </a>
              <a
                href={s.hero_secondary_cta_url || "/portfolio"}
                className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-full text-base font-semibold transition-all duration-300 hover:-translate-y-0.5"
              >
                <Play size={16} />
                {s.hero_secondary_cta_text || "Explore Our Campaigns"}
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-6 mt-12">
              {[
                "ACNE Accredited Provider",
                "5,000+ Active Members",
                "Dedicated Nurse Advocacy",
              ].map((badge) => (
                <div
                  key={badge}
                  className="flex items-center gap-2 text-slate-300 text-sm"
                >
                  <CheckCircle
                    size={14}
                    className="text-teal-400 flex-shrink-0"
                  />
                  {badge}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#2563EB] relative z-10 shadow-sm border-y border-[#2563EB]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl sm:text-5xl font-extrabold text-white mb-1 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-blue-100 text-sm font-semibold uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs (Services) Section */}
      <section className="py-24 relative z-10 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Member Programs & Benefits
            </h2>
            <p className="text-slate-600 text-lg">
              We provide essential services, educational programs, and professional support to help nurses thrive at every stage of their careers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.length > 0 ? (
              services.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:border-[#2563EB]/40 transition-all duration-300 group hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-[#2563EB] mb-6 group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-300">
                    <HeartPulse size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {item.short_description}
                  </p>
                </div>
              ))
            ) : (
              // Fallback default static programs
              <>
                <div className="bg-white border border-slate-200/80 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:border-blue-500/20 transition-all duration-300 group hover:-translate-y-1">
                  <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-[#2563EB] mb-6 group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-300">
                    <BookOpen size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Continuing Education</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Earn accredited CE hours through online training, virtual conferences, and medical webinars.
                  </p>
                </div>
                <div className="bg-white border border-slate-200/80 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:border-blue-500/20 transition-all duration-300 group hover:-translate-y-1">
                  <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-[#2563EB] mb-6 group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-300">
                    <ShieldCheck size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Professional Advocacy</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    We voice nurse-centric legislative reform, staffing standard improvements, and workforce support policy campaigns.
                  </p>
                </div>
                <div className="bg-white border border-slate-200/80 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:border-blue-500/20 transition-all duration-300 group hover:-translate-y-1">
                  <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-[#2563EB] mb-6 group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-300">
                    <Users size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Community Mentorship</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Connect with veteran nurse leaders, clinical supervisors, and nurse practitioners to guide your medical career.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Featured Initiatives (Projects) Section */}
      <section className="py-24 bg-white border-t border-slate-200 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div className="max-w-xl">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                Active Campaigns & Initiatives
              </h2>
              <p className="text-slate-600 text-lg">
                Explore our ongoing efforts to improve public healthcare safety standards, nurse staffing practices, and community clinics.
              </p>
            </div>
            <a
              href="/portfolio"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-semibold mt-4 md:mt-0 transition-colors"
            >
              View All Campaigns
              <ArrowRight size={16} />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.length > 0 ? (
              projects.map((proj) => (
                <div
                  key={proj.id}
                  className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-[#2563EB]/40 transition-all duration-300 group flex flex-col h-full"
                >
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    {proj.image_url ? (
                      <img
                        src={proj.image_url}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
                        <HeartPulse size={48} className="text-blue-600/20" />
                      </div>
                    )}
                    <span className="absolute top-4 left-4 bg-blue-600/90 text-white text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm shadow-sm">
                      {proj.category || "Initiative"}
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1">
                      {proj.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                      {proj.short_description}
                    </p>
                    <div className="mt-auto pt-4 border-t border-slate-100 flex gap-2 flex-wrap">
                      {proj.tags && proj.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[10px] uppercase font-bold text-[#2563EB] bg-[#F8FAFC] border border-slate-200 px-3 py-1 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Default Fallback
              <>
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-[#2563EB]/40 transition-all duration-300 group flex flex-col h-full">
                  <div className="relative h-48 overflow-hidden bg-[#F8FAFC] flex items-center justify-center">
                    <Stethoscope size={48} className="text-blue-600/20" />
                    <span className="absolute top-4 left-4 bg-[#2563EB]/90 text-white text-xs font-semibold px-3 py-1.5 rounded-full">Advocacy</span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Safe Nurse Staffing Standards</h3>
                    <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                      Lobbying state legislators to establish legally-mandated nurse-to-patient ratios in acute clinical facilities.
                    </p>
                  </div>
                </div>
                <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-500/20 transition-all duration-300 group flex flex-col h-full">
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
                    <Award size={48} className="text-blue-600/20" />
                    <span className="absolute top-4 left-4 bg-blue-600/90 text-white text-xs font-semibold px-3 py-1.5 rounded-full">Education</span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Rural Health Clinic Support</h3>
                    <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                      Providing essential medical testing kits, remote training, and nurse resources to underfunded clinical settings.
                    </p>
                  </div>
                </div>
                <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-500/20 transition-all duration-300 group flex flex-col h-full">
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
                    <Newspaper size={48} className="text-blue-600/20" />
                    <span className="absolute top-4 left-4 bg-blue-600/90 text-white text-xs font-semibold px-3 py-1.5 rounded-full">Community</span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Nurse Mental Health Program</h3>
                    <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                      Promoting mental health recovery, post-shift exhaustion counseling, and workload management toolkits.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Member Spotlights (Testimonials) Section */}
      <section className="py-24 relative z-10 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Member Spotlights & Stories
            </h2>
            <p className="text-slate-600 text-lg">
              Hear from nurse practitioners, register nurses, and educators on how the Nurses Alliance Network shapes their clinical journeys.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.length > 0 ? (
              testimonials.map((t) => (
                <div
                  key={t.id}
                  className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex text-amber-500 mb-4 gap-0.5">
                      {Array.from({ length: t.rating || 5 }).map((_, i) => (
                        <span key={i} className="text-lg">★</span>
                      ))}
                    </div>
                    <p className="text-slate-700 italic text-sm leading-relaxed mb-6">
                      "{t.content}"
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold">
                      {t.member_name[0]}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{t.member_name}</h4>
                      <p className="text-xs text-slate-500 font-medium">
                        {t.member_title} - {t.workplace_facility}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Default Spotlights
              <>
                <div className="bg-white border border-slate-200/80 p-8 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="flex text-amber-500 mb-4 gap-0.5">★★★★★</div>
                    <p className="text-slate-700 italic text-sm leading-relaxed mb-6">
                      "NAN's lobbying efforts for mandated staffing ratios have renewed our hope for clinical care. The continuing education webinars are incredibly informative and easily accessible."
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] font-bold">
                      SM
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Sarah Mitchell</h4>
                      <p className="text-xs text-slate-500 font-medium font-sans">RN, BSN - General Hospital</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-slate-200/80 p-8 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="flex text-amber-500 mb-4 gap-0.5">★★★★★</div>
                    <p className="text-slate-700 italic text-sm leading-relaxed mb-6">
                      "The community mentorship network paired me with a fantastic Nurse Practitioner advisor. Her guidance helped me successfully transition to advanced practice and complete my credentials."
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] font-bold">
                      DR
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">David Rodriguez</h4>
                      <p className="text-xs text-slate-500 font-medium">NP-C - Community Clinic</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-slate-200/80 p-8 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="flex text-amber-500 mb-4 gap-0.5">★★★★★</div>
                    <p className="text-slate-700 italic text-sm leading-relaxed mb-6">
                      "As a student nurse, joining NAN was the best decision. I received a scholarship, met healthcare mentors, and gained access to a rich repository of clinical training guides."
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] font-bold">
                      EC
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Emily Chen</h4>
                      <p className="text-xs text-slate-500 font-medium">Student Nurse - State University</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Inquiry Form Section */}
      <section className="py-24 bg-[#F8FAFC] border-t border-slate-200 relative z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white border border-slate-200 p-8 sm:p-12 rounded-3xl shadow-xl">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Connect With the Alliance</h2>
              <p className="text-slate-650 text-sm leading-relaxed">
                Have questions about our programs, legislative advocacy, or joining as a clinical institution? Send us a message and our support team will reach out.
              </p>
            </div>

            <form onSubmit={handleContact} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-4 py-3 text-[#1F2937] text-sm focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-[#2563EB]/10 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-4 py-3 text-[#1F2937] text-sm focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-[#2563EB]/10 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Subject</label>
                <input
                  type="text"
                  required
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-4 py-3 text-[#1F2937] text-sm focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-[#2563EB]/10 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Message</label>
                <textarea
                  rows="4"
                  required
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-4 py-3 text-[#1F2937] text-sm focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-[#2563EB]/10 outline-none transition-all resize-none"
                />
              </div>

              <div className="text-center pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-sm disabled:opacity-50"
                >
                  {submitting ? "Sending..." : "Submit Inquiry"}
                  <ArrowRight size={16} />
                </button>
              </div>

              {contactStatus === "success" && (
                <div className="text-center text-teal-600 text-sm font-bold mt-4">
                  ✓ Message sent successfully! We will get back to you shortly.
                </div>
              )}
              {contactStatus === "error" && (
                <div className="text-center text-rose-600 text-sm font-bold mt-4">
                  ✗ Failed to send message. Please try again.
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      <Footer />

      {/* Floating WhatsApp Bubble */}
      <a
        href={`https://wa.me/${s.whatsapp_number || "233246418460"}?text=Hello%2C%20I%20would%20like%20to%20learn%20more%20about%20Nurses%20Alliance%20Network`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20ba5a] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center group"
        aria-label="Chat on WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="h-7 w-7" aria-hidden="true">
          <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"></path>
        </svg>
        <span className="absolute right-14 bg-white text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
          Chat with us!
        </span>
      </a>
    </div>
  );
}
