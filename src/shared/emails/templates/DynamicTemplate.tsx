import * as React from 'react';
import { Section, Heading } from '@react-email/components';
import EmailLayout from '../components/EmailLayout';

interface DynamicTemplateProps {
  subject: string;
  bodyHtml: string;
}

export const DynamicTemplate = ({
  subject = 'Brak tematu',
  bodyHtml = '<p>Brak treści</p>',
}: DynamicTemplateProps) => {
  return (
    <EmailLayout previewText={subject}>
      <Heading className="text-[24px] font-black text-[#0a2e5c] mt-0 mb-6 border-b border-solid border-slate-100 pb-4">
        {subject}
      </Heading>
      <Section>
        <div dangerouslySetInnerHTML={{ __html: bodyHtml }} className="text-[15px] text-slate-600 leading-relaxed" />
      </Section>
    </EmailLayout>
  );
};

export default DynamicTemplate;
