import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
    cytogenetic: "",
  });
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState("");

  const riskMap: { [key: number]: number } = {
    0: 1.3, 2: 5.4, 3: 2.6, 4: 10.3, 5: 19.2, 6: 23.4,
    7: 27.6, 8: 35, 9: 48.6, 10: 41.9, 11: 50, 12: 61.9,
    13: 50, 14: 78.6, 15: 83.3,
  };

  const calculateRisk = () => {
    const { mProtein, kappaLevel, lambdaLevel, boneMarrowPlasma, cytogenetic } = formData;
    
    if (!mProtein || !kappaLevel || !lambdaLevel || !boneMarrowPlasma || !cytogenetic) {
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

    // FLC Score
    const ratio = Math.max(kappa, lambda) / Math.min(kappa, lambda);
    let flcScore = 0;
    if (ratio > 40) flcScore = 5;
    else if (ratio > 25) flcScore = 3;
    else if (ratio > 10) flcScore = 2;

    // M-Protein Score
    let mProteinScore = 0;
    if (mProteinVal > 3) mProteinScore = 4;
    else if (mProteinVal >= 1.5) mProteinScore = 3;

    // Bone Marrow Score
    let bmiScore = 0;
    if (boneMarrow > 40) bmiScore = 6;
    else if (boneMarrow > 30) bmiScore = 5;
    else if (boneMarrow > 20) bmiScore = 3;
    else if (boneMarrow > 15) bmiScore = 2;

    // Cytogenetic Score
    const cytoScore = cytogenetic === "yes" ? 2 : 0;

    const totalScore = flcScore + mProteinScore + bmiScore + cytoScore;
    const risk = totalScore > 15 ? 88.9 : (riskMap[totalScore] || 88.9);

    setResult(`The 2-year progression risk from initial diagnosis is ${risk}%.`);
    setShowResult(true);
  };

  return (
    <CalculatorLayout
      title="Smoldering Multiple Myeloma Calculator"
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

        {/* Cytogenetic */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Label className="label-field mb-0">
              High-Risk Cytogenetic Abnormalities
            </Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg-popover text-popover-foreground">
                <p>Refers to presence of t(4;14), t(14;16), +1q, and del13q/monosomy 13 by FISH</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <RadioGroup
            value={formData.cytogenetic}
            onValueChange={(value) => setFormData({ ...formData, cytogenetic: value })}
            className="flex gap-4"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="yes" id="cyto-yes" />
              <Label htmlFor="cyto-yes" className="cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="no" id="cyto-no" />
              <Label htmlFor="cyto-no" className="cursor-pointer">No</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="unsure" id="cyto-unsure" />
              <Label htmlFor="cyto-unsure" className="cursor-pointer">Unsure</Label>
            </div>
          </RadioGroup>
        </div>

        <Button onClick={calculateRisk} className="w-full btn-primary py-6 text-base">
          Calculate Risk
        </Button>
      </div>

      <ResultModal
        open={showResult}
        onClose={() => setShowResult(false)}
        title="2-Year Progression Risk"
        result={result}
        additionalInfo="This information is for patients not receiving treatment. Results based on IMWG 2020 risk stratification model."
      />
    </CalculatorLayout>
  );
};

export default SmolderingMyeloma;
