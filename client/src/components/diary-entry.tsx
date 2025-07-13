import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Heart, Edit, Trash2, Smile, Frown, Meh } from "lucide-react";

interface DiaryEntryProps {
  entry: {
    id: number;
    title?: string;
    content: string;
    mood?: string;
    tags?: string[];
    createdAt: string;
  };
  onEdit?: () => void;
  onDelete?: () => void;
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

  const getMoodIcon = (mood?: string) => {
    switch (mood) {
      case "happy":
        return { icon: Smile, color: "text-yellow-500 bg-yellow-50" };
      case "sad":
        return { icon: Frown, color: "text-blue-500 bg-blue-50" };
      case "excited":
        return { icon: Heart, color: "text-pink-500 bg-pink-50" };
      case "neutral":
        return { icon: Meh, color: "text-gray-500 bg-gray-50" };
      default:
        return null;
    }
  };

  const moodData = getMoodIcon(entry.mood);

  return (
    <Card className="bg-white/80 backdrop-blur-sm rounded-2xl card-shadow border-0 hover:shadow-lg transition-shadow">
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
              <Button
                onClick={onEdit}
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Edit size={14} className="text-gray-500" />
              </Button>
            )}
            {onDelete && (
              <Button
                onClick={onDelete}
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Trash2 size={14} className="text-gray-500" />
              </Button>
            )}
          </div>
        </div>

        <p className="text-gray-700 text-sm mb-3 leading-relaxed">{entry.content}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {moodData && (
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded-full ${moodData.color}`}>
                  {React.createElement(moodData.icon, { size: 12 })}
                </div>
                <span className="text-xs text-gray-600">
                  {entry.mood === "happy" ? "Feliz" : 
                   entry.mood === "sad" ? "Triste" :
                   entry.mood === "excited" ? "Animada" :
                   entry.mood === "neutral" ? "Neutro" : entry.mood}
                </span>
              </div>
            )}
            {entry.tags && entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {entry.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-gradient-to-r from-pink-100 to-purple-100 text-gray-700">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
