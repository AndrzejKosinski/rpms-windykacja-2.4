import React, { useState } from 'react';
import { List, Plus, Search, Trash2, Edit3, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { BlogPost } from '../../types/cms';

interface BlogListProps {
  posts: BlogPost[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: 'all' | 'published' | 'draft';
  setStatusFilter: (filter: 'all' | 'published' | 'draft') => void;
  selectedPosts: number[];
  setSelectedPosts: (indices: number[]) => void;
  onAddPost: () => void;
  onEditPost: (index: number) => void;
  onDeletePost: (index: number) => void;
  onBulkStatusChange: (status: 'published' | 'draft') => void;
  onBulkDelete: () => void;
}

export const BlogList: React.FC<BlogListProps> = ({
  posts = [],
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  selectedPosts,
  setSelectedPosts,
  onAddPost,
  onEditPost,
  onDeletePost,
  onBulkStatusChange,
  onBulkDelete
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredPosts = (posts || [])
    .map((post, idx) => ({ post, idx }))
    .filter(({ post }) => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  return (
    <div className="bg-[#0f172a] rounded-[var(--radius-brand-card)] border border-slate-800 p-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h3 className="text-xl font-black text-white flex items-center gap-3">
          <List size={24} className="text-brand-blue" /> Lista Artykułów ({posts?.length || 0})
        </h3>
        <button 
          onClick={onAddPost}
          className="px-6 py-3 bg-brand-blue text-white rounded-[var(--radius-brand-button)] font-black flex items-center gap-2 hover:bg-brand-blue/90 transition-all shadow-xl shadow-brand-blue/20"
        >
          <Plus size={18} /> Nowy Artykuł
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-900/50 p-4 rounded-[var(--radius-brand-button)] border border-slate-800">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Szukaj artykułu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-[var(--radius-brand-button)] text-white text-sm font-medium outline-none focus:border-brand-blue transition-all"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <button 
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-[var(--radius-brand-button)] text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${statusFilter === 'all' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            Wszystkie
          </button>
          <button 
            onClick={() => setStatusFilter('published')}
            className={`px-4 py-2 rounded-[var(--radius-brand-button)] text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${statusFilter === 'published' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10'}`}
          >
            Opublikowane
          </button>
          <button 
            onClick={() => setStatusFilter('draft')}
            className={`px-4 py-2 rounded-[var(--radius-brand-button)] text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${statusFilter === 'draft' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-500 hover:text-amber-400 hover:bg-amber-500/10'}`}
          >
            Szkice
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedPosts.length > 0 && (
        <div className="flex items-center justify-between bg-brand-blue/10 border border-brand-blue/20 p-4 rounded-[var(--radius-brand-button)] animate-in slide-in-from-bottom-4">
          <span className="text-brand-blue font-bold text-sm">Zaznaczono: {selectedPosts.length}</span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onBulkStatusChange('published')}
              className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-[var(--radius-brand-button)] text-xs font-black uppercase tracking-widest hover:bg-emerald-500/30 transition-all"
            >
              Publikuj
            </button>
            <button 
              onClick={() => onBulkStatusChange('draft')}
              className="px-4 py-2 bg-amber-500/20 text-amber-400 rounded-[var(--radius-brand-button)] text-xs font-black uppercase tracking-widest hover:bg-amber-500/30 transition-all"
            >
              Do szkiców
            </button>
            <div className="w-px h-6 bg-brand-blue/20 mx-2"></div>
            <button 
              onClick={onBulkDelete}
              className="px-4 py-2 bg-red-500/20 text-red-400 rounded-[var(--radius-brand-button)] text-xs font-black uppercase tracking-widest hover:bg-red-500/30 transition-all flex items-center gap-2"
            >
              <Trash2 size={14} /> Usuń
            </button>
          </div>
        </div>
      )}

      {/* Data Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="p-4 w-12">
                <input 
                  type="checkbox" 
                  checked={selectedPosts.length === posts.length && posts.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedPosts(posts.map((_, i) => i));
                    } else {
                      setSelectedPosts([]);
                    }
                  }}
                  className="w-4 h-4 rounded-[var(--radius-brand-button)] border-slate-700 bg-slate-900 text-brand-blue focus:ring-brand-blue focus:ring-offset-slate-900"
                />
              </th>
              <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-widest">Tytuł Artykułu</th>
              <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-widest">Kategoria</th>
              <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-widest">Status</th>
              <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-widest">SEO</th>
              <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPosts.map(({ post, idx }) => {
              const hasGoodSEO = post.seo?.title?.length > 40 && post.seo?.description?.length > 100;
              const hasMediumSEO = post.seo?.title?.length > 0 || post.seo?.description?.length > 0;
              
              return (
                <tr key={post.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors group">
                  <td className="p-4">
                    <input 
                      type="checkbox" 
                      checked={selectedPosts.includes(idx)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPosts([...selectedPosts, idx]);
                        } else {
                          setSelectedPosts(selectedPosts.filter(i => i !== idx));
                        }
                      }}
                      className="w-4 h-4 rounded-[var(--radius-brand-button)] border-slate-700 bg-slate-900 text-brand-blue focus:ring-brand-blue focus:ring-offset-slate-900"
                    />
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => onEditPost(idx)}
                      className="font-bold text-white hover:text-brand-blue transition-colors text-left line-clamp-1"
                    >
                      {post.title}
                    </button>
                    <div className="text-[10px] text-slate-500 mt-1">{post.publishedAt || post.date}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-[var(--radius-brand-input)] text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                      {post.category}
                    </span>
                  </td>
                  <td className="p-4">
                    {post.status === 'published' ? (
                      <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div> Opublikowany
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
                        <div className="w-2 h-2 rounded-full bg-amber-400"></div> Szkic
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2" title={hasGoodSEO ? "SEO zoptymalizowane" : hasMediumSEO ? "SEO wymaga poprawy" : "Brak SEO"}>
                      <div className={`w-3 h-3 rounded-full ${hasGoodSEO ? 'bg-emerald-500' : hasMediumSEO ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onEditPost(idx)}
                        className="p-2 text-slate-400 hover:text-brand-blue hover:bg-brand-blue/10 rounded-[var(--radius-brand-input)] transition-all"
                        title="Edytuj"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => onDeletePost(idx)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-[var(--radius-brand-input)] transition-all"
                        title="Usuń"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredPosts.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <FileText size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-medium">Brak artykułów. Dodaj swój pierwszy wpis!</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-slate-800">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
            Strona {currentPage} z {totalPages} ({filteredPosts.length} artykułów)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 bg-slate-800 text-white rounded-[var(--radius-brand-input)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-[var(--radius-brand-input)] text-xs font-black transition-all ${
                    currentPage === page ? 'bg-brand-blue text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 bg-slate-800 text-white rounded-[var(--radius-brand-input)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
