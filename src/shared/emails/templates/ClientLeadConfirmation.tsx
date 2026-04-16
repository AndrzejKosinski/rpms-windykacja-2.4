import * as React from 'react';
import { Section, Text, Heading, Link } from '@react-email/components';
import EmailLayout from '../components/EmailLayout';

interface ClientLeadConfirmationProps {
  caseDetails: string;
  dashboardUrl: string;
}

export const ClientLeadConfirmation = ({
  caseDetails = 'Faktury na łączną kwotę 15 000 PLN',
  dashboardUrl = 'https://rpms.pl/dashboard',
}: ClientLeadConfirmationProps) => {
  return (
    <EmailLayout previewText="Otrzymaliśmy Twoje zgłoszenie windykacyjne - Analiza w toku">
      <Heading className="text-[28px] font-black text-[#0a2e5c] mt-0 mb-4">
        Potwierdzenie przyjęcia sprawy
      </Heading>
      <Text className="text-[16px] font-medium text-slate-500 leading-relaxed">
        Dziękujemy za zaufanie. Nasz zespół prawny właśnie rozpoczął analizę merytoryczną przesłanych dokumentów.
      </Text>

      <Section className="border-l-4 border-solid border-[#137fec] pl-6 py-4 bg-[#f0f9ff] my-8 rounded-r-xl">
        <Text className="m-0 text-[14px] font-bold text-[#0a2e5c]">
          Zgłoszone wierzytelności:
        </Text>
        <Text className="mt-2 mb-0 text-[13px] font-medium text-[#0a2e5c]">
          {caseDetails}
        </Text>
      </Section>

      <Text className="text-[15px] font-bold text-[#0a2e5c] mb-2">
        Co dalej?
      </Text>
      <ul className="pl-5 text-[14px] text-slate-500 mb-8 space-y-2">
        <li>W ciągu 15 minut nasz system zweryfikuje NIP dłużnika w bazach gospodarczych.</li>
        <li>Opiekun prawny przygotuje wstępną strategię odzyskania kwoty.</li>
        <li>Otrzymasz powiadomienie o gotowej analizie do akceptacji.</li>
      </ul>

      <Section className="mt-10 pt-6 border-t border-solid border-slate-100">
        <Text className="text-[14px] font-extrabold text-[#0a2e5c] mb-2">
          Chcesz monitorować postępy w czasie rzeczywistym?
        </Text>
        <Link 
          href={dashboardUrl} 
          className="inline-block text-[#137fec] font-extrabold text-[14px] border-b-2 border-solid border-[#137fec] pb-1"
        >
          Ustaw hasło i wejdź do Panelu &rarr;
        </Link>
      </Section>
    </EmailLayout>
  );
};

export default ClientLeadConfirmation;
