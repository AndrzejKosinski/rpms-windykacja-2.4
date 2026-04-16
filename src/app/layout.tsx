import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ 
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://rpms.pl'),
  title: "RPMS Windykacja | Nowoczesne Odzyskiwanie Należności",
  description: "Zaawansowana platforma windykacyjna łącząca automatyzację z profesjonalnym wsparciem prawnym.",
};

import { Providers } from "./providers";
import { Suspense } from "react";
import GlobalModals from "../shared/ui/modals/GlobalModals";
import { getDynamicThemeVariables } from "../shared/config/themeUtils";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const themeVariables = await getDynamicThemeVariables();

  return (
    <html lang="pl" className={`scroll-smooth ${manrope.variable}`} data-scroll-behavior="smooth" style={themeVariables}>
      <body>
        <Providers>
          {children}
          <GlobalModals />
        </Providers>
      </body>
    </html>
  );
}
