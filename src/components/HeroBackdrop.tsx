import { cn } from "@/lib/utils";

type HeroBackdropVariant = "hero" | "primary";

interface HeroBackdropProps {
  variant?: HeroBackdropVariant;
  className?: string;
}

const overlays: Record<HeroBackdropVariant, string> = {
  hero: "bg-gradient-hero opacity-50",
  primary: "bg-gradient-primary opacity-50",
};

const HeroBackdrop = ({ variant = "hero", className }: HeroBackdropProps) => {
  return (
    <div className={cn("absolute inset-0 -z-10 overflow-hidden pointer-events-none", className)}>
      <div className="absolute inset-0 bg-navy" />
      <video
        className="hero-video absolute inset-0 h-full w-full object-cover opacity-75"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src="/videos/combined_video.mp4" type="video/mp4" />
      </video>
      <div className={cn("absolute inset-0", overlays[variant])} />
      <div className="absolute inset-0 bg-black/15" />
    </div>
  );
};

export default HeroBackdrop;
