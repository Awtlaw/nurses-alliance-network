import { useState, useEffect } from "react";
import { Menu, X, HeartPulse } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { data } = useQuery({
    queryKey: ["site-settings-nav"],
    queryFn: async () => {
      const res = await fetch("/api/content");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    staleTime: 60000,
  });

  const settings = data?.settings || {};
  const siteTitle = settings.site_title || "Nurses Alliance Network";
  const logoUrl = settings.logo_url;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Programs" },
    { href: "/portfolio", label: "Initiatives" },
    { href: "/gallery", label: "Gallery" },
    { href: "/pricing", label: "Membership" },
    { href: "/blog", label: "News" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? "h-16" : "h-16 lg:h-20"}`}>
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            {logoUrl ? (
              <img src={logoUrl} alt={siteTitle} className="h-8 w-auto" />
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all bg-[#2563EB]">
                  <HeartPulse size={16} className="text-white animate-pulse" />
                </div>
                <span className="font-bold text-lg sm:text-xl tracking-tight transition-colors text-[#1F2937]">
                  {siteTitle}
                </span>
              </div>
            )}
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors duration-200 relative group text-[#1F2937] hover:text-[#2563EB]"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 bg-[#2563EB]" />
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="/pricing"
              className="bg-[#10B981] hover:bg-[#0d9488] text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-sm"
            >
              Join the Alliance
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 transition-colors text-[#1F2937] hover:text-[#2563EB]"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white shadow-md transition-all">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block py-2 text-base font-medium transition-colors text-[#1F2937] hover:text-[#2563EB]"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/pricing"
              className="block bg-[#10B981] hover:bg-[#0d9488] text-white px-5 py-3 rounded-full text-sm font-semibold text-center mt-4"
            >
              Join the Alliance
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
