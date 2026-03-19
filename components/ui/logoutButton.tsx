import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";


export function LogOutButton() {
    const router = useRouter();
  
    const logout = () => {
    localStorage.removeItem("rol");
    router.push("/");
    };

  return (
        <button
        onClick={logout}
        className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition text-sm font-medium"
        >
        <LogOut className="w-4 h-4 shrink-0" />
        Cerrar Sesión
        </button>
  );
}