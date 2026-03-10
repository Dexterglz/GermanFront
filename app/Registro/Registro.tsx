"use client"

import { useState } from "react"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isLogin) {
      console.log("Login:", formData)
    } else {
      console.log("Registro:", formData)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      
      <div className="bg-white p-8 rounded-xl shadow-md w-96">

        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {!isLogin && (
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Correo"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            {isLogin ? "Entrar" : "Registrarse"}
          </button>

        </form>

        <p className="text-center mt-4 text-sm">
          {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
        </p>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full text-blue-600 mt-2"
        >
          {isLogin ? "Crear una cuenta" : "Iniciar sesión"}
        </button>

      </div>
    </div>
  )
}