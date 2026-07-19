import { HelpCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroBackdrop from "@/components/HeroBackdrop";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Has the MyelomaRisk Calculator been validated or approved by a regulatory body?",
    answer:
      'Those utilizing the MyelomaRisk Calculator should be aware and need to acknowledge that the website and Calculator are fully based on peer-reviewed published papers and its role is simply to make the published information available in one place and make the estimations easier. It hasn\'t received validation or endorsement by the United States Food and Drug Administration, the European Medicines Agency, or any equivalent entity. The Calculator is still in its development phase and is delivered "as is," devoid of any supplementary services.',
  },
  {
    question: "Can the Calculator change over time?",
    answer:
      "We reserve the right to implement changes to the Calculator based on new published information and at our discretion.",
  },
  {
    question: "Can I use the Calculator instead of talking to my doctor?",
    answer:
      "No. The Calculator serves purely as an analytical tool and is not meant to replace professional medical guidance. If you have concerns, consult your doctor.",
  },
  {
    question: "Do you collect or store my data?",
    answer:
      "We don't collect or store any data. All calculations are made on the user's own computer.",
  },
  {
    question: "Can I use the Calculator for commercial purposes?",
    answer:
      "This Calculator is designed for non-commercial use only. For commercial usage, contact S. Vincent Rajkumar or Shaji K. Kumar.",
    contact: true,
  },
];

const FAQ = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow">
        {/* Hero */}
        <div className="relative overflow-hidden py-12 md:py-16">
          <HeroBackdrop variant="primary" />
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="inline-flex p-3 rounded-2xl bg-white/20 mb-4">
              <HelpCircle className="h-8 w-8 text-white" />
            </div>
            <h1 className="font-display font-bold text-3xl md:text-5xl text-white mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              What you need to know before using the MyelomaRisk Calculator.
            </p>
          </div>
        </div>

        {/* FAQ List */}
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl mx-auto bg-card rounded-3xl shadow-card p-4 md:p-8">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-display font-semibold text-foreground">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.contact ? (
                      <>
                        This Calculator is designed for non-commercial use only. For commercial
                        usage, contact{" "}
                        <a
                          href="mailto:vincerk@gmail.com"
                          className="text-primary hover:underline"
                        >
                          S. Vincent Rajkumar
                        </a>{" "}
                        or{" "}
                        <a
                          href="mailto:kumarshaji@hotmail.com"
                          className="text-primary hover:underline"
                        >
                          Shaji K. Kumar
                        </a>
                        .
                      </>
                    ) : (
                      faq.answer
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
