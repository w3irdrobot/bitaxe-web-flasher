import Link from 'next/link'
import { Cpu } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

interface HeaderProps {
  onOpenPanel: () => void;
}

export default function Header({ onOpenPanel }: HeaderProps) {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center justify-between">
      {/* Left section */}
      <Link className="flex items-center justify-center" href="#">
        <Cpu className="h-6 w-6 mr-2" />
        <span className="font-bold">Bitaxe Web Flasher</span>
      </Link>

      {/* Middle section */}
      <div className="flex items-center">
        <a 
          href="https://discord.gg/3E8ca2dkcC"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-90 transition-opacity"
        >
          <img 
            src="https://dcbadge.limes.pink/api/server/3E8ca2dkcC" 
            alt="Discord Server" 
            className="h-6"
          />
        </a>
      </div>

      {/* Right section */}
      <nav className="flex items-center gap-4 sm:gap-6">
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
          Features
        </Link>
        <button
          className="text-sm font-medium hover:underline underline-offset-4"
          onClick={onOpenPanel}
        >
          Get Started
        </button>
        <ThemeToggle />
      </nav>
    </header>
  )
}