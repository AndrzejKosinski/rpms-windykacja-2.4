import * as React from 'react';
import { Button, Section, Text, Heading, Link } from '@react-email/components';
import EmailLayout from '../components/EmailLayout';

interface AccountActivationProps {
  userName: string;
  activationUrl: string;
}

export const AccountActivation = ({
  userName = 'Klient',
  activationUrl = 'https://rpms.pl/aktywacja?token=123',
}: AccountActivationProps) => {
  return (
    <EmailLayout previewText="Aktywuj swoje konto w RPMS Windykacja">
      <Heading className="text-[28px] font-black text-[#0a2e5c] mt-0 mb-4">
        Weryfikacja adresu e-mail
      </Heading>
      <Text className="text-[16px] font-medium text-slate-500 leading-relaxed">
        Witaj {userName}, prosimy o potwierdzenie adresu e-mail, aby odblokować pełną funkcjonalność systemu windykacyjnego.
      </Text>

      <Section className="text-center my-10">
        <Button
          className="bg-[#137fec] text-white rounded-xl font-extrabold text-[16px] px-8 py-4 text-center inline-block shadow-lg shadow-blue-500/30"
          href={activationUrl}
        >
          Potwierdź adres e-mail
        </Button>
      </Section>

      <Text className="text-[14px] text-slate-500 mb-2">
        Jeśli przycisk nie działa, skopiuj poniższy link do przeglądarki:
      </Text>
      <Link href={activationUrl} className="text-[12px] text-[#137fec] break-all">
        {activationUrl}
      </Link>
    </EmailLayout>
  );
};

export default AccountActivation;
