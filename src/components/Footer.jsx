import {
  HeartPulse,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Instagram
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function Footer() {
  const { data } = useQuery({
    queryKey: ["site-settings-footer"],
    queryFn: async () => {
      const res = await fetch("/api/content");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    staleTime: 60000,
  });

  const s = data?.settings || {};
  const siteTitle = s.site_title || "Nurses Alliance Network";
  const tagline = s.hero_subheadline || "Empowering Nurses, Advancing Health, Building Community.";

  const footerLinks = {
    Alliance: [
      { href: "/about", label: "About Us" },
      { href: "/services", label: "Programs & Benefits" },
      { href: "/portfolio", label: "Initiatives" },
      { href: "/pricing", label: "Membership Tiers" },
      { href: "/blog", label: "News & Advocacy" },
    ],
    Programs: [
      { href: "/services", label: "Continuing Education" },
      { href: "/services", label: "Clinical Resources" },
      { href: "/services", label: "Career Development" },
      { href: "/services", label: "Advocacy & Support" },
      { href: "/services", label: "Nurse Mentorship" },
    ],
    Legal: [
      { href: "#", label: "Privacy Policy" },
      { href: "#", label: "Terms of Service" },
      { href: "#", label: "Cookie Policy" },
    ],
  };

  return (
    <footer className="bg-[#F8FAFC] border-t border-slate-250/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
                <HeartPulse size={16} className="text-white animate-pulse" />
              </div>
              <span className="text-[#1F2937] font-bold text-xl">
                {siteTitle}
              </span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed mb-6 max-w-xs">
              {tagline}
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-600 text-sm">
                <Mail size={14} className="text-[#10B981]" />
                <a href="mailto:info@nursesalliancenetwork.org" className="hover:text-[#2563EB] transition-colors">
                  info@nursesalliancenetwork.org
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-600 text-sm">
                <Phone size={14} className="text-[#10B981]" />
                <span>+1 (800) 555-0199</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 text-sm">
                <MapPin size={14} className="text-[#10B981]" />
                <span>100 Health Sciences Plaza, Suite 400</span>
              </div>
            </div>
            
            {/* Social links */}
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-slate-400 hover:text-[#2563EB] transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-slate-400 hover:text-[#2563EB] transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="#" className="text-slate-400 hover:text-[#2563EB] transition-colors">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-[#1F2937] font-semibold text-sm mb-4">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-slate-600 hover:text-[#2563EB] text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} {siteTitle}. All rights reserved.
          </p>
          <a
            href="/admin"
            className="text-slate-400 hover:text-[#2563EB] text-xs transition-colors"
          >
            Admin Portal
          </a>
        </div>
      </div>
    </footer>
  );
}
