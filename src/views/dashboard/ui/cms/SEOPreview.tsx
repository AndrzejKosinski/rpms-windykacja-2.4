import React from 'react';
import { Search as SearchIcon } from 'lucide-react';

interface SEOPreviewProps {
  title: string;
  description: string;
}

export const SEOPreview: React.FC<SEOPreviewProps> = ({ title, description }) => (
  <div className="bg-white rounded-[var(--radius-brand-button)] p-6 border border-slate-200 shadow-sm max-w-2xl">
    <div className="flex items-center gap-2 mb-1">
      <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
        <SearchIcon size={14} />
      </div>
      <div className="text-sm text-slate-600">
        rpms.pl <span className="text-slate-400">› blog › ...</span>
      </div>
    </div>
    <h5 className="text-[#1a0dab] text-xl font-medium hover:underline cursor-pointer mb-1 line-clamp-1">
      {title || 'Tytuł artykułu pojawi się tutaj'}
    </h5>
    <p className="text-[#4d5156] text-sm line-clamp-2 leading-relaxed">
      {description || 'Opis SEO artykułu pojawi się tutaj. Zadbaj o to, aby był zachęcający i zawierał słowa kluczowe.'}
    </p>
  </div>
);
