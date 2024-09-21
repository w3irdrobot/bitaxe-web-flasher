import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type DeviceSelectorProps = {
  onValueChange: (value: string) => void
}

export default function DeviceSelector({ onValueChange }: DeviceSelectorProps) {
  return (
    <Select onValueChange={onValueChange}>
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