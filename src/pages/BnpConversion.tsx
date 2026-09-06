import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CalculatorLayout from "@/components/CalculatorLayout";
import ResultModal from "@/components/ResultModal";
import { useToast } from "@/hooks/use-toast";
import { authors } from "@/data/developers";
import {
  bnpToNtProBnp,
  formatPeptide,
  isValidPeptide,
  ntProBnpToBnp,
} from "@/lib/bnpConversion";

type Direction = "ntToBnp" | "bnpToNt";

const BnpConversion = () => {
  const { toast } = useToast();
  const [direction, setDirection] = useState<Direction>("ntToBnp");
  const [value, setValue] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState("");

  const isNtToBnp = direction === "ntToBnp";
  const inputLabel = isNtToBnp
    ? "Measured NT-proBNP (ng/L)"
    : "Measured BNP (ng/L)";
  const inputPlaceholder = isNtToBnp ? "e.g., 1800" : "e.g., 300";

  const selectDirection = (next: Direction) => {
    setDirection(next);
    setValue("");
  };

  const convert = () => {
    if (!value) {
      toast({
        title: "Missing Information",
        description: "Please enter a measured value.",
        variant: "destructive",
      });
      return;
    }

    const measured = parseFloat(value);

    if (!isValidPeptide(measured)) {
      toast({
        title: "Invalid Value",
        description: "Please enter a value greater than 0.",
        variant: "destructive",
      });
      return;
    }

    const converted = isNtToBnp ? ntProBnpToBnp(measured) : bnpToNtProBnp(measured);

    setResult(
      isNtToBnp
        ? `A measured NT-proBNP of ${formatPeptide(measured)} ng/L corresponds to a predicted BNP of **${formatPeptide(converted)} ng/L**.`
        : `A measured BNP of ${formatPeptide(measured)} ng/L corresponds to a predicted NT-proBNP of **${formatPeptide(converted)} ng/L**.`
    );
    setShowResult(true);
  };

  return (
    <CalculatorLayout
      title="NT-proBNP ↔ BNP Conversion"
      description="Convert between NT-proBNP and BNP in AL amyloidosis using the published conversion formula. Enter either measured natriuretic peptide to obtain the predicted value of the other."
      reference={{
        text: "Muchtar E, et al. A Clinically Applicable Conversion Formula Between NT-proBNP and BNP in AL Amyloidosis. JACC CardioOncol. 2026.",
        url: "https://www.sciencedirect.com/science/article/pii/S2666087326002012",
      }}
      authors={authors}
      detailSections={[
        {
          title: "Formula",
          content: (
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="font-mono text-foreground">
                log(BNP) = 0.3142036 + 0.7014077 × log(NT-proBNP)
              </p>
              <p>
                Back-transformed for this calculator as
                <span className="font-mono text-foreground"> BNP = e^0.3142036 × NT-proBNP^0.7014077</span>,
                and rearranged for the reverse direction as
                <span className="font-mono text-foreground"> NT-proBNP = e^((ln(BNP) − 0.3142036) / 0.7014077)</span>.
              </p>
              <p>
                Both peptides are expressed in ng/L (equivalent to pg/mL). Converted values are
                model-predicted estimates and are not interchangeable with a directly measured assay
                result.
              </p>
            </div>
          ),
        },
      ]}
    >
      <div className="space-y-6">
        {/* Direction */}
        <div>
          <Label className="label-field">Conversion Direction</Label>
          <div className="grid sm:grid-cols-2 gap-3">
            <Button
              type="button"
              variant={isNtToBnp ? "default" : "outline"}
              className={isNtToBnp ? "btn-primary py-6 h-auto whitespace-normal" : "py-6 h-auto whitespace-normal"}
              onClick={() => selectDirection("ntToBnp")}
            >
              NT-proBNP → BNP
            </Button>
            <Button
              type="button"
              variant={!isNtToBnp ? "default" : "outline"}
              className={!isNtToBnp ? "btn-primary py-6 h-auto whitespace-normal" : "py-6 h-auto whitespace-normal"}
              onClick={() => selectDirection("bnpToNt")}
            >
              BNP → NT-proBNP
            </Button>
          </div>
        </div>

        {/* Measured value */}
        <div>
          <Label htmlFor="measuredValue" className="label-field">
            {inputLabel}
          </Label>
          <Input
            id="measuredValue"
            type="number"
            step="0.1"
            min="0"
            placeholder={inputPlaceholder}
            className="input-field"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>

        <Button onClick={convert} className="w-full btn-primary py-6 text-base">
          Convert
        </Button>
      </div>

      <ResultModal
        open={showResult}
        onClose={() => setShowResult(false)}
        title="Predicted Natriuretic Peptide"
        result={result}
        additionalInfo="Derived from the NT-proBNP/BNP conversion formula validated in patients with AL amyloidosis. Predicted values are estimates and should not replace a directly measured assay."
      />
    </CalculatorLayout>
  );
};

export default BnpConversion;
