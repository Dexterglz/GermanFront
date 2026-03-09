"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Role } from "@/types/user";

interface Props {
  allowedRoles: Role[];
  children: React.ReactNode;
}

export default function RoleGuard({ allowedRoles, children }: Props) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      router.push("/dashboard");
    }
  }, [user, router, allowedRoles]);

  if (!user) return <p>Cargando...</p>;

  if (!allowedRoles.includes(user.role)) {
    return <p>No autorizado</p>;
  }

  return <>{children}</>;
}