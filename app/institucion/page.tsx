"use client";

import React, { useState, useCallback } from "react";
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
  Building2,
  UserPlus,
  ShieldCheck,
  ShieldX,
} from "lucide-react";

// ==========================================
// 🔧 API SERVICE (Integrado en el mismo archivo)
// ==========================================

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const getHeaders = (token?: string) => ({
  'Authorization': token ? `Bearer ${token}` : '',
  'Content-Type': 'application/json'
});

const institutionService = {
  // 🤝 AFILIACIONES Y MÉDICOS
  approveAffiliation: async (token: string, affiliationId: number) => {
    const res = await fetch(`${BASE_URL}/affiliations/${affiliationId}/approve`, {
      method: 'POST',
      headers: getHeaders(token)
    });
    return res.json();
  },

  rejectAffiliation: async (token: string, affiliationId: number, reason: string) => {
    const res = await fetch(`${BASE_URL}/affiliations/${affiliationId}/reject`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ reason })
    });
    return res.json();
  },

  getBranchUsers: async (token: string, branchId: number) => {
    const res = await fetch(`${BASE_URL}/institutions/branches/${branchId}/users`, {
      method: 'GET',
      headers: getHeaders(token)
    });
    return res.json();
  },

  // 🧑‍⚕️ PACIENTES Y CITAS
  createPatient: async (token: string, patientData: Record<string, unknown>) => {
    const res = await fetch(`${BASE_URL}/patients`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(patientData)
    });
    return res.json();
  },

  createAppointment: async (token: string, appointmentData: Record<string, unknown>) => {
    const res = await fetch(`${BASE_URL}/appointments`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(appointmentData)
    });
    return res.json();
  },

  // 🏥 SUCURSALES Y STAFF
  createBranch: async (token: string, institutionId: number, branchData: Record<string, unknown>) => {
    const res = await fetch(`${BASE_URL}/institutions/${institutionId}/branches`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(branchData)
    });
    return res.json();
  },

  createStaff: async (token: string, staffData: Record<string, unknown>) => {
    const res = await fetch(`${BASE_URL}/staff`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(staffData)
    });
    return res.json();
  },

  assignStaffToBranch: async (token: string, branchId: number, staffId: number, permissions = {}) => {
    const res = await fetch(`${BASE_URL}/staff/assignments/branches`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ staffId, branchId, permissions })
    });
    return res.json();
  },

  // 📊 DASHBOARDS
  getInstitutionSummary: async (token: string) => {
    const res = await fetch(`${BASE_URL}/dashboard/institution/summary`, {
      method: 'GET',
      headers: getHeaders(token)
    });
    return res.json();
  },

  getBranchSummary: async (token: string) => {
    const res = await fetch(`${BASE_URL}/dashboard/branch/summary`, {
      method: 'GET',
      headers: getHeaders(token)
    });
    return res.json();
  },

  // Métodos adicionales para CRUD básico
  getPatients: async () => {
    const res = await fetch(`${BASE_URL}/patients`);
    return res.json();
  },

  deletePatient: async (id: number) => {
    const res = await fetch(`${BASE_URL}/patients/${id}`, { method: 'DELETE' });
    return res.json();
  },

  getDoctors: async () => {
    const res = await fetch(`${BASE_URL}/doctors`);
    return res.json();
  },

  createDoctor: async (doctorData: Record<string, unknown>) => {
    const res = await fetch(`${BASE_URL}/doctors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doctorData)
    });
    return res.json();
  },

  deleteDoctor: async (id: number) => {
    const res = await fetch(`${BASE_URL}/doctors/${id}`, { method: 'DELETE' });
    return res.json();
  },

  updateDoctor: async (id: number, data: Record<string, unknown>) => {
    const res = await fetch(`${BASE_URL}/doctors/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  getInstitutions: async () => {
    const res = await fetch(`${BASE_URL}/institutions`);
    return res.json();
  },

  getAffiliations: async (token: string) => {
    const res = await fetch(`${BASE_URL}/affiliations`, {
      method: 'GET',
      headers: getHeaders(token)
    });
    return res.json();
  },

  getBranches: async (token: string, institutionId: number) => {
    const res = await fetch(`${BASE_URL}/institutions/${institutionId}/branches`, {
      method: 'GET',
      headers: getHeaders(token)
    });
    return res.json();
  }
};

// ==========================================
// 📝 TYPES
// ==========================================

type NavSection = "Dashboard" | "Pacientes" | "Doctores" | "Citas" | "Sucursales" | "Afiliaciones" | "Reportes" | "Configuración";
type AppointmentStatus = "confirmada" | "pendiente" | "cancelada" | "en_curso";

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

interface Branch {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  horario: string;
  staffCount: number;
}

interface Affiliation {
  id: number;
  doctorName: string;
  especialidad: string;
  status: "pendiente" | "aprobada" | "rechazada";
  fechaSolicitud: string;
  telefono: string;
  email: string;
}

function calcularEdad(fechaNacimiento: string): number {
  const hoy = new Date();
  const nac = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nac.getFullYear();
  const m = hoy.getMonth() - nac.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
  return edad;
}

// ==========================================
// 🎨 COMPONENTES DE UI
// ==========================================

const StatusBadge = ({ estado }: { estado: string }) => {
  const styles: Record<string, string> = {
    confirmada: "bg-green-100 text-green-700",
    pendiente: "bg-yellow-100 text-yellow-700",
    cancelada: "bg-red-100 text-red-700",
    en_curso: "bg-blue-100 text-blue-700",
    aprobada: "bg-green-100 text-green-700",
    rechazada: "bg-red-100 text-red-700",
  };
  const labels: Record<string, string> = {
    confirmada: "Confirmada",
    pendiente: "Pendiente",
    cancelada: "Cancelada",
    en_curso: "En Curso",
    aprobada: "Aprobada",
    rechazada: "Rechazada",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[estado] || "bg-slate-100 text-slate-700"}`}>
      {labels[estado] || estado}
    </span>
  );
};

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

const Toast = ({ message, onClose }: { message: string; onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="fixed top-6 right-6 z-50 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3"
  >
    <CheckCircle2 size={24} />
    <span className="font-medium">{message}</span>
    <button onClick={onClose} className="ml-2 hover:bg-green-600 rounded-full p-1">
      <X size={18} />
    </button>
  </motion.div>
);

// ==========================================
// 📊 DASHBOARD VIEW
// ==========================================

const DashboardView = ({
  setActiveSection,
  appointments,
  patients,
  doctors,
  institutionSummary,
}: {
  setActiveSection: (section: NavSection) => void;
  appointments: Appointment[];
  patients: Patient[];
  doctors: Doctor[];
  institutionSummary: Record<string, unknown> | null;
}) => {
  const stats = [
    { title: "Pacientes", value: institutionSummary?.totalPatients?.toString() || patients.length.toString(), change: "", trend: "up", icon: <Users size={28} /> },
    { title: "Doctores", value: institutionSummary?.totalDoctors?.toString() || doctors.length.toString(), change: "", trend: "up", icon: <Hospital size={28} /> },
    { title: "Citas Hoy", value: institutionSummary?.todayAppointments?.toString() || appointments.length.toString(), change: "", trend: "up", icon: <Calendar size={28} /> },
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: <Calendar size={20} />, label: "Nueva Cita", color: "bg-blue-500", section: "Citas" as NavSection },
          { icon: <Users size={20} />, label: "Agregar Paciente", color: "bg-green-500", section: "Pacientes" as NavSection },
          { icon: <Stethoscope size={20} />, label: "Agregar Doctor", color: "bg-indigo-500", section: "Doctores" as NavSection },
          { icon: <Building2 size={20} />, label: "Nueva Sucursal", color: "bg-purple-500", section: "Sucursales" as NavSection },
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

// ==========================================
// 👥 PATIENTS VIEW
// ==========================================

const PatientsView = ({ institutionId, token }: { institutionId: number | null; token: string }) => {
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

  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      const data: ApiPatient[] = await institutionService.getPatients();
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
  }, [institutionId]);

  React.useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

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
      
      await institutionService.createPatient(token, body);
      await fetchPatients();
      setShowAddModal(false);
      setNewPatient({
        nombre: "", edad: "", genero: "Femenino", telefono: "", email: "",
        direccion: "", alergias: "", tipo_sangre: "", contacto_emergencia: "", telefono_contacto: "",
      });
      setSuccessMessage("¡Paciente guardado correctamente!");
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      console.error("[v0] Error saving patient:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePatient = async (id: number) => {
    try {
      await institutionService.deletePatient(id);
      setPatients(patients.filter((p) => p.id !== id));
    } catch (err) {
      console.error("[v0] Error deleting patient:", err);
    }
  };

  return (
    <>
      <AnimatePresence>
        {successMessage && <Toast message={successMessage} onClose={() => setSuccessMessage(null)} />}
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
                <p className="text-sm text-slate-500 mb-1">Dirección</p>
                <p className="font-medium text-slate-800 flex items-center gap-2">
                  <MapPin size={16} className="text-blue-500" />
                  {selectedPatient.direccion}
                </p>
              </div>
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
          </div>
        )}
      </Modal>
    </>
  );
};

// ==========================================
// 🩺 DOCTORS VIEW
// ==========================================

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

  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      const data: ApiDoctor[] = await institutionService.getDoctors();
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
  }, [institutionId]);

  React.useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

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
      await institutionService.createDoctor(body);
      await fetchDoctors();
      setShowAddModal(false);
      setNewDoctor({ nombre: "", especialidad: "", telefono: "", email: "", horario: "" });
      setSuccessMessage("¡Doctor guardado correctamente!");
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      console.error("[v0] Error saving doctor:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDoctor = async (id: number) => {
    try {
      await institutionService.deleteDoctor(id);
      setDoctors(doctors.filter((d) => d.id !== id));
    } catch (err) {
      console.error("[v0] Error deleting doctor:", err);
    }
  };

  const handleToggleDisponibilidad = async (id: number) => {
    const doctor = doctors.find((d) => d.id === id);
    if (!doctor) return;
    try {
      await institutionService.updateDoctor(id, { disponible: !doctor.disponible });
      setDoctors(doctors.map((d) => (d.id === id ? { ...d, disponible: !d.disponible } : d)));
    } catch (err) {
      console.error("[v0] Error toggling doctor availability:", err);
    }
  };

  return (
    <>
      <AnimatePresence>
        {successMessage && <Toast message={successMessage} onClose={() => setSuccessMessage(null)} />}
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

// ==========================================
// 📅 APPOINTMENTS VIEW
// ==========================================

const AppointmentsView = ({
  appointments,
  setAppointments,
  patients,
  doctors,
  token,
}: {
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  patients: Patient[];
  doctors: Doctor[];
  token: string;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("todas");
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
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

  const handleAddAppointment = async () => {
    const patient = patients.find((p) => p.id === parseInt(newAppointment.pacienteId));
    const doctor = doctors.find((d) => d.id === parseInt(newAppointment.doctorId));
    if (!patient || !doctor) return;

    setSaving(true);
    try {
      const appointmentData = {
        patient_id: patient.id,
        doctor_id: doctor.id,
        fecha: newAppointment.fecha,
        hora: newAppointment.hora,
        tipo: newAppointment.tipo,
        notas: newAppointment.notas,
        estado: "pendiente",
      };

      await institutionService.createAppointment(token, appointmentData);

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
      setSuccessMessage("¡Cita agendada correctamente!");
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      console.error("[v0] Error creating appointment:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateStatus = (id: number, newStatus: AppointmentStatus) => {
    setAppointments(appointments.map((apt) => (apt.id === id ? { ...apt, estado: newStatus } : apt)));
  };

  const handleDeleteAppointment = (id: number) => {
    setAppointments(appointments.filter((apt) => apt.id !== id));
  };

  return (
    <>
      <AnimatePresence>
        {successMessage && <Toast message={successMessage} onClose={() => setSuccessMessage(null)} />}
      </AnimatePresence>

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
              disabled={saving}
              className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 disabled:opacity-60"
            >
              {saving ? "Agendando..." : "Agendar Cita"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

// ==========================================
// 🏥 BRANCHES VIEW
// ==========================================

const BranchesView = ({ institutionId, token }: { institutionId: number | null; token: string }) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [newBranch, setNewBranch] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    horario: "",
  });

  const fetchBranches = useCallback(async () => {
    if (!institutionId || !token) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await institutionService.getBranches(token, institutionId);
      if (Array.isArray(data)) {
        setBranches(data.map((b: Record<string, unknown>) => ({
          id: b.id as number,
          nombre: b.nombre as string || "",
          direccion: b.direccion as string || "",
          telefono: b.telefono as string || "",
          horario: b.horario as string || "8:00 - 18:00",
          staffCount: b.staffCount as number || 0,
        })));
      }
    } catch (err) {
      console.error("[v0] Error fetching branches:", err);
    } finally {
      setLoading(false);
    }
  }, [institutionId, token]);

  React.useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const handleAddBranch = async () => {
    if (!newBranch.nombre.trim() || !institutionId) return;
    setSaving(true);
    try {
      await institutionService.createBranch(token, institutionId, newBranch);
      await fetchBranches();
      setShowAddModal(false);
      setNewBranch({ nombre: "", direccion: "", telefono: "", horario: "" });
      setSuccessMessage("¡Sucursal creada correctamente!");
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      console.error("[v0] Error creating branch:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {successMessage && <Toast message={successMessage} onClose={() => setSuccessMessage(null)} />}
      </AnimatePresence>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestión de Sucursales</h2>
          <p className="text-slate-500">Administra las sucursales de tu institución</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 font-medium"
        >
          <Plus size={20} />
          Nueva Sucursal
        </motion.button>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-16 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm">Cargando sucursales...</p>
        </div>
      ) : branches.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-16 text-center text-slate-400">
          <Building2 size={48} className="mx-auto mb-4 opacity-40" />
          <p className="text-lg font-medium mb-1">Sin sucursales registradas</p>
          <p className="text-sm">Crea la primera sucursal usando el botón de arriba</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((branch, idx) => (
            <motion.div
              key={branch.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">{branch.nombre}</h4>
                    <p className="text-sm text-slate-500">{branch.staffCount} empleados</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin size={16} className="text-slate-400" />
                  {branch.direccion}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Phone size={16} className="text-slate-400" />
                  {branch.telefono}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock size={16} className="text-slate-400" />
                  {branch.horario}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                <button className="flex-1 p-2 hover:bg-blue-50 rounded-lg text-blue-600 text-sm font-medium">
                  Ver Detalle
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
                  <Edit size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Branch Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Nueva Sucursal">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre de la Sucursal</label>
            <input
              type="text"
              value={newBranch.nombre}
              onChange={(e) => setNewBranch({ ...newBranch, nombre: e.target.value })}
              placeholder="Ej: Sucursal Centro"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Dirección</label>
            <input
              type="text"
              value={newBranch.direccion}
              onChange={(e) => setNewBranch({ ...newBranch, direccion: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
              <input
                type="text"
                value={newBranch.telefono}
                onChange={(e) => setNewBranch({ ...newBranch, telefono: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Horario</label>
              <input
                type="text"
                value={newBranch.horario}
                onChange={(e) => setNewBranch({ ...newBranch, horario: e.target.value })}
                placeholder="8:00 - 18:00"
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
              onClick={handleAddBranch}
              disabled={saving}
              className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 disabled:opacity-60"
            >
              {saving ? "Creando..." : "Crear Sucursal"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

// ==========================================
// 🤝 AFFILIATIONS VIEW
// ==========================================

const AffiliationsView = ({ token }: { token: string }) => {
  const [affiliations, setAffiliations] = useState<Affiliation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("todas");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
  const [rejectReason, setRejectReason] = useState("");

  const fetchAffiliations = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await institutionService.getAffiliations(token);
      if (Array.isArray(data)) {
        setAffiliations(data.map((a: Record<string, unknown>) => ({
          id: a.id as number,
          doctorName: a.doctor_name as string || a.nombre as string || "Doctor",
          especialidad: a.especialidad as string || "",
          status: (a.status as string || "pendiente") as "pendiente" | "aprobada" | "rechazada",
          fechaSolicitud: a.created_at as string || new Date().toISOString(),
          telefono: a.telefono as string || "",
          email: a.email as string || "",
        })));
      }
    } catch (err) {
      console.error("[v0] Error fetching affiliations:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  React.useEffect(() => {
    fetchAffiliations();
  }, [fetchAffiliations]);

  const handleApprove = async (id: number) => {
    try {
      await institutionService.approveAffiliation(token, id);
      setAffiliations(affiliations.map(a => a.id === id ? { ...a, status: "aprobada" as const } : a));
      setSuccessMessage("¡Afiliación aprobada!");
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      console.error("[v0] Error approving affiliation:", err);
    }
  };

  const handleReject = async () => {
    if (!rejectModal.id) return;
    try {
      await institutionService.rejectAffiliation(token, rejectModal.id, rejectReason);
      setAffiliations(affiliations.map(a => a.id === rejectModal.id ? { ...a, status: "rechazada" as const } : a));
      setRejectModal({ open: false, id: null });
      setRejectReason("");
      setSuccessMessage("Afiliación rechazada");
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      console.error("[v0] Error rejecting affiliation:", err);
    }
  };

  const filteredAffiliations = affiliations.filter((a) => 
    filterStatus === "todas" || a.status === filterStatus
  );

  return (
    <>
      <AnimatePresence>
        {successMessage && <Toast message={successMessage} onClose={() => setSuccessMessage(null)} />}
      </AnimatePresence>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Solicitudes de Afiliación</h2>
          <p className="text-slate-500">Revisa y gestiona las solicitudes de médicos</p>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="todas">Todas</option>
          <option value="pendiente">Pendientes</option>
          <option value="aprobada">Aprobadas</option>
          <option value="rechazada">Rechazadas</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Clock size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{affiliations.filter(a => a.status === "pendiente").length}</p>
              <p className="text-sm text-slate-500">Pendientes</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <ShieldCheck size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{affiliations.filter(a => a.status === "aprobada").length}</p>
              <p className="text-sm text-slate-500">Aprobadas</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <ShieldX size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{affiliations.filter(a => a.status === "rechazada").length}</p>
              <p className="text-sm text-slate-500">Rechazadas</p>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-16 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm">Cargando solicitudes...</p>
        </div>
      ) : filteredAffiliations.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-16 text-center text-slate-400">
          <UserPlus size={48} className="mx-auto mb-4 opacity-40" />
          <p className="text-lg font-medium mb-1">Sin solicitudes de afiliación</p>
          <p className="text-sm">Las solicitudes de médicos aparecerán aquí</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAffiliations.map((affiliation, idx) => (
            <motion.div
              key={affiliation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {affiliation.doctorName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">{affiliation.doctorName}</h4>
                    <p className="text-sm text-slate-500">{affiliation.especialidad}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-slate-400">
                      <span className="flex items-center gap-1"><Phone size={14} /> {affiliation.telefono}</span>
                      <span className="flex items-center gap-1"><Mail size={14} /> {affiliation.email}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <StatusBadge estado={affiliation.status} />
                  {affiliation.status === "pendiente" && (
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleApprove(affiliation.id)}
                        className="px-4 py-2 bg-green-500 text-white rounded-xl font-medium flex items-center gap-2"
                      >
                        <CheckCircle2 size={18} />
                        Aprobar
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setRejectModal({ open: true, id: affiliation.id })}
                        className="px-4 py-2 bg-red-500 text-white rounded-xl font-medium flex items-center gap-2"
                      >
                        <XCircle size={18} />
                        Rechazar
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      <Modal isOpen={rejectModal.open} onClose={() => setRejectModal({ open: false, id: null })} title="Rechazar Afiliación">
        <div className="space-y-4">
          <p className="text-slate-600">Por favor, indica el motivo del rechazo:</p>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={4}
            placeholder="Escribe el motivo..."
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setRejectModal({ open: false, id: null })}
              className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleReject}
              className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600"
            >
              Confirmar Rechazo
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

// ==========================================
// 📊 REPORTS VIEW
// ==========================================

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
                        style={{ width: `${appointments.length > 0 ? (item.count / appointments.length) * 100 : 0}%` }}
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

// ==========================================
// 🎯 MAIN COMPONENT
// ==========================================

const InstitutionDashboard: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState<NavSection>("Dashboard");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [institutionId, setInstitutionId] = useState<number | null>(null);
  const [institutionName, setInstitutionName] = useState("MediCenter");
  const [token, setToken] = useState<string>("");
  const [institutionSummary, setInstitutionSummary] = useState<Record<string, unknown> | null>(null);

  const router = useRouter();

  // Load token from storage
  React.useEffect(() => {
    const storedToken = localStorage.getItem("token") || "";
    setToken(storedToken);
  }, []);

  // Fetch institution data on mount
  React.useEffect(() => {
    const loadInstitution = async () => {
      try {
        const data: ApiInstitution[] = await institutionService.getInstitutions();
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

  // Fetch institution summary
  React.useEffect(() => {
    const loadSummary = async () => {
      if (!token) return;
      try {
        const summary = await institutionService.getInstitutionSummary(token);
        setInstitutionSummary(summary);
      } catch (err) {
        console.error("[v0] Error fetching institution summary:", err);
      }
    };
    loadSummary();
  }, [token]);

  // Fetch patients and doctors for Dashboard view
  React.useEffect(() => {
    const loadPatientsAndDoctors = async () => {
      try {
        // Fetch patients
        const patientsData: ApiPatient[] = await institutionService.getPatients();
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
        const doctorsData: ApiDoctor[] = await institutionService.getDoctors();
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
    { icon: <Building2 size={20} />, label: "Sucursales" },
    { icon: <UserPlus size={20} />, label: "Afiliaciones" },
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
            institutionSummary={institutionSummary}
          />
        );
      case "Pacientes":
        return <PatientsView institutionId={institutionId} token={token} />;
      case "Doctores":
        return <DoctorsView institutionId={institutionId} />;
      case "Citas":
        return (
          <AppointmentsView
            appointments={appointments}
            setAppointments={setAppointments}
            patients={patients}
            doctors={doctors}
            token={token}
          />
        );
      case "Sucursales":
        return <BranchesView institutionId={institutionId} token={token} />;
      case "Afiliaciones":
        return <AffiliationsView token={token} />;
      case "Reportes":
        return <ReportsView appointments={appointments} patients={patients} doctors={doctors} />;
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
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-200 p-6 flex flex-col sticky top-0 h-screen">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
            <HeartPulse size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">{institutionName}</h1>
            <p className="text-slate-500 text-sm">Sistema Hospitalario</p>
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
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
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
        <div className="border-t border-slate-200 pt-4 mt-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-100">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold text-white">
              AD
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm text-slate-800">Admin</p>
              <p className="text-slate-500 text-xs">Administrador</p>
            </div>
            <LogOut
              size={18}
              onClick={handleLogout}
              className="text-slate-400 cursor-pointer hover:text-slate-600 transition-colors"
            />
          </div>
        </div>
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 p-8 overflow-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">{activeSection}</h2>
            <p className="text-slate-500">
              {activeSection === "Dashboard" && "Bienvenido de vuelta, aquí está el resumen de hoy"}
              {activeSection === "Pacientes" && "Gestiona la información de los pacientes"}
              {activeSection === "Doctores" && "Administra el equipo médico"}
              {activeSection === "Citas" && "Controla todas las citas médicas"}
              {activeSection === "Sucursales" && "Gestiona las sucursales de tu institución"}
              {activeSection === "Afiliaciones" && "Revisa solicitudes de médicos"}
              {activeSection === "Reportes" && "Analiza las estadísticas del sistema"}
              {activeSection === "Configuración" && "Ajusta las preferencias del sistema"}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* BÚSQUEDA */}
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar paciente, doctor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl w-72 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            {/* NOTIFICACIONES */}
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <Bell size={20} className="text-slate-500" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.length}
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
                    <div className="p-4 border-b border-slate-200">
                      <h4 className="font-semibold text-slate-800">Notificaciones</h4>
                    </div>

                    <div className="max-h-80 overflow-auto">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className="p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                        >
                          <div className="flex gap-3">
                            <Bell size={20} className="text-blue-500 shrink-0" />
                            <div>
                              <p className="text-sm text-slate-800">{notif.message}</p>
                              <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 bg-slate-50 text-center">
                      <button className="text-blue-500 text-sm font-medium hover:underline">
                        Ver todas las notificaciones
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* FECHA */}
            <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl">
              <Clock size={18} className="text-slate-400" />
              <span className="text-slate-800 font-medium">
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
