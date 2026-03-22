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
    normalRenalFunction: "",
    onePDeletion: "",
    onePDeletionType: "",
    b2MicroglobulinStatus: "",
    b2Microglobulin: "",
  });
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState("");

  const calculateRisk = () => {
    const {
      ighTranslocation,
      oneQGain,
      chr17Abnormality,
      normalRenalFunction,
      onePDeletion,
      onePDeletionType,
      b2MicroglobulinStatus,
      b2Microglobulin,
    } = formData;
    
    if (
      !ighTranslocation ||
      !oneQGain ||
      !chr17Abnormality ||
      !normalRenalFunction ||
      !onePDeletion ||
      !b2MicroglobulinStatus ||
      (b2MicroglobulinStatus === "known" && !b2Microglobulin) ||
      (onePDeletion === "yes" && !onePDeletionType)
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    let b2Value: number | null = null;

    if (b2MicroglobulinStatus === "known") {
      b2Value = parseFloat(b2Microglobulin);
    }

    if (b2MicroglobulinStatus === "known" && (b2Value === null || Number.isNaN(b2Value))) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid serum β-2 microglobulin value.",
        variant: "destructive",
      });
      return;
    }

    const cytogeneticRiskCount = [
      ighTranslocation,
      oneQGain,
      chr17Abnormality,
      onePDeletion,
    ].filter((value) => value === "yes").length;

    const standardRiskException =
      chr17Abnormality === "yes" &&
      onePDeletion === "yes" &&
      onePDeletionType === "biallelic";

    // Normal renal function only changes risk classification when serum beta-2 is known and elevated.
    const hasKnownHighBeta2 = b2Value !== null && b2Value >= 5.5;
    const renalBetaHighRisk = hasKnownHighBeta2 && normalRenalFunction === "yes";

    const isHighRisk = renalBetaHighRisk || (cytogeneticRiskCount >= 2 && !standardRiskException);

    setResult(
      isHighRisk
        ? "Risk Stratification: **High Risk**\n\nThe 5 year Progression-Free Survival with Frontline Therapy is Expected to Exceed 45-50%.\n\nThe 5 year Overall Survival rate from Time of Diagnosis is Expected to Exceed 65-70%."
        : "Risk Stratification: **Standard Risk**\n\nThe 5 year Progression-Free Survival with Frontline Therapy is Expected to Exceed 60-70%.\n\nThe 5 year Overall Survival rate from Time of Diagnosis is Expected to Exceed 70-80%."
    );
    setShowResult(true);
  };

  return (
    <CalculatorLayout
      title="Multiple Myeloma Risk Stratification (IMS / IMWG)"
      description="Risk Stratification (determine if high risk myeloma present) and Estimate progression-free survival (PFS) and overall survival (OS) for newly diagnosed multiple myeloma patients"
      reference={[
        {
          text: "Facon T, Dimopoulos MA, Leleu XP, et al. Isatuximab, Bortezomib, Lenalidomide, and Dexamethasone for Multiple Myeloma. N Engl J Med. 2024;391(17):1597-1609.",
          url: "https://doi.org/10.1056/NEJMoa2400712",
        },
        {
          text: "Usmani SZ, Facon T, Hungria V, et al. Daratumumab plus bortezomib, lenalidomide and dexamethasone for transplant-ineligible or transplant-deferred newly diagnosed multiple myeloma: the randomized phase 3 CEPHEUS trial. Nat Med. 2025;31:1195-1202.",
          url: "https://doi.org/10.1038/s41591-024-03485-7",
        },
        {
          text: "Maura F, Bergsagel PL, Ziccheddu B, et al. Genomics Define Malignant Transformation in Myeloma Precursor Conditions. J Clin Oncol. 2025 Oct 8:JCO2501733.",
          url: "https://doi.org/10.1200/JCO-25-01733",
        },
      ]}
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
            17p Deletion and/or p53 Mutation?
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

        {/* 1p Deletion */}
        <div>
          <Label className="label-field">
            1p Deletion?
          </Label>
          <RadioGroup
            value={formData.onePDeletion}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                onePDeletion: value,
                onePDeletionType: value === "yes" ? formData.onePDeletionType : "",
              })
            }
            className="flex gap-6 mt-2"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="yes" id="1p-yes" />
              <Label htmlFor="1p-yes" className="cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="no" id="1p-no" />
              <Label htmlFor="1p-no" className="cursor-pointer">No</Label>
            </div>
          </RadioGroup>

          {formData.onePDeletion === "yes" && (
            <div className="mt-4">
              <Label className="label-field">
                1p Deletion Type
              </Label>
              <RadioGroup
                value={formData.onePDeletionType}
                onValueChange={(value) => setFormData({ ...formData, onePDeletionType: value })}
                className="flex flex-col gap-3 mt-2"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="monoallelic" id="1p-monoallelic" />
                  <Label htmlFor="1p-monoallelic" className="cursor-pointer">Monoallelic</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="biallelic" id="1p-biallelic" />
                  <Label htmlFor="1p-biallelic" className="cursor-pointer">Biallelic</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="not-sure" id="1p-not-sure" />
                  <Label htmlFor="1p-not-sure" className="cursor-pointer">Not Sure</Label>
                </div>
              </RadioGroup>
            </div>
          )}
        </div>

        {/* Normal Renal Function */}
        <div>
          <Label className="label-field">
            Normal Renal Function?
          </Label>
          <RadioGroup
            value={formData.normalRenalFunction}
            onValueChange={(value) => setFormData({ ...formData, normalRenalFunction: value })}
            className="flex gap-6 mt-2"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="yes" id="renal-yes" />
              <Label htmlFor="renal-yes" className="cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="no" id="renal-no" />
              <Label htmlFor="renal-no" className="cursor-pointer">No</Label>
            </div>
          </RadioGroup>
          <p className="mt-2 text-sm text-muted-foreground">
            This answer only affects risk classification when serum β-2 microglobulin is known and at least 5.5 mg/L.
          </p>
        </div>

        {/* β-2 Microglobulin */}
        <div>
          <Label className="label-field">
            Serum β-2 Microglobulin
          </Label>
          <RadioGroup
            value={formData.b2MicroglobulinStatus}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                b2MicroglobulinStatus: value,
                b2Microglobulin: value === "known" ? formData.b2Microglobulin : "",
              })
            }
            className="flex gap-6 mt-2"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="known" id="b2-known" />
              <Label htmlFor="b2-known" className="cursor-pointer">Known</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="unknown" id="b2-unknown" />
              <Label htmlFor="b2-unknown" className="cursor-pointer">Unknown</Label>
            </div>
          </RadioGroup>

          {formData.b2MicroglobulinStatus === "known" && (
            <Input
              id="b2Microglobulin"
              type="number"
              step="0.1"
              placeholder="e.g., 5.5"
              className="input-field mt-4"
              value={formData.b2Microglobulin}
              onChange={(e) => setFormData({ ...formData, b2Microglobulin: e.target.value })}
            />
          )}
        </div>

        <Button onClick={calculateRisk} className="w-full btn-primary py-6 text-base">
          Risk Stratify and Calculate Prognosis
        </Button>
      </div>

      <ResultModal
        open={showResult}
        onClose={() => setShowResult(false)}
        title="Risk Stratification and Survival Estimates"
        result={result}
        additionalInfo="Estimates are for newly diagnosed patients. Based on data until 2025; recent advances may improve these estimates."
      />
    </CalculatorLayout>
  );
};

export default MultipleMyeloma;
