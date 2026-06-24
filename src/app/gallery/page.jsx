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
    <div className="bg-[#0B0F19] min-h-screen text-slate-100 font-sans">
      <Navbar />

      {/* Header section with glass background */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-slate-900/40 border-b border-slate-800/80">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-teal-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 rounded-full px-4 py-2 mb-6">
            <Camera size={16} className="text-teal-400" />
            <span className="text-teal-400 text-sm font-medium">Capture. Reflect. Inspire.</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6">
            Photo Gallery
          </h1>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed">
            A visual documentation of our programs, local outreach campaigns, medical symposiums, and professional networking meetings.
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Filters bar */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-16">
          <div className="flex items-center gap-2 text-slate-400 font-semibold text-xs uppercase tracking-wider">
            <Filter size={14} className="text-teal-500" />
            <span>Filter By:</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2 bg-slate-900/60 p-1.5 rounded-full border border-slate-800 backdrop-blur-md">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 text-xs font-bold rounded-full transition-all duration-300 ${
                  activeFilter === filter
                    ? "bg-gradient-to-r from-teal-600 to-cyan-500 text-white shadow-md shadow-teal-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/40"
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
              className="group relative aspect-square rounded-3xl overflow-hidden bg-slate-900 border border-slate-800/50 shadow-md cursor-pointer hover:border-teal-500/40 hover:shadow-2xl hover:shadow-teal-500/5 transition-all duration-500 flex flex-col"
            >
              {/* Photo background */}
              <img
                src={photo.image}
                alt={photo.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />

              {/* Frosted details overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />

              {/* Sliding details */}
              <div className="absolute inset-x-0 bottom-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex flex-col justify-end h-full">
                <span className="text-teal-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                  {photo.category}
                </span>
                <h3 className="text-white font-bold text-lg leading-tight mb-2">
                  {photo.title}
                </h3>
                <div className="flex items-center gap-4 text-slate-400 text-xs mt-1">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} className="text-teal-500" />
                    <span>{photo.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={12} className="text-teal-500" />
                    <span>{photo.location}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-center h-10 w-10 rounded-full bg-white/15 backdrop-blur-md text-white border border-white/20 self-end hover:scale-115 transition-transform duration-300">
                  <Maximize2 size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox / Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-4 sm:p-8 animate-fade-in">
          {/* Close button */}
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-6 right-6 z-55 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 p-3 rounded-full transition-colors hover:scale-105 duration-200"
          >
            <X size={20} />
          </button>

          <div className="max-w-5xl w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-auto max-h-[85vh]">
            
            {/* Image Box */}
            <div className="flex-1 bg-slate-950 relative flex items-center justify-center overflow-hidden">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.title}
                className="w-full h-full object-cover max-h-[40vh] md:max-h-full"
              />
            </div>

            {/* Info Box */}
            <div className="w-full md:w-[400px] p-6 sm:p-8 flex flex-col justify-center border-t md:border-t-0 md:border-l border-slate-800">
              <span className="text-teal-400 text-xs font-bold uppercase tracking-wider mb-2 block">
                {selectedPhoto.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
                {selectedPhoto.title}
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2.5 text-slate-300 text-sm">
                  <Calendar size={14} className="text-teal-400" />
                  <span>{selectedPhoto.date}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-300 text-sm">
                  <MapPin size={14} className="text-teal-400" />
                  <span>{selectedPhoto.location}</span>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-6">
                <p className="text-slate-400 text-sm leading-relaxed">
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
