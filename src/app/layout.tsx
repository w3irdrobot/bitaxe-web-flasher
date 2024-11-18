import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClientThemeWrapper } from '@/components/ClientThemeWrapper'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bitaxe Web Flasher',
  description: 'Flash your Bitaxe directly from the web',
  icons: {
    icon: 'https://github.com/bitaxeorg/bitaxe-web-flasher/public/pictures/logo.png'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientThemeWrapper>
          <div className="min-h-screen bg-background text-foreground">
            <main className="w-full p-4">
              {children}
            </main>
          </div>
        </ClientThemeWrapper>
      </body>
    </html>
  )
}