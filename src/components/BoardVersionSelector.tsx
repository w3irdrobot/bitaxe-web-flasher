import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type BoardVersionSelectorProps = {
  deviceModel: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

const boardVersions: Record<string, string[]> = {
  max: ['102'],
  ultra: ['202', '204'], // add 203 and 205
  supra: ['401', '402', '403'],
  gamma: ['601'],
  //ultrahex: ['302', '303'],
  //suprahex: ['701']
  // Add other device models and their board versions here
};

export default function BoardVersionSelector({ deviceModel, onValueChange, disabled }: BoardVersionSelectorProps) {
  const versions = boardVersions[deviceModel] || [];

  return (
    <Select onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder="Select board version" />
      </SelectTrigger>
      <SelectContent>
        {versions.map((version) => (
          <SelectItem key={version} value={version}>
            {version}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}