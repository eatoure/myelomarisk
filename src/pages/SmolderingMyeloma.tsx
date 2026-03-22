import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CalculatorLayout from "@/components/CalculatorLayout";
import ResultModal from "@/components/ResultModal";
import { useToast } from "@/hooks/use-toast";
import { authors } from "@/data/developers";

const SmolderingMyeloma = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    mProtein: "",
    kappaLevel: "",
    lambdaLevel: "",
    boneMarrowPlasma: "",
  });
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState("");

  const calculateRisk = () => {
    const { mProtein, kappaLevel, lambdaLevel, boneMarrowPlasma } = formData;
    
    if (!mProtein || !kappaLevel || !lambdaLevel || !boneMarrowPlasma) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const mProteinVal = parseFloat(mProtein);
    const kappa = parseFloat(kappaLevel);
    const lambda = parseFloat(lambdaLevel);
    const boneMarrow = parseFloat(boneMarrowPlasma);
    const values = [mProteinVal, kappa, lambda, boneMarrow];

    if (values.some((value) => Number.isNaN(value))) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid numeric values in all fields.",
        variant: "destructive",
      });
      return;
    }

    if (kappa <= 0 || lambda <= 0) {
      toast({
        title: "Invalid Light Chain Values",
        description: "Free serum kappa and lambda levels must be greater than zero.",
        variant: "destructive",
      });
      return;
    }

    const ratio = Math.max(kappa, lambda) / Math.min(kappa, lambda);
    const thresholdCount = [
      mProteinVal > 2,
      ratio > 20,
      boneMarrow > 20,
    ].filter(Boolean).length;

    let riskLevel: string;
    let progressionRisk: string;

    if (thresholdCount >= 2) {
      riskLevel = "high-risk";
      progressionRisk = "61.9%";
    } else if (thresholdCount === 1) {
      riskLevel = "intermediate-risk";
      progressionRisk = "45.5%";
    } else {
      riskLevel = "low-risk";
      progressionRisk = "6%";
    }

    setResult(
      `Based on the information provided this patient has **${riskLevel.replace("-", " ").replace(/\b\w/g, (char) => char.toUpperCase())}** Smoldering Multiple Myeloma based on the IMWG 2020 risk stratification.

Using the IMWG scoring system, the 2-year progression risk from initial diagnosis is ${progressionRisk}.

This information is for patients not receiving treatment. Results based on IMWG 2020 risk stratification model.`
    );
    setShowResult(true);
  };

  return (
    <CalculatorLayout
      title="Smoldering Multiple Myeloma: IMWG 2020 Risk Stratification and IMWG Scoring System"
      description="Calculate the 2-year progression risk using the International Myeloma Working Group (IMWG) risk stratification model for smoldering multiple myeloma."
      reference={{
        text: "Mateos MV, Kumar S, Dimopoulos MA, et al. International Myeloma Working Group risk stratification model for smoldering multiple myeloma (SMM). Blood Cancer J. 2020;10(10):102.",
        url: "https://doi.org/10.1038/s41408-020-00366-3",
      }}
      authors={authors}
    >
      <div className="space-y-6">
        {/* M-Protein */}
        <div>
          <Label htmlFor="mProtein" className="label-field">
            M-Protein (g/dL)
          </Label>
          <Input
            id="mProtein"
            type="number"
            step="0.1"
            placeholder="e.g., 2.5"
            className="input-field"
            value={formData.mProtein}
            onChange={(e) => setFormData({ ...formData, mProtein: e.target.value })}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Enter in g/dL. If report is in g/L, convert (e.g., 25g/L = 2.5 g/dL)
          </p>
        </div>

        {/* Kappa Level */}
        <div>
          <Label htmlFor="kappaLevel" className="label-field">
            Free Serum Kappa Level (mg/L)
          </Label>
          <Input
            id="kappaLevel"
            type="number"
            step="0.1"
            placeholder="e.g., 50"
            className="input-field"
            value={formData.kappaLevel}
            onChange={(e) => setFormData({ ...formData, kappaLevel: e.target.value })}
          />
        </div>

        {/* Lambda Level */}
        <div>
          <Label htmlFor="lambdaLevel" className="label-field">
            Free Serum Lambda Level (mg/L)
          </Label>
          <Input
            id="lambdaLevel"
            type="number"
            step="0.1"
            placeholder="e.g., 10"
            className="input-field"
            value={formData.lambdaLevel}
            onChange={(e) => setFormData({ ...formData, lambdaLevel: e.target.value })}
          />
        </div>

        {/* Bone Marrow Plasma Cell % */}
        <div>
          <Label htmlFor="boneMarrowPlasma" className="label-field">
            Bone Marrow Plasma Cell (%)
          </Label>
          <Input
            id="boneMarrowPlasma"
            type="number"
            step="1"
            placeholder="e.g., 25"
            className="input-field"
            value={formData.boneMarrowPlasma}
            onChange={(e) => setFormData({ ...formData, boneMarrowPlasma: e.target.value })}
          />
        </div>

        <Button onClick={calculateRisk} className="w-full btn-primary py-6 text-base">
          Risk Stratify and Calculate Prognosis
        </Button>
      </div>

      <ResultModal
        open={showResult}
        onClose={() => setShowResult(false)}
        title="Risk Stratification and 2-Year Progression Risk"
        result={result}
      />
    </CalculatorLayout>
  );
};

export default SmolderingMyeloma;
