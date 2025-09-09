import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '../components/AuthProvider'
import dynamic from 'next/dynamic'
const SiteHeader = dynamic(() => import('../components/SiteHeader'), { ssr: false })

export const metadata: Metadata = {
  title: 'CryptoCross',
  description: 'Learn cryptocurrency fundamentals through interactive quizzes and earn certificates',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <SiteHeader />
            <main className="flex-1">
              {children}
            </main>
            <footer className="bg-gradient-to-r from-yellow-50 to-white border-t border-crypto-accent mt-auto">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center text-gray-600">
                  <p>&copy; 2024 Crypto Learning Platform. Empowering crypto education worldwide.</p>
                </div>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}

// Header moved to client component
