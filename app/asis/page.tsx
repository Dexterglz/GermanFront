"use client"

import { useState } from "react"
import { cn } from "../../lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Badge } from "../../components/ui/badge"
import { Textarea } from "../../components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Calendar, 
  Activity, 
  FileText, 
  Users, 
  Home,
  Settings,
  LogOut,
  Menu,
  X,
  Clock,
  ArrowUp,
  ArrowDown,
  Plus,
  Search,
  Check,
  AlertCircle,
  Heart,
  Thermometer,
  Wind,
  Droplets,
  Scale,
  Ruler,
  Phone,
  Mail,
  AlertTriangle,
  Stethoscope,
  Pill,
  ClipboardList,
  ChevronRight,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  Building2,
  UserCog,
  Briefcase,
  Video,
  MapPin
} from "lucide-react"

// Types
interface Patient {
  id: string
  name: string
  age: number
  gender: "Masculino" | "Femenino"
  phone: string
  email: string
  bloodType: string
  allergies: string[]
  medicalHistory: MedicalRecord[]
  vitalSigns: VitalSign[]
}

interface MedicalRecord {
  id: string
  date: string
  diagnosis: string
  treatment: string
  notes: string
  doctor: string
}

interface VitalSign {
  id: string
  date: string
  time: string
  temperature: number
  bloodPressureSystolic: number
  bloodPressureDiastolic: number
  heartRate: number
  respiratoryRate: number
  oxygenSaturation: number
  weight: number
  height: number
}

// New API-aligned Appointment interface
interface Appointment {
  id: string
  doctorId: string
  patientId: string
  branchId: string
  affiliationId: string
  serviceId: string
  modality: "PRESENCIAL" | "VIRTUAL" | "DOMICILIO"
  scheduledAt: string
  durationMinutes: number
  price: number
  paymentMethod: "CASH" | "CARD" | "TRANSFER" | "INSURANCE"
  notes: string
  internalNotes: string
  status: "Programada" | "Completada" | "Cancelada" | "En curso"
}

// Reference data types
interface Doctor {
  id: string
  name: string
  specialty: string
}

interface Branch {
  id: string
  name: string
  address: string
}

interface Affiliation {
  id: string
  name: string
  type: string
}

interface Service {
  id: string
  name: string
  duration: number
  price: number
}

// Initial Data
const initialDoctors: Doctor[] = [
  { id: "doc1", name: "Dr. Roberto Sanchez", specialty: "Medicina General" },
  { id: "doc2", name: "Dra. Ana Morales", specialty: "Cardiologia" },
  { id: "doc3", name: "Dr. Miguel Torres", specialty: "Traumatologia" },
  { id: "doc4", name: "Dra. Laura Vega", specialty: "Endocrinologia" },
]

const initialBranches: Branch[] = [
  { id: "branch1", name: "Sucursal Centro", address: "Av. Principal 123" },
  { id: "branch2", name: "Sucursal Norte", address: "Calle Norte 456" },
  { id: "branch3", name: "Sucursal Sur", address: "Blvd. Sur 789" },
]

const initialAffiliations: Affiliation[] = [
  { id: "aff1", name: "IMSS", type: "Seguro Social" },
  { id: "aff2", name: "ISSSTE", type: "Seguro Social" },
  { id: "aff3", name: "GNP Seguros", type: "Seguro Privado" },
  { id: "aff4", name: "MetLife", type: "Seguro Privado" },
  { id: "aff5", name: "Particular", type: "Sin Seguro" },
]

const initialServices: Service[] = [
  { id: "serv1", name: "Consulta General", duration: 30, price: 500 },
  { id: "serv2", name: "Consulta Especializada", duration: 45, price: 800 },
  { id: "serv3", name: "Control de Seguimiento", duration: 20, price: 350 },
  { id: "serv4", name: "Urgencia", duration: 60, price: 1200 },
  { id: "serv5", name: "Valoracion Inicial", duration: 60, price: 1000 },
]

const initialPatients: Patient[] = [
  {
    id: "1",
    name: "Maria Garcia Lopez",
    age: 45,
    gender: "Femenino",
    phone: "+52 555 123 4567",
    email: "maria.garcia@email.com",
    bloodType: "O+",
    allergies: ["Penicilina", "Sulfas"],
    medicalHistory: [
      {
        id: "mh1",
        date: "2024-01-15",
        diagnosis: "Hipertension arterial",
        treatment: "Losartan 50mg cada 24 horas",
        notes: "Control mensual de presion arterial",
        doctor: "Dr. Roberto Sanchez"
      },
      {
        id: "mh2",
        date: "2023-11-20",
        diagnosis: "Diabetes tipo 2",
        treatment: "Metformina 850mg cada 12 horas",
        notes: "Dieta baja en carbohidratos, ejercicio moderado",
        doctor: "Dr. Roberto Sanchez"
      }
    ],
    vitalSigns: [
      {
        id: "vs1",
        date: "2024-01-20",
        time: "09:30",
        temperature: 36.5,
        bloodPressureSystolic: 130,
        bloodPressureDiastolic: 85,
        heartRate: 78,
        respiratoryRate: 16,
        oxygenSaturation: 98,
        weight: 68,
        height: 162
      }
    ]
  },
  {
    id: "2",
    name: "Carlos Rodriguez Martinez",
    age: 32,
    gender: "Masculino",
    phone: "+52 555 987 6543",
    email: "carlos.rodriguez@email.com",
    bloodType: "A+",
    allergies: [],
    medicalHistory: [
      {
        id: "mh3",
        date: "2024-01-10",
        diagnosis: "Gastritis",
        treatment: "Omeprazol 20mg cada 24 horas",
        notes: "Evitar alimentos irritantes",
        doctor: "Dra. Ana Morales"
      }
    ],
    vitalSigns: [
      {
        id: "vs2",
        date: "2024-01-18",
        time: "14:15",
        temperature: 36.8,
        bloodPressureSystolic: 118,
        bloodPressureDiastolic: 76,
        heartRate: 72,
        respiratoryRate: 14,
        oxygenSaturation: 99,
        weight: 82,
        height: 178
      }
    ]
  },
  {
    id: "3",
    name: "Ana Fernandez Ruiz",
    age: 28,
    gender: "Femenino",
    phone: "+52 555 456 7890",
    email: "ana.fernandez@email.com",
    bloodType: "B-",
    allergies: ["Latex"],
    medicalHistory: [],
    vitalSigns: []
  },
  {
    id: "4",
    name: "Jose Luis Hernandez",
    age: 58,
    gender: "Masculino",
    phone: "+52 555 321 6549",
    email: "joseluis.hernandez@email.com",
    bloodType: "AB+",
    allergies: ["Aspirina", "Ibuprofeno"],
    medicalHistory: [
      {
        id: "mh4",
        date: "2024-01-08",
        diagnosis: "Artritis reumatoide",
        treatment: "Metotrexato 15mg semanal",
        notes: "Monitoreo de funcion hepatica cada 3 meses",
        doctor: "Dr. Miguel Torres"
      },
      {
        id: "mh5",
        date: "2023-12-15",
        diagnosis: "Hipotiroidismo",
        treatment: "Levotiroxina 100mcg cada 24 horas",
        notes: "TSH control cada 6 meses",
        doctor: "Dra. Laura Vega"
      }
    ],
    vitalSigns: [
      {
        id: "vs3",
        date: "2024-01-19",
        time: "11:00",
        temperature: 36.2,
        bloodPressureSystolic: 142,
        bloodPressureDiastolic: 88,
        heartRate: 82,
        respiratoryRate: 18,
        oxygenSaturation: 96,
        weight: 95,
        height: 172
      }
    ]
  }
]

