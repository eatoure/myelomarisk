import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export type YesNo = "" | "yes" | "no";

interface YesNoFieldProps {
  id: string;
  label: string;
  hint?: string;
  value: YesNo;
  onChange: (value: YesNo) => void;
}

const YesNoField = ({ id, label, hint, value, onChange }: YesNoFieldProps) => (
  <div>
    <Label className="label-field">{label}</Label>
    {hint && <p className="text-xs text-muted-foreground -mt-1 mb-2">{hint}</p>}
    <RadioGroup
      value={value}
      onValueChange={(v) => onChange(v as YesNo)}
      className="flex gap-6 mt-2"
    >
      <div className="flex items-center gap-2">
        <RadioGroupItem value="yes" id={`${id}-yes`} />
        <Label htmlFor={`${id}-yes`} className="cursor-pointer">Yes</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="no" id={`${id}-no`} />
        <Label htmlFor={`${id}-no`} className="cursor-pointer">No</Label>
      </div>
    </RadioGroup>
  </div>
);

export default YesNoField;
