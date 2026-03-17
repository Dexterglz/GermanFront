"use client"

import { useParams } from "next/navigation"
import { useState } from "react"

export default function ExpedientePaciente() {

  const params = useParams()
  const id = params.id
  const [consultas, setConsultas] = useState<any[]>([])
  const [form, setForm] = useState({
    motivo: "",
    diagnostico: "",
    tratamiento: ""
  })

  const handleChange = (e:any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const guardarConsulta = () => {

    const nuevaConsulta = {
      id: Date.now(),
      ...form
    }

    setConsultas([...consultas, nuevaConsulta])

    setForm({
      motivo: "",
      diagnostico: "",
      tratamiento: ""
    })
  }

  return (
    <div className="p-10">

      <h1 className="text-2xl font-bold mb-4">
        Expediente del paciente
      </h1>

      <p>ID del paciente: {id}</p>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">
          Historial médico
        </h2>

        <p>No hay consultas registradas.</p>
      </div>

      <h2 className="text-xl font-bold mb-4 mt-6">
      Nueva consulta
      </h2>

      <input
        name="motivo"
        placeholder="Motivo de consulta"
        value={form.motivo}
        onChange={handleChange}
        className="border p-2 w-full mb-3"
      />

      <input
        name="diagnostico"
        placeholder="Diagnóstico"
        value={form.diagnostico}
        onChange={handleChange}
        className="border p-2 w-full mb-3"
      />

      <input
        name="tratamiento"
        placeholder="Tratamiento"
        value={form.tratamiento}
        onChange={handleChange}
        className="border p-2 w-full mb-3"
      />

      <button
        onClick={guardarConsulta}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
      Guardar consulta
      </button>

      <h2 className="text-xl font-bold mb-4 mt-6">
      Historial de consultas
      </h2>

      {consultas.length === 0 && (
      <p>No hay consultas registradas</p>
      )}

      {consultas.map((consulta) => (

      <div
      key={consulta.id}
      className="border p-4 mb-3 rounded"
      >

      <p><b>Motivo:</b> {consulta.motivo}</p>
      <p><b>Diagnóstico:</b> {consulta.diagnostico}</p>
      <p><b>Tratamiento:</b> {consulta.tratamiento}</p>

      </div>

      ))}


    </div>
  )
}