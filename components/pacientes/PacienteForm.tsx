"use client";

import { useState } from "react";
import { Paciente } from "@/app/types/paciente";

export default function PacienteForm({ onCreate }: { onCreate: (p: Paciente) => void }) {

  const [form, setForm] = useState({
    nombre: "",
    apellidoPaterno: "",
    correo: ""
  });

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const nuevoPaciente: Paciente = {
      id: Date.now().toString(),
      datosPersonales: {
        id: "3",
        nombre: form.nombre,
        apellidoPaterno: form.apellidoPaterno,
        apellidoMaterno: "",
        fechaNacimiento: "2000-01-01",
        sexo: "Otro",
        curp: "AABB010101HDFABFD",
        rfc: "FFFFF"
      },
      direccion: {} as any,
      contacto: { email: form.correo } as any,
      signosVitales: [],
      citas: [],
      visitas: [],
      diagnosticos: [],
      notas: [],
      medicamentos: [],
      recordatorios: []
    };

    onCreate(nuevoPaciente);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">

      <h2 className="font-bold mb-4">Nuevo Paciente</h2>

      <input
        name="nombre"
        placeholder="Nombre"
        onChange={handleChange}
        className="w-full mb-2 p-2 border rounded"
      />

      <input
        name="apellidoPaterno"
        placeholder="Apellido"
        onChange={handleChange}
        className="w-full mb-2 p-2 border rounded"
      />

      <input
        name="correo"
        placeholder="Correo"
        onChange={handleChange}
        className="w-full mb-2 p-2 border rounded"
      />

      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Crear
      </button>

    </form>
  );
}