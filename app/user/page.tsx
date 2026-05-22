"use client";
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Activity,
  Calendar,
  Stethoscope,
  ClipboardList,
  FileText,
  Pill,
  Heart,
  Thermometer,
  Scale,
  TrendingDown,
  Ruler,
  MapPin,
  Phone,
  Receipt,
  Clock,
  AlertCircle,
  ChevronDown,
  Bell,
  BellOff,
  FolderOpen,
  Filter,
  X,
  Plus,
  Search,
  Wind,
  Droplets,
  Trash2,
  Save,
  FileEdit,
  ChevronLeft,
  ChevronRight,
  CalendarPlus,
  DollarSign,
  Tag,
  Building2,
  Shield,
  UserPlus,
  UserCheck,
  BadgePercent,
  Baby,
  Syringe,
  FlaskConical,
  BookOpen,
  CheckCircle2,
  Circle,
  Folder,
  Menu,
  Settings,
  LogOut,
  Mail,
  ChevronRightIcon,
  Monitor,
  Sun,
  Moon,
} from "lucide-react";

// ─────────────────────────────────────────────
// PACIENTE SERVICE
// ─────────────────────────────────────────────

const API_BASE_URL = "http://localhost:3001/api";

const getAuthHeaders = (isMultipart = false): HeadersInit => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";
  const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
  if (!isMultipart) headers["Content-Type"] = "application/json";
  return headers;
};

const patientService = {

  claimPatient: (data: Record<string, unknown>) =>
    fetch(`${API_BASE_URL}/patients/claim`, { method: "POST", headers: getAuthHeaders(), body: JSON.stringify(data),}).then((r) => r.json()),

  getMyRecord: () =>
    fetch(`${API_BASE_URL}/patients/me`, { method: "GET", headers: getAuthHeaders(), }).then((r) => r.json()),
};

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

type ID = string;
type FechaISO = string;

interface DatosPersonales {
  id: ID;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  fechaNacimiento: FechaISO;
  sexo: "Masculino" | "Femenino" | "Otro";
  curp?: string;
  rfc?: string;
}

interface Direccion {
  calle: string;
  numeroExterior: string;
  numeroInterior?: string;
  colonia: string;
  ciudad: string;
  estado: string;
  codigoPostal: string;
  pais: string;
}

interface Contacto {
  telefono: string;
  telefonoEmergencia?: string;
  email?: string;
  nombreContactoEmergencia?: string;
}

interface DatosFiscales {
  razonSocial?: string;
  rfc?: string;
  usoCFDI?: string;
  regimenFiscal?: string;
  direccionFiscal?: Direccion;
}

interface SignosVitales {
  id: ID;
  fecha: FechaISO;
  peso: number;
  estatura: number;
  temperatura: number;
  frecuenciaCardiaca: number;
  presionSistolica: number;
  presionDiastolica: number;
  grasaCorporal?: number;
  indiceMasaCorporal?: number;
}

interface Cita {
  id: ID;
  pacienteId: ID;
  fecha: FechaISO;
  hora: string;
  motivo: string;
  estado: "Pendiente" | "Confirmada" | "Cancelada" | "Completada";
  notas?: string;
}

interface Visita {
  id: ID;
  pacienteId: ID;
  fecha: FechaISO;
  motivo: string;
  observaciones: string;
  signosVitales: SignosVitales;
}

interface Diagnostico {
  id: ID;
  pacienteId: ID;
  fecha: FechaISO;
  descripcion: string;
  tratamiento?: string;
  severidad?: "Leve" | "Moderado" | "Grave";
}

interface NotaMedica {
  id: ID;
  pacienteId: ID;
  fecha: FechaISO;
  contenido: string;
}

interface Medicamento {
  id: ID;
  pacienteId: ID;
  nombre: string;
  dosis: string;
  frecuencia: string;
  fechaInicio: FechaISO;
  fechaFin?: FechaISO;
}

interface Recordatorio {
  id: ID;
  medicamentoId: ID;
  hora: string;
  activo: boolean;
}

interface MiniDashboard {
  pacienteId: ID;
  ultimoRegistro: SignosVitales;
  ultimoDiagnostico?: Diagnostico;
  proximaCita?: Cita;
  medicamentosActivos: Medicamento[];
}

