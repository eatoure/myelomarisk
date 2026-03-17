import { Link } from "react-router-dom";
import { LucideIcon, ExternalLink } from "lucide-react";

interface CalculatorCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
  isExternal?: boolean;
  delay?: number;
}

const CalculatorCard = ({ 
  title, 
  description, 
  icon: Icon, 
  to, 
  isExternal = false,
  delay = 0 
}: CalculatorCardProps) => {
  const content = (
    <div 
      className="card-calculator group cursor-pointer h-full"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-xl bg-gradient-primary text-white shadow-card group-hover:scale-110 transition-transform duration-300">
            <Icon className="h-6 w-6" />
          </div>
          {isExternal && (
            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          )}
        </div>
        
        <h3 className="font-display font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        <p className="text-sm text-muted-foreground flex-grow">
          {description}
        </p>

        <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          {isExternal ? "Visit Site" : "Calculate"} →
        </div>
      </div>
    </div>
  );

  if (isExternal) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" className="animate-fade-in-up block">
        {content}
      </a>
    );
  }

  return (
    <Link to={to} className="animate-fade-in-up block">
      {content}
    </Link>
  );
};

export default CalculatorCard;
