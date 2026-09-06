import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { bnpToNtProBnp, formatPeptide, isValidPeptide } from "@/lib/bnpConversion";

interface NtProBnpFromBnpProps {
  /** Called with the converted NT-proBNP, formatted for the parent input. */
  onApply: (ntProBnp: string) => void;
}

/**
 * Inline helper for the amyloidosis staging form: when only a BNP result is
 * available, convert it to an estimated NT-proBNP and drop it into the field.
 */
const NtProBnpFromBnp = ({ onApply }: NtProBnpFromBnpProps) => {
  const [open, setOpen] = useState(false);
  const [bnp, setBnp] = useState("");
  const [error, setError] = useState("");

  const parsed = parseFloat(bnp);
  const converted = isValidPeptide(parsed) ? bnpToNtProBnp(parsed) : null;

  const apply = () => {
    if (converted === null) {
      setError("Enter a BNP value greater than 0.");
      return;
    }
    setError("");
    onApply(formatPeptide(converted));
    setOpen(false);
  };

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        aria-expanded={open}
      >
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
        Only have a BNP result?
      </button>

      {open && (
        <div className="mt-3 p-4 rounded-xl bg-muted/50 border border-border animate-fade-in">
          <p className="text-sm text-muted-foreground mb-3">
            Enter a measured BNP to estimate the equivalent NT-proBNP and fill it in above.
          </p>

          <div className="space-y-3">
            <div>
              <Label htmlFor="bnpHelper" className="label-field">
                Measured BNP (ng/L)
              </Label>
              <Input
                id="bnpHelper"
                type="number"
                step="0.1"
                min="0"
                placeholder="e.g., 80"
                className="input-field"
                value={bnp}
                onChange={(e) => {
                  setBnp(e.target.value);
                  setError("");
                }}
              />
              {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
            </div>

            {converted !== null && (
              <p className="text-sm text-foreground">
                Estimated NT-proBNP:{" "}
                <span className="font-semibold">{formatPeptide(converted)} ng/L</span>
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <Button type="button" onClick={apply} className="btn-primary">
                Use this value
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Link
                to="/bnp-conversion"
                className="text-sm text-primary hover:underline inline-flex items-center gap-1"
              >
                Open the full converter
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>

            <p className="text-xs text-muted-foreground">
              This is a model-predicted estimate, not a measured NT-proBNP. Staging based on a
              converted value should be interpreted with that in mind.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NtProBnpFromBnp;
