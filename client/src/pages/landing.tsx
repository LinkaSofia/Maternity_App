import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Baby, Heart, BookOpen, Lightbulb } from "lucide-react";

export default function Landing() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    window.location.href = "/api/login";
  };

  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen shadow-2xl">
      {/* Hero Section */}
      <div className="h-screen gradient-bg flex flex-col justify-center px-8">
        <div className="text-center mb-8 fade-in">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Baby className="text-white text-2xl" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">BabyJourney</h1>
          <p className="text-gray-600 text-lg mb-4">
            Acompanhe sua gestação com carinho
          </p>
          <p className="text-gray-500 text-sm">
            Uma jornada única, registrada com amor
          </p>
        </div>

        {/* Features Preview */}
        <div className="space-y-4 mb-8 fade-in">
          <Card className="bg-white/90 backdrop-blur-sm border-0 card-shadow">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <Baby className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Desenvolvimento Semanal</h3>
                  <p className="text-sm text-gray-600">
                    Acompanhe o crescimento do seu bebê
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 card-shadow">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                  <BookOpen className="text-secondary" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Diário Pessoal</h3>
                  <p className="text-sm text-gray-600">
                    Registre momentos especiais
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 card-shadow">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-sage/20 rounded-full flex items-center justify-center">
                  <Lightbulb className="text-sage" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Dicas Semanais</h3>
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
          <Button 
            onClick={handleLogin} 
            disabled={isLoading}
            className="w-full bg-primary text-white py-6 rounded-xl text-lg font-semibold hover:bg-primary/90 smooth-transition"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Entrando...</span>
              </div>
            ) : (
              <>
                <Heart className="mr-2" size={20} />
                Começar Minha Jornada
              </>
            )}
          </Button>
          
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Seguro, gratuito e fácil de usar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