interface Paciente {
  id: ID;
  datosPersonales: DatosPersonales;
  direccion: Direccion;
  contacto: Contacto;
  datosFiscales?: DatosFiscales;
  signosVitales: SignosVitales[];
  citas: Cita[];
  visitas: Visita[];
  diagnosticos: Diagnostico[];
  notas: NotaMedica[];
  medicamentos: Medicamento[];
  recordatorios: Recordatorio[];
  dashboard?: MiniDashboard;
}

interface HistorialGinecologico {
  menarquia?: string;
  cicloRegular?: boolean;
  diasCiclo?: number;
  diasSangrado?: number;
  fum?: FechaISO;
  dismenorrea?: "Ninguna" | "Leve" | "Moderada" | "Severa";
  inicioVidaSexual?: string;
  numParejas?: number;
  metodoAnticonceptivo?: string;
  gestaciones?: number;
  partos?: number;
  cesareas?: number;
  abortos?: number;
  ectopicos?: number;
  ultimaCitologia?: FechaISO;
  resultadoCitologia?: string;
  ultimaColposcopia?: FechaISO;
  resultadoColposcopia?: string;
  ultimaMamografia?: FechaISO;
  resultadoMamografia?: string;
  autoexploracion?: boolean;
  ivsa?: string;
  ets?: string;
  vacunaVPH?: boolean;
  notas?: string;
}

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────

const pacienteMock: Paciente = {
  id: "",
  datosPersonales: {
    id: "",
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    fechaNacimiento: "",
    sexo: "Femenino",
    curp: "",
    rfc: "",
  },
  direccion: {
    calle: "",
    numeroExterior: "",
    numeroInterior: "",
    colonia: "",
    ciudad: "",
    estado: "",
    codigoPostal: "",
    pais: "",
  },
  contacto: {
    telefono: "",
    telefonoEmergencia: "",
    email: "",
    nombreContactoEmergencia: "",
  },
  datosFiscales: {
    razonSocial: "",
    rfc: "",
    usoCFDI: "",
    regimenFiscal: "",
  },
  signosVitales: [],
  citas: [],
  visitas: [],
  diagnosticos: [],
  notas: [],
  medicamentos: [],
  recordatorios: [],
  dashboard: undefined,
};

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const MESES_LARGO = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const DIAS_SEMANA = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

function fmtFecha(fecha: string, opts?: { weekday?: boolean; corto?: boolean }) {
  const d = new Date(fecha.includes("T") ? fecha : fecha + "T12:00:00");
  const dia = d.getUTCDate().toString().padStart(2, "0");
  const mes = opts?.corto ? MESES[d.getUTCMonth()] : MESES_LARGO[d.getUTCMonth()];
  const anio = d.getUTCFullYear();
  if (opts?.weekday) {
    const dow = DIAS_SEMANA[d.getUTCDay()];
    return `${dow}, ${dia} de ${mes} de ${anio}`;
  }
  return `${dia} de ${mes} de ${anio}`;
}

function fmtFechaHora(fecha: string) {
  const d = new Date(fecha);
  const dia = d.getUTCDate().toString().padStart(2, "0");
  const mes = MESES[d.getUTCMonth()];
  const anio = d.getUTCFullYear();
  const hh = d.getUTCHours().toString().padStart(2, "0");
  const mm = d.getUTCMinutes().toString().padStart(2, "0");
  return `${dia} ${mes} ${anio}, ${hh}:${mm}`;
}

function calcularEdad(fechaNacimiento: string) {
  const hoy = new Date();
  const nac = new Date(fechaNacimiento + "T12:00:00");
  let edad = hoy.getFullYear() - nac.getFullYear();
  const m = hoy.getMonth() - nac.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
  return edad;
}

function imcCategoria(imc: number) {
  if (imc < 18.5) return { label: "Bajo peso", cls: "text-blue-600" };
  if (imc < 25) return { label: "Normal", cls: "text-emerald-600" };
  if (imc < 30) return { label: "Sobrepeso", cls: "text-amber-600" };
  return { label: "Obesidad", cls: "text-red-600" };
}

function presionCategoria(sis: number, dia: number) {
  if (sis < 120 && dia < 80) return { label: "Normal", cls: "text-emerald-600" };
  if (sis < 130 && dia < 80) return { label: "Elevada", cls: "text-amber-600" };
  return { label: "Alta", cls: "text-red-600" };
}

// ─────────────────────────────────────────────
// AVATAR COMPONENT
// ─────────────────────────────────────────────

