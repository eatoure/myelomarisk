import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CalculatorLayout from "@/components/CalculatorLayout";
import ResultModal from "@/components/ResultModal";
import { useToast } from "@/hooks/use-toast";
import { authors } from "@/data/developers";

const Frailty = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    ageGroup: "",
    cci: "",
    ecog: "",
  });
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState("");

  const calculateRisk = () => {
    const { ageGroup, cci, ecog } = formData;
    
    if (!ageGroup || !cci || !ecog) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Age score
    let ageScore = 0;
    if (ageGroup === "76-80") ageScore = 1;
    else if (ageGroup === ">80") ageScore = 2;

    // CCI score
    const cciScore = cci === ">1" ? 1 : 0;

    // ECOG score
    let ecogScore = 0;
    if (ecog === "1") ecogScore = 1;
    else if (ecog === ">=2") ecogScore = 2;

    const totalScore = ageScore + cciScore + ecogScore;
    const classification = totalScore <= 1 ? "Non-frail" : "Frail";

    setResult(`Based on the provided information, the patient is classified as: ${classification}.`);
    setShowResult(true);
  };

  return (
    <CalculatorLayout
      title="Frailty Classification Calculator"
      description="Assess frailty status using a simplified scale to predict outcomes in transplant-ineligible patients with newly diagnosed multiple myeloma."
      reference={{
        text: "Facon, T., Dimopoulos, M.A., Meuleman, N. et al. A simplified frailty scale predicts outcomes in transplant-ineligible patients with newly diagnosed multiple myeloma treated in the FIRST (MM-020) trial. Leukemia 34, 224–233 (2020).",
        url: "https://doi.org/10.1038/s41375-019-0539-0",
      }}
      authors={authors}
    >
      <div className="space-y-6">
        {/* Age Group */}
        <div>
          <Label className="label-field">Age Group</Label>
          <Select
            value={formData.ageGroup}
            onValueChange={(value) => setFormData({ ...formData, ageGroup: value })}
          >
            <SelectTrigger className="input-field">
              <SelectValue placeholder="Select age group" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="<=75">≤75 years</SelectItem>
              <SelectItem value="76-80">76-80 years</SelectItem>
              <SelectItem value=">80">&gt;80 years</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* CCI */}
        <div>
          <Label className="label-field">Charlson Comorbidity Index (CCI)</Label>
          <Select
            value={formData.cci}
            onValueChange={(value) => setFormData({ ...formData, cci: value })}
          >
            <SelectTrigger className="input-field">
              <SelectValue placeholder="Select CCI" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="<=1">≤1</SelectItem>
              <SelectItem value=">1">&gt;1</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ECOG */}
        <div>
          <Label className="label-field">ECOG Performance Status</Label>
          <Select
            value={formData.ecog}
            onValueChange={(value) => setFormData({ ...formData, ecog: value })}
          >
            <SelectTrigger className="input-field">
              <SelectValue placeholder="Select ECOG status" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="0">0 - Fully active</SelectItem>
              <SelectItem value="1">1 - Restricted activity</SelectItem>
              <SelectItem value=">=2">≥2 - Limited self-care</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={calculateRisk} className="w-full btn-primary py-6 text-base">
          Assess Frailty
        </Button>
      </div>

      <ResultModal
        open={showResult}
        onClose={() => setShowResult(false)}
        title="Frailty Classification"
        result={result}
        additionalInfo="This simplified frailty scale helps predict outcomes in transplant-ineligible patients with newly diagnosed multiple myeloma."
      />
    </CalculatorLayout>
  );
};

export default Frailty;
