import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface ResultModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  result: string;
  additionalInfo?: string;
}

const ResultModal = ({ open, onClose, title, result, additionalInfo }: ResultModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-card border-border">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-green-100">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="font-display text-xl">
              {title}
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
            <p className="text-foreground leading-relaxed">
              {result}
            </p>
          </div>

          {additionalInfo && (
            <p className="text-sm text-muted-foreground">
              {additionalInfo}
            </p>
          )}

          <Button onClick={onClose} className="w-full btn-primary">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResultModal;
