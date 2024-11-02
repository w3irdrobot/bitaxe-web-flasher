'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Usb, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import DeviceSelector from './DeviceSelector'
import BoardVersionSelector from './BoardVersionSelector'
import { ESPLoader, LoaderOptions, Transport, FlashOptions } from 'esptool-js'
import Header from './Header'
import InstructionPanel from './InstructionPanel'

import { serial } from "web-serial-polyfill";


const firmwareUrls: Record<string, Record<string, string>> = {
  max: {
    '102': 'firmware/esp-miner-factory-102-v2.3.0.bin'
  },
  ultra: {
    '201': 'firmware/esp-miner-factory-201-v2.3.0.bin',
    '202': 'firmware/esp-miner-factory-202-v2.3.0.bin',
    '203': 'firmware/esp-miner-factory-203-v2.3.0.bin',
    '204': 'firmware/esp-miner-factory-204-v2.3.0.bin',
    '205': 'firmware/esp-miner-factory-205-v2.3.0.bin',
  },
  supra: {
    '401': 'firmware/esp-miner-factory-401-v2.3.0.bin',
    '402': 'firmware/esp-miner-factory-402-v2.3.0.bin',
  },
  gamma: {
    '601': 'firmware/esp-miner-factory-601-v2.3.0.bin',
  },
  ultrahex: {
    '302': 'firmware/esp-miner-factory-302-v2.1.0.bin',
    '303': 'firmware/esp-miner-factory-303-v2.1.0.bin',
  },
  // Add other device models and their firmware versions here
};

type DeviceModel = keyof typeof firmwareUrls;

export default function LandingHero() {
  const [selectedDevice, setSelectedDevice] = useState<DeviceModel | ''>('')
  const [selectedBoardVersion, setSelectedBoardVersion] = useState('')
  const [status, setStatus] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [isFlashing, setIsFlashing] = useState(false)
  const [esploader, setEsploader] = useState<ESPLoader | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [isChromiumBased, setIsChromiumBased] = useState(true)

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isChromium = /chrome|chromium|crios|edge/i.test(userAgent);
    setIsChromiumBased(isChromium);
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true)
    setStatus('Connecting to device...')

    try {
      const device = await navigator.serial.requestPort({})
      const transport = new Transport(device)
      
      const loader = new ESPLoader({
        transport,
        baudrate: 115200,
        romBaudrate: 115200,
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
      setStatus(`Connection failed: ${error instanceof Error ? error.message : String(error)}`)
      // setStatus(`Flashing failed: ${error instanceof Error ? error.message : String(error)}. Please try again.`)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleStartFlashing = async () => {
    if (!esploader) {
      setStatus('Please connect to a device first')
      return
    }

    if (!selectedDevice || !selectedBoardVersion) {
      setStatus('Please select both device model and board version')
      return
    }

    setIsFlashing(true)
    setStatus('Preparing to flash...')
    
    try {
      const firmwareUrl = firmwareUrls[selectedDevice]?.[selectedBoardVersion]
      if (!firmwareUrl) {
        throw new Error('No firmware available for the selected device and board version')
      }

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
          address: 0
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
          console.log('MD5 calculation not implemented')
          return ''
        },
      }
      
      await esploader.writeFlash(flashOptions)
      
      setStatus('Flashing completed. Restarting device...')
      await esploader.hardReset()
      
      setStatus('Flashing completed successfully! Device has been restarted.')
    } catch (error) {
      console.error('Flashing failed:', error)
      setStatus(`Flashing failed: ${error instanceof Error ? error.message : String(error)}. Please try again.`)

    } finally {
      setIsFlashing(false)
    }
  }

  if (!isChromiumBased) {
    return (
      <div className="container px-4 md:px-6 py-12 text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none mb-4">
          Browser Compatibility Error
        </h1>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
          This application requires a Chromium-based browser (such as Google Chrome, Microsoft Edge, or Brave) to function properly. Please switch to a compatible browser and try again.
        </p>
      </div>
    )
  }

  return (
    <>
      <Header onOpenPanel={() => setIsPanelOpen(true)} />
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Flash Your Bitaxe Directly from the Web
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Connect your device, select your model and board version, and start flashing immediately. No setup required.
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
              <DeviceSelector 
                onValueChange={(value) => {
                  setSelectedDevice(value as DeviceModel)
                  setSelectedBoardVersion('')
                }} 
                disabled={isConnecting || isFlashing || esploader === null} 
              />
              {selectedDevice && (
                <BoardVersionSelector 
                  deviceModel={selectedDevice}
                  onValueChange={setSelectedBoardVersion}
                  disabled={isConnecting || isFlashing }
                />
              )}
              <Button 
                className="w-full" 
                onClick={handleStartFlashing}
                disabled={!selectedDevice || !selectedBoardVersion || isConnecting || isFlashing || esploader === null}
              >
                {isFlashing ? 'Flashing...' : 'Start Flashing'}
                <Zap className="ml-2 h-4 w-4" />
              </Button>
              {status && <p className="mt-2 text-sm font-medium">{status}</p>}
            </div>
          </div>
        </div>
      </section>
      <InstructionPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
    </>
  )
}
