/**
 * CHARGE prognostic index: early treatment failure with bispecific T-cell
 * engagers (teclistamab, elranatamab, talquetamab) in relapsed/refractory
 * multiple myeloma.
 *
 * Zanwar S, Hansen DK, Pasvolsky O, et al., on behalf of the US Multiple
 * Myeloma Immunotherapy Consortium. Journal of Clinical Oncology (manuscript,
 * revision 2).
 *
 * Six equally weighted factors, one point each (range 0-6):
 *   C  Cytogenetic high risk: del(17p), or >= 2 of del(17p), t(4;14),
 *      t(14;16), 1q gain/amplification, del(1p), at any time before TCE
 *   H  Hyperferritinemia: ferritin >= 600 ng/mL
 *   A  Anemia: hemoglobin < 9 g/dL
 *   R  Relapsed early (functional high risk): PFS <= 18 months on frontline
 *      therapy (authors chose <= over the < in the Methods, Nov 2026)
 *   G  General performance status: ECOG >= 2
 *   E  Exposure to prior BCMA-directed therapy
 *
 *   Low 0-1, intermediate 2-3, high 4-6.
 */

export const HIGH_RISK_ABNORMALITIES = [
  { key: "del17p", label: "del(17p)" },
  { key: "t414", label: "t(4;14)" },
  { key: "t1416", label: "t(14;16)" },
  { key: "gain1q", label: "1q gain / amplification (1q21+)" },
  { key: "del1p", label: "del(1p)" },
] as const;

export type AbnormalityKey = (typeof HIGH_RISK_ABNORMALITIES)[number]["key"];

/** Adapted IMS/IMWG high-risk cytogenetics: del(17p) alone, or >= 2 listed. */
export const isCytogeneticHighRisk = (present: AbnormalityKey[]): boolean =>
  present.includes("del17p") || new Set(present).size >= 2;

export const FERRITIN_CUTOFF_NG_ML = 600;
export const HEMOGLOBIN_CUTOFF_G_DL = 9;
export const EARLY_RELAPSE_MONTHS = 18;

export interface ChargeInputs {
  cytogeneticHighRisk: boolean;
  ferritin: number;
  hemoglobin: number;
  relapsedEarly: boolean;
  ecogAtLeast2: boolean;
  priorBcma: boolean;
}

export interface ChargeBreakdown {
  C: boolean;
  H: boolean;
  A: boolean;
  R: boolean;
  G: boolean;
  E: boolean;
  total: number;
}

export const chargeScore = (i: ChargeInputs): ChargeBreakdown => {
  const b = {
    C: i.cytogeneticHighRisk,
    H: i.ferritin >= FERRITIN_CUTOFF_NG_ML,
    A: i.hemoglobin < HEMOGLOBIN_CUTOFF_G_DL,
    R: i.relapsedEarly,
    G: i.ecogAtLeast2,
    E: i.priorBcma,
  };
  return { ...b, total: Object.values(b).filter(Boolean).length };
};

export type ChargeRiskGroup = "low" | "intermediate" | "high";

export const chargeRiskGroup = (total: number): ChargeRiskGroup => {
  if (total <= 1) return "low";
  if (total <= 3) return "intermediate";
  return "high";
};

/** PFS by risk group in the derivation and external validation cohorts. */
export const chargeOutcomes: Record<
  ChargeRiskGroup,
  {
    label: string;
    points: string;
    derivationMedianPfs: string;
    derivationPfs12: string;
    hrVsLow: string;
    validationMedianPfs: string;
    validationPfs12: string;
    bcmaPfs12: string;
    talquetamabPfs12: string;
  }
> = {
  low: {
    label: "Low risk",
    points: "0–1 points",
    derivationMedianPfs: "21.8 months (95% CI 11.7–not reached)",
    derivationPfs12: "56.6%",
    hrVsLow: "Reference",
    validationMedianPfs: "Not reached (95% CI 17.7–not reached)",
    validationPfs12: "77.6%",
    bcmaPfs12: "58.4%",
    talquetamabPfs12: "51.4%",
  },
  intermediate: {
    label: "Intermediate risk",
    points: "2–3 points",
    derivationMedianPfs: "7.1 months (95% CI 6.1–10.1)",
    derivationPfs12: "37.7%",
    hrVsLow: "2.0 (95% CI 1.5–2.7)",
    validationMedianPfs: "7.0 months (95% CI 4.3–9.9)",
    validationPfs12: "35.9%",
    bcmaPfs12: "39.6%",
    talquetamabPfs12: "34.6%",
  },
  high: {
    label: "High risk",
    points: "4–6 points",
    derivationMedianPfs: "1.6 months (95% CI 1.2–2.5)",
    derivationPfs12: "9.0%",
    hrVsLow: "4.8 (95% CI 3.5–6.7)",
    validationMedianPfs: "3.0 months (95% CI 1.0–10.1)",
    validationPfs12: "16.7%",
    bcmaPfs12: "7%",
    talquetamabPfs12: "11.5%",
  },
};
