"use client"

import { useState, useEffect } from "react"
import { cn } from "../lib/utils"
import {
  Users,
  UserPlus,
  LayoutDashboard,
  Stethoscope,
  HeartPulse,
  ChevronLeft,
  ChevronRight,
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
} from "lucide-react"
import { LogOutButton } from "@/components/ui/logoutButton"


// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

type Role = "doctor" | "assistant" | "admin"

type Permission = {
  id: string
  label: string
  description: string
  category: string
}

type StaffMember = {
  id: string
  name: string
  email: string
  phone: string
  role: Role
  specialty?: string
  department: string
  status: "active" | "inactive"
  permissions: Record<string, boolean>
  createdAt: string
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

const INITIAL_STAFF: StaffMember[] = [
  {
    id: "1", name: "Dr. Carlos Mendoza", email: "c.mendoza@clinica.mx", phone: "+52 55 1234-5678",
    role: "doctor", specialty: "Cardiología", department: "Cardiología", status: "active",
    permissions: { ...DEFAULT_DOCTOR_PERMISSIONS, view_reports: true, export_reports: true },
    createdAt: "2024-01-15",
  },
  {
    id: "2", name: "Dra. Sofía Ramírez", email: "s.ramirez@clinica.mx", phone: "+52 55 2345-6789",
    role: "doctor", specialty: "Pediatría", department: "Pediatría", status: "active",
    permissions: { ...DEFAULT_DOCTOR_PERMISSIONS, manage_staff: true },
    createdAt: "2024-02-20",
  },
  {
    id: "3", name: "Laura Torres", email: "l.torres@clinica.mx", phone: "+52 55 3456-7890",
    role: "assistant", department: "Recepción", status: "active",
    permissions: { ...DEFAULT_ASSISTANT_PERMISSIONS, edit_patients: true },
    createdAt: "2024-03-10",
  },
  {
    id: "4", name: "Miguel Herrera", email: "m.herrera@clinica.mx", phone: "+52 55 4567-8901",
    role: "assistant", department: "Administración", status: "inactive",
    permissions: { ...DEFAULT_ASSISTANT_PERMISSIONS },
    createdAt: "2024-03-22",
  },
  {
    id: "5", name: "Ana García López", email: "a.garcia@clinica.mx", phone: "+52 55 5678-9012",
    role: "admin", department: "Dirección General", status: "active",
    permissions: { ...DEFAULT_ADMIN_PERMISSIONS },
    createdAt: "2024-01-05",
  },
  {
    id: "6", name: "Roberto Sánchez", email: "r.sanchez@clinica.mx", phone: "+52 55 6789-0123",
    role: "admin", department: "Sistemas", status: "active",
    permissions: { ...DEFAULT_ADMIN_PERMISSIONS, system_settings: true },
    createdAt: "2024-02-10",
  },
]

const SPECIALTIES = ["Cardiología","Pediatría","Neurología","Ginecología","Ortopedia","Dermatología","Oftalmología","Medicina General"]
const DEPARTMENTS = ["Cardiología","Pediatría","Neurología","Ginecología","Ortopedia","Dermatología","Recepción","Administración","Enfermería"]

const NAV_ITEMS = [
  { id: "dashboard",    label: "Dashboard",        icon: LayoutDashboard },
  { id: "staff",        label: "Todo el Personal", icon: Users },
  { id: "doctors",      label: "Doctores",         icon: Stethoscope },
  { id: "assistants",   label: "Asistentes",       icon: HeartPulse },
  { id: "admins",       label: "Administradores",  icon: Shield },
  { id: "register",     label: "Registrar Nuevo",  icon: UserPlus },
  { id: "permissions",  label: "Permisos y Roles", icon: Shield },
]

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
  onTabChange,
  collapsed,
  onToggle,
}: {
  activeTab: string
  onTabChange: (tab: string) => void
  collapsed: boolean
  onToggle: () => void
}) {
  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-sidebar text-sidebar-foreground transition-all duration-300 shrink-0",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className={cn("flex items-center gap-3 px-4 py-5 border-b border-sidebar-border", collapsed && "justify-center px-0")}>
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary shrink-0">
          <HeartPulse className="w-5 h-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-sm font-bold leading-tight text-sidebar-foreground">MedAdmin</p>
            <p className="text-xs text-sidebar-foreground/50">Panel Clínico</p>
          </div>
        )}
      </div>

      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                collapsed && "justify-center px-0"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          )
        })}
      </nav>

      <div className="p-2 border-t border-sidebar-border space-y-1">
        <button
          onClick={onToggle}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors",
            collapsed && "justify-center px-0"
          )}
          title={collapsed ? "Expandir" : "Colapsar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!collapsed && <span></span>}
        </button>
        {/* <button
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/60 hover:bg-destructive/20 hover:text-destructive transition-colors",
            collapsed && "justify-center px-0"
          )}
          title={collapsed ? "Cerrar sesión" : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Cerrar sesión</span>}
        </button> */}
      <div className="w-full">
        <LogOutButton collapsed={collapsed} />
      </div>
      </div>
    </aside>
  )
}

