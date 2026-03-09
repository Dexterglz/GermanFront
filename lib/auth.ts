import { mockUsers } from "./mockUsers";

export function login(email: string, password: string) {
  const user = mockUsers.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    throw new Error("Credenciales incorrectas");
  }

  return user;
}