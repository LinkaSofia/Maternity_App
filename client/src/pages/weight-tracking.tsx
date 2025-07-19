import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, TrendingUp } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function WeightTracking() {
  const [, setLocation] = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    weight: "",
    date: new Date().toISOString().split('T')[0],
    notes: ""
  });

  const queryClient = useQueryClient();

  const { data: weightEntries = [], isLoading } = useQuery({
    queryKey: ['/api/weight-entries'],
    queryFn: () => apiRequest('/api/weight-entries'),
  });

  const createWeightEntry = useMutation({
    mutationFn: (data: any) => apiRequest('/api/weight-entries', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/weight-entries'] });
      setShowForm(false);
      setFormData({ weight: "", date: new Date().toISOString().split('T')[0], notes: "" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createWeightEntry.mutate({
      weight: parseFloat(formData.weight),
      date: formData.date,
      notes: formData.notes || undefined
    });
  };

  const chartData = weightEntries
    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((entry: any) => ({
      date: new Date(entry.date).toLocaleDateString('pt-BR'),
      weight: entry.weight
    }));

  const currentWeight = weightEntries.length > 0 ? weightEntries[weightEntries.length - 1].weight : 0;
  const previousWeight = weightEntries.length > 1 ? weightEntries[weightEntries.length - 2].weight : currentWeight;
  const weightChange = currentWeight - previousWeight;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
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
          <h1 className="text-2xl font-bold text-gray-900">Controle de Peso</h1>
        </div>

        {/* Weight Summary Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Resumo do Peso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600">{currentWeight || '--'} kg</div>
                <div className="text-sm text-gray-500">Peso Atual</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${weightChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg
                </div>
                <div className="text-sm text-gray-500">Variação</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{weightEntries.length}</div>
                <div className="text-sm text-gray-500">Registros</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weight Chart */}
        {chartData.length > 1 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Evolução do Peso</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="weight" stroke="#ec4899" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Add Weight Button */}
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="w-full mb-6 bg-pink-500 hover:bg-pink-600"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Registrar Peso
          </Button>
        )}

        {/* Add Weight Form */}
        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Novo Registro de Peso</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                    required
                    placeholder="Ex: 65.5"
                  />
                </div>
                <div>
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Observações (opcional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Ex: Após o almoço, com roupa..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={createWeightEntry.isPending} className="flex-1">
                    {createWeightEntry.isPending ? 'Salvando...' : 'Salvar'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Weight History */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Histórico de Peso</h2>
          {isLoading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : weightEntries.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">Nenhum registro de peso ainda.</p>
                <p className="text-sm text-gray-400">Adicione seu primeiro registro para começar o acompanhamento!</p>
              </CardContent>
            </Card>
          ) : (
            weightEntries
              .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((entry: any) => (
                <Card key={entry.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-lg font-semibold">{entry.weight} kg</div>
                        <div className="text-sm text-gray-500">
                          {new Date(entry.date).toLocaleDateString('pt-BR')}
                        </div>
                        {entry.notes && (
                          <div className="text-sm text-gray-600 mt-1">{entry.notes}</div>
                        )}
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