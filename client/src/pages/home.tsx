import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import NavigationTabs from "@/components/navigation-tabs";
import PregnancyProgress from "@/components/pregnancy-progress";
import BabySizeComparison from "@/components/baby-size-comparison";
import FloatingActionButton from "@/components/floating-action-button";
import Header from "@/components/header";
import Baby3DModel from "@/components/baby-3d-model";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Weight, Clock, TrendingUp, Heart, Baby, Sparkles, Star, BookOpen, Stethoscope, ArrowRight, Activity, ShoppingCart, Camera, Dumbbell, ChefHat, Pill, FileText, Users } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");
  const { user } = useAuth();
  const [location, navigate] = useLocation();

  const { data: pregnancy } = useQuery({
    queryKey: ["/api/pregnancies/active"],
  });

  const { data: recentEntries } = useQuery({
    queryKey: ["/api/diary"],
    enabled: !!user,
  });

  const { data: upcomingAppointments } = useQuery({
    queryKey: ["/api/appointments/upcoming"],
    enabled: !!user,
  });

  const calculateWeeksPregnant = () => {
    if (!pregnancy?.lastMenstrualPeriod) return 0;
    const lmp = new Date(pregnancy.lastMenstrualPeriod);
    const today = new Date();
    const diffInDays = Math.floor((today.getTime() - lmp.getTime()) / (1000 * 60 * 60 * 24));
    return Math.floor(diffInDays / 7);
  };

  const currentWeek = calculateWeeksPregnant();
  const progressPercentage = Math.min((currentWeek / 40) * 100, 100);

  return (
    <div className="max-w-sm mx-auto bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 min-h-screen shadow-2xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-1000"></div>
        <div className="relative z-10">
          <div className="mb-4 flex items-center gap-4">
            <img 
              src="/logo.png" 
              alt="BabyJourney Logo" 
              className="w-12 h-12 rounded-full bg-white/10 p-1"
            />
            <Header 
              title={`Olá, ${user?.firstName || "Mamãe"}!`}
              subtitle={`Semana ${currentWeek} de gestação`}
              showUserMenu={true}
            />
          </div>

          <PregnancyProgress 
            currentWeek={currentWeek} 
            percentage={progressPercentage}
          />
        </div>
      </div>

      <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Home Tab Content */}
      {activeTab === "home" && (
        <div className="p-6 space-y-6">
          {/* Modelo 3D do Bebê - Destaque Principal */}
          <Card className="bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 backdrop-blur-sm rounded-3xl card-shadow border-0 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-200/30 to-purple-200/30 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-indigo-200/30 to-blue-200/30 rounded-full translate-y-12 -translate-x-12"></div>
            <CardContent className="p-8 text-center relative z-10">
              <div className="mb-6">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <Star className="text-yellow-500" size={20} />
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    Seu Bebê - Semana {currentWeek}
                  </h2>
                  <Star className="text-yellow-500" size={20} />
                </div>
                <p className="text-gray-700 text-sm font-medium">
                  {currentWeek <= 12 ? "Primeiro trimestre" : 
                   currentWeek <= 28 ? "Segundo trimestre" : "Terceiro trimestre"}
                </p>
              </div>
              
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
                  <Baby3DModel week={currentWeek} size="large" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-pink-200 to-purple-200 rounded-2xl p-4 border border-pink-300/50">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <Heart className="text-pink-600" size={18} />
                  <span className="text-sm font-bold text-gray-800">
                    Desenvolvimento atual
                  </span>
                  <Heart className="text-pink-600" size={18} />
                </div>
                <BabySizeComparison week={currentWeek} />
              </div>
            </CardContent>
          </Card>

          {/* Esta Semana - Informações Resumidas */}
          <Card className="bg-gradient-to-br from-white to-pink-50 backdrop-blur-sm rounded-2xl card-shadow border-0">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Sparkles className="mr-2 text-pink-500" size={20} />
                Resumo da Semana
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl p-4 text-center border border-pink-200">
                  <Calendar className="mx-auto text-pink-600 mb-2" size={24} />
                  <div className="text-lg font-bold text-gray-800">{currentWeek}</div>
                  <div className="text-xs text-gray-600">Semanas</div>
                </div>
                <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl p-4 text-center border border-purple-200">
                  <TrendingUp className="mx-auto text-purple-600 mb-2" size={24} />
                  <div className="text-lg font-bold text-gray-800">{Math.round(progressPercentage)}%</div>
                  <div className="text-xs text-gray-600">Progresso</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 backdrop-blur-sm rounded-2xl card-shadow border-0 border border-green-200">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-200 to-green-300 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
                  <Weight className="text-green-700" size={20} />
                </div>
                <p className="text-sm text-gray-700 font-medium">Ganho de Peso</p>
                <p className="text-lg font-semibold text-gray-800">
                  {pregnancy?.currentWeight && pregnancy?.prePregnancyWeight
                    ? `+${(pregnancy.currentWeight - pregnancy.prePregnancyWeight).toFixed(1)}kg`
                    : "-- kg"}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 backdrop-blur-sm rounded-2xl card-shadow border-0 border border-blue-200">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
                  <Calendar className="text-blue-700" size={20} />
                </div>
                <p className="text-sm text-gray-700 font-medium">Próxima Consulta</p>
                <p className="text-lg font-semibold text-gray-800">
                  {upcomingAppointments?.[0]?.date
                    ? new Date(upcomingAppointments[0].date).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit"
                      })
                    : "Não agendada"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions - Diário e Consultas */}
          <div className="grid grid-cols-1 gap-4">
            <Card 
              className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl card-shadow border-0 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={() => navigate("/diary")}
            >
              <CardContent className="p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <BookOpen className="text-white" size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Meu Diário</h3>
                      <p className="text-sm opacity-90">
                        Registre seus sentimentos e momentos especiais
                      </p>
                      <p className="text-xs opacity-70 mt-1">
                        {recentEntries?.length || 0} entradas registradas
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="text-white/80" size={24} />
                </div>
              </CardContent>
            </Card>

            <Card 
              className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl card-shadow border-0 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={() => navigate("/appointments")}
            >
              <CardContent className="p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Stethoscope className="text-white" size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Consultas</h3>
                      <p className="text-sm opacity-90">
                        Gerencie seus compromissos médicos
                      </p>
                      <p className="text-xs opacity-70 mt-1">
                        {upcomingAppointments?.[0]?.date
                          ? `Próxima: ${new Date(upcomingAppointments[0].date).toLocaleDateString("pt-BR")}`
                          : "Nenhuma consulta agendada"}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="text-white/80" size={24} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* New Features Navigation */}
          <Card className="bg-gradient-to-br from-white to-gray-50 rounded-2xl card-shadow border-0">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Sparkles className="mr-2 text-indigo-500" size={20} />
                Ferramentas de Acompanhamento
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {/* Weight Tracking */}
                <div 
                  onClick={() => navigate("/weight-tracking")}
                  className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-xl cursor-pointer hover:shadow-md transition-all hover:scale-105 border border-green-200"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Weight className="text-green-600" size={16} />
                    <span className="text-sm font-semibold text-gray-800">Peso</span>
                  </div>
                  <p className="text-xs text-gray-600">Controle de peso com gráficos</p>
                </div>

                {/* Kick Counter */}
                <div 
                  onClick={() => navigate("/kick-counter")}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-xl cursor-pointer hover:shadow-md transition-all hover:scale-105 border border-blue-200"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Activity className="text-blue-600" size={16} />
                    <span className="text-sm font-semibold text-gray-800">Chutes</span>
                  </div>
                  <p className="text-xs text-gray-600">Contador de chutes do bebê</p>
                </div>

                {/* Shopping List */}
                <div 
                  onClick={() => navigate("/shopping-list")}
                  className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-xl cursor-pointer hover:shadow-md transition-all hover:scale-105 border border-purple-200"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <ShoppingCart className="text-purple-600" size={16} />
                    <span className="text-sm font-semibold text-gray-800">Compras</span>
                  </div>
                  <p className="text-xs text-gray-600">Lista de enxoval e necessidades</p>
                </div>

                {/* Belly Photos */}
                <div 
                  onClick={() => navigate("/belly-photos")}
                  className="bg-gradient-to-br from-pink-50 to-pink-100 p-3 rounded-xl cursor-pointer hover:shadow-md transition-all hover:scale-105 border border-pink-200"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Camera className="text-pink-600" size={16} />
                    <span className="text-sm font-semibold text-gray-800">Fotos</span>
                  </div>
                  <p className="text-xs text-gray-600">Timeline da barriga</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Health & Wellness */}
          <Card className="bg-gradient-to-br from-white to-gray-50 rounded-2xl card-shadow border-0">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Heart className="mr-2 text-red-500" size={20} />
                Saúde & Bem-estar
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {/* Exercises */}
                <div 
                  onClick={() => navigate("/exercises")}
                  className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 rounded-xl cursor-pointer hover:shadow-md transition-all hover:scale-105 border border-orange-200"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Dumbbell className="text-orange-600" size={16} />
                    <span className="text-sm font-semibold text-gray-800">Exercícios</span>
                  </div>
                  <p className="text-xs text-gray-600">Exercícios seguros para gestantes</p>
                </div>

                {/* Recipes */}
                <div 
                  onClick={() => navigate("/recipes")}
                  className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-3 rounded-xl cursor-pointer hover:shadow-md transition-all hover:scale-105 border border-yellow-200"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <ChefHat className="text-yellow-600" size={16} />
                    <span className="text-sm font-semibold text-gray-800">Receitas</span>
                  </div>
                  <p className="text-xs text-gray-600">Alimentação saudável na gravidez</p>
                </div>

                {/* Symptoms */}
                <div 
                  onClick={() => navigate("/symptoms")}
                  className="bg-gradient-to-br from-red-50 to-red-100 p-3 rounded-xl cursor-pointer hover:shadow-md transition-all hover:scale-105 border border-red-200"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Activity className="text-red-600" size={16} />
                    <span className="text-sm font-semibold text-gray-800">Sintomas</span>
                  </div>
                  <p className="text-xs text-gray-600">Registro de sintomas</p>
                </div>

                {/* Medications */}
                <div 
                  onClick={() => navigate("/medications")}
                  className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-3 rounded-xl cursor-pointer hover:shadow-md transition-all hover:scale-105 border border-indigo-200"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Pill className="text-indigo-600" size={16} />
                    <span className="text-sm font-semibold text-gray-800">Medicações</span>
                  </div>
                  <p className="text-xs text-gray-600">Controle de medicamentos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Planning & Community */}
          <Card className="bg-gradient-to-br from-white to-gray-50 rounded-2xl card-shadow border-0">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Users className="mr-2 text-indigo-500" size={20} />
                Planejamento & Comunidade
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {/* Birth Plan */}
                <div 
                  onClick={() => navigate("/birth-plan")}
                  className="bg-gradient-to-br from-rose-50 to-rose-100 p-4 rounded-xl cursor-pointer hover:shadow-md transition-all hover:scale-105 border border-rose-200"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="text-rose-600" size={20} />
                    <div>
                      <span className="text-sm font-semibold text-gray-800 block">Plano de Parto</span>
                      <p className="text-xs text-gray-600">Planeje seu parto ideal</p>
                    </div>
                  </div>
                </div>

                {/* Community */}
                <div 
                  onClick={() => navigate("/community")}
                  className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl cursor-pointer hover:shadow-md transition-all hover:scale-105 border border-purple-200"
                >
                  <div className="flex items-center space-x-3">
                    <Users className="text-purple-600" size={20} />
                    <div>
                      <span className="text-sm font-semibold text-gray-800 block">Comunidade</span>
                      <p className="text-xs text-gray-600">Conecte-se com outras mães</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl card-shadow border-0 border border-indigo-100">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Clock className="mr-2 text-indigo-500" size={20} />
                Atividades Recentes
              </h2>
              <div className="space-y-3">
                {recentEntries?.slice(0, 3).map((entry: any) => (
                  <div key={entry.id} className="flex items-center space-x-3 p-3 bg-white/60 rounded-xl border border-indigo-100">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-200 to-indigo-300 rounded-full flex items-center justify-center">
                      <Clock className="text-indigo-600" size={12} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        {entry.title || "Entrada do diário"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(entry.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                ))}
                {(!recentEntries || recentEntries.length === 0) && (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Clock className="text-indigo-500" size={24} />
                    </div>
                    <p className="text-gray-500 text-sm">
                      Nenhuma atividade recente
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      Comece a registrar seus momentos especiais
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Other tabs will be rendered by their respective components */}
      {activeTab === "baby" && (
        <div className="p-6">
          <BabySizeComparison week={currentWeek} detailed />
        </div>
      )}

      {activeTab === "diary" && (
        <div className="p-6">
          <Card className="bg-white rounded-2xl card-shadow">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Diário</h2>
              <p className="text-gray-600">
                Funcionalidade do diário será implementada em breve
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "tips" && (
        <div className="p-6">
          <Card className="bg-white rounded-2xl card-shadow">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Dicas</h2>
              <p className="text-gray-600">
                Dicas semanais serão implementadas em breve
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <FloatingActionButton onClick={() => setActiveTab("diary")} />
    </div>
  );
}
