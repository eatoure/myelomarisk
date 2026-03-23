import { useState } from "react";
import { ChevronLeft, ChevronRight, Mail, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import HeroBackdrop from "@/components/HeroBackdrop";
import { developers } from "@/data/developers";

const Developers = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextDeveloper = () => {
    setCurrentIndex((prev) => (prev + 1) % developers.length);
  };

  const prevDeveloper = () => {
    setCurrentIndex((prev) => (prev - 1 + developers.length) % developers.length);
  };

  const currentDev = developers[currentIndex];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow">
        {/* Hero */}
        <div className="relative overflow-hidden py-12 md:py-16">
          <HeroBackdrop variant="primary" />
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="font-display font-bold text-3xl md:text-5xl text-white mb-4">
              Development Team
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Meet the investigators behind MyelomaRisk.com
            </p>
          </div>
        </div>

        {/* Developer Carousel */}
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            {/* Navigation */}
            <div className="flex items-center justify-between mb-8">
              <Button
                variant="outline"
                size="icon"
                onClick={prevDeveloper}
                className="rounded-full"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              <div className="flex gap-2">
                {developers.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      index === currentIndex 
                        ? "bg-primary w-8" 
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={nextDeveloper}
                className="rounded-full"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Card */}
            <div 
              key={currentIndex}
              className="bg-card rounded-3xl shadow-card overflow-hidden animate-fade-in"
            >
              <div className="grid md:grid-cols-2">
                {/* Image */}
                <div className="relative h-64 md:h-auto">
                  <img
                    src={currentDev.image}
                    alt={currentDev.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent md:bg-gradient-to-r" />
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                  <div className="mb-4">
                    <h2 className="font-display font-bold text-2xl text-foreground mb-1">
                      {currentDev.name}
                    </h2>
                    <p className="text-primary font-medium">
                      {currentDev.title}
                    </p>
                  </div>

                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {currentDev.bio}
                  </p>

                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-foreground mb-2">Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentDev.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <a
                      href={`mailto:${currentDev.email}`}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      Email
                    </a>
                    <a
                      href={`https://x.com/${currentDev.twitter.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <X className="h-4 w-4" />
                      {currentDev.twitter}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Developers;
