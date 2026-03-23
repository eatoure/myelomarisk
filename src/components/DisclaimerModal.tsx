import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle } from "lucide-react";

interface DisclaimerModalProps {
  onAccept: () => void;
}

const DisclaimerModal = ({ onAccept }: DisclaimerModalProps) => {
  const [open, setOpen] = useState(true);

  const handleAccept = () => {
    localStorage.setItem("myeloma-risk-disclaimer-accepted", "true");
    setOpen(false);
    onAccept();
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="flex max-h-[calc(100vh-2rem)] w-[calc(100vw-1rem)] max-w-2xl flex-col gap-0 overflow-hidden border-border bg-card p-0 sm:w-full [&>button]:hidden">
        <div className="bg-gradient-primary p-6">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/20">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <DialogTitle className="text-2xl font-display font-bold text-white">
                Important Disclaimer
              </DialogTitle>
            </div>
          </DialogHeader>
        </div>
        
        {/* Keep the header fixed while the disclaimer body scrolls on smaller screens. */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              Please read this disclaimer carefully before proceeding.
            </p>
          </div>

          <DialogDescription className="mt-6 space-y-4 text-sm leading-relaxed text-foreground/80">
            <p>
              Those utilizing the <strong>MyelomaRisk Calculator</strong> need to acknowledge that 
              the Calculator, as a research instrument, hasn't received validation or endorsement 
              by the United States Food and Drug Administration, the European Medicines Agency, 
              or any equivalent entity.
            </p>
            <p>
              The Calculator is still in its development phase and is delivered "as is," devoid 
              of any supplementary services. mSMART reserves the right to implement changes to 
              the Calculator at its discretion.
            </p>
            <p>
              The Calculator serves purely as an analytical tool and is not meant to replace 
              professional medical guidance. If you have concerns, consult your doctor.
            </p>
            <p>
              This Calculator is designed for non-commercial use only. For commercial usage, 
              contact <a href="mailto:vincerk@gmail.com" className="text-primary hover:underline">
              S. Vincent Rajkumar</a> or <a href="mailto:kumarshaji@hotmail.com" className="text-primary hover:underline">
              Shaji K. Kumar</a>.
            </p>
          </DialogDescription>

          <Button
            onClick={handleAccept}
            className="mt-6 w-full btn-primary py-6 text-base"
          >
            I Understand and Agree
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DisclaimerModal;
