import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import CalculatorLayout from "@/components/CalculatorLayout";
import ResultModal from "@/components/ResultModal";
import { useToast } from "@/hooks/use-toast";
import { authors } from "@/data/developers";

const SmolderingMyelomaGenomic = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    imwgRiskStatus: "",
    genomicSequencingAvailable: "",
    rasMutation: "",
    mycAbnormality: "",
    apobecSignature: "",
    neoplasticCnvSignature: "",
  });
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState("");

  const genomicAuthors = [
    authors[0],
    authors[1],
    { name: "Dr. Francesco Maura, MD", role: "Myeloma Specialist, Memorial Sloan Kettering Cancer Center" },
    authors[2],
  ];

  const calculateRisk = () => {
    const {
      imwgRiskStatus,
      genomicSequencingAvailable,
      rasMutation,
      mycAbnormality,
      apobecSignature,
      neoplasticCnvSignature,
    } = formData;

    if (!imwgRiskStatus || !genomicSequencingAvailable) {
      toast({
        title: "Missing Information",
        description: "Please answer the IMWG 2020 risk and genomic sequencing questions.",
        variant: "destructive",
      });
      return;
    }

    if (imwgRiskStatus === "unknown") {
      toast({
        title: "IMWG 2020 Risk Needed",
        description: "Please use the Smoldering Multiple Myeloma calculator first, then return to this page.",
        variant: "destructive",
      });
      return;
    }

    if (genomicSequencingAvailable === "no") {
      toast({
        title: "Genomic Sequencing Required",
        description: "This calculator requires genomic sequencing data before risk can be calculated.",
        variant: "destructive",
      });
      return;
    }

    if (!rasMutation || !mycAbnormality || !apobecSignature || !neoplasticCnvSignature) {
      toast({
        title: "Missing Genomic Drivers",
        description: "Please answer all genomic driver questions.",
        variant: "destructive",
      });
      return;
    }

    const genomicDriverCount = [
      rasMutation,
      mycAbnormality,
      apobecSignature,
      neoplasticCnvSignature,
    ].filter((value) => value === "yes").length;

    let finalRisk: "High" | "Intermediate" | "Low";
    let progressionRisk: string;

    if (imwgRiskStatus === "high") {
      finalRisk = genomicDriverCount >= 2 ? "High" : "Intermediate";
    } else if (imwgRiskStatus === "intermediate") {
      finalRisk = genomicDriverCount >= 1 ? "Intermediate" : "Low";
    } else {
      finalRisk = genomicDriverCount >= 2 ? "Intermediate" : "Low";
    }

    if (finalRisk === "High") {
      progressionRisk = "60-70%";
    } else if (finalRisk === "Intermediate") {
      progressionRisk = "20-30%";
    } else {
      progressionRisk = "10%";
    }

    setResult(
      `Based on the information provided, the patient has Genomic IMWG **${finalRisk}** Risk Smoldering Multiple Myeloma.

The 2-year progression risk from initial diagnosis is ${progressionRisk}.

This information is for patients not receiving treatment.`
    );
    setShowResult(true);
  };

  return (
    <CalculatorLayout
      title="Smoldering Multiple Myeloma: Genomic IMWG Risk Stratification"
      description="Refine Smoldering Multiple Myeloma risk using IMWG 2020 risk status plus genomic sequencing drivers."
      reference={[
        {
          text: "Maura F, Bergsagel PL, Ziccheddu B, et al. Genomics Define Malignant Transformation in Myeloma Precursor Conditions. J Clin Oncol. 2025 Oct 8:JCO2501733.",
          url: "https://doi.org/10.1200/JCO-25-01733",
        },
        {
          text: "Mateos MV, Kumar S, Dimopoulos MA, et al. International Myeloma Working Group risk stratification model for smoldering multiple myeloma (SMM). Blood Cancer J. 2020;10(10):102.",
          url: "https://doi.org/10.1038/s41408-020-00366-3",
        },
      ]}
      detailSections={[
        {
          title: "Details of how to analyze genomics",
          content: (
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                <span className="font-medium text-foreground">MYC:</span> any events involving MYC, including focal gains (&lt; 5Mb).
              </p>
              <p>
                <span className="font-medium text-foreground">RAS:</span> nonsynonymous mutations involving KRAS, NRAS, BRAF, FGFR3, PTPN11, or NF1.
              </p>
              <p>
                <span className="font-medium text-foreground">Tool to use for APOBEC:</span>{" "}
                needs at least &gt;50 mutations.{" "}
                <a
                  href="https://github.com/bachisiozic/mmsig"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  github.com/bachisiozic/mmsig
                </a>
              </p>
              <p>
                <span className="font-medium text-foreground">Tool to use for CNV Signature:</span>{" "}
                <a
                  href="https://github.com/bachisiozic/CNV_mmsig"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  github.com/bachisiozic/CNV_mmsig
                </a>
                . This is a simple package where you simply upload the output of any CNV caller.
              </p>
            </div>
          ),
        },
      ]}
      authors={genomicAuthors}
    >
      <div className="space-y-6">
        <div className="rounded-xl border border-primary/15 bg-primary/5 p-4 text-sm text-muted-foreground">
          Use the{" "}
          <Link to="/smoldering-myeloma" className="font-medium text-primary underline underline-offset-4">
            Smoldering Multiple Myeloma IMWG 2020 calculator
          </Link>{" "}
          first to determine the IMWG 2020 risk status, then return to this page.
        </div>

        <div>
          <Label className="label-field">
            Risk Status by IMWG 2020
          </Label>
          <RadioGroup
            value={formData.imwgRiskStatus}
            onValueChange={(value) => setFormData({ ...formData, imwgRiskStatus: value })}
            className="grid gap-3 mt-2 sm:grid-cols-2"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="high" id="imwg-high" />
              <Label htmlFor="imwg-high" className="cursor-pointer">High</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="intermediate" id="imwg-intermediate" />
              <Label htmlFor="imwg-intermediate" className="cursor-pointer">Intermediate</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="low" id="imwg-low" />
              <Label htmlFor="imwg-low" className="cursor-pointer">Low</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="unknown" id="imwg-unknown" />
              <Label htmlFor="imwg-unknown" className="cursor-pointer">Unknown</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="label-field">
            Genomic Sequencing Data Available
          </Label>
          <RadioGroup
            value={formData.genomicSequencingAvailable}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                genomicSequencingAvailable: value,
                rasMutation: value === "yes" ? formData.rasMutation : "",
                mycAbnormality: value === "yes" ? formData.mycAbnormality : "",
                apobecSignature: value === "yes" ? formData.apobecSignature : "",
                neoplasticCnvSignature: value === "yes" ? formData.neoplasticCnvSignature : "",
              })
            }
            className="flex gap-6 mt-2"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="yes" id="genomic-yes" />
              <Label htmlFor="genomic-yes" className="cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="no" id="genomic-no" />
              <Label htmlFor="genomic-no" className="cursor-pointer">No</Label>
            </div>
          </RadioGroup>
          {formData.genomicSequencingAvailable === "no" && (
            <p className="mt-2 text-sm text-muted-foreground">
              Genomic sequencing data are required to use this calculator.
            </p>
          )}
        </div>

        {formData.genomicSequencingAvailable === "yes" && (
          <>
            <div>
              <Label className="label-field">
                RAS Mutations
              </Label>
              <RadioGroup
                value={formData.rasMutation}
                onValueChange={(value) => setFormData({ ...formData, rasMutation: value })}
                className="flex gap-6 mt-2"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="yes" id="ras-yes" />
                  <Label htmlFor="ras-yes" className="cursor-pointer">Yes</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="no" id="ras-no" />
                  <Label htmlFor="ras-no" className="cursor-pointer">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="label-field">
                MYC Abnormalities
              </Label>
              <RadioGroup
                value={formData.mycAbnormality}
                onValueChange={(value) => setFormData({ ...formData, mycAbnormality: value })}
                className="flex gap-6 mt-2"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="yes" id="myc-yes" />
                  <Label htmlFor="myc-yes" className="cursor-pointer">Yes</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="no" id="myc-no" />
                  <Label htmlFor="myc-no" className="cursor-pointer">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="label-field">
                APOBEC Mutational Signature (SBS2 and / or SBS13)
              </Label>
              <RadioGroup
                value={formData.apobecSignature}
                onValueChange={(value) => setFormData({ ...formData, apobecSignature: value })}
                className="flex gap-6 mt-2"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="yes" id="apobec-yes" />
                  <Label htmlFor="apobec-yes" className="cursor-pointer">Yes</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="no" id="apobec-no" />
                  <Label htmlFor="apobec-no" className="cursor-pointer">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="label-field">
                Neoplastic CNV Signature (CNV Signature 1, 3, or 5)
              </Label>
              <RadioGroup
                value={formData.neoplasticCnvSignature}
                onValueChange={(value) => setFormData({ ...formData, neoplasticCnvSignature: value })}
                className="flex gap-6 mt-2"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="yes" id="cnv-yes" />
                  <Label htmlFor="cnv-yes" className="cursor-pointer">Yes</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="no" id="cnv-no" />
                  <Label htmlFor="cnv-no" className="cursor-pointer">No</Label>
                </div>
              </RadioGroup>
            </div>
          </>
        )}

        <Button onClick={calculateRisk} className="w-full btn-primary py-6 text-base">
          Risk Stratify and Calculate Prognosis
        </Button>
      </div>

      <ResultModal
        open={showResult}
        onClose={() => setShowResult(false)}
        title="Genomic IMWG Risk Stratification"
        result={result}
      />
    </CalculatorLayout>
  );
};

export default SmolderingMyelomaGenomic;
