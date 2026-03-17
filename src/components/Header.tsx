import { Link, useLocation } from "react-router-dom";
import { Activity, Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2 rounded-xl bg-gradient-primary shadow-card group-hover:scale-105 transition-transform">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">
              MyelomaRisk
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isHome ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Calculators
            </Link>
            <Link 
              to="/developers" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === "/developers" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Team
            </Link>
            <a 
              href="https://msmart.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              mSMART.org
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 space-y-2 border-t border-border animate-fade-in">
            <Link 
              to="/" 
              className="block px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Calculators
            </Link>
            <Link 
              to="/developers" 
              className="block px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Team
            </Link>
            <a 
              href="https://msmart.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
            >
              mSMART.org
            </a>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
