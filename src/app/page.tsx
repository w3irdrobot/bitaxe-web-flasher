'use client'

import Footer from '@/components/Footer'
import LandingHero from '@/components/LandingHero'
import Features from '@/components/Features'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <LandingHero />
        <Features />
      </main>
      <Footer />
    </div>
  )
}