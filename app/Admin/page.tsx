"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
} from "lucide-react"

// ─────────────────────────────────────────────
// API CONFIG
// ─────────────────────────────────────────────
const API_BASE_URL = "http://localhost:3001/api"

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
  // Doctor fields
  cedula_profesional?: string
  // Patient fields
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
const SEXOS       = ["Masculino", "Femenino", "Otro"]

const NAV_ITEMS = [
  { id: "dashboard",    label: "Dashboard",        icon: LayoutDashboard },
  { id: "staff",        label: "Todo el Personal", icon: Users },
  { id: "doctors",      label: "Doctores",         icon: Stethoscope },
  { id: "patients",     label: "Pacientes",        icon: User },
  { id: "assistants",   label: "Asistentes",       icon: HeartPulse },
  { id: "admins",       label: "Administradores",  icon: Shield },
  { id: "register",     label: "Registrar Nuevo",  icon: UserPlus },
  { id: "institution",  label: "Institución",      icon: Building2 },
  { id: "branches",     label: "Sucursales",       icon: GitBranch },
  { id: "affiliations", label: "Afiliaciones",     icon: ClipboardList },
]

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("")
}

// ─────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────

function Sidebar({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, { method: "POST", headers: getAuthHeaders() })
    } catch { /* ignore */ }
    finally {
      localStorage.clear()
      sessionStorage.clear()
      router.replace("/login")
    }
  }

  return (
    <aside className="w-[280px] h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="flex items-center gap-4 px-6 py-5 border-b border-sidebar-border">
        <div className="w-12 h-12 rounded-2xl bg-sidebar-primary flex items-center justify-center">
          <Stethoscope className="w-5 h-5 text-sidebar-primary-foreground" />
        </div>
        <div className="leading-tight">
          <h1 className="text-lg font-bold text-sidebar-foreground tracking-tight">MediRecord</h1>
          <p className="text-[13px] text-sidebar-foreground/60 mt-[2px]">Sistema de Expedientes</p>
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
          onClick={handleLogout}
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
          // GET /api/dashboard/super-admin/summary
          fetch(`${API_BASE_URL}/dashboard/super-admin/summary`, { headers: getAuthHeaders() }),
          // GET /api/dashboard/branch/summary
          fetch(`${API_BASE_URL}/dashboard/branch/summary`, { headers: getAuthHeaders() }),
          // GET /api/dashboard/institution/summary
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

  const doctors    = staff.filter((s) => s.role === "doctor")
  const patients   = staff.filter((s) => s.role === "patient")
  const assistants = staff.filter((s) => s.role === "assistant")
  const admins     = staff.filter((s) => s.role === "admin")
  const active     = staff.filter((s) => s.status === "active")

  const stats = [
    { label: "Total Personal",         value: summary.totalUsers    || staff.length,     icon: Users,        color: "bg-primary/10 text-primary",         tab: "staff"        },
    { label: "Doctores",               value: summary.totalDoctors  || doctors.length,   icon: Stethoscope,  color: "bg-accent/10 text-accent",            tab: "doctors"      },
    { label: "Pacientes",              value: summary.totalPatients || patients.length,  icon: User,         color: "bg-emerald-500/10 text-emerald-600",  tab: "patients"     },
    { label: "Asistentes",             value: assistants.length,                         icon: HeartPulse,   color: "bg-primary/10 text-primary",          tab: "assistants"   },
    { label: "Instituciones",          value: summary.totalInstitutions || 0,            icon: Building2,    color: "bg-amber-500/10 text-amber-600",      tab: "institution"  },
    { label: "Sucursales",             value: summary.totalBranches || 0,               icon: GitBranch,    color: "bg-sky-500/10 text-sky-600",          tab: "branches"     },
    { label: "Afiliaciones pendientes",value: summary.pendingAffiliations || 0,          icon: ClipboardList,color: "bg-orange-500/10 text-orange-600",    tab: "affiliations" },
    { label: "Activos",                value: active.length,                             icon: CheckCircle,  color: "bg-green-500/10 text-green-600",      tab: "staff"        },
  ]

  const getRoleColor = (role: Role) => {
    if (role === "doctor")    return "bg-accent/10 text-accent"
    if (role === "admin")     return "bg-amber-500/10 text-amber-600"
    if (role === "patient")   return "bg-emerald-500/10 text-emerald-600"
    return "bg-primary/10 text-primary"
  }

  const getRoleLabel = (role: Role) => {
    if (role === "doctor")    return "Doctor"
    if (role === "admin")     return "Admin"
    if (role === "patient")   return "Paciente"
    return "Asistente"
  }

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

      {/* Role panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-5">
        {([
          { role: "doctor" as Role, icon: Stethoscope, color: "text-accent", bg: "bg-accent/10", members: doctors, sub: (m: StaffMember) => m.specialty },
          { role: "patient" as Role, icon: User, color: "text-emerald-600", bg: "bg-emerald-500/10", members: patients, sub: (m: StaffMember) => m.tipo_sangre },
          { role: "assistant" as Role, icon: HeartPulse, color: "text-primary", bg: "bg-primary/10", members: assistants, sub: (m: StaffMember) => m.department },
          { role: "admin" as Role, icon: Shield, color: "text-amber-600", bg: "bg-amber-500/10", members: admins, sub: (m: StaffMember) => m.department },
        ]).map(({ role, icon: Icon, color, bg, members, sub }) => (
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
                members.map((member) => (
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

      {/* Recent activity */}
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
// STAFF TABLE (read-only — no API for mutations)
// ─────────────────────────────────────────────

function StaffTable({ staff, filterRole }: { staff: StaffMember[]; filterRole?: Role }) {
  const [search, setSearch]             = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")

  const filtered = staff.filter((m) => {
    const matchRole   = filterRole ? m.role === filterRole : true
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
                        member.role === "doctor"  ? "bg-accent/10 text-accent"
                        : member.role === "admin" ? "bg-amber-500/10 text-amber-600"
                        : member.role === "patient" ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-primary/10 text-primary"
                      )}>
                        {member.role === "doctor" ? "Doctor" : member.role === "admin" ? "Admin" : member.role === "patient" ? "Paciente" : "Asistente"}
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
// REGISTER FORM
// ─────────────────────────────────────────────

function RegisterForm({ onRegister }: { onRegister: (member: StaffMember) => void }) {
  const [role, setRole] = useState<Role>("doctor")
  const [form, setForm] = useState({
    name: "", email: "", password: "", phone: "",
    specialty: "", department: "",
    // Doctor
    cedula_profesional: "",
    // Patient
    fecha_nacimiento: "", sexo: "", curp: "", tipo_sangre: "",
    contacto_emergencia: "", telefono_contacto_emergencia: "",
  })
  const [success, setSuccess] = useState(false)
  const [errors, setErrors]   = useState<Record<string, string>>({})
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
      if (!form.contacto_emergencia.trim()) e.contacto_emergencia = "Contacto de emergencia requerido"
      if (!form.telefono_contacto_emergencia.trim()) e.telefono_contacto_emergencia = "Teléfono de emergencia requerido"
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
      if (role === "doctor") {
        // POST /api/auth/register — DOCTOR
        const res = await fetch(`${API_BASE_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email, password: form.password, role: "DOCTOR",
            firstName: form.name.split(" ")[0],
            lastName:  form.name.split(" ").slice(1).join(" ") || form.name.split(" ")[0],
            cedula: form.cedula_profesional,
          }),
        })
        if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.message || "Error al registrar doctor") }
        const userData = await res.json()
        onRegister({ id: userData.data?.id || Date.now().toString(), user_id: userData.data?.id, name: form.name, email: form.email, phone: form.phone, role, specialty: form.specialty, department: form.department, status: "active", createdAt: new Date().toISOString().split("T")[0] })

      } else if (role === "patient") {
        // POST /api/patients
        const payload: Record<string, unknown> = {
          firstName: form.name.split(" ")[0],
          lastName:  form.name.split(" ").slice(1).join(" ") || form.name.split(" ")[0],
          birthDate: form.fecha_nacimiento,
          gender: form.sexo === "Masculino" ? "MALE" : form.sexo === "Femenino" ? "FEMALE" : "OTHER",
        }
        if (form.tipo_sangre)                    payload.bloodType              = form.tipo_sangre
        if (form.contacto_emergencia)            payload.emergencyContactName   = form.contacto_emergencia
        if (form.telefono_contacto_emergencia)   payload.emergencyContactPhone  = form.telefono_contacto_emergencia
        if (form.curp)                           { payload.nationalId = form.curp; payload.nationalIdType = "CURP" }

        const res = await fetch(`${API_BASE_URL}/patients`, { method: "POST", headers: getAuthHeaders(), body: JSON.stringify(payload) })
        if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.message || "Error al crear paciente") }
        const patientData = await res.json()
        onRegister({ id: patientData.data?.id || Date.now().toString(), name: form.name, email: form.email, phone: form.phone, role, department: "Pacientes", status: "active", createdAt: new Date().toISOString().split("T")[0] })

      } else if (role === "assistant") {
        // POST /api/auth/register — SECRETARY, then POST /api/staff
        const regRes = await fetch(`${API_BASE_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, password: form.password, role: "SECRETARY", firstName: form.name.split(" ")[0], lastName: form.name.split(" ").slice(1).join(" ") || form.name.split(" ")[0] }),
        })
        if (!regRes.ok) { const d = await regRes.json().catch(() => ({})); throw new Error(d.message || "Error al registrar asistente") }
        const regData  = await regRes.json()
        const userId   = regData.data?.id

        const staffPayload: Record<string, unknown> = { userId, firstName: form.name.split(" ")[0], lastName: form.name.split(" ").slice(1).join(" ") || form.name.split(" ")[0], staffRole: "SECRETARY" }
        if (form.phone) staffPayload.phone = form.phone

        // POST /api/staff
        const staffRes = await fetch(`${API_BASE_URL}/staff`, { method: "POST", headers: getAuthHeaders(), body: JSON.stringify(staffPayload) })
        if (!staffRes.ok) { const d = await staffRes.json().catch(() => ({})); throw new Error(d.message || "Error al crear staff") }
        const staffData = await staffRes.json()
        onRegister({ id: staffData.data?.id || userId || Date.now().toString(), user_id: userId, name: form.name, email: form.email, phone: form.phone, role, department: form.department, status: "active", createdAt: new Date().toISOString().split("T")[0] })

      } else if (role === "admin") {
        // POST /api/auth/register — INSTITUTION_ADMIN
        const res = await fetch(`${API_BASE_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, password: form.password, role: "INSTITUTION_ADMIN", firstName: form.name.split(" ")[0], lastName: form.name.split(" ").slice(1).join(" ") || form.name.split(" ")[0] }),
        })
        if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.message || "Error al registrar administrador") }
        const userData = await res.json()
        onRegister({ id: userData.data?.id || Date.now().toString(), user_id: userData.data?.id, name: form.name, email: form.email, phone: form.phone, role, department: form.department, status: "active", createdAt: new Date().toISOString().split("T")[0] })
      }

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
        {/* Role selector */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Tipo de Registro</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(["doctor", "patient", "assistant", "admin"] as Role[]).map((r) => {
              const Icon = r === "doctor" ? Stethoscope : r === "patient" ? User : r === "admin" ? Shield : HeartPulse
              const label = r === "doctor" ? "Doctor" : r === "patient" ? "Paciente" : r === "admin" ? "Administrador" : "Asistente"
              const desc  = r === "doctor" ? "Médico especialista" : r === "patient" ? "Paciente del sistema" : r === "admin" ? "Control total" : "Personal de apoyo"
              const isSelected = role === r
              return (
                <button key={r} type="button" onClick={() => handleRoleChange(r)}
                  className={cn("flex items-center gap-3 px-4 py-3.5 rounded-lg border-2 transition-all text-left",
                    isSelected ? "border-primary bg-primary/5 text-primary" : "border-border bg-background text-muted-foreground hover:border-primary/40")}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">{label}</p>
                    <p className="text-xs opacity-70">{desc}</p>
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

        {/* Credentials — not needed for patients */}
        {role !== "patient" && (
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-foreground">Credenciales de Cuenta</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Correo electrónico *</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="correo@ejemplo.com" className={inputClass("email")} />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Password *</label>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Mínimo 6 caracteres" className={inputClass("password")} />
                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Personal data */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Datos Personales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Nombre completo *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej. Juan García López" className={inputClass("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Teléfono *</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+52 55 0000-0000" className={inputClass("phone")} />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
            </div>
          </div>
        </div>

        {/* Doctor fields */}
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
                <input type="text" value={form.cedula_profesional} onChange={(e) => setForm({ ...form, cedula_profesional: e.target.value })} placeholder="Ej. 12345678" className={inputClass("cedula_profesional")} />
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

        {/* Patient fields */}
        {role === "patient" && (
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-foreground">Datos del Paciente</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Correo electrónico</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="correo@ejemplo.com" className={inputClass("email")} />
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
                <input type="text" value={form.curp} onChange={(e) => setForm({ ...form, curp: e.target.value.toUpperCase() })} placeholder="AAAA000000AAAAAA00" maxLength={18} className={cn(inputClass("curp"), "uppercase")} />
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
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Contacto de Emergencia *</label>
                <input type="text" value={form.contacto_emergencia} onChange={(e) => setForm({ ...form, contacto_emergencia: e.target.value })} placeholder="Nombre del contacto" className={inputClass("contacto_emergencia")} />
                {errors.contacto_emergencia && <p className="text-xs text-destructive">{errors.contacto_emergencia}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Teléfono de Emergencia *</label>
                <input type="tel" value={form.telefono_contacto_emergencia} onChange={(e) => setForm({ ...form, telefono_contacto_emergencia: e.target.value })} placeholder="+52 55 0000-0000" className={inputClass("telefono_contacto_emergencia")} />
                {errors.telefono_contacto_emergencia && <p className="text-xs text-destructive">{errors.telefono_contacto_emergencia}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Assistant / Admin department */}
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
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <><div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />Registrando...</>
          ) : (
            <><UserPlus className="w-4 h-4" />Registrar {role === "doctor" ? "Doctor" : role === "patient" ? "Paciente" : role === "admin" ? "Administrador" : "Asistente"}</>
          )}
        </button>
      </form>
    </div>
  )
}

// ─────────────────────────────────────────────
// INSTITUTION FORM
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
  { value: "HOSPITAL",   label: "Hospital"   },
  { value: "CLINIC",     label: "Clínica"    },
  { value: "LABORATORY", label: "Laboratorio" },
  { value: "PHARMACY",   label: "Farmacia"   },
  { value: "OTHER",      label: "Otro"       },
]

function InstitutionForm() {
  const emptyForm: Institution = { name: "", legalName: "", rfc: "", phone: "", email: "", institutionType: "CLINIC" }

  const [form, setForm]             = useState<Institution>(emptyForm)
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [loading, setLoading]       = useState(false)
  const [fetching, setFetching]     = useState(true)
  const [success, setSuccess]       = useState(false)
  const [apiError, setApiError]     = useState("")
  const [errors, setErrors]         = useState<Partial<Record<keyof Institution, string>>>({})

  useEffect(() => {
    const load = async () => {
      try {
        // GET /api/institutions
        const res = await fetch(`${API_BASE_URL}/institutions`, { headers: getAuthHeaders() })
        if (res.ok) {
          const data = await res.json()
          setInstitutions(Array.isArray(data) ? data : (data.data ?? []))
        }
      } catch { /* ignore */ }
      finally { setFetching(false) }
    }
    load()
  }, [])

  const validate = () => {
    const e: Partial<Record<keyof Institution, string>> = {}
    if (!form.name.trim()) e.name = "Nombre requerido"
    if (!form.institutionType) e.institutionType = "Tipo requerido"
    if (form.rfc && !/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/.test(form.rfc.toUpperCase())) e.rfc = "RFC con formato inválido"
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Correo inválido"
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true); setApiError("")

    try {
      // POST /api/institutions
      const payload: Record<string, unknown> = { name: form.name, institutionType: form.institutionType }
      if (form.legalName) payload.legalName = form.legalName
      if (form.rfc)       payload.rfc       = form.rfc.toUpperCase()
      if (form.phone)     payload.phone     = form.phone
      if (form.email)     payload.email     = form.email

      const res = await fetch(`${API_BASE_URL}/institutions`, { method: "POST", headers: getAuthHeaders(), body: JSON.stringify(payload) })
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.message || "Error al registrar institución") }

      const saved = await res.json()
      setInstitutions((prev) => [saved.data ?? saved, ...prev])
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
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej. Hospital Central" className={inputClass("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Tipo *</label>
              <select value={form.institutionType} onChange={(e) => setForm({ ...form, institutionType: e.target.value })} className={inputClass("institutionType")}>
                {INSTITUTION_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              {errors.institutionType && <p className="text-xs text-destructive">{errors.institutionType}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Razón Social</label>
              <input type="text" value={form.legalName} onChange={(e) => setForm({ ...form, legalName: e.target.value })} placeholder="Ej. Hospital Central S.A. de C.V." className={inputClass("legalName")} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">RFC</label>
              <input type="text" value={form.rfc} onChange={(e) => setForm({ ...form, rfc: e.target.value.toUpperCase() })} placeholder="Ej. HCO123456AA1" maxLength={13} className={cn(inputClass("rfc"), "uppercase")} />
              {errors.rfc && <p className="text-xs text-destructive">{errors.rfc}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Teléfono</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+52 55 0000-0000" className={inputClass("phone")} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Correo</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="contacto@hospital.mx" className={inputClass("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <><div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />Registrando...</>
            : <><Building2 className="w-4 h-4" />Registrar Institución</>}
        </button>
      </form>

      {/* List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Instituciones Registradas</h2>
          {!fetching && <span className="text-xs text-muted-foreground">{institutions.length} registros</span>}
        </div>

        {fetching ? (
          <div className="bg-card border border-border rounded-xl py-10 flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            <span className="text-sm text-muted-foreground">Cargando instituciones...</span>
          </div>
        ) : institutions.length === 0 ? (
          <div className="bg-card border border-border rounded-xl py-16 text-center">
            <Building2 className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No hay instituciones registradas aún.</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Institución</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Tipo</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">RFC</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Contacto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {institutions.map((inst, i) => (
                    <tr key={inst.id ?? i} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Building2 className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{inst.name}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">{inst.legalName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-xs bg-muted px-2 py-1 rounded font-medium">{inst.institutionType}</span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        {inst.rfc ? <span className="font-mono text-xs bg-muted px-2 py-1 rounded">{inst.rfc}</span> : <span className="text-xs text-muted-foreground">—</span>}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <p className="text-xs text-foreground">{inst.email}</p>
                        <p className="text-xs text-muted-foreground">{inst.phone}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// BRANCHES VIEW
// ─────────────────────────────────────────────

type Branch = { id: string; name: string; phone?: string; email?: string; institutionId?: string; institutionName?: string }

function BranchesView() {
  const [branches, setBranches]           = useState<Branch[]>([])
  const [institutions, setInstitutions]   = useState<{ id: string; name: string }[]>([])
  const [submitting, setSubmitting]       = useState(false)
  const [assignLoading, setAssignLoading] = useState(false)
  const [branchUserLoading, setBranchUserLoading] = useState(false)
  const [success, setSuccess]             = useState("")
  const [apiError, setApiError]           = useState("")

  const emptyBranchForm = { institutionId: "", name: "", phone: "", email: "" }
  const [branchForm, setBranchForm]       = useState(emptyBranchForm)
  const [branchErrors, setBranchErrors]   = useState<Record<string, string>>({})
  const [assignForm, setAssignForm]       = useState({ staffId: "", branchId: "" })
  const [branchUserForm, setBranchUserForm] = useState({ branchId: "", userId: "", role: "BRANCH_ADMIN" })

  useEffect(() => {
    fetch(`${API_BASE_URL}/institutions`, { headers: getAuthHeaders() })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setInstitutions((Array.isArray(d) ? d : d.data ?? []).map((i: Record<string, unknown>) => ({ id: i.id as string, name: i.name as string }))) })
      .catch(() => {})
  }, [])

  const showSuccess = (msg: string) => { setSuccess(msg); setTimeout(() => setSuccess(""), 3000) }

  const handleCreateBranch = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!branchForm.institutionId) errs.institutionId = "Selecciona una institución"
    if (!branchForm.name.trim()) errs.name = "Nombre de sucursal requerido"
    if (Object.keys(errs).length) { setBranchErrors(errs); return }
    setSubmitting(true); setApiError("")
    try {
      const payload: Record<string, unknown> = { name: branchForm.name }
      if (branchForm.phone) payload.phone = branchForm.phone
      if (branchForm.email) payload.email = branchForm.email
      // POST /api/institutions/:id/branches
      const res = await fetch(`${API_BASE_URL}/institutions/${branchForm.institutionId}/branches`, { method: "POST", headers: getAuthHeaders(), body: JSON.stringify(payload) })
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.message || "Error al crear sucursal") }
      const data = await res.json()
      const nb   = data.data ?? data
      setBranches(prev => [{ id: nb.id, name: nb.name, phone: nb.phone, email: nb.email, institutionId: branchForm.institutionId, institutionName: institutions.find(i => i.id === branchForm.institutionId)?.name }, ...prev])
      setBranchForm(emptyBranchForm); setBranchErrors({})
      showSuccess("Sucursal creada correctamente.")
    } catch (err) { setApiError(err instanceof Error ? err.message : "Error al crear sucursal") }
    finally { setSubmitting(false) }
  }

  const handleAssignStaff = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!assignForm.staffId.trim() || !assignForm.branchId.trim()) { setApiError("Staff ID y Branch ID son requeridos"); return }
    setAssignLoading(true); setApiError("")
    try {
      // POST /api/staff/assignments/branches
      const res = await fetch(`${API_BASE_URL}/staff/assignments/branches`, { method: "POST", headers: getAuthHeaders(), body: JSON.stringify({ staffId: assignForm.staffId, branchId: assignForm.branchId }) })
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.message || "Error al asignar staff") }
      setAssignForm({ staffId: "", branchId: "" })
      showSuccess("Staff asignado a sucursal correctamente.")
    } catch (err) { setApiError(err instanceof Error ? err.message : "Error al asignar") }
    finally { setAssignLoading(false) }
  }

  const handleAddBranchUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!branchUserForm.branchId.trim() || !branchUserForm.userId.trim()) { setApiError("Branch ID y User ID son requeridos"); return }
    setBranchUserLoading(true); setApiError("")
    try {
      // POST /api/institutions/branches/:id/users
      const res = await fetch(`${API_BASE_URL}/institutions/branches/${branchUserForm.branchId}/users`, { method: "POST", headers: getAuthHeaders(), body: JSON.stringify({ userId: branchUserForm.userId, role: branchUserForm.role }) })
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.message || "Error al agregar usuario a sucursal") }
      setBranchUserForm({ branchId: "", userId: "", role: "BRANCH_ADMIN" })
      showSuccess("Usuario agregado a sucursal correctamente.")
    } catch (err) { setApiError(err instanceof Error ? err.message : "Error al agregar usuario") }
    finally { setBranchUserLoading(false) }
  }

  const inputCls = "w-full px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">Sucursales</h1>
        <p className="text-sm text-muted-foreground mt-1">Crea sucursales, asigna staff y agrega usuarios.</p>
      </div>

      {success  && <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-600 rounded-lg px-4 py-3 text-sm font-medium"><Check className="w-4 h-4 shrink-0" />{success}</div>}
      {apiError && <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-3 text-sm font-medium"><X className="w-4 h-4 shrink-0" />{apiError}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create branch */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Nueva Sucursal</h2>
          </div>
          <form onSubmit={handleCreateBranch} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Institución *</label>
              <select value={branchForm.institutionId} onChange={e => setBranchForm({ ...branchForm, institutionId: e.target.value })}
                className={cn(inputCls, branchErrors.institutionId ? "border-destructive" : "")}>
                <option value="">Seleccionar institución</option>
                {institutions.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
              </select>
              {branchErrors.institutionId && <p className="text-xs text-destructive">{branchErrors.institutionId}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Nombre *</label>
              <input type="text" value={branchForm.name} onChange={e => setBranchForm({ ...branchForm, name: e.target.value })} placeholder="Ej. Sucursal Norte"
                className={cn(inputCls, branchErrors.name ? "border-destructive" : "")} />
              {branchErrors.name && <p className="text-xs text-destructive">{branchErrors.name}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Teléfono</label>
                <input type="tel" value={branchForm.phone} onChange={e => setBranchForm({ ...branchForm, phone: e.target.value })} placeholder="+52 55 0000-0000" className={inputCls} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Correo</label>
                <input type="email" value={branchForm.email} onChange={e => setBranchForm({ ...branchForm, email: e.target.value })} placeholder="sucursal@clinica.mx" className={inputCls} />
              </div>
            </div>
            <button type="submit" disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50">
              {submitting ? <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <Plus className="w-4 h-4" />}
              Crear Sucursal
            </button>
          </form>
        </div>

        {/* Assign staff */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-semibold text-foreground">Asignar Staff a Sucursal</h2>
          </div>
          <form onSubmit={handleAssignStaff} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Staff ID *</label>
              <input type="text" value={assignForm.staffId} onChange={e => setAssignForm({ ...assignForm, staffId: e.target.value })} placeholder="ID del miembro de staff" className={inputCls} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Branch ID *</label>
              <input type="text" value={assignForm.branchId} onChange={e => setAssignForm({ ...assignForm, branchId: e.target.value })} placeholder="ID de la sucursal" className={inputCls} />
            </div>
            <button type="submit" disabled={assignLoading}
              className="w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50">
              {assignLoading ? <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" /> : <UserCheck className="w-4 h-4" />}
              Asignar Staff
            </button>
          </form>
        </div>

        {/* Add user to branch */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-semibold text-foreground">Agregar Usuario a Sucursal</h2>
          </div>
          <form onSubmit={handleAddBranchUser} className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Branch ID *</label>
              <input type="text" value={branchUserForm.branchId} onChange={e => setBranchUserForm({ ...branchUserForm, branchId: e.target.value })} placeholder="ID de la sucursal" className={inputCls} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">User ID *</label>
              <input type="text" value={branchUserForm.userId} onChange={e => setBranchUserForm({ ...branchUserForm, userId: e.target.value })} placeholder="ID del usuario" className={inputCls} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Rol</label>
              <select value={branchUserForm.role} onChange={e => setBranchUserForm({ ...branchUserForm, role: e.target.value })} className={inputCls}>
                <option value="BRANCH_ADMIN">BRANCH_ADMIN</option>
                <option value="DOCTOR">DOCTOR</option>
                <option value="SECRETARY">SECRETARY</option>
              </select>
            </div>
            <div className="md:col-span-3">
              <button type="submit" disabled={branchUserLoading}
                className="flex items-center justify-center gap-2 bg-amber-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50">
                {branchUserLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <UserPlus className="w-4 h-4" />}
                Agregar a Sucursal
              </button>
            </div>
          </form>
        </div>
      </div>

      {branches.length > 0 && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-border bg-muted/30">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Sucursales Creadas Esta Sesión</p>
          </div>
          <div className="divide-y divide-border">
            {branches.map(b => (
              <div key={b.id} className="flex items-center gap-4 px-5 py-3">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center shrink-0">
                  <GitBranch className="w-4 h-4 text-sky-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{b.name}</p>
                  <p className="text-xs text-muted-foreground">{b.institutionName} · {b.email || b.phone || "Sin contacto"}</p>
                </div>
                <span className="font-mono text-xs bg-muted px-2 py-1 rounded text-muted-foreground">{b.id}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// AFFILIATIONS VIEW
// ─────────────────────────────────────────────

type Affiliation = {
  id: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  patientName?: string
  institutionName?: string
  createdAt?: string
  reason?: string
}

function AffiliationsView() {
  const [affiliations, setAffiliations]   = useState<Affiliation[]>([])
  const [loading, setLoading]             = useState(true)
  const [success, setSuccess]             = useState("")
  const [apiError, setApiError]           = useState("")
  const [rejectId, setRejectId]           = useState<string | null>(null)
  const [rejectReason, setRejectReason]   = useState("")
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [instUserForm, setInstUserForm]   = useState({ institutionId: "", userId: "", role: "INSTITUTION_ADMIN" })
  const [instUserLoading, setInstUserLoading] = useState(false)

  useEffect(() => {
    // GET /api/affiliations
    fetch(`${API_BASE_URL}/affiliations`, { headers: getAuthHeaders() })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setAffiliations(Array.isArray(d) ? d : (d.data ?? [])) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const showSuccess = (msg: string) => { setSuccess(msg); setTimeout(() => setSuccess(""), 3000) }

  const handleApprove = async (id: string) => {
    setActionLoading(id); setApiError("")
    try {
      // POST /api/affiliations/:id/approve
      const res = await fetch(`${API_BASE_URL}/affiliations/${id}/approve`, { method: "POST", headers: getAuthHeaders() })
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.message || "Error al aprobar") }
      setAffiliations(prev => prev.map(a => a.id === id ? { ...a, status: "APPROVED" as const } : a))
      showSuccess("Afiliación aprobada correctamente.")
    } catch (err) { setApiError(err instanceof Error ? err.message : "Error al aprobar") }
    finally { setActionLoading(null) }
  }

  const handleReject = async (id: string) => {
    if (!rejectReason.trim()) { setApiError("El motivo de rechazo es requerido"); return }
    setActionLoading(id); setApiError("")
    try {
      // POST /api/affiliations/:id/reject
      const res = await fetch(`${API_BASE_URL}/affiliations/${id}/reject`, { method: "POST", headers: getAuthHeaders(), body: JSON.stringify({ reason: rejectReason }) })
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.message || "Error al rechazar") }
      setAffiliations(prev => prev.map(a => a.id === id ? { ...a, status: "REJECTED" as const, reason: rejectReason } : a))
      setRejectId(null); setRejectReason("")
      showSuccess("Afiliación rechazada.")
    } catch (err) { setApiError(err instanceof Error ? err.message : "Error al rechazar") }
    finally { setActionLoading(null) }
  }

  const handleAddInstUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!instUserForm.institutionId.trim() || !instUserForm.userId.trim()) { setApiError("Institution ID y User ID son requeridos"); return }
    setInstUserLoading(true); setApiError("")
    try {
      // POST /api/institutions/:id/users
      const res = await fetch(`${API_BASE_URL}/institutions/${instUserForm.institutionId}/users`, { method: "POST", headers: getAuthHeaders(), body: JSON.stringify({ userId: instUserForm.userId, role: instUserForm.role }) })
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.message || "Error al agregar usuario") }
      setInstUserForm({ institutionId: "", userId: "", role: "INSTITUTION_ADMIN" })
      showSuccess("Usuario agregado a institución correctamente.")
    } catch (err) { setApiError(err instanceof Error ? err.message : "Error al agregar usuario") }
    finally { setInstUserLoading(false) }
  }

  const statusColor = (s: Affiliation["status"]) =>
    s === "APPROVED" ? "bg-green-500/10 text-green-600" : s === "REJECTED" ? "bg-destructive/10 text-destructive" : "bg-amber-500/10 text-amber-600"
  const statusLabel = (s: Affiliation["status"]) =>
    s === "APPROVED" ? "Aprobada" : s === "REJECTED" ? "Rechazada" : "Pendiente"

  const inputCls = "w-full px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">Afiliaciones</h1>
        <p className="text-sm text-muted-foreground mt-1">Aprueba o rechaza solicitudes. Agrega usuarios a instituciones.</p>
      </div>

      {success  && <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-600 rounded-lg px-4 py-3 text-sm font-medium"><Check className="w-4 h-4 shrink-0" />{success}</div>}
      {apiError && <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-3 text-sm font-medium"><X className="w-4 h-4 shrink-0" />{apiError}</div>}

      {/* Add institution user */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Agregar Usuario a Institución</h2>
        </div>
        <form onSubmit={handleAddInstUser} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Institution ID *</label>
            <input type="text" value={instUserForm.institutionId} onChange={e => setInstUserForm({ ...instUserForm, institutionId: e.target.value })} placeholder="ID de la institución" className={inputCls} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">User ID *</label>
            <input type="text" value={instUserForm.userId} onChange={e => setInstUserForm({ ...instUserForm, userId: e.target.value })} placeholder="ID del usuario" className={inputCls} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Rol</label>
            <select value={instUserForm.role} onChange={e => setInstUserForm({ ...instUserForm, role: e.target.value })} className={inputCls}>
              <option value="INSTITUTION_ADMIN">INSTITUTION_ADMIN</option>
              <option value="DOCTOR">DOCTOR</option>
              <option value="SECRETARY">SECRETARY</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <button type="submit" disabled={instUserLoading}
              className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50">
              {instUserLoading ? <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <UserPlus className="w-4 h-4" />}
              Agregar a Institución
            </button>
          </div>
        </form>
      </div>

      {/* Affiliations list */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Solicitudes de Afiliación</h2>
        </div>

        {loading ? (
          <div className="py-10 flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            <span className="text-sm text-muted-foreground">Cargando afiliaciones...</span>
          </div>
        ) : affiliations.length === 0 ? (
          <div className="py-16 text-center">
            <ClipboardList className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No hay afiliaciones registradas.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {affiliations.map(aff => (
              <div key={aff.id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-foreground truncate">{aff.patientName || `Afiliación ${aff.id}`}</p>
                      <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", statusColor(aff.status))}>{statusLabel(aff.status)}</span>
                    </div>
                    {aff.institutionName && <p className="text-xs text-muted-foreground mt-0.5">{aff.institutionName}</p>}
                    {aff.createdAt && <p className="text-xs text-muted-foreground">{aff.createdAt}</p>}
                    {aff.status === "REJECTED" && aff.reason && <p className="text-xs text-destructive mt-1">Motivo: {aff.reason}</p>}
                  </div>

                  {aff.status === "PENDING" && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => handleApprove(aff.id)} disabled={actionLoading === aff.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-600 hover:bg-green-500/20 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50">
                        {actionLoading === aff.id ? <div className="w-3 h-3 border-2 border-green-600/30 border-t-green-600 rounded-full animate-spin" /> : <UserCheck className="w-3.5 h-3.5" />}
                        Aprobar
                      </button>
                      <button onClick={() => { setRejectId(aff.id); setRejectReason(""); setApiError("") }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-lg text-xs font-semibold transition-colors">
                        <UserX className="w-3.5 h-3.5" />Rechazar
                      </button>
                    </div>
                  )}
                </div>

                {rejectId === aff.id && (
                  <div className="mt-3 flex gap-2">
                    <input type="text" value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Motivo del rechazo..."
                      className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                    <button onClick={() => handleReject(aff.id)} disabled={actionLoading === aff.id}
                      className="px-3 py-1.5 bg-destructive text-destructive-foreground rounded-lg text-xs font-semibold hover:bg-destructive/90 transition-colors disabled:opacity-50">
                      Confirmar
                    </button>
                    <button onClick={() => { setRejectId(null); setRejectReason("") }}
                      className="px-3 py-1.5 bg-muted text-muted-foreground rounded-lg text-xs font-semibold hover:bg-border transition-colors">
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// ROOT PAGE
// ─────────────────────────────────────────────

export default function AdminPage() {
  const [activeTab, setActiveTab]             = useState("dashboard")
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [staff, setStaff]                     = useState<StaffMember[]>([])

  useEffect(() => {
    // GET /api/staff
    fetch(`${API_BASE_URL}/staff`, { headers: getAuthHeaders() })
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (!d) return
        const list = Array.isArray(d.data ?? d) ? (d.data ?? d) : []
        setStaff(list.map((m: Record<string, unknown>) => ({
          id: m.id as string,
          user_id: m.userId as string,
          name: `${m.firstName || ""} ${m.lastName || ""}`.trim(),
          email: (m.user as Record<string, unknown>)?.email as string || "",
          phone: m.phone as string || "",
          role: "assistant" as Role,
          department: m.staffRole as string || "General",
          status: "active" as const,
          createdAt: (m.createdAt as string)?.split("T")[0] || new Date().toISOString().split("T")[0],
        })))
      })
      .catch(() => {})
  }, [])

  const handleRegister  = (member: StaffMember) => setStaff((prev) => [member, ...prev])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setMobileSidebarOpen(false)
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":    return <Dashboard staff={staff} onNavigate={handleTabChange} />
      case "staff":        return <StaffTable staff={staff} />
      case "doctors":      return <StaffTable staff={staff} filterRole="doctor" />
      case "patients":     return <StaffTable staff={staff} filterRole="patient" />
      case "assistants":   return <StaffTable staff={staff} filterRole="assistant" />
      case "admins":       return <StaffTable staff={staff} filterRole="admin" />
      case "register":     return <RegisterForm onRegister={handleRegister} />
      case "institution":  return <InstitutionForm />
      case "branches":     return <BranchesView />
      case "affiliations": return <AffiliationsView />
      default:             return <Dashboard staff={staff} onNavigate={handleTabChange} />
    }
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}

      <div className={cn("fixed inset-y-0 left-0 z-50 lg:relative lg:z-auto transition-transform duration-300",
        mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0")}>
        <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
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
        </header>

        <div className="max-w-6xl mx-auto p-4 lg:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}
