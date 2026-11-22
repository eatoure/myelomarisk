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
}

/**
 * Changes on this branch awaiting sign-off. Shown to reviewers on the staging
 * site so they know what they are being asked to approve.
 */
export const stagedChanges: StagedChange[] = [
  // Add an entry here for each change on the `deploy` branch awaiting sign-off.
  // Empty it again when the branch is merged to main.
];
