"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Hospital,
  Calendar,
  Activity,
  Bell,
  Search,
  TrendingUp,
  TrendingDown,
  Clock,
  FileText,
  Settings,
  LogOut,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Pill,
  Stethoscope,
  HeartPulse,
  Home,
  BarChart3,
  Star,
  Plus,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Eye,
  Download,
  Filter,
  Package,
  AlertTriangle,
  DollarSign,
  PieChart,
  X,
  Link,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useNavigate } from "react-router-dom";

// Types
type NavSection = "Dashboard" | "Pacientes" | "Doctores" | "Citas" | "Farmacia" | "Reportes" | "Configuración";
type AppointmentStatus = "confirmada" | "pendiente" | "cancelada" | "en_curso";

interface Patient {
  id: number;
  nombre: string;
  edad: number;
  genero: string;
  telefono: string;
  email: string;
  direccion: string;
  ultimaVisita: string;
  proximaCita: string;
  condiciones: string[];
}

interface Doctor {
  id: number;
  nombre: string;
  especialidad: string;
  telefono: string;
  email: string;
  horario: string;
  pacientes: number;
  rating: number;
  avatar: string;
  disponible: boolean;
}

interface Appointment {
  id: number;
  paciente: string;
  pacienteId: number;
  doctor: string;
  doctorId: number;
  fecha: string;
  hora: string;
  estado: AppointmentStatus;
  tipo: string;
  notas: string;
}

interface Medication {
  id: number;
  nombre: string;
  categoria: string;
  stock: number;
  stockMinimo: number;
  precio: number;
  proveedor: string;
  vencimiento: string;
  ubicacion: string;
}

// Data
const patientsData: Patient[] = [
  { id: 1, nombre: "Juan Pérez", edad: 45, genero: "Masculino", telefono: "555-0101", email: "juan@email.com", direccion: "Calle 123, Col. Centro", ultimaVisita: "15/03/2026", proximaCita: "27/03/2026", condiciones: ["Hipertensión", "Diabetes Tipo 2"] },
  { id: 2, nombre: "Ana López", edad: 32, genero: "Femenino", telefono: "555-0102", email: "ana@email.com", direccion: "Av. Principal 456", ultimaVisita: "20/03/2026", proximaCita: "27/03/2026", condiciones: ["Arritmia"] },
  { id: 3, nombre: "Carlos Mendoza", edad: 58, genero: "Masculino", telefono: "555-0103", email: "carlos@email.com", direccion: "Blvd. Norte 789", ultimaVisita: "18/03/2026", proximaCita: "27/03/2026", condiciones: ["Artritis", "Osteoporosis"] },
  { id: 4, nombre: "María García", edad: 8, genero: "Femenino", telefono: "555-0104", email: "mama.garcia@email.com", direccion: "Calle Sur 321", ultimaVisita: "22/03/2026", proximaCita: "27/03/2026", condiciones: ["Asma"] },
  { id: 5, nombre: "Roberto Díaz", edad: 67, genero: "Masculino", telefono: "555-0105", email: "roberto@email.com", direccion: "Av. Este 654", ultimaVisita: "25/03/2026", proximaCita: "27/03/2026", condiciones: ["EPOC", "Hipertensión"] },
  { id: 6, nombre: "Laura Sánchez", edad: 29, genero: "Femenino", telefono: "555-0106", email: "laura@email.com", direccion: "Plaza Central 987", ultimaVisita: "24/03/2026", proximaCita: "27/03/2026", condiciones: ["Dermatitis"] },
  { id: 7, nombre: "Fernando Torres", edad: 41, genero: "Masculino", telefono: "555-0107", email: "fernando@email.com", direccion: "Calle Oeste 147", ultimaVisita: "21/03/2026", proximaCita: "28/03/2026", condiciones: ["Migraña crónica"] },
  { id: 8, nombre: "Patricia Ruiz", edad: 55, genero: "Femenino", telefono: "555-0108", email: "patricia@email.com", direccion: "Av. Las Flores 258", ultimaVisita: "19/03/2026", proximaCita: "29/03/2026", condiciones: ["Hipotiroidismo"] },
];

const doctorsData: Doctor[] = [
  { id: 1, nombre: "Dr. Ramírez", especialidad: "Medicina General", telefono: "555-1001", email: "ramirez@medicenter.com", horario: "8:00 - 16:00", pacientes: 245, rating: 4.9, avatar: "RA", disponible: true },
  { id: 2, nombre: "Dra. Gómez", especialidad: "Cardiología", telefono: "555-1002", email: "gomez@medicenter.com", horario: "9:00 - 17:00", pacientes: 189, rating: 4.8, avatar: "GO", disponible: true },
  { id: 3, nombre: "Dr. Silva", especialidad: "Traumatología", telefono: "555-1003", email: "silva@medicenter.com", horario: "7:00 - 15:00", pacientes: 167, rating: 4.7, avatar: "SI", disponible: false },
  { id: 4, nombre: "Dra. Torres", especialidad: "Pediatría", telefono: "555-1004", email: "torres@medicenter.com", horario: "8:00 - 14:00", pacientes: 203, rating: 4.9, avatar: "TO", disponible: true },
  { id: 5, nombre: "Dra. Vega", especialidad: "Dermatología", telefono: "555-1005", email: "vega@medicenter.com", horario: "10:00 - 18:00", pacientes: 156, rating: 4.6, avatar: "VE", disponible: true },
  { id: 6, nombre: "Dr. Morales", especialidad: "Neurología", telefono: "555-1006", email: "morales@medicenter.com", horario: "8:00 - 16:00", pacientes: 134, rating: 4.8, avatar: "MO", disponible: true },
  { id: 7, nombre: "Dra. Herrera", especialidad: "Ginecología", telefono: "555-1007", email: "herrera@medicenter.com", horario: "9:00 - 17:00", pacientes: 198, rating: 4.9, avatar: "HE", disponible: false },
  { id: 8, nombre: "Dr. Castro", especialidad: "Oftalmología", telefono: "555-1008", email: "castro@medicenter.com", horario: "7:00 - 15:00", pacientes: 142, rating: 4.7, avatar: "CA", disponible: true },
];

