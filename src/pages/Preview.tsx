import { Link } from "react-router-dom";
import { ArrowLeft, FlaskConical } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroBackdrop from "@/components/HeroBackdrop";
import PreviewGate from "@/components/PreviewGate";
import { previewCalculators } from "@/lib/preview";

const PreviewIndex = () => (
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
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-card rounded-2xl shadow-card p-6 md:p-8 animate-fade-in-up">
            <p className="text-muted-foreground">
              These calculators are built but not yet published on the home page. Please test them
              here and send any corrections before they go live.
            </p>
          </div>

          {previewCalculators.length === 0 ? (
            <div className="p-4 rounded-xl bg-muted/50 text-sm text-muted-foreground">
              Nothing is awaiting review right now.
            </div>
          ) : (
            <div className="space-y-4">
              {previewCalculators.map((calc, index) => (
                <Link
                  key={calc.to}
                  to={calc.to}
                  className="block bg-card rounded-2xl shadow-card p-6 hover:shadow-lg transition-shadow animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-xl bg-gradient-primary shrink-0">
                      <FlaskConical className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="font-display font-semibold text-foreground mb-1">
                        {calc.title}
                      </h2>
                      <p className="text-sm text-muted-foreground mb-2">{calc.description}</p>
                      <p className="text-xs text-primary">{calc.status}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>

    <Footer />
  </div>
);

const Preview = () => (
  <PreviewGate>
    <PreviewIndex />
  </PreviewGate>
);

export default Preview;