function AvatarPaciente({ nombre, sexo }: { nombre: string; sexo: "Masculino" | "Femenino" | "Otro" }) {
  const initials = nombre.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const bgColor = sexo === "Femenino" ? "from-rose-400 to-pink-500" : sexo === "Masculino" ? "from-sky-400 to-blue-500" : "from-slate-400 to-slate-500";
  
  return (
    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${bgColor} flex items-center justify-center shadow-lg shadow-primary/20`}>
      <span className="text-xl font-bold text-white tracking-tight">{initials}</span>
    </div>
  );
}

// ─────────────────────────────────────────────
// SHARED COMPONENTS
// ─────────────────────────────────────────────

function SectionCard({ icon, title, children, className = "" }: { icon: React.ReactNode; title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-card border border-border rounded-2xl p-6 shadow-sm ${className}`}>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <span className="text-primary">{icon}</span>
        </div>
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function FieldItem({ label, value, icon }: { label: string; value?: string; icon?: React.ReactNode }) {
  if (!value) return null;
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
        {icon && <span className="opacity-60">{icon}</span>}
        {label}
      </p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

function StatCard({ icon, label, value, unit, status, statusColor }: { icon: React.ReactNode; label: string; value: string; unit?: string; status?: string; statusColor?: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-md hover:border-primary/20 transition-all duration-200">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
          <p className="text-2xl font-bold text-foreground tracking-tight">
            {value}
            {unit && <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>}
          </p>
          {status && <p className={`text-xs font-semibold mt-1 ${statusColor}`}>{status}</p>}
        </div>
      </div>
    </div>
  );
}

const estadoConfig: Record<string, { cls: string; dot: string; bg: string }> = {
  Pendiente: { cls: "text-amber-700", dot: "bg-amber-500", bg: "bg-amber-50 border-amber-200" },
  Confirmada: { cls: "text-primary", dot: "bg-primary", bg: "bg-primary/10 border-primary/20" },
  Cancelada: { cls: "text-red-600", dot: "bg-red-500", bg: "bg-red-50 border-red-200" },
  Completada: { cls: "text-emerald-600", dot: "bg-emerald-500", bg: "bg-emerald-50 border-emerald-200" },
};

const severidadConfig: Record<string, { cls: string; dot: string; bg: string }> = {
  Leve: { cls: "text-emerald-600", dot: "bg-emerald-500", bg: "bg-emerald-50 border-emerald-200" },
  Moderado: { cls: "text-amber-700", dot: "bg-amber-500", bg: "bg-amber-50 border-amber-200" },
  Grave: { cls: "text-red-600", dot: "bg-red-500", bg: "bg-red-50 border-red-200" },
};

// ─────────────────────────────────────────────
// TAB: DASHBOARD
// ─────────────────────────────────────────────

function DashboardTab({ dashboard }: { dashboard: MiniDashboard }) {
  const sv = dashboard.ultimoRegistro;
  
  const vitales = [
    { icon: <Heart className="w-6 h-6 text-rose-500" />, label: "Presión arterial", value: `${sv.presionSistolica}/${sv.presionDiastolica}`, unit: "mmHg", status: presionCategoria(sv.presionSistolica, sv.presionDiastolica).label, statusColor: presionCategoria(sv.presionSistolica, sv.presionDiastolica).cls },
    { icon: <Activity className="w-6 h-6 text-primary" />, label: "Frec. cardíaca", value: `${sv.frecuenciaCardiaca}`, unit: "bpm" },
    { icon: <Thermometer className="w-6 h-6 text-amber-500" />, label: "Temperatura", value: `${sv.temperatura}`, unit: "°C" },
    { icon: <Scale className="w-6 h-6 text-sky-500" />, label: "Peso", value: `${sv.peso}`, unit: "kg" },
    { icon: <TrendingDown className="w-6 h-6 text-emerald-500" />, label: "IMC", value: sv.indiceMasaCorporal ? sv.indiceMasaCorporal.toFixed(1) : "—", status: sv.indiceMasaCorporal ? imcCategoria(sv.indiceMasaCorporal).label : undefined, statusColor: sv.indiceMasaCorporal ? imcCategoria(sv.indiceMasaCorporal).cls : undefined },
    { icon: <Scale className="w-6 h-6 text-violet-500" />, label: "Grasa corporal", value: sv.grasaCorporal ? `${sv.grasaCorporal}` : "—", unit: sv.grasaCorporal ? "%" : "" },
  ];

  return (
    <div className="space-y-8">
      {/* Vitals Section */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Signos Vitales</h3>
              <p className="text-sm text-muted-foreground">Último registro: {fmtFecha(sv.fecha)}</p>
            </div>
          </div>
          <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            Ver historial
          </button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {vitales.map((v) => (
            <StatCard key={v.label} {...v} />
          ))}
        </div>
      </section>

      {/* Cards Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Next Appointment */}
        {dashboard.proximaCita && (
          <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 border border-primary/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-xs font-medium text-primary uppercase tracking-wider">Próxima Cita</p>
                <h4 className="text-lg font-bold text-foreground">{dashboard.proximaCita.motivo}</h4>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {fmtFecha(dashboard.proximaCita.fecha)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {dashboard.proximaCita.hora}
              </span>
            </div>
            <span className={`inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-full border font-medium ${estadoConfig[dashboard.proximaCita.estado]?.bg} ${estadoConfig[dashboard.proximaCita.estado]?.cls}`}>
              <span className={`w-2 h-2 rounded-full ${estadoConfig[dashboard.proximaCita.estado]?.dot}`} />
              {dashboard.proximaCita.estado}
            </span>
          </div>
        )}

        {/* Last Diagnosis */}
        {dashboard.ultimoDiagnostico && (
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Último Diagnóstico</p>
                <h4 className="text-lg font-bold text-foreground">{dashboard.ultimoDiagnostico.descripcion}</h4>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{fmtFecha(dashboard.ultimoDiagnostico.fecha)}</p>
            {dashboard.ultimoDiagnostico.severidad && (
              <span className={`inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-full border font-medium ${severidadConfig[dashboard.ultimoDiagnostico.severidad]?.bg} ${severidadConfig[dashboard.ultimoDiagnostico.severidad]?.cls}`}>
                <span className={`w-2 h-2 rounded-full ${severidadConfig[dashboard.ultimoDiagnostico.severidad]?.dot}`} />
                {dashboard.ultimoDiagnostico.severidad}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Active Medications */}
      {dashboard.medicamentosActivos.length > 0 && (
        <section className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Pill className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Medicamentos Activos</h3>
              <p className="text-sm text-muted-foreground">{dashboard.medicamentosActivos.length} medicamento(s) en tratamiento</p>
            </div>
          </div>
          <div className="space-y-3">
            {dashboard.medicamentosActivos.map((med) => (
              <div key={med.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50 hover:border-primary/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <Pill className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{med.nombre}</p>
                    <p className="text-sm text-muted-foreground">{med.dosis} — {med.frecuencia}</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Activo
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// TAB: DATOS GENERALES
// ─────────────────────────────────────────────

function DatosGeneralesTab({
  datosPersonales, direccion, contacto, datosFiscales,
}: {
  datosPersonales: DatosPersonales;
  direccion: Direccion;
  contacto: Contacto;
  datosFiscales?: DatosFiscales;
}) {
  const edad = calcularEdad(datosPersonales.fechaNacimiento);
  const nombreCompleto = [datosPersonales.nombre, datosPersonales.apellidoPaterno, datosPersonales.apellidoMaterno].filter(Boolean).join(" ");

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <SectionCard icon={<User className="w-5 h-5" />} title="Datos Personales">
        <div className="grid grid-cols-2 gap-5">
          <div className="col-span-2"><FieldItem label="Nombre completo" value={nombreCompleto} /></div>
          <FieldItem label="Fecha de nacimiento" value={fmtFecha(datosPersonales.fechaNacimiento)} />
          <FieldItem label="Edad" value={`${edad} años`} />
          <FieldItem label="Sexo" value={datosPersonales.sexo} />
          <FieldItem label="CURP" value={datosPersonales.curp} />
          <div className="col-span-2"><FieldItem label="RFC" value={datosPersonales.rfc} /></div>
        </div>
      </SectionCard>

      <SectionCard icon={<Phone className="w-5 h-5" />} title="Información de Contacto">
        <div className="grid grid-cols-2 gap-5">
          <FieldItem label="Teléfono" value={contacto.telefono} icon={<Phone className="w-3 h-3" />} />
          <FieldItem label="Correo electrónico" value={contacto.email} icon={<Mail className="w-3 h-3" />} />
          <div className="col-span-2 pt-3 mt-3 border-t border-border">
            <p className="text-xs font-medium text-destructive/80 uppercase tracking-wider mb-3">Contacto de Emergencia</p>
            <div className="grid grid-cols-2 gap-5">
              <FieldItem label="Nombre" value={contacto.nombreContactoEmergencia} />
              <FieldItem label="Teléfono" value={contacto.telefonoEmergencia} />
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard icon={<MapPin className="w-5 h-5" />} title="Domicilio">
        <div className="grid grid-cols-2 gap-5">
          <div className="col-span-2">
            <FieldItem label="Calle y número" value={`${direccion.calle} #${direccion.numeroExterior}${direccion.numeroInterior ? ` Int. ${direccion.numeroInterior}` : ""}`} />
          </div>
          <FieldItem label="Colonia" value={direccion.colonia} />
          <FieldItem label="Ciudad" value={direccion.ciudad} />
          <FieldItem label="Estado" value={direccion.estado} />
          <FieldItem label="Código Postal" value={direccion.codigoPostal} />
          <div className="col-span-2"><FieldItem label="País" value={direccion.pais} /></div>
        </div>
      </SectionCard>

      {datosFiscales && (
        <SectionCard icon={<Receipt className="w-5 h-5" />} title="Datos Fiscales">
          <div className="grid grid-cols-2 gap-5">
            <div className="col-span-2"><FieldItem label="Razón social" value={datosFiscales.razonSocial} /></div>
            <FieldItem label="RFC" value={datosFiscales.rfc} />
            <FieldItem label="Régimen fiscal" value={datosFiscales.regimenFiscal} />
            <div className="col-span-2"><FieldItem label="Uso de CFDI" value={datosFiscales.usoCFDI} /></div>
          </div>
        </SectionCard>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// TAB: SIGNOS VITALES
// ─────────────────────────────────────────────

function SignosVitalesTab({ signosVitales }: { signosVitales: SignosVitales[] }) {
  const ordenados = [...signosVitales].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  const ultimo = ordenados[0];

  const vitales = ultimo ? [
    { icon: <Heart className="w-6 h-6 text-rose-500" />, label: "Presión arterial", value: `${ultimo.presionSistolica}/${ultimo.presionDiastolica}`, unit: "mmHg", status: presionCategoria(ultimo.presionSistolica, ultimo.presionDiastolica).label, statusColor: presionCategoria(ultimo.presionSistolica, ultimo.presionDiastolica).cls },
    { icon: <Activity className="w-6 h-6 text-primary" />, label: "Frec. cardíaca", value: `${ultimo.frecuenciaCardiaca}`, unit: "bpm" },
    { icon: <Thermometer className="w-6 h-6 text-amber-500" />, label: "Temperatura", value: `${ultimo.temperatura}`, unit: "°C" },
    { icon: <Scale className="w-6 h-6 text-sky-500" />, label: "Peso", value: `${ultimo.peso}`, unit: "kg" },
    { icon: <Ruler className="w-6 h-6 text-slate-400" />, label: "Estatura", value: `${ultimo.estatura}`, unit: "cm" },
    { icon: <TrendingDown className="w-6 h-6 text-emerald-500" />, label: "IMC", value: ultimo.indiceMasaCorporal ? `${ultimo.indiceMasaCorporal.toFixed(1)}` : "—", status: ultimo.indiceMasaCorporal ? imcCategoria(ultimo.indiceMasaCorporal).label : undefined, statusColor: ultimo.indiceMasaCorporal ? imcCategoria(ultimo.indiceMasaCorporal).cls : undefined },
  ] : [];

  return (
    <div className="space-y-8">
      {ultimo && (
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Último Registro</h3>
              <p className="text-sm text-muted-foreground">{fmtFechaHora(ultimo.fecha)}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {vitales.map((v) => (
              <StatCard key={v.label} {...v} />
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Historial de Registros</h3>
        </div>
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  {["Fecha", "Peso", "Presión", "F.C.", "Temp.", "IMC"].map((h) => (
                    <th key={h} className={`px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider ${h === "Fecha" ? "text-left" : "text-right"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ordenados.map((sv, i) => (
                  <tr key={sv.id} className={`border-b border-border last:border-0 hover:bg-muted/20 transition-colors ${i === 0 ? "bg-primary/5" : ""}`}>
                    <td className="px-5 py-4 text-foreground">
                      <div className="flex items-center gap-2">
                        {i === 0 && <span className="text-xs bg-primary text-primary-foreground rounded-md px-2 py-1 font-medium">Actual</span>}
                        <span className="font-medium">{fmtFechaHora(sv.fecha)}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right text-foreground font-semibold">{sv.peso} kg</td>
                    <td className="px-5 py-4 text-right text-foreground font-semibold">{sv.presionSistolica}/{sv.presionDiastolica}</td>
                    <td className="px-5 py-4 text-right text-foreground">{sv.frecuenciaCardiaca} bpm</td>
                    <td className="px-5 py-4 text-right text-foreground">{sv.temperatura} °C</td>
                    <td className="px-5 py-4 text-right text-foreground">{sv.indiceMasaCorporal ? sv.indiceMasaCorporal.toFixed(1) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────
// TAB: EXPEDIENTE
// ─────────────────────────────────────────────

function ExpedienteTab({
  diagnosticos, citas, notas,
}: {
  diagnosticos: Diagnostico[];
  citas: Cita[];
  notas: NotaMedica[];
}) {
  const [fechaFiltro, setFechaFiltro] = useState("");

  type EntradaExpediente =
    | { tipo: "diagnostico"; fecha: string; data: Diagnostico }
    | { tipo: "cita"; fecha: string; data: Cita }
    | { tipo: "nota"; fecha: string; data: NotaMedica };

  const todasLasEntradas: EntradaExpediente[] = [
    ...diagnosticos.map((d) => ({ tipo: "diagnostico" as const, fecha: d.fecha.substring(0, 10), data: d })),
    ...citas.map((c) => ({ tipo: "cita" as const, fecha: c.fecha.substring(0, 10), data: c })),
    ...notas.map((n) => ({ tipo: "nota" as const, fecha: n.fecha.substring(0, 10), data: n })),
  ];

  const fechasFiltradas = fechaFiltro
    ? todasLasEntradas.filter((e) => e.fecha === fechaFiltro)
    : todasLasEntradas;

  const gruposFecha = new Map<string, EntradaExpediente[]>();
  for (const entrada of fechasFiltradas) {
    if (!gruposFecha.has(entrada.fecha)) gruposFecha.set(entrada.fecha, []);
    gruposFecha.get(entrada.fecha)!.push(entrada);
  }
  const grupos = Array.from(gruposFecha.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([fecha, entradas]) => ({ fecha, entradas }));

  const fechasDisponibles = Array.from(new Set(todasLasEntradas.map((e) => e.fecha))).sort((a, b) => b.localeCompare(a));
  const [gruposAbiertos, setGruposAbiertos] = useState<Set<string>>(new Set());
  const toggleGrupo = (fecha: string) =>
    setGruposAbiertos((prev) => {
      const next = new Set(prev);
      next.has(fecha) ? next.delete(fecha) : next.add(fecha);
      return next;
    });

  const renderEntrada = (entrada: EntradaExpediente) => {
    if (entrada.tipo === "diagnostico") {
      const dx = entrada.data;
      const cfg = dx.severidad ? severidadConfig[dx.severidad] : null;
      return (
        <div key={dx.id} className="bg-background border border-border rounded-xl p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <ClipboardList className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Diagnóstico</p>
                <p className="font-semibold text-foreground text-sm">{dx.descripcion}</p>
              </div>
            </div>
            {cfg && (
              <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium shrink-0 ${cfg.bg} ${cfg.cls}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />{dx.severidad}
              </span>
            )}
          </div>
          {dx.tratamiento && (
            <div className="bg-muted/30 rounded-xl px-4 py-3 ml-13">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-primary shrink-0" />
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Plan de tratamiento</p>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{dx.tratamiento}</p>
            </div>
          )}
        </div>
      );
    }

    if (entrada.tipo === "cita") {
      const cita = entrada.data;
      const cfg = estadoConfig[cita.estado];
      return (
        <div key={cita.id} className="bg-background border border-border rounded-xl p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-sky-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Cita — {cita.hora}</p>
                <p className="font-semibold text-foreground text-sm">{cita.motivo}</p>
              </div>
            </div>
            <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium shrink-0 ${cfg.bg} ${cfg.cls}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />{cita.estado}
            </span>
          </div>
          {cita.notas && (
            <div className="flex gap-2 text-sm text-muted-foreground bg-muted/30 rounded-xl px-4 py-3 ml-13">
              <FileText className="w-4 h-4 mt-0.5 shrink-0" />
              <span className="leading-relaxed">{cita.notas}</span>
            </div>
          )}
        </div>
      );
    }

    const nota = entrada.data as NotaMedica;
    return (
      <div key={nota.id} className="bg-background border border-border rounded-xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nota médica — {fmtFechaHora(nota.fecha).split(", ")[1]}</p>
        </div>
        <p className="text-sm text-foreground leading-relaxed ml-13">{nota.contenido}</p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header + Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <FolderOpen className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Expediente Clínico</h3>
            <p className="text-sm text-muted-foreground">{todasLasEntradas.length} registro(s) en total</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          <select
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
            className="text-sm border border-border rounded-xl px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            aria-label="Filtrar por fecha"
          >
            <option value="">Todas las fechas</option>
            {fechasDisponibles.map((f) => (
              <option key={f} value={f}>{fmtFecha(f)}</option>
            ))}
          </select>
          {fechaFiltro && (
            <button
              onClick={() => setFechaFiltro("")}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Quitar filtro"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Groups */}
      {grupos.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-base font-medium">No hay registros para la fecha seleccionada</p>
        </div>
      ) : (
        grupos.map(({ fecha, entradas }) => {
          const isOpen = gruposAbiertos.has(fecha);
          const badges = {
            diagnostico: entradas.filter((e) => e.tipo === "diagnostico").length,
            cita: entradas.filter((e) => e.tipo === "cita").length,
            nota: entradas.filter((e) => e.tipo === "nota").length,
          };
          return (
            <div
              key={fecha}
              className={`border rounded-2xl overflow-hidden transition-all duration-200 ${isOpen ? "border-primary/40 shadow-md" : "border-border"}`}
            >
              <button
                onClick={() => toggleGrupo(fecha)}
                className="w-full text-left flex items-center justify-between gap-4 px-6 py-5 bg-card hover:bg-muted/30 transition-colors"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isOpen ? "bg-primary/10" : "bg-muted"}`}>
                    <Folder className={`w-5 h-5 ${isOpen ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground">{fmtFecha(fecha, { weekday: true })}</p>
                    <div className="flex flex-wrap gap-3 mt-1">
                      {badges.diagnostico > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <ClipboardList className="w-3.5 h-3.5" />{badges.diagnostico}
                        </span>
                      )}
                      {badges.cita > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5" />{badges.cita}
                        </span>
                      )}
                      {badges.nota > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <FileText className="w-3.5 h-3.5" />{badges.nota}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-4 border-t border-border bg-card space-y-3">
                  {entradas.map((e) => renderEntrada(e))}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// TAB: MEDICAMENTOS
// ─────────────────────────────────────────────

function MedicamentosTab({ medicamentos, recordatorios }: { medicamentos: Medicamento[]; recordatorios: Recordatorio[] }) {
  const activos = medicamentos.filter((m) => !m.fechaFin || new Date(m.fechaFin) >= new Date());
  const finalizados = medicamentos.filter((m) => m.fechaFin && new Date(m.fechaFin) < new Date());
  const getRecs = (medId: string) => recordatorios.filter((r) => r.medicamentoId === medId);

  const renderMed = (med: Medicamento, esActivo: boolean) => {
    const recs = getRecs(med.id);
    return (
      <div key={med.id} className={`bg-card border rounded-2xl p-5 space-y-4 transition-all hover:shadow-md ${esActivo ? "border-border hover:border-primary/20" : "border-border/50 opacity-70"}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${esActivo ? "bg-emerald-100" : "bg-muted"}`}>
              <Pill className={`w-6 h-6 ${esActivo ? "text-emerald-600" : "text-muted-foreground"}`} />
            </div>
            <div>
              <p className="font-semibold text-foreground text-lg">{med.nombre}</p>
              <p className="text-sm text-muted-foreground">{med.dosis} — {med.frecuencia}</p>
            </div>
          </div>
          <span className={`text-xs px-3 py-1.5 rounded-full border font-medium shrink-0 ${esActivo ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-muted text-muted-foreground border-border"}`}>
            {esActivo ? "Activo" : "Finalizado"}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            Inicio: {fmtFecha(med.fechaInicio, { corto: true })}
          </span>
          {med.fechaFin && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              Fin: {fmtFecha(med.fechaFin, { corto: true })}
            </span>
          )}
        </div>
        {recs.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {recs.map((rec) => (
              <span key={rec.id} className={`inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-xl border ${rec.activo ? "bg-primary/5 text-primary border-primary/20" : "bg-muted text-muted-foreground border-border"}`}>
                {rec.activo ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                {rec.hora}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {activos.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Pill className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Medicamentos Activos</h3>
              <p className="text-sm text-muted-foreground">{activos.length} medicamento(s)</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">{activos.map((m) => renderMed(m, true))}</div>
        </section>
      )}
      {finalizados.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <Pill className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Medicamentos Anteriores</h3>
              <p className="text-sm text-muted-foreground">{finalizados.length} medicamento(s)</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">{finalizados.map((m) => renderMed(m, false))}</div>
        </section>
      )}
      {medicamentos.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Pill className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-base font-medium">No hay medicamentos registrados</p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// TABS CONFIG
// ─────────────────────────────────────────────

const tabs = [
  { id: "dashboard", label: "Resumen", icon: LayoutDashboard },
  { id: "datos", label: "Datos Generales", icon: User },
  { id: "signos", label: "Signos Vitales", icon: Activity },
  { id: "expediente", label: "Expediente", icon: FolderOpen },
  { id: "medicamentos", label: "Medicamentos", icon: Pill },
] as const;

type TabId = (typeof tabs)[number]["id"];

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────

export default function Page() {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  //const [paciente, setPaciente] = useState<Paciente | null>(null);
  //const [loading, setLoading] = useState(true);
  //const [error, setError] = useState("");
  const paciente = pacienteMock;
  const dp = paciente.datosPersonales;
  const nombreCompleto = [dp.nombre, dp.apellidoPaterno, dp.apellidoMaterno].filter(Boolean).join(" ");
  const edad = calcularEdad(dp.fechaNacimiento);

  const router = useRouter();

// useEffect(() => {
//   loadPatient();
// }, []);

// const loadPatient = async () => {
//   try {
//     setLoading(true);

//     const response = await patientService.getMyRecord();

//     if (response.success) {
//       setPaciente(response.data);
//     } else {
//       setError(response.message || "No se pudo cargar");
//     }
//   } catch (err) {
//     console.error(err);
//     setError("Error de conexión");
//   } finally {
//     setLoading(false);
//   }
// };

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

// if (loading) {
//   return <div className="p-10">Cargando expediente...</div>;
// }

// if (error) {
//   return <div className="p-10 text-red-500">{error}</div>;
// }

// if (!paciente) {
//   return <div className="p-10">No existe expediente</div>;
// }

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-sidebar-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-sidebar-foreground tracking-tight">MediRecord</h1>
                <p className="text-xs text-sidebar-foreground/60">Sistema de Expedientes</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setActiveTab(id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === id
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/20"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
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
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl hover:bg-muted transition-colors"
                aria-label="Abrir menú"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-foreground">{tabs.find((t) => t.id === activeTab)?.label}</h1>
                <p className="text-sm text-muted-foreground hidden sm:block">Expediente de {dp?.nombre ?? ""} {dp?.apellidoPaterno ?? ""}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-xl hover:bg-muted transition-colors">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              </button>
              <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-border">
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-foreground">DR</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-foreground">Dr. Rodríguez</p>
                  <p className="text-xs text-muted-foreground">Ginecología</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 lg:p-8 max-w-7xl">
          {activeTab === "dashboard" && paciente.dashboard && <DashboardTab dashboard={paciente.dashboard} />}
          {activeTab === "datos" && <DatosGeneralesTab datosPersonales={paciente.datosPersonales} direccion={paciente.direccion} contacto={paciente.contacto} datosFiscales={paciente.datosFiscales} />}
          {activeTab === "signos" && <SignosVitalesTab signosVitales={paciente.signosVitales} />}
          {activeTab === "expediente" && <ExpedienteTab diagnosticos={paciente.diagnosticos} citas={paciente.citas} notas={paciente.notas} />}
          {activeTab === "medicamentos" && <MedicamentosTab medicamentos={paciente.medicamentos} recordatorios={paciente.recordatorios} />}
        </main>
      </div>
    </div>
  );
}