import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, FileText, Heart, Music, Baby } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

export default function BirthPlan() {
  const [, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    preferredHospital: "",
    preferredDoctor: "",
    birthType: "",
    painManagement: "",
    laborPreferences: [] as string[],
    birthPreferences: [] as string[],
    emergencyContacts: {
      contact1: { name: "", phone: "", relationship: "" },
      contact2: { name: "", phone: "", relationship: "" }
    },
    specialInstructions: "",
    musicPlaylist: [] as string[],
    birthingTools: [] as string[]
  });

  const queryClient = useQueryClient();

  const { data: birthPlan, isLoading } = useQuery({
    queryKey: ['/api/birth-plan'],
    queryFn: () => apiRequest('/api/birth-plan'),
  });

  const saveBirthPlan = useMutation({
    mutationFn: (data: any) => {
      if (birthPlan) {
        return apiRequest(`/api/birth-plan/${birthPlan.id}`, {
          method: 'PATCH',
          body: JSON.stringify(data),
        });
      } else {
        return apiRequest('/api/birth-plan', {
          method: 'POST',
          body: JSON.stringify(data),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/birth-plan'] });
      setIsEditing(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveBirthPlan.mutate({
      ...formData,
      emergencyContacts: formData.emergencyContacts,
      laborPreferences: formData.laborPreferences,
      birthPreferences: formData.birthPreferences,
      musicPlaylist: formData.musicPlaylist,
      birthingTools: formData.birthingTools
    });
  };

  const laborOptions = [
    "Ambiente com pouca luz",
    "Música relaxante",
    "Presença do parceiro",
    "Liberdade de movimento",
    "Banho de chuveiro",
    "Banheira",
    "Bola de pilates",
    "Massagem",
    "Aromaterapia",
    "Posição verticalizada"
  ];

  const birthOptions = [
    "Parto humanizado",
    "Contato pele a pele imediato",
    "Clampeamento tardio do cordão",
    "Amamentação na primeira hora",
    "Parceiro cortar o cordão",
    "Evitar aspiração de rotina",
    "Evitar colírios nos olhos",
    "Manter bebê no quarto",
    "Evitar complemento",
    "Fotos/vídeo do nascimento"
  ];

  const birthingToolsOptions = [
    "Bola de pilates",
    "Banqueta de parto",
    "Cavalinho",
    "Rebozo",
    "Banheira",
    "Chuveiro",
    "Almofadas",
    "Óleos essenciais"
  ];

  // Load existing birth plan data when editing
  useEffect(() => {
    if (birthPlan && isEditing) {
      setFormData({
        preferredHospital: birthPlan.preferredHospital || "",
        preferredDoctor: birthPlan.preferredDoctor || "",
        birthType: birthPlan.birthType || "",
        painManagement: birthPlan.painManagement || "",
        laborPreferences: birthPlan.laborPreferences || [],
        birthPreferences: birthPlan.birthPreferences || [],
        emergencyContacts: birthPlan.emergencyContacts || {
          contact1: { name: "", phone: "", relationship: "" },
          contact2: { name: "", phone: "", relationship: "" }
        },
        specialInstructions: birthPlan.specialInstructions || "",
        musicPlaylist: birthPlan.musicPlaylist || [],
        birthingTools: birthPlan.birthingTools || []
      });
    }
  }, [birthPlan, isEditing]);

  const handlePreferenceToggle = (preference: string, type: 'labor' | 'birth' | 'tools') => {
    const field = type === 'labor' ? 'laborPreferences' : 
                  type === 'birth' ? 'birthPreferences' : 'birthingTools';
    
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(preference)
        ? prev[field].filter(p => p !== preference)
        : [...prev[field], preference]
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">Carregando plano de parto...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/home')}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Plano de Parto</h1>
          </div>
          
          {!isEditing && birthPlan && (
            <Button onClick={() => setIsEditing(true)} className="bg-rose-500 hover:bg-rose-600">
              Editar Plano
            </Button>
          )}
        </div>

        {!birthPlan && !isEditing ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Crie seu Plano de Parto</h2>
              <p className="text-gray-500 mb-6">
                Um plano de parto ajuda você a comunicar suas preferências para o nascimento do seu bebê.
              </p>
              <Button onClick={() => setIsEditing(true)} className="bg-rose-500 hover:bg-rose-600">
                Criar Plano de Parto
              </Button>
            </CardContent>
          </Card>
        ) : isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Informações Básicas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="preferredHospital">Hospital/Maternidade Preferida</Label>
                    <Input
                      id="preferredHospital"
                      value={formData.preferredHospital}
                      onChange={(e) => setFormData(prev => ({ ...prev, preferredHospital: e.target.value }))}
                      placeholder="Nome da maternidade"
                    />
                  </div>
                  <div>
                    <Label htmlFor="preferredDoctor">Médico Preferido</Label>
                    <Input
                      id="preferredDoctor"
                      value={formData.preferredDoctor}
                      onChange={(e) => setFormData(prev => ({ ...prev, preferredDoctor: e.target.value }))}
                      placeholder="Nome do obstetra"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="birthType">Tipo de Parto Preferido</Label>
                    <Select value={formData.birthType} onValueChange={(value) => setFormData(prev => ({ ...prev, birthType: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="natural">Parto Natural</SelectItem>
                        <SelectItem value="humanized">Parto Humanizado</SelectItem>
                        <SelectItem value="water_birth">Parto na Água</SelectItem>
                        <SelectItem value="cesarean">Cesárea</SelectItem>
                        <SelectItem value="vbac">Parto Normal após Cesárea (VBAC)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="painManagement">Controle da Dor</Label>
                    <Select value={formData.painManagement} onValueChange={(value) => setFormData(prev => ({ ...prev, painManagement: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a opção" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="natural">Apenas métodos naturais</SelectItem>
                        <SelectItem value="epidural">Anestesia peridural</SelectItem>
                        <SelectItem value="nitrous_oxide">Óxido nitroso</SelectItem>
                        <SelectItem value="mixed">Combinação de métodos</SelectItem>
                        <SelectItem value="open">Aberta a todas as opções</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Labor Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Preferências durante o Trabalho de Parto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {laborOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`labor-${option}`}
                        checked={formData.laborPreferences.includes(option)}
                        onCheckedChange={() => handlePreferenceToggle(option, 'labor')}
                      />
                      <Label htmlFor={`labor-${option}`} className="text-sm">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Birth Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Baby className="w-5 h-5" />
                  Preferências para o Nascimento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {birthOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`birth-${option}`}
                        checked={formData.birthPreferences.includes(option)}
                        onCheckedChange={() => handlePreferenceToggle(option, 'birth')}
                      />
                      <Label htmlFor={`birth-${option}`} className="text-sm">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card>
              <CardHeader>
                <CardTitle>Contatos de Emergência</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Contato 1</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Input
                      placeholder="Nome"
                      value={formData.emergencyContacts.contact1.name}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        emergencyContacts: {
                          ...prev.emergencyContacts,
                          contact1: { ...prev.emergencyContacts.contact1, name: e.target.value }
                        }
                      }))}
                    />
                    <Input
                      placeholder="Telefone"
                      value={formData.emergencyContacts.contact1.phone}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        emergencyContacts: {
                          ...prev.emergencyContacts,
                          contact1: { ...prev.emergencyContacts.contact1, phone: e.target.value }
                        }
                      }))}
                    />
                    <Input
                      placeholder="Relacionamento"
                      value={formData.emergencyContacts.contact1.relationship}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        emergencyContacts: {
                          ...prev.emergencyContacts,
                          contact1: { ...prev.emergencyContacts.contact1, relationship: e.target.value }
                        }
                      }))}
                    />
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Contato 2</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Input
                      placeholder="Nome"
                      value={formData.emergencyContacts.contact2.name}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        emergencyContacts: {
                          ...prev.emergencyContacts,
                          contact2: { ...prev.emergencyContacts.contact2, name: e.target.value }
                        }
                      }))}
                    />
                    <Input
                      placeholder="Telefone"
                      value={formData.emergencyContacts.contact2.phone}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        emergencyContacts: {
                          ...prev.emergencyContacts,
                          contact2: { ...prev.emergencyContacts.contact2, phone: e.target.value }
                        }
                      }))}
                    />
                    <Input
                      placeholder="Relacionamento"
                      value={formData.emergencyContacts.contact2.relationship}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        emergencyContacts: {
                          ...prev.emergencyContacts,
                          contact2: { ...prev.emergencyContacts.contact2, relationship: e.target.value }
                        }
                      }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Birthing Tools */}
            <Card>
              <CardHeader>
                <CardTitle>Recursos Desejados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {birthingToolsOptions.map((tool) => (
                    <div key={tool} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tool-${tool}`}
                        checked={formData.birthingTools.includes(tool)}
                        onCheckedChange={() => handlePreferenceToggle(tool, 'tools')}
                      />
                      <Label htmlFor={`tool-${tool}`} className="text-sm">
                        {tool}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Special Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Instruções Especiais</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.specialInstructions}
                  onChange={(e) => setFormData(prev => ({ ...prev, specialInstructions: e.target.value }))}
                  placeholder="Instruções adicionais, alergias, condições especiais..."
                  rows={4}
                />
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button type="submit" disabled={saveBirthPlan.isPending} className="flex-1 bg-rose-500 hover:bg-rose-600">
                {saveBirthPlan.isPending ? 'Salvando...' : 'Salvar Plano de Parto'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        ) : birthPlan ? (
          <div className="space-y-6">
            {/* Display Birth Plan */}
            <Card>
              <CardHeader>
                <CardTitle>Meu Plano de Parto</CardTitle>
                <p className="text-sm text-gray-500">
                  Última atualização: {new Date(birthPlan.updatedAt).toLocaleDateString('pt-BR')}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-700">Hospital/Maternidade</h4>
                    <p>{birthPlan.preferredHospital || 'Não especificado'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700">Médico</h4>
                    <p>{birthPlan.preferredDoctor || 'Não especificado'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700">Tipo de Parto</h4>
                    <p>{birthPlan.birthType || 'Não especificado'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700">Controle da Dor</h4>
                    <p>{birthPlan.painManagement || 'Não especificado'}</p>
                  </div>
                </div>

                {/* Preferences Lists */}
                {birthPlan.laborPreferences?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Trabalho de Parto</h4>
                    <ul className="list-disc pl-5 text-sm">
                      {birthPlan.laborPreferences.map((pref: string, index: number) => (
                        <li key={index}>{pref}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {birthPlan.birthPreferences?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Nascimento</h4>
                    <ul className="list-disc pl-5 text-sm">
                      {birthPlan.birthPreferences.map((pref: string, index: number) => (
                        <li key={index}>{pref}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Emergency Contacts */}
                {birthPlan.emergencyContacts && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Contatos de Emergência</h4>
                    <div className="space-y-2 text-sm">
                      {birthPlan.emergencyContacts.contact1?.name && (
                        <p>
                          <strong>{birthPlan.emergencyContacts.contact1.name}</strong> 
                          ({birthPlan.emergencyContacts.contact1.relationship}) - 
                          {birthPlan.emergencyContacts.contact1.phone}
                        </p>
                      )}
                      {birthPlan.emergencyContacts.contact2?.name && (
                        <p>
                          <strong>{birthPlan.emergencyContacts.contact2.name}</strong> 
                          ({birthPlan.emergencyContacts.contact2.relationship}) - 
                          {birthPlan.emergencyContacts.contact2.phone}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Special Instructions */}
                {birthPlan.specialInstructions && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Instruções Especiais</h4>
                    <p className="text-sm bg-gray-50 p-3 rounded">{birthPlan.specialInstructions}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : null}

        {/* Tips */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-3">
              <p className="font-semibold text-rose-800 mb-1">💡 Sobre o Plano de Parto:</p>
              <ul className="text-rose-700 text-sm space-y-1">
                <li>• O plano de parto é um guia, não um contrato</li>
                <li>• Seja flexível, pois imprevistos podem acontecer</li>
                <li>• Discuta seu plano com sua equipe médica</li>
                <li>• Leve uma cópia para a maternidade</li>
                <li>• Atualize conforme necessário durante a gravidez</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}