const initialAppointments: Appointment[] = [
  {
    id: "apt1",
    doctorId: "doc1",
    patientId: "1",
    branchId: "branch1",
    affiliationId: "aff5",
    serviceId: "serv3",
    modality: "PRESENCIAL",
    scheduledAt: "2024-01-22T09:00:00.000Z",
    durationMinutes: 30,
    price: 500,
    paymentMethod: "CASH",
    notes: "Control de presion arterial",
    internalNotes: "",
    status: "Programada"
  },
  {
    id: "apt2",
    doctorId: "doc2",
    patientId: "2",
    branchId: "branch1",
    affiliationId: "aff3",
    serviceId: "serv2",
    modality: "PRESENCIAL",
    scheduledAt: "2024-01-22T10:30:00.000Z",
    durationMinutes: 45,
    price: 800,
    paymentMethod: "INSURANCE",
    notes: "",
    internalNotes: "Paciente con seguro GNP",
    status: "Programada"
  },
  {
    id: "apt3",
    doctorId: "doc1",
    patientId: "4",
    branchId: "branch2",
    affiliationId: "aff1",
    serviceId: "serv1",
    modality: "VIRTUAL",
    scheduledAt: "2024-01-22T11:30:00.000Z",
    durationMinutes: 30,
    price: 500,
    paymentMethod: "INSURANCE",
    notes: "",
    internalNotes: "",
    status: "Programada"
  },
  {
    id: "apt4",
    doctorId: "doc3",
    patientId: "3",
    branchId: "branch1",
    affiliationId: "aff5",
    serviceId: "serv5",
    modality: "PRESENCIAL",
    scheduledAt: "2024-01-22T14:00:00.000Z",
    durationMinutes: 60,
    price: 1000,
    paymentMethod: "CARD",
    notes: "Primera consulta",
    internalNotes: "Paciente nuevo",
    status: "Programada"
  },
  {
    id: "apt5",
    doctorId: "doc1",
    patientId: "1",
    branchId: "branch1",
    affiliationId: "aff5",
    serviceId: "serv4",
    modality: "PRESENCIAL",
    scheduledAt: "2024-01-21T09:30:00.000Z",
    durationMinutes: 60,
    price: 1200,
    paymentMethod: "CASH",
    notes: "Dolor de cabeza intenso",
    internalNotes: "Urgencia atendida",
    status: "Completada"
  },
  {
    id: "apt6",
    doctorId: "doc2",
    patientId: "2",
    branchId: "branch2",
    affiliationId: "aff3",
    serviceId: "serv3",
    modality: "DOMICILIO",
    scheduledAt: "2024-01-20T16:00:00.000Z",
    durationMinutes: 45,
    price: 1500,
    paymentMethod: "INSURANCE",
    notes: "",
    internalNotes: "",
    status: "Completada"
  }
]

// Menu items
const menuItems = [
  { id: "dashboard", label: "Inicio", icon: Home },
  { id: "appointments", label: "Citas", icon: Calendar },
  { id: "vitals", label: "Signos Vitales", icon: Activity },
  { id: "records", label: "Expedientes", icon: FileText },
  { id: "patients", label: "Pacientes", icon: Users },
]

const statusColors = {
  "Programada": "bg-primary/10 text-primary border-primary/20",
  "Completada": "bg-accent/10 text-accent border-accent/20",
  "Cancelada": "bg-destructive/10 text-destructive border-destructive/20",
  "En curso": "bg-chart-4/10 text-chart-4 border-chart-4/20"
}

const statusIcons = {
  "Programada": Clock,
  "Completada": Check,
  "Cancelada": X,
  "En curso": AlertCircle
}

const modalityLabels = {
  "PRESENCIAL": "Presencial",
  "VIRTUAL": "Virtual",
  "DOMICILIO": "Domicilio"
}

const modalityIcons = {
  "PRESENCIAL": Building2,
  "VIRTUAL": Video,
  "DOMICILIO": MapPin
}

const paymentMethodLabels = {
  "CASH": "Efectivo",
  "CARD": "Tarjeta",
  "TRANSFER": "Transferencia",
  "INSURANCE": "Seguro"
}

