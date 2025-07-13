import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Clock } from "lucide-react";

interface BabySizeComparisonProps {
  week: number;
  detailed?: boolean;
}

// Fallback data for baby development
const fallbackData = {
  24: {
    fruitComparison: "Milho",
    lengthCm: 30,
    weightGrams: 600,
    developmentMilestones: [
      "Audição desenvolvida",
      "Pulmões em desenvolvimento",
      "Pode ouvir sua voz"
    ],
    fruitImageUrl: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"
  },
  6: {
    fruitComparison: "Mirtilo",
    lengthCm: 1.2,
    weightGrams: 0.5,
    developmentMilestones: ["Coração começando a bater"],
    fruitImageUrl: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  },
  12: {
    fruitComparison: "Limão",
    lengthCm: 5.4,
    weightGrams: 14,
    developmentMilestones: ["Reflexos se desenvolvendo"],
    fruitImageUrl: "https://images.unsplash.com/photo-1590502593747-42a996133562?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  },
  20: {
    fruitComparison: "Banana",
    lengthCm: 16.4,
    weightGrams: 300,
    developmentMilestones: ["Movimentos percetíveis"],
    fruitImageUrl: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  },
  32: {
    fruitComparison: "Coco",
    lengthCm: 42.4,
    weightGrams: 1700,
    developmentMilestones: ["Pulmões quase maduros"],
    fruitImageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  }
};

export default function BabySizeComparison({ week, detailed = false }: BabySizeComparisonProps) {
  const { data: development } = useQuery({
    queryKey: ["/api/baby-development", week],
    enabled: week > 0,
  });

  // Use fallback data if API data is not available
  const babyData = development || fallbackData[week as keyof typeof fallbackData] || fallbackData[24];

  if (!babyData) {
    return (
      <Card className="bg-white rounded-2xl card-shadow">
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Dados do desenvolvimento não disponíveis</p>
        </CardContent>
      </Card>
    );
  }

  if (detailed) {
    return (
      <div className="space-y-6">
        {/* 3D Baby Model */}
        <Card className="bg-white rounded-2xl card-shadow">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Desenvolvimento do Bebê</h2>
            <div className="text-center">
              <div className="w-48 h-48 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                <div className="text-6xl">👶</div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{week} Semanas</h3>
              <p className="text-gray-600 text-sm">
                {babyData.developmentMilestones?.[0] || "Desenvolvendo normalmente"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Development Milestones */}
        <Card className="bg-white rounded-2xl card-shadow">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Marcos do Desenvolvimento</h2>
            <div className="space-y-4">
              {babyData.developmentMilestones?.map((milestone, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-sage rounded-full flex items-center justify-center">
                    <Check className="text-white" size={12} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{milestone}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Size Comparison Timeline */}
        <Card className="bg-white rounded-2xl card-shadow">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Linha do Tempo</h2>
            <div className="grid grid-cols-3 gap-3">
              {[6, 12, 20, 24, 32].filter(w => w <= week + 8).map((timelineWeek) => {
                const timelineData = fallbackData[timelineWeek as keyof typeof fallbackData];
                const isCurrent = timelineWeek === week;
                
                return (
                  <div key={timelineWeek} className={`text-center ${isCurrent ? 'ring-2 ring-primary rounded-lg p-2' : ''}`}>
                    <img
                      src={timelineData.fruitImageUrl}
                      alt={`${timelineData.fruitComparison} representando bebê na semana ${timelineWeek}`}
                      className="w-12 h-12 mx-auto mb-2 rounded-full object-cover"
                    />
                    <p className={`text-xs ${isCurrent ? 'text-primary font-semibold' : 'text-gray-600'}`}>
                      Sem. {timelineWeek}
                    </p>
                    <p className="text-xs font-medium">{timelineData.fruitComparison}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card className="bg-white rounded-2xl card-shadow fruit-card">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Tamanho do Bebê</h2>
        <div className="text-center">
          <img
            src={babyData.fruitImageUrl}
            alt={`${babyData.fruitComparison} representando o tamanho do bebê`}
            className="w-24 h-24 mx-auto mb-4 rounded-full object-cover"
          />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{babyData.fruitComparison}</h3>
          <p className="text-gray-600 text-sm">
            Aproximadamente {babyData.lengthCm}cm
          </p>
          <p className="text-gray-600 text-sm">
            Peso: ~{babyData.weightGrams}g
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
