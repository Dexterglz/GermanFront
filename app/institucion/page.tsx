"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
  PieChart,
  X,
} from "lucide-react";

// Types
type NavSection = "Dashboard" | "Pacientes" | "Doctores" | "Citas" | "Reportes" | "Configuración";
type AppointmentStatus = "confirmada" | "pendiente" | "cancelada" | "en_curso";

// API response shapes
interface ApiPatient {
  id: number;
  user_id: number;
  nombre_completo: string;
  fecha_nacimiento: string;
  sexo: string;
  curp: string;
  telefono: string;
  direccion: string;
  tipo_sangre: string;
  alergias: string;
  contacto_emergencia: string;
  telefono_contacto_emergencia: string;
  institution_id: number | null;
}

interface ApiDoctor {
  id: number;
  user_id: number;
  nombre_completo: string;
  especialidad: string;
  telefono: string;
  correo: string;
  horario: string;
  institution_id: number | null;
  disponible: boolean;
}

interface ApiInstitution {
  id: number;
  user_id: number;
  nombre_institucion: string;
}

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

function calcularEdad(fechaNacimiento: string): number {
  const hoy = new Date();
  const nac = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nac.getFullYear();
  const m = hoy.getMonth() - nac.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
  return edad;
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
const DashboardView = ({
  setActiveSection,
  appointments,
  patients,
  doctors,
}: {
  setActiveSection: (section: NavSection) => void;
  appointments: Appointment[];
  patients: Patient[];
  doctors: Doctor[];
}) => {
  const stats = [
    { title: "Pacientes", value: patients.length.toString(), change: "", trend: "up", icon: <Users size={28} /> },
    { title: "Doctores", value: doctors.length.toString(), change: "", trend: "up", icon: <Hospital size={28} /> },
    { title: "Citas Hoy", value: appointments.length.toString(), change: "", trend: "up", icon: <Calendar size={28} /> },
    {
      title: "Confirmadas",
      value: appointments.filter((a) => a.estado === "confirmada").length.toString(),
      change: "",
      trend: "up",
      icon: <Activity size={28} />,
    },
  ];

  const topDoctors = doctors.slice(0, 4);

  return (
    <>
      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { icon: <Calendar size={20} />, label: "Nueva Cita", color: "bg-blue-500", section: "Citas" as NavSection },
          { icon: <Users size={20} />, label: "Agregar Paciente", color: "bg-green-500", section: "Pacientes" as NavSection },
          { icon: <Stethoscope size={20} />, label: "Agregar Doctor", color: "bg-indigo-500", section: "Doctores" as NavSection },
          { icon: <FileText size={20} />, label: "Generar Reporte", color: "bg-purple-500", section: "Reportes" as NavSection },
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
              {stat.change && (
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${
                    stat.trend === "up" ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {stat.trend === "up" ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {stat.change}
                </div>
              )}
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
            <h3 className="text-xl font-semibold text-slate-800">Citas Recientes</h3>
            <button
              onClick={() => setActiveSection("Citas")}
              className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
            >
              Ver todas <ChevronRight size={16} />
            </button>
          </div>

          {appointments.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Calendar size={40} className="mx-auto mb-3 opacity-40" />
              <p>No hay citas registradas</p>
            </div>
          ) : (
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
          )}
        </div>

        {/* TOP DOCTORES */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-6">Top Doctores</h3>
          {topDoctors.length === 0 ? (
            <div className="text-center text-slate-400 py-8">
              <Stethoscope size={36} className="mx-auto mb-3 opacity-40" />
              <p>Sin doctores registrados</p>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </>
  );
};

// Patients View
const PatientsView = ({ institutionId }: { institutionId: number | null }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [newPatient, setNewPatient] = useState({
    nombre: "",
    edad: "",
    genero: "Femenino",
    telefono: "",
    email: "",
    direccion: "",
    alergias: "",
    tipo_sangre: "",
    contacto_emergencia: "",
    telefono_contacto: "",
  });

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/patients");
      const data: ApiPatient[] = await res.json();
      const filtered = institutionId
        ? data.filter((p) => p.institution_id === institutionId)
        : data;
      const mapped: Patient[] = filtered.map((p) => ({
        id: p.id,
        nombre: p.nombre_completo,
        edad: calcularEdad(p.fecha_nacimiento),
        genero: p.sexo,
        telefono: p.telefono,
        email: "",
        direccion: p.direccion,
        ultimaVisita: "-",
        proximaCita: "-",
        condiciones: p.alergias ? [p.alergias] : [],
      }));
      setPatients(mapped);
    } catch (err) {
      console.error("[v0] Error fetching patients:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPatients();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [institutionId]);

  const filteredPatients = patients.filter((p) =>
    p.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddPatient = async () => {
    if (!newPatient.nombre.trim()) return;
    setSaving(true);
    try {
      const body = {
        nombre_completo: newPatient.nombre,
        fecha_nacimiento: new Date(
          new Date().getFullYear() - (parseInt(newPatient.edad) || 0),
          0,
          1
        ).toISOString(),
        sexo: newPatient.genero,
        telefono: newPatient.telefono,
        direccion: newPatient.direccion,
        alergias: newPatient.alergias,
        tipo_sangre: newPatient.tipo_sangre,
        contacto_emergencia: newPatient.contacto_emergencia,
        telefono_contacto_emergencia: newPatient.telefono_contacto,
        institution_id: institutionId,
      };
      const res = await fetch("http://localhost:3000/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        await fetchPatients();
        setShowAddModal(false);
        setNewPatient({
          nombre: "", edad: "", genero: "Femenino", telefono: "", email: "",
          direccion: "", alergias: "", tipo_sangre: "", contacto_emergencia: "", telefono_contacto: "",
        });
        setSuccessMessage("¡Paciente guardado correctamente!");
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    } catch (err) {
      console.error("[v0] Error saving patient:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePatient = async (id: number) => {
    try {
      await fetch(`http://localhost:3000/api/patients/${id}`, { method: "DELETE" });
      setPatients(patients.filter((p) => p.id !== id));
    } catch (err) {
      console.error("[v0] Error deleting patient:", err);
    }
  };

  return (
    <>
      {/* Success Message Toast */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3"
          >
            <CheckCircle2 size={24} />
            <span className="font-medium">{successMessage}</span>
            <button onClick={() => setSuccessMessage(null)} className="ml-2 hover:bg-green-600 rounded-full p-1">
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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
              placeholder="Buscar por nombre..."
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
        {loading ? (
          <div className="p-16 text-center text-slate-400">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm">Cargando pacientes...</p>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <Users size={48} className="mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium mb-1">Sin pacientes registrados</p>
            <p className="text-sm">Agrega el primer paciente usando el botón de arriba</p>
          </div>
        ) : (
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
        )}
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Sexo</label>
              <select
                value={newPatient.genero}
                onChange={(e) => setNewPatient({ ...newPatient, genero: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Femenino</option>
                <option>Masculino</option>
                <option>Otro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Sangre</label>
              <select
                value={newPatient.tipo_sangre}
                onChange={(e) => setNewPatient({ ...newPatient, tipo_sangre: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar...</option>
                {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
              <input
                type="text"
                value={newPatient.telefono}
                onChange={(e) => setNewPatient({ ...newPatient, telefono: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Alergias</label>
              <input
                type="text"
                value={newPatient.alergias}
                onChange={(e) => setNewPatient({ ...newPatient, alergias: e.target.value })}
                placeholder="Ej: Penicilina"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Direccion</label>
            <input
              type="text"
              value={newPatient.direccion}
              onChange={(e) => setNewPatient({ ...newPatient, direccion: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contacto de Emergencia</label>
              <input
                type="text"
                value={newPatient.contacto_emergencia}
                onChange={(e) => setNewPatient({ ...newPatient, contacto_emergencia: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tel. Emergencia</label>
              <input
                type="text"
                value={newPatient.telefono_contacto}
                onChange={(e) => setNewPatient({ ...newPatient, telefono_contacto: e.target.value })}
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
              onClick={handleAddPatient}
              disabled={saving}
              className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 disabled:opacity-60"
            >
              {saving ? "Guardando..." : "Guardar Paciente"}
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
const DoctorsView = ({ institutionId }: { institutionId: number | null }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [newDoctor, setNewDoctor] = useState({
    nombre: "",
    especialidad: "",
    telefono: "",
    email: "",
    horario: "",
  });

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/doctors");
      const data: ApiDoctor[] = await res.json();
      const filtered = institutionId
        ? data.filter((d) => d.institution_id === institutionId)
        : data;
      const mapped: Doctor[] = filtered.map((d) => ({
        id: d.id,
        nombre: d.nombre_completo,
        especialidad: d.especialidad,
        telefono: d.telefono,
        email: d.correo,
        horario: d.horario || "Por definir",
        pacientes: 0,
        rating: 5.0,
        avatar: d.nombre_completo.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase(),
        disponible: d.disponible ?? true,
      }));
      setDoctors(mapped);
    } catch (err) {
      console.error("[v0] Error fetching doctors:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchDoctors();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [institutionId]);

  const filteredDoctors = doctors.filter(
    (d) =>
      d.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.especialidad.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddDoctor = async () => {
    if (!newDoctor.nombre.trim()) return;
    setSaving(true);
    try {
      const body = {
        nombre_completo: newDoctor.nombre,
        especialidad: newDoctor.especialidad,
        telefono: newDoctor.telefono,
        correo: newDoctor.email,
        horario: newDoctor.horario,
        institution_id: institutionId,
        disponible: true,
      };
      const res = await fetch("http://localhost:3000/api/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        await fetchDoctors();
        setShowAddModal(false);
        setNewDoctor({ nombre: "", especialidad: "", telefono: "", email: "", horario: "" });
        setSuccessMessage("¡Doctor guardado correctamente!");
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    } catch (err) {
      console.error("[v0] Error saving doctor:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDoctor = async (id: number) => {
    try {
      await fetch(`http://localhost:3000/api/doctors/${id}`, { method: "DELETE" });
      setDoctors(doctors.filter((d) => d.id !== id));
    } catch (err) {
      console.error("[v0] Error deleting doctor:", err);
    }
  };

  const handleToggleDisponibilidad = async (id: number) => {
    const doctor = doctors.find((d) => d.id === id);
    if (!doctor) return;
    try {
      await fetch(`http://localhost:3000/api/doctors/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disponible: !doctor.disponible }),
      });
      setDoctors(doctors.map((d) => (d.id === id ? { ...d, disponible: !d.disponible } : d)));
    } catch (err) {
      console.error("[v0] Error toggling doctor availability:", err);
    }
  };

  return (
    <>
      {/* Success Message Toast */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3"
          >
            <CheckCircle2 size={24} />
            <span className="font-medium">{successMessage}</span>
            <button onClick={() => setSuccessMessage(null)} className="ml-2 hover:bg-green-600 rounded-full p-1">
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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
                {doctors.length > 0
                  ? (doctors.reduce((acc, d) => acc + d.rating, 0) / doctors.length).toFixed(1)
                  : "-"}
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
      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-16 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm">Cargando doctores...</p>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-16 text-center text-slate-400">
          <Stethoscope size={48} className="mx-auto mb-4 opacity-40" />
          <p className="text-lg font-medium mb-1">Sin doctores registrados</p>
          <p className="text-sm">Agrega el primer doctor usando el botón de arriba</p>
        </div>
      ) : (
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
      )}

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
              disabled={saving}
              className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 disabled:opacity-60"
            >
              {saving ? "Guardando..." : "Guardar Doctor"}
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
  patients,
  doctors,
}: {
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  patients: Patient[];
  doctors: Doctor[];
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
    const patient = patients.find((p) => p.id === parseInt(newAppointment.pacienteId));
    const doctor = doctors.find((d) => d.id === parseInt(newAppointment.doctorId));
    if (!patient || !doctor) return;

    const appointment: Appointment = {
      id: Date.now(),
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
        {filteredAppointments.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <Calendar size={48} className="mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium mb-1">Sin citas registradas</p>
            <p className="text-sm">Agenda la primera cita usando el botón de arriba</p>
          </div>
        ) : (
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
        )}
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
              {patients.map((p) => (
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
              {doctors
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

// Reports View
const ReportsView = ({
  appointments,
  patients,
  doctors,
}: {
  appointments: Appointment[];
  patients: Patient[];
  doctors: Doctor[];
}) => {
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

  const avgRating =
    doctors.length > 0
      ? (doctors.reduce((acc, d) => acc + d.rating, 0) / doctors.length).toFixed(1)
      : "-";

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
              <p className="text-3xl font-bold mt-1">{patients.length}</p>
            </div>
            <Users size={40} className="text-blue-300" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-5 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Doctores</p>
              <p className="text-3xl font-bold mt-1">{doctors.length}</p>
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
          {appointments.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm">Sin datos disponibles</div>
          ) : (
            <div className="space-y-4">
              {[
                { label: "Confirmadas", count: appointmentsByStatus.confirmadas, color: "bg-green-500" },
                { label: "Pendientes", count: appointmentsByStatus.pendientes, color: "bg-yellow-500" },
                { label: "En Curso", count: appointmentsByStatus.enCurso, color: "bg-blue-500" },
                { label: "Canceladas", count: appointmentsByStatus.canceladas, color: "bg-red-500" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 ${item.color} rounded-full`} />
                    <span className="text-slate-600">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full`}
                        style={{ width: `${(item.count / appointments.length) * 100}%` }}
                      />
                    </div>
                    <span className="font-semibold text-slate-800 w-8">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Appointments by Type */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <BarChart3 size={20} className="text-purple-500" />
            Citas por Tipo de Consulta
          </h3>
          {Object.keys(appointmentsByType).length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm">Sin datos disponibles</div>
          ) : (
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
          )}
        </div>
      </div>

      {/* Doctor Performance */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Stethoscope size={20} className="text-green-500" />
          Rendimiento por Doctor
        </h3>
        {doctors.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-sm">Sin doctores registrados</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {doctors.map((doctor) => (
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
        )}
      </div>
    </>
  );
};

// Main Component
const InstitutionDashboard: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState<NavSection>("Dashboard");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [institutionId, setInstitutionId] = useState<number | null>(null);
  const [institutionName, setInstitutionName] = useState("MediCenter");

  const router = useRouter();

  // Fetch institution data on mount
  React.useEffect(() => {
    const loadInstitution = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/institutions");
        const data: ApiInstitution[] = await res.json();
        if (data && data.length > 0) {
          setInstitutionId(data[0].id);
          setInstitutionName(data[0].nombre_institucion);
        }
      } catch (err) {
        console.error("[v0] Error fetching institution:", err);
      }
    };
    loadInstitution();
  }, []);

  // Fetch patients and doctors for Dashboard view
  React.useEffect(() => {
    const loadPatientsAndDoctors = async () => {
      try {
        // Fetch patients
        const patientsRes = await fetch("http://localhost:3000/api/patients");
        const patientsData: ApiPatient[] = await patientsRes.json();
        const filteredPatients = institutionId
          ? patientsData.filter((p) => p.institution_id === institutionId)
          : patientsData;
        const mappedPatients: Patient[] = filteredPatients.map((p) => ({
          id: p.id,
          nombre: p.nombre_completo,
          edad: calcularEdad(p.fecha_nacimiento),
          genero: p.sexo,
          telefono: p.telefono,
          email: "",
          direccion: p.direccion,
          ultimaVisita: "-",
          proximaCita: "-",
          condiciones: p.alergias ? [p.alergias] : [],
        }));
        setPatients(mappedPatients);

        // Fetch doctors
        const doctorsRes = await fetch("http://localhost:3000/api/doctors");
        const doctorsData: ApiDoctor[] = await doctorsRes.json();
        const filteredDoctors = institutionId
          ? doctorsData.filter((d) => d.institution_id === institutionId)
          : doctorsData;
        const mappedDoctors: Doctor[] = filteredDoctors.map((d) => ({
          id: d.id,
          nombre: d.nombre_completo,
          especialidad: d.especialidad,
          telefono: d.telefono,
          email: d.correo,
          horario: d.horario || "Por definir",
          pacientes: 0,
          rating: 5.0,
          avatar: d.nombre_completo.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase(),
          disponible: d.disponible ?? true,
        }));
        setDoctors(mappedDoctors);
      } catch (err) {
        console.error("[v0] Error fetching patients/doctors:", err);
      }
    };
    loadPatientsAndDoctors();
  }, [institutionId]);

  const handleLogout = () => {
    localStorage.removeItem("rol");
    localStorage.removeItem("token");
    sessionStorage.clear();
    router.replace("/login");
  };

  const navItems: { icon: React.ReactNode; label: NavSection }[] = [
    { icon: <Home size={20} />, label: "Dashboard" },
    { icon: <Users size={20} />, label: "Pacientes" },
    { icon: <Stethoscope size={20} />, label: "Doctores" },
    { icon: <Calendar size={20} />, label: "Citas" },
    { icon: <BarChart3 size={20} />, label: "Reportes" },
    { icon: <Settings size={20} />, label: "Configuración" },
  ];

  const notifications = [
    { id: 1, type: "info", message: "Sistema listo para su uso", time: "Ahora" },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "Dashboard":
        return (
          <DashboardView
            setActiveSection={setActiveSection}
            appointments={appointments}
            patients={patients}
            doctors={doctors}
          />
        );
      case "Pacientes":
        return <PatientsView institutionId={institutionId} />;
      case "Doctores":
        return <DoctorsView institutionId={institutionId} />;
      case "Citas":
        return (
          <AppointmentsView
            appointments={appointments}
            setAppointments={setAppointments}
            patients={patients}
            doctors={doctors}
          />
        );
      case "Reportes":
        return <ReportsView appointments={appointments} patients={patients} doctors={doctors} />;
      case "Configuración":
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Settings size={64} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground">Configuración</h3>
              <p className="text-muted-foreground">Próximamente disponible</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">

      {/* SIDEBAR */}
      <aside className="w-72 bg-sidebar border-r border-sidebar-border p-6 flex flex-col sticky top-0 h-screen">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 bg-sidebar-primary rounded-xl flex items-center justify-center">
            <HeartPulse size={28} className="text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-sidebar-foreground">{institutionName}</h1>
            <p className="text-sidebar-foreground/60 text-sm">Sistema Hospitalario</p>
          </div>
        </div>

        {/* NAV */}
        <nav className="space-y-2 flex-1">
          {navItems.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ x: 4 }}
              onClick={() => setActiveSection(item.label)}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                activeSection === item.label
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/20"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {activeSection === item.label && (
                <ChevronRight size={16} className="ml-auto opacity-60" />
              )}
            </motion.div>
          ))}
        </nav>

        {/* FOOTER */}
        <div className="border-t border-sidebar-border pt-4 mt-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-sidebar-accent">
            <div className="w-10 h-10 bg-sidebar-primary rounded-full flex items-center justify-center font-bold text-sidebar-primary-foreground">
              AD
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm text-sidebar-foreground">Admin</p>
              <p className="text-sidebar-foreground/60 text-xs">Administrador</p>
            </div>
            <LogOut
              size={18}
              onClick={handleLogout}
              className="text-sidebar-foreground/60 cursor-pointer hover:text-sidebar-foreground transition-colors"
            />
          </div>
        </div>
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 p-8 overflow-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">{activeSection}</h2>
            <p className="text-muted-foreground">
              {activeSection === "Dashboard" && "Bienvenido de vuelta, aquí está el resumen de hoy"}
              {activeSection === "Pacientes" && "Gestiona la información de los pacientes"}
              {activeSection === "Doctores" && "Administra el equipo médico"}
              {activeSection === "Citas" && "Controla todas las citas médicas"}
              {activeSection === "Reportes" && "Analiza las estadísticas del sistema"}
              {activeSection === "Configuración" && "Ajusta las preferencias del sistema"}
            </p>
          </div>

          <div className="flex items-center gap-4">

            {/* BÚSQUEDA */}
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar paciente, doctor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl w-72 focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            {/* NOTIFICACIONES */}
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-3 bg-card border border-border rounded-xl hover:bg-muted transition-colors"
              >
                <Bell size={20} className="text-muted-foreground" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              </motion.button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 bg-card rounded-xl shadow-xl border border-border z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-border">
                      <h4 className="font-semibold text-foreground">Notificaciones</h4>
                    </div>

                    <div className="max-h-80 overflow-auto">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className="p-4 border-b border-border hover:bg-muted cursor-pointer"
                        >
                          <div className="flex gap-3">
                            <Bell size={20} className="text-primary shrink-0" />
                            <div>
                              <p className="text-sm text-foreground">{notif.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 bg-muted text-center">
                      <button className="text-primary text-sm font-medium hover:underline">
                        Ver todas las notificaciones
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* FECHA */}
            <div className="flex items-center gap-2 bg-card border border-border px-4 py-2.5 rounded-xl">
              <Clock size={18} className="text-muted-foreground" />
              <span className="text-foreground font-medium">
                {new Date().toLocaleDateString("es-MX", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* CONTENT */}
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
