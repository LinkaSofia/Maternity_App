import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Utensils, Dumbbell, Bed, Pill, Droplets, Stethoscope, Clock, BookOpen } from "lucide-react";

export default function Tips() {
  const weeklyTips = [
    {
      icon: Utensils,
      title: "Alimentação",
      description: "Inclua alimentos ricos em ferro como espinafre e feijão na sua dieta.",
      color: "bg-primary/20 text-primary",
    },
    {
      icon: Dumbbell,
      title: "Exercícios",
      description: "Caminhadas leves podem ajudar a manter a energia e reduzir o inchaço.",
      color: "bg-secondary/20 text-secondary",
    },
    {
      icon: Bed,
      title: "Descanso",
      description: "Use travesseiros para apoiar a barriga durante o sono.",
      color: "bg-sage/20 text-sage",
    },
  ];

  const healthReminders = [
    {
      icon: Pill,
      title: "Vitamina pré-natal",
      frequency: "Diário",
      color: "bg-mint",
    },
    {
      icon: Droplets,
      title: "Hidratação",
      frequency: "8 copos/dia",
      color: "bg-blush",
    },
    {
      icon: Stethoscope,
      title: "Consulta médica",
      frequency: "15/12",
      color: "bg-sage/10",
    },
  ];

  const educationalContent = [
    {
      title: "Alimentação no 2º trimestre",
      duration: "Leitura de 5 min",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    },
    {
      title: "Exercícios seguros",
      duration: "Leitura de 7 min",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    },
    {
      title: "Preparação para o parto",
      duration: "Leitura de 10 min",
      image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Weekly Tips */}
      <Card className="bg-white rounded-2xl card-shadow">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Dicas da Semana</h2>
          <div className="space-y-4">
            {weeklyTips.map((tip, index) => {
              const Icon = tip.icon;
              return (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mt-1 ${tip.color}`}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{tip.title}</h3>
                    <p className="text-sm text-gray-600">{tip.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Health Reminders */}
      <Card className="bg-white rounded-2xl card-shadow">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Lembretes de Saúde</h2>
          <div className="space-y-3">
            {healthReminders.map((reminder, index) => {
              const Icon = reminder.icon;
              return (
                <div key={index} className={`flex items-center justify-between p-3 rounded-xl ${reminder.color}`}>
                  <div className="flex items-center space-x-3">
                    <Icon className="text-gray-700" size={20} />
                    <span className="text-sm font-medium text-gray-800">{reminder.title}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {reminder.frequency}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Educational Content */}
      <Card className="bg-white rounded-2xl card-shadow">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Conteúdo Educativo</h2>
          <div className="space-y-3">
            {educationalContent.map((content, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 smooth-transition cursor-pointer">
                <img
                  src={content.image}
                  alt={content.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-800">{content.title}</h3>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Clock size={12} />
                    <span>{content.duration}</span>
                  </div>
                </div>
                <BookOpen className="text-gray-400" size={16} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-white rounded-2xl card-shadow">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 bg-primary/10 rounded-xl text-center hover:bg-primary/20 smooth-transition">
              <Pill className="mx-auto mb-2 text-primary" size={24} />
              <span className="text-sm font-medium text-gray-800">Registrar Medicamento</span>
            </button>
            <button className="p-4 bg-secondary/10 rounded-xl text-center hover:bg-secondary/20 smooth-transition">
              <Droplets className="mx-auto mb-2 text-secondary" size={24} />
              <span className="text-sm font-medium text-gray-800">Registrar Hidratação</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