const appointmentsData: Appointment[] = [
  { id: 1, paciente: "Juan Pérez", pacienteId: 1, doctor: "Dr. Ramírez", doctorId: 1, fecha: "27/03/2026", hora: "09:00", estado: "confirmada", tipo: "Consulta General", notas: "Control de presión arterial" },
  { id: 2, paciente: "Ana López", pacienteId: 2, doctor: "Dra. Gómez", doctorId: 2, fecha: "27/03/2026", hora: "09:30", estado: "pendiente", tipo: "Cardiología", notas: "Seguimiento de arritmia" },
  { id: 3, paciente: "Carlos Mendoza", pacienteId: 3, doctor: "Dr. Silva", doctorId: 3, fecha: "27/03/2026", hora: "10:00", estado: "confirmada", tipo: "Traumatología", notas: "Revisión de rodilla" },
  { id: 4, paciente: "María García", pacienteId: 4, doctor: "Dra. Torres", doctorId: 4, fecha: "27/03/2026", hora: "10:30", estado: "cancelada", tipo: "Pediatría", notas: "Vacunación" },
  { id: 5, paciente: "Roberto Díaz", pacienteId: 5, doctor: "Dr. Ramírez", doctorId: 1, fecha: "27/03/2026", hora: "11:00", estado: "en_curso", tipo: "Consulta General", notas: "Control EPOC" },
  { id: 6, paciente: "Laura Sánchez", pacienteId: 6, doctor: "Dra. Vega", doctorId: 5, fecha: "27/03/2026", hora: "11:30", estado: "confirmada", tipo: "Dermatología", notas: "Tratamiento dermatitis" },
  { id: 7, paciente: "Fernando Torres", pacienteId: 7, doctor: "Dr. Morales", doctorId: 6, fecha: "28/03/2026", hora: "09:00", estado: "pendiente", tipo: "Neurología", notas: "Evaluación migraña" },
  { id: 8, paciente: "Patricia Ruiz", pacienteId: 8, doctor: "Dra. Herrera", doctorId: 7, fecha: "29/03/2026", hora: "10:00", estado: "confirmada", tipo: "Ginecología", notas: "Control anual" },
];

const medicationsData: Medication[] = [
  { id: 1, nombre: "Ibuprofeno 400mg", categoria: "Analgésicos", stock: 45, stockMinimo: 100, precio: 85.50, proveedor: "FarmaLab", vencimiento: "12/2027", ubicacion: "A-101" },
  { id: 2, nombre: "Paracetamol 500mg", categoria: "Analgésicos", stock: 320, stockMinimo: 150, precio: 45.00, proveedor: "MediPharma", vencimiento: "06/2027", ubicacion: "A-102" },
  { id: 3, nombre: "Amoxicilina 500mg", categoria: "Antibióticos", stock: 180, stockMinimo: 100, precio: 120.00, proveedor: "BioMed", vencimiento: "09/2026", ubicacion: "B-201" },
  { id: 4, nombre: "Omeprazol 20mg", categoria: "Gastrointestinales", stock: 95, stockMinimo: 80, precio: 95.00, proveedor: "FarmaLab", vencimiento: "03/2027", ubicacion: "C-301" },
  { id: 5, nombre: "Losartán 50mg", categoria: "Cardiovasculares", stock: 28, stockMinimo: 50, precio: 150.00, proveedor: "CardioMed", vencimiento: "11/2026", ubicacion: "D-401" },
  { id: 6, nombre: "Metformina 850mg", categoria: "Antidiabéticos", stock: 200, stockMinimo: 100, precio: 78.00, proveedor: "DiabeCare", vencimiento: "08/2027", ubicacion: "D-402" },
  { id: 7, nombre: "Salbutamol Inhalador", categoria: "Respiratorios", stock: 65, stockMinimo: 40, precio: 180.00, proveedor: "RespiraMed", vencimiento: "05/2026", ubicacion: "E-501" },
  { id: 8, nombre: "Diclofenaco 100mg", categoria: "Antiinflamatorios", stock: 12, stockMinimo: 60, precio: 92.00, proveedor: "FarmaLab", vencimiento: "07/2026", ubicacion: "A-103" },
  { id: 9, nombre: "Cetirizina 10mg", categoria: "Antihistamínicos", stock: 150, stockMinimo: 80, precio: 55.00, proveedor: "AlergMed", vencimiento: "10/2027", ubicacion: "F-601" },
  { id: 10, nombre: "Atorvastatina 20mg", categoria: "Cardiovasculares", stock: 88, stockMinimo: 70, precio: 165.00, proveedor: "CardioMed", vencimiento: "04/2027", ubicacion: "D-403" },
];

const stats = [
  { title: "Pacientes", value: "1,245", change: "+12%", trend: "up", icon: <Users size={28} /> },
  { title: "Doctores", value: "58", change: "+3", trend: "up", icon: <Hospital size={28} /> },
  { title: "Citas Hoy", value: "132", change: "-8%", trend: "down", icon: <Calendar size={28} /> },
  { title: "Actividad", value: "94%", change: "+5%", trend: "up", icon: <Activity size={28} /> },
];

const notifications = [
  { id: 1, type: "urgent", message: "Emergencia en sala 3 - Paciente crítico", time: "Hace 5 min" },
  { id: 2, type: "info", message: "Dr. Ramírez ha confirmado su turno", time: "Hace 15 min" },
  { id: 3, type: "warning", message: "Stock bajo de medicamentos: Ibuprofeno", time: "Hace 1 hora" },
  { id: 4, type: "success", message: "Reporte mensual generado exitosamente", time: "Hace 2 horas" },
];

const weeklyData = [
  { day: "Lun", citas: 45, completadas: 42 },
  { day: "Mar", citas: 52, completadas: 48 },
  { day: "Mié", citas: 38, completadas: 35 },
  { day: "Jue", citas: 65, completadas: 60 },
  { day: "Vie", citas: 58, completadas: 55 },
  { day: "Sáb", citas: 30, completadas: 28 },
  { day: "Dom", citas: 12, completadas: 12 },
];