// ─────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────

function Dashboard({ staff, onNavigate }: { staff: StaffMember[]; onNavigate: (tab: string) => void }) {
  const doctors    = staff.filter((s) => s.role === "doctor")
  const assistants = staff.filter((s) => s.role === "assistant")
  const admins     = staff.filter((s) => s.role === "admin")
  const active     = staff.filter((s) => s.status === "active")
  const inactive   = staff.filter((s) => s.status === "inactive")

  const stats = [
    { label: "Total Personal", value: staff.length,      icon: Users,        color: "bg-primary/10 text-primary",      tab: "staff" },
    { label: "Doctores",       value: doctors.length,    icon: Stethoscope,  color: "bg-accent/10 text-accent",         tab: "doctors" },
    { label: "Asistentes",     value: assistants.length, icon: HeartPulse,   color: "bg-primary/10 text-primary",       tab: "assistants" },
    { label: "Administradores",value: admins.length,     icon: Shield,       color: "bg-amber-500/10 text-amber-600",   tab: "admins" },
    { label: "Activos",        value: active.length,     icon: CheckCircle,  color: "bg-green-500/10 text-green-600",   tab: "staff" },
    { label: "Inactivos",      value: inactive.length,   icon: XCircle,      color: "bg-destructive/10 text-destructive", tab: "staff" },
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
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
          {staff.slice(0, 5).map((member) => (
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
          ))}
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
    : filterRole === "assistant"
    ? "Asistentes"
    : filterRole === "admin"
    ? "Administradores"
    : "Todo el Personal"

  const subtitle = filterRole === "doctor"
    ? "Gestión de médicos registrados en el sistema"
    : filterRole === "assistant"
    ? "Gestión de personal de apoyo"
    : filterRole === "admin"
    ? "Gestión de administradores del sistema"
    : "Lista completa de personal médico y administrativo"

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
                            : "bg-primary/10 text-primary"
                        )}>
                          {member.role === "doctor"
                            ? <Stethoscope className="w-3 h-3" />
                            : member.role === "admin"
                            ? <Shield className="w-3 h-3" />
                            : <HeartPulse className="w-3 h-3" />}
                          {member.role === "doctor" ? "Doctor" : member.role === "admin" ? "Admin" : "Asistente"}
                        </span>
                        <p className="text-xs text-muted-foreground mt-1">{member.department}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-border rounded-full h-1.5 w-16">
                            <div
                              className="bg-primary h-1.5 rounded-full"
                              style={{ width: `${(activePerms / totalPerms) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{activePerms}/{totalPerms}</span>
                        </div>
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
  const [role, setRole]           = useState<Role>("doctor")
  const [form, setForm]           = useState({ name: "", email: "", phone: "", specialty: "", department: "" })
  const [permissions, setPerms]   = useState<Record<string, boolean>>({ ...DEFAULT_DOCTOR_PERMISSIONS })
  const [success, setSuccess]     = useState(false)
  const [errors, setErrors]       = useState<Record<string, string>>({})

  const availablePermissions = role === "doctor" 
    ? DOCTOR_PERMISSIONS 
    : role === "admin" 
    ? ADMIN_PERMISSIONS 
    : ASSISTANT_PERMISSIONS

  const handleRoleChange = (r: Role) => {
    setRole(r)
    setPerms(
      r === "doctor" 
        ? { ...DEFAULT_DOCTOR_PERMISSIONS } 
        : r === "admin" 
        ? { ...DEFAULT_ADMIN_PERMISSIONS } 
        : { ...DEFAULT_ASSISTANT_PERMISSIONS }
    )
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim())     e.name       = "Nombre requerido"
    if (!form.email.trim())    e.email      = "Email requerido"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email inválido"
    if (!form.phone.trim())    e.phone      = "Teléfono requerido"
    if (!form.department)      e.department = "Departamento requerido"
    if (role === "doctor" && !form.specialty) e.specialty = "Especialidad requerida"
    return e
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    onRegister({
      id: Date.now().toString(),
      name: form.name, email: form.email, phone: form.phone,
      role,
      specialty: role === "doctor" ? form.specialty : undefined,
      department: form.department,
      status: "active",
      permissions,
      createdAt: new Date().toISOString().split("T")[0],
    })
    setForm({ name: "", email: "", phone: "", specialty: "", department: "" })
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
  }

  const permsByCategory = groupByCategory(availablePermissions)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">Registrar Nuevo Personal</h1>
        <p className="text-sm text-muted-foreground mt-1">Complete los datos y asigne permisos al nuevo miembro.</p>
      </div>

      {success && (
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-600 rounded-lg px-4 py-3 text-sm font-medium">
          <Check className="w-4 h-4 shrink-0" />
          Miembro registrado exitosamente.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Role selector */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Tipo de Rol</h2>
          <div className="grid grid-cols-3 gap-3">
            {(["doctor", "assistant", "admin"] as Role[]).map((r) => {
              const Icon = r === "doctor" ? Stethoscope : r === "admin" ? Shield : HeartPulse
              const isSelected = role === r
              const label = r === "doctor" ? "Doctor" : r === "admin" ? "Administrador" : "Asistente"
              const desc = r === "doctor" ? "Médico especialista" : r === "admin" ? "Control total del sistema" : "Personal de apoyo"
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

        {/* Personal data */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Datos Personales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: "name",       label: "Nombre completo *",    type: "text",  placeholder: "Ej. Dr. Juan García" },
              { key: "email",      label: "Correo electrónico *", type: "email", placeholder: "doctor@clinica.mx" },
              { key: "phone",      label: "Teléfono *",           type: "tel",   placeholder: "+52 55 0000-0000" },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key} className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">{label}</label>
                <input
                  type={type}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  className={cn(
                    "w-full px-3 py-2 text-sm rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition",
                    errors[key] ? "border-destructive" : "border-input"
                  )}
                />
                {errors[key] && <p className="text-xs text-destructive">{errors[key]}</p>}
              </div>
            ))}

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

            {role === "doctor" && (
              <div className="space-y-1 md:col-span-2">
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
            )}
          </div>
        </div>

        {/* Permissions */}
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
                        onChange={(e) => setPerms({ ...permissions, [perm.id]: e.target.checked })}
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

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Registrar Personal
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
                {staff.filter(s => s.role === "doctor").map((m) => {
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
                })}
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
                {staff.filter(s => s.role === "assistant").map((m) => {
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
                })}
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
                {staff.filter(s => s.role === "admin").map((m) => {
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
                })}
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
// ROOT PAGE
// ─────────────────────────────────────────────

export default function AdminPage() {

  const [activeTab, setActiveTab]           = useState("dashboard")
  const [collapsed, setCollapsed]           = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [staff, setStaff]                   = useState<StaffMember[]>(INITIAL_STAFF)
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
      case "assistants":  return <StaffTable staff={staff} filterRole="assistant" onEdit={setEditingMember} onDelete={handleDelete} onToggleStatus={handleToggleStatus} />
      case "admins":      return <StaffTable staff={staff} filterRole="admin" onEdit={setEditingMember} onDelete={handleDelete} onToggleStatus={handleToggleStatus} />
      case "register":    return <RegisterForm onRegister={handleRegister} />
      case "permissions": return <PermissionsView staff={staff} onUpdate={handleSave} />
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
          collapsed={collapsed}
          onToggle={() => setCollapsed((v) => !v)}
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
