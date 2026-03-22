import { useState, useEffect } from "react";
import { 
  Activity, 
  Droplets, 
  Bone, 
  Heart, 
  User2, 
  FlaskConical,
  Users,
  Microscope
} from "lucide-react";
import DisclaimerModal from "@/components/DisclaimerModal";
import CalculatorCard from "@/components/CalculatorCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroBackdrop from "@/components/HeroBackdrop";

const Index = () => {
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("myeloma-risk-disclaimer-accepted");
    if (accepted === "true") {
      setDisclaimerAccepted(true);
      setShowContent(true);
    }
  }, []);

  const handleDisclaimerAccept = () => {
    setDisclaimerAccepted(true);
    setTimeout(() => setShowContent(true), 300);
  };

  const calculators = [
    {
      title: "Smoldering Multiple Myeloma: IMWG 2020 Risk Stratification and IMWG Scoring System",
      description: "Calculate 2-year progression risk using the IMWG risk stratification model",
      icon: Activity,
      to: "/smoldering-myeloma",
    },
    {
      title: "Smoldering Multiple Myeloma: Genomic IMWG Risk Stratification",
      description: "Combine IMWG 2020 risk status with genomic drivers to refine 2-year progression risk",
      icon: Activity,
      to: "/smoldering-myeloma-genomic",
    },
    {
      title: "Multiple Myeloma IMWG Risk Stratification",
      description: "Risk stratification and prognosis estimation for newly diagnosed patients",
      icon: Droplets,
      to: "/multiple-myeloma",
    },
    {
      title: "MGUS Prognosis",
      description: "Assess absolute risk of progression over 20 years",
      icon: Microscope,
      to: "/mgus-prognosis",
    },
    {
      title: "MGUS: Bone Marrow Check",
      description: "iSTOPMM risk model for bone marrow assessment",
      icon: Bone,
      to: "https://istopmm.com/riskmodel/",
      isExternal: true,
    },
    {
      title: "MGUS: Light Chain Criteria",
      description: "Diagnosis criteria for light chain MGUS",
      icon: FlaskConical,
      to: "https://istopmm.com/lcmgus/",
      isExternal: true,
    },
    {
      title: "Amyloidosis",
      description: "Stage AL amyloidosis using the Mayo 2012 biomarker model",
      icon: Heart,
      to: "/amyloidosis",
    },
    {
      title: "Frailty Classification",
      description: "Assess frailty status for treatment decisions",
      icon: User2,
      to: "/frailty",
    },
    {
      title: "Waldenström Macroglobulinemia",
      description: "Risk stratification and 5-year survival estimation",
      icon: Droplets,
      to: "/waldenstrom",
    },
    {
      title: "Development Team",
      description: "Meet the Mayo Clinic researchers behind MyelomaRisk",
      icon: Users,
      to: "/developers",
    },
  ];

  return (
    <>
      {!disclaimerAccepted && (
        <DisclaimerModal onAccept={handleDisclaimerAccept} />
      )}

      <div className={`min-h-screen flex flex-col transition-opacity duration-500 ${showContent ? "opacity-100" : "opacity-0"}`}>
        <Header />

        {/* Hero Section */}
        <section className="relative overflow-hidden text-white py-16 md:py-24">
          <HeroBackdrop variant="hero" />
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="animate-fade-in-up">
              <h1 className="font-display font-bold text-4xl md:text-6xl mb-4">
                MyelomaRisk
              </h1>
              <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto animate-fade-in-delay">
                Simplifying the complex world of myeloma prognosis...
                <br />
                <span className="text-blue-accent">one patient at a time</span>
              </p>
            </div>
          </div>
        </section>

        {/* Calculator Grid */}
        <main className="flex-grow py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="font-display font-semibold text-2xl md:text-3xl text-foreground mb-3">
                Risk Calculators
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Select a calculator to assess risk and prognosis for myeloma-related conditions
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {calculators.map((calc, index) => (
                <CalculatorCard
                  key={calc.title}
                  title={calc.title}
                  description={calc.description}
                  icon={calc.icon}
                  to={calc.to}
                  isExternal={calc.isExternal}
                  delay={index * 50}
                />
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Index;
