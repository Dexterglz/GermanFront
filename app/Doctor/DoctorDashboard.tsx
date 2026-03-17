"use client";

import { useState } from "react";
import PacienteDashboard from "@/components/pacientes/PacienteDashboard";
import { Paciente } from "../types/paciente";
import { pacienteMock } from "../mocks/pacienteMock";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DoctorDashboard() {

  const router = useRouter();

  const logout = () => {
  localStorage.removeItem("rol");
  router.push("/");
  };

  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<Paciente | null>(null);

  // MOCK de lista de pacientes
  const [pacientes, setPacientes] = useState<Paciente[]>([pacienteMock]);

  useEffect(() => {
    const data = localStorage.getItem("pacientes");

    if (data) {
      setPacientes(JSON.parse(data));
    }
  }, []);

  return (
    <div className="flex h-screen">

      {/* 🧑‍⚕️ SIDEBAR (lista de pacientes) */}
      <div className="w-1/4 bg-white border-r p-4 flex flex-col">

        {/* 🔝 LISTA */}
        <div className="flex-1 overflow-y-auto">
          <h2 className="font-bold mb-4">Pacientes</h2>

          {pacientes.map((p) => (
            <div
              key={p.id}
              onClick={() => setPacienteSeleccionado(p)}
              className="p-2 mb-2 cursor-pointer hover:bg-gray-100 rounded transition"
            >
              {p.datosPersonales.nombre}
            </div>
          ))}
        </div>

        {/* 🔻 LOGOUT */}
        <div className="pt-4 border-t">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition text-sm font-medium"
          >
            ⏻ Cerrar sesión
          </button>
        </div>

      </div>

      {/* 📊 CONTENIDO */}
      <div className="flex-1">

        {pacienteSeleccionado ? (
          <PacienteDashboard paciente={pacienteSeleccionado} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Selecciona un paciente
          </div>
        )}

      </div>
    </div>
  );
}