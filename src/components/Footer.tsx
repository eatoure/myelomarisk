import { ExternalLink, X } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-navy text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="font-display font-semibold text-lg mb-3">
              Learn More
            </h3>
            <a 
              href="https://msmart.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-accent hover:text-white transition-colors"
            >
              Visit mSMART.org for additional information
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <div>
            <h3 className="font-display font-semibold text-lg mb-3">
              Follow Us
            </h3>
            <div className="space-y-2">
              <a 
                href="https://x.com/MayoMyeloma" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-accent hover:text-white transition-colors text-sm"
              >
                <X className="h-4 w-4" />
                S. Vincent Rajkumar (@MayoMyeloma)
              </a>
              <a 
                href="https://x.com/myelomaMD" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-accent hover:text-white transition-colors text-sm"
              >
                <X className="h-4 w-4" />
                Shaji Kumar (@myelomaMD)
              </a>
              <a 
                href="https://x.com/eamadoutoure" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-accent hover:text-white transition-colors text-sm"
              >
                <X className="h-4 w-4" />
                E. Amadou Touré (@eamadoutoure)
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-white/60">
          <p>
            © {new Date().getFullYear()} MyelomaRisk. For research and educational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
