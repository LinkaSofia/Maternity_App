import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Clock, Star, Filter } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Exercises() {
  const [, setLocation] = useLocation();
  const [selectedTrimester, setSelectedTrimester] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const queryClient = useQueryClient();

  const { data: exercises = [], isLoading } = useQuery({
    queryKey: ['/api/exercise-videos'],
  });

  const { data: exerciseLog = [] } = useQuery({
    queryKey: ['/api/exercise-log'],
  });

  const logExercise = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/exercise-log', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/exercise-log'] });
    },
  });

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800'
  };

  const categoryColors = {
    cardio: 'bg-blue-100 text-blue-800',
    strength: 'bg-purple-100 text-purple-800',
    flexibility: 'bg-pink-100 text-pink-800',
    breathing: 'bg-indigo-100 text-indigo-800'
  };

  const trimesterColors = {
    first: 'bg-orange-100 text-orange-800',
    second: 'bg-teal-100 text-teal-800',
    third: 'bg-rose-100 text-rose-800',
    all: 'bg-gray-100 text-gray-800'
  };

  const filteredExercises = exercises.filter((exercise: any) => {
    const trimesterMatch = selectedTrimester === "all" || exercise.trimester === selectedTrimester || exercise.trimester === "all";
    const categoryMatch = selectedCategory === "all" || exercise.category === selectedCategory;
    return trimesterMatch && categoryMatch;
  });

  const handleStartExercise = (exerciseId: number, duration: number) => {
    logExercise.mutate({
      exerciseId,
      date: new Date().toISOString().split('T')[0],
      duration,
      rating: 5, // Default good rating
      notes: "Exercício realizado via app"
    });
  };

  const categoryNames = {
    cardio: 'Cardio',
    strength: 'Fortalecimento',
    flexibility: 'Flexibilidade',
    breathing: 'Respiração'
  };

  const trimesterNames = {
    first: '1º Trimestre',
    second: '2º Trimestre', 
    third: '3º Trimestre',
    all: 'Todos'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation('/home')}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Exercícios para Gestantes</h1>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Trimestre</label>
                <Select value={selectedTrimester} onValueChange={setSelectedTrimester}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Trimestres</SelectItem>
                    <SelectItem value="first">1º Trimestre</SelectItem>
                    <SelectItem value="second">2º Trimestre</SelectItem>
                    <SelectItem value="third">3º Trimestre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Categoria</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Categorias</SelectItem>
                    <SelectItem value="cardio">Cardio</SelectItem>
                    <SelectItem value="strength">Fortalecimento</SelectItem>
                    <SelectItem value="flexibility">Flexibilidade</SelectItem>
                    <SelectItem value="breathing">Respiração</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exercise List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">Carregando exercícios...</div>
          ) : filteredExercises.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">Nenhum exercício encontrado para os filtros selecionados.</p>
              </CardContent>
            </Card>
          ) : (
            filteredExercises.map((exercise: any) => (
              <Card key={exercise.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{exercise.name}</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className={difficultyColors[exercise.difficulty]}>
                          {exercise.difficulty === 'easy' ? 'Fácil' : exercise.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                        </Badge>
                        <Badge className={categoryColors[exercise.category]}>
                          {categoryNames[exercise.category as keyof typeof categoryNames]}
                        </Badge>
                        <Badge className={trimesterColors[exercise.trimester]}>
                          {trimesterNames[exercise.trimester as keyof typeof trimesterNames]}
                        </Badge>
                        {exercise.duration && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {exercise.duration} min
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">{exercise.description}</p>
                      {exercise.instructions && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                          <p className="font-medium text-blue-800 mb-1">Instruções:</p>
                          <p className="text-blue-700">{exercise.instructions}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {exercise.videoUrl && (
                      <Button 
                        variant="outline"
                        onClick={() => window.open(exercise.videoUrl, '_blank')}
                        className="flex-1"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Ver Vídeo
                      </Button>
                    )}
                    <Button 
                      onClick={() => handleStartExercise(exercise.id, exercise.duration || 15)}
                      disabled={logExercise.isPending}
                      className="flex-1 bg-green-500 hover:bg-green-600"
                    >
                      <Star className="w-4 h-4 mr-2" />
                      {logExercise.isPending ? 'Registrando...' : 'Marcar como Feito'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Recent Activity */}
        {exerciseLog.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {exerciseLog
                  .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 5)
                  .map((log: any) => {
                    const exercise = exercises.find((e: any) => e.id === log.exerciseId);
                    return (
                      <div key={log.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{exercise?.name || 'Exercício'}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(log.date).toLocaleDateString('pt-BR')} • {log.duration} min
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(log.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Safety Tips */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="font-semibold text-yellow-800 mb-1">⚠️ Importantes dicas de segurança:</p>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>• Sempre consulte seu médico antes de iniciar exercícios</li>
                <li>• Pare imediatamente se sentir dor, tontura ou falta de ar</li>
                <li>• Mantenha-se hidratada e evite superaquecimento</li>
                <li>• Evite exercícios de alto impacto e posições de barriga para baixo</li>
                <li>• Ouça seu corpo e não force além do confortável</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}