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
  {
    title: "NT-proBNP ↔ BNP conversion calculator",
    summary:
      "New calculator converting between NT-proBNP and BNP in AL amyloidosis, using the formula from Muchtar et al. (JACC CardioOncology, 2026).",
    to: "/bnp-conversion",
    openQuestion:
      "The paper writes the model as log(BNP) = 0.3142036 + 0.7014077 × log(NT-proBNP) without stating the logarithm base, and the base changes the result by roughly 50%. Natural log is used here because it reproduces the established equivalence (NT-proBNP 332 → BNP 80.3, against the published threshold of 81); base-10 gives 121. Please confirm.",
  },
  {
    title: "BNP helper on the amyloidosis staging calculator",
    summary:
      "The amyloidosis form now offers to convert a measured BNP into NT-proBNP and fill the field, for patients where only BNP is available. Staging results produced this way say the value was estimated.",
    to: "/amyloidosis",
  },
];
