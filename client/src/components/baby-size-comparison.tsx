import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Clock } from "lucide-react";

interface BabySizeComparisonProps {
  week: number;
  detailed?: boolean;
}

// Fallback data for baby development - comprehensive week-by-week data
const fallbackData: Record<number, any> = {
  4: {
    fruitComparison: "Semente de papoula",
    lengthCm: 0.2,
    weightGrams: 0.01,
    developmentMilestones: ["Implantação no útero"],
    fruitImageUrl: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  },
  5: {
    fruitComparison: "Semente de gergelim",
    lengthCm: 0.3,
    weightGrams: 0.1,
    developmentMilestones: ["Formação do tubo neural"],
    fruitImageUrl: "https://images.unsplash.com/photo-1589985701387-78d48b8123ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  },
  6: {
    fruitComparison: "Lentilha",
    lengthCm: 0.5,
    weightGrams: 0.1,
    developmentMilestones: ["Coração começando a bater"],
    fruitImageUrl: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  },
  7: {
    fruitComparison: "Mirtilo",
    lengthCm: 1.0,
    weightGrams: 0.2,
    developmentMilestones: ["Formação de braços e pernas"],
    fruitImageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  },
  8: {
    fruitComparison: "Framboesa",
    lengthCm: 1.6,
    weightGrams: 1,
    developmentMilestones: ["Dedos dos pés e das mãos se formando"],
    fruitImageUrl: "https://images.unsplash.com/photo-1577003833619-76bbd7f82948?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  },
  9: {
    fruitComparison: "Cereja",
    lengthCm: 2.3,
    weightGrams: 2,
    developmentMilestones: ["Órgãos vitais se desenvolvendo"],
    fruitImageUrl: "https://images.unsplash.com/photo-1565763064742-e2faa8c9e7d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  },
  10: {
    fruitComparison: "Morango",
    lengthCm: 3.1,
    weightGrams: 4,
    developmentMilestones: ["Todos os órgãos formados"],
    fruitImageUrl: "https://images.unsplash.com/photo-1518635017498-87f514b751ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  },
  11: {
    fruitComparison: "Figo",
    lengthCm: 4.1,
    weightGrams: 7,
    developmentMilestones: ["Unhas começando a crescer"],
    fruitImageUrl: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  },
  12: {
    fruitComparison: "Limão",
    lengthCm: 5.4,
    weightGrams: 14,
    developmentMilestones: ["Reflexos se desenvolvendo"],
    fruitImageUrl: "https://images.unsplash.com/photo-1590502593747-42a996133562?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  },
  13: {
    fruitComparison: "Vagem",
    lengthCm: 7.4,
    weightGrams: 23,
    developmentMilestones: ["Impressões digitais se formando"],
    fruitImageUrl: "https://images.unsplash.com/photo-1553835973-dec43bdbef82?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  },
  14: {
    fruitComparison: "Pêssego",
    lengthCm: 8.7,
    weightGrams: 43,
    developmentMilestones: ["Cabelo começando a crescer"],
    fruitImageUrl: "https://images.unsplash.com/photo-1517171827043-4ea983bb9d55?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  },
  15: {
    fruitComparison: "Maçã",
    lengthCm: 10.1,
    weightGrams: 70,
    developmentMilestones: ["Sistema nervoso se desenvolvendo"],
    fruitImageUrl: "https://images.unsplash.com/photo-1547514701-42782101795e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  },
  16: {
    fruitComparison: "Abacate",
    lengthCm: 11.6,
    weightGrams: 100,
    developmentMilestones: ["Músculos e ossos se fortalecendo"],
    fruitImageUrl: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  },
  17: {
    fruitComparison: "Pera",
    lengthCm: 13,
    weightGrams: 140,
    developmentMilestones: ["Audição se desenvolvendo"],
    fruitImageUrl: "https://images.unsplash.com/photo-1554213353-e9c6e76e70c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  },
  18: {
    fruitComparison: "Pimentão",
    lengthCm: 14.2,
    weightGrams: 190,
    developmentMilestones: ["Sistema imunológico se formando"],
    fruitImageUrl: "https://images.unsplash.com/photo-1593370280804-0b2ee5e6b3e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  },
  19: {
    fruitComparison: "Tomate grande",
    lengthCm: 15.3,
    weightGrams: 240,
    developmentMilestones: ["Movimentos mais coordenados"],
    fruitImageUrl: "https://images.unsplash.com/photo-1546470427-e693b6669c07?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  },
  20: {
    fruitComparison: "Banana",
    lengthCm: 16.4,
    weightGrams: 300,
    developmentMilestones: ["Movimentos claramente perceptíveis"],
    fruitImageUrl: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  },
  21: {
    fruitComparison: "Cenoura",
    lengthCm: 26.7,
    weightGrams: 360,
    developmentMilestones: ["Papilas gustativas se desenvolvendo"],
    fruitImageUrl: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  },
  22: {
    fruitComparison: "Mamão papaya",
    lengthCm: 27.8,
    weightGrams: 430,
    developmentMilestones: ["Sobrancelhas e cílios visíveis"],
    fruitImageUrl: "https://images.unsplash.com/photo-1517666005606-69dea9b54865?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  },
  23: {
    fruitComparison: "Manga pequena",
    lengthCm: 28.9,
    weightGrams: 500,
    developmentMilestones: ["Pele menos transparente"],
    fruitImageUrl: "https://images.unsplash.com/photo-1508830524289-0adcbe822b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  },
  24: {
    fruitComparison: "Milho",
    lengthCm: 30,
    weightGrams: 600,
    developmentMilestones: ["Audição totalmente desenvolvida"],
    fruitImageUrl: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"
  }
};

// Function to get appropriate data for any week
const getWeekData = (week: number) => {
  // Return exact match if available
  if (fallbackData[week]) {
    return fallbackData[week];
  }
  
  // For weeks 0-4, show early pregnancy data
  if (week <= 4) {
    return {
      fruitComparison: "Muito pequeno para comparar",
      lengthCm: 0.1,
      weightGrams: 0.01,
      developmentMilestones: ["Início da formação"],
      fruitImageUrl: "https://images.unsplash.com/photo-1589985701387-78d48b8123ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    };
  }
  
  // For weeks beyond our data, find the closest week
  const availableWeeks = Object.keys(fallbackData).map(Number).sort((a, b) => a - b);
  const closestWeek = availableWeeks.reduce((prev, curr) => 
    Math.abs(curr - week) < Math.abs(prev - week) ? curr : prev
  );
  
  return fallbackData[closestWeek];
};

export default function BabySizeComparison({ week, detailed = false }: BabySizeComparisonProps) {
  const { data: development } = useQuery({
    queryKey: ["/api/baby-development", week],
    enabled: week > 0,
  });

  // Use fallback data if API data is not available
  const babyData = development || getWeekData(week);

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
                const timelineData = getWeekData(timelineWeek);
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
