import React, { useState } from 'react';
import { HeroSection } from './HeroSection';
import { WhyUsSection } from './WhyUsSection';
import { TargetAudienceSection } from './TargetAudienceSection';

interface HomePageManagerProps {
  localContent: any;
  handleFieldChange: (section: string, field: string, value: any) => void;
}

export const HomePageManager: React.FC<HomePageManagerProps> = ({ localContent, handleFieldChange }) => {
  const [homeTab, setHomeTab] = useState('hero');

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-slate-800 pb-4">
        <button onClick={() => setHomeTab('hero')} className={`px-4 py-2 rounded-md font-bold text-sm ${homeTab === 'hero' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:text-white'}`}>Sekcja Hero</button>
        <button onClick={() => setHomeTab('why-us')} className={`px-4 py-2 rounded-md font-bold text-sm ${homeTab === 'why-us' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:text-white'}`}>Dlaczego My</button>
        <button onClick={() => setHomeTab('target-audience')} className={`px-4 py-2 rounded-md font-bold text-sm ${homeTab === 'target-audience' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:text-white'}`}>Grupa Docelowa</button>
      </div>
      {homeTab === 'hero' && (
        <HeroSection 
          data={localContent.hero}
          onChange={(field, value) => handleFieldChange('hero', field, value)}
        />
      )}
      {homeTab === 'why-us' && (
        <WhyUsSection 
          data={localContent.whyUs}
          onChange={(field, value) => handleFieldChange('whyUs', field, value)}
        />
      )}
      {homeTab === 'target-audience' && (
        <TargetAudienceSection 
          data={localContent.targetAudience}
          onChange={(field, value) => handleFieldChange('targetAudience', field, value)}
        />
      )}
    </div>
  );
};
