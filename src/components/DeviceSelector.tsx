import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type DeviceSelectorProps = {
  onValueChange: (value: string) => void
  disabled?: boolean
}

export default function DeviceSelector({ onValueChange, disabled }: DeviceSelectorProps) {
  return (
    <Select onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder="Select your device model" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="max">Max</SelectItem>
        <SelectItem value="ultra">Ultra</SelectItem>
        <SelectItem value="supra">Supra</SelectItem>
        <SelectItem value="gamma">Gamma</SelectItem>
        <SelectItem value="ultrahex">UltraHex</SelectItem>
        <SelectItem value="suprahex">SupraHex</SelectItem>
      </SelectContent>
    </Select>
  )
}
