import { FormEvent, ReactNode, useState } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isPreviewBuild, isPreviewUnlocked, unlockPreview } from "@/lib/preview";

/**
 * Wraps the entire site. On staging builds it asks for the password once and
 * then gets out of the way, so reviewers see the real site with staged changes
 * in place. In production there is no password configured and this renders
 * nothing but its children.
 */
const PreviewGate = ({ children }: { children: ReactNode }) => {
  const [unlocked, setUnlocked] = useState(isPreviewUnlocked);
  const [attempt, setAttempt] = useState("");
  const [error, setError] = useState("");

  if (!isPreviewBuild || unlocked) {
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
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-card p-8 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-primary">
              <Lock className="h-5 w-5 text-white" />
            </div>
            <h1 className="font-display font-bold text-xl text-foreground">
              MyelomaRisk Staging
            </h1>
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            This is the review copy of MyelomaRisk, containing changes that are not yet live.
            Enter the reviewer password to continue.
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
                autoFocus
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
              Enter
            </Button>
          </form>

          <p className="mt-6 text-xs text-muted-foreground">
            Not a security control — this is a static site, so the password is readable in the
            page source. Please do not treat the contents as confidential.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PreviewGate;
