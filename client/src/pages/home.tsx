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
import { Calendar, Weight, Clock, TrendingUp, Heart, Baby } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");
  const { user } = useAuth();

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
    <div className="max-w-sm mx-auto bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 min-h-screen shadow-2xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="mb-4">
            <Header 
              title={`Olá, ${user?.firstName || "Mamãe"}!`}
              subtitle={`Semana ${currentWeek} de gestação`}
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
          <Card className="bg-white/80 backdrop-blur-sm rounded-2xl card-shadow border-0 overflow-hidden">
            <CardContent className="p-8 text-center">
              <div className="mb-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Seu Bebê - Semana {currentWeek}
                </h2>
                <p className="text-gray-600 text-sm">
                  {currentWeek <= 12 ? "Primeiro trimestre" : 
                   currentWeek <= 28 ? "Segundo trimestre" : "Terceiro trimestre"}
                </p>
              </div>
              
              <div className="flex justify-center mb-6">
                <Baby3DModel week={currentWeek} size="large" />
              </div>
              
              <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-4">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Heart className="text-pink-500" size={16} />
                  <span className="text-sm font-medium text-gray-700">
                    Desenvolvimento atual
                  </span>
                </div>
                <BabySizeComparison week={currentWeek} />
              </div>
            </CardContent>
          </Card>

          {/* Esta Semana - Informações Resumidas */}
          <Card className="bg-white/80 backdrop-blur-sm rounded-2xl card-shadow border-0">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Baby className="mr-2 text-pink-500" size={20} />
                Resumo da Semana
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4 text-center">
                  <Calendar className="mx-auto text-pink-500 mb-2" size={24} />
                  <div className="text-lg font-bold text-gray-800">{currentWeek}</div>
                  <div className="text-xs text-gray-600">Semanas</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
                  <TrendingUp className="mx-auto text-purple-500 mb-2" size={24} />
                  <div className="text-lg font-bold text-gray-800">{Math.round(progressPercentage)}%</div>
                  <div className="text-xs text-gray-600">Progresso</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-white/80 backdrop-blur-sm rounded-2xl card-shadow border-0">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Weight className="text-green-600" size={20} />
                </div>
                <p className="text-sm text-gray-600">Ganho de Peso</p>
                <p className="text-lg font-semibold text-gray-800">
                  {pregnancy?.currentWeight && pregnancy?.prePregnancyWeight
                    ? `+${(pregnancy.currentWeight - pregnancy.prePregnancyWeight).toFixed(1)}kg`
                    : "-- kg"}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm rounded-2xl card-shadow border-0">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Calendar className="text-blue-600" size={20} />
                </div>
                <p className="text-sm text-gray-600">Próxima Consulta</p>
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

          {/* Recent Activities */}
          <Card className="bg-white rounded-2xl card-shadow">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Atividades Recentes</h2>
              <div className="space-y-3">
                {recentEntries?.slice(0, 3).map((entry: any) => (
                  <div key={entry.id} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <Clock className="text-primary" size={12} />
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
                  <p className="text-gray-500 text-sm text-center py-4">
                    Nenhuma atividade recente
                  </p>
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
