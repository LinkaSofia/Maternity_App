import { useQuery } from "@tanstack/react-query";
import BabySizeComparison from "@/components/baby-size-comparison";
import Fetal3DModel from "@/components/fetal-3d-model";
import UserMenu from "@/components/user-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function Baby() {
  const [, setLocation] = useLocation();
  
  const { data: pregnancy } = useQuery({
    queryKey: ["/api/pregnancies/active"],
  });

  const calculateWeeksPregnant = () => {
    if (!pregnancy?.lastMenstrualPeriod) return 24; // Default for demo
    const lmp = new Date(pregnancy.lastMenstrualPeriod);
    const today = new Date();
    const diffInDays = Math.floor((today.getTime() - lmp.getTime()) / (1000 * 60 * 60 * 24));
    return Math.floor(diffInDays / 7);
  };

  const currentWeek = calculateWeeksPregnant();

  return (
    <div className="max-w-sm mx-auto bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex items-center gap-4">
          <button 
            onClick={() => setLocation('/home')}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold">Seu Bebê</h1>
            <p className="text-sm opacity-90">Semana {currentWeek} de gestação</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Modelo 3D Principal */}
        <Card className="bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 backdrop-blur-sm rounded-3xl shadow-xl border-0 overflow-hidden">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Desenvolvimento Fetal
            </CardTitle>
            <p className="text-gray-600">Semana {currentWeek}</p>
          </CardHeader>
          <CardContent className="flex justify-center pb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full blur-2xl opacity-40 animate-pulse"></div>
              <Fetal3DModel week={currentWeek} size="large" animated={true} />
            </div>
          </CardContent>
        </Card>

        {/* Comparação de Tamanho */}
        <BabySizeComparison week={currentWeek} detailed />
      </div>
    </div>
  );
}
