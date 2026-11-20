import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import CalculatorLayout from "@/components/CalculatorLayout";
import ResultModal from "@/components/ResultModal";
import { useToast } from "@/hooks/use-toast";
import { authors } from "@/data/developers";
import YesNoField, { YesNo } from "@/components/YesNoField";
import {
  CAR_HEMATOTOX_HIGH_RISK_MIN,
  SCOPE_MM_ULTRA_HIGH_THRESHOLD,
  carHematotox,
  scopeMmOutcomes,
  scopeMmPoints,
  scopeMmRiskGroup,
} from "@/lib/scopeMm";

type HematotoxMode = "" | "category" | "labs";

const labFields = [
  { key: "platelets", label: "Platelets (G/L)", placeholder: "e.g., 150", step: "1" },
  { key: "anc", label: "Absolute neutrophil count (G/L)", placeholder: "e.g., 2.1", step: "0.1" },
  { key: "hemoglobin", label: "Hemoglobin (g/dL)", placeholder: "e.g., 10.5", step: "0.1" },
  { key: "crp", label: "C-reactive protein (mg/dL)", placeholder: "e.g., 0.8", step: "0.1" },
  { key: "ferritin", label: "Ferritin (ng/mL)", placeholder: "e.g., 400", step: "1" },
] as const;

type LabKey = (typeof labFields)[number]["key"];

