"use client"

import { useState } from "react"

export default function RegistroPaciente() {

  const [form, setForm] = useState({
    nombre: "",
    edad: "",
    sexo: "",
    telefono: "",
    direccion: "",
    sangre: "",
    alergias: ""
  })

  const handleChange = (e:any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e:any) => {
    e.preventDefault()

    console.log("Paciente registrado:", form)

    alert("Paciente registrado correctamente")
  }

  return (

    <div className="p-10">

      <h1 className="text-2xl font-bold mb-6">
        Registrar paciente
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="nombre"
          placeholder="Nombre completo"
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          name="edad"
          placeholder="Edad"
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          name="sexo"
          placeholder="Sexo"
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          name="telefono"
          placeholder="Teléfono"
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          name="direccion"
          placeholder="Dirección"
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          name="sangre"
          placeholder="Tipo de sangre"
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          name="alergias"
          placeholder="Alergias"
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <button className="bg-blue-600 text-white p-2 rounded">
          Registrar paciente
        </button>

      </form>

    </div>
  )
}