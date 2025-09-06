import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Crypto Learning Platform',
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
        <div className="flex flex-col min-h-screen">
          <header className="bg-gradient-to-r from-white to-yellow-50 shadow-lg border-b border-crypto-accent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold text-crypto-primary bg-gradient-to-r from-crypto-primary to-crypto-secondary bg-clip-text text-transparent">
                    Crypto Learning Platform
                  </h1>
                </div>
                <nav className="flex space-x-8">
                  <a href="/" className="text-gray-700 hover:text-crypto-primary transition-colors">
                    Home
                  </a>
                  <a href="/admin" className="text-gray-700 hover:text-crypto-primary transition-colors">
                    Admin
                  </a>
                </nav>
              </div>
            </div>
          </header>
          
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
      </body>
    </html>
  )
}
