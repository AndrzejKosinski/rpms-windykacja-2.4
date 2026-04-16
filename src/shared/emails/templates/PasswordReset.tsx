import * as React from 'react';
import { Button, Section, Text, Heading } from '@react-email/components';
import EmailLayout from '../components/EmailLayout';

interface PasswordResetProps {
  userName: string;
  resetUrl: string;
}

export const PasswordReset = ({
  userName = 'Klient',
  resetUrl = 'https://rpms.pl/reset-hasla?token=123',
}: PasswordResetProps) => {
  return (
    <EmailLayout previewText="Resetowanie hasła w systemie RPMS Windykacja">
      <Heading className="text-[28px] font-black text-[#0a2e5c] mt-0 mb-4">
        Resetowanie hasła
      </Heading>
      <Text className="text-[16px] font-medium text-slate-500 leading-relaxed">
        Witaj {userName}, otrzymaliśmy prośbę o zresetowanie hasła do Twojego konta.
      </Text>

      <Section className="text-center my-10">
        <Button
          className="bg-[#137fec] text-white rounded-xl font-extrabold text-[16px] px-8 py-4 text-center inline-block shadow-lg shadow-blue-500/30"
          href={resetUrl}
        >
          Ustaw nowe hasło
        </Button>
      </Section>

      <Text className="text-[14px] text-slate-500">
        Link jest ważny przez 60 minut. Jeśli to nie Ty prosiłeś o zmianę hasła, zignoruj tę wiadomość.
      </Text>
    </EmailLayout>
  );
};

export default PasswordReset;
