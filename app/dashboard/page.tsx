"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="p-10">

      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <Button onClick={logout}>
          Logout
        </Button>
      </div>

      <div className="bg-white shadow p-6 rounded-xl">
        <p className="text-lg">
          Bienvenido <strong>{user?.name}</strong>
        </p>

        <p className="text-gray-500">
          Rol: {user?.role}
        </p>
      </div>

      <pre className="mt-6 bg-gray-100 p-4 rounded">
        {JSON.stringify(user, null, 2)}
      </pre>

    </div>
  );
}