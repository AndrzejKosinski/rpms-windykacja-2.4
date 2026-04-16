import React, { useState } from 'react';
import { List, Plus, Search, Trash2, Edit3, Eye, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { Page } from '../../types/cms';

interface PagesListSectionProps {
  pages: Page[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: 'all' | 'published' | 'draft';
  setStatusFilter: (filter: 'all' | 'published' | 'draft') => void;
  selectedPages: number[];
  setSelectedPages: (indices: number[]) => void;
  onAddPage: () => void;
  onEditPage: (index: number) => void;
  onDeletePage: (index: number) => void;
  onBulkStatusChange: (status: boolean) => void;
  onBulkDelete: () => void;
}

export const PagesListSection: React.FC<PagesListSectionProps> = ({
  pages = [],
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  selectedPages,
  setSelectedPages,
  onAddPage,
  onEditPage,
  onDeletePage,
  onBulkStatusChange,
  onBulkDelete
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredPages = (pages || [])
    .map((page, idx) => ({ page, idx }))
    .filter(({ page }) => {
      const matchesSearch = page.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'published' ? page.isPublished : !page.isPublished);
      return matchesSearch && matchesStatus;
    });

  const totalPages = Math.ceil(filteredPages.length / itemsPerPage);
  const paginatedPages = filteredPages.slice(
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
          <List size={24} className="text-brand-blue" /> Lista Podstron ({pages?.length || 0})
        </h3>
        <button 
          onClick={onAddPage}
          className="px-6 py-3 bg-brand-blue text-white rounded-[var(--radius-brand-button)] font-black flex items-center gap-2 hover:bg-brand-blue/90 transition-all shadow-xl shadow-brand-blue/20"
        >
          <Plus size={20} />
          Dodaj Podstronę
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-900/50 p-4 rounded-[var(--radius-brand-button)] border border-slate-800">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Szukaj podstrony..."
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
      {selectedPages.length > 0 && (
        <div className="flex items-center justify-between bg-brand-blue/10 border border-brand-blue/20 p-4 rounded-[var(--radius-brand-button)] animate-in slide-in-from-bottom-4">
          <span className="text-brand-blue font-bold text-sm">Zaznaczono: {selectedPages.length}</span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onBulkStatusChange(true)}
              className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-[var(--radius-brand-button)] text-xs font-black uppercase tracking-widest hover:bg-emerald-500/30 transition-all"
            >
              Publikuj
            </button>
            <button 
              onClick={() => onBulkStatusChange(false)}
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
                  checked={selectedPages.length === pages.length && pages.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedPages(pages.map((_, i) => i));
                    } else {
                      setSelectedPages([]);
                    }
                  }}
                  className="w-4 h-4 rounded-[var(--radius-brand-button)] border-slate-700 bg-slate-900 text-brand-blue focus:ring-brand-blue focus:ring-offset-slate-900"
                />
              </th>
              <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-widest">Tytuł Podstrony</th>
              <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-widest">Status</th>
              <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-widest">SEO</th>
              <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPages.map(({ page, idx }) => {
              const hasGoodSEO = page.seo?.title?.length > 40 && page.seo?.description?.length > 100;
              const hasMediumSEO = page.seo?.title?.length > 0 || page.seo?.description?.length > 0;
              
              return (
                <tr key={page.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors group">
                  <td className="p-4">
                    <input 
                      type="checkbox" 
                      checked={selectedPages.includes(idx)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPages([...selectedPages, idx]);
                        } else {
                          setSelectedPages(selectedPages.filter(i => i !== idx));
                        }
                      }}
                      className="w-4 h-4 rounded-[var(--radius-brand-button)] border-slate-700 bg-slate-900 text-brand-blue focus:ring-brand-blue focus:ring-offset-slate-900"
                    />
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => onEditPage(idx)}
                      className="font-bold text-white hover:text-brand-blue transition-colors text-left line-clamp-1"
                    >
                      {page.title}
                    </button>
                    <div className="text-[10px] text-slate-500 mt-1">/{page.slug}</div>
                  </td>
                  <td className="p-4">
                    {page.isPublished ? (
                      <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div> Opublikowana
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
                      <a 
                        href={`/${page.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-slate-400 hover:text-brand-blue hover:bg-brand-blue/10 rounded-[var(--radius-brand-input)] transition-all"
                        title="Podgląd"
                      >
                        <Eye size={16} />
                      </a>
                      <button 
                        onClick={() => onEditPage(idx)}
                        className="p-2 text-slate-400 hover:text-brand-blue hover:bg-brand-blue/10 rounded-[var(--radius-brand-input)] transition-all"
                        title="Edytuj"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => onDeletePage(idx)}
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
        {filteredPages.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <FileText size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-medium">Nie znaleziono żadnych podstron.</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-slate-800">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
            Strona {currentPage} z {totalPages} ({filteredPages.length} podstron)
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
