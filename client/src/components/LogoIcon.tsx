interface LogoIconProps {
  className?: string;
  size?: number;
}

export default function LogoIcon({ className = "", size = 20 }: LogoIconProps) {
  return (
    <img 
      src="/logo.png" 
      alt="BabyJourney" 
      className={`rounded-full ${className}`}
      style={{ width: size, height: size }}
    />
  );
}