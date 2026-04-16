import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

interface EmailLayoutProps {
  previewText: string;
  children: React.ReactNode;
}

export const EmailLayout: React.FC<EmailLayoutProps> = ({
  previewText,
  children,
}) => {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-slate-50 my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-slate-200 rounded-3xl my-[40px] mx-auto p-[0px] max-w-[600px] bg-white overflow-hidden shadow-sm">
            {/* Header */}
            <Section className="bg-[#0a2e5c] p-10 text-center">
              <Heading className="text-white m-0 text-[24px] font-extrabold tracking-tight">
                RPMS<span className="text-[#137fec]"> Windykacja</span>
              </Heading>
            </Section>

            {/* Content */}
            <Section className="p-10">
              {children}

              {/* Footer */}
              <Text className="text-[13px] text-slate-400 mt-[30px] text-center">
                Zespół prawny RPMS Windykacja
              </Text>
            </Section>
          </Container>

          {/* Bottom Copyright */}
          <Text className="text-center text-[11px] text-slate-400 font-semibold uppercase tracking-widest px-5">
            © {new Date().getFullYear()} RPMS Windykacja • Standard LegalTech • Warszawa
          </Text>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default EmailLayout;
