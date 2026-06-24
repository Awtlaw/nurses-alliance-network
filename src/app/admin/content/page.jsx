import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";
import useUser from "@/utils/useUser";
import { 
  Save, 
  Upload, 
  Plus, 
  Trash2, 
  Edit, 
  Image as ImageIcon, 
  MessageSquare, 
  Users, 
  Info, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle,
  AlertCircle,
  Camera
} from "lucide-react";

export default function AdminContent() {
  const { data: user, loading } = useUser();
  const [activeTab, setActiveTab] = useState("home");
  const [form, setForm] = useState({});
  const [success, setSuccess] = useState(false);
  const [uploadingKey, setUploadingKey] = useState(null);
  
  // Sub-editors local state
  const [leadership, setLeadership] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [heroImages, setHeroImages] = useState([]);
  
  // Gallery Sub-Form state
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState(null);
  const [galleryForm, setGalleryForm] = useState({
    title: "", category: "Meetings", date: "", location: "", image: "", desc: ""
  });

  const qc = useQueryClient();

  useEffect(() => {
    if (!loading && !user && typeof window !== "undefined")
      window.location.href = "/account/signin";
  }, [user, loading]);

  const { data } = useQuery({
    queryKey: ["admin-content-settings"],
    queryFn: async () => {
      const res = await fetch("/api/content");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (data?.settings) {
      setForm(data.settings);
      
      // Parse Board Members
      try {
        const board = data.settings.about_leadership 
          ? JSON.parse(data.settings.about_leadership)
          : [
              { name: "Dr. Evelyn Carter, DNP, RN", title: "President & Founder", facility: "University Medical Center" },
              { name: "Marcus Thompson, MSN, APRN", title: "VP of Legislation & Advocacy", facility: "County Public Health" },
              { name: "Dr. Alicia Vance, PhD, RN", title: "Director of Continuing Education", facility: "School of Nursing Sciences" }
            ];
        setLeadership(board);
      } catch (e) {
        console.error("Error parsing board settings:", e);
      }

      // Parse Gallery Items
      try {
        const gallery = data.settings.gallery_items
          ? JSON.parse(data.settings.gallery_items)
          : [
              { id: 1, title: "Professional Symposium 2026", category: "Meetings", image: "https://res.cloudinary.com/dxeqbpehj/image/upload/v1782052947/program4_z9jabx.jpg", date: "June 18, 2026", location: "Accra, Ghana", desc: "Nurses and medical specialists gathered to discuss emerging clinical standards, continuing education guidelines, and advocacy reforms." },
              { id: 2, title: "Rural Health Checkup", category: "Outreach", image: "https://res.cloudinary.com/dxeqbpehj/image/upload/v1782052841/program14_ioof0x.jpg", date: "June 02, 2026", location: "Nsawam Suburbs", desc: "Providing free general health examinations, testing, and blood pressure checks to families in rural and suburban communities." },
              { id: 3, title: "Youth Health Summit", category: "Events", image: "https://res.cloudinary.com/dxeqbpehj/image/upload/v1782052797/program15_x3fh6l.jpg", date: "May 12, 2026", location: "Kumasi", desc: "Educational event introducing students and youth to healthcare paths, hygiene practices, and disease prevention toolkits." }
            ];
        setGalleryItems(gallery);
      } catch (e) {
        console.error("Error parsing gallery items:", e);
      }

      // Parse Hero Carousel Slides
      try {
        const slides = data.settings.hero_slider_images
          ? JSON.parse(data.settings.hero_slider_images)
          : [
              "https://res.cloudinary.com/dxeqbpehj/image/upload/q_auto/f_auto/v1781993378/program15_xq4n5j.jpg",
              "https://res.cloudinary.com/dxeqbpehj/image/upload/q_auto/f_auto/v1782047326/program4_z9jabx.jpg",
              "https://res.cloudinary.com/dxeqbpehj/image/upload/q_auto/f_auto/v1782049925/program3_vkywia.jpg",
              "https://res.cloudinary.com/dxeqbpehj/image/upload/q_auto/f_auto/v1782000427/program2_noptim.jpg"
            ];
        setHeroImages(slides);
      } catch (e) {
        console.error("Error parsing hero images:", e);
      }
    }
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: payload })
      });
      if (!res.ok) throw new Error("Save failed");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-content-settings"] });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  });

  const handleTextChange = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }));
  };

  const handleFileUpload = async (e, key, arrayIdx = null) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingKey(arrayIdx !== null ? `${key}-${arrayIdx}` : key);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const uploadData = await res.json();

      if (arrayIdx !== null && key === "hero_slider") {
        const newHero = [...heroImages];
        newHero[arrayIdx] = uploadData.url;
        setHeroImages(newHero);
      } else if (key === "gallery_modal") {
        setGalleryForm(prev => ({ ...prev, image: uploadData.url }));
      } else {
        setForm(prev => ({ ...prev, [key]: uploadData.url }));
      }
    } catch (err) {
      console.error(err);
      alert("Image upload failed. Please try again.");
    } finally {
      setUploadingKey(null);
    }
  };

  // Leadership state modifiers
  const handleLeaderChange = (index, field, value) => {
    const updated = [...leadership];
    updated[index][field] = value;
    setLeadership(updated);
  };

  // Gallery list modifiers
  const handleOpenGalleryModal = (item = null) => {
    if (item) {
      setEditingGalleryItem(item.id);
      setGalleryForm({ ...item });
    } else {
      setEditingGalleryItem(null);
      setGalleryForm({ title: "", category: "Meetings", date: "", location: "", image: "", desc: "" });
    }
    setShowGalleryModal(true);
  };

  const handleSaveGalleryItem = () => {
    if (!galleryForm.title || !galleryForm.image) {
      alert("Please fill in the title and upload/enter an image URL.");
      return;
    }

    if (editingGalleryItem !== null) {
      // Edit
      setGalleryItems(prev => prev.map(item => item.id === editingGalleryItem ? { ...galleryForm } : item));
    } else {
      // Add
      const newItem = {
        ...galleryForm,
        id: galleryItems.length > 0 ? Math.max(...galleryItems.map(item => item.id)) + 1 : 1
      };
      setGalleryItems(prev => [...prev, newItem]);
    }
    setShowGalleryModal(false);
  };

  const handleDeleteGalleryItem = (id) => {
    if (confirm("Are you sure you want to delete this gallery photo?")) {
      setGalleryItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Package structured objects into state settings
    const payload = {
      ...form,
      about_leadership: JSON.stringify(leadership),
      gallery_items: JSON.stringify(galleryItems),
      hero_slider_images: JSON.stringify(heroImages),
    };

    saveMutation.mutate(payload);
  };

  if (loading || !user) return null;

  return (
    <AdminLayout title="Global Content Settings">
      <div className="max-w-5xl space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-px">
          {[
            { id: "home", label: "Home Page", icon: ImageIcon },
            { id: "about", label: "About Page", icon: Users },
            { id: "gallery", label: "Gallery Manager", icon: Camera },
            { id: "contact", label: "Contact & WhatsApp", icon: MessageSquare }
          ].map((tab) => {
            const IconComp = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3.5 border-b-2 text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "border-teal-500 text-teal-400 bg-slate-900/40"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                <IconComp size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 pt-4">
          
          {/* HOME TAB */}
          {activeTab === "home" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-[#1E293B] border border-white/5 p-6 sm:p-8 rounded-2xl space-y-6">
                <h3 className="text-white font-bold text-sm border-b border-white/5 pb-2">Hero Header Content</h3>
                
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Hero Headline</label>
                    <input
                      type="text"
                      value={form.hero_headline || ""}
                      onChange={e => handleTextChange("hero_headline", e.target.value)}
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Hero Subheadline</label>
                    <textarea
                      rows="3"
                      value={form.hero_subheadline || ""}
                      onChange={e => handleTextChange("hero_subheadline", e.target.value)}
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-teal-500 resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-800/40">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Primary Button text</label>
                    <input
                      type="text"
                      value={form.hero_cta_text || ""}
                      onChange={e => handleTextChange("hero_cta_text", e.target.value)}
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Primary Button Redirect URL</label>
                    <input
                      type="text"
                      value={form.hero_cta_url || ""}
                      onChange={e => handleTextChange("hero_cta_url", e.target.value)}
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Secondary Button text</label>
                    <input
                      type="text"
                      value={form.hero_secondary_cta_text || ""}
                      onChange={e => handleTextChange("hero_secondary_cta_text", e.target.value)}
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Secondary Button Redirect URL</label>
                    <input
                      type="text"
                      value={form.hero_secondary_cta_url || ""}
                      onChange={e => handleTextChange("hero_secondary_cta_url", e.target.value)}
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>

              {/* Slider Images Upload Grid */}
              <div className="bg-[#1E293B] border border-white/5 p-6 sm:p-8 rounded-2xl space-y-6">
                <h3 className="text-white font-bold text-sm border-b border-white/5 pb-2">Hero Slider Carousel Images</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {heroImages.map((imgUrl, idx) => (
                    <div key={idx} className="bg-slate-900/60 p-4 border border-slate-800 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-teal-400">Slide {idx + 1} Image</span>
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            id={`hero-file-${idx}`}
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, "hero_slider", idx)}
                          />
                          <button
                            type="button"
                            onClick={() => document.getElementById(`hero-file-${idx}`).click()}
                            className="flex items-center gap-1 bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-bold border border-slate-800/80 transition-colors"
                          >
                            <Upload size={10} />
                            {uploadingKey === `hero_slider-${idx}` ? "Uploading..." : "Upload Photo"}
                          </button>
                        </div>
                      </div>

                      <input
                        type="text"
                        value={imgUrl || ""}
                        onChange={(e) => {
                          const newHero = [...heroImages];
                          newHero[idx] = e.target.value;
                          setHeroImages(newHero);
                        }}
                        className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:border-teal-500"
                        placeholder="Or input image URL"
                      />

                      {imgUrl && (
                        <div className="aspect-video rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
                          <img src={imgUrl} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ABOUT TAB */}
          {activeTab === "about" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-[#1E293B] border border-white/5 p-6 sm:p-8 rounded-2xl space-y-6">
                <h3 className="text-white font-bold text-sm border-b border-white/5 pb-2">About Page Core Content</h3>
                
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">About Page General Description</label>
                    <textarea
                      rows="4"
                      value={form.about_description || ""}
                      onChange={e => handleTextChange("about_description", e.target.value)}
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-teal-500 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Mission Statement</label>
                    <textarea
                      rows="3"
                      value={form.about_mission || ""}
                      onChange={e => handleTextChange("about_mission", e.target.value)}
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-teal-500 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Vision Statement</label>
                    <textarea
                      rows="3"
                      value={form.about_vision || ""}
                      onChange={e => handleTextChange("about_vision", e.target.value)}
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-teal-500 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Leadership board members */}
              <div className="bg-[#1E293B] border border-white/5 p-6 sm:p-8 rounded-2xl space-y-6">
                <h3 className="text-white font-bold text-sm border-b border-white/5 pb-2">Alliance Leadership Board</h3>
                
                <div className="space-y-6">
                  {leadership.map((leader, idx) => (
                    <div key={idx} className="bg-slate-900/60 p-5 border border-slate-800 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Member Name</label>
                        <input
                          type="text"
                          value={leader.name || ""}
                          onChange={e => handleLeaderChange(idx, "name", e.target.value)}
                          className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3.5 py-2 text-white text-xs focus:border-teal-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Title / Role</label>
                        <input
                          type="text"
                          value={leader.title || ""}
                          onChange={e => handleLeaderChange(idx, "title", e.target.value)}
                          className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3.5 py-2 text-white text-xs focus:border-teal-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Workplace Facility</label>
                        <input
                          type="text"
                          value={leader.facility || ""}
                          onChange={e => handleLeaderChange(idx, "facility", e.target.value)}
                          className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3.5 py-2 text-white text-xs focus:border-teal-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* GALLERY TAB */}
          {activeTab === "gallery" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-[#1E293B] border border-white/5 p-6 sm:p-8 rounded-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <h3 className="text-white font-bold text-sm">Alliance Photo Gallery Items</h3>
                  <button
                    type="button"
                    onClick={() => handleOpenGalleryModal()}
                    className="flex items-center gap-1 bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md"
                  >
                    <Plus size={12} /> Add New Photo
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {galleryItems.map((item) => (
                    <div key={item.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-full shadow-md group">
                      <div className="relative aspect-video bg-slate-950">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 bg-slate-900/90 text-teal-400 text-[10px] font-bold px-2 py-1 rounded-md border border-slate-800">
                          {item.category}
                        </span>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <h4 className="text-white font-bold text-sm line-clamp-1">{item.title}</h4>
                          <p className="text-slate-400 text-xs line-clamp-2 mt-1">{item.desc}</p>
                          <div className="flex items-center gap-2 text-slate-500 text-[10px] mt-2">
                            <span>{item.date}</span>
                            <span>•</span>
                            <span>{item.location}</span>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 border-t border-slate-850 pt-3">
                          <button
                            type="button"
                            onClick={() => handleOpenGalleryModal(item)}
                            className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
                          >
                            <Edit size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteGalleryItem(item.id)}
                            className="p-2 hover:bg-rose-900/20 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CONTACT TAB */}
          {activeTab === "contact" && (
            <div className="bg-[#1E293B] border border-white/5 p-6 sm:p-8 rounded-2xl space-y-6 animate-fade-in">
              <h3 className="text-white font-bold text-sm border-b border-white/5 pb-2">HQ Contact Details & Social Hooks</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">
                    <span className="flex items-center gap-1.5"><MapPin size={12} className="text-teal-400" /> HQ Address / Location</span>
                  </label>
                  <textarea
                    rows="3"
                    value={form.contact_address || ""}
                    onChange={e => handleTextChange("contact_address", e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-teal-500 resize-none"
                    placeholder="Nsawam Adoagyiri, Ghana"
                  />
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">
                      <span className="flex items-center gap-1.5"><Phone size={12} className="text-teal-400" /> Phone Helpline</span>
                    </label>
                    <input
                      type="text"
                      value={form.contact_phone || ""}
                      onChange={e => handleTextChange("contact_phone", e.target.value)}
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-teal-500"
                      placeholder="0246418460"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">
                      <span className="flex items-center gap-1.5"><Mail size={12} className="text-teal-400" /> Public Contact Email</span>
                    </label>
                    <input
                      type="text"
                      value={form.contact_email || ""}
                      onChange={e => handleTextChange("contact_email", e.target.value)}
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-teal-500"
                      placeholder="nursesalliancenetwork@gmail.com"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800/40">
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">
                  <span className="flex items-center gap-1.5"><MessageSquare size={12} className="text-teal-400" /> WhatsApp Number (For Floating Chat Bubble)</span>
                </label>
                <div className="max-w-md">
                  <input
                    type="text"
                    value={form.whatsapp_number || ""}
                    onChange={e => handleTextChange("whatsapp_number", e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-teal-500"
                    placeholder="e.g. 233246418460"
                  />
                  <p className="text-[10px] text-slate-500 mt-2">
                    Enter the digits only, starting with the country code (e.g. 233 for Ghana) without the plus sign.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-800">
            {success ? (
              <div className="flex items-center gap-1.5 text-teal-400 text-sm font-semibold">
                <CheckCircle size={16} /> Content configurations saved successfully!
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                <Info size={14} className="text-teal-500" /> Make sure to click save to write all tab modifications to the database.
              </div>
            )}
            <button
              type="submit"
              disabled={saveMutation.isLoading}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-500 hover:to-cyan-400 text-white px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg disabled:opacity-50"
            >
              <Save size={16} /> {saveMutation.isLoading ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>

      {/* GALLERY PHOTO SUB-FORM MODAL */}
      {showGalleryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl">
            <h3 className="text-white font-bold text-lg border-b border-slate-800 pb-2">
              {editingGalleryItem !== null ? "Edit Gallery Photo Details" : "Add New Photo to Gallery"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Photo Title</label>
                <input
                  type="text"
                  value={galleryForm.title}
                  onChange={e => setGalleryForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Category</label>
                  <select
                    value={galleryForm.category}
                    onChange={e => setGalleryForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-teal-500"
                  >
                    <option value="Meetings">Meetings</option>
                    <option value="Outreach">Outreach</option>
                    <option value="Events">Events</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Date</label>
                  <input
                    type="text"
                    value={galleryForm.date}
                    onChange={e => setGalleryForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-teal-500"
                    placeholder="e.g. June 18, 2026"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Location</label>
                  <input
                    type="text"
                    value={galleryForm.location}
                    onChange={e => setGalleryForm(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-teal-500"
                    placeholder="e.g. Accra, Ghana"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-400">Photo URL</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        id="gallery-modal-file"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, "gallery_modal")}
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById("gallery-modal-file").click()}
                        className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg text-[10px] font-bold border border-slate-750 transition-colors"
                      >
                        <Upload size={10} />
                        {uploadingKey === "gallery_modal" ? "Uploading..." : "Upload Custom File"}
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={galleryForm.image}
                    onChange={e => setGalleryForm(prev => ({ ...prev, image: e.target.value }))}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-teal-500 text-xs"
                    placeholder="Upload image or input public URL"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Photo Description</label>
                <textarea
                  rows="3"
                  value={galleryForm.desc}
                  onChange={e => setGalleryForm(prev => ({ ...prev, desc: e.target.value }))}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-teal-500 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowGalleryModal(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-bold transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveGalleryItem}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all"
              >
                Confirm Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
