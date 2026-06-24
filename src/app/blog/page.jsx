import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, Clock, Tag, ArrowRight } from "lucide-react";

export default function BlogPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const res = await fetch("/api/blog?status=published");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const posts = data?.posts || [];

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-[#0F172A] min-h-screen text-slate-100 font-sans">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-teal-400 text-sm font-semibold uppercase tracking-widest mb-4">
          News & Advocacy Insights
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          The Alliance Blog
        </h1>
        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto">
          Accredited clinical updates, healthcare policy reviews, wellness advice, and member highlights.
        </p>
      </section>

      {/* Posts */}
      <section className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500 text-sm">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 border border-slate-800 rounded-2xl p-8 bg-slate-900/10">
            <div className="text-slate-400 text-lg mb-4">No news articles found.</div>
            <p className="text-slate-500 text-sm">
              Check back soon for active clinical stories and health network news.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <article
                key={post.id}
                className={`group bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden hover:border-teal-500/30 hover:-translate-y-1 transition-all duration-300 ${i === 0 ? "md:col-span-2 lg:col-span-1" : ""}`}
              >
                {post.cover_image ? (
                  <div className="aspect-video overflow-hidden bg-slate-800">
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-teal-900/30 to-slate-950 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white/10">
                      {post.title[0]}
                    </span>
                  </div>
                )}
                <div className="p-6">
                  {post.tags && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="text-xs text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                        <Tag size={10} />
                        Update
                      </span>
                    </div>
                  )}
                  <h2 className="text-white font-bold text-xl mb-3 group-hover:text-teal-400 transition-colors leading-snug">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 text-slate-500 text-xs">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {formatDate(post.published_at || post.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {Math.ceil((post.content || "").split(" ").length / 200) || 3} min read
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-teal-400 text-xs font-medium">
                      Read more <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-cyan-700">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Updated on Clinical Advocacy
          </h2>
          <p className="text-teal-100 mb-8">
            Get our newsletter detailing continuing education schedules and critical healthcare legislative reviews.
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-teal-700 hover:bg-teal-50 px-8 py-4 rounded-full font-bold transition-all shadow-md"
          >
            Subscribe via Contacts
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
