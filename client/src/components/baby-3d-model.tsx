interface Baby3DModelProps {
  week: number;
  size?: "small" | "medium" | "large";
}

export default function Baby3DModel({ week, size = "medium" }: Baby3DModelProps) {
  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "w-16 h-16";
      case "medium":
        return "w-24 h-24";
      case "large":
        return "w-32 h-32";
      default:
        return "w-24 h-24";
    }
  };

  const getBabyModel = () => {
    // Diferentes modelos baseados na semana
    if (week <= 8) {
      // Embrião inicial
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="embryoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffeaa7" />
              <stop offset="100%" stopColor="#fdcb6e" />
            </linearGradient>
            <filter id="shadow">
              <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.3)" />
            </filter>
          </defs>
          
          {/* Corpo do embrião */}
          <ellipse cx="50" cy="60" rx="12" ry="18" fill="url(#embryoGradient)" filter="url(#shadow)" />
          
          {/* Cabeça */}
          <circle cx="50" cy="35" r="15" fill="url(#embryoGradient)" filter="url(#shadow)" />
          
          {/* Brotos dos membros */}
          <ellipse cx="38" cy="55" rx="4" ry="8" fill="url(#embryoGradient)" transform="rotate(-20 38 55)" />
          <ellipse cx="62" cy="55" rx="4" ry="8" fill="url(#embryoGradient)" transform="rotate(20 62 55)" />
          <ellipse cx="42" cy="70" rx="4" ry="8" fill="url(#embryoGradient)" transform="rotate(-15 42 70)" />
          <ellipse cx="58" cy="70" rx="4" ry="8" fill="url(#embryoGradient)" transform="rotate(15 58 70)" />
          
          {/* Detalhes faciais básicos */}
          <circle cx="47" cy="32" r="1.5" fill="#2d3436" />
          <circle cx="53" cy="32" r="1.5" fill="#2d3436" />
        </svg>
      );
    } else if (week <= 12) {
      // Feto inicial
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="fetusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fab1a0" />
              <stop offset="100%" stopColor="#e17055" />
            </linearGradient>
            <filter id="shadow">
              <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.3)" />
            </filter>
          </defs>
          
          {/* Corpo */}
          <ellipse cx="50" cy="65" rx="15" ry="22" fill="url(#fetusGradient)" filter="url(#shadow)" />
          
          {/* Cabeça */}
          <circle cx="50" cy="35" r="18" fill="url(#fetusGradient)" filter="url(#shadow)" />
          
          {/* Braços */}
          <ellipse cx="35" cy="55" rx="5" ry="12" fill="url(#fetusGradient)" transform="rotate(-25 35 55)" />
          <ellipse cx="65" cy="55" rx="5" ry="12" fill="url(#fetusGradient)" transform="rotate(25 65 55)" />
          
          {/* Pernas */}
          <ellipse cx="43" cy="80" rx="5" ry="15" fill="url(#fetusGradient)" transform="rotate(-10 43 80)" />
          <ellipse cx="57" cy="80" rx="5" ry="15" fill="url(#fetusGradient)" transform="rotate(10 57 80)" />
          
          {/* Rosto */}
          <circle cx="46" cy="32" r="2" fill="#2d3436" />
          <circle cx="54" cy="32" r="2" fill="#2d3436" />
          <ellipse cx="50" cy="38" rx="2" ry="1" fill="#2d3436" />
        </svg>
      );
    } else if (week <= 20) {
      // Feto desenvolvido
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="babyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffeaa7" />
              <stop offset="100%" stopColor="#fdcb6e" />
            </linearGradient>
            <filter id="shadow">
              <feDropShadow dx="3" dy="3" stdDeviation="3" floodColor="rgba(0,0,0,0.3)" />
            </filter>
          </defs>
          
          {/* Corpo */}
          <ellipse cx="50" cy="65" rx="18" ry="25" fill="url(#babyGradient)" filter="url(#shadow)" />
          
          {/* Cabeça */}
          <circle cx="50" cy="32" r="20" fill="url(#babyGradient)" filter="url(#shadow)" />
          
          {/* Braços */}
          <ellipse cx="32" cy="55" rx="6" ry="15" fill="url(#babyGradient)" transform="rotate(-30 32 55)" />
          <ellipse cx="68" cy="55" rx="6" ry="15" fill="url(#babyGradient)" transform="rotate(30 68 55)" />
          
          {/* Pernas */}
          <ellipse cx="42" cy="85" rx="6" ry="18" fill="url(#babyGradient)" transform="rotate(-15 42 85)" />
          <ellipse cx="58" cy="85" rx="6" ry="18" fill="url(#babyGradient)" transform="rotate(15 58 85)" />
          
          {/* Rosto desenvolvido */}
          <circle cx="45" cy="28" r="2.5" fill="#2d3436" />
          <circle cx="55" cy="28" r="2.5" fill="#2d3436" />
          <ellipse cx="50" cy="35" rx="3" ry="1.5" fill="#2d3436" />
          <path d="M 47 40 Q 50 42 53 40" stroke="#2d3436" strokeWidth="1" fill="none" />
          
          {/* Cabelo */}
          <path d="M 32 20 Q 50 15 68 20" stroke="#8b4513" strokeWidth="2" fill="none" />
        </svg>
      );
    } else if (week <= 30) {
      // Bebê quase formado
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="developedBabyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fab1a0" />
              <stop offset="100%" stopColor="#e17055" />
            </linearGradient>
            <filter id="shadow">
              <feDropShadow dx="3" dy="3" stdDeviation="3" floodColor="rgba(0,0,0,0.3)" />
            </filter>
          </defs>
          
          {/* Corpo maior */}
          <ellipse cx="50" cy="68" rx="22" ry="28" fill="url(#developedBabyGradient)" filter="url(#shadow)" />
          
          {/* Cabeça */}
          <circle cx="50" cy="30" r="22" fill="url(#developedBabyGradient)" filter="url(#shadow)" />
          
          {/* Braços */}
          <ellipse cx="28" cy="58" rx="7" ry="18" fill="url(#developedBabyGradient)" transform="rotate(-35 28 58)" />
          <ellipse cx="72" cy="58" rx="7" ry="18" fill="url(#developedBabyGradient)" transform="rotate(35 72 58)" />
          
          {/* Pernas */}
          <ellipse cx="40" cy="90" rx="7" ry="20" fill="url(#developedBabyGradient)" transform="rotate(-20 40 90)" />
          <ellipse cx="60" cy="90" rx="7" ry="20" fill="url(#developedBabyGradient)" transform="rotate(20 60 90)" />
          
          {/* Rosto mais detalhado */}
          <circle cx="44" cy="26" r="3" fill="#2d3436" />
          <circle cx="56" cy="26" r="3" fill="#2d3436" />
          <ellipse cx="50" cy="33" rx="3" ry="2" fill="#2d3436" />
          <path d="M 46 38 Q 50 40 54 38" stroke="#2d3436" strokeWidth="1.5" fill="none" />
          
          {/* Cabelo mais desenvolvido */}
          <path d="M 30 18 Q 50 12 70 18" stroke="#8b4513" strokeWidth="3" fill="none" />
          <path d="M 32 20 Q 50 15 68 20" stroke="#8b4513" strokeWidth="2" fill="none" />
          
          {/* Bochecha */}
          <circle cx="38" cy="32" r="3" fill="#fab1a0" opacity="0.6" />
          <circle cx="62" cy="32" r="3" fill="#fab1a0" opacity="0.6" />
        </svg>
      );
    } else {
      // Bebê pronto para nascer
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="fullBabyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffeaa7" />
              <stop offset="100%" stopColor="#fdcb6e" />
            </linearGradient>
            <filter id="shadow">
              <feDropShadow dx="4" dy="4" stdDeviation="4" floodColor="rgba(0,0,0,0.3)" />
            </filter>
          </defs>
          
          {/* Corpo completo */}
          <ellipse cx="50" cy="70" rx="25" ry="30" fill="url(#fullBabyGradient)" filter="url(#shadow)" />
          
          {/* Cabeça */}
          <circle cx="50" cy="28" r="24" fill="url(#fullBabyGradient)" filter="url(#shadow)" />
          
          {/* Braços */}
          <ellipse cx="25" cy="60" rx="8" ry="20" fill="url(#fullBabyGradient)" transform="rotate(-40 25 60)" />
          <ellipse cx="75" cy="60" rx="8" ry="20" fill="url(#fullBabyGradient)" transform="rotate(40 75 60)" />
          
          {/* Pernas */}
          <ellipse cx="38" cy="95" rx="8" ry="22" fill="url(#fullBabyGradient)" transform="rotate(-25 38 95)" />
          <ellipse cx="62" cy="95" rx="8" ry="22" fill="url(#fullBabyGradient)" transform="rotate(25 62 95)" />
          
          {/* Rosto completo */}
          <circle cx="43" cy="24" r="3.5" fill="#2d3436" />
          <circle cx="57" cy="24" r="3.5" fill="#2d3436" />
          <ellipse cx="50" cy="31" rx="3.5" ry="2" fill="#2d3436" />
          <path d="M 45 36 Q 50 38 55 36" stroke="#2d3436" strokeWidth="2" fill="none" />
          
          {/* Cabelo completo */}
          <path d="M 28 16 Q 50 10 72 16" stroke="#8b4513" strokeWidth="4" fill="none" />
          <path d="M 30 18 Q 50 12 70 18" stroke="#8b4513" strokeWidth="3" fill="none" />
          <path d="M 32 20 Q 50 15 68 20" stroke="#8b4513" strokeWidth="2" fill="none" />
          
          {/* Bochechas */}
          <circle cx="36" cy="30" r="4" fill="#fab1a0" opacity="0.6" />
          <circle cx="64" cy="30" r="4" fill="#fab1a0" opacity="0.6" />
          
          {/* Detalhes extras */}
          <circle cx="47" cy="21" r="1" fill="#ffffff" opacity="0.8" />
          <circle cx="59" cy="21" r="1" fill="#ffffff" opacity="0.8" />
        </svg>
      );
    }
  };

  return (
    <div className={`${getSizeClasses()} flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-full p-2 shadow-lg`}>
      {getBabyModel()}
    </div>
  );
}