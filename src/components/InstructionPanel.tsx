import { X } from 'lucide-react'

interface InstructionPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InstructionPanel({ isOpen, onClose }: InstructionPanelProps) {
  return (
    <div className={`fixed top-[5vh] right-0 max-h-[80vh] w-64 bg-white dark:bg-gray-800 p-4 shadow-lg transform ${isOpen ? 'translate-x-20px' : 'translate-x-full'} transition-transform duration-300 ease-in-out rounded-lg`}>
      <button
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </button>
      <h2 className="text-xl font-bold mb-4">How to Use</h2>
      <ol className="list-decimal list-inside space-y-2 text-sm">
        <li>Connect your Bitaxe device to your computer.</li>
        <li>Click "Connect Device" and select your device from the popup.</li>
        <li>Select your device model from the dropdown.</li>
        <li>Choose the appropriate board version.</li>
        <li>Click "Start Flashing" to begin the process.</li>
        <li>Wait for the flashing process to complete.</li>
        <li>Disconnect and reset your Bitaxe device.</li>
      </ol>
      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        For more detailed instructions, please refer to our <a className='text-blue-500' href="https://www.osmu.wiki" >documentation</a>.
      </p>
    </div>
  )
}