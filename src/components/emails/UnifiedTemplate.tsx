import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Img,
} from '@react-email/components';

interface UnifiedTemplateProps {
  subject: string;
  previewText?: string;
  greeting?: string;
  body: string;
  buttonText?: string;
  buttonUrl?: string;
  buttonStyle?: 'button' | 'link';
  buttonHelpText?: string;
  footer: string;
  isRawHtmlBody?: boolean;
  greetingStyle?: 'standard' | 'large';
}

export const UnifiedTemplate = ({
  subject = 'Wiadomość z systemu RPMS',
  previewText = 'Nowa wiadomość z systemu RPMS',
  greeting = 'Witaj,',
  body = 'To jest przykładowa wiadomość.',
  buttonText,
  buttonUrl = '#',
  buttonStyle = 'button',
  buttonHelpText,
  footer = 'Pozdrawiamy,\nZespół RPMS',
  isRawHtmlBody = false,
  greetingStyle = 'large',
}: UnifiedTemplateProps) => {
  // Replace newlines with <br /> for proper HTML rendering
  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={{ ...headerTitle, margin: 0 }}>
              Windykacja <span style={headerTitleHighlight}>RPMS</span>
            </Heading>
          </Section>
          
          <Section style={content}>
            {greeting && (
              <Text style={greetingStyle === 'standard' ? greetingTextStandard : greetingTextLarge}>
                <strong>{greeting}</strong>
              </Text>
            )}
            
            {isRawHtmlBody ? (
              <Text style={text} dangerouslySetInnerHTML={{ __html: body }} />
            ) : (
              <Text style={text}>
                {body.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </Text>
            )}

            {buttonText && buttonStyle === 'button' && (
              <Section style={buttonContainer}>
                <Button style={button} href={buttonUrl}>
                  {buttonText}
                </Button>
              </Section>
            )}

            {buttonText && buttonStyle === 'link' && (
              <Section style={linkContainer}>
                {buttonHelpText && (
                  <Text style={linkHelpText}>
                    {buttonHelpText}
                  </Text>
                )}
                <Text style={{ margin: 0 }}>
                  <a href={buttonUrl} style={linkStyle}>
                    {buttonText}
                  </a>
                </Text>
              </Section>
            )}

            <Hr style={hr} />
            
            <Text style={footerText}>
              {formatText(footer)}
            </Text>
            <Text style={copyright}>
              © {new Date().getFullYear()} RPMS Windykacja • Standard LegalTech • Poznań
            </Text>
          </Section>
        </Container>
        {/* Niewidoczny znacznik zapobiegający zwijaniu wiadomości (Trimmed Content) w Gmailu */}
        <Text style={{ display: 'none', opacity: 0, fontSize: '0px', lineHeight: '0px', color: '#f6f9fc' }}>
          {Date.now().toString(36)}-{Math.random().toString(36).substring(2)}
        </Text>
      </Body>
    </Html>
  );
};

export default UnifiedTemplate;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
};

const header = {
  backgroundColor: '#0a2e5c',
  padding: '30px 40px',
  borderRadius: '24px 24px 0 0',
  textAlign: 'center' as const,
};

const headerTitle = {
  color: '#ffffff',
  margin: '0',
  fontSize: '24px',
  fontWeight: '800',
  letterSpacing: '-1px',
};

const headerTitleHighlight = {
  color: '#137fec',
};

const content = {
  backgroundColor: '#ffffff',
  padding: '40px',
  border: '1px solid #e0f2fe',
  borderTop: 'none',
  borderRadius: '0 0 24px 24px',
};

const greetingTextLarge = {
  color: '#0a2e5c',
  fontSize: '24px',
  fontWeight: '900',
  margin: '0 0 20px 0',
};

const greetingTextStandard = {
  color: '#0a2e5c',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
};

const text = {
  color: '#0a2e5c',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 24px 0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#137fec',
  color: '#ffffff',
  padding: '16px 32px',
  borderRadius: '12px',
  fontWeight: '800',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
};

const linkContainer = {
  margin: '32px 0',
};

const linkHelpText = {
  color: '#0a2e5c',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
};

const linkStyle = {
  color: '#137fec',
  fontWeight: 'bold',
  fontSize: '16px',
  textDecoration: 'none',
  borderBottom: '1px solid #137fec',
  paddingBottom: '2px',
};

const hr = {
  borderColor: '#e2e8f0',
  margin: '30px 0',
};

const footerText = {
  color: '#94a3b8',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0 0 20px 0',
  textAlign: 'center' as const,
};

const copyright = {
  color: '#94a3b8',
  fontSize: '11px',
  fontWeight: '600',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.1em',
  textAlign: 'center' as const,
  margin: '0',
};
