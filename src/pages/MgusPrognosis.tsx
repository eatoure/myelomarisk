import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import CalculatorLayout from "@/components/CalculatorLayout";
import ResultModal from "@/components/ResultModal";
import { useToast } from "@/hooks/use-toast";
import { authors } from "@/data/developers";

const MgusPrognosis = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    mProtein: "",
    lambdaLevel: "",
    kappaLevel: "",
    isIgG: "",
  });
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState("");

  const calculateRisk = () => {
    const { mProtein, lambdaLevel, kappaLevel, isIgG } = formData;
    
    if (!mProtein || !lambdaLevel || !kappaLevel || !isIgG) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const mProteinVal = parseFloat(mProtein);
    const lambda = parseFloat(lambdaLevel);
    const kappa = parseFloat(kappaLevel);
    
    let score = 0;
    
    // M-protein > 1.5 g/dL
    if (mProteinVal > 1.5) score++;
    
    // Not IgG subtype
    if (isIgG === "no") score++;
    
    // FLC ratio abnormal
    const ratio = lambda > kappa ? lambda / kappa : kappa / lambda;
    if (ratio < 0.26 || ratio > 1.65) score++;

    const riskMap: { [key: number]: number } = {
      0: 2,
      1: 10,
      2: 18,
      3: 27,
    };

    const risk = riskMap[score] || 27;

    setResult(`Absolute Risk of Progression: ${risk}%`);
    setShowResult(true);
  };

  return (
    <CalculatorLayout
      title="MGUS Prognosis Calculator"
      description="Assess the absolute risk of progression from MGUS (Monoclonal Gammopathy of Undetermined Significance) to myeloma or related disorder over a 20-year period."
      reference={{
        text: "Rajkumar SV, Kyle RA, Therneau TM, et al. Serum free light chain ratio is an independent risk factor for progression in monoclonal gammopathy of undetermined significance. Blood (2005) 106 (3): 812-817.",
        url: "https://doi.org/10.1182/blood-2005-03-1038",
      }}
      authors={authors}
    >
      <div className="space-y-6">
        {/* M-Protein */}
        <div>
          <Label htmlFor="mProtein" className="label-field">
            Serum M-Protein Level (g/dL)
          </Label>
          <Input
            id="mProtein"
            type="number"
            step="0.1"
            placeholder="e.g., 1.5"
            className="input-field"
            value={formData.mProtein}
            onChange={(e) => setFormData({ ...formData, mProtein: e.target.value })}
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
            placeholder="e.g., 15"
            className="input-field"
            value={formData.lambdaLevel}
            onChange={(e) => setFormData({ ...formData, lambdaLevel: e.target.value })}
          />
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
            placeholder="e.g., 20"
            className="input-field"
            value={formData.kappaLevel}
            onChange={(e) => setFormData({ ...formData, kappaLevel: e.target.value })}
          />
        </div>

        {/* IgG Subtype */}
        <div>
          <Label className="label-field">
            Is diagnosis associated with IgG subtype?
          </Label>
          <RadioGroup
            value={formData.isIgG}
            onValueChange={(value) => setFormData({ ...formData, isIgG: value })}
            className="flex gap-6 mt-2"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="yes" id="igg-yes" />
              <Label htmlFor="igg-yes" className="cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="no" id="igg-no" />
              <Label htmlFor="igg-no" className="cursor-pointer">No</Label>
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
        title="MGUS Progression Risk"
        result={result}
        additionalInfo="This is the likelihood of developing progression to myeloma or related disorder over a 20-year period from diagnosis after adjusting for competing causes of death."
      />
    </CalculatorLayout>
  );
};

export default MgusPrognosis;
