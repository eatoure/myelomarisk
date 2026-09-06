/**
 * Gating for calculators that are still under clinical review.
 *
 * SECURITY NOTE: this is a client-side gate on a static site. The expected
 * password is compiled into the JavaScript bundle and is readable by anyone
 * who opens developer tools. It exists to keep in-testing calculators from
 * being stumbled upon by patients or clinicians browsing the live site — it
 * is NOT a security control. Do not put anything genuinely confidential
 * behind it.
 */

const STORAGE_KEY = "myeloma-risk-preview-unlocked";

/** Configured in .env.local (not committed) or a CI secret. */
export const previewPassword: string =
  (import.meta.env.VITE_PREVIEW_PASSWORD as string | undefined) ?? "";

/** When no password is configured, preview routes stay closed. */
export const isPreviewConfigured = previewPassword.length > 0;

export const isPreviewUnlocked = (): boolean => {
  if (!isPreviewConfigured) return false;
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
};

export const unlockPreview = (attempt: string): boolean => {
  if (!isPreviewConfigured) return false;
  if (attempt !== previewPassword) return false;
  try {
    sessionStorage.setItem(STORAGE_KEY, "true");
  } catch {
    /* session storage unavailable; unlock lasts for this page view only */
  }
  return true;
};

export const lockPreview = () => {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* nothing to clear */
  }
};

export interface PreviewCalculator {
  title: string;
  description: string;
  to: string;
  status: string;
}

/** Calculators visible only behind the preview gate, pending sign-off. */
export const previewCalculators: PreviewCalculator[] = [
  {
    title: "AL Amyloidosis: NT-proBNP ↔ BNP Conversion",
    description:
      "Convert between NT-proBNP and BNP using the conversion formula from Muchtar et al.",
    to: "/bnp-conversion",
    status: "Awaiting review — please confirm the logarithm base used in the published formula.",
  },
];