export default function MedicalAssistantApp() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [patientsData, setPatientsData] = useState<Patient[]>(initialPatients)
  const [appointmentsData, setAppointmentsData] = useState<Appointment[]>(initialAppointments)

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardSection patients={patientsData} appointments={appointmentsData} />
      case "appointments":
        return <AppointmentsSection 
          patients={patientsData} 
          appointments={appointmentsData} 
          setAppointments={setAppointmentsData}
          doctors={initialDoctors}
          branches={initialBranches}
          affiliations={initialAffiliations}
          services={initialServices}
        />
      case "vitals":
        return <VitalSignsSection patients={patientsData} setPatients={setPatientsData} />
      case "records":
        return <MedicalRecordsSection patients={patientsData} />
      case "patients":
        return <PatientsSection patients={patientsData} setPatients={setPatientsData} />
      default:
        return <DashboardSection patients={patientsData} appointments={appointmentsData} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar text-sidebar-foreground transition-transform lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
              <Activity className="h-6 w-6 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold">MediAssist</h1>
              <p className="text-xs text-sidebar-foreground/60">Panel de Control</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setActiveTab(item.id)
                        setIsSidebarOpen(false)
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                        isActive 
                          ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="border-t border-sidebar-border px-4 py-4">
            <div className="flex items-center gap-3 px-4 py-2 mb-2">
              <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center">
                <span className="text-sm font-medium">EA</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Enfermera Ana</p>
                <p className="text-xs text-sidebar-foreground/60">Turno matutino</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex-1 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              >
                <Settings className="h-4 w-4 mr-2" />
                Ajustes
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      <main className="lg:pl-64">
        <div className="p-4 pt-16 lg:pt-6 lg:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}

