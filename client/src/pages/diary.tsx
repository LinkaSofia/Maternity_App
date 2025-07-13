import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Image, Edit3, Trash2 } from "lucide-react";
import DiaryEntry from "@/components/diary-entry";
import DiaryForm from "@/components/diary-form";
import UserMenu from "@/components/user-menu";
import type { DiaryEntry as DiaryEntryType } from "@shared/schema";

export default function Diary() {
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DiaryEntryType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: entries, isLoading } = useQuery({
    queryKey: ["/api/diary"],
  });

  const { data: searchResults } = useQuery({
    queryKey: ["/api/diary/search", searchQuery],
    enabled: searchQuery.length > 0,
  });

  const createEntryMutation = useMutation({
    mutationFn: async (entry: { title?: string; content: string; mood?: string; tags?: string[] }) => {
      await apiRequest("POST", "/api/diary", entry);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/diary"] });
      setShowForm(false);
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
    mutationFn: async ({ id, entry }: { id: number; entry: Partial<DiaryEntryType> }) => {
      await apiRequest("PUT", `/api/diary/${id}`, entry);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/diary"] });
      setEditingEntry(null);
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



  const handleSubmit = (entry: { title?: string; content: string; mood?: string; tags?: string[] }) => {
    createEntryMutation.mutate(entry);
  };

  const handleEdit = (entry: DiaryEntryType) => {
    setEditingEntry(entry);
  };

  const handleUpdate = (entry: { title?: string; content: string; mood?: string; tags?: string[] }) => {
    if (editingEntry) {
      updateEntryMutation.mutate({ id: editingEntry.id, entry });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta entrada?")) {
      deleteEntryMutation.mutate(id);
    }
  };

  const displayedEntries = searchQuery ? searchResults : entries;

  return (
    <div className="max-w-sm mx-auto bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Meu Diário</h1>
            <UserMenu />
          </div>
          <p className="text-sm opacity-90 mt-2">
            Registre seus pensamentos e sentimentos
          </p>
        </div>
      </div>

      {/* Form ou Editor */}
      {(showForm || editingEntry) && (
        <div className="p-6">
          <DiaryForm
            onSubmit={editingEntry ? handleUpdate : handleSubmit}
            initialEntry={editingEntry || undefined}
            isEditing={!!editingEntry}
            onCancel={() => {
              setShowForm(false);
              setEditingEntry(null);
            }}
          />
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
            className="pl-10 rounded-xl bg-white/80 backdrop-blur-sm border-0"
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
            <DiaryEntry
              key={entry.id}
              entry={entry}
              onEdit={() => handleEdit(entry)}
              onDelete={() => handleDelete(entry.id)}
            />
          ))
        ) : (
          <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border-0">
            <CardContent className="p-6 text-center">
              <div className="text-gray-500">
                <Image className="mx-auto mb-4" size={48} />
                <p className="text-lg font-medium">Nenhuma entrada encontrada</p>
                <p className="text-sm mt-2">
                  {searchQuery ? "Tente uma busca diferente" : "Comece escrevendo sua primeira entrada"}
                </p>
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
