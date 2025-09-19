import type { Metadata } from 'next';
import './styles/globals.css';
import { AuthProvider } from '../components/AuthProvider';
import LayoutWrapper from './LayoutWrapper';

export const metadata: Metadata = {
  title: 'CryptoCross - Gamified Web3 Education & Certification',
  description:
    'Master blockchain, NFTs, and DeFi through an engaging, gamified learning experience. Earn valuable certifications and step into the future of the internet.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?display=swap&family=Noto+Sans:wght@400;500;700;900&family=Space+Grotesk:wght@400;500;700"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
      </head>
      <body
        className="bg-[#0d0f1a] min-h-screen"
        style={{ fontFamily: '"Space Grotesk", "Noto Sans", sans-serif' }}
      >
        <AuthProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
