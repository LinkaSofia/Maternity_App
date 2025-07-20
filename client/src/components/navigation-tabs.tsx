import { Home, BookOpen, Lightbulb } from "lucide-react";
import LogoIcon from "./LogoIcon";

interface NavigationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function NavigationTabs({ activeTab, onTabChange }: NavigationTabsProps) {
  const tabs = [
    { id: "home", label: "Início", icon: Home },
    { id: "baby", label: "Bebê", icon: LogoIcon },
    { id: "diary", label: "Diário", icon: BookOpen },
    { id: "tips", label: "Dicas", icon: Lightbulb },
  ];

  return (
    <div className="flex bg-white border-b border-gray-200">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 py-4 text-center font-semibold transition-colors ${
              isActive
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Icon className="block mx-auto mb-1" size={20} />
            <span className="text-xs">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
