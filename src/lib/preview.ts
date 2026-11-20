/**
 * Staging preview.
 *
 * Preview builds (`npm run dev`, `npm run build:preview`) put the whole site
 * behind a single password and show every staged change in place, exactly as
 * it would look once live. Production builds have no password configured, so
 * the gate disappears entirely — and in practice production does not carry
 * unreleased work at all, since it lives on a separate branch.
 *
 * SECURITY NOTE: this is a client-side gate on a static site. The expected
 * password is compiled into the JavaScript bundle and is readable by anyone
 * who opens developer tools. It keeps the staging site from being stumbled
 * upon; it is NOT a security control.
 */

const STORAGE_KEY = "myeloma-risk-preview-unlocked";

/** Configured in .env.preview.local (not committed) or a Netlify env var. */
export const previewPassword: string =
  (import.meta.env.VITE_PREVIEW_PASSWORD as string | undefined) ?? "";

/** True on staging builds, false in production. */
export const isPreviewBuild = previewPassword.length > 0;

export const isPreviewUnlocked = (): boolean => {
  if (!isPreviewBuild) return false;
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
};

export const unlockPreview = (attempt: string): boolean => {
  if (!isPreviewBuild) return false;
  if (attempt !== previewPassword) return false;
  try {
    sessionStorage.setItem(STORAGE_KEY, "true");
  } catch {
    /* session storage unavailable; unlock lasts for this page view only */
  }
  return true;
};

export interface StagedChange {
  title: string;
  /** What changed, in terms a reviewer can approve or reject. */
  summary: string;
  /** Where to see it. */
  to: string;
  /** Anything still unresolved that a reviewer should weigh in on. */
  openQuestion?: string;
}

/**
 * Changes on this branch awaiting sign-off. Shown to reviewers on the staging
 * site so they know what they are being asked to approve.
 */
export const stagedChanges: StagedChange[] = [
  // Add an entry here for each change on the `deploy` branch awaiting sign-off.
  // Empty it again when the branch is merged to main.
  {
    title: "CHARGE index for bispecific T-cell engagers",
    summary:
      "New calculator predicting early treatment failure with teclistamab, elranatamab or talquetamab, from Zanwar et al. on behalf of the US Multiple Myeloma Immunotherapy Consortium (Journal of Clinical Oncology). Six factors, one point each: low 0–1, intermediate 2–3, high 4–6, with derivation and validation PFS for each group.",
    to: "/charge",
    openQuestion:
      "1) Built from manuscript revision 2, not the published article — please confirm the scoring did not change at publication, and that it is OK to show before the article is out. 2) Early relapse is '<18 months' in the Methods but '≤18 months' in the Figure 2 legend; the calculator uses <18 months. 3) Cytogenetic high risk is computed from the abnormalities selected (del(17p) alone, or any two of the five listed) — please check that matches your intent.",
  },
  {
    title: "IMWG SCOPE-MM score for BCMA CAR-T",
    summary:
      "New calculator for pre-apheresis risk stratification before ide-cel or cilta-cel, from Rejeski, Cordas dos Santos et al. (Lancet Oncology). Five factors, 0–7 points, low / intermediate / high risk, with training-cohort PFS, OS and non-relapse mortality for each group.",
    to: "/scope-mm",
    openQuestion:
      "1) Built from manuscript revision R3, not the published article — please confirm the scoring did not change at publication, and that it is OK to show before the article is out. 2) The manuscript gives CAR-HEMATOTOX point ranges but not its cut-offs; the 'calculate from labs' option uses the original CAR-HEMATOTOX cut-offs (platelets >175 / 75–175 / <75 G/L; ANC ≤1.2 G/L; Hgb ≤9.0 g/dL; CRP ≥3.0 mg/dL; ferritin <650 / 650–2000 / >2000 ng/mL). Please confirm. 3) The marrow cut-off is '≥50%' in Figure 1D and the text but '>50%' in Figure 1A/B; the calculator uses ≥50%.",
  },
];
