"use client";

import RoleGuard from "@/components/RoleGuard";
import LogoutButton from "@/components/LogoutButton";


export default function PatientPage() {
  return (
    <RoleGuard allowedRoles={["patient"]}>
      <div className="p-10">
        <h1 className="text-3xl font-bold mb-6">
          Portal del Paciente
        </h1>
        <LogoutButton />

        <p className="text-gray-600">
          Aquí podrás ver tus citas, medicamentos y diagnósticos.
        </p>
      </div>
    </RoleGuard>
  );
}