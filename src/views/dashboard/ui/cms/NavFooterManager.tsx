import React, { useState } from 'react';
import { ContactBarSection } from './ContactBarSection';
import { FooterEditorSection } from './FooterEditorSection';

interface NavFooterManagerProps {
  localContent: any;
  handleFieldChange: (section: string, field: string, value: any) => void;
}

export const NavFooterManager: React.FC<NavFooterManagerProps> = ({ localContent, handleFieldChange }) => {
  const [navTab, setNavTab] = useState('contact-bar');

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-slate-800 pb-4">
        <button onClick={() => setNavTab('contact-bar')} className={`px-4 py-2 rounded-md font-bold text-sm ${navTab === 'contact-bar' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:text-white'}`}>Górna Belka</button>
        <button onClick={() => setNavTab('footer')} className={`px-4 py-2 rounded-md font-bold text-sm ${navTab === 'footer' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:text-white'}`}>Stopka (Footer)</button>
      </div>
      {navTab === 'contact-bar' && (
        <ContactBarSection 
          data={localContent.contactBar}
          onChange={(field, value) => handleFieldChange('contactBar', field, value)}
        />
      )}
      {navTab === 'footer' && (
        <FooterEditorSection 
          data={localContent.footer}
          onChange={(field, value) => handleFieldChange('footer', field, value)}
          pages={localContent.pages}
        />
      )}
    </div>
  );
};
