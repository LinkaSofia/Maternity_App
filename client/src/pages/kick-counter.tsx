import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Play, Pause, Square, RotateCcw } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

export default function KickCounter() {
  const [, setLocation] = useLocation();
  const [isActive, setIsActive] = useState(false);
  const [kickCount, setKickCount] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const queryClient = useQueryClient();

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime.getTime());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, startTime]);

  const { data: todayCounter } = useQuery({
    queryKey: ['/api/kick-counters/today'],
  });

  const { data: recentCounters = [] } = useQuery({
    queryKey: ['/api/kick-counters'],
  });

  const saveKickCounter = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/kick-counters', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/kick-counters'] });
      resetCounter();
    },
  });

  const handleStart = () => {
    if (!isActive) {
      setStartTime(new Date());
      setIsActive(true);
    }
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleKick = () => {
    if (isActive) {
      setKickCount(prev => prev + 1);
    }
  };

  const handleStop = () => {
    if (startTime && kickCount > 0) {
      const sessionData = {
        date: new Date().toISOString().split('T')[0],
        kickCount,
        timeStarted: startTime.toISOString(),
        timeEnded: new Date().toISOString(),
        notes: `${kickCount} chutes em ${formatTime(elapsedTime)}`
      };
      saveKickCounter.mutate(sessionData);
    } else {
      resetCounter();
    }
  };

  const resetCounter = () => {
    setIsActive(false);
    setKickCount(0);
    setStartTime(null);
    setElapsedTime(0);
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getTimeToTenKicks = () => {
    if (kickCount >= 10 && startTime) {
      const timeToTen = elapsedTime;
      return formatTime(timeToTen);
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation('/home')}
            className="mr-4 bg-white/50 backdrop-blur-sm hover:bg-white/70"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-purple-800">👶 Contador de Chutes</h1>
        </div>

        {/* Main Counter */}
        <Card className="mb-6">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Chutes do Bebê</CardTitle>
            {todayCounter && (
              <p className="text-sm text-gray-600">
                Hoje: {todayCounter.kickCount} chutes
              </p>
            )}
          </CardHeader>
          <CardContent className="text-center space-y-6">
            {/* Counter Display */}
            <div className="space-y-2">
              <div className="text-6xl font-bold text-blue-600">{kickCount}</div>
              <div className="text-lg text-gray-600">chutes</div>
              {isActive && (
                <div className="text-xl text-gray-700">{formatTime(elapsedTime)}</div>
              )}
            </div>

            {/* Achievement */}
            {kickCount >= 10 && getTimeToTenKicks() && (
              <div className="bg-green-100 border border-green-300 rounded-lg p-3">
                <p className="text-green-800 font-semibold">🎉 10 chutes alcançados!</p>
                <p className="text-green-700 text-sm">Tempo: {getTimeToTenKicks()}</p>
              </div>
            )}

            {/* Control Buttons */}
            <div className="space-y-3">
              {!isActive && kickCount === 0 ? (
                <Button 
                  onClick={handleStart}
                  size="lg"
                  className="w-full bg-blue-500 hover:bg-blue-600"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Iniciar Contagem
                </Button>
              ) : (
                <>
                  {/* Kick Button */}
                  <Button 
                    onClick={handleKick}
                    disabled={!isActive}
                    size="lg"
                    className={`w-full text-xl py-8 ${
                      isActive 
                        ? 'bg-pink-500 hover:bg-pink-600 active:bg-pink-700' 
                        : 'bg-gray-300'
                    }`}
                  >
                    👶 CHUTE!
                  </Button>

                  {/* Control Row */}
                  <div className="flex gap-2">
                    {isActive ? (
                      <Button 
                        onClick={handlePause}
                        variant="outline"
                        className="flex-1"
                      >
                        <Pause className="w-4 h-4 mr-2" />
                        Pausar
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => setIsActive(true)}
                        variant="outline"
                        className="flex-1 border-green-300 hover:bg-green-50 hover:border-green-400 bg-white text-green-700"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Continuar
                      </Button>
                    )}
                    
                    <Button 
                      onClick={handleStop}
                      variant="outline"
                      className="flex-1 border-gray-300 hover:bg-red-50 hover:border-red-300 bg-white"
                    >
                      <Square className="w-4 h-4 mr-2" />
                      Finalizar
                    </Button>
                    
                    <Button 
                      onClick={resetCounter}
                      variant="outline"
                      size="icon"
                      className="border-gray-300 hover:bg-gray-50 hover:border-gray-400 bg-white"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
              <p className="font-semibold text-blue-800 mb-1">💡 Dicas:</p>
              <ul className="text-blue-700 text-xs space-y-1">
                <li>• Conte 10 chutes em até 2 horas</li>
                <li>• Melhor horário: após as refeições</li>
                <li>• Deite-se do lado esquerdo para sentir melhor</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Recent Sessions */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Sessões Recentes</h2>
          {recentCounters.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">Nenhuma sessão registrada ainda.</p>
              </CardContent>
            </Card>
          ) : (
            recentCounters
              .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 5)
              .map((session: any) => (
                <Card key={session.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-lg font-semibold">{session.kickCount} chutes</div>
                        <div className="text-sm text-gray-500">
                          {new Date(session.date).toLocaleDateString('pt-BR')}
                        </div>
                        {session.notes && (
                          <div className="text-sm text-gray-600">{session.notes}</div>
                        )}
                      </div>
                      <div className="text-2xl">
                        {session.kickCount >= 10 ? '✅' : '👶'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </div>
      </div>
    </div>
  );
}