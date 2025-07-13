import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import NavigationTabs from "@/components/navigation-tabs";
import PregnancyProgress from "@/components/pregnancy-progress";
import BabySizeComparison from "@/components/baby-size-comparison";
import FloatingActionButton from "@/components/floating-action-button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Weight, Clock, TrendingUp } from "lucide-react";

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
    <div className="max-w-sm mx-auto bg-white min-h-screen shadow-2xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-bold">
              Olá, {user?.firstName || "Mamãe"}!
            </h1>
            <p className="text-sm opacity-90">
              Semana {currentWeek} de gestação
            </p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            {user?.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-white rounded-full"></div>
            )}
          </div>
        </div>

        <PregnancyProgress 
          currentWeek={currentWeek} 
          percentage={progressPercentage}
        />
      </div>

      <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Home Tab Content */}
      {activeTab === "home" && (
        <div className="p-6 space-y-6">
          {/* This Week Card */}
          <Card className="bg-white rounded-2xl card-shadow">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Esta Semana</h2>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{currentWeek}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Semana {currentWeek}</h3>
                  <p className="text-gray-600 text-sm">
                    {currentWeek <= 12 ? "Primeiro trimestre" : 
                     currentWeek <= 28 ? "Segundo trimestre" : 
                     "Terceiro trimestre"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <BabySizeComparison week={currentWeek} />

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-white rounded-2xl card-shadow">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Weight className="text-sage" size={20} />
                </div>
                <p className="text-sm text-gray-600">Ganho de Peso</p>
                <p className="text-lg font-semibold text-gray-800">
                  {pregnancy?.currentWeight && pregnancy?.prePregnancyWeight
                    ? `+${(pregnancy.currentWeight - pregnancy.prePregnancyWeight).toFixed(1)}kg`
                    : "-- kg"}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-2xl card-shadow">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Calendar className="text-accent" size={20} />
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
