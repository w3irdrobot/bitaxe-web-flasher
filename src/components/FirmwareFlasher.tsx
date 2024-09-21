import { useState } from 'react';
import { Button } from '@/components/ui/button';
import DeviceSelector from './DeviceSelector';
import { ESPLoader } from 'esptool-js';

export default function FirmwareFlasher() {
  const [selectedDevice, setSelectedDevice] = useState('');
  const [flashStatus, setFlashStatus] = useState('');

  const handleFlash = async () => {
    if (!selectedDevice) {
      setFlashStatus('Please select a device first');
      return;
    }

    if (selectedDevice !== 'ultra') {
      setFlashStatus('Only Ultra firmware is currently supported');
      return;
    }

    setFlashStatus('Preparing to flash...');
    
    try {
      const esploader = new ESPLoader({ 
        baudrate: 115200,
        // Add other necessary options here
      });

      setFlashStatus('Connecting to device...');
      await esploader.connect();

      setFlashStatus('Loading firmware...');
      const firmwarePath = '/firmware/esp-miner-factory-205-v2.1.10.bin';
      const firmwareResponse = await fetch(firmwarePath);
      
      if (!firmwareResponse.ok) {
        throw new Error('Failed to load firmware file');
      }
      
      const firmwareArrayBuffer = await firmwareResponse.arrayBuffer();
      
      setFlashStatus('Flashing firmware...');
      await esploader.flashDataRaw(0x0, new Uint8Array(firmwareArrayBuffer));

      setFlashStatus('Flashing completed successfully!');
    } catch (error) {
      console.error('Flashing failed:', error);
      setFlashStatus(`Flashing failed: ${error.message}. Please try again.`);
    }
  };

  return (
    <div className="space-y-4">
      <DeviceSelector onValueChange={setSelectedDevice} />
      <Button onClick={handleFlash} disabled={!selectedDevice}>Flash Firmware</Button>
      {flashStatus && <p className="mt-2 text-sm font-medium">{flashStatus}</p>}
    </div>
  );
}