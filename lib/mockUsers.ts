import { User } from "@/types/user";

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Dr. Juan Pérez",
    email: "doctor@test.com",
    password: "123456",
    role: "doctor",
  },
  {
    id: "2",
    name: "Admin Sistema",
    email: "admin@test.com",
    password: "123456",
    role: "admin",
  },
  {
    id: "3",
    name: "Carlos López",
    email: "paciente@test.com",
    password: "123456",
    role: "patient",
  },
];