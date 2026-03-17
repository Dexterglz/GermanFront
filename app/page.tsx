"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Login() {

  const router = useRouter()

  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    password: ""
  })

  const [errores, setErrores] = useState<any>({})

  const [loading, setLoading] = useState(false)
  const [errorLogin, setErrorLogin] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const validar = () => {

    let errores: any = {}

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

  const login = async () => {

  setLoading(true)
  setErrorLogin("")

  try {

    // Simulación de API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (form.correo === "doctor@test.com" && form.password === "123456") {
      localStorage.setItem("rol", "doctor")
      router.push("/doctor")
    } 
    else if (form.correo === "admin@test.com" && form.password === "123456") {
      localStorage.setItem("rol", "asistente")
      router.push("/asistente")
    } 
    else if (form.correo === "asistente@test.com" && form.password === "123456") {
      localStorage.setItem("rol", "asistente")
      router.push("/asistente")
    } 
    else {
      setErrorLogin("Credenciales incorrectas")
    }

  } catch (error) {
    setErrorLogin("Error al iniciar sesión")
  }

  setLoading(false)

  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const erroresValidacion = validar()

    if (Object.keys(erroresValidacion).length > 0) {
      setErrores(erroresValidacion)
    } else {
      setErrores({})
      await login()
    }
  }

  useEffect(() => {

    const rol = localStorage.getItem("rol")

    if (rol === "doctor") router.push("/doctor")
    if (rol === "admin") router.push("/admin")
    if (rol === "asistente") router.push("/asistente")

  }, [])


return (
  
<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 via-white to-green-200">
      
      <form
      onSubmit={handleSubmit}
      className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/30 animate-fadeIn"
    >

      <h2 className="text-3xl font-bold mb-2 text-center text-gray-800 tracking-tight">
        Bienvenido
      </h2>
      

      <p className="text-center text-gray-500 mb-6">
        Inicia sesión para continuar
      </p>

      {/* Correo */}
      <div className="mb-4">
        <input
          type="email"
          name="correo"
          placeholder="Correo"
          value={form.correo}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
        {errores.correo && (
          <p className="text-red-500 text-sm mt-1">{errores.correo}</p>
        )}
      </div>

      {/* Password */}
      <div className="mb-4">
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
        {errores.password && (
          <p className="text-red-500 text-sm mt-1">{errores.password}</p>
        )}
      </div>

      {/* Error login */}
      {errorLogin && (
        <p className="text-red-500 text-sm mb-4 text-center">
          {errorLogin}
        </p>
      )}

      {/* Botón */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-lg font-semibold hover:scale-105 transition duration-200 shadow-md"
      >
        {loading ? "Ingresando..." : "Entrar"}
      </button>

    </form>
  </div>
)


}