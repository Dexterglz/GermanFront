"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation";
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
  Pencil,
  Trash2,
  Power,
  Check,
  X,
  Save,
  TrendingUp,
  CheckCircle,
  XCircle,
  Menu,
  Sun,
  Monitor,
  Moon,
  Settings,
  ChevronRightIcon,

} from "lucide-react"

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

type Role = "doctor" | "assistant" | "admin" | "patient"

type Permission = {
  id: string
  label: string
  description: string
  category: string
}

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
  permissions: Record<string, boolean>
  createdAt: string
  // Doctor fields
  cedula_profesional?: string
  consultorio?: string
  correo_profesional?: string
  // Patient fields
  fecha_nacimiento?: string
  sexo?: string
  curp?: string
  direccion?: string
  tipo_sangre?: string
  alergias?: string
  contacto_emergencia?: string
  telefono_contacto_emergencia?: string
}

// ─────────────────────────────────────────────
// PERMISSIONS DATA
// ─────────────────────────────────────────────

const DOCTOR_PERMISSIONS: Permission[] = [
  { id: "view_patients",       label: "Ver pacientes",        description: "Acceso a la lista de pacientes",       category: "Pacientes" },
  { id: "edit_patients",       label: "Editar pacientes",     description: "Modificar datos de pacientes",         category: "Pacientes" },
  { id: "delete_patients",     label: "Eliminar pacientes",   description: "Dar de baja pacientes",                category: "Pacientes" },
  { id: "create_appointments", label: "Crear citas",          description: "Agendar nuevas citas",                 category: "Citas" },
  { id: "view_appointments",   label: "Ver citas",            description: "Visualizar agenda de citas",           category: "Citas" },
  { id: "cancel_appointments", label: "Cancelar citas",       description: "Cancelar citas programadas",           category: "Citas" },
  { id: "create_prescriptions",label: "Emitir recetas",       description: "Generar recetas médicas",              category: "Prescripciones" },
  { id: "view_medical_records",label: "Ver expedientes",      description: "Acceso a expedientes médicos",         category: "Expedientes" },
  { id: "edit_medical_records",label: "Editar expedientes",   description: "Modificar expedientes médicos",        category: "Expedientes" },
  { id: "view_reports",        label: "Ver reportes",         description: "Acceso a reportes clínicos",           category: "Reportes" },
  { id: "export_reports",      label: "Exportar reportes",    description: "Descargar reportes en PDF/Excel",      category: "Reportes" },
  { id: "manage_staff",        label: "Gestionar personal",   description: "Administrar equipo médico",            category: "Administración" },
]

const ASSISTANT_PERMISSIONS: Permission[] = [
  { id: "view_patients",       label: "Ver pacientes",        description: "Acceso a la lista de pacientes",       category: "Pacientes" },
  { id: "edit_patients",       label: "Editar pacientes",     description: "Modificar datos de pacientes",         category: "Pacientes" },
  { id: "create_appointments", label: "Crear citas",          description: "Agendar nuevas citas",                 category: "Citas" },
  { id: "view_appointments",   label: "Ver citas",            description: "Visualizar agenda de citas",           category: "Citas" },
  { id: "cancel_appointments", label: "Cancelar citas",       description: "Cancelar citas programadas",           category: "Citas" },
  { id: "view_medical_records",label: "Ver expedientes",      description: "Solo lectura de expedientes",          category: "Expedientes" },
  { id: "manage_billing",      label: "Gestionar facturación",description: "Administrar cobros y pagos",           category: "Facturación" },
  { id: "send_reminders",      label: "Enviar recordatorios", description: "Notificar a pacientes",                category: "Comunicación" },
  { id: "view_reports",        label: "Ver reportes",         description: "Acceso a reportes básicos",            category: "Reportes" },
]

const ADMIN_PERMISSIONS: Permission[] = [
  { id: "view_patients",       label: "Ver pacientes",        description: "Acceso a la lista de pacientes",       category: "Pacientes" },
  { id: "edit_patients",       label: "Editar pacientes",     description: "Modificar datos de pacientes",         category: "Pacientes" },
  { id: "delete_patients",     label: "Eliminar pacientes",   description: "Dar de baja pacientes",                category: "Pacientes" },
  { id: "create_appointments", label: "Crear citas",          description: "Agendar nuevas citas",                 category: "Citas" },
  { id: "view_appointments",   label: "Ver citas",            description: "Visualizar agenda de citas",           category: "Citas" },
  { id: "cancel_appointments", label: "Cancelar citas",       description: "Cancelar citas programadas",           category: "Citas" },
  { id: "view_medical_records",label: "Ver expedientes",      description: "Acceso a expedientes médicos",         category: "Expedientes" },
  { id: "manage_billing",      label: "Gestionar facturación",description: "Administrar cobros y pagos",           category: "Facturación" },
  { id: "view_reports",        label: "Ver reportes",         description: "Acceso a reportes del sistema",        category: "Reportes" },
  { id: "export_reports",      label: "Exportar reportes",    description: "Descargar reportes en PDF/Excel",      category: "Reportes" },
  { id: "manage_staff",        label: "Gestionar personal",   description: "Administrar todo el personal",         category: "Administración" },
  { id: "system_settings",     label: "Config. del sistema",  description: "Modificar ajustes del sistema",        category: "Administración" },
  { id: "manage_roles",        label: "Gestionar roles",      description: "Crear y editar roles y permisos",      category: "Administración" },
]

const DEFAULT_DOCTOR_PERMISSIONS: Record<string, boolean> = {
  view_patients: true, edit_patients: true, delete_patients: false,
  create_appointments: true, view_appointments: true, cancel_appointments: true,
  create_prescriptions: true, view_medical_records: true, edit_medical_records: true,
  view_reports: true, export_reports: false, manage_staff: false,
}

const DEFAULT_ASSISTANT_PERMISSIONS: Record<string, boolean> = {
  view_patients: true, edit_patients: false, create_appointments: true,
  view_appointments: true, cancel_appointments: false, view_medical_records: false,
  manage_billing: true, send_reminders: true, view_reports: false,
}

const DEFAULT_ADMIN_PERMISSIONS: Record<string, boolean> = {
  view_patients: true, edit_patients: true, delete_patients: true,
  create_appointments: true, view_appointments: true, cancel_appointments: true,
  view_medical_records: true, manage_billing: true, view_reports: true,
  export_reports: true, manage_staff: true, system_settings: true, manage_roles: true,
}

const SPECIALTIES = ["Cardiología","Pediatría","Neurología","Ginecología","Ortopedia","Dermatología","Oftalmología","Medicina General"]
const DEPARTMENTS = ["Cardiología","Pediatría","Neurología","Ginecología","Ortopedia","Dermatología","Recepción","Administración","Enfermería"]

import { User, Building2 } from "lucide-react"

const NAV_ITEMS = [
  { id: "dashboard",    label: "Dashboard",        icon: LayoutDashboard },
  { id: "staff",        label: "Todo el Personal", icon: Users },
  { id: "doctors",      label: "Doctores",         icon: Stethoscope },
  { id: "patients",     label: "Pacientes",        icon: User },
  { id: "assistants",   label: "Asistentes",       icon: HeartPulse },
  { id: "admins",       label: "Administradores",  icon: Shield },
  { id: "register",     label: "Registrar Nuevo",  icon: UserPlus },
  { id: "permissions",  label: "Permisos y Roles", icon: Shield },
  { id: "institution",  label: "Institución",      icon: Building2 },
]

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
const SEXOS = ["Masculino", "Femenino", "Otro"]

