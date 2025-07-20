import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Sparkles, Star, Activity } from "lucide-react";

interface Fetal3DModelProps {
  week: number;
  size?: "small" | "medium" | "large";
  animated?: boolean;
}

export default function Fetal3DModel({ week, size = "medium", animated = true }: Fetal3DModelProps) {
  const [isMoving, setIsMoving] = useState(false);
  const [heartbeat, setHeartbeat] = useState(false);
  const [kickAnimation, setKickAnimation] = useState(false);

  useEffect(() => {
    if (!animated) return;

    // Heartbeat animation (starts around week 6)
    if (week >= 6) {
      const heartInterval = setInterval(() => {
        setHeartbeat(true);
        setTimeout(() => setHeartbeat(false), 300);
      }, 1000);
      
      // Movement animation (starts around week 16)
      if (week >= 16) {
        const movementInterval = setInterval(() => {
          setIsMoving(true);
          setTimeout(() => setIsMoving(false), 1500);
        }, 4000);

        // Kick animation (starts around week 20)
        if (week >= 20) {
          const kickInterval = setInterval(() => {
            setKickAnimation(true);
            setTimeout(() => setKickAnimation(false), 800);
          }, 6000);

          return () => {
            clearInterval(heartInterval);
            clearInterval(movementInterval);
            clearInterval(kickInterval);
          };
        }

        return () => {
          clearInterval(heartInterval);
          clearInterval(movementInterval);
        };
      }

      return () => clearInterval(heartInterval);
    }
  }, [week, animated]);

  const getFetalSize = () => {
    const baseSize = size === "small" ? 0.6 : size === "large" ? 1.4 : 1;
    if (week <= 4) return { scale: 0.2 * baseSize, opacity: 0.7 };
    if (week <= 8) return { scale: 0.3 * baseSize, opacity: 0.8 };
    if (week <= 12) return { scale: 0.45 * baseSize, opacity: 0.85 };
    if (week <= 16) return { scale: 0.6 * baseSize, opacity: 0.9 };
    if (week <= 20) return { scale: 0.75 * baseSize, opacity: 0.95 };
    if (week <= 24) return { scale: 0.85 * baseSize, opacity: 1 };
    if (week <= 28) return { scale: 0.95 * baseSize, opacity: 1 };
    if (week <= 32) return { scale: 1.05 * baseSize, opacity: 1 };
    if (week <= 36) return { scale: 1.15 * baseSize, opacity: 1 };
    return { scale: 1.25 * baseSize, opacity: 1 };
  };

  const getFetalPosition = () => {
    if (week <= 20) return { transform: "rotate(0deg)" };
    if (week <= 28) return { transform: "rotate(-10deg)" };
    if (week <= 32) return { transform: "rotate(-20deg)" };
    if (week <= 36) return { transform: "rotate(-35deg)" };
    return { transform: "rotate(-45deg)" }; // Head down position
  };

  const getFetalColor = () => {
    if (week <= 8) return "from-pink-200 via-pink-300 to-rose-300";
    if (week <= 12) return "from-pink-300 via-rose-300 to-purple-300";
    if (week <= 16) return "from-rose-300 via-purple-300 to-indigo-300";
    if (week <= 20) return "from-purple-300 via-indigo-300 to-blue-300";
    if (week <= 24) return "from-indigo-300 via-blue-300 to-cyan-300";
    if (week <= 28) return "from-blue-300 via-cyan-300 to-teal-300";
    if (week <= 32) return "from-cyan-300 via-teal-300 to-emerald-300";
    if (week <= 36) return "from-teal-300 via-emerald-300 to-green-300";
    return "from-emerald-300 via-green-300 to-lime-300";
  };

  const getFetalFeatures = () => {
    return {
      head: week >= 4,
      eyes: week >= 8,
      limbs: week >= 10,
      fingers: week >= 12,
      hair: week >= 20,
      nails: week >= 24,
      mature: week >= 36
    };
  };

  const getDevelopmentStage = () => {
    if (week <= 4) return "Célula em divisão";
    if (week <= 8) return "Embrião inicial";
    if (week <= 12) return "Órgãos se formando";
    if (week <= 16) return "Sexo definido";
    if (week <= 20) return "Movimentos ativos";
    if (week <= 24) return "Audição desenvolvida";
    if (week <= 28) return "Olhos se abrem";
    if (week <= 32) return "Respiração praticada";
    if (week <= 36) return "Posição de nascimento";
    return "Totalmente desenvolvido";
  };

  const sizeClasses = {
    small: "w-20 h-24",
    medium: "w-28 h-32",
    large: "w-36 h-40"
  };

  const { scale, opacity } = getFetalSize();
  const position = getFetalPosition();
  const colorClass = getFetalColor();
  const features = getFetalFeatures();
  const stage = getDevelopmentStage();

  return (
    <div className="relative flex flex-col items-center">
      {/* Womb environment */}
      <div className={`${sizeClasses[size]} relative mx-auto`} style={{ transform: `scale(${scale})`, opacity }}>
        {/* Amniotic fluid effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-cyan-100/20 to-teal-100/30 rounded-full blur-xl animate-pulse opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-200/20 via-cyan-200/15 to-teal-200/20 rounded-full blur-lg animate-pulse delay-700 opacity-30"></div>
        
        {/* Main fetal body */}
        <div 
          className={`relative w-full h-full bg-gradient-to-br ${colorClass} rounded-full flex flex-col items-center justify-center shadow-2xl border-2 border-white/40 transition-all duration-1000 ${
            isMoving ? 'animate-bounce' : ''
          } ${kickAnimation ? 'animate-pulse' : ''}`}
          style={position}
        >
          
          {/* Heartbeat effect */}
          {week >= 6 && heartbeat && (
            <div className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping opacity-60"></div>
          )}
          
          {/* Fetal head */}
          {features.head && (
            <div className="relative w-2/3 h-2/5 bg-gradient-to-br from-pink-200 to-rose-300 rounded-full mb-1 flex items-center justify-center">
              {/* Brain development indicator */}
              {week >= 8 && (
                <div className="w-1/2 h-1/2 bg-gradient-to-br from-purple-200 to-indigo-300 rounded-full opacity-60 animate-pulse"></div>
              )}
              
              {/* Eyes */}
              {features.eyes && (
                <div className="absolute top-2 flex space-x-1">
                  <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
                </div>
              )}
              
              {/* Hair */}
              {features.hair && (
                <div className="absolute -top-1 w-full h-2 bg-gradient-to-b from-amber-200 to-orange-200 rounded-t-full opacity-70"></div>
              )}
            </div>
          )}
          
          {/* Fetal body */}
          <div className="relative w-1/2 h-2/3 bg-gradient-to-br from-pink-300 to-rose-400 rounded-full flex items-center justify-center">
            {/* Spine development */}
            {week >= 6 && (
              <div className="absolute inset-y-0 left-1/2 w-px bg-purple-400 opacity-50"></div>
            )}
            
            {/* Heart */}
            {week >= 6 && (
              <div className={`absolute top-1 left-1/2 transform -translate-x-1/2 ${heartbeat ? 'animate-ping' : ''}`}>
                <Heart className="w-2 h-2 text-red-400 fill-current" />
              </div>
            )}
          </div>
          
          {/* Limbs */}
          {features.limbs && (
            <>
              {/* Arms */}
              <div className={`absolute top-1/3 left-0 w-1 h-4 bg-gradient-to-b ${colorClass} rounded-full shadow-sm transform rotate-12 ${kickAnimation ? 'animate-wiggle' : ''}`}></div>
              <div className={`absolute top-1/3 right-0 w-1 h-4 bg-gradient-to-b ${colorClass} rounded-full shadow-sm transform -rotate-12 ${kickAnimation ? 'animate-wiggle delay-100' : ''}`}></div>
              
              {/* Legs */}
              <div className={`absolute bottom-2 left-1/3 w-1 h-5 bg-gradient-to-b ${colorClass} rounded-full shadow-sm transform rotate-20 ${isMoving ? 'animate-wiggle delay-200' : ''}`}></div>
              <div className={`absolute bottom-2 right-1/3 w-1 h-5 bg-gradient-to-b ${colorClass} rounded-full shadow-sm transform -rotate-20 ${isMoving ? 'animate-wiggle delay-300' : ''}`}></div>
              
              {/* Fingers and toes */}
              {features.fingers && week >= 12 && (
                <>
                  <div className="absolute top-1/4 left-0 w-px h-2 bg-pink-400 rounded-full transform rotate-20 opacity-70"></div>
                  <div className="absolute top-1/4 right-0 w-px h-2 bg-pink-400 rounded-full transform -rotate-20 opacity-70"></div>
                </>
              )}
            </>
          )}
          
          {/* Umbilical cord */}
          {week >= 8 && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
              <div className="w-1 h-3 bg-gradient-to-b from-blue-300 to-purple-300 rounded-full opacity-60 animate-pulse"></div>
            </div>
          )}
          
          {/* Activity indicators */}
          {week >= 16 && isMoving && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Activity className="w-4 h-4 text-yellow-400 animate-pulse" />
            </div>
          )}
        </div>
        
        {/* Floating elements for ambiance */}
        <div className="absolute -top-1 -right-1 w-3 h-3 text-pink-400 animate-float">
          <Sparkles className="w-full h-full" />
        </div>
        <div className="absolute -bottom-1 -left-1 w-2 h-2 text-purple-400 animate-float delay-1000">
          <Star className="w-full h-full" />
        </div>
      </div>

      {/* Development info */}
      <div className="mt-3 text-center">
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-3 border border-pink-200 shadow-sm">
          <div className="flex items-center justify-center space-x-1 mb-2">
            <Star className="text-yellow-500" size={14} />
            <span className="text-sm font-bold text-gray-800">Semana {week}</span>
            <Star className="text-yellow-500" size={14} />
          </div>
          <p className="text-xs text-gray-600 mb-1">{stage}</p>
          
          {/* Development milestones */}
          <div className="flex justify-center space-x-2 mt-2">
            {week >= 6 && <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" title="Coração batendo"></div>}
            {week >= 8 && <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-200" title="Cérebro desenvolvendo"></div>}
            {week >= 16 && <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-400" title="Movimentos ativos"></div>}
            {week >= 20 && <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-600" title="Audição desenvolvida"></div>}
          </div>
        </div>
      </div>
    </div>
  );
}