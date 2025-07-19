import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Image, Edit3, Trash2, Heart, Calendar, Smile, BookOpen, Camera } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { DiaryEntry as DiaryEntryType } from "@shared/schema";

const diaryEntrySchema = z.object({
  date: z.string().min(1, "Data e hora são obrigatórias"),
  title: z.string().min(1, "Título é obrigatório"),
  content: z.string().min(10, "Conteúdo deve ter pelo menos 10 caracteres"),
  mood: z.string().optional(),
  tags: z.array(z.string()).optional(),
  imageData: z.string().optional(),
});

type DiaryEntryFormData = z.infer<typeof diaryEntrySchema>;

export default function Diary() {
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DiaryEntryType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<DiaryEntryFormData>({
    resolver: zodResolver(diaryEntrySchema),
    defaultValues: {
      date: new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:MM
      title: "",
      content: "",
      mood: "",
      tags: [],
      imageData: "",
    },
  });

  const { data: entries, isLoading } = useQuery({
    queryKey: ["/api/diary"],
  });

  const { data: searchResults } = useQuery({
    queryKey: ["/api/diary/search", searchQuery],
    enabled: searchQuery.length > 0,
  });

  const createEntryMutation = useMutation({
    mutationFn: async (entry: DiaryEntryFormData) => {
      await apiRequest("POST", "/api/diary", {
        date: entry.date,
        title: entry.title,
        content: entry.content,
        mood: entry.mood,
        tags: entry.tags,
        imageUrl: entry.imageData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/diary"] });
      setShowForm(false);
      form.reset();
      setImagePreview(null);
      setSelectedMood("");
      toast({
        title: "Entrada criada!",
        description: "Sua entrada foi salva com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível criar a entrada.",
        variant: "destructive",
      });
    },
  });

  const updateEntryMutation = useMutation({
    mutationFn: async ({ id, entry }: { id: number; entry: Partial<DiaryEntryFormData> }) => {
      await apiRequest("PUT", `/api/diary/${id}`, {
        date: entry.date,
        title: entry.title,
        content: entry.content,
        mood: entry.mood,
        tags: entry.tags,
        imageUrl: entry.imageData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/diary"] });
      setEditingEntry(null);
      form.reset();
      setImagePreview(null);
      setSelectedMood("");
      toast({
        title: "Entrada atualizada!",
        description: "Suas alterações foram salvas.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a entrada.",
        variant: "destructive",
      });
    },
  });

  const deleteEntryMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/diary/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/diary"] });
      toast({
        title: "Entrada removida!",
        description: "A entrada foi excluída com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a entrada.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (entry: DiaryEntryFormData) => {
    if (editingEntry) {
      updateEntryMutation.mutate({ id: editingEntry.id, entry });
    } else {
      createEntryMutation.mutate(entry);
    }
  };

  const handleEdit = (entry: DiaryEntryType) => {
    setEditingEntry(entry);
    form.reset({
      date: new Date(entry.date).toISOString().slice(0, 16),
      title: entry.title || "",
      content: entry.content,
      mood: entry.mood || "",
      tags: entry.tags || [],
      imageData: entry.imageUrl || "",
    });
    setImagePreview(entry.imageUrl || null);
    setSelectedMood(entry.mood || "");
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta entrada?")) {
      deleteEntryMutation.mutate(id);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        form.setValue("imageData", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEntry(null);
    form.reset();
    setImagePreview(null);
    setSelectedMood("");
  };

  const moods = [
    { value: "feliz", label: "😊 Feliz", color: "bg-green-100 text-green-700" },
    { value: "tranquila", label: "😌 Tranquila", color: "bg-blue-100 text-blue-700" },
    { value: "ansiosa", label: "😰 Ansiosa", color: "bg-yellow-100 text-yellow-700" },
    { value: "cansada", label: "😴 Cansada", color: "bg-purple-100 text-purple-700" },
    { value: "emocionada", label: "🥰 Emocionada", color: "bg-pink-100 text-pink-700" },
    { value: "preocupada", label: "😟 Preocupada", color: "bg-orange-100 text-orange-700" },
  ];

  const displayedEntries = searchQuery ? searchResults : entries;

  return (
    <div className="max-w-sm mx-auto bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-1000"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <BookOpen className="mr-2" size={24} />
                Meu Diário
              </h1>
              <p className="text-sm opacity-90 mt-2">
                Registre seus pensamentos e sentimentos
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl">📖</div>
            </div>
          </div>
        </div>
      </div>

      {/* Form ou Editor */}
      {(showForm || editingEntry) && (
        <div className="p-6">
          <Card className="bg-gradient-to-br from-white to-pink-50 rounded-2xl shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingEntry ? "Editar Entrada" : "Nova Entrada"}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Data e Hora *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            className="rounded-xl"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Título *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Título da sua entrada..."
                            className="rounded-xl"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Conteúdo *
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Como você está se sentindo hoje? O que aconteceu de especial?"
                            className="rounded-xl min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Mood Selection */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Como você está se sentindo?
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {moods.map((mood) => (
                        <button
                          key={mood.value}
                          type="button"
                          onClick={() => {
                            setSelectedMood(mood.value);
                            form.setValue("mood", mood.value);
                          }}
                          className={`p-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                            selectedMood === mood.value
                              ? mood.color + " ring-2 ring-offset-2 ring-purple-500"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {mood.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Adicionar foto (opcional)
                    </label>
                    <div className="text-center">
                      <div className="relative inline-block">
                        <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center overflow-hidden shadow-lg border-2 border-dashed border-pink-300">
                          {imagePreview ? (
                            <img 
                              src={imagePreview} 
                              alt="Preview" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Camera className="text-pink-400" size={32} />
                          )}
                        </div>
                        <label className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200">
                          <Camera className="text-white" size={16} />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Clique para adicionar uma foto</p>
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button
                      type="submit"
                      disabled={createEntryMutation.isPending || updateEntryMutation.isPending}
                      className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {createEntryMutation.isPending || updateEntryMutation.isPending ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Salvando...</span>
                        </div>
                      ) : (
                        <>
                          <Heart className="mr-2" size={16} />
                          {editingEntry ? "Atualizar" : "Salvar"}
                        </>
                      )}
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      className="px-6 py-3 rounded-xl bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-300"
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search Bar */}
      <div className="mx-6 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <Input
            placeholder="Buscar entradas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl bg-white/80 backdrop-blur-sm border-0 shadow-lg"
          />
        </div>
      </div>

      {/* Entries List */}
      <div className="mx-6 space-y-4 pb-20">
        {isLoading ? (
          <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-0">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ) : displayedEntries && displayedEntries.length > 0 ? (
          displayedEntries.map((entry: any) => (
            <Card key={entry.id} className="bg-gradient-to-br from-white to-pink-50 rounded-2xl shadow-lg border-0 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-lg mb-1">
                      {entry.title || "Entrada do diário"}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                      <Calendar size={14} />
                      <span>
                        {new Date(entry.createdAt).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(entry)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Edit3 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(entry.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>

                {entry.imageUrl && (
                  <div className="mb-3">
                    <img 
                      src={entry.imageUrl} 
                      alt="Entrada" 
                      className="w-full h-48 object-cover rounded-xl"
                    />
                  </div>
                )}

                <p className="text-gray-700 leading-relaxed mb-3">
                  {entry.content}
                </p>

                {entry.mood && (
                  <div className="flex items-center space-x-2 mb-3">
                    <Smile className="text-pink-500" size={16} />
                    <span className="text-sm text-gray-600">
                      Humor: {moods.find(m => m.value === entry.mood)?.label || entry.mood}
                    </span>
                  </div>
                )}

                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {entry.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="bg-gradient-to-br from-white to-pink-50 rounded-2xl border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="text-gray-500">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="text-pink-500" size={32} />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  {searchQuery ? "Nenhuma entrada encontrada" : "Seu diário está vazio"}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {searchQuery ? "Tente uma busca diferente" : "Comece a registrar seus momentos especiais"}
                </p>
                {!searchQuery && (
                  <Button
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-xl font-medium hover:from-pink-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Plus className="mr-2" size={16} />
                    Primeira Entrada
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Floating Action Button */}
      {!showForm && !editingEntry && (
        <div className="fixed bottom-8 right-8 z-50">
          <Button
            onClick={() => setShowForm(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg hover:from-pink-600 hover:to-purple-600 hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <Plus size={24} />
          </Button>
        </div>
      )}
    </div>
  );
}
