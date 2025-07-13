import { useAuth } from "@/hooks/useAuth";
import UserMenu from "./user-menu";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showUserMenu?: boolean;
}

export default function Header({ title, subtitle, showUserMenu = true }: HeaderProps) {
  const { user } = useAuth();

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-xl font-bold">{title}</h1>
        {subtitle && (
          <p className="text-sm opacity-90">{subtitle}</p>
        )}
      </div>
      {showUserMenu && <UserMenu />}
    </div>
  );
}