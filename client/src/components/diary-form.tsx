import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Heart, Smile, Frown, Meh, X, Plus, Save } from "lucide-react";

interface DiaryFormProps {
  onSubmit: (entry: {
    title?: string;
    content: string;
    mood?: string;
    tags?: string[];
  }) => void;
  initialEntry?: {
    title?: string;
    content: string;
    mood?: string;
    tags?: string[];
  };
  isEditing?: boolean;
  onCancel?: () => void;
}

export default function DiaryForm({ onSubmit, initialEntry, isEditing = false, onCancel }: DiaryFormProps) {
  const [title, setTitle] = useState(initialEntry?.title || "");
  const [content, setContent] = useState(initialEntry?.content || "");
  const [mood, setMood] = useState(initialEntry?.mood || "");
  const [tags, setTags] = useState<string[]>(initialEntry?.tags || []);
  const [tagInput, setTagInput] = useState("");

  const moods = [
    { value: "happy", label: "Feliz", icon: Smile, color: "text-yellow-500 bg-yellow-50" },
    { value: "neutral", label: "Neutro", icon: Meh, color: "text-gray-500 bg-gray-50" },
    { value: "sad", label: "Triste", icon: Frown, color: "text-blue-500 bg-blue-50" },
    { value: "excited", label: "Animada", icon: Heart, color: "text-pink-500 bg-pink-50" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    onSubmit({
      title: title.trim() || undefined,
      content: content.trim(),
      mood: mood || undefined,
      tags: tags.length > 0 ? tags : undefined,
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-0">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            {isEditing ? "Editar Entrada" : "Nova Entrada no Diário"}
          </h2>
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X size={16} />
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título */}
          <div>
            <Label htmlFor="title" className="text-sm font-medium text-gray-700 mb-2 block">
              Título (opcional)
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Como foi o seu dia?"
              className="rounded-xl"
            />
          </div>

          {/* Conteúdo */}
          <div>
            <Label htmlFor="content" className="text-sm font-medium text-gray-700 mb-2 block">
              Escreva sobre o seu dia *
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Hoje me senti... O bebê se movimentou muito... Estou animada para..."
              className="rounded-xl min-h-[120px] resize-none"
              required
            />
          </div>

          {/* Humor */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Como você se sente hoje?
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {moods.map((moodOption) => {
                const Icon = moodOption.icon;
                return (
                  <button
                    key={moodOption.value}
                    type="button"
                    onClick={() => setMood(moodOption.value)}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                      mood === moodOption.value
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200 hover:border-pink-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-full ${moodOption.color}`}>
                        <Icon size={16} />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {moodOption.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Etiquetas (opcional)
            </Label>
            <div className="flex space-x-2 mb-3">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ex: consulta, enjoo, movimento..."
                className="rounded-xl flex-1"
              />
              <Button
                type="button"
                onClick={addTag}
                variant="outline"
                size="icon"
                className="rounded-xl"
              >
                <Plus size={16} />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-pink-100 to-purple-100 text-gray-700"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X size={12} />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Botões */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:from-pink-600 hover:to-purple-600"
            >
              <Save size={16} className="mr-2" />
              {isEditing ? "Salvar Alterações" : "Salvar Entrada"}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="px-6 rounded-xl"
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}