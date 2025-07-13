import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Baby, Heart, BookOpen, Lightbulb, Sparkles } from "lucide-react";
import motherBabyImage from "@assets/image_1752428001266.png";
import heartImage from "@assets/image_1752428013534.png";

export default function Landing() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    window.location.href = "/api/login";
  };

  return (
    <div className="max-w-sm mx-auto min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-pink-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-16 w-16 h-16 bg-purple-200 rounded-full opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-20 w-12 h-12 bg-indigo-200 rounded-full opacity-25 animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-pink-300 rounded-full opacity-15 animate-pulse delay-500"></div>
      </div>

      {/* Hero Section */}
      <div className="relative flex flex-col justify-center px-8 py-12 min-h-screen">
        {/* Main illustration */}
        <div className="text-center mb-8 fade-in">
          <div className="relative mb-6">
            <div className="w-48 h-48 mx-auto bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center relative overflow-hidden shadow-2xl">
              <img 
                src={motherBabyImage} 
                alt="Mãe e bebê" 
                className="w-32 h-32 object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pink-200/20 to-transparent rounded-full"></div>
            </div>
            
            {/* Floating hearts */}
            <div className="absolute top-4 right-8 w-6 h-6 text-pink-400 animate-bounce">
              <Heart className="w-full h-full fill-current" />
            </div>
            <div className="absolute bottom-12 left-4 w-4 h-4 text-purple-400 animate-bounce delay-700">
              <Heart className="w-full h-full fill-current" />
            </div>
            <div className="absolute top-16 left-12 w-3 h-3 text-indigo-400 animate-bounce delay-1000">
              <Sparkles className="w-full h-full fill-current" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Baby<span className="text-pink-500">Journey</span>
          </h1>
          
          <p className="text-lg text-gray-700 mb-4 leading-relaxed font-medium">
            Viva cada momento mágico da sua gravidez com amor e cuidado
          </p>
          
          <p className="text-gray-600 text-sm">
            Uma jornada única, registrada com carinho
          </p>
        </div>

        {/* Features Preview */}
        <div className="space-y-4 mb-8 fade-in">
          <Card className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-5">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                  <Baby className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Desenvolvimento Semanal</h3>
                  <p className="text-sm text-gray-600">
                    Acompanhe o crescimento do seu bebê
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-5">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <BookOpen className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Diário Pessoal</h3>
                  <p className="text-sm text-gray-600">
                    Registre momentos especiais
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-5">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                  <Lightbulb className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Dicas Semanais</h3>
                  <p className="text-sm text-gray-600">
                    Orientações para cada fase
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="space-y-4 fade-in">
          <Card className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-3xl shadow-2xl border-0 overflow-hidden">
            <CardContent className="p-6 text-center relative">
              {/* Heart decoration */}
              <div className="absolute top-2 right-2 w-12 h-12 opacity-20">
                <img src={heartImage} alt="Heart" className="w-full h-full object-contain" />
              </div>
              
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Heart className="text-white" size={24} />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-3">
                Sua jornada começa aqui
              </h2>
              <p className="text-white/90 mb-6 text-base">
                Entre na sua conta e comece a viver essa experiência única
              </p>
              
              <Button 
                onClick={handleLogin} 
                disabled={isLoading}
                className="w-full bg-white text-purple-600 py-4 rounded-xl text-lg font-bold hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Entrando...</span>
                  </div>
                ) : (
                  <>
                    <Heart className="mr-2" size={20} />
                    Começar Minha Jornada
                  </>
                )}
              </Button>
              
              <p className="text-white/70 text-sm mt-4">
                Gratuito • Seguro • Personalizado
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
