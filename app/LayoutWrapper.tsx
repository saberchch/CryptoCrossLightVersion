'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

const SiteHeader = dynamic(() => import('../components/SiteHeader'), { ssr: false });

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideFooter = pathname.startsWith('/dashboard');

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#0d0f1a] dark group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <SiteHeader />
        <main className="flex flex-1 flex-col">{children}</main>

        {!hideFooter && (
          <footer className="footer">
            <div className="footer-content">
              <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
                <div className="footer-links">
                  <a className="footer-link" href="#">
                    About
                  </a>
                  <a className="footer-link" href="#">
                    Contact
                  </a>
                  <a className="footer-link" href="#">
                    Terms of Service
                  </a>
                  <a className="footer-link" href="#">
                    Privacy Policy
                  </a>
                </div>
                <div className="footer-social">{/* Social icons */}</div>
              </div>
              <div className="footer-bottom">
                <p className="footer-copyright">© 2024 CryptoCross. All rights reserved.</p>
              </div>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}
