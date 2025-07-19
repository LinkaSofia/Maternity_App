import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Camera, Calendar } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

export default function BellyPhotos() {
  const [, setLocation] = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    weekNumber: "",
    photoUrl: "",
    date: new Date().toISOString().split('T')[0],
    notes: ""
  });

  const queryClient = useQueryClient();

  const { data: bellyPhotos = [], isLoading } = useQuery({
    queryKey: ['/api/belly-photos'],
    queryFn: () => apiRequest('/api/belly-photos'),
  });

  const createBellyPhoto = useMutation({
    mutationFn: (data: any) => apiRequest('/api/belly-photos', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/belly-photos'] });
      setShowForm(false);
      setFormData({ weekNumber: "", photoUrl: "", date: new Date().toISOString().split('T')[0], notes: "" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBellyPhoto.mutate({
      weekNumber: parseInt(formData.weekNumber),
      photoUrl: formData.photoUrl,
      date: formData.date,
      notes: formData.notes || undefined
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For now, we'll use a placeholder URL
      // In a real app, you'd upload to a service like Cloudinary
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const groupedByMonth = bellyPhotos.reduce((acc: any, photo: any) => {
    const month = new Date(photo.date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' });
    if (!acc[month]) acc[month] = [];
    acc[month].push(photo);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50 p-4">
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
          <h1 className="text-2xl font-bold text-gray-900">Fotos da Barriga</h1>
        </div>

        {/* Statistics */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Timeline da Gravidez
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600">{bellyPhotos.length}</div>
                <div className="text-sm text-gray-500">Fotos Registradas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {bellyPhotos.length > 0 
                    ? Math.max(...bellyPhotos.map((p: any) => p.weekNumber))
                    : '--'}
                </div>
                <div className="text-sm text-gray-500">Última Semana</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Object.keys(groupedByMonth).length}
                </div>
                <div className="text-sm text-gray-500">Meses Registrados</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Photo Button */}
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="w-full mb-6 bg-pink-500 hover:bg-pink-600"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Adicionar Foto
          </Button>
        )}

        {/* Add Photo Form */}
        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Nova Foto da Barriga</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="weekNumber">Semana da Gravidez</Label>
                    <Input
                      id="weekNumber"
                      type="number"
                      min="1"
                      max="42"
                      value={formData.weekNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, weekNumber: e.target.value }))}
                      required
                      placeholder="Ex: 20"
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
                </div>

                <div>
                  <Label htmlFor="photo">Foto</Label>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="mb-2"
                  />
                  {formData.photoUrl && (
                    <div className="mt-2">
                      <img 
                        src={formData.photoUrl} 
                        alt="Preview" 
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="notes">Observações (opcional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Como você estava se sentindo, mudanças no corpo..."
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={createBellyPhoto.isPending} className="flex-1">
                    {createBellyPhoto.isPending ? 'Salvando...' : 'Salvar Foto'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Photo Timeline */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : bellyPhotos.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Camera className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 mb-2">Nenhuma foto registrada ainda.</p>
                <p className="text-sm text-gray-400">Comece a documentar sua jornada!</p>
              </CardContent>
            </Card>
          ) : (
            Object.entries(groupedByMonth)
              .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
              .map(([month, photos]: [string, any]) => (
                <div key={month}>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {month}
                    <span className="text-sm text-gray-500">({photos.length} fotos)</span>
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {photos
                      .sort((a: any, b: any) => b.weekNumber - a.weekNumber)
                      .map((photo: any) => (
                        <Card key={photo.id} className="overflow-hidden">
                          <div className="aspect-square relative">
                            {photo.photoUrl ? (
                              <img 
                                src={photo.photoUrl} 
                                alt={`${photo.weekNumber} semanas`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <Camera className="w-16 h-16 text-gray-400" />
                              </div>
                            )}
                            <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm font-semibold">
                              {photo.weekNumber}ª semana
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <div className="text-sm text-gray-500 mb-1">
                              {new Date(photo.date).toLocaleDateString('pt-BR')}
                            </div>
                            {photo.notes && (
                              <div className="text-sm text-gray-700">
                                {photo.notes}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              ))
          )}
        </div>

        {/* Tips */}
        {bellyPhotos.length > 0 && (
          <Card className="mt-6">
            <CardContent className="p-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="font-semibold text-orange-800 mb-1">📸 Dicas para fotos:</p>
                <ul className="text-orange-700 text-sm space-y-1">
                  <li>• Tire fotos no mesmo local e posição</li>
                  <li>• Use a mesma roupa ou roupa similar</li>
                  <li>• Fotografe sempre no mesmo horário do dia</li>
                  <li>• Mantenha a mesma distância da câmera</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}