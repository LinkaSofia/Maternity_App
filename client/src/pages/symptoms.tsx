import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Plus, Activity, AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

export default function Symptoms() {
  const [, setLocation] = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    symptomType: "nausea",
    severity: [5],
    duration: "",
    date: new Date().toISOString().split('T')[0],
    notes: "",
    remedies: ""
  });

  const queryClient = useQueryClient();

  const { data: symptoms = [], isLoading } = useQuery({
    queryKey: ['/api/symptoms'],
  });

  const createSymptom = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/symptoms', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/symptoms'] });
      setShowForm(false);
      setFormData({
        symptomType: "nausea",
        severity: [5],
        duration: "",
        date: new Date().toISOString().split('T')[0],
        notes: "",
        remedies: ""
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createSymptom.mutate({
      symptomType: formData.symptomType,
      severity: formData.severity[0],
      duration: formData.duration ? parseInt(formData.duration) : undefined,
      date: formData.date,
      notes: formData.notes || undefined,
      remedies: formData.remedies || undefined
    });
  };

  const symptomTypes = {
    nausea: { name: "Náusea", icon: "🤢", color: "text-green-600" },
    headache: { name: "Dor de Cabeça", icon: "🤕", color: "text-red-600" },
    back_pain: { name: "Dor nas Costas", icon: "😣", color: "text-orange-600" },
    heartburn: { name: "Azia", icon: "🔥", color: "text-red-500" },
    fatigue: { name: "Fadiga", icon: "😴", color: "text-blue-600" },
    swelling: { name: "Inchaço", icon: "🦶", color: "text-purple-600" },
    cramps: { name: "Cãibras", icon: "⚡", color: "text-yellow-600" },
    dizziness: { name: "Tontura", icon: "💫", color: "text-indigo-600" },
    constipation: { name: "Constipação", icon: "😖", color: "text-brown-600" },
    insomnia: { name: "Insônia", icon: "🌙", color: "text-gray-600" },
    mood_swings: { name: "Mudança de Humor", icon: "😢", color: "text-pink-600" },
    other: { name: "Outros", icon: "❓", color: "text-gray-500" }
  };

  const getSeverityColor = (severity: number) => {
    if (severity <= 3) return "text-green-600";
    if (severity <= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getSeverityText = (severity: number) => {
    if (severity <= 3) return "Leve";
    if (severity <= 6) return "Moderado";
    return "Intenso";
  };

  const groupedSymptoms = symptoms.reduce((acc: any, symptom: any) => {
    const date = symptom.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(symptom);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 p-4">
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
          <h1 className="text-2xl font-bold text-gray-900">Registro de Sintomas</h1>
        </div>

        {/* Summary Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Resumo dos Sintomas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{symptoms.length}</div>
                <div className="text-sm text-gray-500">Total de Registros</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {symptoms.length > 0 
                    ? Math.round(symptoms.reduce((sum: number, s: any) => sum + s.severity, 0) / symptoms.length)
                    : '--'}
                </div>
                <div className="text-sm text-gray-500">Intensidade Média</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Object.keys(groupedSymptoms).length}
                </div>
                <div className="text-sm text-gray-500">Dias com Registros</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Symptom Button */}
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="w-full mb-6 bg-red-500 hover:bg-red-600"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Registrar Sintoma
          </Button>
        )}

        {/* Add Symptom Form */}
        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Novo Registro de Sintoma</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="symptomType">Tipo de Sintoma</Label>
                    <Select value={formData.symptomType} onValueChange={(value) => setFormData(prev => ({ ...prev, symptomType: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(symptomTypes).map(([key, type]) => (
                          <SelectItem key={key} value={key}>
                            {type.icon} {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                </div>

                <div>
                  <Label htmlFor="severity">Intensidade: {formData.severity[0]} ({getSeverityText(formData.severity[0])})</Label>
                  <div className="px-2 py-4">
                    <Slider
                      value={formData.severity}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, severity: value }))}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1 - Muito Leve</span>
                      <span>5 - Moderado</span>
                      <span>10 - Muito Intenso</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="duration">Duração (horas) - Opcional</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="0"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="Ex: 2"
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Descrição do Sintoma</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Descreva como você se sentiu, quando começou..."
                  />
                </div>

                <div>
                  <Label htmlFor="remedies">O que ajudou/remédios usados</Label>
                  <Textarea
                    id="remedies"
                    value={formData.remedies}
                    onChange={(e) => setFormData(prev => ({ ...prev, remedies: e.target.value }))}
                    placeholder="Ex: Repouso, chá de camomila, medicamento..."
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={createSymptom.isPending} className="flex-1">
                    {createSymptom.isPending ? 'Salvando...' : 'Registrar'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Symptoms History */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Histórico de Sintomas</h2>
          {isLoading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : symptoms.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Activity className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Nenhum sintoma registrado ainda.</p>
                <p className="text-sm text-gray-400">Registre seus sintomas para melhor acompanhamento médico.</p>
              </CardContent>
            </Card>
          ) : (
            Object.entries(groupedSymptoms)
              .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
              .map(([date, daySymptoms]: [string, any]) => (
                <div key={date}>
                  <h3 className="text-lg font-medium mb-3 text-gray-700">
                    {new Date(date).toLocaleDateString('pt-BR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                  <div className="space-y-2">
                    {daySymptoms.map((symptom: any) => {
                      const typeInfo = symptomTypes[symptom.symptomType as keyof typeof symptomTypes];
                      return (
                        <Card key={symptom.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-2xl">{typeInfo.icon}</span>
                                  <h4 className="font-semibold">{typeInfo.name}</h4>
                                  <span className={`text-sm font-medium ${getSeverityColor(symptom.severity)}`}>
                                    {symptom.severity}/10 - {getSeverityText(symptom.severity)}
                                  </span>
                                  {symptom.duration && (
                                    <span className="text-sm text-gray-500">
                                      • {symptom.duration}h
                                    </span>
                                  )}
                                </div>
                                {symptom.notes && (
                                  <p className="text-gray-700 text-sm mb-2">{symptom.notes}</p>
                                )}
                                {symptom.remedies && (
                                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                                    <p className="text-blue-800 text-sm">
                                      <strong>O que ajudou:</strong> {symptom.remedies}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))
          )}
        </div>

        {/* Warning */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-semibold text-red-800 mb-1">⚠️ Importante:</p>
                <ul className="text-red-700 text-sm space-y-1">
                  <li>• Sempre comunique sintomas ao seu médico</li>
                  <li>• Procure atendimento imediato em caso de sintomas graves</li>
                  <li>• Este registro não substitui avaliação médica</li>
                  <li>• Use estas informações nas consultas de pré-natal</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}