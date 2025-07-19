import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Plus, Pill, Calendar, Check, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

export default function Medications() {
  const [, setLocation] = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "vitamin",
    dosage: "",
    frequency: "daily",
    startDate: new Date().toISOString().split('T')[0],
    endDate: "",
    prescribedBy: "",
    notes: ""
  });

  const queryClient = useQueryClient();

  const { data: medications = [], isLoading } = useQuery({
    queryKey: ['/api/medications'],
  });

  const { data: medicationLog = [] } = useQuery({
    queryKey: ['/api/medication-log'],
  });

  const createMedication = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/medications', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/medications'] });
      setShowForm(false);
      setFormData({
        name: "",
        type: "vitamin",
        dosage: "",
        frequency: "daily",
        startDate: new Date().toISOString().split('T')[0],
        endDate: "",
        prescribedBy: "",
        notes: ""
      });
    },
  });

  const updateMedication = useMutation({
    mutationFn: ({ id, data }: { id: number, data: any }) => 
      apiRequest('PUT', `/api/medications/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/medications'] });
    },
  });

  const logMedication = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/medication-log', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/medication-log'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMedication.mutate({
      name: formData.name,
      type: formData.type,
      dosage: formData.dosage,
      frequency: formData.frequency,
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
      prescribedBy: formData.prescribedBy || undefined,
      notes: formData.notes || undefined
    });
  };

  const toggleActive = (id: number, currentStatus: boolean) => {
    updateMedication.mutate({
      id,
      data: { isActive: !currentStatus }
    });
  };

  const markAsTaken = (medicationId: number) => {
    logMedication.mutate({
      medicationId,
      takenAt: new Date().toISOString(),
      notes: "Tomado via app"
    });
  };

  const markAsSkipped = (medicationId: number) => {
    logMedication.mutate({
      medicationId,
      takenAt: new Date().toISOString(),
      skipped: true,
      notes: "Pulado via app"
    });
  };

  const typeColors = {
    vitamin: 'bg-green-100 text-green-800',
    supplement: 'bg-blue-100 text-blue-800',
    medication: 'bg-purple-100 text-purple-800',
    prescription: 'bg-red-100 text-red-800'
  };

  const typeNames = {
    vitamin: 'Vitamina',
    supplement: 'Suplemento',
    medication: 'Medicamento',
    prescription: 'Receita Médica'
  };

  const frequencyNames = {
    daily: 'Diariamente',
    twice_daily: '2x por dia',
    three_times_daily: '3x por dia',
    weekly: 'Semanalmente',
    as_needed: 'Quando necessário'
  };

  const activeMedications = medications.filter((med: any) => med.isActive);
  const inactiveMedications = medications.filter((med: any) => !med.isActive);

  const getTodayLog = (medicationId: number) => {
    const today = new Date().toISOString().split('T')[0];
    return medicationLog.filter((log: any) => {
      const logDate = new Date(log.takenAt).toISOString().split('T')[0];
      return log.medicationId === medicationId && logDate === today;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
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
          <h1 className="text-2xl font-bold text-gray-900">Controle de Medicamentos</h1>
        </div>

        {/* Summary Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="w-5 h-5" />
              Resumo dos Medicamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{activeMedications.length}</div>
                <div className="text-sm text-gray-500">Medicamentos Ativos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {medicationLog.filter((log: any) => {
                    const today = new Date().toISOString().split('T')[0];
                    const logDate = new Date(log.takenAt).toISOString().split('T')[0];
                    return logDate === today && !log.skipped;
                  }).length}
                </div>
                <div className="text-sm text-gray-500">Tomados Hoje</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{medications.length}</div>
                <div className="text-sm text-gray-500">Total de Registros</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Medication Button */}
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="w-full mb-6 bg-purple-500 hover:bg-purple-600"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Adicionar Medicamento
          </Button>
        )}

        {/* Add Medication Form */}
        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Novo Medicamento</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome do Medicamento</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                      placeholder="Ex: Ácido Fólico"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="type">Tipo</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vitamin">Vitamina</SelectItem>
                        <SelectItem value="supplement">Suplemento</SelectItem>
                        <SelectItem value="medication">Medicamento</SelectItem>
                        <SelectItem value="prescription">Receita Médica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dosage">Dosagem</Label>
                    <Input
                      id="dosage"
                      value={formData.dosage}
                      onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
                      placeholder="Ex: 400mg"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="frequency">Frequência</Label>
                    <Select value={formData.frequency} onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Diariamente</SelectItem>
                        <SelectItem value="twice_daily">2x por dia</SelectItem>
                        <SelectItem value="three_times_daily">3x por dia</SelectItem>
                        <SelectItem value="weekly">Semanalmente</SelectItem>
                        <SelectItem value="as_needed">Quando necessário</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Data de Início</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="endDate">Data de Término (Opcional)</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="prescribedBy">Prescrito por (Opcional)</Label>
                  <Input
                    id="prescribedBy"
                    value={formData.prescribedBy}
                    onChange={(e) => setFormData(prev => ({ ...prev, prescribedBy: e.target.value }))}
                    placeholder="Ex: Dr. João Silva"
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Instruções especiais, efeitos colaterais observados..."
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={createMedication.isPending} className="flex-1">
                    {createMedication.isPending ? 'Salvando...' : 'Adicionar'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Active Medications */}
        {activeMedications.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Medicamentos Ativos</h2>
            <div className="space-y-3">
              {activeMedications.map((medication: any) => {
                const todayLogs = getTodayLog(medication.id);
                const taken = todayLogs.some((log: any) => !log.skipped);
                const skipped = todayLogs.some((log: any) => log.skipped);
                
                return (
                  <Card key={medication.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{medication.name}</h3>
                            <Badge className={typeColors[medication.type as keyof typeof typeColors]}>
                              {typeNames[medication.type as keyof typeof typeNames]}
                            </Badge>
                            {taken && (
                              <Badge className="bg-green-100 text-green-800">
                                <Check className="w-3 h-3 mr-1" />
                                Tomado Hoje
                              </Badge>
                            )}
                            {skipped && !taken && (
                              <Badge className="bg-orange-100 text-orange-800">
                                <X className="w-3 h-3 mr-1" />
                                Pulado Hoje
                              </Badge>
                            )}
                          </div>
                          
                          <div className="text-sm text-gray-600 space-y-1">
                            <p><strong>Dosagem:</strong> {medication.dosage}</p>
                            <p><strong>Frequência:</strong> {frequencyNames[medication.frequency as keyof typeof frequencyNames]}</p>
                            {medication.prescribedBy && (
                              <p><strong>Prescrito por:</strong> {medication.prescribedBy}</p>
                            )}
                            {medication.notes && (
                              <p className="text-gray-500">{medication.notes}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 ml-4">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={medication.isActive}
                              onCheckedChange={() => toggleActive(medication.id, medication.isActive)}
                            />
                            <span className="text-sm">Ativo</span>
                          </div>
                          
                          {!taken && !skipped && (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                onClick={() => markAsTaken(medication.id)}
                                disabled={logMedication.isPending}
                                className="bg-green-500 hover:bg-green-600"
                              >
                                <Check className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => markAsSkipped(medication.id)}
                                disabled={logMedication.isPending}
                              >
                                <X className="w-3 h-3" />
                              </Button>
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
        )}

        {/* Inactive Medications */}
        {inactiveMedications.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Medicamentos Inativos</h2>
            <div className="space-y-3">
              {inactiveMedications.map((medication: any) => (
                <Card key={medication.id} className="opacity-60">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{medication.name}</h3>
                          <Badge className={typeColors[medication.type as keyof typeof typeColors]}>
                            {typeNames[medication.type as keyof typeof typeNames]}
                          </Badge>
                          <Badge variant="outline">Inativo</Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p><strong>Dosagem:</strong> {medication.dosage}</p>
                          <p><strong>Frequência:</strong> {frequencyNames[medication.frequency as keyof typeof frequencyNames]}</p>
                        </div>
                      </div>
                      <Switch
                        checked={medication.isActive}
                        onCheckedChange={() => toggleActive(medication.id, medication.isActive)}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {medications.length === 0 && !isLoading && (
          <Card>
            <CardContent className="text-center py-8">
              <Pill className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Nenhum medicamento registrado ainda.</p>
              <p className="text-sm text-gray-400">Adicione seus medicamentos para melhor controle.</p>
            </CardContent>
          </Card>
        )}

        {/* Reminder */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p className="font-semibold text-purple-800 mb-1">💊 Lembrete importante:</p>
              <ul className="text-purple-700 text-sm space-y-1">
                <li>• Sempre siga as orientações médicas</li>
                <li>• Não interrompa medicamentos sem consultar seu médico</li>
                <li>• Mantenha um horário regular para tomar os medicamentos</li>
                <li>• Informe seu médico sobre todos os medicamentos que está tomando</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}