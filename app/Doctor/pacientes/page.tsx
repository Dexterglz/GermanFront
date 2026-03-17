"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Pacientes() {

  const router = useRouter()

  const [busqueda, setBusqueda] = useState("")

  const pacientes = [
    { id: 1, nombre: "Juan Pérez", edad: 30, telefono: "555123456" },
    { id: 2, nombre: "Ana López", edad: 25, telefono: "555987654" },
    { id: 3, nombre: "Carlos Ramírez", edad: 40, telefono: "555654321" }
  ]

  const pacientesFiltrados = pacientes.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  const verExpediente = (id:number) => {
    router.push(`/doctor/paciente/${id}`)
  }

  return (

    <div className="p-10">

      <h1 className="text-2xl font-bold mb-6">
        Pacientes
      </h1>

      <input
        type="text"
        placeholder="Buscar paciente..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="border p-2 mb-6 w-full"
      />

      <table className="w-full border">

        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Edad</th>
            <th className="p-2 border">Teléfono</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>

        <tbody>

          {pacientesFiltrados.map((paciente) => (

            <tr key={paciente.id}>

              <td className="p-2 border">{paciente.nombre}</td>
              <td className="p-2 border">{paciente.edad}</td>
              <td className="p-2 border">{paciente.telefono}</td>

              <td className="p-2 border">

                <button
                  onClick={() => verExpediente(paciente.id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Ver expediente
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  )
}