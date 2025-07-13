import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Heart, Edit, Trash2 } from "lucide-react";

interface DiaryEntryProps {
  entry: {
    id: number;
    title?: string;
    content: string;
    mood?: string;
    tags?: string[];
    createdAt: string;
  };
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export default function DiaryEntry({ entry, onEdit, onDelete }: DiaryEntryProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Hoje às ${date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Ontem às ${date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
    } else {
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });
    }
  };

  const getMoodColor = (mood?: string) => {
    switch (mood) {
      case "happy":
        return "bg-sage text-sage-foreground";
      case "sad":
        return "bg-accent text-accent-foreground";
      case "anxious":
        return "bg-yellow-500 text-white";
      case "excited":
        return "bg-primary text-primary-foreground";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <Card className="bg-white rounded-2xl card-shadow hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            {entry.title && (
              <h3 className="font-semibold text-gray-800 mb-1">{entry.title}</h3>
            )}
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Clock size={12} />
              <span>{formatDate(entry.createdAt)}</span>
            </div>
          </div>
          <div className="flex space-x-2">
            {onEdit && (
              <button
                onClick={() => onEdit(entry.id)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Edit size={14} className="text-gray-500" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(entry.id)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Trash2 size={14} className="text-gray-500" />
              </button>
            )}
          </div>
        </div>

        <p className="text-gray-700 text-sm mb-3 leading-relaxed">{entry.content}</p>

        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {entry.mood && (
              <Badge className={getMoodColor(entry.mood)}>
                <Heart size={12} className="mr-1" />
                {entry.mood}
              </Badge>
            )}
            {entry.tags?.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