// Dashboard Section
function DashboardSection({ patients, appointments }: { patients: Patient[], appointments: Appointment[] }) {
  const todayAppointments = appointments.filter(apt => apt.status === "Programada").length
  const completedAppointments = appointments.filter(apt => apt.status === "Completada").length
  const totalPatients = patients.length
  const recentVitals = patients.filter(p => p.vitalSigns.length > 0).length

  const stats = [
    { title: "Citas de Hoy", value: todayAppointments, change: "+12%", trend: "up", icon: Calendar, description: "desde ayer" },
    { title: "Pacientes Activos", value: totalPatients, change: "+4", trend: "up", icon: Users, description: "este mes" },
    { title: "Signos Registrados", value: recentVitals, change: "+8%", trend: "up", icon: Activity, description: "esta semana" },
    { title: "Citas Completadas", value: completedAppointments, change: "-2%", trend: "down", icon: Clock, description: "desde ayer" },
  ]

  const upcomingAppointments = appointments.filter(apt => apt.status === "Programada").slice(0, 4)

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId)
    return patient?.name || "Paciente desconocido"
  }

  const formatTime = (scheduledAt: string) => {
    const date = new Date(scheduledAt)
    return date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Buenos dias, Enfermera Ana</h1>
        <p className="text-muted-foreground">Aqui esta el resumen de hoy, lunes 22 de enero</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-1 text-xs">
                  {stat.trend === "up" ? <ArrowUp className="h-3 w-3 text-accent" /> : <ArrowDown className="h-3 w-3 text-destructive" />}
                  <span className={stat.trend === "up" ? "text-accent" : "text-destructive"}>{stat.change}</span>
                  <span className="text-muted-foreground">{stat.description}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Proximas Citas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((apt) => {
                const patientName = getPatientName(apt.patientId)
                const ModalityIcon = modalityIcons[apt.modality]
                return (
                  <div key={apt.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-sm font-medium text-primary">
                        {patientName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{patientName}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <ModalityIcon className="h-3 w-3" />
                        <span>{modalityLabels[apt.modality]}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatTime(apt.scheduledAt)}</p>
                      <p className="text-xs text-muted-foreground">${apt.price.toLocaleString()}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Pacientes Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {patients.slice(0, 4).map((patient) => (
                <div key={patient.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                    <span className="text-sm font-medium text-accent">
                      {patient.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{patient.name}</p>
                    <p className="text-xs text-muted-foreground">{patient.age} anos - {patient.gender}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{patient.bloodType}</p>
                    <p className="text-xs text-muted-foreground">
                      {patient.allergies.length > 0 ? `${patient.allergies.length} alergias` : "Sin alergias"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Appointments Section with full API fields
interface AppointmentsSectionProps {
  patients: Patient[]
  appointments: Appointment[]
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>
  doctors: Doctor[]
  branches: Branch[]
  affiliations: Affiliation[]
  services: Service[]
}

function AppointmentsSection({ patients, appointments, setAppointments, doctors, branches, affiliations, services }: AppointmentsSectionProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newAppointment, setNewAppointment] = useState({
    doctorId: "",
    patientId: "",
    branchId: "",
    affiliationId: "",
    serviceId: "",
    modality: "" as Appointment["modality"],
    scheduledDate: "",
    scheduledTime: "",
    durationMinutes: 30,
    price: 0,
    paymentMethod: "" as Appointment["paymentMethod"],
    notes: "",
    internalNotes: ""
  })

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId)
    return patient?.name || "Paciente desconocido"
  }

  const getDoctorName = (doctorId: string) => {
    const doctor = doctors.find(d => d.id === doctorId)
    return doctor?.name || "Doctor desconocido"
  }

  const getBranchName = (branchId: string) => {
    const branch = branches.find(b => b.id === branchId)
    return branch?.name || "Sucursal desconocida"
  }

  const getServiceName = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId)
    return service?.name || "Servicio desconocido"
  }

  const formatDateTime = (scheduledAt: string) => {
    const date = new Date(scheduledAt)
    return {
      date: date.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      time: date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
    }
  }

  const filteredAppointments = appointments.filter(apt => {
    const patientName = getPatientName(apt.patientId)
    const matchesSearch = patientName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || apt.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleServiceChange = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId)
    if (service) {
      setNewAppointment({
        ...newAppointment,
        serviceId,
        durationMinutes: service.duration,
        price: service.price
      })
    }
  }

  const handleCreateAppointment = () => {
    if (!newAppointment.patientId || !newAppointment.doctorId || !newAppointment.scheduledDate || !newAppointment.scheduledTime || !newAppointment.serviceId) return

    const scheduledAt = new Date(`${newAppointment.scheduledDate}T${newAppointment.scheduledTime}:00.000Z`).toISOString()

    const appointment: Appointment = {
      id: `apt${Date.now()}`,
      doctorId: newAppointment.doctorId,
      patientId: newAppointment.patientId,
      branchId: newAppointment.branchId,
      affiliationId: newAppointment.affiliationId,
      serviceId: newAppointment.serviceId,
      modality: newAppointment.modality || "PRESENCIAL",
      scheduledAt,
      durationMinutes: newAppointment.durationMinutes,
      price: newAppointment.price,
      paymentMethod: newAppointment.paymentMethod || "CASH",
      notes: newAppointment.notes,
      internalNotes: newAppointment.internalNotes,
      status: "Programada"
    }

    setAppointments([appointment, ...appointments])
    setNewAppointment({
      doctorId: "",
      patientId: "",
      branchId: "",
      affiliationId: "",
      serviceId: "",
      modality: "" as Appointment["modality"],
      scheduledDate: "",
      scheduledTime: "",
      durationMinutes: 30,
      price: 0,
      paymentMethod: "" as Appointment["paymentMethod"],
      notes: "",
      internalNotes: ""
    })
    setIsDialogOpen(false)
  }

  const updateStatus = (id: string, status: Appointment["status"]) => {
    setAppointments(appointments.map(apt => apt.id === id ? { ...apt, status } : apt))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestion de Citas</h1>
          <p className="text-muted-foreground">Agenda y administra las citas de los pacientes</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" />Nueva Cita</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Agendar Nueva Cita</DialogTitle>
              <DialogDescription>Completa los datos para agendar una nueva cita medica</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Row 1: Doctor and Patient */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="doctor" className="flex items-center gap-2">
                    <UserCog className="h-4 w-4 text-muted-foreground" />
                    Doctor
                  </Label>
                  <Select value={newAppointment.doctorId} onValueChange={(value) => setNewAppointment({...newAppointment, doctorId: value})}>
                    <SelectTrigger><SelectValue placeholder="Seleccionar doctor" /></SelectTrigger>
                    <SelectContent>
                      {doctors.map(doctor => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          <div className="flex flex-col">
                            <span>{doctor.name}</span>
                            <span className="text-xs text-muted-foreground">{doctor.specialty}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="patient" className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    Paciente
                  </Label>
                  <Select value={newAppointment.patientId} onValueChange={(value) => setNewAppointment({...newAppointment, patientId: value})}>
                    <SelectTrigger><SelectValue placeholder="Seleccionar paciente" /></SelectTrigger>
                    <SelectContent>
                      {patients.map(patient => (
                        <SelectItem key={patient.id} value={patient.id}>{patient.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 2: Branch and Service */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="branch" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    Sucursal
                  </Label>
                  <Select value={newAppointment.branchId} onValueChange={(value) => setNewAppointment({...newAppointment, branchId: value})}>
                    <SelectTrigger><SelectValue placeholder="Seleccionar sucursal" /></SelectTrigger>
                    <SelectContent>
                      {branches.map(branch => (
                        <SelectItem key={branch.id} value={branch.id}>
                          <div className="flex flex-col">
                            <span>{branch.name}</span>
                            <span className="text-xs text-muted-foreground">{branch.address}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="service" className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    Servicio
                  </Label>
                  <Select value={newAppointment.serviceId} onValueChange={handleServiceChange}>
                    <SelectTrigger><SelectValue placeholder="Seleccionar servicio" /></SelectTrigger>
                    <SelectContent>
                      {services.map(service => (
                        <SelectItem key={service.id} value={service.id}>
                          <div className="flex flex-col">
                            <span>{service.name}</span>
                            <span className="text-xs text-muted-foreground">{service.duration} min - ${service.price.toLocaleString()}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 3: Affiliation and Modality */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="affiliation" className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4 text-muted-foreground" />
                    Afiliacion
                  </Label>
                  <Select value={newAppointment.affiliationId} onValueChange={(value) => setNewAppointment({...newAppointment, affiliationId: value})}>
                    <SelectTrigger><SelectValue placeholder="Seleccionar afiliacion" /></SelectTrigger>
                    <SelectContent>
                      {affiliations.map(affiliation => (
                        <SelectItem key={affiliation.id} value={affiliation.id}>
                          <div className="flex flex-col">
                            <span>{affiliation.name}</span>
                            <span className="text-xs text-muted-foreground">{affiliation.type}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="modality" className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-muted-foreground" />
                    Modalidad
                  </Label>
                  <Select value={newAppointment.modality} onValueChange={(value) => setNewAppointment({...newAppointment, modality: value as Appointment["modality"]})}>
                    <SelectTrigger><SelectValue placeholder="Seleccionar modalidad" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PRESENCIAL">Presencial</SelectItem>
                      <SelectItem value="VIRTUAL">Virtual</SelectItem>
                      <SelectItem value="DOMICILIO">Domicilio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 4: Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Fecha
                  </Label>
                  <Input 
                    id="date" 
                    type="date" 
                    value={newAppointment.scheduledDate} 
                    onChange={(e) => setNewAppointment({...newAppointment, scheduledDate: e.target.value})} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="time" className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    Hora
                  </Label>
                  <Input 
                    id="time" 
                    type="time" 
                    value={newAppointment.scheduledTime} 
                    onChange={(e) => setNewAppointment({...newAppointment, scheduledTime: e.target.value})} 
                  />
                </div>
              </div>

              {/* Row 5: Duration, Price, Payment Method */}
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="duration" className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    Duracion (min)
                  </Label>
                  <Input 
                    id="duration" 
                    type="number" 
                    value={newAppointment.durationMinutes} 
                    onChange={(e) => setNewAppointment({...newAppointment, durationMinutes: parseInt(e.target.value) || 30})} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    Precio
                  </Label>
                  <Input 
                    id="price" 
                    type="number" 
                    value={newAppointment.price} 
                    onChange={(e) => setNewAppointment({...newAppointment, price: parseFloat(e.target.value) || 0})} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="paymentMethod" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    Metodo de Pago
                  </Label>
                  <Select value={newAppointment.paymentMethod} onValueChange={(value) => setNewAppointment({...newAppointment, paymentMethod: value as Appointment["paymentMethod"]})}>
                    <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CASH">Efectivo</SelectItem>
                      <SelectItem value="CARD">Tarjeta</SelectItem>
                      <SelectItem value="TRANSFER">Transferencia</SelectItem>
                      <SelectItem value="INSURANCE">Seguro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 6: Notes */}
              <div className="grid gap-2">
                <Label htmlFor="notes" className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Notas para el paciente
                </Label>
                <Textarea 
                  id="notes" 
                  placeholder="Agregar notas visibles para el paciente" 
                  value={newAppointment.notes} 
                  onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
                  rows={2}
                />
              </div>

              {/* Row 7: Internal Notes */}
              <div className="grid gap-2">
                <Label htmlFor="internalNotes" className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                  Notas internas
                </Label>
                <Textarea 
                  id="internalNotes" 
                  placeholder="Agregar notas internas (solo personal medico)" 
                  value={newAppointment.internalNotes} 
                  onChange={(e) => setNewAppointment({...newAppointment, internalNotes: e.target.value})}
                  rows={2}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleCreateAppointment}>Agendar Cita</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar por nombre de paciente..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Estado" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="Programada">Programada</SelectItem>
            <SelectItem value="Completada">Completada</SelectItem>
            <SelectItem value="En curso">En curso</SelectItem>
            <SelectItem value="Cancelada">Cancelada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredAppointments.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="py-12 text-center">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No se encontraron citas</p>
            </CardContent>
          </Card>
        ) : (
          filteredAppointments.map((apt) => {
            const StatusIcon = statusIcons[apt.status]
            const ModalityIcon = modalityIcons[apt.modality]
            const patientName = getPatientName(apt.patientId)
            const doctorName = getDoctorName(apt.doctorId)
            const branchName = getBranchName(apt.branchId)
            const serviceName = getServiceName(apt.serviceId)
            const { date, time } = formatDateTime(apt.scheduledAt)
            
            return (
              <Card key={apt.id} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Patient Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <span className="text-lg font-medium text-primary">{patientName.split(" ").map(n => n[0]).join("").slice(0, 2)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{patientName}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" /><span>{date}</span>
                          <Clock className="h-3.5 w-3.5 ml-2" /><span>{time}</span>
                        </div>
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div className="flex flex-wrap items-center gap-3 lg:gap-4">
                      <div className="text-sm hidden md:block">
                        <p className="font-medium">{doctorName}</p>
                        <p className="text-xs text-muted-foreground">{serviceName}</p>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <ModalityIcon className="h-3.5 w-3.5" />
                        <span>{modalityLabels[apt.modality]}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Building2 className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">{branchName}</span>
                      </div>

                      <div className="flex items-center gap-1 text-sm font-medium">
                        <DollarSign className="h-3.5 w-3.5 text-accent" />
                        <span>${apt.price.toLocaleString()}</span>
                      </div>

                      <Badge variant="outline" className="text-xs">
                        {paymentMethodLabels[apt.paymentMethod]}
                      </Badge>

                      <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium", statusColors[apt.status])}>
                        <StatusIcon className="h-3.5 w-3.5" />{apt.status}
                      </div>
                    </div>
                  </div>

                  {/* Notes Section */}
                  {(apt.notes || apt.internalNotes) && (
                    <div className="mt-3 pt-3 border-t border-border/50 grid sm:grid-cols-2 gap-2">
                      {apt.notes && (
                        <div className="text-xs">
                          <span className="text-muted-foreground">Notas: </span>
                          <span>{apt.notes}</span>
                        </div>
                      )}
                      {apt.internalNotes && (
                        <div className="text-xs">
                          <span className="text-muted-foreground">Internas: </span>
                          <span className="text-chart-4">{apt.internalNotes}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {apt.status === "Programada" && (
                    <div className="flex gap-2 mt-4 pt-4 border-t border-border/50">
                      <Button size="sm" variant="outline" onClick={() => updateStatus(apt.id, "En curso")}>Iniciar</Button>
                      <Button size="sm" variant="outline" className="text-accent border-accent/30 hover:bg-accent/10" onClick={() => updateStatus(apt.id, "Completada")}>Completar</Button>
                      <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => updateStatus(apt.id, "Cancelada")}>Cancelar</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}

// Vital Signs Section
function VitalSignsSection({ patients, setPatients }: { patients: Patient[], setPatients: React.Dispatch<React.SetStateAction<Patient[]>> }) {
  const [selectedPatient, setSelectedPatient] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newVitals, setNewVitals] = useState<Partial<VitalSign>>({
    temperature: 36.5, bloodPressureSystolic: 120, bloodPressureDiastolic: 80,
    heartRate: 72, respiratoryRate: 16, oxygenSaturation: 98, weight: 70, height: 170
  })

  const filteredPatients = patients.filter(patient => patient.name.toLowerCase().includes(searchTerm.toLowerCase()))
  const currentPatient = patients.find(p => p.id === selectedPatient)

  const handleSaveVitals = () => {
    if (!selectedPatient) return
    const vitalSign: VitalSign = {
      id: `vs${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      temperature: newVitals.temperature || 36.5,
      bloodPressureSystolic: newVitals.bloodPressureSystolic || 120,
      bloodPressureDiastolic: newVitals.bloodPressureDiastolic || 80,
      heartRate: newVitals.heartRate || 72,
      respiratoryRate: newVitals.respiratoryRate || 16,
      oxygenSaturation: newVitals.oxygenSaturation || 98,
      weight: newVitals.weight || 70,
      height: newVitals.height || 170
    }
    setPatients(patients.map(p => p.id === selectedPatient ? { ...p, vitalSigns: [vitalSign, ...p.vitalSigns] } : p))
    setIsDialogOpen(false)
  }

  const getVitalStatus = (type: string, value: number) => {
    const ranges: Record<string, { low: number; high: number }> = {
      temperature: { low: 36, high: 37.5 }, heartRate: { low: 60, high: 100 },
      bloodPressureSystolic: { low: 90, high: 140 }, bloodPressureDiastolic: { low: 60, high: 90 },
      respiratoryRate: { low: 12, high: 20 }, oxygenSaturation: { low: 95, high: 100 }
    }
    const range = ranges[type]
    if (!range) return "normal"
    if (value < range.low) return "low"
    if (value > range.high) return "high"
    return "normal"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "low": return "text-primary"
      case "high": return "text-destructive"
      default: return "text-accent"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Signos Vitales</h1>
          <p className="text-muted-foreground">Registra y monitorea los signos vitales de los pacientes</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" disabled={!selectedPatient}><Plus className="h-4 w-4" />Registrar Signos</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Registrar Signos Vitales</DialogTitle>
              <DialogDescription>Paciente: {currentPatient?.name}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="flex items-center gap-2"><Thermometer className="h-4 w-4 text-primary" />Temperatura (C)</Label>
                  <Input type="number" step="0.1" value={newVitals.temperature} onChange={(e) => setNewVitals({...newVitals, temperature: parseFloat(e.target.value)})} />
                </div>
                <div className="grid gap-2">
                  <Label className="flex items-center gap-2"><Heart className="h-4 w-4 text-destructive" />Frecuencia Cardiaca (lpm)</Label>
                  <Input type="number" value={newVitals.heartRate} onChange={(e) => setNewVitals({...newVitals, heartRate: parseInt(e.target.value)})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="flex items-center gap-2"><Activity className="h-4 w-4 text-accent" />Presion Sistolica (mmHg)</Label>
                  <Input type="number" value={newVitals.bloodPressureSystolic} onChange={(e) => setNewVitals({...newVitals, bloodPressureSystolic: parseInt(e.target.value)})} />
                </div>
                <div className="grid gap-2">
                  <Label className="flex items-center gap-2"><Activity className="h-4 w-4 text-accent" />Presion Diastolica (mmHg)</Label>
                  <Input type="number" value={newVitals.bloodPressureDiastolic} onChange={(e) => setNewVitals({...newVitals, bloodPressureDiastolic: parseInt(e.target.value)})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="flex items-center gap-2"><Wind className="h-4 w-4 text-muted-foreground" />Frecuencia Respiratoria (rpm)</Label>
                  <Input type="number" value={newVitals.respiratoryRate} onChange={(e) => setNewVitals({...newVitals, respiratoryRate: parseInt(e.target.value)})} />
                </div>
                <div className="grid gap-2">
                  <Label className="flex items-center gap-2"><Droplets className="h-4 w-4 text-primary" />Saturacion O2 (%)</Label>
                  <Input type="number" value={newVitals.oxygenSaturation} onChange={(e) => setNewVitals({...newVitals, oxygenSaturation: parseInt(e.target.value)})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="flex items-center gap-2"><Scale className="h-4 w-4 text-muted-foreground" />Peso (kg)</Label>
                  <Input type="number" step="0.1" value={newVitals.weight} onChange={(e) => setNewVitals({...newVitals, weight: parseFloat(e.target.value)})} />
                </div>
                <div className="grid gap-2">
                  <Label className="flex items-center gap-2"><Ruler className="h-4 w-4 text-muted-foreground" />Altura (cm)</Label>
                  <Input type="number" value={newVitals.height} onChange={(e) => setNewVitals({...newVitals, height: parseInt(e.target.value)})} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSaveVitals}>Guardar Registro</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="border-border/50 lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Pacientes</CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Buscar paciente..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </CardHeader>
          <CardContent className="max-h-[500px] overflow-y-auto">
            <div className="space-y-2">
              {filteredPatients.map((patient) => (
                <button key={patient.id} onClick={() => setSelectedPatient(patient.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${selectedPatient === patient.id ? "bg-primary/10 border border-primary/30" : "bg-muted/50 hover:bg-muted"}`}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-sm font-medium text-primary">{patient.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{patient.name}</p>
                    <p className="text-xs text-muted-foreground">{patient.vitalSigns.length} registros</p>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          {currentPatient ? (
            currentPatient.vitalSigns.length > 0 ? (
              <>
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Ultimos Signos Vitales</CardTitle>
                    <p className="text-sm text-muted-foreground">Registrado: {currentPatient.vitalSigns[0].date} a las {currentPatient.vitalSigns[0].time}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2 mb-2"><Thermometer className="h-5 w-5 text-primary" /><span className="text-sm text-muted-foreground">Temperatura</span></div>
                        <p className={`text-2xl font-bold ${getStatusColor(getVitalStatus("temperature", currentPatient.vitalSigns[0].temperature))}`}>{currentPatient.vitalSigns[0].temperature}C</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2 mb-2"><Heart className="h-5 w-5 text-destructive" /><span className="text-sm text-muted-foreground">Frec. Cardiaca</span></div>
                        <p className={`text-2xl font-bold ${getStatusColor(getVitalStatus("heartRate", currentPatient.vitalSigns[0].heartRate))}`}>{currentPatient.vitalSigns[0].heartRate} lpm</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2 mb-2"><Activity className="h-5 w-5 text-accent" /><span className="text-sm text-muted-foreground">Presion Arterial</span></div>
                        <p className={`text-2xl font-bold ${getStatusColor(getVitalStatus("bloodPressureSystolic", currentPatient.vitalSigns[0].bloodPressureSystolic))}`}>{currentPatient.vitalSigns[0].bloodPressureSystolic}/{currentPatient.vitalSigns[0].bloodPressureDiastolic}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2 mb-2"><Wind className="h-5 w-5 text-muted-foreground" /><span className="text-sm text-muted-foreground">Frec. Respiratoria</span></div>
                        <p className={`text-2xl font-bold ${getStatusColor(getVitalStatus("respiratoryRate", currentPatient.vitalSigns[0].respiratoryRate))}`}>{currentPatient.vitalSigns[0].respiratoryRate} rpm</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2 mb-2"><Droplets className="h-5 w-5 text-primary" /><span className="text-sm text-muted-foreground">Sat. O2</span></div>
                        <p className={`text-2xl font-bold ${getStatusColor(getVitalStatus("oxygenSaturation", currentPatient.vitalSigns[0].oxygenSaturation))}`}>{currentPatient.vitalSigns[0].oxygenSaturation}%</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2 mb-2"><Scale className="h-5 w-5 text-muted-foreground" /><span className="text-sm text-muted-foreground">Peso / Altura</span></div>
                        <p className="text-2xl font-bold text-foreground">{currentPatient.vitalSigns[0].weight}kg / {currentPatient.vitalSigns[0].height}cm</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {currentPatient.vitalSigns.length > 1 && (
                  <Card className="border-border/50">
                    <CardHeader><CardTitle className="text-lg">Historial de Signos</CardTitle></CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {currentPatient.vitalSigns.slice(1).map((vital) => (
                          <div key={vital.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div><p className="text-sm font-medium">{vital.date} - {vital.time}</p></div>
                            <div className="flex gap-4 text-sm">
                              <span>{vital.temperature}C</span><span>{vital.heartRate} lpm</span>
                              <span>{vital.bloodPressureSystolic}/{vital.bloodPressureDiastolic}</span><span>{vital.oxygenSaturation}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card className="border-border/50">
                <CardContent className="py-12 text-center">
                  <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No hay signos vitales registrados para este paciente</p>
                  <Button onClick={() => setIsDialogOpen(true)}><Plus className="h-4 w-4 mr-2" />Registrar Primer Registro</Button>
                </CardContent>
              </Card>
            )
          ) : (
            <Card className="border-border/50">
              <CardContent className="py-12 text-center">
                <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Selecciona un paciente para ver o registrar signos vitales</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

// Medical Records Section
function MedicalRecordsSection({ patients }: { patients: Patient[] }) {
  const [selectedPatient, setSelectedPatient] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPatients = patients.filter(patient => patient.name.toLowerCase().includes(searchTerm.toLowerCase()))
  const currentPatient = patients.find(p => p.id === selectedPatient)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Expedientes Clinicos</h1>
        <p className="text-muted-foreground">Consulta el historial medico completo de los pacientes</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="border-border/50 lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Buscar Paciente</CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Nombre del paciente..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </CardHeader>
          <CardContent className="max-h-[600px] overflow-y-auto">
            <div className="space-y-2">
              {filteredPatients.map((patient) => (
                <button key={patient.id} onClick={() => setSelectedPatient(patient.id)}
                  className={cn("w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                    selectedPatient === patient.id ? "bg-primary/10 border border-primary/30" : "bg-muted/50 hover:bg-muted")}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-sm font-medium text-primary">{patient.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{patient.name}</p>
                    <p className="text-xs text-muted-foreground">{patient.age} anos - {patient.bloodType}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          {currentPatient ? (
            <>
              <Card className="border-border/50">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <span className="text-xl font-bold text-primary">{currentPatient.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</span>
                      </div>
                      <div>
                        <CardTitle className="text-xl">{currentPatient.name}</CardTitle>
                        <p className="text-muted-foreground">{currentPatient.age} anos - {currentPatient.gender}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-primary/30 text-primary">ID: {currentPatient.id.padStart(6, '0')}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <div><p className="text-xs text-muted-foreground">Telefono</p><p className="text-sm font-medium">{currentPatient.phone}</p></div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div className="min-w-0"><p className="text-xs text-muted-foreground">Email</p><p className="text-sm font-medium truncate">{currentPatient.email}</p></div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Droplets className="h-5 w-5 text-destructive" />
                      <div><p className="text-xs text-muted-foreground">Tipo de Sangre</p><p className="text-sm font-bold">{currentPatient.bloodType}</p></div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <AlertTriangle className="h-5 w-5 text-chart-4" />
                      <div><p className="text-xs text-muted-foreground">Alergias</p><p className="text-sm font-medium">{currentPatient.allergies.length > 0 ? currentPatient.allergies.length : "Ninguna"}</p></div>
                    </div>
                  </div>

                  {currentPatient.allergies.length > 0 && (
                    <div className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        <span className="font-medium text-destructive">Alergias Conocidas</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {currentPatient.allergies.map((allergy, index) => (
                          <Badge key={index} variant="outline" className="border-destructive/30 text-destructive bg-destructive/5">{allergy}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2"><ClipboardList className="h-5 w-5 text-primary" />Historial Medico</CardTitle>
                </CardHeader>
                <CardContent>
                  {currentPatient.medicalHistory.length > 0 ? (
                    <div className="space-y-4">
                      {currentPatient.medicalHistory.map((record) => (
                        <div key={record.id} className="p-4 rounded-lg border border-border/50 bg-card">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /><span className="text-sm text-muted-foreground">{record.date}</span></div>
                            <Badge variant="secondary">{record.doctor}</Badge>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <Stethoscope className="h-5 w-5 text-primary mt-0.5" />
                              <div><p className="text-xs text-muted-foreground uppercase tracking-wide">Diagnostico</p><p className="font-medium">{record.diagnosis}</p></div>
                            </div>
                            <div className="flex items-start gap-3">
                              <Pill className="h-5 w-5 text-accent mt-0.5" />
                              <div><p className="text-xs text-muted-foreground uppercase tracking-wide">Tratamiento</p><p className="text-sm">{record.treatment}</p></div>
                            </div>
                            {record.notes && (
                              <div className="flex items-start gap-3">
                                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div><p className="text-xs text-muted-foreground uppercase tracking-wide">Notas</p><p className="text-sm text-muted-foreground">{record.notes}</p></div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No hay registros medicos para este paciente</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {currentPatient.vitalSigns.length > 0 && (
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Ultimo Registro de Signos Vitales</CardTitle>
                    <p className="text-sm text-muted-foreground">{currentPatient.vitalSigns[0].date} - {currentPatient.vitalSigns[0].time}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <div className="p-3 rounded-lg bg-muted/50 text-center"><p className="text-xs text-muted-foreground">Temp.</p><p className="text-lg font-bold">{currentPatient.vitalSigns[0].temperature}C</p></div>
                      <div className="p-3 rounded-lg bg-muted/50 text-center"><p className="text-xs text-muted-foreground">F.C.</p><p className="text-lg font-bold">{currentPatient.vitalSigns[0].heartRate} lpm</p></div>
                      <div className="p-3 rounded-lg bg-muted/50 text-center"><p className="text-xs text-muted-foreground">P.A.</p><p className="text-lg font-bold">{currentPatient.vitalSigns[0].bloodPressureSystolic}/{currentPatient.vitalSigns[0].bloodPressureDiastolic}</p></div>
                      <div className="p-3 rounded-lg bg-muted/50 text-center"><p className="text-xs text-muted-foreground">F.R.</p><p className="text-lg font-bold">{currentPatient.vitalSigns[0].respiratoryRate} rpm</p></div>
                      <div className="p-3 rounded-lg bg-muted/50 text-center"><p className="text-xs text-muted-foreground">SpO2</p><p className="text-lg font-bold">{currentPatient.vitalSigns[0].oxygenSaturation}%</p></div>
                      <div className="p-3 rounded-lg bg-muted/50 text-center"><p className="text-xs text-muted-foreground">IMC</p><p className="text-lg font-bold">{(currentPatient.vitalSigns[0].weight / Math.pow(currentPatient.vitalSigns[0].height / 100, 2)).toFixed(1)}</p></div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card className="border-border/50">
              <CardContent className="py-16 text-center">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Selecciona un Paciente</h3>
                <p className="text-muted-foreground">Elige un paciente de la lista para ver su expediente clinico completo</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

// Patients Section
function PatientsSection({ patients, setPatients }: { patients: Patient[], setPatients: React.Dispatch<React.SetStateAction<Patient[]>> }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newPatient, setNewPatient] = useState({ name: "", age: "", gender: "" as Patient["gender"], phone: "", email: "", bloodType: "", allergies: "" })

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  )

  const handleCreatePatient = () => {
    if (!newPatient.name || !newPatient.age || !newPatient.gender) return
    const patient: Patient = {
      id: `${Date.now()}`,
      name: newPatient.name,
      age: parseInt(newPatient.age),
      gender: newPatient.gender,
      phone: newPatient.phone,
      email: newPatient.email,
      bloodType: newPatient.bloodType,
      allergies: newPatient.allergies ? newPatient.allergies.split(",").map(a => a.trim()) : [],
      medicalHistory: [],
      vitalSigns: []
    }
    setPatients([patient, ...patients])
    setNewPatient({ name: "", age: "", gender: "" as Patient["gender"], phone: "", email: "", bloodType: "", allergies: "" })
    setIsDialogOpen(false)
  }

  const handleDeletePatient = (id: string) => {
    setPatients(patients.filter(p => p.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pacientes</h1>
          <p className="text-muted-foreground">Administra el directorio de pacientes</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" />Nuevo Paciente</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Paciente</DialogTitle>
              <DialogDescription>Ingresa los datos del nuevo paciente</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre Completo</Label>
                <Input id="name" placeholder="Juan Perez Garcia" value={newPatient.name} onChange={(e) => setNewPatient({...newPatient, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="age">Edad</Label>
                  <Input id="age" type="number" placeholder="35" value={newPatient.age} onChange={(e) => setNewPatient({...newPatient, age: e.target.value})} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="gender">Genero</Label>
                  <Select value={newPatient.gender} onValueChange={(value) => setNewPatient({...newPatient, gender: value as Patient["gender"]})}>
                    <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Masculino">Masculino</SelectItem>
                      <SelectItem value="Femenino">Femenino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="phone">Telefono</Label>
                  <Input id="phone" placeholder="+52 555 123 4567" value={newPatient.phone} onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bloodType">Tipo de Sangre</Label>
                  <Select value={newPatient.bloodType} onValueChange={(value) => setNewPatient({...newPatient, bloodType: value})}>
                    <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem><SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem><SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem><SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem><SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="paciente@email.com" value={newPatient.email} onChange={(e) => setNewPatient({...newPatient, email: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="allergies">Alergias (separadas por coma)</Label>
                <Input id="allergies" placeholder="Penicilina, Sulfas, Latex" value={newPatient.allergies} onChange={(e) => setNewPatient({...newPatient, allergies: e.target.value})} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleCreatePatient}>Registrar Paciente</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar por nombre, email o telefono..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><Users className="h-5 w-5 text-primary" /></div>
              <div><p className="text-2xl font-bold">{patients.length}</p><p className="text-sm text-muted-foreground">Total Pacientes</p></div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center"><Users className="h-5 w-5 text-accent" /></div>
              <div><p className="text-2xl font-bold">{patients.filter(p => p.gender === "Femenino").length}</p><p className="text-sm text-muted-foreground">Femenino</p></div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-chart-4/10 flex items-center justify-center"><Users className="h-5 w-5 text-chart-4" /></div>
              <div><p className="text-2xl font-bold">{patients.filter(p => p.gender === "Masculino").length}</p><p className="text-sm text-muted-foreground">Masculino</p></div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center"><Users className="h-5 w-5 text-destructive" /></div>
              <div><p className="text-2xl font-bold">{patients.filter(p => p.allergies.length > 0).length}</p><p className="text-sm text-muted-foreground">Con Alergias</p></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paciente</TableHead>
                <TableHead className="hidden md:table-cell">Contacto</TableHead>
                <TableHead className="hidden sm:table-cell">Tipo Sangre</TableHead>
                <TableHead className="hidden lg:table-cell">Alergias</TableHead>
                <TableHead className="hidden lg:table-cell">Registros</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No se encontraron pacientes</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <span className="text-sm font-medium text-primary">{patient.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</span>
                        </div>
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-sm text-muted-foreground">{patient.age} anos - {patient.gender}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm"><Phone className="h-3.5 w-3.5 text-muted-foreground" />{patient.phone}</div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground"><Mail className="h-3.5 w-3.5" /><span className="truncate max-w-[150px]">{patient.email}</span></div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell"><Badge variant="outline" className="font-bold">{patient.bloodType}</Badge></TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {patient.allergies.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {patient.allergies.slice(0, 2).map((allergy, i) => (<Badge key={i} variant="outline" className="text-xs border-destructive/30 text-destructive">{allergy}</Badge>))}
                          {patient.allergies.length > 2 && (<Badge variant="outline" className="text-xs">+{patient.allergies.length - 2}</Badge>)}
                        </div>
                      ) : (<span className="text-sm text-muted-foreground">Ninguna</span>)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="text-sm"><p>{patient.medicalHistory.length} consultas</p><p className="text-muted-foreground">{patient.vitalSigns.length} signos</p></div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem><Eye className="h-4 w-4 mr-2" />Ver Expediente</DropdownMenuItem>
                          <DropdownMenuItem><Edit className="h-4 w-4 mr-2" />Editar</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDeletePatient(patient.id)}><Trash2 className="h-4 w-4 mr-2" />Eliminar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
