"use client";

import { useState } from "react";
import { Paciente } from "@/types/paciente";

export default function PacienteForm({ onCreate }: { onCreate: (p: Paciente) => void }) {

  const [form, setForm] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    correo: "",
    telefono: ""
  });

  const [errores, setErrores] = useState<any>({});

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const validar = () => {
    let err: any = {};

    if (!form.nombre) err.nombre = "Requerido";
    if (!form.apellidoPaterno) err.apellidoPaterno = "Requerido";

    if (!form.correo) {
      err.correo = "Requerido";
    } else if (!/\S+@\S+\.\S+/.test(form.correo)) {
      err.correo = "Correo inválido";
    }

    if (!form.telefono) {
      err.telefono = "Requerido";
    }

    return err;
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const err = validar();

    if (Object.keys(err).length > 0) {
      setErrores(err);
      return;
    }

    const nuevoPaciente: Paciente = {
      id: Date.now().toString(),
      datosPersonales: {
        nombre: form.nombre,
        apellidoPaterno: form.apellidoPaterno,
        apellidoMaterno: form.apellidoMaterno,
        fechaNacimiento: "2000-01-01",
        genero: "Otro",
        estadoCivil: "",
        ocupacion: "",
        escolaridad: ""
      },
      direccion: {} as any,
      contacto: {
        email: form.correo,
        telefono: form.telefono
      } as any,
      signosVitales: [],
      citas: [],
      visitas: [],
      diagnosticos: [],
      notas: [],
      medicamentos: [],
      recordatorios: []
    };

    onCreate(nuevoPaciente);

    // limpiar form
    setForm({
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      correo: "",
      telefono: ""
    });

    setErrores({});
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-xl shadow mb-4">

      <h2 className="font-bold text-lg mb-4">Alta de paciente</h2>

      {/* 🧍 DATOS PERSONALES */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-500 mb-2">
          Datos personales
        </p>

        <input
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded focus:ring-2 focus:ring-blue-300"
        />
        {errores.nombre && <p className="text-red-500 text-xs">{errores.nombre}</p>}

        <input
          name="apellidoPaterno"
          placeholder="Apellido paterno"
          value={form.apellidoPaterno}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded focus:ring-2 focus:ring-blue-300"
        />
        {errores.apellidoPaterno && <p className="text-red-500 text-xs">{errores.apellidoPaterno}</p>}

        <input
          name="apellidoMaterno"
          placeholder="Apellido materno"
          value={form.apellidoMaterno}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded focus:ring-2 focus:ring-blue-300"
        />
      </div>

      {/* 📧 CONTACTO */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-500 mb-2">
          Contacto
        </p>

        <input
          name="correo"
          placeholder="Correo electrónico"
          value={form.correo}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded focus:ring-2 focus:ring-blue-300"
        />
        {errores.correo && <p className="text-red-500 text-xs">{errores.correo}</p>}

        <input
          name="telefono"
          placeholder="Teléfono"
          value={form.telefono}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded focus:ring-2 focus:ring-blue-300"
        />
        {errores.telefono && <p className="text-red-500 text-xs">{errores.telefono}</p>}
      </div>

      {/* 🔘 BOTÓN */}
      <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
        Guardar paciente
      </button>

    </form>
  );
}