const StatusBadge = ({ estado }: { estado: string }) => {
  const styles: Record<string, string> = {
    confirmada: "bg-green-100 text-green-700",
    pendiente: "bg-yellow-100 text-yellow-700",
    cancelada: "bg-red-100 text-red-700",
    en_curso: "bg-blue-100 text-blue-700",
  };
  const labels: Record<string, string> = {
    confirmada: "Confirmada",
    pendiente: "Pendiente",
    cancelada: "Cancelada",
    en_curso: "En Curso",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[estado]}`}>
      {labels[estado]}
    </span>
  );
};

// Modal Component
const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => {
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white">
            <h3 className="text-xl font-semibold text-slate-800">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
              <X size={20} className="text-slate-500" />
            </button>
          </div>
          <div className="p-6">{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Dashboard View
const DashboardView = ({ setActiveSection, appointments }: { setActiveSection: (section: NavSection) => void; appointments: Appointment[] }) => {
  const maxCitas = Math.max(...weeklyData.map((d) => d.citas));
  const topDoctors = doctorsData.slice(0, 4);

  return (
    <>
      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { icon: <Calendar size={20} />, label: "Nueva Cita", color: "bg-blue-500", section: "Citas" as NavSection },
          { icon: <Users size={20} />, label: "Agregar Paciente", color: "bg-green-500", section: "Pacientes" as NavSection },
          { icon: <FileText size={20} />, label: "Generar Reporte", color: "bg-purple-500", section: "Reportes" as NavSection },
          { icon: <Pill size={20} />, label: "Inventario", color: "bg-orange-500", section: "Farmacia" as NavSection },
        ].map((action, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveSection(action.section)}
            className={`${action.color} text-white p-4 rounded-xl flex items-center gap-3 shadow-lg`}
          >
            {action.icon}
            <span className="font-medium">{action.label}</span>
          </motion.button>
        ))}
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600">{stat.icon}</div>
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === "up" ? "text-green-600" : "text-red-500"
                }`}
              >
                {stat.trend === "up" ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {stat.change}
              </div>
            </div>
            <p className="text-slate-500 text-sm">{stat.title}</p>
            <h3 className="text-3xl font-bold text-slate-800">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* MAIN GRID */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* TABLA CITAS */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-slate-800">Citas de Hoy</h3>
            <button 
              onClick={() => setActiveSection("Citas")}
              className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
            >
              Ver todas <ChevronRight size={16} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left p-4 text-slate-600 font-medium text-sm">Paciente</th>
                  <th className="text-left p-4 text-slate-600 font-medium text-sm">Doctor</th>
                  <th className="text-left p-4 text-slate-600 font-medium text-sm">Hora</th>
                  <th className="text-left p-4 text-slate-600 font-medium text-sm">Tipo</th>
                  <th className="text-left p-4 text-slate-600 font-medium text-sm">Estado</th>
                </tr>
              </thead>
              <tbody>
                {appointments.slice(0, 6).map((apt, idx) => (
                  <motion.tr
                    key={apt.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-slate-50 hover:bg-slate-50/50 cursor-pointer"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {apt.paciente.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <span className="font-medium text-slate-800">{apt.paciente}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">{apt.doctor}</td>
                    <td className="p-4 text-slate-600">{apt.hora}</td>
                    <td className="p-4 text-slate-600">{apt.tipo}</td>
                    <td className="p-4">
                      <StatusBadge estado={apt.estado} />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TOP DOCTORES */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-6">Top Doctores</h3>
          <div className="space-y-4">
            {topDoctors.map((doc, idx) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                  {doc.avatar}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-slate-800">{doc.nombre}</h4>
                  <p className="text-slate-500 text-sm">{doc.especialidad}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star size={14} fill="currentColor" />
                    <span className="font-medium text-slate-800">{doc.rating}</span>
                  </div>
                  <p className="text-slate-400 text-xs">{doc.pacientes} pacientes</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM GRID */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* GRÁFICA SEMANAL */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-6">Citas de la Semana</h3>
          <div className="flex items-end justify-between gap-3 h-48">
            {weeklyData.map((data, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col items-center gap-1">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.citas / maxCitas) * 100}%` }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    className="w-full bg-blue-100 rounded-t-lg relative min-h-[20px]"
                    style={{ height: `${(data.citas / maxCitas) * 140}px` }}
                  >
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.completadas / data.citas) * 100}%` }}
                      transition={{ delay: idx * 0.1 + 0.3, duration: 0.5 }}
                      className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-lg"
                    />
                  </motion.div>
                </div>
                <span className="text-sm text-slate-500 font-medium">{data.day}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-100 rounded" />
              <span className="text-sm text-slate-500">Programadas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded" />
              <span className="text-sm text-slate-500">Completadas</span>
            </div>
          </div>
        </div>

        {/* ACTIVIDAD RECIENTE */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-6">Actividad Reciente</h3>
          <div className="space-y-4">
            {[
              { icon: <CheckCircle2 size={20} />, color: "text-green-500 bg-green-50", text: "Cita completada: Juan Pérez con Dr. Ramírez", time: "Hace 10 min" },
              { icon: <Calendar size={20} />, color: "text-blue-500 bg-blue-50", text: "Nueva cita agendada: María García", time: "Hace 25 min" },
              { icon: <Users size={20} />, color: "text-purple-500 bg-purple-50", text: "Nuevo paciente registrado: Carlos López", time: "Hace 45 min" },
              { icon: <XCircle size={20} />, color: "text-red-500 bg-red-50", text: "Cita cancelada: Ana Martínez", time: "Hace 1 hora" },
              { icon: <FileText size={20} />, color: "text-orange-500 bg-orange-50", text: "Reporte de laboratorio listo", time: "Hace 2 horas" },
            ].map((activity, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className={`p-2 rounded-lg ${activity.color.split(" ")[1]}`}>
                  <span className={activity.color.split(" ")[0]}>{activity.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-700">{activity.text}</p>
                  <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

// Patients View
const PatientsView = () => {
  const [patients, setPatients] = useState<Patient[]>(patientsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPatient, setNewPatient] = useState({
    nombre: "",
    edad: "",
    genero: "Masculino",
    telefono: "",
    email: "",
    direccion: "",
    condiciones: "",
  });

  const filteredPatients = patients.filter(
    (p) =>
      p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddPatient = () => {
    const patient: Patient = {
      id: patients.length + 1,
      nombre: newPatient.nombre,
      edad: parseInt(newPatient.edad),
      genero: newPatient.genero,
      telefono: newPatient.telefono,
      email: newPatient.email,
      direccion: newPatient.direccion,
      ultimaVisita: "-",
      proximaCita: "-",
      condiciones: newPatient.condiciones.split(",").map((c) => c.trim()),
    };
    setPatients([...patients, patient]);
    setShowAddModal(false);
    setNewPatient({ nombre: "", edad: "", genero: "Masculino", telefono: "", email: "", direccion: "", condiciones: "" });
  };

  const handleDeletePatient = (id: number) => {
    setPatients(patients.filter((p) => p.id !== id));
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestión de Pacientes</h2>
          <p className="text-slate-500">Administra la información de todos los pacientes</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 font-medium"
        >
          <Plus size={20} />
          Nuevo Paciente
        </motion.button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="px-4 py-2.5 border border-slate-200 rounded-xl flex items-center gap-2 text-slate-600 hover:bg-slate-50">
            <Filter size={18} />
            Filtros
          </button>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-4 text-slate-600 font-medium text-sm">Paciente</th>
              <th className="text-left p-4 text-slate-600 font-medium text-sm">Edad</th>
              <th className="text-left p-4 text-slate-600 font-medium text-sm">Contacto</th>
              <th className="text-left p-4 text-slate-600 font-medium text-sm">Última Visita</th>
              <th className="text-left p-4 text-slate-600 font-medium text-sm">Condiciones</th>
              <th className="text-left p-4 text-slate-600 font-medium text-sm">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient, idx) => (
              <motion.tr
                key={patient.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="border-b border-slate-50 hover:bg-slate-50/50"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-medium">
                      {patient.nombre.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{patient.nombre}</p>
                      <p className="text-sm text-slate-500">{patient.genero}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-slate-600">{patient.edad} años</td>
                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-slate-600 flex items-center gap-1">
                      <Phone size={14} /> {patient.telefono}
                    </span>
                    <span className="text-sm text-slate-400 flex items-center gap-1">
                      <Mail size={14} /> {patient.email}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-slate-600">{patient.ultimaVisita}</td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {patient.condiciones.slice(0, 2).map((cond, i) => (
                      <span key={i} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">
                        {cond}
                      </span>
                    ))}
                    {patient.condiciones.length > 2 && (
                      <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded-full">
                        +{patient.condiciones.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedPatient(patient)}
                      className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
                    >
                      <Eye size={18} />
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeletePatient(patient.id)}
                      className="p-2 hover:bg-red-50 rounded-lg text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Patient Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Agregar Nuevo Paciente">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
              <input
                type="text"
                value={newPatient.nombre}
                onChange={(e) => setNewPatient({ ...newPatient, nombre: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Edad</label>
              <input
                type="number"
                value={newPatient.edad}
                onChange={(e) => setNewPatient({ ...newPatient, edad: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Género</label>
              <select
                value={newPatient.genero}
                onChange={(e) => setNewPatient({ ...newPatient, genero: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Masculino</option>
                <option>Femenino</option>
                <option>Otro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
              <input
                type="text"
                value={newPatient.telefono}
                onChange={(e) => setNewPatient({ ...newPatient, telefono: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={newPatient.email}
              onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Dirección</label>
            <input
              type="text"
              value={newPatient.direccion}
              onChange={(e) => setNewPatient({ ...newPatient, direccion: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Condiciones (separadas por coma)</label>
            <input
              type="text"
              value={newPatient.condiciones}
              onChange={(e) => setNewPatient({ ...newPatient, condiciones: e.target.value })}
              placeholder="Ej: Diabetes, Hipertensión"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowAddModal(false)}
              className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleAddPatient}
              className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600"
            >
              Guardar Paciente
            </button>
          </div>
        </div>
      </Modal>

      {/* Patient Detail Modal */}
      <Modal
        isOpen={!!selectedPatient}
        onClose={() => setSelectedPatient(null)}
        title={`Detalles de ${selectedPatient?.nombre || ""}`}
      >
        {selectedPatient && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {selectedPatient.nombre.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <h4 className="text-xl font-semibold text-slate-800">{selectedPatient.nombre}</h4>
                <p className="text-slate-500">{selectedPatient.edad} años - {selectedPatient.genero}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-500 mb-1">Teléfono</p>
                <p className="font-medium text-slate-800 flex items-center gap-2">
                  <Phone size={16} className="text-blue-500" />
                  {selectedPatient.telefono}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-500 mb-1">Email</p>
                <p className="font-medium text-slate-800 flex items-center gap-2">
                  <Mail size={16} className="text-blue-500" />
                  {selectedPatient.email}
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-sm text-slate-500 mb-1">Dirección</p>
              <p className="font-medium text-slate-800 flex items-center gap-2">
                <MapPin size={16} className="text-blue-500" />
                {selectedPatient.direccion}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500 mb-2">Condiciones Médicas</p>
              <div className="flex flex-wrap gap-2">
                {selectedPatient.condiciones.map((cond, i) => (
                  <span key={i} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {cond}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border border-slate-200 rounded-xl">
                <p className="text-sm text-slate-500 mb-1">Última Visita</p>
                <p className="font-semibold text-slate-800">{selectedPatient.ultimaVisita}</p>
              </div>
              <div className="p-4 border border-slate-200 rounded-xl">
                <p className="text-sm text-slate-500 mb-1">Próxima Cita</p>
                <p className="font-semibold text-slate-800">{selectedPatient.proximaCita}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

// Doctors View
const DoctorsView = () => {
  const [doctors, setDoctors] = useState<Doctor[]>(doctorsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    nombre: "",
    especialidad: "",
    telefono: "",
    email: "",
    horario: "",
  });

  const filteredDoctors = doctors.filter(
    (d) =>
      d.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.especialidad.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddDoctor = () => {
    const doctor: Doctor = {
      id: doctors.length + 1,
      nombre: newDoctor.nombre,
      especialidad: newDoctor.especialidad,
      telefono: newDoctor.telefono,
      email: newDoctor.email,
      horario: newDoctor.horario,
      pacientes: 0,
      rating: 5.0,
      avatar: newDoctor.nombre.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase(),
      disponible: true,
    };
    setDoctors([...doctors, doctor]);
    setShowAddModal(false);
    setNewDoctor({ nombre: "", especialidad: "", telefono: "", email: "", horario: "" });
  };

  const handleDeleteDoctor = (id: number) => {
    setDoctors(doctors.filter((d) => d.id !== id));
  };

  const handleToggleDisponibilidad = (id: number) => {
    setDoctors(doctors.map((d) => (d.id === id ? { ...d, disponible: !d.disponible } : d)));
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestión de Doctores</h2>
          <p className="text-slate-500">Administra el equipo médico del hospital</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 font-medium"
        >
          <Plus size={20} />
          Nuevo Doctor
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Stethoscope size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{doctors.length}</p>
              <p className="text-sm text-slate-500">Total Doctores</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle2 size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{doctors.filter((d) => d.disponible).length}</p>
              <p className="text-sm text-slate-500">Disponibles</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Star size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {(doctors.reduce((acc, d) => acc + d.rating, 0) / doctors.length).toFixed(1)}
              </p>
              <p className="text-sm text-slate-500">Rating Promedio</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Users size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {doctors.reduce((acc, d) => acc + d.pacientes, 0)}
              </p>
              <p className="text-sm text-slate-500">Total Pacientes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o especialidad..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor, idx) => (
          <motion.div
            key={doctor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {doctor.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">{doctor.nombre}</h4>
                  <p className="text-sm text-slate-500">{doctor.especialidad}</p>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  doctor.disponible ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {doctor.disponible ? "Disponible" : "Ocupado"}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Clock size={16} className="text-slate-400" />
                {doctor.horario}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Phone size={16} className="text-slate-400" />
                {doctor.telefono}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Mail size={16} className="text-slate-400" />
                {doctor.email}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-500" fill="currentColor" />
                  <span className="font-medium text-slate-800">{doctor.rating}</span>
                </div>
                <div className="text-sm text-slate-500">{doctor.pacientes} pacientes</div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setSelectedDoctor(doctor)}
                  className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => handleToggleDisponibilidad(doctor.id)}
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDeleteDoctor(doctor.id)}
                  className="p-2 hover:bg-red-50 rounded-lg text-red-500"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Doctor Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Agregar Nuevo Doctor">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
            <input
              type="text"
              value={newDoctor.nombre}
              onChange={(e) => setNewDoctor({ ...newDoctor, nombre: e.target.value })}
              placeholder="Dr. / Dra."
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Especialidad</label>
            <select
              value={newDoctor.especialidad}
              onChange={(e) => setNewDoctor({ ...newDoctor, especialidad: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar...</option>
              <option>Medicina General</option>
              <option>Cardiología</option>
              <option>Traumatología</option>
              <option>Pediatría</option>
              <option>Dermatología</option>
              <option>Neurología</option>
              <option>Ginecología</option>
              <option>Oftalmología</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
              <input
                type="text"
                value={newDoctor.telefono}
                onChange={(e) => setNewDoctor({ ...newDoctor, telefono: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Horario</label>
              <input
                type="text"
                value={newDoctor.horario}
                onChange={(e) => setNewDoctor({ ...newDoctor, horario: e.target.value })}
                placeholder="8:00 - 16:00"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={newDoctor.email}
              onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowAddModal(false)}
              className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleAddDoctor}
              className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600"
            >
              Guardar Doctor
            </button>
          </div>
        </div>
      </Modal>

      {/* Doctor Detail Modal */}
      <Modal
        isOpen={!!selectedDoctor}
        onClose={() => setSelectedDoctor(null)}
        title={`Perfil de ${selectedDoctor?.nombre || ""}`}
      >
        {selectedDoctor && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {selectedDoctor.avatar}
              </div>
              <div>
                <h4 className="text-xl font-semibold text-slate-800">{selectedDoctor.nombre}</h4>
                <p className="text-blue-600 font-medium">{selectedDoctor.especialidad}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Star size={18} className="text-yellow-500" fill="currentColor" />
                  <span className="font-semibold">{selectedDoctor.rating}</span>
                  <span className="text-slate-400">• {selectedDoctor.pacientes} pacientes atendidos</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-500 mb-1">Horario de Atención</p>
                <p className="font-medium text-slate-800 flex items-center gap-2">
                  <Clock size={16} className="text-blue-500" />
                  {selectedDoctor.horario}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-500 mb-1">Estado</p>
                <p className={`font-medium flex items-center gap-2 ${selectedDoctor.disponible ? "text-green-600" : "text-red-600"}`}>
                  {selectedDoctor.disponible ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  {selectedDoctor.disponible ? "Disponible" : "No Disponible"}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-500 mb-1">Teléfono</p>
                <p className="font-medium text-slate-800">{selectedDoctor.telefono}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-500 mb-1">Email</p>
                <p className="font-medium text-slate-800">{selectedDoctor.email}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

// Appointments View
const AppointmentsView = ({
  appointments,
  setAppointments,
}: {
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("todas");
  const [newAppointment, setNewAppointment] = useState({
    pacienteId: "",
    doctorId: "",
    fecha: "",
    hora: "",
    tipo: "",
    notas: "",
  });

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.paciente.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.doctor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "todas" || apt.estado === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddAppointment = () => {
    const patient = patientsData.find((p) => p.id === parseInt(newAppointment.pacienteId));
    const doctor = doctorsData.find((d) => d.id === parseInt(newAppointment.doctorId));
    if (!patient || !doctor) return;

    const appointment: Appointment = {
      id: appointments.length + 1,
      paciente: patient.nombre,
      pacienteId: patient.id,
      doctor: doctor.nombre,
      doctorId: doctor.id,
      fecha: newAppointment.fecha,
      hora: newAppointment.hora,
      estado: "pendiente",
      tipo: newAppointment.tipo,
      notas: newAppointment.notas,
    };
    setAppointments([...appointments, appointment]);
    setShowAddModal(false);
    setNewAppointment({ pacienteId: "", doctorId: "", fecha: "", hora: "", tipo: "", notas: "" });
  };

  const handleUpdateStatus = (id: number, newStatus: AppointmentStatus) => {
    setAppointments(appointments.map((apt) => (apt.id === id ? { ...apt, estado: newStatus } : apt)));
  };

  const handleDeleteAppointment = (id: number) => {
    setAppointments(appointments.filter((apt) => apt.id !== id));
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestión de Citas</h2>
          <p className="text-slate-500">Programa y administra todas las citas médicas</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 font-medium"
        >
          <Plus size={20} />
          Nueva Cita
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Calendar size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{appointments.length}</p>
              <p className="text-sm text-slate-500">Total Citas</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle2 size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {appointments.filter((a) => a.estado === "confirmada").length}
              </p>
              <p className="text-sm text-slate-500">Confirmadas</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Clock size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {appointments.filter((a) => a.estado === "pendiente").length}
              </p>
              <p className="text-sm text-slate-500">Pendientes</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <XCircle size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {appointments.filter((a) => a.estado === "cancelada").length}
              </p>
              <p className="text-sm text-slate-500">Canceladas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por paciente o doctor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todas">Todas</option>
            <option value="confirmada">Confirmadas</option>
            <option value="pendiente">Pendientes</option>
            <option value="en_curso">En Curso</option>
            <option value="cancelada">Canceladas</option>
          </select>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-4 text-slate-600 font-medium text-sm">Paciente</th>
              <th className="text-left p-4 text-slate-600 font-medium text-sm">Doctor</th>
              <th className="text-left p-4 text-slate-600 font-medium text-sm">Fecha</th>
              <th className="text-left p-4 text-slate-600 font-medium text-sm">Hora</th>
              <th className="text-left p-4 text-slate-600 font-medium text-sm">Tipo</th>
              <th className="text-left p-4 text-slate-600 font-medium text-sm">Estado</th>
              <th className="text-left p-4 text-slate-600 font-medium text-sm">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((apt, idx) => (
              <motion.tr
                key={apt.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.03 }}
                className="border-b border-slate-50 hover:bg-slate-50/50"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {apt.paciente.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <span className="font-medium text-slate-800">{apt.paciente}</span>
                  </div>
                </td>
                <td className="p-4 text-slate-600">{apt.doctor}</td>
                <td className="p-4 text-slate-600">{apt.fecha}</td>
                <td className="p-4 text-slate-600">{apt.hora}</td>
                <td className="p-4 text-slate-600">{apt.tipo}</td>
                <td className="p-4">
                  <StatusBadge estado={apt.estado} />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1">
                    {apt.estado === "pendiente" && (
                      <button
                        onClick={() => handleUpdateStatus(apt.id, "confirmada")}
                        className="p-2 hover:bg-green-50 rounded-lg text-green-600"
                        title="Confirmar"
                      >
                        <CheckCircle2 size={18} />
                      </button>
                    )}
                    {apt.estado === "confirmada" && (
                      <button
                        onClick={() => handleUpdateStatus(apt.id, "en_curso")}
                        className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
                        title="Iniciar"
                      >
                        <Activity size={18} />
                      </button>
                    )}
                    {apt.estado !== "cancelada" && (
                      <button
                        onClick={() => handleUpdateStatus(apt.id, "cancelada")}
                        className="p-2 hover:bg-red-50 rounded-lg text-red-500"
                        title="Cancelar"
                      >
                        <XCircle size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteAppointment(apt.id)}
                      className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
                      title="Eliminar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Appointment Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Agendar Nueva Cita">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Paciente</label>
            <select
              value={newAppointment.pacienteId}
              onChange={(e) => setNewAppointment({ ...newAppointment, pacienteId: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar paciente...</option>
              {patientsData.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Doctor</label>
            <select
              value={newAppointment.doctorId}
              onChange={(e) => setNewAppointment({ ...newAppointment, doctorId: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar doctor...</option>
              {doctorsData
                .filter((d) => d.disponible)
                .map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nombre} - {d.especialidad}
                  </option>
                ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
              <input
                type="date"
                value={newAppointment.fecha}
                onChange={(e) => setNewAppointment({ ...newAppointment, fecha: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hora</label>
              <input
                type="time"
                value={newAppointment.hora}
                onChange={(e) => setNewAppointment({ ...newAppointment, hora: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Consulta</label>
            <select
              value={newAppointment.tipo}
              onChange={(e) => setNewAppointment({ ...newAppointment, tipo: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar...</option>
              <option>Consulta General</option>
              <option>Control</option>
              <option>Urgencia</option>
              <option>Seguimiento</option>
              <option>Primera Vez</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notas</label>
            <textarea
              value={newAppointment.notas}
              onChange={(e) => setNewAppointment({ ...newAppointment, notas: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowAddModal(false)}
              className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleAddAppointment}
              className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600"
            >
              Agendar Cita
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

// Pharmacy View
const PharmacyView = () => {
  const [medications, setMedications] = useState<Medication[]>(medicationsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("todas");
  const [newMedication, setNewMedication] = useState({
    nombre: "",
    categoria: "",
    stock: "",
    stockMinimo: "",
    precio: "",
    proveedor: "",
    vencimiento: "",
    ubicacion: "",
  });

  const categories = [...new Set(medications.map((m) => m.categoria))];
  const lowStockItems = medications.filter((m) => m.stock < m.stockMinimo);
  const totalValue = medications.reduce((acc, m) => acc + m.stock * m.precio, 0);

  const filteredMedications = medications.filter((med) => {
    const matchesSearch = med.nombre.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "todas" || med.categoria === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddMedication = () => {
    const medication: Medication = {
      id: medications.length + 1,
      nombre: newMedication.nombre,
      categoria: newMedication.categoria,
      stock: parseInt(newMedication.stock),
      stockMinimo: parseInt(newMedication.stockMinimo),
      precio: parseFloat(newMedication.precio),
      proveedor: newMedication.proveedor,
      vencimiento: newMedication.vencimiento,
      ubicacion: newMedication.ubicacion,
    };
    setMedications([...medications, medication]);
    setShowAddModal(false);
    setNewMedication({
      nombre: "",
      categoria: "",
      stock: "",
      stockMinimo: "",
      precio: "",
      proveedor: "",
      vencimiento: "",
      ubicacion: "",
    });
  };

  const handleUpdateStock = (id: number, amount: number) => {
    setMedications(
      medications.map((m) => (m.id === id ? { ...m, stock: Math.max(0, m.stock + amount) } : m))
    );
  };

  const handleDeleteMedication = (id: number) => {
    setMedications(medications.filter((m) => m.id !== id));
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestión de Farmacia</h2>
          <p className="text-slate-500">Control de inventario y medicamentos</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 font-medium"
        >
          <Plus size={20} />
          Agregar Medicamento
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Package size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{medications.length}</p>
              <p className="text-sm text-slate-500">Productos</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertTriangle size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{lowStockItems.length}</p>
              <p className="text-sm text-slate-500">Stock Bajo</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">${totalValue.toLocaleString()}</p>
              <p className="text-sm text-slate-500">Valor Total</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Pill size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{categories.length}</p>
              <p className="text-sm text-slate-500">Categorías</p>
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-red-500" size={24} />
            <div>
              <h4 className="font-semibold text-red-800">Alerta de Stock Bajo</h4>
              <p className="text-red-600 text-sm">
                {lowStockItems.length} producto(s) requieren reabastecimiento:{" "}
                {lowStockItems.map((m) => m.nombre).join(", ")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar medicamento..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todas">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Medications Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-4 text-slate-600 font-medium text-sm">Medicamento</th>
              <th className="text-left p-4 text-slate-600 font-medium text-sm">Categoría</th>
              <th className="text-left p-4 text-slate-600 font-medium text-sm">Stock</th>
              <th className="text-left p-4 text-slate-600 font-medium text-sm">Precio</th>
              <th className="text-left p-4 text-slate-600 font-medium text-sm">Proveedor</th>
              <th className="text-left p-4 text-slate-600 font-medium text-sm">Vencimiento</th>
              <th className="text-left p-4 text-slate-600 font-medium text-sm">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredMedications.map((med, idx) => (
              <motion.tr
                key={med.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.03 }}
                className={`border-b border-slate-50 hover:bg-slate-50/50 ${
                  med.stock < med.stockMinimo ? "bg-red-50/30" : ""
                }`}
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                      <Pill size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{med.nombre}</p>
                      <p className="text-xs text-slate-500">Ubicación: {med.ubicacion}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                    {med.categoria}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-semibold ${
                        med.stock < med.stockMinimo ? "text-red-600" : "text-slate-800"
                      }`}
                    >
                      {med.stock}
                    </span>
                    {med.stock < med.stockMinimo && (
                      <AlertTriangle size={16} className="text-red-500" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400">Mín: {med.stockMinimo}</p>
                </td>
                <td className="p-4 text-slate-800 font-medium">${med.precio.toFixed(2)}</td>
                <td className="p-4 text-slate-600">{med.proveedor}</td>
                <td className="p-4 text-slate-600">{med.vencimiento}</td>
                <td className="p-4">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleUpdateStock(med.id, 10)}
                      className="p-2 hover:bg-green-50 rounded-lg text-green-600 text-xs font-medium"
                      title="Agregar stock"
                    >
                      +10
                    </button>
                    <button
                      onClick={() => handleUpdateStock(med.id, -10)}
                      className="p-2 hover:bg-red-50 rounded-lg text-red-600 text-xs font-medium"
                      title="Reducir stock"
                    >
                      -10
                    </button>
                    <button
                      onClick={() => handleDeleteMedication(med.id)}
                      className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Medication Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Agregar Medicamento">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Medicamento</label>
            <input
              type="text"
              value={newMedication.nombre}
              onChange={(e) => setNewMedication({ ...newMedication, nombre: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
              <select
                value={newMedication.categoria}
                onChange={(e) => setNewMedication({ ...newMedication, categoria: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar...</option>
                <option>Analgésicos</option>
                <option>Antibióticos</option>
                <option>Antiinflamatorios</option>
                <option>Cardiovasculares</option>
                <option>Gastrointestinales</option>
                <option>Antidiabéticos</option>
                <option>Respiratorios</option>
                <option>Antihistamínicos</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Proveedor</label>
              <input
                type="text"
                value={newMedication.proveedor}
                onChange={(e) => setNewMedication({ ...newMedication, proveedor: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Stock Inicial</label>
              <input
                type="number"
                value={newMedication.stock}
                onChange={(e) => setNewMedication({ ...newMedication, stock: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Stock Mínimo</label>
              <input
                type="number"
                value={newMedication.stockMinimo}
                onChange={(e) => setNewMedication({ ...newMedication, stockMinimo: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Precio ($)</label>
              <input
                type="number"
                step="0.01"
                value={newMedication.precio}
                onChange={(e) => setNewMedication({ ...newMedication, precio: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Vencimiento</label>
              <input
                type="text"
                value={newMedication.vencimiento}
                onChange={(e) => setNewMedication({ ...newMedication, vencimiento: e.target.value })}
                placeholder="MM/YYYY"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ubicación</label>
              <input
                type="text"
                value={newMedication.ubicacion}
                onChange={(e) => setNewMedication({ ...newMedication, ubicacion: e.target.value })}
                placeholder="Ej: A-101"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowAddModal(false)}
              className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleAddMedication}
              className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600"
            >
              Guardar Medicamento
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

// Reports View
const ReportsView = ({ appointments }: { appointments: Appointment[] }) => {
  const [selectedPeriod, setSelectedPeriod] = useState("semana");

  const appointmentsByStatus = {
    confirmadas: appointments.filter((a) => a.estado === "confirmada").length,
    pendientes: appointments.filter((a) => a.estado === "pendiente").length,
    enCurso: appointments.filter((a) => a.estado === "en_curso").length,
    canceladas: appointments.filter((a) => a.estado === "cancelada").length,
  };

  const appointmentsByType = appointments.reduce((acc, apt) => {
    acc[apt.tipo] = (acc[apt.tipo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const doctorAppointments = appointments.reduce((acc, apt) => {
    acc[apt.doctor] = (acc[apt.doctor] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalPatients = patientsData.length;
  const totalDoctors = doctorsData.length;
  const avgRating = (doctorsData.reduce((acc, d) => acc + d.rating, 0) / doctorsData.length).toFixed(1);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Reportes y Estadísticas</h2>
          <p className="text-slate-500">Análisis detallado del rendimiento del sistema</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="dia">Hoy</option>
            <option value="semana">Esta Semana</option>
            <option value="mes">Este Mes</option>
            <option value="año">Este Año</option>
          </select>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-blue-500 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 font-medium"
          >
            <Download size={20} />
            Exportar PDF
          </motion.button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Pacientes</p>
              <p className="text-3xl font-bold mt-1">{totalPatients}</p>
            </div>
            <Users size={40} className="text-blue-300" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-5 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Doctores</p>
              <p className="text-3xl font-bold mt-1">{totalDoctors}</p>
            </div>
            <Stethoscope size={40} className="text-green-300" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-5 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Citas</p>
              <p className="text-3xl font-bold mt-1">{appointments.length}</p>
            </div>
            <Calendar size={40} className="text-purple-300" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-5 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Rating Promedio</p>
              <p className="text-3xl font-bold mt-1">{avgRating}</p>
            </div>
            <Star size={40} className="text-orange-300" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Appointments by Status */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <PieChart size={20} className="text-blue-500" />
            Citas por Estado
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-green-500 rounded-full" />
                <span className="text-slate-600">Confirmadas</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${(appointmentsByStatus.confirmadas / appointments.length) * 100}%` }}
                  />
                </div>
                <span className="font-semibold text-slate-800 w-8">{appointmentsByStatus.confirmadas}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-yellow-500 rounded-full" />
                <span className="text-slate-600">Pendientes</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 rounded-full"
                    style={{ width: `${(appointmentsByStatus.pendientes / appointments.length) * 100}%` }}
                  />
                </div>
                <span className="font-semibold text-slate-800 w-8">{appointmentsByStatus.pendientes}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-blue-500 rounded-full" />
                <span className="text-slate-600">En Curso</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${(appointmentsByStatus.enCurso / appointments.length) * 100}%` }}
                  />
                </div>
                <span className="font-semibold text-slate-800 w-8">{appointmentsByStatus.enCurso}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-red-500 rounded-full" />
                <span className="text-slate-600">Canceladas</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{ width: `${(appointmentsByStatus.canceladas / appointments.length) * 100}%` }}
                  />
                </div>
                <span className="font-semibold text-slate-800 w-8">{appointmentsByStatus.canceladas}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments by Type */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <BarChart3 size={20} className="text-purple-500" />
            Citas por Tipo de Consulta
          </h3>
          <div className="space-y-4">
            {Object.entries(appointmentsByType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-slate-600">{type}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${(count / appointments.length) * 100}%` }}
                    />
                  </div>
                  <span className="font-semibold text-slate-800 w-8">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Doctor Performance */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Stethoscope size={20} className="text-green-500" />
          Rendimiento por Doctor
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {doctorsData.map((doctor) => (
            <div key={doctor.id} className="p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                  {doctor.avatar}
                </div>
                <div>
                  <p className="font-medium text-slate-800">{doctor.nombre}</p>
                  <p className="text-sm text-slate-500">{doctor.especialidad}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 bg-white rounded-lg">
                  <p className="text-lg font-bold text-slate-800">{doctorAppointments[doctor.nombre] || 0}</p>
                  <p className="text-xs text-slate-500">Citas</p>
                </div>
                <div className="p-2 bg-white rounded-lg">
                  <p className="text-lg font-bold text-slate-800 flex items-center justify-center gap-1">
                    <Star size={14} className="text-yellow-500" fill="currentColor" />
                    {doctor.rating}
                  </p>
                  <p className="text-xs text-slate-500">Rating</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Summary Chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-blue-500" />
          Resumen Semanal de Citas
        </h3>
        <div className="flex items-end justify-between gap-4 h-64">
          {weeklyData.map((data, idx) => {
            const maxCitas = Math.max(...weeklyData.map((d) => d.citas));
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col items-center gap-1">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.citas / maxCitas) * 180}px` }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    className="w-full bg-blue-100 rounded-t-lg relative min-h-[20px]"
                  >
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.completadas / data.citas) * 100}%` }}
                      transition={{ delay: idx * 0.1 + 0.3, duration: 0.5 }}
                      className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-lg"
                    />
                  </motion.div>
                </div>
                <div className="text-center">
                  <span className="text-sm font-medium text-slate-600">{data.day}</span>
                  <p className="text-xs text-slate-400">{data.completadas}/{data.citas}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-100 rounded" />
            <span className="text-sm text-slate-500">Programadas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded" />
            <span className="text-sm text-slate-500">Completadas</span>
          </div>
        </div>
      </div>
    </>
  );
};

// Main Component
const InstitutionDashboard: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState<NavSection>("Dashboard");
  const [appointments, setAppointments] = useState<Appointment[]>(appointmentsData);
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.clear();
    router.replace("/login");
  };

  const navItems: { icon: React.ReactNode; label: NavSection }[] = [
    { icon: <Home size={20} />, label: "Dashboard" },
    { icon: <Users size={20} />, label: "Pacientes" },
    { icon: <Stethoscope size={20} />, label: "Doctores" },
    { icon: <Calendar size={20} />, label: "Citas" },
    { icon: <Pill size={20} />, label: "Farmacia" },
    { icon: <BarChart3 size={20} />, label: "Reportes" },
    { icon: <Settings size={20} />, label: "Configuración" },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "Dashboard":
        return <DashboardView setActiveSection={setActiveSection} appointments={appointments} />;
      case "Pacientes":
        return <PatientsView />;
      case "Doctores":
        return <DoctorsView />;
      case "Citas":
        return <AppointmentsView appointments={appointments} setAppointments={setAppointments} />;
      case "Farmacia":
        return <PharmacyView />;
      case "Reportes":
        return <ReportsView appointments={appointments} />;
      case "Configuración":
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Settings size={64} className="text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-800">Configuración</h3>
              <p className="text-slate-500">Próximamente disponible</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* SIDEBAR */}
        <aside className="w-72 bg-white border-r border-slate-200 text-slate-900 p-6 flex flex-col sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 bg-black/5 rounded-xl flex items-center justify-center">
            <HeartPulse size={28} className="text-black" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-black">MediCenter</h1>
            <p className="text-slate-500 text-sm">Sistema Hospitalario</p>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          {navItems.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ x: 4 }}
              onClick={() => setActiveSection(item.label)}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                activeSection === item.label
                  ? "bg-black text-white font-medium"
                  : "text-slate-600 hover:bg-slate-100 hover:text-black"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>

              {activeSection === item.label && (
                <ChevronRight size={16} className="ml-auto" />
              )}
            </motion.div>
          ))}
        </nav>

        <div className="border-t border-slate-200 pt-4 mt-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-100">
            <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">
              AD
            </div>

            <div className="flex-1">
              <p className="font-medium text-sm text-black">Admin</p>
              <p className="text-slate-500 text-xs">Administrador</p>
            </div>

            <LogOut
              size={18}
              onClick={handleLogout}
              className="text-slate-500 cursor-pointer hover:text-black transition"
            />
          </div>
        </div>
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 p-8 overflow-auto bg-slate-50">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-black">{activeSection}</h2>
            <p className="text-slate-500">
              {activeSection === "Dashboard" && "Bienvenido de vuelta, aquí está el resumen de hoy"}
              {activeSection === "Pacientes" && "Gestiona la información de los pacientes"}
              {activeSection === "Doctores" && "Administra el equipo médico"}
              {activeSection === "Citas" && "Controla todas las citas médicas"}
              {activeSection === "Farmacia" && "Gestiona el inventario de medicamentos"}
              {activeSection === "Reportes" && "Analiza las estadísticas del sistema"}
              {activeSection === "Configuración" && "Ajusta las preferencias del sistema"}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar paciente, doctor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl w-72 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Notificaciones */}
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50"
              >
                <Bell size={20} className="text-slate-600" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  4
                </span>
              </motion.button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-slate-100">
                      <h4 className="font-semibold text-slate-800">Notificaciones</h4>
                    </div>
                    <div className="max-h-80 overflow-auto">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className="p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer"
                        >
                          <div className="flex gap-3">
                            {notif.type === "urgent" && <AlertCircle size={20} className="text-red-500 shrink-0" />}
                            {notif.type === "info" && <Bell size={20} className="text-blue-500 shrink-0" />}
                            {notif.type === "warning" && <AlertCircle size={20} className="text-yellow-500 shrink-0" />}
                            {notif.type === "success" && <CheckCircle2 size={20} className="text-green-500 shrink-0" />}
                            <div>
                              <p className="text-sm text-slate-700">{notif.message}</p>
                              <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 bg-slate-50 text-center">
                      <button className="text-blue-600 text-sm font-medium hover:underline">
                        Ver todas las notificaciones
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Fecha */}
            <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl">
              <Clock size={18} className="text-slate-400" />
              <span className="text-slate-600 font-medium">
                {new Date().toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" })}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default InstitutionDashboard;
