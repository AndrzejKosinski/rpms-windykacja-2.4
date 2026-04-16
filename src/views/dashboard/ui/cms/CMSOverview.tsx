import React from 'react';
import { Sparkles, Clock, BarChart3, ShieldCheck, FileText, Zap, Plus, Search as SearchIcon, Edit3 } from 'lucide-react';
import Image from 'next/image';

interface CMSOverviewProps {
  blogPosts: any[];
  setActiveSection: (section: string) => void;
  setActivePostIdx: (idx: number) => void;
  handleAddBlogPost: () => void;
}

export const CMSOverview: React.FC<CMSOverviewProps> = ({ 
  blogPosts, 
  setActiveSection, 
  setActivePostIdx, 
  handleAddBlogPost 
}) => {
  // Obliczanie realnego wyniku SEO na podstawie uzupełnionych danych w artykułach
  const calculateSEOScore = () => {
    if (!blogPosts || blogPosts.length === 0) return 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    blogPosts.forEach(post => {
      totalPoints += 4; // Sprawdzamy 4 kluczowe elementy: title, description, imageAlt, excerpt
      if (post.seo?.title && post.seo.title.length > 0) earnedPoints += 1;
      if (post.seo?.description && post.seo.description.length > 0) earnedPoints += 1;
      if (post.imageAlt && post.imageAlt.length > 0) earnedPoints += 1;
      if (post.excerpt && post.excerpt.length > 0) earnedPoints += 1;
    });

    return Math.round((earnedPoints / totalPoints) * 100);
  };

  const seoScore = calculateSEOScore();
  const blogPostsCount = blogPosts?.length || 0;
  const lastEditDate = blogPostsCount > 0 ? (blogPosts[0].date || 'Brak danych') : 'Brak danych';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-4 gap-6">
        {/* Welcome Card */}
        <div className="bg-gradient-to-br from-brand-blue to-brand-blue/80 p-6 rounded-[var(--radius-brand-card)] shadow-xl shadow-brand-blue/10 relative overflow-hidden group">
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-black text-white mb-1">Witaj w RPMS CMS</h2>
              <p className="text-brand-light-blue text-xs font-medium opacity-80">System gotowy do pracy.</p>
            </div>
            <button 
              onClick={() => setActiveSection('blog-list')}
              className="mt-4 px-4 py-2 bg-white text-brand-blue rounded-[var(--radius-brand-button)] font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform shadow-lg w-fit"
            >
              Zacznij pisać
            </button>
          </div>
          <Sparkles className="absolute -top-2 -right-2 text-white/10" size={60} />
        </div>

        {/* Last Edit Card */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-[var(--radius-brand-card)] flex items-center gap-4">
          <div className="w-10 h-10 bg-brand-blue/10 rounded-[var(--radius-brand-button)] flex items-center justify-center text-brand-blue shrink-0">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ostatnia edycja</p>
            <p className="text-sm font-bold text-white mt-0.5">{lastEditDate}</p>
          </div>
        </div>

        {/* Content Stats Card */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-[var(--radius-brand-card)] flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-[var(--radius-brand-button)] flex items-center justify-center text-emerald-500 shrink-0">
            <BarChart3 size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Statystyki Treści</p>
            <p className="text-sm font-bold text-white mt-0.5">{blogPostsCount} Artykułów</p>
          </div>
        </div>

        {/* SEO Health Card */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-[var(--radius-brand-card)] flex items-center gap-4">
          <div className="w-10 h-10 bg-amber-500/10 rounded-[var(--radius-brand-button)] flex items-center justify-center text-amber-500 shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Kondycja SEO</p>
            <p className="text-sm font-bold text-white mt-0.5">{seoScore}% Optymalizacji</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[var(--radius-brand-card)] space-y-6">
          <h3 className="text-xl font-black text-white flex items-center gap-3">
            <FileText className="text-brand-blue" /> Ostatnie Artykuły
          </h3>
          <div className="space-y-4">
            {blogPosts?.slice(0, 3).map((post: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-[var(--radius-brand-button)] border border-slate-700/50 group hover:border-brand-blue/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-[var(--radius-brand-button)] overflow-hidden bg-slate-800 flex items-center justify-center">
                    {(post.image || post.imageUrl) ? (
                      <Image 
                        src={post.image || post.imageUrl} 
                        alt={post.title || 'Post image'} 
                        fill 
                        sizes="48px"
                        className="object-cover" 
                        referrerPolicy="no-referrer" 
                      />
                    ) : (
                      <FileText className="text-slate-600 w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-white group-hover:text-brand-blue transition-colors line-clamp-1">{post.title}</p>
                    <p className="text-xs text-slate-500 font-medium">{post.date}</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setActivePostIdx(i);
                    setActiveSection(`blog-${i}`);
                  }} 
                  className="p-2 text-slate-500 hover:text-white transition-colors"
                >
                  <Edit3 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[var(--radius-brand-card)] space-y-6">
          <h3 className="text-xl font-black text-white flex items-center gap-3">
            <Zap className="text-yellow-500" /> Szybkie Akcje
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={handleAddBlogPost} className="p-6 bg-slate-800/50 rounded-[var(--radius-brand-card)] border border-slate-700/50 hover:border-brand-blue transition-all text-left group">
              <Plus className="text-brand-blue mb-4 group-hover:scale-110 transition-transform" />
              <p className="font-black text-white">Nowy Post</p>
              <p className="text-xs text-slate-500 font-medium">Dodaj artykuł na bloga</p>
            </button>
            <button onClick={() => setActiveSection('seo-settings')} className="p-6 bg-slate-800/50 rounded-[var(--radius-brand-card)] border border-slate-700/50 hover:border-brand-blue transition-all text-left group">
              <SearchIcon className="text-purple-500 mb-4 group-hover:scale-110 transition-transform" />
              <p className="font-black text-white">SEO Audit</p>
              <p className="text-xs text-slate-500 font-medium">Sprawdź widoczność</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
