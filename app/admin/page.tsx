"use client";

import RoleGuard from "@/components/RoleGuard";
import LogoutButton from "@/components/LogoutButton";

export default function AdminPage() {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <div className="p-10">
        <h1 className="text-3xl font-bold mb-6">
          Admin Dashboard
        </h1>
        <LogoutButton />

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="font-semibold">Consultorios</h2>
            <p className="text-gray-500">12 registrados</p>
          </div>

          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="font-semibold">Usuarios</h2>
            <p className="text-gray-500">54 activos</p>
          </div>

          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="font-semibold">Pacientes</h2>
            <p className="text-gray-500">230 registrados</p>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}