"use client";

import { useState } from "react";
import { Paciente } from "../types/paciente";
import PacienteDashboard from "@/components/pacientes/PacienteDashboard";
import PacienteForm from "@/components/pacientes/PacienteForm";
import { useRouter } from "next/navigation";
import { useEffect } from "react";



export default function AsistenteDashboard() {
  const router = useRouter();

  const logout = () => {
  localStorage.removeItem("rol");
  router.push("/");
  };
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [seleccionado, setSeleccionado] = useState<Paciente | null>(null);

  const agregarPaciente = (nuevo: Paciente) => {
    setPacientes([...pacientes, nuevo]);
  };
  
  useEffect(() => {
  const data = localStorage.getItem("pacientes");

  if (data) {
    setPacientes(JSON.parse(data));
  }
  }, []);
  
  useEffect(() => {
    localStorage.setItem("pacientes", JSON.stringify(pacientes));
  }, [pacientes]);

  return (
    <div className="flex h-screen">

      {/* SIDEBAR */}
      <div className="w-1/4 bg-white border-r p-4 flex flex-col">

      <div className="flex-1 overflow-y-auto">
        <PacienteForm onCreate={agregarPaciente} />
        {pacientes.map((p) => (
          <div
            key={p.id}
            onClick={() => setSeleccionado(p)}
            className="p-2 cursor-pointer hover:bg-gray-100 rounded"
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

      {/* CONTENIDO */}
      <div className="flex-1">
        {seleccionado ? (
          <PacienteDashboard paciente={seleccionado} />
        ) : (
          <div className="flex items-center justify-center h-full">
            Selecciona un paciente
          </div>
        )}
      </div>

    </div>
  );
}