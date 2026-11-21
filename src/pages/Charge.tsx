import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CalculatorLayout from "@/components/CalculatorLayout";
import ResultModal from "@/components/ResultModal";
import YesNoField, { YesNo } from "@/components/YesNoField";
import { useToast } from "@/hooks/use-toast";
import { authors } from "@/data/developers";
import {
  AbnormalityKey,
  EARLY_RELAPSE_MONTHS,
  FERRITIN_CUTOFF_NG_ML,
  HEMOGLOBIN_CUTOFF_G_DL,
  HIGH_RISK_ABNORMALITIES,
  chargeOutcomes,
  chargeRiskGroup,
  chargeScore,
  isCytogeneticHighRisk,
} from "@/lib/charge";

const Charge = () => {
  const { toast } = useToast();
  const [abnormalities, setAbnormalities] = useState<AbnormalityKey[]>([]);
  const [noneOfThese, setNoneOfThese] = useState(false);
  const [ferritin, setFerritin] = useState("");
  const [hemoglobin, setHemoglobin] = useState("");
  const [relapsedEarly, setRelapsedEarly] = useState<YesNo>("");
  const [ecog, setEcog] = useState<YesNo>("");
  const [priorBcma, setPriorBcma] = useState<YesNo>("");
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState("");

  const toggleAbnormality = (key: AbnormalityKey, checked: boolean) => {
    setNoneOfThese(false);
    setAbnormalities((current) =>
      checked ? [...current, key] : current.filter((k) => k !== key)
    );
  };

  const missing = (description: string) =>
    toast({ title: "Missing Information", description, variant: "destructive" });

  const calculate = () => {
    if (abnormalities.length === 0 && !noneOfThese) {
      return missing("Select the high-risk cytogenetic abnormalities present, or 'None of these'.");
    }
    const ferritinVal = parseFloat(ferritin);
    const hemoglobinVal = parseFloat(hemoglobin);
    if (!Number.isFinite(ferritinVal) || ferritinVal < 0) return missing("Enter serum ferritin.");
    if (!Number.isFinite(hemoglobinVal) || hemoglobinVal < 0) return missing("Enter hemoglobin.");
    if (!relapsedEarly || !ecog || !priorBcma) {
      return missing("Please answer all CHARGE questions.");
    }

    const b = chargeScore({
      cytogeneticHighRisk: isCytogeneticHighRisk(abnormalities),
      ferritin: ferritinVal,
      hemoglobin: hemoglobinVal,
      relapsedEarly: relapsedEarly === "yes",
      ecogAtLeast2: ecog === "yes",
      priorBcma: priorBcma === "yes",
    });
    const group = chargeRiskGroup(b.total);
    const o = chargeOutcomes[group];

    const factors = [
      ["C", "Cytogenetic high risk", b.C],
      ["H", `Hyperferritinemia (≥${FERRITIN_CUTOFF_NG_ML} ng/mL)`, b.H],
      ["A", `Anemia (hemoglobin <${HEMOGLOBIN_CUTOFF_G_DL} g/dL)`, b.A],
      ["R", `Relapsed early (<${EARLY_RELAPSE_MONTHS} months on frontline)`, b.R],
      ["G", "General performance (ECOG ≥2)", b.G],
      ["E", "Exposure to prior BCMA therapy", b.E],
    ] as const;
    const present = factors.filter(([, , on]) => on).map(([l, name]) => `${l}: ${name}`);

    setResult(
      `CHARGE index: **${b.total} of 6**, **${o.label}** (${o.points}).\n\n` +
        `${o.summary}\n\n` +
        `Factors present: ${present.length ? present.join("; ") : "none"}.\n\n` +
        `Derivation cohort (n=579):\n` +
        `Median PFS: ${o.derivationMedianPfs}\n` +
        `12-month PFS: ${o.derivationPfs12}\n` +
        `Hazard ratio vs low risk: ${o.hrVsLow}\n\n` +
        `External validation cohort (n=173):\n` +
        `Median PFS: ${o.validationMedianPfs}\n` +
        `12-month PFS: ${o.validationPfs12}\n\n` +
        `12-month PFS by agent class (derivation cohort): BCMA-directed TCE ${o.bcmaPfs12}; talquetamab ${o.talquetamabPfs12}.`
    );
    setShowResult(true);
  };

  return (
    <CalculatorLayout
      title="CHARGE Index for Bispecific T-cell Engagers"
      description="Predicts early treatment failure with bispecific T-cell engagers (teclistamab, elranatamab, talquetamab) in relapsed/refractory multiple myeloma. Assess variables before starting the T-cell engager."
      reference={{
        text: "Zanwar S, Hansen DK, Pasvolsky O, et al. Early treatment failure in patients with relapsed/refractory multiple myeloma receiving bispecific T-cell engagers: development and validation of the CHARGE prognostic index. J Clin Oncol. In press.",
        url: "https://ascopubs.org/journal/jco",
      }}
      authors={authors}
      detailSections={[
        {
          title: "Scoring",
          content: (
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>One point for each factor present (range 0–6):</p>
              <ul className="space-y-1">
                <li><span className="text-foreground font-semibold">C</span>ytogenetic high risk: del(17p), regardless of anything else; or any two of t(4;14), t(14;16), 1q gain or amp, del(1p)</li>
                <li><span className="text-foreground font-semibold">H</span>yperferritinemia: ferritin ≥{FERRITIN_CUTOFF_NG_ML} ng/mL</li>
                <li><span className="text-foreground font-semibold">A</span>nemia: hemoglobin &lt;{HEMOGLOBIN_CUTOFF_G_DL} g/dL</li>
                <li><span className="text-foreground font-semibold">R</span>elapsed early: PFS &lt;{EARLY_RELAPSE_MONTHS} months on frontline therapy</li>
                <li><span className="text-foreground font-semibold">G</span>eneral performance status: ECOG ≥2</li>
                <li><span className="text-foreground font-semibold">E</span>xposure to prior BCMA-directed therapy</li>
              </ul>
              <p>Low risk 0–1 · Intermediate 2–3 · High 4–6.</p>
            </div>
          ),
        },
      ]}
    >
      <div className="space-y-6">
        <div>
          <Label className="label-field">High-Risk Cytogenetic Abnormalities</Label>
          <p className="text-xs text-muted-foreground -mt-1 mb-2">
            Select all detected at any time before starting the T-cell engager. del(17p) alone counts as high risk; otherwise any two of the others are needed.
          </p>
          <div className="grid gap-3 mt-2 sm:grid-cols-2">
            {HIGH_RISK_ABNORMALITIES.map((a) => (
              <div key={a.key} className="flex items-center gap-2">
                <Checkbox
                  id={`cg-${a.key}`}
                  checked={abnormalities.includes(a.key)}
                  onCheckedChange={(c) => toggleAbnormality(a.key, c === true)}
                />
                <Label htmlFor={`cg-${a.key}`} className="cursor-pointer">{a.label}</Label>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <Checkbox
                id="cg-none"
                checked={noneOfThese}
                onCheckedChange={(c) => {
                  setNoneOfThese(c === true);
                  if (c === true) setAbnormalities([]);
                }}
              />
              <Label htmlFor="cg-none" className="cursor-pointer">None of these</Label>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="ferritin" className="label-field">Serum Ferritin (ng/mL)</Label>
            <Input
              id="ferritin"
              type="number"
              min="0"
              step="1"
              placeholder="e.g., 450"
              className="input-field"
              value={ferritin}
              onChange={(e) => setFerritin(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="hemoglobin" className="label-field">Hemoglobin (g/dL)</Label>
            <Input
              id="hemoglobin"
              type="number"
              min="0"
              step="0.1"
              placeholder="e.g., 10.2"
              className="input-field"
              value={hemoglobin}
              onChange={(e) => setHemoglobin(e.target.value)}
            />
          </div>
        </div>

        <YesNoField
          id="relapse"
          label={`Frontline PFS Less Than ${EARLY_RELAPSE_MONTHS} Months`}
          hint={`Functional high-risk disease: progression-free survival of less than ${EARLY_RELAPSE_MONTHS} months with first-line treatment.`}
          value={relapsedEarly}
          onChange={setRelapsedEarly}
        />
        <YesNoField
          id="ecog"
          label="ECOG Performance Status ≥2"
          value={ecog}
          onChange={setEcog}
        />
        <YesNoField
          id="bcma"
          label="Prior BCMA-Directed Therapy"
          hint="E.g. BCMA CAR-T or a BCMA bispecific antibody."
          value={priorBcma}
          onChange={setPriorBcma}
        />

        <Button onClick={calculate} className="w-full btn-primary py-6 text-base">
          Calculate CHARGE Index
        </Button>
      </div>

      <ResultModal
        open={showResult}
        onClose={() => setShowResult(false)}
        title="CHARGE Risk"
        result={result}
        additionalInfo="From real-world cohorts treated with teclistamab, elranatamab or talquetamab (92% triple-class refractory). Results describe groups of patients, not an individual prediction."
      />
    </CalculatorLayout>
  );
};

export default Charge;
