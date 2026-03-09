"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      
      const user = login(email, password);

      if (user.role === "admin") {
        router.push("/admin");
      }

      if (user.role === "doctor") {
        router.push("/doctor");
      }

      if (user.role === "patient") {
        router.push("/patient");
      }
      
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen">

      {/* LEFT SIDE */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 to-teal-500 text-white items-center justify-center p-10">
        <div className="max-w-md">

          <h1 className="text-4xl font-bold mb-4">
            Medical SaaS
          </h1>

          <p className="text-lg opacity-90">
            Plataforma para gestión de consultorios, pacientes y medicamentos.
          </p>

        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-slate-50">

        <Card className="w-[380px] shadow-xl border-none">

          <CardHeader>
            <CardTitle className="text-2xl text-center text-blue-700">
              Iniciar Sesión
            </CardTitle>

            <CardDescription className="text-center">
              Accede a tu cuenta
            </CardDescription>
          </CardHeader>

          <CardContent>

            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <Label>Email</Label>

                <Input
                  type="email"
                  placeholder="doctor@test.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <Label>Password</Label>

                <Input
                  type="password"
                  placeholder="******"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Entrar
              </Button>

            </form>

          </CardContent>
        </Card>

      </div>

    </div>
  );
}