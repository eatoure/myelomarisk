import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import CalculatorLayout from "@/components/CalculatorLayout";
import ResultModal from "@/components/ResultModal";
import { useToast } from "@/hooks/use-toast";
import { authors } from "@/data/developers";

const Waldenstrom = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    age: "",
    albumin: "",
    elevatedLdh: false,
  });
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState("");

  const calculateRisk = () => {
    const { age, albumin, elevatedLdh } = formData;
    
    if (!age || !albumin) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const ageVal = parseFloat(age);
    const albuminVal = parseFloat(albumin);
    
    let score = 0;
    
    // Age score
    if (ageVal > 75) score += 2;
    else if (ageVal >= 66) score += 1;

    // Albumin < 3.5
    if (albuminVal < 3.5) score += 1;

    // Elevated LDH
    if (elevatedLdh) score += 2;

    let riskLevel: string;
    let survival: string;

    if (score === 0) {
      riskLevel = "**Low Risk**";
      survival = "93%";
    } else if (score === 1) {
      riskLevel = "**Low-Intermediate**";
      survival = "82%";
    } else if (score === 2) {
      riskLevel = "**Intermediate**";
      survival = "69%";
    } else {
      riskLevel = "**High Risk**";
      survival = "55%";
    }

    setResult(`Risk Classification: ${riskLevel}\n\n5-year Overall Survival (OS) Rate: ${survival}`);
    setShowResult(true);
  };

  return (
    <CalculatorLayout
      title="Waldenström Macroglobulinemia Calculator"
      description="Calculate risk stratification and 5-year survival for patients with Waldenström macroglobulinemia using a simplified model."
      reference={{
        text: "Zanwar, S., Le-Rademacher, J., Durot, E., et al. Simplified Risk Stratification Model for Patients With Waldenström Macroglobulinemia. Journal of Clinical Oncology (2024).",
        url: "https://doi.org/10.1200/jco.23.02066",
      }}
      authors={authors}
    >
      <div className="space-y-6">
        {/* Age */}
        <div>
          <Label htmlFor="age" className="label-field">
            Age (years)
          </Label>
          <Input
            id="age"
            type="number"
            step="1"
            placeholder="e.g., 65"
            className="input-field"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          />
        </div>

        {/* Albumin */}
        <div>
          <Label htmlFor="albumin" className="label-field">
            Serum Albumin Level (g/dL)
          </Label>
          <Input
            id="albumin"
            type="number"
            step="0.1"
            placeholder="e.g., 3.5"
            className="input-field"
            value={formData.albumin}
            onChange={(e) => setFormData({ ...formData, albumin: e.target.value })}
          />
        </div>

        {/* Elevated LDH */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
          <Label htmlFor="elevatedLdh" className="cursor-pointer">
            Is serum LDH above normal upper limit?
          </Label>
          <Switch
            id="elevatedLdh"
            checked={formData.elevatedLdh}
            onCheckedChange={(checked) => setFormData({ ...formData, elevatedLdh: checked })}
          />
        </div>

        <Button onClick={calculateRisk} className="w-full btn-primary py-6 text-base">
          Calculate Risk
        </Button>
      </div>

      <ResultModal
        open={showResult}
        onClose={() => setShowResult(false)}
        title="Risk Stratification"
        result={result}
        additionalInfo="Based on the simplified risk stratification model for patients with Waldenström macroglobulinemia."
      />
    </CalculatorLayout>
  );
};

export default Waldenstrom;
