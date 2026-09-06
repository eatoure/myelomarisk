/**
 * Conversion between NT-proBNP and BNP in AL amyloidosis.
 *
 * Muchtar et al., JACC CardioOncology (2026):
 *   log(BNP) = 0.3142036 + 0.7014077 * log(NT-proBNP)
 *
 * The publication does not state the logarithm base. Natural log is used here
 * because it reproduces the established clinical equivalence (NT-proBNP 332
 * ng/L -> BNP 80.3, against the published threshold of 81); a base-10 reading
 * gives 121, which matches no known threshold. CONFIRM WITH THE AUTHORS before
 * this is published.
 */
export const CONVERSION_INTERCEPT = 0.3142036;
export const CONVERSION_SLOPE = 0.7014077;

/** Predict BNP (ng/L) from a measured NT-proBNP (ng/L). */
export const ntProBnpToBnp = (ntProBnp: number): number =>
  Math.exp(CONVERSION_INTERCEPT + CONVERSION_SLOPE * Math.log(ntProBnp));

/** Predict NT-proBNP (ng/L) from a measured BNP (ng/L). */
export const bnpToNtProBnp = (bnp: number): number =>
  Math.exp((Math.log(bnp) - CONVERSION_INTERCEPT) / CONVERSION_SLOPE);

/** Round to a sensible number of digits for display. */
export const formatPeptide = (value: number): string => {
  if (value >= 100) return value.toFixed(0);
  if (value >= 10) return value.toFixed(1);
  return value.toFixed(2);
};

/** A usable measurement: finite and above zero (logarithms need positives). */
export const isValidPeptide = (value: number): boolean =>
  Number.isFinite(value) && value > 0;
