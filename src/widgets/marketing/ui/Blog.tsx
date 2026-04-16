import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, User, ArrowLeft, ArrowRight, Share2, Bookmark, Search, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

interface BlogPost {
  id: string;
  slug?: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  publishedAt?: string;
  readTime: string;
  image: string;
  imageUrl?: string;
  imageAlt?: string;
  status?: string;
  faqs?: { question: string; answer: string }[];
  jsonLd?: any;
  seo?: {
    title: string;
    description: string;
    keywords: string;
  };
}

interface BlogProps {
  id?: string;
  posts: BlogPost[];
  onRegister: (source?: string) => void;
}

const Blog: React.FC<BlogProps> = ({ id, posts = [], onRegister }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  const filteredPosts = posts
    ?.filter(p => p.status === 'published' || !p.status) // Fallback dla starych postów bez statusu
    .filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase())) || [];

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visiblePosts = filteredPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const blogSection = document.getElementById(id || 'blog');
    if (blogSection) {
      window.scrollTo({ top: blogSection.offsetTop - 100, behavior: 'smooth' });
    }
  };

  // Reset to first page when search term changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <section id={id || 'blog'} className="bg-slate-50 min-h-screen pt-32 pb-24 animate-in fade-in duration-500">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <h1 className="text-5xl lg:text-7xl font-black text-brand-navy mb-6 tracking-tighter">
              Baza <span className="text-brand-blue">Wiedzy</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed">
              Praktyczne poradniki, aktualności prawne i strategie windykacyjne, które pomogą Ci zadbać o płynność finansową.
            </p>
          </div>
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Szukaj artykułu..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-[var(--radius-brand-button)] outline-none focus:border-brand-blue transition-all font-bold text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {visiblePosts.map((post) => (
            <Link 
              key={post.id} 
              href={`/blog/${post.slug || post.id}`}
              className="group bg-white rounded-[var(--radius-brand-card)] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 cursor-pointer flex flex-col"
            >
              <div className="relative h-64 overflow-hidden bg-slate-100 flex items-center justify-center">
                {(post.image || post.imageUrl) ? (
                  <Image 
                    src={post.image || post.imageUrl || ''} 
                    alt={post.imageAlt || post.title} 
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700" 
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <FileText className="text-slate-300 w-12 h-12" />
                )}
                <div className="absolute top-6 left-6">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-brand-navy text-[11px] font-black rounded-[var(--radius-brand-input)] uppercase tracking-widest shadow-sm">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-10 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-[11px] font-black text-slate-300 uppercase tracking-widest mb-6">
                  <span className="flex items-center gap-1.5"><Calendar size={12} /> {post.date}</span>
                  <span className="flex items-center gap-1.5"><Clock size={12} /> {post.readTime}</span>
                </div>
                
                <h3 className="text-2xl font-black text-brand-navy mb-4 group-hover:text-brand-blue transition-colors leading-tight">
                  {post.title}
                </h3>
                
                <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8 flex-1">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                   <span className="text-xs font-black text-brand-navy uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                      Czytaj więcej <ArrowRight size={16} className="text-brand-blue" />
                   </span>
                   <div className="flex gap-2">
                     <button className="p-2 text-slate-300 hover:text-brand-blue transition-colors"><Bookmark size={18} /></button>
                     <button className="p-2 text-slate-300 hover:text-brand-blue transition-colors"><Share2 size={18} /></button>
                   </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-16 flex justify-center items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-3 rounded-[var(--radius-brand-button)] border border-slate-200 text-slate-500 hover:text-brand-blue hover:border-brand-blue disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            
            {Array.from({ length: totalPages }).map((_, idx) => {
              const page = idx + 1;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-12 h-12 rounded-[var(--radius-brand-button)] font-bold transition-all ${
                    currentPage === page 
                      ? 'bg-brand-blue text-white shadow-md' 
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-brand-blue hover:text-brand-blue'
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-3 rounded-[var(--radius-brand-button)] border border-slate-200 text-slate-500 hover:text-brand-blue hover:border-brand-blue disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Blog;