function groupByCategory(permissions: Permission[]) {
  return permissions.reduce<Record<string, Permission[]>>((acc, p) => {
    if (!acc[p.category]) acc[p.category] = []
    acc[p.category].push(p)
    return acc
  }, {})
}

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("")
}

// ─────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────

function Sidebar({
  activeTab,
  onTabChange
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
}) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    router.replace("/login");
  };

  return (
    <aside className="w-[280px] h-screen bg-sidebar border-r border-sidebar-border flex flex-col justify-between">

      <div className="flex items-center gap-4 px-6 py-5 border-b border-sidebar-border">
        <div className="w-12 h-12 rounded-2xl bg-sidebar-primary flex items-center justify-center">
          <Stethoscope className="w-5 h-5 text-sidebar-primary-foreground" />
        </div>

        <div className="leading-tight">
          <h1 className="text-lg font-bold text-sidebar-foreground tracking-tight">
            MediRecord
          </h1>
          <p className="text-[13px] text-sidebar-foreground/60 mt-[2px]">
            Sistema de Expedientes
          </p>
        </div>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={` w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-[0_6px_14px_rgba(0,0,0,0.15)]"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }
              `}>
            <Icon className="w-[18px] h-[18px]" />
            <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all">
          <LogOut className="w-5 h-5" />
          Cerrar sesión
        </button>

      <div className="p-4 border-t border-sidebar-border space-y-1">
        <div className="px-4 py-2 flex items-center justify-between">
          <span className="text-xs text-sidebar-foreground/40 font-medium">Tema</span>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg bg-sidebar-accent">
              <Sun className="w-[16px] h-[16px] text-sidebar-foreground" />
            </button>
            <button className="p-2 rounded-lg text-sidebar-foreground/50 hover:text-sidebar-foreground">
              <Monitor className="w-[16px] h-[16px]" />
            </button>
            <button className="p-2 rounded-lg text-sidebar-foreground/50 hover:text-sidebar-foreground">
              <Moon className="w-[16px] h-[16px]" />
            </button>
          </div>
        </div>

        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all" >
          <Settings className="w-5 h-5" />
          <p>Configuración</p>
          <ChevronRightIcon className="w-4 h-4 ml-auto opacity-50" />
        </button>
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────

function Dashboard({ staff, onNavigate }: { staff: StaffMember[]; onNavigate: (tab: string) => void }) {
  const doctors    = staff.filter((s) => s.role === "doctor")
  const patients   = staff.filter((s) => s.role === "patient")
  const assistants = staff.filter((s) => s.role === "assistant")
  const admins     = staff.filter((s) => s.role === "admin")
  const active     = staff.filter((s) => s.status === "active")
  const inactive   = staff.filter((s) => s.status === "inactive")

  const stats = [
    { label: "Total Personal", value: staff.length,      icon: Users,        color: "bg-primary/10 text-primary",      tab: "staff" },
    { label: "Doctores",       value: doctors.length,    icon: Stethoscope,  color: "bg-accent/10 text-accent",         tab: "doctors" },
    { label: "Pacientes",      value: patients.length,   icon: User,         color: "bg-emerald-500/10 text-emerald-600", tab: "patients" },
    { label: "Asistentes",     value: assistants.length, icon: HeartPulse,   color: "bg-primary/10 text-primary",       tab: "assistants" },
    { label: "Administradores",value: admins.length,     icon: Shield,       color: "bg-amber-500/10 text-amber-600",   tab: "admins" },
    { label: "Activos",        value: active.length,     icon: CheckCircle,  color: "bg-green-500/10 text-green-600",   tab: "staff" },
  ]

  const getRoleLabel = (role: Role) => {
    switch (role) {
      case "doctor": return "Doctor"
      case "assistant": return "Asistente"
      case "admin": return "Admin"
    }
  }

  const getRoleColor = (role: Role) => {
    switch (role) {
      case "doctor": return "bg-accent/10 text-accent"
      case "assistant": return "bg-primary/10 text-primary"
      case "admin": return "bg-amber-500/10 text-amber-600"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">Panel de Administración</h1>
        <p className="text-sm text-muted-foreground mt-1">Bienvenido al sistema de gestión de personal médico.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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

      {/* Secciones separadas por rol */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Doctores */}
        <div className="bg-card border border-border rounded-xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-semibold text-foreground">Doctores</h2>
            </div>
            <button onClick={() => onNavigate("doctors")} className="text-xs text-primary hover:underline">
              Ver todos
            </button>
          </div>
          <div className="divide-y divide-border max-h-64 overflow-y-auto">
            {doctors.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No hay doctores registrados</p>
            ) : (
              doctors.map((member) => (
                <div key={member.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-accent">{initials(member.name)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.specialty}</p>
                  </div>
                  <span className={cn("w-2 h-2 rounded-full shrink-0", member.status === "active" ? "bg-green-500" : "bg-destructive")} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pacientes */}
        <div className="bg-card border border-border rounded-xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-semibold text-foreground">Pacientes</h2>
            </div>
            <button onClick={() => onNavigate("patients")} className="text-xs text-primary hover:underline">
              Ver todos
            </button>
          </div>
          <div className="divide-y divide-border max-h-64 overflow-y-auto">
            {patients.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No hay pacientes registrados</p>
            ) : (
              patients.map((member) => (
                <div key={member.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-emerald-600">{initials(member.name)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.tipo_sangre} - {member.sexo}</p>
                  </div>
                  <span className={cn("w-2 h-2 rounded-full shrink-0", member.status === "active" ? "bg-green-500" : "bg-destructive")} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Asistentes */}
        <div className="bg-card border border-border rounded-xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Asistentes</h2>
            </div>
            <button onClick={() => onNavigate("assistants")} className="text-xs text-primary hover:underline">
              Ver todos
            </button>
          </div>
          <div className="divide-y divide-border max-h-64 overflow-y-auto">
            {assistants.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No hay asistentes registrados</p>
            ) : (
              assistants.map((member) => (
                <div key={member.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary">{initials(member.name)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.department}</p>
                  </div>
                  <span className={cn("w-2 h-2 rounded-full shrink-0", member.status === "active" ? "bg-green-500" : "bg-destructive")} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Administradores */}
        <div className="bg-card border border-border rounded-xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-600" />
              <h2 className="text-sm font-semibold text-foreground">Administradores</h2>
            </div>
            <button onClick={() => onNavigate("admins")} className="text-xs text-primary hover:underline">
              Ver todos
            </button>
          </div>
          <div className="divide-y divide-border max-h-64 overflow-y-auto">
            {admins.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No hay administradores registrados</p>
            ) : (
              admins.map((member) => (
                <div key={member.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-amber-600">{initials(member.name)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.department}</p>
                  </div>
                  <span className={cn("w-2 h-2 rounded-full shrink-0", member.status === "active" ? "bg-green-500" : "bg-destructive")} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Actividad reciente */}
      <div className="bg-card border border-border rounded-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Actividad Reciente</h2>
          </div>
          <button onClick={() => onNavigate("staff")} className="text-xs text-primary hover:underline">
            Ver todo
          </button>
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
                <div className="flex items-center gap-2 shrink-0">
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", getRoleColor(member.role))}>
                    {getRoleLabel(member.role)}
                  </span>
                  <span className={cn("w-2 h-2 rounded-full", member.status === "active" ? "bg-green-500" : "bg-destructive")} />
                </div>
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

function StaffTable({
  staff,
  filterRole,
  onEdit,
  onDelete,
  onToggleStatus,
}: {
  staff: StaffMember[]
  filterRole?: Role
  onEdit: (member: StaffMember) => void
  onDelete: (id: string) => void
  onToggleStatus: (id: string) => void
}) {
  const [search, setSearch]               = useState("")
  const [statusFilter, setStatusFilter]   = useState<"all" | "active" | "inactive">("all")
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const filtered = staff.filter((m) => {
    const matchRole   = filterRole ? m.role === filterRole : true
    const matchSearch = [m.name, m.email, m.department].some((v) =>
      v.toLowerCase().includes(search.toLowerCase())
    )
    const matchStatus = statusFilter === "all" ? true : m.status === statusFilter
    return matchRole && matchSearch && matchStatus
  })

  const title = filterRole === "doctor"
    ? "Doctores"
    : filterRole === "patient"
    ? "Pacientes"
    : filterRole === "assistant"
    ? "Asistentes"
    : filterRole === "admin"
    ? "Administradores"
    : "Todo el Personal"

  const subtitle = filterRole === "doctor"
    ? "Gestion de medicos registrados en el sistema"
    : filterRole === "patient"
    ? "Gestion de pacientes registrados en el sistema"
    : filterRole === "assistant"
    ? "Gestion de personal de apoyo"
    : filterRole === "admin"
    ? "Gestion de administradores del sistema"
    : "Lista completa de personal medico y administrativo"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">{title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
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
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Permisos</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Estado</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((member) => {
                  const activePerms = Object.values(member.permissions).filter(Boolean).length
                  const totalPerms  = Object.keys(member.permissions).length
                  return (
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
                          member.role === "doctor" 
                            ? "bg-accent/10 text-accent" 
                            : member.role === "admin" 
                            ? "bg-amber-500/10 text-amber-600" 
                            : member.role === "patient"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : "bg-primary/10 text-primary"
                        )}>
                          {member.role === "doctor"
                            ? <Stethoscope className="w-3 h-3" />
                            : member.role === "admin"
                            ? <Shield className="w-3 h-3" />
                            : member.role === "patient"
                            ? <User className="w-3 h-3" />
                            : <HeartPulse className="w-3 h-3" />}
                          {member.role === "doctor" ? "Doctor" : member.role === "admin" ? "Admin" : member.role === "patient" ? "Paciente" : "Asistente"}
                        </span>
                        <p className="text-xs text-muted-foreground mt-1">{member.role === "patient" ? member.tipo_sangre : member.department}</p>
                      </td>
                      <td className="px-4 py-3">
                        {member.role === "patient" ? (
                          <span className="text-xs text-muted-foreground">N/A</span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-border rounded-full h-1.5 w-16">
                              <div
                                className="bg-primary h-1.5 rounded-full"
                                style={{ width: `${totalPerms > 0 ? (activePerms / totalPerms) * 100 : 0}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground">{activePerms}/{totalPerms}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          "text-xs px-2 py-1 rounded-full font-medium",
                          member.status === "active" ? "bg-green-500/10 text-green-600" : "bg-destructive/10 text-destructive"
                        )}>
                          {member.status === "active" ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onToggleStatus(member.id)}
                            title={member.status === "active" ? "Desactivar" : "Activar"}
                            className={cn(
                              "p-1.5 rounded-lg transition-colors",
                              member.status === "active"
                                ? "text-green-600 hover:bg-green-500/10"
                                : "text-muted-foreground hover:bg-muted"
                            )}
                          >
                            <Power className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEdit(member)}
                            title="Editar"
                            className="p-1.5 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          {confirmDelete === member.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => { onDelete(member.id); setConfirmDelete(null) }}
                                className="text-xs px-2 py-1 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity"
                              >
                                Sí
                              </button>
                              <button
                                onClick={() => setConfirmDelete(null)}
                                className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-lg hover:bg-border transition-colors"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDelete(member.id)}
                              title="Eliminar"
                              className="p-1.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
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
    // Common fields
    name: "",
    email: "",
    password: "",
    phone: "",
    specialty: "",
    department: "",
    // Doctor specific fields
    cedula_profesional: "",
    consultorio: "",
    correo_profesional: "",
    // Patient specific fields
    fecha_nacimiento: "",
    sexo: "",
    curp: "",
    direccion: "",
    tipo_sangre: "",
    alergias: "",
    contacto_emergencia: "",
    telefono_contacto_emergencia: "",
  })
  const [permissions, setPerms] = useState<Record<string, boolean>>({ ...DEFAULT_DOCTOR_PERMISSIONS })
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState("")

  const availablePermissions = role === "doctor"
    ? DOCTOR_PERMISSIONS
    : role === "admin"
    ? ADMIN_PERMISSIONS
    : ASSISTANT_PERMISSIONS

  const handleRoleChange = (r: Role) => {
    setRole(r)
    if (r === "patient") {
      setPerms({})
    } else {
      setPerms(
        r === "doctor"
          ? { ...DEFAULT_DOCTOR_PERMISSIONS }
          : r === "admin"
          ? { ...DEFAULT_ADMIN_PERMISSIONS }
          : { ...DEFAULT_ASSISTANT_PERMISSIONS }
      )
    }
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = "Nombre requerido"
    if (!form.email.trim()) e.email = "Email requerido"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email invalido"
    if (!form.password.trim()) e.password = "Password requerido"
    else if (form.password.length < 6) e.password = "Password debe tener al menos 6 caracteres"
    if (!form.phone.trim()) e.phone = "Telefono requerido"

    if (role === "doctor") {
      if (!form.specialty) e.specialty = "Especialidad requerida"
      if (!form.cedula_profesional.trim()) e.cedula_profesional = "Cedula profesional requerida"
      if (!form.consultorio.trim()) e.consultorio = "Consultorio requerido"
      if (!form.department) e.department = "Departamento requerido"
    }

    if (role === "patient") {
      if (!form.fecha_nacimiento) e.fecha_nacimiento = "Fecha de nacimiento requerida"
      if (!form.sexo) e.sexo = "Sexo requerido"
      if (!form.curp.trim()) e.curp = "CURP requerido"
      if (!form.direccion.trim()) e.direccion = "Direccion requerida"
      if (!form.tipo_sangre) e.tipo_sangre = "Tipo de sangre requerido"
      if (!form.contacto_emergencia.trim()) e.contacto_emergencia = "Contacto de emergencia requerido"
      if (!form.telefono_contacto_emergencia.trim()) e.telefono_contacto_emergencia = "Telefono de emergencia requerido"
    }

    if (role === "assistant" || role === "admin") {
      if (!form.department) e.department = "Departamento requerido"
    }

    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setLoading(true)
    setApiError("")

    try {
      // Step 1: Create user first
      const userResponse = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          role: role,
        }),
      })

      if (!userResponse.ok) {
        const errorData = await userResponse.json().catch(() => ({}))
        throw new Error(errorData.message || "Error al crear usuario")
      }

      const userData = await userResponse.json()
      const userId = userData.id || userData.user_id || userData.data?.id

      // Step 2: Create doctor or patient based on role
      if (role === "doctor") {
        const doctorResponse = await fetch("http://localhost:3000/api/doctors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            nombre_completo: form.name,
            especialidad: form.specialty,
            cedula_profesional: form.cedula_profesional,
            telefono: form.phone,
            consultorio: form.consultorio,
            correo_profesional: form.correo_profesional || form.email,
          }),
        })

        if (!doctorResponse.ok) {
          const errorData = await doctorResponse.json().catch(() => ({}))
          throw new Error(errorData.message || "Error al crear doctor")
        }
      } else if (role === "patient") {
        const patientResponse = await fetch("http://localhost:3000/api/patients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            nombre_completo: form.name,
            fecha_nacimiento: form.fecha_nacimiento,
            sexo: form.sexo,
            curp: form.curp,
            telefono: form.phone,
            direccion: form.direccion,
            tipo_sangre: form.tipo_sangre,
            alergias: form.alergias || "",
            contacto_emergencia: form.contacto_emergencia,
            telefono_contacto_emergencia: form.telefono_contacto_emergencia,
          }),
        })

        if (!patientResponse.ok) {
          const errorData = await patientResponse.json().catch(() => ({}))
          throw new Error(errorData.message || "Error al crear paciente")
        }
      }

      // Add to local state
      onRegister({
        id: userId || Date.now().toString(),
        user_id: userId,
        name: form.name,
        email: form.email,
        phone: form.phone,
        role,
        specialty: role === "doctor" ? form.specialty : undefined,
        department: form.department || (role === "patient" ? "Pacientes" : ""),
        status: "active",
        permissions,
        createdAt: new Date().toISOString().split("T")[0],
        cedula_profesional: form.cedula_profesional,
        consultorio: form.consultorio,
        correo_profesional: form.correo_profesional,
        fecha_nacimiento: form.fecha_nacimiento,
        sexo: form.sexo,
        curp: form.curp,
        direccion: form.direccion,
        tipo_sangre: form.tipo_sangre,
        alergias: form.alergias,
        contacto_emergencia: form.contacto_emergencia,
        telefono_contacto_emergencia: form.telefono_contacto_emergencia,
      })

      // Reset form
      setForm({
        name: "",
        email: "",
        password: "",
        phone: "",
        specialty: "",
        department: "",
        cedula_profesional: "",
        consultorio: "",
        correo_profesional: "",
        fecha_nacimiento: "",
        sexo: "",
        curp: "",
        direccion: "",
        tipo_sangre: "",
        alergias: "",
        contacto_emergencia: "",
        telefono_contacto_emergencia: "",
      })
      setPerms(
        role === "doctor"
          ? { ...DEFAULT_DOCTOR_PERMISSIONS }
          : role === "admin"
          ? { ...DEFAULT_ADMIN_PERMISSIONS }
          : { ...DEFAULT_ASSISTANT_PERMISSIONS }
      )
      setErrors({})
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Error al registrar")
    } finally {
      setLoading(false)
    }
  }

  const permsByCategory = groupByCategory(availablePermissions)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">Registrar Nuevo</h1>
        <p className="text-sm text-muted-foreground mt-1">Complete los datos para registrar un nuevo doctor, paciente o personal.</p>
      </div>

      {success && (
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-600 rounded-lg px-4 py-3 text-sm font-medium">
          <Check className="w-4 h-4 shrink-0" />
          Registro exitoso.
        </div>
      )}

      {apiError && (
        <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-3 text-sm font-medium">
          <X className="w-4 h-4 shrink-0" />
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Role selector */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Tipo de Registro</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(["doctor", "patient", "assistant", "admin"] as Role[]).map((r) => {
              const Icon = r === "doctor" ? Stethoscope : r === "patient" ? User : r === "admin" ? Shield : HeartPulse
              const isSelected = role === r
              const label = r === "doctor" ? "Doctor" : r === "patient" ? "Paciente" : r === "admin" ? "Administrador" : "Asistente"
              const desc = r === "doctor" ? "Medico especialista" : r === "patient" ? "Paciente del sistema" : r === "admin" ? "Control total" : "Personal de apoyo"
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRoleChange(r)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3.5 rounded-lg border-2 transition-all text-left",
                    isSelected ? "border-primary bg-primary/5 text-primary" : "border-border bg-background text-muted-foreground hover:border-primary/40"
                  )}
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

        {/* Account credentials */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Credenciales de Cuenta</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Correo electronico *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="correo@ejemplo.com"
                className={cn(
                  "w-full px-3 py-2 text-sm rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition",
                  errors.email ? "border-destructive" : "border-input"
                )}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Password *</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Minimo 6 caracteres"
                className={cn(
                  "w-full px-3 py-2 text-sm rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition",
                  errors.password ? "border-destructive" : "border-input"
                )}
              />
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>
          </div>
        </div>

        {/* Personal data - Common fields */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Datos Personales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Nombre completo *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ej. Juan Garcia Lopez"
                className={cn(
                  "w-full px-3 py-2 text-sm rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition",
                  errors.name ? "border-destructive" : "border-input"
                )}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Telefono *</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+52 55 0000-0000"
                className={cn(
                  "w-full px-3 py-2 text-sm rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition",
                  errors.phone ? "border-destructive" : "border-input"
                )}
              />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
            </div>
          </div>
        </div>

        {/* Doctor specific fields */}
        {role === "doctor" && (
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-foreground">Datos del Doctor</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Especialidad *</label>
                <select
                  value={form.specialty}
                  onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                  className={cn(
                    "w-full px-3 py-2 text-sm rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition",
                    errors.specialty ? "border-destructive" : "border-input"
                  )}
                >
                  <option value="">Seleccionar especialidad</option>
                  {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.specialty && <p className="text-xs text-destructive">{errors.specialty}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Cedula Profesional *</label>
                <input
                  type="text"
                  value={form.cedula_profesional}
                  onChange={(e) => setForm({ ...form, cedula_profesional: e.target.value })}
                  placeholder="Ej. 12345678"
                  className={cn(
                    "w-full px-3 py-2 text-sm rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition",
                    errors.cedula_profesional ? "border-destructive" : "border-input"
                  )}
                />
                {errors.cedula_profesional && <p className="text-xs text-destructive">{errors.cedula_profesional}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Consultorio *</label>
                <input
                  type="text"
                  value={form.consultorio}
                  onChange={(e) => setForm({ ...form, consultorio: e.target.value })}
                  placeholder="Ej. Consultorio 101"
                  className={cn(
                    "w-full px-3 py-2 text-sm rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition",
                    errors.consultorio ? "border-destructive" : "border-input"
                  )}
                />
                {errors.consultorio && <p className="text-xs text-destructive">{errors.consultorio}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Correo Profesional</label>
                <input
                  type="email"
                  value={form.correo_profesional}
                  onChange={(e) => setForm({ ...form, correo_profesional: e.target.value })}
                  placeholder="doctor@clinica.mx"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Departamento *</label>
                <select
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  className={cn(
                    "w-full px-3 py-2 text-sm rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition",
                    errors.department ? "border-destructive" : "border-input"
                  )}
                >
                  <option value="">Seleccionar departamento</option>
                  {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                {errors.department && <p className="text-xs text-destructive">{errors.department}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Patient specific fields */}
        {role === "patient" && (
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-foreground">Datos del Paciente</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Fecha de Nacimiento *</label>
                <input
                  type="date"
                  value={form.fecha_nacimiento}
                  onChange={(e) => setForm({ ...form, fecha_nacimiento: e.target.value })}
                  className={cn(
                    "w-full px-3 py-2 text-sm rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition",
                    errors.fecha_nacimiento ? "border-destructive" : "border-input"
                  )}
                />
                {errors.fecha_nacimiento && <p className="text-xs text-destructive">{errors.fecha_nacimiento}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Sexo *</label>
                <select
                  value={form.sexo}
                  onChange={(e) => setForm({ ...form, sexo: e.target.value })}
                  className={cn(
                    "w-full px-3 py-2 text-sm rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition",
                    errors.sexo ? "border-destructive" : "border-input"
                  )}
                >
                  <option value="">Seleccionar sexo</option>
                  {SEXOS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.sexo && <p className="text-xs text-destructive">{errors.sexo}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">CURP *</label>
                <input
                  type="text"
                  value={form.curp}
                  onChange={(e) => setForm({ ...form, curp: e.target.value.toUpperCase() })}
                  placeholder="AAAA000000AAAAAA00"
                  maxLength={18}
                  className={cn(
                    "w-full px-3 py-2 text-sm rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition uppercase",
                    errors.curp ? "border-destructive" : "border-input"
                  )}
                />
                {errors.curp && <p className="text-xs text-destructive">{errors.curp}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Tipo de Sangre *</label>
                <select
                  value={form.tipo_sangre}
                  onChange={(e) => setForm({ ...form, tipo_sangre: e.target.value })}
                  className={cn(
                    "w-full px-3 py-2 text-sm rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition",
                    errors.tipo_sangre ? "border-destructive" : "border-input"
                  )}
                >
                  <option value="">Seleccionar tipo</option>
                  {BLOOD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.tipo_sangre && <p className="text-xs text-destructive">{errors.tipo_sangre}</p>}
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-medium text-muted-foreground">Direccion *</label>
                <input
                  type="text"
                  value={form.direccion}
                  onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                  placeholder="Calle, Numero, Colonia, Ciudad"
                  className={cn(
                    "w-full px-3 py-2 text-sm rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition",
                    errors.direccion ? "border-destructive" : "border-input"
                  )}
                />
                {errors.direccion && <p className="text-xs text-destructive">{errors.direccion}</p>}
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-medium text-muted-foreground">Alergias</label>
                <input
                  type="text"
                  value={form.alergias}
                  onChange={(e) => setForm({ ...form, alergias: e.target.value })}
                  placeholder="Ej. Penicilina, Polen, etc. (dejar vacio si no aplica)"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Contacto de Emergencia *</label>
                <input
                  type="text"
                  value={form.contacto_emergencia}
                  onChange={(e) => setForm({ ...form, contacto_emergencia: e.target.value })}
                  placeholder="Nombre del contacto"
                  className={cn(
                    "w-full px-3 py-2 text-sm rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition",
                    errors.contacto_emergencia ? "border-destructive" : "border-input"
                  )}
                />
                {errors.contacto_emergencia && <p className="text-xs text-destructive">{errors.contacto_emergencia}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Telefono de Emergencia *</label>
                <input
                  type="tel"
                  value={form.telefono_contacto_emergencia}
                  onChange={(e) => setForm({ ...form, telefono_contacto_emergencia: e.target.value })}
                  placeholder="+52 55 0000-0000"
                  className={cn(
                    "w-full px-3 py-2 text-sm rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition",
                    errors.telefono_contacto_emergencia ? "border-destructive" : "border-input"
                  )}
                />
                {errors.telefono_contacto_emergencia && <p className="text-xs text-destructive">{errors.telefono_contacto_emergencia}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Assistant/Admin department */}
        {(role === "assistant" || role === "admin") && (
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-foreground">Datos del {role === "admin" ? "Administrador" : "Asistente"}</h2>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Departamento *</label>
              <select
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className={cn(
                  "w-full px-3 py-2 text-sm rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition",
                  errors.department ? "border-destructive" : "border-input"
                )}
              >
                <option value="">Seleccionar departamento</option>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              {errors.department && <p className="text-xs text-destructive">{errors.department}</p>}
            </div>
          </div>
        )}

        {/* Permissions - Only for non-patients */}
        {role !== "patient" && (
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Permisos del Rol</h2>
              <span className="text-xs text-muted-foreground">
                {Object.values(permissions).filter(Boolean).length} activos
              </span>
            </div>
            <div className="space-y-5">
              {Object.entries(permsByCategory).map(([category, perms]) => (
                <div key={category}>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{category}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {perms.map((perm) => (
                      <label
                        key={perm.id}
                        className={cn(
                          "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                          permissions[perm.id] ? "border-primary/40 bg-primary/5" : "border-border hover:border-primary/20"
                        )}
                      >
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={!!permissions[perm.id]}
                          onChange={(ev) => setPerms({ ...permissions, [perm.id]: ev.target.checked })}
                        />
                        <div className={cn(
                          "w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                          permissions[perm.id] ? "bg-primary border-primary" : "border-border bg-background"
                        )}>
                          {permissions[perm.id] && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground">{perm.label}</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">{perm.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Registrando...
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              Registrar {role === "doctor" ? "Doctor" : role === "patient" ? "Paciente" : role === "admin" ? "Administrador" : "Asistente"}
            </>
          )}
        </button>
      </form>
    </div>
  )
}

// ─────────────────────────────────────────────
// EDIT MODAL
// ─────────────────────────────────────────────

function EditModal({
  member,
  onClose,
  onSave,
}: {
  member: StaffMember | null
  onClose: () => void
  onSave: (updated: StaffMember) => void
}) {
  const [form, setForm]           = useState({ name: "", email: "", phone: "", department: "", specialty: "" })
  const [permissions, setPerms]   = useState<Record<string, boolean>>({})
  const [status, setStatus]       = useState<"active" | "inactive">("active")

  useEffect(() => {
    if (member) {
      setForm({ name: member.name, email: member.email, phone: member.phone, department: member.department, specialty: member.specialty ?? "" })
      setPerms({ ...member.permissions })
      setStatus(member.status)
    }
  }, [member])

  if (!member) return null

  const availablePermissions = member.role === "doctor" 
    ? DOCTOR_PERMISSIONS 
    : member.role === "admin" 
    ? ADMIN_PERMISSIONS 
    : ASSISTANT_PERMISSIONS
  const permsByCategory      = groupByCategory(availablePermissions)
  const activeCount          = Object.values(permissions).filter(Boolean).length

  const handleSave = () => {
    onSave({ ...member, ...form, permissions, status })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="text-base font-semibold text-foreground">Editar Personal</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {member.role === "doctor" ? "Doctor" : member.role === "admin" ? "Administrador" : "Asistente"} · Registrado el {member.createdAt}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">
          {/* Status toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center gap-2">
              <Power className={cn("w-4 h-4", status === "active" ? "text-green-600" : "text-muted-foreground")} />
              <span className="text-sm font-medium text-foreground">Estado de la cuenta</span>
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full font-medium",
                status === "active" ? "bg-green-500/10 text-green-600" : "bg-destructive/10 text-destructive"
              )}>
                {status === "active" ? "Activo" : "Inactivo"}
              </span>
            </div>
            <button
              onClick={() => setStatus(status === "active" ? "inactive" : "active")}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                status === "active" ? "bg-green-500" : "bg-border"
              )}
            >
              <span className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-card shadow transition-transform",
                status === "active" ? "translate-x-6" : "translate-x-1"
              )} />
            </button>
          </div>

          {/* Personal data */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Datos Personales</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: "name",       label: "Nombre",     type: "text" },
                { key: "email",      label: "Email",      type: "email" },
                { key: "phone",      label: "Teléfono",   type: "tel" },
                { key: "department", label: "Departamento", type: "text" },
              ].map(({ key, label, type }) => (
                <div key={key} className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">{label}</label>
                  <input
                    type={type}
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              ))}
              {member.role === "doctor" && (
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-medium text-muted-foreground">Especialidad</label>
                  <input
                    type="text"
                    value={form.specialty}
                    onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Permisos y Funciones</h3>
              <span className="text-xs text-muted-foreground">{activeCount} activos</span>
            </div>
            {Object.entries(permsByCategory).map(([category, perms]) => (
              <div key={category}>
                <p className="text-xs font-medium text-muted-foreground mb-2">{category}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {perms.map((perm) => {
                    const isOn = !!permissions[perm.id]
                    return (
                      <div
                        key={perm.id}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg border transition-colors",
                          isOn ? "border-primary/30 bg-primary/5" : "border-border"
                        )}
                      >
                        <div className="flex-1 min-w-0 pr-2">
                          <p className="text-xs font-medium text-foreground">{perm.label}</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">{perm.description}</p>
                        </div>
                        <button
                          onClick={() => setPerms({ ...permissions, [perm.id]: !isOn })}
                          className={cn(
                            "relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0",
                            isOn ? "bg-primary" : "bg-border"
                          )}
                        >
                          <span className={cn(
                            "inline-block h-3.5 w-3.5 transform rounded-full bg-card shadow transition-transform",
                            isOn ? "translate-x-4" : "translate-x-0.5"
                          )} />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-muted-foreground bg-muted hover:bg-border rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Save className="w-4 h-4" />
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// PERMISSIONS VIEW
// ─────────────────────────────────────────────

function PermissionsView({
  staff,
  onUpdate,
}: {
  staff: StaffMember[]
  onUpdate: (updated: StaffMember) => void
}) {
  const [selected, setSelected]   = useState<StaffMember | null>(staff[0] ?? null)
  const [permissions, setPerms]   = useState<Record<string, boolean>>(staff[0]?.permissions ?? {})
  const [saved, setSaved]         = useState(false)

  const handleSelect = (m: StaffMember) => {
    setSelected(m)
    setPerms({ ...m.permissions })
    setSaved(false)
  }

  const handleSave = () => {
    if (!selected) return
    onUpdate({ ...selected, permissions })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const availablePermissions = selected?.role === "doctor" 
    ? DOCTOR_PERMISSIONS 
    : selected?.role === "admin" 
    ? ADMIN_PERMISSIONS 
    : ASSISTANT_PERMISSIONS
  const permsByCategory      = groupByCategory(availablePermissions)
  const activeCount          = Object.values(permissions).filter(Boolean).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">Permisos y Roles</h1>
        <p className="text-sm text-muted-foreground mt-1">Selecciona un miembro para editar sus permisos y funciones disponibles.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Staff list - Separated by roles */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-muted/30">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Personal por Rol</p>
          </div>
          <div className="max-h-[65vh] overflow-y-auto">
            {/* Doctores Section */}
            <div className="border-b border-border">
              <div className="flex items-center gap-2 px-4 py-2 bg-accent/5">
                <Stethoscope className="w-3.5 h-3.5 text-accent" />
                <p className="text-xs font-semibold text-accent">Doctores</p>
                <span className="text-xs text-muted-foreground ml-auto">{staff.filter(s => s.role === "doctor").length}</span>
              </div>
              <div className="divide-y divide-border">
                {staff.filter(s => s.role === "doctor").length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">No hay doctores</p>
                ) : (
                  staff.filter(s => s.role === "doctor").map((m) => {
                    const isSelected  = selected?.id === m.id
                    const activePerms = Object.values(m.permissions).filter(Boolean).length
                    return (
                      <button
                        key={m.id}
                        onClick={() => handleSelect(m)}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-l-2",
                          isSelected ? "bg-primary/5 border-l-accent" : "hover:bg-muted/40 border-l-transparent"
                        )}
                      >
                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-accent">{initials(m.name)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{m.name}</p>
                          <span className="text-xs text-muted-foreground truncate">{m.specialty}</span>
                        </div>
                        <span className={cn(
                          "text-xs px-1.5 py-0.5 rounded-full font-medium shrink-0",
                          m.status === "active" ? "bg-green-500/10 text-green-600" : "bg-destructive/10 text-destructive"
                        )}>
                          {activePerms}
                        </span>
                      </button>
                    )
                  })
                )}
              </div>
            </div>

            {/* Asistentes Section */}
            <div className="border-b border-border">
              <div className="flex items-center gap-2 px-4 py-2 bg-primary/5">
                <HeartPulse className="w-3.5 h-3.5 text-primary" />
                <p className="text-xs font-semibold text-primary">Asistentes</p>
                <span className="text-xs text-muted-foreground ml-auto">{staff.filter(s => s.role === "assistant").length}</span>
              </div>
              <div className="divide-y divide-border">
                {staff.filter(s => s.role === "assistant").length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">No hay asistentes</p>
                ) : (
                  staff.filter(s => s.role === "assistant").map((m) => {
                    const isSelected  = selected?.id === m.id
                    const activePerms = Object.values(m.permissions).filter(Boolean).length
                    return (
                      <button
                        key={m.id}
                        onClick={() => handleSelect(m)}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-l-2",
                          isSelected ? "bg-primary/5 border-l-primary" : "hover:bg-muted/40 border-l-transparent"
                        )}
                      >
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-primary">{initials(m.name)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{m.name}</p>
                          <span className="text-xs text-muted-foreground truncate">{m.department}</span>
                        </div>
                        <span className={cn(
                          "text-xs px-1.5 py-0.5 rounded-full font-medium shrink-0",
                          m.status === "active" ? "bg-green-500/10 text-green-600" : "bg-destructive/10 text-destructive"
                        )}>
                          {activePerms}
                        </span>
                      </button>
                    )
                  })
                )}
              </div>
            </div>

            {/* Administradores Section */}
            <div>
              <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/5">
                <Shield className="w-3.5 h-3.5 text-amber-600" />
                <p className="text-xs font-semibold text-amber-600">Administradores</p>
                <span className="text-xs text-muted-foreground ml-auto">{staff.filter(s => s.role === "admin").length}</span>
              </div>
              <div className="divide-y divide-border">
                {staff.filter(s => s.role === "admin").length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">No hay administradores</p>
                ) : (
                  staff.filter(s => s.role === "admin").map((m) => {
                    const isSelected  = selected?.id === m.id
                    const activePerms = Object.values(m.permissions).filter(Boolean).length
                    return (
                      <button
                        key={m.id}
                        onClick={() => handleSelect(m)}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-l-2",
                          isSelected ? "bg-amber-500/5 border-l-amber-500" : "hover:bg-muted/40 border-l-transparent"
                        )}
                      >
                        <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-amber-600">{initials(m.name)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{m.name}</p>
                          <span className="text-xs text-muted-foreground truncate">{m.department}</span>
                        </div>
                        <span className={cn(
                          "text-xs px-1.5 py-0.5 rounded-full font-medium shrink-0",
                          m.status === "active" ? "bg-green-500/10 text-green-600" : "bg-destructive/10 text-destructive"
                        )}>
                          {activePerms}
                        </span>
                      </button>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Permission editor */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden flex flex-col">
          {selected ? (
            <>
              <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{initials(selected.name)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{selected.name}</p>
                    <p className="text-xs text-muted-foreground">{selected.role === "doctor" ? "Doctor" : selected.role === "admin" ? "Administrador" : "Asistente"} · {selected.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-lg">
                  <Shield className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-semibold text-foreground">{activeCount}/{availablePermissions.length}</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {saved && (
                  <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-600 rounded-lg px-4 py-2.5 text-sm font-medium">
                    <Check className="w-4 h-4" />
                    Permisos actualizados correctamente.
                  </div>
                )}

                {Object.entries(permsByCategory).map(([category, perms]) => (
                  <div key={category}>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">{category}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {perms.map((perm) => {
                        const isOn = !!permissions[perm.id]
                        return (
                          <div
                            key={perm.id}
                            className={cn(
                              "flex items-center justify-between p-3 rounded-lg border transition-colors",
                              isOn ? "border-primary/30 bg-primary/5" : "border-border"
                            )}
                          >
                            <div className="flex-1 min-w-0 pr-2">
                              <p className="text-xs font-medium text-foreground">{perm.label}</p>
                              <p className="text-xs text-muted-foreground leading-relaxed">{perm.description}</p>
                            </div>
                            <button
                              onClick={() => setPerms({ ...permissions, [perm.id]: !isOn })}
                              className={cn(
                                "relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0",
                                isOn ? "bg-primary" : "bg-border"
                              )}
                            >
                              <span className={cn(
                                "inline-block h-3.5 w-3.5 transform rounded-full bg-card shadow transition-transform",
                                isOn ? "translate-x-4" : "translate-x-0.5"
                              )} />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-5 py-4 border-t border-border">
                <button
                  onClick={handleSave}
                  className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Guardar permisos
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center py-20">
              <div className="text-center">
                <Shield className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Selecciona un miembro para editar sus permisos.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// INSTITUTION FORM
// ─────────────────────────────────────────────

type Institution = {
  id?: string | number
  nombre_institucion: string
  razon_social: string
  rfc: string
  regimen_fiscal: string
  uso_cfdi: string
  direccion: string
  telefono: string
  correo_institucional: string
}

const REGIMENES_FISCALES = [
  "601 - General de Ley Personas Morales",
  "603 - Personas Morales con Fines no Lucrativos",
  "605 - Sueldos y Salarios e Ingresos Asimilados a Salarios",
  "606 - Arrendamiento",
  "607 - Régimen de Enajenación o Adquisición de Bienes",
  "608 - Demás ingresos",
  "609 - Consolidación",
  "610 - Residentes en el Extranjero sin Establecimiento Permanente en México",
  "611 - Ingresos por Dividendos (socios y accionistas)",
  "612 - Personas Físicas con Actividades Empresariales y Profesionales",
  "614 - Ingresos por intereses",
  "615 - Régimen de los ingresos por obtención de premios",
  "616 - Sin obligaciones fiscales",
  "620 - Sociedades Cooperativas de Producción que optan por diferir sus ingresos",
  "621 - Incorporación Fiscal",
  "622 - Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras",
  "623 - Opcional para Grupos de Sociedades",
  "624 - Coordinados",
  "625 - Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas",
  "626 - Régimen Simplificado de Confianza",
]

const USOS_CFDI = [
  "G01 - Adquisición de mercancias",
  "G02 - Devoluciones, descuentos o bonificaciones",
  "G03 - Gastos en general",
  "I01 - Construcciones",
  "I02 - Mobilario y equipo de oficina por inversiones",
  "I03 - Equipo de transporte",
  "I04 - Equipo de computo y accesorios",
  "I05 - Dados, troqueles, moldes, matrices y herramental",
  "I06 - Comunicaciones telefónicas",
  "I07 - Comunicaciones satelitales",
  "I08 - Otra maquinaria y equipo",
  "D01 - Honorarios médicos, dentales y gastos hospitalarios",
  "D02 - Gastos médicos por incapacidad o discapacidad",
  "D03 - Gastos funerales",
  "D04 - Donativos",
  "D05 - Intereses reales efectivamente pagados por créditos hipotecarios (casa habitación)",
  "D06 - Aportaciones voluntarias al SAR",
  "D07 - Primas por seguros de gastos médicos",
  "D08 - Gastos de transportación escolar obligatoria",
  "D09 - Depósitos en cuentas para el ahorro, primas que tengan como base planes de pensiones",
  "D10 - Pagos por servicios educativos (colegiaturas)",
  "S01 - Sin efectos fiscales",
  "CP01 - Pagos",
  "CN01 - Nómina",
]

function InstitutionForm() {
  const emptyForm: Institution = {
    nombre_institucion: "",
    razon_social: "",
    rfc: "",
    regimen_fiscal: "",
    uso_cfdi: "",
    direccion: "",
    telefono: "",
    correo_institucional: "",
  }

  const [form, setForm]           = useState<Institution>(emptyForm)
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [loading, setLoading]     = useState(false)
  const [fetching, setFetching]   = useState(true)
  const [success, setSuccess]     = useState(false)
  const [apiError, setApiError]   = useState("")
  const [errors, setErrors]       = useState<Partial<Record<keyof Institution, string>>>({})
  const [editingId, setEditingId] = useState<string | number | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | number | null>(null)

  // Fetch existing institutions on mount
  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/institutions")
        if (res.ok) {
          const data = await res.json()
          setInstitutions(Array.isArray(data) ? data : data.data ?? [])
        }
      } catch {
        // silently ignore if API is not available
      } finally {
        setFetching(false)
      }
    }
    fetchInstitutions()
  }, [])

  const validate = () => {
    const e: Partial<Record<keyof Institution, string>> = {}
    if (!form.nombre_institucion.trim()) e.nombre_institucion = "Nombre de institución requerido"
    if (!form.razon_social.trim()) e.razon_social = "Razón social requerida"
    if (!form.rfc.trim()) e.rfc = "RFC requerido"
    else if (!/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/.test(form.rfc.toUpperCase())) e.rfc = "RFC con formato inválido"
    if (!form.regimen_fiscal) e.regimen_fiscal = "Régimen fiscal requerido"
    if (!form.uso_cfdi) e.uso_cfdi = "Uso de CFDI requerido"
    if (!form.direccion.trim()) e.direccion = "Dirección requerida"
    if (!form.telefono.trim()) e.telefono = "Teléfono requerido"
    if (!form.correo_institucional.trim()) e.correo_institucional = "Correo institucional requerido"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo_institucional)) e.correo_institucional = "Correo inválido"
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    setApiError("")

    try {
      const payload = { ...form, rfc: form.rfc.toUpperCase() }
      const url     = editingId
        ? `http://localhost:3000/api/institutions/${editingId}`
        : "http://localhost:3000/api/institutions"
      const method  = editingId ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.message || "Error al guardar la institución")
      }

      const saved = await res.json()
      const savedInstitution: Institution = saved.data ?? saved

      if (editingId) {
        setInstitutions((prev) => prev.map((i) => (i.id === editingId ? savedInstitution : i)))
      } else {
        setInstitutions((prev) => [savedInstitution, ...prev])
      }

      setForm(emptyForm)
      setErrors({})
      setEditingId(null)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Error al guardar")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (inst: Institution) => {
    setForm({ ...inst })
    setEditingId(inst.id ?? null)
    setErrors({})
    setApiError("")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id: string | number) => {
    try {
      const res = await fetch(`http://localhost:3000/api/institutions/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Error al eliminar")
      setInstitutions((prev) => prev.filter((i) => i.id !== id))
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Error al eliminar")
    } finally {
      setConfirmDelete(null)
    }
  }

  const handleCancel = () => {
    setForm(emptyForm)
    setEditingId(null)
    setErrors({})
    setApiError("")
  }

  const inputClass = (field: keyof Institution) =>
    cn(
      "w-full px-3 py-2 text-sm rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition",
      errors[field] ? "border-destructive" : "border-input"
    )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">Institución</h1>
        <p className="text-sm text-muted-foreground mt-1">Gestiona los datos fiscales y de contacto de la institución médica.</p>
      </div>

      {success && (
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-600 rounded-lg px-4 py-3 text-sm font-medium">
          <Check className="w-4 h-4 shrink-0" />
          {editingId ? "Institución actualizada correctamente." : "Institución registrada correctamente."}
        </div>
      )}

      {apiError && (
        <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-3 text-sm font-medium">
          <X className="w-4 h-4 shrink-0" />
          {apiError}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Datos generales */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Datos Generales</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Nombre de la Institución *</label>
              <input
                type="text"
                value={form.nombre_institucion}
                onChange={(e) => setForm({ ...form, nombre_institucion: e.target.value })}
                placeholder="Ej. Clínica MediRecord"
                className={inputClass("nombre_institucion")}
              />
              {errors.nombre_institucion && <p className="text-xs text-destructive">{errors.nombre_institucion}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Razón Social *</label>
              <input
                type="text"
                value={form.razon_social}
                onChange={(e) => setForm({ ...form, razon_social: e.target.value })}
                placeholder="Ej. MediRecord S.A. de C.V."
                className={inputClass("razon_social")}
              />
              {errors.razon_social && <p className="text-xs text-destructive">{errors.razon_social}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">RFC *</label>
              <input
                type="text"
                value={form.rfc}
                onChange={(e) => setForm({ ...form, rfc: e.target.value.toUpperCase() })}
                placeholder="Ej. MED000101ABC"
                maxLength={13}
                className={cn(inputClass("rfc"), "uppercase")}
              />
              {errors.rfc && <p className="text-xs text-destructive">{errors.rfc}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Teléfono *</label>
              <input
                type="tel"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                placeholder="+52 55 0000-0000"
                className={inputClass("telefono")}
              />
              {errors.telefono && <p className="text-xs text-destructive">{errors.telefono}</p>}
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-medium text-muted-foreground">Correo Institucional *</label>
              <input
                type="email"
                value={form.correo_institucional}
                onChange={(e) => setForm({ ...form, correo_institucional: e.target.value })}
                placeholder="contacto@institucion.mx"
                className={inputClass("correo_institucional")}
              />
              {errors.correo_institucional && <p className="text-xs text-destructive">{errors.correo_institucional}</p>}
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-medium text-muted-foreground">Dirección *</label>
              <input
                type="text"
                value={form.direccion}
                onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                placeholder="Calle, Número, Colonia, Ciudad, Estado, CP"
                className={inputClass("direccion")}
              />
              {errors.direccion && <p className="text-xs text-destructive">{errors.direccion}</p>}
            </div>
          </div>
        </div>

        {/* Datos fiscales */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Datos Fiscales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Régimen Fiscal *</label>
              <select
                value={form.regimen_fiscal}
                onChange={(e) => setForm({ ...form, regimen_fiscal: e.target.value })}
                className={inputClass("regimen_fiscal")}
              >
                <option value="">Seleccionar régimen fiscal</option>
                {REGIMENES_FISCALES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              {errors.regimen_fiscal && <p className="text-xs text-destructive">{errors.regimen_fiscal}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Uso de CFDI *</label>
              <select
                value={form.uso_cfdi}
                onChange={(e) => setForm({ ...form, uso_cfdi: e.target.value })}
                className={inputClass("uso_cfdi")}
              >
                <option value="">Seleccionar uso de CFDI</option>
                {USOS_CFDI.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
              {errors.uso_cfdi && <p className="text-xs text-destructive">{errors.uso_cfdi}</p>}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold border border-border text-muted-foreground bg-background hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4" />
              Cancelar edición
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                {editingId ? "Actualizando..." : "Registrando..."}
              </>
            ) : (
              <>
                {editingId ? <Save className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                {editingId ? "Guardar cambios" : "Registrar Institución"}
              </>
            )}
          </button>
        </div>
      </form>

      {/* Institutions list */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Instituciones Registradas</h2>
          {!fetching && (
            <span className="text-xs text-muted-foreground">{institutions.length} registros</span>
          )}
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
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">RFC</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Contacto</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden xl:table-cell">Uso CFDI</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {institutions.map((inst) => (
                    <tr key={inst.id ?? inst.rfc} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Building2 className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{inst.nombre_institucion}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">{inst.razon_social}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">{inst.rfc}</span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <p className="text-foreground text-xs">{inst.correo_institucional}</p>
                        <p className="text-xs text-muted-foreground">{inst.telefono}</p>
                      </td>
                      <td className="px-4 py-3 hidden xl:table-cell">
                        <span className="text-xs text-muted-foreground">{inst.uso_cfdi.split(" - ")[0]}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleEdit(inst)}
                            title="Editar"
                            className="p-1.5 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          {confirmDelete === (inst.id ?? inst.rfc) ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDelete(inst.id ?? inst.rfc!)}
                                className="text-xs px-2 py-1 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity"
                              >
                                Sí
                              </button>
                              <button
                                onClick={() => setConfirmDelete(null)}
                                className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-lg hover:bg-border transition-colors"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDelete(inst.id ?? inst.rfc!)}
                              title="Eliminar"
                              className="p-1.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
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
// ROOT PAGE
// ─────────────────────────────────────────────

export default function AdminPage() {
  const [activeTab, setActiveTab]           = useState("dashboard")
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [staff, setStaff]                   = useState<StaffMember[]>([])
  const [editingMember, setEditingMember]   = useState<StaffMember | null>(null)

  const handleRegister     = (member: StaffMember)  => setStaff((prev) => [member, ...prev])
  const handleDelete       = (id: string)            => setStaff((prev) => prev.filter((m) => m.id !== id))
  const handleToggleStatus = (id: string)            => setStaff((prev) => prev.map((m) => m.id === id ? { ...m, status: m.status === "active" ? "inactive" : "active" } : m))
  const handleSave         = (updated: StaffMember)  => setStaff((prev) => prev.map((m) => m.id === updated.id ? updated : m))

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setMobileSidebarOpen(false)
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":   return <Dashboard staff={staff} onNavigate={handleTabChange} />
      case "staff":       return <StaffTable staff={staff} onEdit={setEditingMember} onDelete={handleDelete} onToggleStatus={handleToggleStatus} />
      case "doctors":     return <StaffTable staff={staff} filterRole="doctor" onEdit={setEditingMember} onDelete={handleDelete} onToggleStatus={handleToggleStatus} />
      case "patients":    return <StaffTable staff={staff} filterRole="patient" onEdit={setEditingMember} onDelete={handleDelete} onToggleStatus={handleToggleStatus} />
      case "assistants":  return <StaffTable staff={staff} filterRole="assistant" onEdit={setEditingMember} onDelete={handleDelete} onToggleStatus={handleToggleStatus} />
      case "admins":      return <StaffTable staff={staff} filterRole="admin" onEdit={setEditingMember} onDelete={handleDelete} onToggleStatus={handleToggleStatus} />
      case "register":    return <RegisterForm onRegister={handleRegister} />
      case "permissions": return <PermissionsView staff={staff} onUpdate={handleSave} />
      case "institution": return <InstitutionForm />
      default:            return <Dashboard staff={staff} onNavigate={handleTabChange} />
    }
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar — desktop always visible, mobile as overlay */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 lg:relative lg:z-auto transition-transform duration-300",
        mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <Sidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto min-w-0">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-card border-b border-border lg:hidden">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
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

      <EditModal
        member={editingMember}
        onClose={() => setEditingMember(null)}
        onSave={handleSave}
      />
    </div>
  )
}
