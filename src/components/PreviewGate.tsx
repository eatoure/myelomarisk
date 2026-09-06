import { FormEvent, ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroBackdrop from "@/components/HeroBackdrop";
import { isPreviewConfigured, isPreviewUnlocked, unlockPreview } from "@/lib/preview";

interface PreviewGateProps {
  children: ReactNode;
}

const GateShell = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen flex flex-col bg-background">
    <Header />
    <main className="flex-grow">
      <div className="relative overflow-hidden py-8">
        <HeroBackdrop variant="primary" />
        <div className="container mx-auto px-4 relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Calculators
          </Link>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-white">
            Reviewer Preview
          </h1>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-card rounded-2xl shadow-card p-6 md:p-8 animate-fade-in-up">
            {children}
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

const PreviewGate = ({ children }: PreviewGateProps) => {
  const [unlocked, setUnlocked] = useState(isPreviewUnlocked);
  const [attempt, setAttempt] = useState("");
  const [error, setError] = useState("");

  if (!isPreviewConfigured) {
    return (
      <GateShell>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-full bg-muted">
            <Lock className="h-5 w-5 text-muted-foreground" />
          </div>
          <h2 className="font-display font-semibold text-lg">Preview unavailable</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          No preview password is configured for this build, so calculators under review are
          closed. Set <span className="font-mono">VITE_PREVIEW_PASSWORD</span> and rebuild to
          enable reviewer access.
        </p>
      </GateShell>
    );
  }

  if (unlocked) {
    return <>{children}</>;
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (unlockPreview(attempt)) {
      setError("");
      setUnlocked(true);
      return;
    }
    setError("That password is not correct.");
  };

  return (
    <GateShell>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-full bg-primary/10">
          <Lock className="h-5 w-5 text-primary" />
        </div>
        <h2 className="font-display font-semibold text-lg">This calculator is under review</h2>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        This page is not yet published. Enter the reviewer password to open it for testing.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="previewPassword" className="label-field">
            Reviewer Password
          </Label>
          <Input
            id="previewPassword"
            type="password"
            autoComplete="current-password"
            className="input-field"
            value={attempt}
            onChange={(e) => {
              setAttempt(e.target.value);
              setError("");
            }}
          />
          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        </div>

        <Button type="submit" className="w-full btn-primary py-6 text-base">
          Open Preview
        </Button>
      </form>

      <p className="mt-6 text-xs text-muted-foreground">
        This gate keeps in-testing calculators out of the way of everyday visitors. It is not a
        security control — please do not treat the contents as confidential.
      </p>
    </GateShell>
  );
};

export default PreviewGate;
