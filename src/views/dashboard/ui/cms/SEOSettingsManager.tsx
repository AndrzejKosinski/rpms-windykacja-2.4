import React, { useState } from 'react';
import { SEOSection } from './SEOSection';
import { SEOPreview } from './SEOPreview';

interface SEOSettingsManagerProps {
  localContent: any;
  handleFieldChange: (section: string, field: string, value: any, subSection?: string) => void;
}

export const SEOSettingsManager: React.FC<SEOSettingsManagerProps> = ({ localContent, handleFieldChange }) => {
  const [seoTab, setSeoTab] = useState('seo-home');

  const renderSEOPreview = (title: string, description: string) => (
    <SEOPreview title={title} description={description} />
  );

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-slate-800 pb-4">
        <button onClick={() => setSeoTab('seo-home')} className={`px-4 py-2 rounded-md font-bold text-sm ${seoTab === 'seo-home' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:text-white'}`}>Strona Główna</button>
        <button onClick={() => setSeoTab('seo-blog')} className={`px-4 py-2 rounded-md font-bold text-sm ${seoTab === 'seo-blog' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:text-white'}`}>Lista Artykułów</button>
      </div>
      {seoTab === 'seo-home' && (
        <SEOSection 
          type="home"
          data={localContent.seo.home}
          onChange={(field, value) => handleFieldChange('seo', field, value, 'home')}
          renderPreview={renderSEOPreview}
        />
      )}
      {seoTab === 'seo-blog' && (
        <SEOSection 
          type="blog"
          data={localContent.seo.blog}
          onChange={(field, value) => handleFieldChange('seo', field, value, 'blog')}
          renderPreview={renderSEOPreview}
        />
      )}
    </div>
  );
};
