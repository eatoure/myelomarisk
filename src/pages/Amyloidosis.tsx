import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CalculatorLayout from "@/components/CalculatorLayout";
import ResultModal from "@/components/ResultModal";
import { useToast } from "@/hooks/use-toast";
import { authors } from "@/data/developers";

const Amyloidosis = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    troponin: "",
    lambdaLevel: "",
    kappaLevel: "",
    ntProBnp: "",
  });
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState("");

  const calculateRisk = () => {
    const { troponin, lambdaLevel, kappaLevel, ntProBnp } = formData;
    
    if (!troponin || !lambdaLevel || !kappaLevel || !ntProBnp) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const troponinVal = parseFloat(troponin);
    const lambda = parseFloat(lambdaLevel);
    const kappa = parseFloat(kappaLevel);
    const ntProBnpVal = parseFloat(ntProBnp);
    
    let score = 0;
    
    // cTnT ≥ 0.025
    if (troponinVal >= 0.025) score++;
    
    // NT-proBNP ≥ 1800
    if (ntProBnpVal >= 1800) score++;
    
    // |Lambda - Kappa| ≥ 180
    if (Math.abs(lambda - kappa) >= 180) score++;

    const stageMap: { [key: number]: string } = {
      0: "Stage 1",
      1: "Stage 2",
      2: "Stage 3",
      3: "Stage 4",
    };

    const stage = stageMap[score];

    setResult(`The risk factors provided correspond with ${stage} of AL amyloidosis.`);
    setShowResult(true);
  };

  return (
    <CalculatorLayout
      title="Amyloidosis Staging Calculator"
      description="Stage AL amyloidosis using the Mayo 2012 biomarker model for systemic amyloidosis risk stratification."
      reference={{
        text: "Muchtar E, Kumar SK, Gertz MA, et al. Staging systems for risk stratification of systemic amyloidosis in the era of high-sensitivity troponin T assay. Blood. 2019 Feb 14;133(7):763-766.",
        url: "https://pubmed.ncbi.nlm.nih.gov/30545829/",
      }}
      authors={authors}
    >
      <div className="space-y-6">
        {/* Troponin */}
        <div>
          <Label htmlFor="troponin" className="label-field">
            Cardiac Troponin Level (cTnT) in µg/L
          </Label>
          <Input
            id="troponin"
            type="number"
            step="0.001"
            placeholder="e.g., 0.025"
            className="input-field"
            value={formData.troponin}
            onChange={(e) => setFormData({ ...formData, troponin: e.target.value })}
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
            placeholder="e.g., 200"
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

        {/* NT-proBNP */}
        <div>
          <Label htmlFor="ntProBnp" className="label-field">
            N-terminal pro-Brain Natriuretic Peptide (NT-proBNP) in ng/L
          </Label>
          <Input
            id="ntProBnp"
            type="number"
            step="1"
            placeholder="e.g., 1800"
            className="input-field"
            value={formData.ntProBnp}
            onChange={(e) => setFormData({ ...formData, ntProBnp: e.target.value })}
          />
        </div>

        <Button onClick={calculateRisk} className="w-full btn-primary py-6 text-base">
          Calculate Stage
        </Button>
      </div>

      <ResultModal
        open={showResult}
        onClose={() => setShowResult(false)}
        title="AL Amyloidosis Stage"
        result={result}
        additionalInfo="This data conforms to the Mayo 2012 Model for biomarker models used in systemic amyloidosis."
      />
    </CalculatorLayout>
  );
};

export default Amyloidosis;
