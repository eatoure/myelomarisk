import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, CircleHelp } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroBackdrop from "@/components/HeroBackdrop";
import { isPreviewBuild, stagedChanges } from "@/lib/preview";

const Preview = () => (
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
            Awaiting Approval
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-card rounded-2xl shadow-card p-6 md:p-8 animate-fade-in-up">
            <p className="text-muted-foreground">
              {isPreviewBuild
                ? "These changes are live on this staging site but not on myelomarisk.com. Try them here and let us know whether they are ready to publish."
                : "This build has nothing staged for review."}
            </p>
          </div>

          {stagedChanges.map((change, index) => (
            <div
              key={change.to}
              className="bg-card rounded-2xl shadow-card p-6 animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <h2 className="font-display font-semibold text-foreground mb-2">
                {change.title}
              </h2>
              <p className="text-sm text-muted-foreground mb-4">{change.summary}</p>

              {change.openQuestion && (
                <div className="mb-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <p className="text-sm font-semibold text-foreground mb-1 inline-flex items-center gap-2">
                    <CircleHelp className="h-4 w-4" />
                    Needs your input
                  </p>
                  <p className="text-sm text-muted-foreground">{change.openQuestion}</p>
                </div>
              )}

              <Link
                to={change.to}
                className="text-sm text-primary hover:underline inline-flex items-center gap-1"
              >
                Try it
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>

    <Footer />
  </div>
);

export default Preview;
