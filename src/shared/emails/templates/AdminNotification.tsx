import * as React from 'react';
import { Section, Text, Heading } from '@react-email/components';
import EmailLayout from '../components/EmailLayout';

interface AdminNotificationProps {
  type: 'lawyer' | 'lead' | 'test';
  data: any;
}

export const AdminNotification = ({
  type = 'test',
  data = {},
}: AdminNotificationProps) => {
  
  let title = 'Test konfiguracji SMTP';
  let previewText = 'Test konfiguracji SMTP - RPMS';

  if (type === 'lawyer') {
    title = 'Nowe pytanie do eksperta';
    previewText = `Pytanie od: ${data.name || 'Nieznajomy'}`;
  } else if (type === 'lead') {
    title = 'Nowe zapytanie o ofertę dla firmy';
    previewText = `Zapytanie od firmy: ${data.companyName || 'Nieznana'}`;
  }

  return (
    <EmailLayout previewText={previewText}>
      <Heading className="text-[24px] font-black text-[#0a2e5c] mt-0 mb-6 border-b border-solid border-slate-100 pb-4">
        {title}
      </Heading>

      {type === 'test' && (
        <Section>
          <Text className="text-[15px] text-slate-600 mb-4">Witaj,</Text>
          <Text className="text-[15px] text-slate-600 mb-4">
            Ta wiadomość została wysłana z Panelu Administratora systemu RPMS.
          </Text>
          <Text className="text-[15px] text-slate-600 mb-4 font-bold text-emerald-600">
            Jeśli ją czytasz, oznacza to, że Twoja konfiguracja serwera SMTP działa poprawnie!
          </Text>
        </Section>
      )}

      {type === 'lawyer' && (
        <Section className="bg-slate-50 p-6 rounded-xl border border-solid border-slate-100">
          <Text className="m-0 mb-2 text-[14px]"><strong className="text-[#0a2e5c]">Imię i nazwisko:</strong> {data.name}</Text>
          <Text className="m-0 mb-2 text-[14px]"><strong className="text-[#0a2e5c]">Email:</strong> {data.email}</Text>
          <Text className="m-0 mb-2 text-[14px]"><strong className="text-[#0a2e5c]">Telefon:</strong> {data.phone}</Text>
          <Text className="m-0 mb-4 text-[14px]"><strong className="text-[#0a2e5c]">Temat:</strong> {data.topic}</Text>
          
          <Text className="m-0 mb-2 text-[14px] font-bold text-[#0a2e5c]">Wiadomość:</Text>
          <Text className="m-0 text-[14px] text-slate-600 whitespace-pre-wrap bg-white p-4 rounded-lg border border-solid border-slate-200">
            {data.message}
          </Text>
        </Section>
      )}

      {type === 'lead' && (
        <Section className="bg-slate-50 p-6 rounded-xl border border-solid border-slate-100">
          <Text className="m-0 mb-2 text-[14px]"><strong className="text-[#0a2e5c]">Imię i nazwisko:</strong> {data.name}</Text>
          <Text className="m-0 mb-2 text-[14px]"><strong className="text-[#0a2e5c]">Email:</strong> {data.email}</Text>
          <Text className="m-0 mb-2 text-[14px]"><strong className="text-[#0a2e5c]">Telefon:</strong> {data.phone}</Text>
          <Text className="m-0 mb-2 text-[14px]"><strong className="text-[#0a2e5c]">Nazwa firmy:</strong> {data.companyName}</Text>
          <Text className="m-0 mb-2 text-[14px]"><strong className="text-[#0a2e5c]">NIP:</strong> {data.nip}</Text>
          <Text className="m-0 mb-2 text-[14px]"><strong className="text-[#0a2e5c]">Wielkość firmy:</strong> {data.companySize}</Text>
          <Text className="m-0 mb-4 text-[14px]"><strong className="text-[#0a2e5c]">Usługa:</strong> {data.service}</Text>
          
          <Text className="m-0 mb-2 text-[14px] font-bold text-[#0a2e5c]">Wiadomość:</Text>
          <Text className="m-0 text-[14px] text-slate-600 whitespace-pre-wrap bg-white p-4 rounded-lg border border-solid border-slate-200">
            {data.message}
          </Text>
        </Section>
      )}
    </EmailLayout>
  );
};

export default AdminNotification;
