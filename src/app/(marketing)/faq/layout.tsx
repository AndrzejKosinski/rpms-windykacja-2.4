import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "FAQ - Najczęściej zadawane pytania | RPMS Windykacja",
  description: "Masz pytania dotyczące procesu windykacji? Sprawdź nasze FAQ i dowiedz się, jak działamy, jakie są koszty i jak szybko odzyskasz swoje pieniądze.",
  alternates: {
    canonical: '/faq',
  },
  openGraph: {
    title: "FAQ - Najczęściej zadawane pytania | RPMS Windykacja",
    description: "Masz pytania dotyczące procesu windykacji? Sprawdź nasze FAQ i dowiedz się, jak działamy, jakie są koszty i jak szybko odzyskasz swoje pieniądze.",
    type: 'website',
    locale: 'pl_PL',
    siteName: 'RPMS Windykacja',
  },
};

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
