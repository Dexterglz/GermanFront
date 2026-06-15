"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../hooks/useAuth"
import { cn } from "../lib/utils"

import {
  Users,
  UserPlus,
  LayoutDashboard,
  Stethoscope,
  HeartPulse,
  LogOut,
  Shield,
  Search,
  Filter,
  Check,
  X,
  TrendingUp,
  CheckCircle,
  Menu,
  User,
  Building2,
  GitBranch,
  UserCheck,
  UserX,
  ClipboardList,
  Plus,
  ChevronRight,
  Phone,
  Loader2,
} from "lucide-react"

// ─────────────────────────────────────────────
// API CONFIG
// ─────────────────────────────────────────────
const API_BASE_URL = "http://localhost:3000/api"

function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token") || sessionStorage.getItem("token")
  }
  return null
}

function getAuthHeaders(): HeadersInit {
  const token = getAuthToken()
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

type Role = "doctor" | "assistant" | "admin" | "patient"

type StaffMember = {
  id: string
  user_id?: string
  name: string
  email: string
  phone: string
  role: Role
  specialty?: string
  department: string
  status: "active" | "inactive"
  createdAt: string
  cedula_profesional?: string
  fecha_nacimiento?: string
  sexo?: string
  curp?: string
  tipo_sangre?: string
  contacto_emergencia?: string
  telefono_contacto_emergencia?: string
}

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const SPECIALTIES = ["Cardiología", "Pediatría", "Neurología", "Ginecología", "Ortopedia", "Dermatología", "Oftalmología", "Medicina General"]
const DEPARTMENTS = ["Cardiología", "Pediatría", "Neurología", "Ginecología", "Ortopedia", "Dermatología", "Recepción", "Administración", "Enfermería"]
const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
const SEXOS = ["Masculino", "Femenino", "Otro"]

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "staff", label: "Todo el Personal", icon: Users },
  { id: "doctors", label: "Doctores", icon: Stethoscope },
  { id: "patients", label: "Pacientes", icon: User },
  { id: "assistants", label: "Asistentes", icon: HeartPulse },
  { id: "admins", label: "Administradores", icon: Shield },
  { id: "register", label: "Registrar Nuevo", icon: UserPlus },
  { id: "institution", label: "Institución", icon: Building2 },
  { id: "branches", label: "Sucursales", icon: GitBranch },
  { id: "affiliations", label: "Afiliaciones", icon: ClipboardList },
]

function initials(name: string) {
  if (!name) return "U"
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
}

// ─────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────

