'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Cpu, Zap, Wifi, ArrowRight } from "lucide-react"
import Link from "next/link"
import { ESPLoader } from 'esptool-js'

// You would need to host these firmware files on your server
const firmwareUrls = {
  max: '/firmware/max.bin',
  ultra: '/firmware/esp-miner-205-v2.1.10.bin',
  supra: '/firmware/supra.bin',
  gamma: '/firmware/gamma.bin',
  ultrahex: '/firmware/ultrahex.bin',
  suprahex: '/firmware/suprahex.bin',
}

export default function LandingPage() {
  const [selectedDevice, setSelectedDevice] = useState("")
  const [isFlashing, setIsFlashing] = useState(false)
  const [flashProgress, setFlashProgress] = useState(0)
  const [statusMessage, setStatusMessage] = useState("")

  useEffect(() => {
    // Load esptool-js script
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/esptool-js@0.3.1/bundle.js'
    script.async = true
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handleStartFlashing = async () => {
    if (!selectedDevice) {
      alert("Please select a device model first")
      return
    }

    setIsFlashing(true)
    setStatusMessage("Connecting to device...")

    try {
      const esploader = new ESPLoader({
        updateProgress: (progress) => {
          setFlashProgress(progress * 100)
        },
        logMsg: (msg) => {
          setStatusMessage(msg)
        },
      })

      await esploader.connect()
      setStatusMessage("Connected. Preparing to flash...")

      const firmwareUrl = firmwareUrls[selectedDevice]
      const response = await fetch(firmwareUrl)
      const firmwareBuffer = await response.arrayBuffer()

      setStatusMessage("Flashing firmware...")
      await esploader.flashData(new Uint8Array(firmwareBuffer), 0x10000)

      setStatusMessage("Flashing complete!")
    } catch (error) {
      console.error("Flashing failed:", error)
      setStatusMessage(`Flashing failed: ${error.message}`)
    } finally {
      setIsFlashing(false)
      setFlashProgress(0)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <Cpu className="h-6 w-6 mr-2" />
          <span className="font-bold">ESP32 Web Flasher</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#get-started">
            Get Started
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Flash Your ESP32 Directly from the Web
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Select your device model and start flashing immediately. No setup required.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <Select onValueChange={setSelectedDevice} disabled={isFlashing}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your device model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="max">Max</SelectItem>
                    <SelectItem value="ultra">Ultra</SelectItem>
                    <SelectItem value="supra">Supra</SelectItem>
                    <SelectItem value="gamma">Gamma</SelectItem>
                    <SelectItem value="ultrahex">Ultrahex</SelectItem>
                    <SelectItem value="suprahex">Suprahex</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  className="w-full" 
                  onClick={handleStartFlashing}
                  disabled={!selectedDevice || isFlashing}
                >
                  {isFlashing ? 'Flashing...' : 'Start Flashing'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                {isFlashing && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{width: `${flashProgress}%`}}
                      ></div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">{statusMessage}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold text-center mb-8">Key Features</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <Zap className="h-12 w-12 mb-4 text-primary" />
                <h3 className="font-bold mb-2">Fast Flashing</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Flash your ESP32 in seconds, not minutes.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Wifi className="h-12 w-12 mb-4 text-primary" />
                <h3 className="font-bold mb-2">Web-Based</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">No need for special software. Use your web browser.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Cpu className="h-12 w-12 mb-4 text-primary" />
                <h3 className="font-bold mb-2">Multiple Boards</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Support for various ESP32 boards and modules.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© 2023 ESP32 Web Flasher. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}