const ScopeMm = () => {
  const { toast } = useToast();
  const [hematotoxMode, setHematotoxMode] = useState<HematotoxMode>("");
  const [hematotoxCategory, setHematotoxCategory] = useState<"" | "low" | "high">("");
  const [labs, setLabs] = useState<Record<LabKey, string>>({
    platelets: "",
    anc: "",
    hemoglobin: "",
    crp: "",
    ferritin: "",
  });
  const [priorBcma, setPriorBcma] = useState<YesNo>("");
  const [bmpc, setBmpc] = useState<YesNo>("");
  const [emd, setEmd] = useState<YesNo>("");
  const [ldh, setLdh] = useState<YesNo>("");
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState("");

  const missing = (description: string) =>
    toast({ title: "Missing Information", description, variant: "destructive" });

  const calculate = () => {
    let hematotoxHigh: boolean;
    let hematotoxLine: string;

    if (hematotoxMode === "category") {
      if (!hematotoxCategory) return missing("Select the CAR-HEMATOTOX risk category.");
      hematotoxHigh = hematotoxCategory === "high";
      hematotoxLine = `CAR-HEMATOTOX: ${hematotoxHigh ? "high" : "low"} risk (entered)`;
    } else if (hematotoxMode === "labs") {
      const values = labFields.map((f) => parseFloat(labs[f.key]));
      if (values.some((v) => !Number.isFinite(v) || v < 0)) {
        return missing("Enter all five pre-apheresis laboratory values.");
      }
      const [platelets, anc, hemoglobin, crp, ferritin] = values;
      const ht = carHematotox({ platelets, anc, hemoglobin, crp, ferritin });
      hematotoxHigh = ht.high;
      hematotoxLine =
        `CAR-HEMATOTOX: ${ht.total} points, ${ht.high ? "high" : "low"} risk ` +
        `(platelets ${ht.platelets}, ANC ${ht.anc}, hemoglobin ${ht.hemoglobin}, ` +
        `CRP ${ht.crp}, ferritin ${ht.ferritin})`;
    } else {
      return missing("Choose how to enter the CAR-HEMATOTOX score.");
    }

    if (!priorBcma || !bmpc || !emd || !ldh) {
      return missing("Please answer all SCOPE-MM questions.");
    }

    const points = scopeMmPoints({
      carHematotoxHigh: hematotoxHigh,
      priorBcma: priorBcma === "yes",
      bmpcAtLeast50: bmpc === "yes",
      historyOfEmd: emd === "yes",
      ldhAboveUln: ldh === "yes",
    });
    const group = scopeMmRiskGroup(points);
    const o = scopeMmOutcomes[group];

    const ultraHigh =
      points >= SCOPE_MM_ULTRA_HIGH_THRESHOLD
        ? "\n\nA score of 5 or more fell in the ultra-high-risk subgroup (2.5% of the training cohort): median PFS 2.4 months and median OS 8.4 months, with 12-month PFS 5% and OS 45%."
        : "";

    setResult(
      `SCOPE-MM score: **${points} of 7**, **${o.label}** (${o.points}).\n\n` +
        `${hematotoxLine}\n\n` +
        `Training cohort outcomes after BCMA-directed CAR-T for this group:\n` +
        `Median PFS: ${o.medianPfs}\n` +
        `12-month PFS: ${o.pfs12}\n` +
        `12-month OS: ${o.os12}\n` +
        `Median OS: ${o.medianOs}\n` +
        `12-month non-relapse mortality: ${o.nrm12}` +
        ultraHigh
    );
    setShowResult(true);
  };

  return (
    <CalculatorLayout
      title="SCOPE-MM Score for BCMA CAR-T"
      description="Pre-apheresis risk stratification for BCMA-directed CAR-T therapy (ide-cel or cilta-cel) in relapsed/refractory multiple myeloma. Assess all variables at the time of apheresis."
      reference={{
        text: "Rejeski K, Cordas dos Santos DM, et al. Pre-apheresis risk stratification for BCMA CAR-T therapy in multiple myeloma (IMWG SCOPE-MM score): a multicentre retrospective cohort study. Lancet Oncol. In press.",
        url: "https://www.thelancet.com/journals/lanonc/home",
      }}
      authors={authors}
      detailSections={[
        {
          title: "Scoring",
          content: (
            <div className="space-y-3 text-sm text-muted-foreground">
              <ul className="space-y-1">
                <li>CAR-HEMATOTOX high risk (≥{CAR_HEMATOTOX_HIGH_RISK_MIN} points): <span className="text-foreground font-medium">+2</span></li>
                <li>Prior BCMA-targeted therapy: <span className="text-foreground font-medium">+2</span></li>
                <li>Bone marrow plasma cells ≥50%: <span className="text-foreground font-medium">+1</span></li>
                <li>History of extramedullary disease: <span className="text-foreground font-medium">+1</span></li>
                <li>Serum LDH above upper limit of normal: <span className="text-foreground font-medium">+1</span></li>
              </ul>
              <p>Low risk 0 points · Intermediate 1–2 · High ≥3 (maximum 7).</p>
              <p>
                CAR-HEMATOTOX from labs: platelets &gt;175 G/L 0, 75–175 1, &lt;75 2; ANC &gt;1.2 G/L
                0, ≤1.2 1; hemoglobin &gt;9.0 g/dL 0, ≤9.0 1; CRP &lt;3.0 mg/dL 0, ≥3.0 1; ferritin
                &lt;650 ng/mL 0, 650–2000 1, &gt;2000 2.
              </p>
            </div>
          ),
        },
      ]}
    >
      <div className="space-y-6">
        <div>
          <Label className="label-field">CAR-HEMATOTOX Score (pre-apheresis)</Label>
          <RadioGroup
            value={hematotoxMode}
            onValueChange={(v) => setHematotoxMode(v as HematotoxMode)}
            className="grid gap-3 mt-2 sm:grid-cols-2"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="category" id="ht-category" />
              <Label htmlFor="ht-category" className="cursor-pointer">I know the risk category</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="labs" id="ht-labs" />
              <Label htmlFor="ht-labs" className="cursor-pointer">Calculate from labs</Label>
            </div>
          </RadioGroup>

          {hematotoxMode === "category" && (
            <div className="mt-4 p-4 rounded-xl bg-muted/50 border border-border">
              <RadioGroup
                value={hematotoxCategory}
                onValueChange={(v) => setHematotoxCategory(v as "low" | "high")}
                className="grid gap-3 sm:grid-cols-2"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="low" id="ht-low" />
                  <Label htmlFor="ht-low" className="cursor-pointer">Low risk (0–2 points)</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="high" id="ht-high" />
                  <Label htmlFor="ht-high" className="cursor-pointer">High risk (≥3 points)</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {hematotoxMode === "labs" && (
            <div className="mt-4 p-4 rounded-xl bg-muted/50 border border-border grid gap-4 sm:grid-cols-2">
              {labFields.map((f) => (
                <div key={f.key}>
                  <Label htmlFor={`lab-${f.key}`} className="label-field">{f.label}</Label>
                  <Input
                    id={`lab-${f.key}`}
                    type="number"
                    min="0"
                    step={f.step}
                    placeholder={f.placeholder}
                    className="input-field"
                    value={labs[f.key]}
                    onChange={(e) => setLabs({ ...labs, [f.key]: e.target.value })}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <YesNoField
          id="bcma"
          label="Prior BCMA-Targeted Therapy"
          hint="Any prior BCMA-directed agent, e.g. a bispecific antibody or antibody-drug conjugate."
          value={priorBcma}
          onChange={setPriorBcma}
        />
        <YesNoField
          id="bmpc"
          label="Bone Marrow Plasma Cells ≥50%"
          value={bmpc}
          onChange={setBmpc}
        />
        <YesNoField
          id="emd"
          label="History of Extramedullary Disease"
          hint="Organ or soft-tissue involvement, excluding paraskeletal lesions."
          value={emd}
          onChange={setEmd}
        />
        <YesNoField
          id="ldh"
          label="Serum LDH Above Upper Limit of Normal"
          value={ldh}
          onChange={setLdh}
        />

        <Button onClick={calculate} className="w-full btn-primary py-6 text-base">
          Calculate SCOPE-MM
        </Button>
      </div>

      <ResultModal
        open={showResult}
        onClose={() => setShowResult(false)}
        title="SCOPE-MM Risk"
        result={result}
        additionalInfo="Outcomes are from the SCOPE-MM training cohort (n=805, real-world ide-cel and cilta-cel recipients) and describe groups of patients, not an individual prediction."
      />
    </CalculatorLayout>
  );
};

export default ScopeMm;
