"use client"

import { useState } from "react"

export default function Login() {

  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    password: ""
  })

  const [errores, setErrores] = useState<any>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const validar = () => {

    let errores: any = {}

    if (!form.nombre.trim()) {
      errores.nombre = "El nombre es obligatorio"
    }

    if (!form.correo) {
      errores.correo = "El correo es obligatorio"
    } else if (!/\S+@\S+\.\S+/.test(form.correo)) {
      errores.correo = "Correo inválido"
    }

    if (!form.password) {
      errores.password = "La contraseña es obligatoria"
    } else if (form.password.length < 6) {
      errores.password = "Debe tener al menos 6 caracteres"
    }

    return errores
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const erroresValidacion = validar()

    if (Object.keys(erroresValidacion).length > 0) {
      setErrores(erroresValidacion)
    } else {
      setErrores({})
      console.log("Datos enviados:", form)

      // aquí puedes hacer tu fetch a la API
      // fetch("/api/login", { method:"POST", body: JSON.stringify(form) })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-96"
      >

        <h2 className="text-2xl font-bold mb-6 text-center">
          Iniciar Sesión
        </h2>

        {/* nombre */}

        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-2"
        />

        {errores.nombre && (
          <p className="text-red-500 text-sm mb-2">{errores.nombre}</p>
        )}

        {/* correo */}

        <input
          type="email"
          name="correo"
          placeholder="Correo"
          value={form.correo}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-2"
        />

        {errores.correo && (
          <p className="text-red-500 text-sm mb-2">{errores.correo}</p>
        )}

        {/* password */}

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-2"
        />

        {errores.password && (
          <p className="text-red-500 text-sm mb-4">{errores.password}</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Entrar
        </button>

      </form>
    </div>
  )
}