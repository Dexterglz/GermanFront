"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role === "admin") {
      router.push("/admin");
    }

    if (user.role === "doctor") {
      router.push("/doctor");
    }

    if (user.role === "patient") {
      router.push("/patient");
    }
  }, [user]);

  return null;
}