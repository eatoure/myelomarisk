import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import CalculatorLayout from "@/components/CalculatorLayout";
import ResultModal from "@/components/ResultModal";
import { useToast } from "@/hooks/use-toast";
import { authors } from "@/data/developers";

const MultipleMyeloma = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    ighTranslocation: "",
    oneQGain: "",
    chr17Abnormality: "",
    elevatedLdh: "",
    b2Microglobulin: "",
  });
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState("");

  const calculateRisk = () => {
    const { ighTranslocation, oneQGain, chr17Abnormality, elevatedLdh, b2Microglobulin } = formData;
    
    if (!ighTranslocation || !oneQGain || !chr17Abnormality || !elevatedLdh || !b2Microglobulin) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const b2Value = parseFloat(b2Microglobulin);
    
    let score = 0;
    if (ighTranslocation === "yes") score++;
    if (oneQGain === "yes") score++;
    if (chr17Abnormality === "yes") score++;
    if (elevatedLdh === "yes") score++;
    if (b2Value > 5.5) score++;

    let pfs: string;
    let os: string;

    if (score === 0) {
      pfs = "63.1 months";
      os = "11 years";
    } else if (score === 1) {
      pfs = "44 months";
      os = "7 years";
    } else {
      pfs = "28.6 months";
      os = "4.5 years";
    }

    setResult(`Median Progression-Free Survival with Frontline Therapy is Expected to Exceed: ${pfs}.\n\nMedian Overall Survival from Time of Diagnosis is Expected to Exceed: ${os}.`);
    setShowResult(true);
  };

  return (
    <CalculatorLayout
      title="Multiple Myeloma Calculator"
      description="Estimate progression-free survival (PFS) and overall survival (OS) for newly diagnosed multiple myeloma patients using a simple additive staging system."
      reference={{
        text: "Abdallah, N.H., Binder, M., Rajkumar, S.V. et al. A simple additive staging system for newly diagnosed multiple myeloma. Blood Cancer J. 12, 21 (2022).",
        url: "https://doi.org/10.1038/s41408-022-00611-x",
      }}
      authors={authors}
    >
      <div className="space-y-6">
        {/* IGH Translocation */}
        <div>
          <Label className="label-field">
            High-risk IGH Translocation (t4;14, t14;16, or t14;20)?
          </Label>
          <RadioGroup
            value={formData.ighTranslocation}
            onValueChange={(value) => setFormData({ ...formData, ighTranslocation: value })}
            className="flex gap-6 mt-2"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="yes" id="igh-yes" />
              <Label htmlFor="igh-yes" className="cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="no" id="igh-no" />
              <Label htmlFor="igh-no" className="cursor-pointer">No</Label>
            </div>
          </RadioGroup>
        </div>

        {/* 1q Gain */}
        <div>
          <Label className="label-field">
            1q Gain/Amplification?
          </Label>
          <RadioGroup
            value={formData.oneQGain}
            onValueChange={(value) => setFormData({ ...formData, oneQGain: value })}
            className="flex gap-6 mt-2"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="yes" id="1q-yes" />
              <Label htmlFor="1q-yes" className="cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="no" id="1q-no" />
              <Label htmlFor="1q-no" className="cursor-pointer">No</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Chromosome 17 */}
        <div>
          <Label className="label-field">
            Chromosome 17 Abnormality?
          </Label>
          <RadioGroup
            value={formData.chr17Abnormality}
            onValueChange={(value) => setFormData({ ...formData, chr17Abnormality: value })}
            className="flex gap-6 mt-2"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="yes" id="chr17-yes" />
              <Label htmlFor="chr17-yes" className="cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="no" id="chr17-no" />
              <Label htmlFor="chr17-no" className="cursor-pointer">No</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Elevated LDH */}
        <div>
          <Label className="label-field">
            Elevated LDH?
          </Label>
          <RadioGroup
            value={formData.elevatedLdh}
            onValueChange={(value) => setFormData({ ...formData, elevatedLdh: value })}
            className="flex gap-6 mt-2"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="yes" id="ldh-yes" />
              <Label htmlFor="ldh-yes" className="cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="no" id="ldh-no" />
              <Label htmlFor="ldh-no" className="cursor-pointer">No</Label>
            </div>
          </RadioGroup>
        </div>

        {/* β-2 Microglobulin */}
        <div>
          <Label htmlFor="b2Microglobulin" className="label-field">
            Serum β-2 Microglobulin (mg/L)
          </Label>
          <Input
            id="b2Microglobulin"
            type="number"
            step="0.1"
            placeholder="e.g., 5.5"
            className="input-field"
            value={formData.b2Microglobulin}
            onChange={(e) => setFormData({ ...formData, b2Microglobulin: e.target.value })}
          />
        </div>

        <Button onClick={calculateRisk} className="w-full btn-primary py-6 text-base">
          Calculate Prognosis
        </Button>
      </div>

      <ResultModal
        open={showResult}
        onClose={() => setShowResult(false)}
        title="Survival Estimates"
        result={result}
        additionalInfo="Estimates are for newly diagnosed patients. 'Median' means 50% of patients have similar or better outcomes. Based on data until 2022; recent advances may improve these estimates."
      />
    </CalculatorLayout>
  );
};

export default MultipleMyeloma;
