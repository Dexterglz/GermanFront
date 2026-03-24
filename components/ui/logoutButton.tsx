import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/app/lib/utils";


export function LogOutButton({ collapsed }: { collapsed?: boolean }) {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("rol");
    router.push("/");
  };

  return (
    <button
      onClick={logout}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
        "text-sidebar-foreground/60 hover:bg-destructive/20 hover:text-destructive",
        collapsed && "justify-center px-0"
      )}
      title={collapsed ? "Cerrar sesión" : undefined}
    >
      <LogOut className="w-4 h-4 shrink-0" />
      {!collapsed && <span>Cerrar sesión</span>}
    </button>
  );
}