function Sidebar({ activeTab, onTabChange, onLogout }: { activeTab: string; onTabChange: (tab: string) => void; onLogout: () => void }) {
  return (
    <aside className="w-[280px] h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="flex items-center gap-4 px-6 py-5 border-b border-sidebar-border">
        <div className="w-12 h-12 rounded-2xl bg-sidebar-primary flex items-center justify-center">
          <Stethoscope className="w-5 h-5 text-sidebar-primary-foreground" />
        </div>
        <div className="leading-tight">
          <h1 className="text-lg font-bold text-sidebar-foreground tracking-tight">MediRecord</h1>
          <p className="text-[13px] text-sidebar-foreground/60 mt-[2px]">Panel de Administrador</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-[0_6px_14px_rgba(0,0,0,0.15)]"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <Icon className="w-[18px] h-[18px]" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-5 h-5" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}

// ─────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────

interface DashboardSummary {
  totalUsers?: number
  totalDoctors?: number
  totalPatients?: number
  totalInstitutions?: number
  totalBranches?: number
  pendingAffiliations?: number
  totalStaff?: number
  activeDoctors?: number
}

function Dashboard({ staff, onNavigate }: { staff: StaffMember[]; onNavigate: (tab: string) => void }) {
  const [summary, setSummary] = useState<DashboardSummary>({})

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [superAdminRes, branchRes, institutionRes] = await Promise.allSettled([
          fetch(`${API_BASE_URL}/dashboard/super-admin/summary`, { headers: getAuthHeaders() }),
          fetch(`${API_BASE_URL}/dashboard/branch/summary`, { headers: getAuthHeaders() }),
          fetch(`${API_BASE_URL}/dashboard/institution/summary`, { headers: getAuthHeaders() }),
        ])

        const merged: DashboardSummary = {}
        if (superAdminRes.status === "fulfilled" && superAdminRes.value.ok) {
          const d = await superAdminRes.value.json()
          Object.assign(merged, d.data ?? d)
        }
        if (branchRes.status === "fulfilled" && branchRes.value.ok) {
          const d = await branchRes.value.json()
          Object.assign(merged, d.data ?? d)
        }
        if (institutionRes.status === "fulfilled" && institutionRes.value.ok) {
          const d = await institutionRes.value.json()
          Object.assign(merged, d.data ?? d)
        }
        setSummary(merged)
      } catch { /* ignore */ }
    }
    fetchDashboardData()
  }, [])

  const doctors = staff.filter((s) => s.role === "doctor")
  const patients = staff.filter((s) => s.role === "patient")
  const assistants = staff.filter((s) => s.role === "assistant")
  const admins = staff.filter((s) => s.role === "admin")
  const active = staff.filter((s) => s.status === "active")

  const getRoleColor = (role: Role) => {
    if (role === "doctor") return "bg-accent/10 text-accent"
    if (role === "admin") return "bg-amber-500/10 text-amber-600"
    if (role === "patient") return "bg-emerald-500/10 text-emerald-600"
    return "bg-primary/10 text-primary"
  }

  const getRoleLabel = (role: Role) => {
    if (role === "doctor") return "Doctor"
    if (role === "admin") return "Admin"
    if (role === "patient") return "Paciente"
    return "Asistente"
  }

  const stats = [
    { label: "Total Personal", value: summary.totalUsers || staff.length, icon: Users, color: "bg-primary/10 text-primary", tab: "staff" },
    { label: "Doctores", value: summary.totalDoctors || doctors.length, icon: Stethoscope, color: "bg-accent/10 text-accent", tab: "doctors" },
    { label: "Pacientes", value: summary.totalPatients || patients.length, icon: User, color: "bg-emerald-500/10 text-emerald-600", tab: "patients" },
    { label: "Asistentes", value: assistants.length, icon: HeartPulse, color: "bg-primary/10 text-primary", tab: "assistants" },
    { label: "Instituciones", value: summary.totalInstitutions || 0, icon: Building2, color: "bg-amber-500/10 text-amber-600", tab: "institution" },
    { label: "Sucursales", value: summary.totalBranches || 0, icon: GitBranch, color: "bg-sky-500/10 text-sky-600", tab: "branches" },
    { label: "Afiliaciones pendientes", value: summary.pendingAffiliations || 0, icon: ClipboardList, color: "bg-orange-500/10 text-orange-600", tab: "affiliations" },
    { label: "Activos", value: active.length, icon: CheckCircle, color: "bg-green-500/10 text-green-600", tab: "staff" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">Panel de Administración</h1>
        <p className="text-sm text-muted-foreground mt-1">Bienvenido al sistema de gestión de personal médico.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <button
              key={s.label}
              onClick={() => onNavigate(s.tab)}
              className="bg-card border border-border rounded-xl p-4 text-left hover:shadow-md hover:border-primary/30 transition-all"
            >
              <div className={`inline-flex p-2 rounded-lg ${s.color} mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-5">
        {[
          { role: "doctor" as Role, icon: Stethoscope, color: "text-accent", bg: "bg-accent/10", members: doctors, sub: (m: StaffMember) => m.specialty || "General" },
          { role: "patient" as Role, icon: User, color: "text-emerald-600", bg: "bg-emerald-500/10", members: patients, sub: (m: StaffMember) => m.tipo_sangre || "No especificado" },
          { role: "assistant" as Role, icon: HeartPulse, color: "text-primary", bg: "bg-primary/10", members: assistants, sub: (m: StaffMember) => m.department },
          { role: "admin" as Role, icon: Shield, color: "text-amber-600", bg: "bg-amber-500/10", members: admins, sub: (m: StaffMember) => m.department },
        ].map(({ role, icon: Icon, color, bg, members, sub }) => (
          <div key={role} className="bg-card border border-border rounded-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${color}`} />
                <h2 className="text-sm font-semibold text-foreground">{getRoleLabel(role)}s</h2>
              </div>
              <button onClick={() => onNavigate(role === "assistant" ? "assistants" : role === "admin" ? "admins" : role + "s")} className="text-xs text-primary hover:underline">
                Ver todos
              </button>
            </div>
            <div className="divide-y divide-border max-h-64 overflow-y-auto">
              {members.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">Sin registros</p>
              ) : (
                members.slice(0, 5).map((member) => (
                  <div key={member.id} className="flex items-center gap-3 px-5 py-3">
                    <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center shrink-0`}>
                      <span className={`text-xs font-bold ${color}`}>{initials(member.name)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{sub(member)}</p>
                    </div>
                    <span className={cn("w-2 h-2 rounded-full shrink-0", member.status === "active" ? "bg-green-500" : "bg-destructive")} />
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Actividad Reciente</h2>
          </div>
          <button onClick={() => onNavigate("staff")} className="text-xs text-primary hover:underline">Ver todo</button>
        </div>
        <div className="divide-y divide-border">
          {staff.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No hay personal registrado</p>
          ) : (
            staff.slice(0, 5).map((member) => (
              <div key={member.id} className="flex items-center gap-3 px-5 py-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary">{initials(member.name)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.department}</p>
                </div>
                <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", getRoleColor(member.role))}>
                  {getRoleLabel(member.role)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// STAFF TABLE
// ─────────────────────────────────────────────

function StaffTable({ staff, filterRole }: { staff: StaffMember[]; filterRole?: Role }) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")

  const getRoleLabel = (role: Role) => {
    if (role === "doctor") return "Doctor"
    if (role === "admin") return "Admin"
    if (role === "patient") return "Paciente"
    return "Asistente"
  }

  const filtered = staff.filter((m) => {
    const matchRole = filterRole ? m.role === filterRole : true
    const matchSearch = [m.name, m.email, m.department].some((v) =>
      v?.toLowerCase().includes(search.toLowerCase())
    )
    const matchStatus = statusFilter === "all" ? true : m.status === statusFilter
    return matchRole && matchSearch && matchStatus
  })

  const titles: Record<string, string> = {
    doctor: "Doctores", patient: "Pacientes", assistant: "Asistentes", admin: "Administradores",
  }
  const title = filterRole ? titles[filterRole] : "Todo el Personal"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">{title}</h1>
        <p className="text-sm text-muted-foreground mt-1">Personal registrado en el sistema.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, email o departamento..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
            className="px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">Todos</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Mostrando <span className="font-semibold text-foreground">{filtered.length}</span> de{" "}
        {staff.filter((m) => (filterRole ? m.role === filterRole : true)).length} registros
      </p>

      {filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-xl py-16 text-center">
          <p className="text-muted-foreground text-sm">No se encontraron resultados.</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Personal</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Contacto</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Rol / Dpto.</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((member) => (
                  <tr key={member.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-primary">{initials(member.name)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.specialty ?? member.department}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-foreground">{member.email}</p>
                      <p className="text-xs text-muted-foreground">{member.phone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium",
                        member.role === "doctor" ? "bg-accent/10 text-accent"
                          : member.role === "admin" ? "bg-amber-500/10 text-amber-600"
                            : member.role === "patient" ? "bg-emerald-500/10 text-emerald-600"
                              : "bg-primary/10 text-primary"
                      )}>
                        {getRoleLabel(member.role)}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">{member.role === "patient" ? member.tipo_sangre : member.department}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-full font-medium",
                        member.status === "active" ? "bg-green-500/10 text-green-600" : "bg-destructive/10 text-destructive"
                      )}>
                        {member.status === "active" ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// REGISTER FORM (simplificado para evitar errores)
// ─────────────────────────────────────────────

function RegisterForm({ onRegister }: { onRegister: (member: StaffMember) => void }) {
  const [role, setRole] = useState<Role>("doctor")
  const [form, setForm] = useState({
    name: "", email: "", password: "", phone: "",
    specialty: "", department: "",
    cedula_profesional: "",
    fecha_nacimiento: "", sexo: "", curp: "", tipo_sangre: "",
    contacto_emergencia: "", telefono_contacto_emergencia: "",
  })
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState("")

  const handleRoleChange = (r: Role) => { setRole(r); setErrors({}) }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = "Nombre requerido"
    if (!form.email.trim()) e.email = "Email requerido"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email inválido"
    if (role !== "patient") {
      if (!form.password.trim()) e.password = "Password requerido"
      else if (form.password.length < 6) e.password = "Mínimo 6 caracteres"
    }
    if (!form.phone.trim()) e.phone = "Teléfono requerido"
    if (role === "doctor") {
      if (!form.specialty) e.specialty = "Especialidad requerida"
      if (!form.cedula_profesional.trim()) e.cedula_profesional = "Cédula profesional requerida"
      if (!form.department) e.department = "Departamento requerido"
    }
    if (role === "patient") {
      if (!form.fecha_nacimiento) e.fecha_nacimiento = "Fecha de nacimiento requerida"
      if (!form.sexo) e.sexo = "Sexo requerido"
      if (!form.curp.trim()) e.curp = "CURP requerido"
      if (!form.tipo_sangre) e.tipo_sangre = "Tipo de sangre requerido"
    }
    if (role === "assistant" || role === "admin") {
      if (!form.department) e.department = "Departamento requerido"
    }
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true); setApiError("")

    try {
      // Simulación de registro (en producción conectar con API real)
      const newMember: StaffMember = {
        id: Date.now().toString(),
        name: form.name,
        email: form.email,
        phone: form.phone,
        role: role,
        department: form.department || (role === "patient" ? "Pacientes" : "General"),
        status: "active",
        createdAt: new Date().toISOString().split("T")[0],
        ...(role === "doctor" && { specialty: form.specialty, cedula_profesional: form.cedula_profesional }),
        ...(role === "patient" && { fecha_nacimiento: form.fecha_nacimiento, sexo: form.sexo, curp: form.curp, tipo_sangre: form.tipo_sangre }),
      }
      onRegister(newMember)
      setForm({ name: "", email: "", password: "", phone: "", specialty: "", department: "", cedula_profesional: "", fecha_nacimiento: "", sexo: "", curp: "", tipo_sangre: "", contacto_emergencia: "", telefono_contacto_emergencia: "" })
      setErrors({})
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Error al registrar")
    } finally {
      setLoading(false)
    }
  }

  const inputClass = (field: string) =>
    cn("w-full px-3 py-2 text-sm rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition",
      errors[field] ? "border-destructive" : "border-input")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">Registrar Nuevo</h1>
        <p className="text-sm text-muted-foreground mt-1">Complete los datos para registrar un nuevo doctor, paciente o personal.</p>
      </div>

      {success && (
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-600 rounded-lg px-4 py-3 text-sm font-medium">
          <Check className="w-4 h-4 shrink-0" />Registro exitoso.
        </div>
      )}
      {apiError && (
        <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-3 text-sm font-medium">
          <X className="w-4 h-4 shrink-0" />{apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Tipo de Registro</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(["doctor", "patient", "assistant", "admin"] as Role[]).map((r) => {
              const Icon = r === "doctor" ? Stethoscope : r === "patient" ? User : r === "admin" ? Shield : HeartPulse
              const label = r === "doctor" ? "Doctor" : r === "patient" ? "Paciente" : r === "admin" ? "Administrador" : "Asistente"
              const isSelected = role === r
              return (
                <button key={r} type="button" onClick={() => handleRoleChange(r)}
                  className={cn("flex items-center gap-3 px-4 py-3.5 rounded-lg border-2 transition-all text-left",
                    isSelected ? "border-primary bg-primary/5 text-primary" : "border-border bg-background text-muted-foreground hover:border-primary/40")}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">{label}</p>
                  </div>
                  {isSelected && (
                    <div className="ml-auto w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {role !== "patient" && (
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-foreground">Credenciales de Cuenta</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Correo electrónico *</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass("email")} />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Password *</label>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputClass("password")} />
                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              </div>
            </div>
          </div>
        )}

        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Datos Personales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Nombre completo *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Teléfono *</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass("phone")} />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
            </div>
          </div>
        </div>

        {role === "doctor" && (
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-foreground">Datos del Doctor</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Especialidad *</label>
                <select value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} className={inputClass("specialty")}>
                  <option value="">Seleccionar especialidad</option>
                  {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.specialty && <p className="text-xs text-destructive">{errors.specialty}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Cédula Profesional *</label>
                <input type="text" value={form.cedula_profesional} onChange={(e) => setForm({ ...form, cedula_profesional: e.target.value })} className={inputClass("cedula_profesional")} />
                {errors.cedula_profesional && <p className="text-xs text-destructive">{errors.cedula_profesional}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Departamento *</label>
                <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className={inputClass("department")}>
                  <option value="">Seleccionar departamento</option>
                  {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                {errors.department && <p className="text-xs text-destructive">{errors.department}</p>}
              </div>
            </div>
          </div>
        )}

        {role === "patient" && (
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-foreground">Datos del Paciente</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Correo electrónico</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass("email")} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Fecha de Nacimiento *</label>
                <input type="date" value={form.fecha_nacimiento} onChange={(e) => setForm({ ...form, fecha_nacimiento: e.target.value })} className={inputClass("fecha_nacimiento")} />
                {errors.fecha_nacimiento && <p className="text-xs text-destructive">{errors.fecha_nacimiento}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Sexo *</label>
                <select value={form.sexo} onChange={(e) => setForm({ ...form, sexo: e.target.value })} className={inputClass("sexo")}>
                  <option value="">Seleccionar sexo</option>
                  {SEXOS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.sexo && <p className="text-xs text-destructive">{errors.sexo}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">CURP *</label>
                <input type="text" value={form.curp} onChange={(e) => setForm({ ...form, curp: e.target.value.toUpperCase() })} className={cn(inputClass("curp"), "uppercase")} />
                {errors.curp && <p className="text-xs text-destructive">{errors.curp}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Tipo de Sangre *</label>
                <select value={form.tipo_sangre} onChange={(e) => setForm({ ...form, tipo_sangre: e.target.value })} className={inputClass("tipo_sangre")}>
                  <option value="">Seleccionar tipo</option>
                  {BLOOD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.tipo_sangre && <p className="text-xs text-destructive">{errors.tipo_sangre}</p>}
              </div>
            </div>
          </div>
        )}

        {(role === "assistant" || role === "admin") && (
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-foreground">Datos del {role === "admin" ? "Administrador" : "Asistente"}</h2>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Departamento *</label>
              <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className={inputClass("department")}>
                <option value="">Seleccionar departamento</option>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              {errors.department && <p className="text-xs text-destructive">{errors.department}</p>}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Registrando...</> : <><UserPlus className="w-4 h-4" />Registrar</>}
        </button>
      </form>
    </div>
  )
}

// ─────────────────────────────────────────────
// INSTITUTION FORM (simplificado)
// ─────────────────────────────────────────────

type Institution = {
  id?: string
  name: string
  legalName: string
  rfc: string
  phone: string
  email: string
  institutionType: string
}

const INSTITUTION_TYPES = [
  { value: "HOSPITAL", label: "Hospital" },
  { value: "CLINIC", label: "Clínica" },
  { value: "LABORATORY", label: "Laboratorio" },
  { value: "PHARMACY", label: "Farmacia" },
  { value: "OTHER", label: "Otro" },
]

function InstitutionForm() {
  const emptyForm: Institution = { name: "", legalName: "", rfc: "", phone: "", email: "", institutionType: "CLINIC" }

  const [form, setForm] = useState<Institution>(emptyForm)
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [apiError, setApiError] = useState("")
  const [errors, setErrors] = useState<Partial<Record<keyof Institution, string>>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setErrors({ name: "Nombre requerido" }); return }
    setLoading(true); setApiError("")
    try {
      const newInst: Institution = { ...form, id: Date.now().toString() }
      setInstitutions((prev) => [newInst, ...prev])
      setForm(emptyForm)
      setErrors({})
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Error al guardar")
    } finally {
      setLoading(false)
    }
  }

  const inputClass = (field: keyof Institution) =>
    cn("w-full px-3 py-2 text-sm rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition",
      errors[field] ? "border-destructive" : "border-input")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">Institución</h1>
        <p className="text-sm text-muted-foreground mt-1">Registra nuevas instituciones médicas en el sistema.</p>
      </div>

      {success && (
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-600 rounded-lg px-4 py-3 text-sm font-medium">
          <Check className="w-4 h-4 shrink-0" />Institución registrada correctamente.
        </div>
      )}
      {apiError && (
        <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-3 text-sm font-medium">
          <X className="w-4 h-4 shrink-0" />{apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Datos de la Institución</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Nombre *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Tipo *</label>
              <select value={form.institutionType} onChange={(e) => setForm({ ...form, institutionType: e.target.value })} className={inputClass("institutionType")}>
                {INSTITUTION_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Razón Social</label>
              <input type="text" value={form.legalName} onChange={(e) => setForm({ ...form, legalName: e.target.value })} className={inputClass("legalName")} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">RFC</label>
              <input type="text" value={form.rfc} onChange={(e) => setForm({ ...form, rfc: e.target.value.toUpperCase() })} className={cn(inputClass("rfc"), "uppercase")} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Teléfono</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass("phone")} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Correo</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass("email")} />
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Registrando...</> : <><Building2 className="w-4 h-4" />Registrar Institución</>}
        </button>
      </form>
    </div>
  )
}

// ─────────────────────────────────────────────
// BRANCHES VIEW (simplificado)
// ─────────────────────────────────────────────

function BranchesView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">Sucursales</h1>
        <p className="text-sm text-muted-foreground mt-1">Gestión de sucursales - En desarrollo.</p>
      </div>
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <Building2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-muted-foreground">Módulo de sucursales en construcción.</p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// AFFILIATIONS VIEW (simplificado)
// ─────────────────────────────────────────────

function AffiliationsView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">Afiliaciones</h1>
        <p className="text-sm text-muted-foreground mt-1">Gestión de afiliaciones - En desarrollo.</p>
      </div>
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <ClipboardList className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-muted-foreground">Módulo de afiliaciones en construcción.</p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// QUICK REGISTER MODAL
// ─────────────────────────────────────────────

function QuickRegisterModal({
  isOpen,
  onClose,
  onSelect,
}: {
  isOpen: boolean
  onClose: () => void
  onSelect: (role: Role) => void
}) {
  if (!isOpen) return null

  const roles: Array<{ value: Role; label: string; icon: React.ComponentType<any> }> = [
    { value: "doctor", label: "Registrar Doctor", icon: Stethoscope },
    { value: "patient", label: "Registrar Paciente", icon: User },
    { value: "assistant", label: "Registrar Asistente", icon: HeartPulse },
    { value: "admin", label: "Registrar Administrador", icon: Shield },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">¿Qué tipo de usuario deseas registrar?</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-2">
          {roles.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => {
                onSelect(value)
                onClose()
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-border hover:bg-muted/50 hover:border-primary/30 transition-all text-left"
            >
              <Icon className="w-5 h-5 text-primary shrink-0" />
              <span className="text-sm font-medium text-foreground">{label}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// ROOT PAGE
// ─────────────────────────────────────────────

export default function AdminPage() {
  const [showQuickRegister, setShowQuickRegister] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [staff, setStaff] = useState<StaffMember[]>([])

  const router = useRouter()
  const { user, logout, isAuthenticated, loading } = useAuth()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [loading, isAuthenticated, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const handleRegister = (member: StaffMember) => setStaff((prev) => [member, ...prev])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setMobileSidebarOpen(false)
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard": return <Dashboard staff={staff} onNavigate={handleTabChange} />
      case "staff": return <StaffTable staff={staff} />
      case "doctors": return <StaffTable staff={staff} filterRole="doctor" />
      case "patients": return <StaffTable staff={staff} filterRole="patient" />
      case "assistants": return <StaffTable staff={staff} filterRole="assistant" />
      case "admins": return <StaffTable staff={staff} filterRole="admin" />
      case "register": return <RegisterForm onRegister={handleRegister} />
      case "institution": return <InstitutionForm />
      case "branches": return <BranchesView />
      case "affiliations": return <AffiliationsView />
      default: return <Dashboard staff={staff} onNavigate={handleTabChange} />
    }
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}

      <div className={cn("fixed inset-y-0 left-0 z-50 lg:relative lg:z-auto transition-transform duration-300",
        mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0")}>
        <Sidebar activeTab={activeTab} onTabChange={handleTabChange} onLogout={handleLogout} />
      </div>

      <main className="flex-1 overflow-y-auto min-w-0">
        <header className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-card border-b border-border lg:hidden">
          <button onClick={() => setMobileSidebarOpen(true)} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <Menu className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <HeartPulse className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold text-foreground">MedAdmin</span>
          </div>
          {user && (
            <div className="ml-auto text-xs text-muted-foreground">
              {user.email && <span>{user.email}</span>}
            </div>
          )}
        </header>

        <div className="max-w-6xl mx-auto p-4 lg:p-8">
          {renderContent()}
        </div>

        <QuickRegisterModal
          isOpen={showQuickRegister}
          onClose={() => setShowQuickRegister(false)}
          onSelect={(role) => {
            setActiveTab("register")
          }}
        />
      </main>
    </div>
  )
}