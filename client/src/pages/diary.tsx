import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Image } from "lucide-react";
import DiaryEntry from "@/components/diary-entry";

export default function Diary() {
  const [newEntry, setNewEntry] = useState({ title: "", content: "" });
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
    mutationFn: async (entry: { title: string; content: string }) => {
      await apiRequest("POST", "/api/diary", entry);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/diary"] });
      setNewEntry({ title: "", content: "" });
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

  const deleteEntryMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/diary/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/diary"] });
      toast({
        title: "Entrada excluída!",
        description: "A entrada foi removida com sucesso.",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.content.trim()) return;
    
    createEntryMutation.mutate(newEntry);
  };

  const displayEntries = searchQuery ? searchResults : entries;

  return (
    <div className="space-y-6">
      {/* Add New Entry */}
      <Card className="bg-white rounded-2xl card-shadow">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Nova Entrada</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Título (opcional)"
              value={newEntry.title}
              onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
              className="rounded-xl"
            />
            <Textarea
              placeholder="Como você está se sentindo hoje?"
              value={newEntry.content}
              onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
              className="h-32 rounded-xl resize-none"
              required
            />
            <div className="flex space-x-2">
              <Button
                type="submit"
                disabled={createEntryMutation.isPending}
                className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 smooth-transition"
              >
                <Plus className="mr-2" size={16} />
                {createEntryMutation.isPending ? "Salvando..." : "Adicionar"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="px-4 py-3 rounded-xl"
              >
                <Image className="text-gray-500" size={16} />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Search */}
      <Card className="bg-white rounded-2xl card-shadow">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Buscar Entradas</h2>
          <div className="flex space-x-2">
            <Input
              placeholder="Pesquisar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 rounded-xl"
            />
            <Button className="px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary/90">
              <Search size={16} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Entries List */}
      <div className="space-y-4">
        {isLoading ? (
          <Card className="bg-white rounded-2xl card-shadow">
            <CardContent className="p-6 text-center">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            </CardContent>
          </Card>
        ) : displayEntries?.length > 0 ? (
          displayEntries.map((entry: any) => (
            <DiaryEntry
              key={entry.id}
              entry={entry}
              onDelete={(id) => deleteEntryMutation.mutate(id)}
            />
          ))
        ) : (
          <Card className="bg-white rounded-2xl card-shadow">
            <CardContent className="p-6 text-center">
              <div className="text-gray-500 mb-4">
                <Plus size={48} className="mx-auto mb-2 opacity-50" />
                <p>
                  {searchQuery 
                    ? "Nenhuma entrada encontrada para sua pesquisa."
                    : "Nenhuma entrada no diário ainda."}
                </p>
                <p className="text-sm mt-2">
                  {!searchQuery && "Comece escrevendo sua primeira entrada!"}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
