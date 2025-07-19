import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Baby, Sparkles, Star } from "lucide-react";

interface Baby3DModelProps {
  week: number;
  size?: "small" | "medium" | "large";
}

export default function Baby3DModel({ week, size = "medium" }: Baby3DModelProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 2000);
    return () => clearTimeout(timer);
  }, [week]);

  const getBabySize = () => {
    if (week <= 8) return { width: 20, height: 20 };
    if (week <= 12) return { width: 30, height: 30 };
    if (week <= 16) return { width: 40, height: 40 };
    if (week <= 20) return { width: 50, height: 50 };
    if (week <= 24) return { width: 60, height: 60 };
    if (week <= 28) return { width: 70, height: 70 };
    if (week <= 32) return { width: 80, height: 80 };
    if (week <= 36) return { width: 90, height: 90 };
    return { width: 100, height: 100 };
  };

  const getBabyColor = () => {
    if (week <= 8) return "from-pink-200 to-pink-300";
    if (week <= 12) return "from-pink-300 to-purple-300";
    if (week <= 16) return "from-purple-300 to-indigo-300";
    if (week <= 20) return "from-indigo-300 to-blue-300";
    if (week <= 24) return "from-blue-300 to-green-300";
    if (week <= 28) return "from-green-300 to-yellow-300";
    if (week <= 32) return "from-yellow-300 to-orange-300";
    if (week <= 36) return "from-orange-300 to-red-300";
    return "from-red-300 to-pink-400";
  };

  const getBabyFeatures = () => {
    if (week <= 8) return { eyes: false, mouth: false, limbs: false };
    if (week <= 12) return { eyes: true, mouth: false, limbs: false };
    if (week <= 16) return { eyes: true, mouth: true, limbs: false };
    if (week <= 20) return { eyes: true, mouth: true, limbs: true };
    return { eyes: true, mouth: true, limbs: true };
  };

  const getBabyDescription = () => {
    if (week <= 4) return "Célula fertilizada";
    if (week <= 8) return "Embrião em desenvolvimento";
    if (week <= 12) return "Órgãos se formando";
    if (week <= 16) return "Movimentos começam";
    if (week <= 20) return "Gênero visível";
    if (week <= 24) return "Sistema respiratório";
    if (week <= 28) return "Olhos se abrem";
    if (week <= 32) return "Ganho de peso";
    if (week <= 36) return "Posição de parto";
    return "Pronto para nascer!";
  };

  const getFruitComparison = () => {
    if (week <= 4) return "Grão de arroz";
    if (week <= 8) return "Grão de feijão";
    if (week <= 12) return "Limão";
    if (week <= 16) return "Maçã";
    if (week <= 20) return "Banana";
    if (week <= 24) return "Milho";
    if (week <= 28) return "Berinjela";
    if (week <= 32) return "Abacaxi";
    if (week <= 36) return "Melão";
    return "Melancia";
  };

  const sizeClasses = {
    small: "w-16 h-16",
    medium: "w-24 h-24",
    large: "w-32 h-32"
  };

  const { width, height } = getBabySize();
  const colorClass = getBabyColor();
  const features = getBabyFeatures();
  const description = getBabyDescription();
  const fruitComparison = getFruitComparison();

  return (
    <div className="relative">
      {/* Baby 3D Model */}
      <div className={`${sizeClasses[size]} relative mx-auto`}>
        {/* Glow effect */}
        <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} rounded-full blur-lg opacity-50 animate-pulse`}></div>
        
        {/* Main baby body */}
        <div className={`relative w-full h-full bg-gradient-to-br ${colorClass} rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20 transform transition-all duration-500 ${
          isAnimating ? 'scale-110 rotate-12' : 'scale-100 rotate-0'
        }`}>
          
          {/* Baby face */}
          <div className="relative w-3/4 h-3/4 flex flex-col items-center justify-center">
            {/* Eyes */}
            {features.eyes && (
              <div className="flex space-x-2 mb-1">
                <div className="w-2 h-2 bg-black rounded-full animate-blink"></div>
                <div className="w-2 h-2 bg-black rounded-full animate-blink delay-1000"></div>
              </div>
            )}
            
            {/* Mouth */}
            {features.mouth && (
              <div className="w-3 h-1 bg-pink-400 rounded-full mt-1"></div>
            )}
            
            {/* Cheeks */}
            <div className="absolute top-1 left-2 w-1 h-1 bg-pink-300 rounded-full opacity-60"></div>
            <div className="absolute top-1 right-2 w-1 h-1 bg-pink-300 rounded-full opacity-60"></div>
          </div>
          
          {/* Limbs */}
          {features.limbs && (
            <>
              <div className="absolute top-2 left-1 w-1 h-2 bg-gradient-to-b ${colorClass} rounded-full"></div>
              <div className="absolute top-2 right-1 w-1 h-2 bg-gradient-to-b ${colorClass} rounded-full"></div>
              <div className="absolute bottom-2 left-2 w-1 h-2 bg-gradient-to-t ${colorClass} rounded-full"></div>
              <div className="absolute bottom-2 right-2 w-1 h-2 bg-gradient-to-t ${colorClass} rounded-full"></div>
            </>
          )}
        </div>
        
        {/* Floating hearts */}
        <div className="absolute -top-2 -right-2 w-4 h-4 text-pink-400 animate-bounce">
          <Heart className="w-full h-full fill-current" />
        </div>
        <div className="absolute -bottom-2 -left-2 w-3 h-3 text-purple-400 animate-bounce delay-700">
          <Heart className="w-full h-full fill-current" />
        </div>
        <div className="absolute top-1/2 -right-4 w-2 h-2 text-indigo-400 animate-bounce delay-1000">
          <Sparkles className="w-full h-full" />
        </div>
      </div>

      {/* Information card */}
      <div className="mt-4 text-center">
        <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-3 border border-pink-200">
          <div className="flex items-center justify-center space-x-1 mb-2">
            <Star className="text-yellow-500" size={16} />
            <span className="text-sm font-bold text-gray-800">Semana {week}</span>
            <Star className="text-yellow-500" size={16} />
          </div>
          <p className="text-xs text-gray-600 mb-1">{description}</p>
          <p className="text-xs text-gray-500">Tamanho: {fruitComparison}</p>
        </div>
      </div>

      {/* Development milestones */}
      {week > 0 && (
        <div className="mt-3">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-2 border border-green-200">
            <div className="flex items-center justify-center space-x-1">
              <Baby className="text-green-600" size={14} />
              <span className="text-xs text-green-700 font-medium">
                {week <= 12 ? "Primeiro trimestre" : 
                 week <= 28 ? "Segundo trimestre" : "Terceiro trimestre"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}