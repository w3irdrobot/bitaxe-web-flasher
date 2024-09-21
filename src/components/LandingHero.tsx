'use client'

import { useState } from 'react'
import { ArrowRight, Usb, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import DeviceSelector from './DeviceSelector'
import BoardVersionSelector from './BoardVersionSelector'
import { ESPLoader, Transport, FlashOptions } from 'esptool-js'

const firmwareUrls = {
  max: '/firmware/max.bin',
  ultra: '/firmware/esp-miner-factory-205-v2.1.10.bin',
  supra: '/firmware/supra.bin',
  gamma: '/firmware/gamma.bin',
  ultrahex: '/firmware/ultrahex.bin',
  suprahex: '/firmware/suprahex.bin',
} as const;

type DeviceModel = keyof typeof firmwareUrls;

export default function LandingHero() {
  const [selectedDevice, setSelectedDevice] = useState<DeviceModel | ''>('')
  const [selectedBoardVersion, setSelectedBoardVersion] = useState('')
  const [status, setStatus] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [isFlashing, setIsFlashing] = useState(false)
  const [esploader, setEsploader] = useState<ESPLoader | null>(null)

  const handleConnect = async () => {
    setIsConnecting(true)
    setStatus('Connecting to device...')

    try {
      const device = await navigator.serial.requestPort({})
      const transport = new Transport(device)
      
      const loader = new ESPLoader({
        transport,
        baudrate: 115200,
        terminal: {
          clean: () => {},
          writeLine: (data: string) => console.log(data),
          write: (data: string) => console.log(data),
        },
      })

      await loader.main()
      setEsploader(loader)
      setStatus('Connected successfully!')
    } catch (error) {
      console.error('Connection failed:', error)
      setStatus(`Connection failed: ${error.message}`)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleStartFlashing = async () => {
    if (!esploader) {
      setStatus('Please connect to a device first')
      return
    }

    if (!selectedDevice) {
      setStatus('Please select a device model first')
      return
    }

    setIsFlashing(true)
    setStatus('Preparing to flash...')
    
    try {
      const firmwareUrl = firmwareUrls[selectedDevice]
      const firmwareResponse = await fetch(firmwareUrl)
      
      if (!firmwareResponse.ok) {
        throw new Error('Failed to load firmware file')
      }
      
      const firmwareArrayBuffer = await firmwareResponse.arrayBuffer()
      const firmwareUint8Array = new Uint8Array(firmwareArrayBuffer)
      
      // Convert Uint8Array to binary string
      const firmwareBinaryString = Array.from(firmwareUint8Array, (byte) => String.fromCharCode(byte)).join('')
      
      setStatus('Flashing firmware...')

      const flashOptions: FlashOptions = {
        fileArray: [{
          data: firmwareBinaryString,
          address: 0 // Set address to 0 as requested
        }],
        flashSize: "keep",
        flashMode: "keep",
        flashFreq: "keep",
        eraseAll: false,
        compress: true,
        reportProgress: (fileIndex, written, total) => {
          setStatus(`Flashing: ${Math.round((written / total) * 100)}% complete`)
        },
        calculateMD5Hash: (image) => {
          // Implement MD5 calculation if needed
          console.log('MD5 calculation not implemented')
          return ''
        },
      }
      
      await esploader.writeFlash(flashOptions)

      setStatus('Flashing completed successfully!')
    } catch (error) {
      console.error('Flashing failed:', error)
      setStatus(`Flashing failed: ${error.message}. Please try again.`)
    } finally {
      setIsFlashing(false)
    }
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Flash Your Bitaxe Directly from the Web
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Connect your device, select your model, and start flashing immediately. No setup required.
            </p>
          </div>
          <div className="w-full max-w-sm space-y-2">
            <Button 
              className="w-full" 
              onClick={handleConnect}
              disabled={isConnecting || isFlashing || esploader !== null}
            >
              {isConnecting ? 'Connecting...' : 'Connect Device'}
              <Usb className="ml-2 h-4 w-4" />
            </Button>
            <DeviceSelector onValueChange={(value) => setSelectedDevice(value as DeviceModel)} disabled={isConnecting || isFlashing || esploader === null} />
            <Button 
              className="w-full" 
              onClick={handleStartFlashing}
              disabled={!selectedDevice || isConnecting || isFlashing || esploader === null}
            >
              {isFlashing ? 'Flashing...' : 'Start Flashing'}
              <Zap className="ml-2 h-4 w-4" />
            </Button>
            {status && <p className="mt-2 text-sm font-medium">{status}</p>}
          </div>
        </div>
      </div>
    </section>
  )
}