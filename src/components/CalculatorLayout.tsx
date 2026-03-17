import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, ChevronDown } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import HeroBackdrop from "@/components/HeroBackdrop";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Author {
  name: string;
  role: string;
}

interface CalculatorLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  reference: {
    text: string;
    url: string;
  };
  authors: Author[];
}

const CalculatorLayout = ({
  title,
  description,
  children,
  reference,
  authors,
}: CalculatorLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow">
        {/* Page Header */}
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
              {title}
            </h1>
          </div>
        </div>

        {/* Calculator Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-2xl shadow-card p-6 md:p-8 animate-fade-in-up">
              <p className="text-muted-foreground mb-6">
                {description}
              </p>

              {children}
            </div>

            {/* Reference */}
            <div className="mt-6 p-4 rounded-xl bg-muted/50 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              <h3 className="font-semibold text-sm text-foreground mb-2">Reference</h3>
              <a 
                href={reference.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline inline-flex items-center gap-1"
              >
                {reference.text}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* Authors */}
            <Accordion type="single" collapsible className="mt-4 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
              <AccordionItem value="authors" className="border rounded-xl bg-card px-4">
                <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                  Authors
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {authors.map((author, index) => (
                      <li key={index} className="text-sm">
                        <span className="font-medium">{author.name}</span>
                        <span className="text-muted-foreground"> — {author.role}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CalculatorLayout;
