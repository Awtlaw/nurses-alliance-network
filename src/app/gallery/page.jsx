import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Camera, Calendar, MapPin, Maximize2, X, Filter } from "lucide-react";

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photos, setPhotos] = useState([
    {
      id: 1,
      title: "Professional Symposium 2026",
      category: "Meetings",
      image: "https://res.cloudinary.com/dxeqbpehj/image/upload/v1782052947/program4_z9jabx.jpg",
      date: "June 18, 2026",
      location: "Accra, Ghana",
      desc: "Nurses and medical specialists gathered to discuss emerging clinical standards, continuing education guidelines, and advocacy reforms."
    },
    {
      id: 2,
      title: "Rural Health Checkup",
      category: "Outreach",
      image: "https://res.cloudinary.com/dxeqbpehj/image/upload/v1782052841/program14_ioof0x.jpg",
      date: "June 02, 2026",
      location: "Nsawam Suburbs",
      desc: "Providing free general health examinations, testing, and blood pressure checks to families in rural and suburban communities."
    },
    {
      id: 3,
      title: "Youth Health Summit",
      category: "Events",
      image: "https://res.cloudinary.com/dxeqbpehj/image/upload/v1782052797/program15_x3fh6l.jpg",
      date: "May 12, 2026",
      location: "Kumasi",
      desc: "Educational event introducing students and youth to healthcare paths, hygiene practices, and disease prevention toolkits."
    },
    {
      id: 4,
      title: "Ethics Workshop",
      category: "Meetings",
      image: "https://res.cloudinary.com/dxeqbpehj/image/upload/v1782050220/yes_team_vbhjqw.jpg",
      date: "April 28, 2026",
      location: "NAN Headquarters",
      desc: "Exploring bioethics, nurse responsibilities, administrative accountability, and nursing workplace leadership dynamics."
    },
    {
      id: 5,
      title: "Maternal Education Program",
      category: "Outreach",
      image: "https://res.cloudinary.com/dxeqbpehj/image/upload/v1782049966/program10_wcixk2.jpg",
      date: "April 15, 2026",
      location: "Northern Region",
      desc: "Empowering prenatal and postpartum mothers with nutrition guides, vaccination schedules, and infant care toolkits."
    },
    {
      id: 6,
      title: "Annual Awards Night",
      category: "Events",
      image: "https://res.cloudinary.com/dxeqbpehj/image/upload/v1782047326/program4_z9jabx.jpg",
      date: "March 30, 2026",
      location: "Accra International Conference Center",
      desc: "Recognizing outstanding nursing advocacy leaders, healthcare volunteers, and exceptional medical centers."
    },
    {
      id: 7,
      title: "Clinical Skills Training",
      category: "Meetings",
      image: "https://res.cloudinary.com/dxeqbpehj/image/upload/v1782049925/program3_vkywia.jpg",
      date: "March 11, 2026",
      location: "Greater Accra Region",
      desc: "Hands-on emergency response, intravenous insertion, and cardiovascular telemetry training for registered nurse practitioners."
    },
    {
      id: 8,
      title: "Emergency Response Drill",
      category: "Outreach",
      image: "https://res.cloudinary.com/dxeqbpehj/image/upload/v1782000427/program2_noptim.jpg",
      date: "February 22, 2026",
      location: "Nsawam Adoagyiri",
      desc: "Simulating mass-casualty triage and immediate clinical assessment protocols in a joint agency training exercise."
    },
    {
      id: 9,
      title: "Global Partners Meetup",
      category: "Events",
      image: "https://res.cloudinary.com/dxeqbpehj/image/upload/v1782052818/program1_kdiuqj.jpg",
      date: "January 15, 2026",
      location: "Lagon University Campus",
      desc: "Connecting international health foundations, funding sponsors, and regional alliance coordinators."
    }
  ]);

  const filters = ["All", "Meetings", "Outreach", "Events"];

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
    if (s.gallery_items) {
      try {
        const parsed = JSON.parse(s.gallery_items);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPhotos(parsed);
        }
      } catch (e) {
        console.error("Error parsing gallery settings:", e);
      }
    }
  }, [s.gallery_items]);

  const filteredPhotos = activeFilter === "All" 
    ? photos 
    : photos.filter(p => p.category === activeFilter);

  return (
    <div className="bg-white min-h-screen text-[#1F2937] font-sans">
      <Navbar />

      {/* Header section with background image */}
      <section 
        className="relative pt-44 pb-32 overflow-hidden bg-cover bg-center text-white"
        style={{ backgroundImage: "url('https://res.cloudinary.com/dxeqbpehj/image/upload/q_auto/f_auto/v1781993378/program15_xq4n5j.jpg')" }}
      >
        <div className="absolute inset-0 bg-slate-950/70" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[#2563EB]/10 border border-[#2563EB]/20 rounded-full px-4 py-2 mb-6">
            <Camera size={16} className="text-[#2563EB]" />
            <span className="text-[#2563EB] text-sm font-medium">Capture. Reflect. Inspire.</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6">
            Photo Gallery
          </h1>
          <p className="text-slate-300 text-lg max-w-3xl mx-auto leading-relaxed">
            A visual documentation of our programs, local outreach campaigns, medical symposiums, and professional networking meetings.
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
        
        {/* Filters bar */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-16">
          <div className="flex items-center gap-2 text-slate-500 font-semibold text-xs uppercase tracking-wider">
            <Filter size={14} className="text-[#2563EB]" />
            <span>Filter By:</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2 bg-[#F8FAFC] p-1.5 rounded-full border border-slate-200 shadow-sm backdrop-blur-md">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 text-xs font-bold rounded-full transition-all duration-300 ${
                  activeFilter === filter
                    ? "bg-[#2563EB] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Photo grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="group bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:border-[#2563EB]/40 transition-all duration-300 flex flex-col h-full cursor-pointer"
            >
              {/* Photo Image Container */}
              <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100 relative">
                <img
                  src={photo.image}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm shadow-sm text-[#10B981] text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border border-[#10B981]/20">
                  {photo.category}
                </div>
              </div>

              {/* Card Details Area */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-[#1F2937] font-bold text-lg leading-snug group-hover:text-[#2563EB] transition-colors mb-3 line-clamp-2">
                  {photo.title}
                </h3>
                
                {/* Meta details at the bottom of card */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-500 text-xs mt-auto pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-[#2563EB]" />
                    <span>{photo.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-[#2563EB]" />
                    <span>{photo.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox / Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 sm:p-8 animate-fade-in">
          {/* Close button */}
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-6 right-6 z-55 text-slate-600 hover:text-[#2563EB] bg-white border border-slate-200 p-3 rounded-full shadow-lg transition-transform hover:scale-110 duration-200"
          >
            <X size={20} />
          </button>

          <div className="max-w-5xl w-full bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-auto max-h-[85vh]">
            
            {/* Image Box */}
            <div className="flex-1 bg-slate-100 relative flex items-center justify-center overflow-hidden">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.title}
                className="w-full h-full object-cover max-h-[40vh] md:max-h-full"
              />
            </div>

            {/* Info Box */}
            <div className="w-full md:w-[400px] p-6 sm:p-8 flex flex-col justify-center border-t md:border-t-0 md:border-l border-slate-200 bg-white">
              <span className="text-[#10B981] text-xs font-bold uppercase tracking-wider mb-2 block">
                {selectedPhoto.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1F2937] mb-4">
                {selectedPhoto.title}
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2.5 text-slate-600 text-sm">
                  <Calendar size={14} className="text-[#2563EB]" />
                  <span>{selectedPhoto.date}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-600 text-sm">
                  <MapPin size={14} className="text-[#2563EB]" />
                  <span>{selectedPhoto.location}</span>
                </div>
              </div>

              <div className="border-t border-slate-150 pt-6">
                <p className="text-slate-600 text-sm leading-relaxed">
                  {selectedPhoto.desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
