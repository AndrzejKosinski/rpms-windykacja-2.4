import * as React from 'react';
import { Button, Section, Text, Heading } from '@react-email/components';
import EmailLayout from '../components/EmailLayout';

interface ClientWelcomeProps {
  userName: string;
  userEmail: string;
  dashboardUrl: string;
}

export const ClientWelcome = ({
  userName = 'Klient',
  userEmail = 'klient@example.com',
  dashboardUrl = 'https://rpms.pl/dashboard',
}: ClientWelcomeProps) => {
  return (
    <EmailLayout previewText="Twój bezpieczny panel został aktywowany">
      <Heading className="text-[28px] font-black text-[#0a2e5c] mt-0 mb-4">
        Witaj, {userName}!
      </Heading>
      <Text className="text-[16px] font-medium text-slate-500 leading-relaxed">
        Twoje konto w nowoczesnym systemie odzyskiwania należności zostało pomyślnie utworzone. Od teraz masz pełny wgląd w przebieg swoich spraw 24/7.
      </Text>

      <Section className="bg-slate-50 rounded-2xl p-6 my-8 border border-solid border-slate-100">
        <Text className="m-0 text-[13px] font-bold text-slate-400 uppercase tracking-widest">
          Twoje dane logowania:
        </Text>
        <Text className="mt-2 mb-0 text-[15px] font-extrabold text-[#0a2e5c]">
          E-mail: <span className="text-[#137fec]">{userEmail}</span>
        </Text>
      </Section>

      <Section className="text-center mt-8 mb-4">
        <Button
          className="bg-[#137fec] text-white rounded-xl font-extrabold text-[16px] px-8 py-4 text-center block w-full shadow-lg shadow-blue-500/30"
          href={dashboardUrl}
        >
          Przejdź do Panelu Spraw
        </Button>
      </Section>
    </EmailLayout>
  );
};

export default ClientWelcome;
