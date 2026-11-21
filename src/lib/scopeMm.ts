/**
 * IMWG SCOPE-MM score: pre-apheresis risk stratification for BCMA-directed
 * CAR-T therapy in multiple myeloma.
 *
 * Rejeski K, Cordas dos Santos DM, et al. Lancet Oncology (manuscript
 * THELANCETONCOLOGY-D-26-01140R3). Scoring from Figure 1D:
 *
 *   CAR-HEMATOTOX high risk (score >= 3)   +2
 *   Prior BCMA-targeted therapy            +2
 *   Bone marrow plasma cells >= 50%        +1
 *   History of extramedullary disease      +1
 *   Serum LDH above upper limit of normal  +1
 *
 *   Low 0 points, intermediate 1-2, high >= 3 (maximum 7).
 */

export interface ScopeMmInputs {
  carHematotoxHigh: boolean;
  priorBcma: boolean;
  bmpcAtLeast50: boolean;
  historyOfEmd: boolean;
  ldhAboveUln: boolean;
}

export type ScopeMmRiskGroup = "low" | "intermediate" | "high";

export const scopeMmPoints = (inputs: ScopeMmInputs): number =>
  (inputs.carHematotoxHigh ? 2 : 0) +
  (inputs.priorBcma ? 2 : 0) +
  (inputs.bmpcAtLeast50 ? 1 : 0) +
  (inputs.historyOfEmd ? 1 : 0) +
  (inputs.ldhAboveUln ? 1 : 0);

export const scopeMmRiskGroup = (points: number): ScopeMmRiskGroup => {
  if (points === 0) return "low";
  if (points <= 2) return "intermediate";
  return "high";
};

/** Training cohort outcomes by risk group (n=805), from the Results section. */
export const scopeMmOutcomes: Record<
  ScopeMmRiskGroup,
  {
    label: string;
    points: string;
    /** Plain-language summary: training-cohort 95% CIs of 1-year PFS/OS, rounded to
     * the nearest 5% without going above the CI on the favourable side (Nov 2026). */
    summary: string;
    medianPfs: string;
    pfs12: string;
    os12: string;
    medianOs: string;
    nrm12: string;
  }
> = {
  low: {
    label: "Low risk",
    points: "0 points",
    summary: "This score is considered low risk by SCOPE-MM. After BCMA CAR-T, the expected 1-year PFS is about 65–75% and the expected 1-year overall survival is 90% or more.",
    medianPfs: "18.6 months (95% CI 16.4–21.4)",
    pfs12: "71% (95% CI 65–78%)",
    os12: "93% (95% CI 90–97%)",
    medianOs: "Not reached",
    nrm12: "2.3% (95% CI 0.3–4.4%)",
  },
  intermediate: {
    label: "Intermediate risk",
    points: "1–2 points",
    summary: "This score is considered intermediate risk by SCOPE-MM. After BCMA CAR-T, the expected 1-year PFS is about 45–60% and the expected 1-year overall survival is about 75–85%.",
    medianPfs: "12.8 months (95% CI 10.1–16.3)",
    pfs12: "52% (95% CI 46–58%)",
    os12: "80% (95% CI 76–85%)",
    medianOs: "Not reached",
    nrm12: "5.3% (95% CI 2.7–7.8%)",
  },
  high: {
    label: "High risk",
    points: "≥3 points",
    summary: "This score is considered high risk by SCOPE-MM. After BCMA CAR-T, the expected 1-year PFS is about 20–35% and the expected 1-year overall survival is about 50–65%.",
    medianPfs: "6.0 months (95% CI 5.3–8.3)",
    pfs12: "27% (95% CI 21–36%)",
    os12: "58% (95% CI 51–67%)",
    medianOs: "16.5 months (95% CI 12.2–not reached)",
    nrm12: "9.0% (95% CI 4.8–13.2%)",
  },
};

/** Ultra-high-risk subgroup (score >= 5) reported in the training cohort. */
export const SCOPE_MM_ULTRA_HIGH_THRESHOLD = 5;

/**
 * CAR-HEMATOTOX score from pre-apheresis labs.
 *
 * The SCOPE-MM manuscript gives only the point range per component
 * (platelets 0-2, ANC 0-1, Hgb 0-1, CRP 0-1, ferritin 0-2) and states that
 * the "originally published formula" was applied (its ref. 14), with a score
 * of >= 3 classified as high risk. The manuscript does not list the cut-offs.
 *
 * The cut-offs below are those of the original CAR-HEMATOTOX publication
 * (Rejeski et al., Blood 2021), confirmed by the authors (Nov 2026).
 */
export interface CarHematotoxLabs {
  /** Platelets, G/L (10^9/L). */
  platelets: number;
  /** Absolute neutrophil count, G/L (10^9/L). */
  anc: number;
  /** Hemoglobin, g/dL. */
  hemoglobin: number;
  /** C-reactive protein, mg/dL. */
  crp: number;
  /** Ferritin, ng/mL. */
  ferritin: number;
}

export interface CarHematotoxBreakdown {
  platelets: number;
  anc: number;
  hemoglobin: number;
  crp: number;
  ferritin: number;
  total: number;
  high: boolean;
}

/** SCOPE-MM's threshold for a high-risk CAR-HEMATOTOX score. */
export const CAR_HEMATOTOX_HIGH_RISK_MIN = 3;

export const carHematotox = (labs: CarHematotoxLabs): CarHematotoxBreakdown => {
  const platelets = labs.platelets > 175 ? 0 : labs.platelets >= 75 ? 1 : 2;
  const anc = labs.anc > 1.2 ? 0 : 1;
  const hemoglobin = labs.hemoglobin > 9.0 ? 0 : 1;
  const crp = labs.crp < 3.0 ? 0 : 1;
  const ferritin = labs.ferritin < 650 ? 0 : labs.ferritin <= 2000 ? 1 : 2;
  const total = platelets + anc + hemoglobin + crp + ferritin;
  return {
    platelets,
    anc,
    hemoglobin,
    crp,
    ferritin,
    total,
    high: total >= CAR_HEMATOTOX_HIGH_RISK_MIN,
  };
};
