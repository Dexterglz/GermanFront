"use client";

import { useState, useEffect, useRef } from "react";
import type React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import {
  LayoutDashboard,
  User,
  Activity,
  Calendar,
  Stethoscope,
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
  Bell,
  BellOff,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  LogOut,
  Settings,
  Plus,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  FileText,
} from "lucide-react";

// ─────────────────────────────────────────────
// API CONFIG
// ─────────────────────────────────────────────

const BASE_URL = "http://localhost:3000/api";

// IDs internos: NO se muestran en el front, solo se usan para las llamadas a la API.
const CONTEXT_IDS = {
  pacienteId: "USR001",
  doctorId: "DOC001",
  citaId: "",
};

const getAuthHeaders = (): HeadersInit => {
  const token =
    typeof window !== "undefined" ? (localStorage.getItem("token") ?? "") : "";
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
};
const patientService = {
  getMyAppointments: () =>
    fetch(`${BASE_URL}/appointments`, { method: "GET", headers: getAuthHeaders() }).then((r) => r.json()),
};

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

type ID = string;
type FechaISO = string;

interface DatosPersonales {
  id: ID; nombre: string; apellidoPaterno: string; apellidoMaterno?: string;
  fechaNacimiento: FechaISO; sexo: "Masculino" | "Femenino" | "Otro";
  curp?: string; rfc?: string;
}
interface Direccion {
  calle: string; numeroExterior: string; numeroInterior?: string;
  colonia: string; ciudad: string; estado: string; codigoPostal: string; pais: string;
}
interface Contacto {
  telefono: string; telefonoEmergencia?: string; email?: string; nombreContactoEmergencia?: string;
}
interface DatosFiscales {
  razonSocial?: string; rfc?: string; usoCFDI?: string; regimenFiscal?: string;
}
interface SignosVitales {
  id: ID; fecha: FechaISO; peso: number; estatura: number; temperatura: number;
  frecuenciaCardiaca: number; presionSistolica: number; presionDiastolica: number;
  grasaCorporal?: number; indiceMasaCorporal?: number;
}
interface Cita {
  id: ID; pacienteId: ID; doctorId: ID; fecha: FechaISO; hora: string; motivo: string;
  estado: "Pendiente" | "Confirmada" | "Cancelada" | "Completada"; notas?: string;
}
interface Visita {
  id: ID; pacienteId: ID; doctorId: ID; fecha: FechaISO; motivo: string; observaciones: string; signosVitales: SignosVitales;
}
interface Diagnostico {
  id: ID; pacienteId: ID; fecha: FechaISO; descripcion: string; tratamiento?: string;
  severidad?: "Leve" | "Moderado" | "Grave";
}
interface Medicamento {
  id: ID; pacienteId: ID; nombre: string; dosis: string; frecuencia: string;
  fechaInicio: FechaISO; fechaFin?: FechaISO;
}
interface Recordatorio { id: ID; medicamentoId: ID; hora: string; activo: boolean; }
interface MiniDashboard {
  pacienteId: ID; ultimoRegistro: SignosVitales; ultimoDiagnostico?: Diagnostico;
  proximaCita?: Cita; medicamentosActivos: Medicamento[];
}
interface Paciente {
  id: ID; datosPersonales: DatosPersonales; direccion: Direccion; contacto: Contacto;
  datosFiscales?: DatosFiscales; signosVitales: SignosVitales[]; citas: Cita[];
  visitas: Visita[]; diagnosticos: Diagnostico[]; medicamentos: Medicamento[];
  recordatorios: Recordatorio[]; dashboard?: MiniDashboard;
}

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────

const pacienteMock: Paciente = {
  id: "PAC-001",
  datosPersonales: {
    id: "DP-001", nombre: "Carlos Eduardo", apellidoPaterno: "Ramírez",
    apellidoMaterno: "Herrera", fechaNacimiento: "1985-07-14", sexo: "Masculino",
    curp: "RAHC850714HDFMRL09", rfc: "RAHC850714AB1",
  },
  direccion: {
    calle: "Av. Insurgentes Sur", numeroExterior: "1234", numeroInterior: "5B",
    colonia: "Del Valle", ciudad: "Ciudad de México", estado: "CDMX",
    codigoPostal: "03100", pais: "México",
  },
  contacto: {
    telefono: "55 1234 5678", telefonoEmergencia: "55 9876 5432",
    email: "carlos.ramirez@email.com", nombreContactoEmergencia: "Laura Herrera (Esposa)",
  },
  datosFiscales: {
    razonSocial: "Carlos Eduardo Ramírez Herrera", rfc: "RAHC850714AB1",
    usoCFDI: "G03 - Gastos en general", regimenFiscal: "601 - General de Ley Personas Morales",
  },
  signosVitales: [
    { id: "SV-001", fecha: "2024-01-15T09:30:00Z", peso: 78.5, estatura: 175, temperatura: 36.8, frecuenciaCardiaca: 72, presionSistolica: 120, presionDiastolica: 80, grasaCorporal: 18.5, indiceMasaCorporal: 25.6 },
    { id: "SV-002", fecha: "2024-02-20T10:00:00Z", peso: 77.2, estatura: 175, temperatura: 36.5, frecuenciaCardiaca: 68, presionSistolica: 118, presionDiastolica: 78, grasaCorporal: 17.8, indiceMasaCorporal: 25.2 },
    { id: "SV-003", fecha: "2024-03-10T11:15:00Z", peso: 76.0, estatura: 175, temperatura: 36.6, frecuenciaCardiaca: 70, presionSistolica: 115, presionDiastolica: 75, grasaCorporal: 17.2, indiceMasaCorporal: 24.8 },
  ],
  citas: [
    { id: "CIT-001", pacienteId: "PAC-001", doctorId: "DOC-001", fecha: "2024-04-05", hora: "10:00", motivo: "Revisión general anual", estado: "Completada", notas: "Paciente en buen estado general." },
    { id: "CIT-002", pacienteId: "PAC-001", doctorId: "DOC-001", fecha: "2024-05-15", hora: "09:30", motivo: "Seguimiento de hipertensión", estado: "Confirmada" },
    { id: "CIT-003", pacienteId: "PAC-001", doctorId: "DOC-002", fecha: "2024-06-20", hora: "11:00", motivo: "Control de medicamentos", estado: "Pendiente" },
  ],
  visitas: [
    { id: "VIS-001", pacienteId: "PAC-001", doctorId: "DOC-001", fecha: "2024-01-15T09:30:00Z", motivo: "Revisión de rutina", observaciones: "Paciente refiere leve dolor de cabeza recurrente.", signosVitales: { id: "SV-001", fecha: "2024-01-15T09:30:00Z", peso: 78.5, estatura: 175, temperatura: 36.8, frecuenciaCardiaca: 72, presionSistolica: 120, presionDiastolica: 80, indiceMasaCorporal: 25.6 } },
    { id: "VIS-002", pacienteId: "PAC-001", doctorId: "DOC-001", fecha: "2024-02-20T10:00:00Z", motivo: "Seguimiento presión arterial", observaciones: "Mejoría notable. Presión arterial estable.", signosVitales: { id: "SV-002", fecha: "2024-02-20T10:00:00Z", peso: 77.2, estatura: 175, temperatura: 36.5, frecuenciaCardiaca: 68, presionSistolica: 118, presionDiastolica: 78, indiceMasaCorporal: 25.2 } },
  ],
  diagnosticos: [
    { id: "DX-001", pacienteId: "PAC-001", fecha: "2024-01-15", descripcion: "Hipertensión arterial leve", tratamiento: "Losartán 50mg cada 24 horas. Dieta baja en sodio.", severidad: "Leve" },
    { id: "DX-002", pacienteId: "PAC-001", fecha: "2024-02-20", descripcion: "Sobrepeso leve", tratamiento: "Plan nutricional, actividad física 30 min/día.", severidad: "Leve" },
  ],
  medicamentos: [
    { id: "MED-001", pacienteId: "PAC-001", nombre: "Losartán", dosis: "25 mg", frecuencia: "1 vez al día (mañana)", fechaInicio: "2024-01-15" },
    { id: "MED-002", pacienteId: "PAC-001", nombre: "Ácido fólico", dosis: "400 mcg", frecuencia: "1 vez al día", fechaInicio: "2024-01-15", fechaFin: "2024-04-15" },
    { id: "MED-003", pacienteId: "PAC-001", nombre: "Vitamina D3", dosis: "1000 UI", frecuencia: "1 vez al día", fechaInicio: "2024-02-20" },
  ],
  recordatorios: [
    { id: "REC-001", medicamentoId: "MED-001", hora: "08:00", activo: true },
    { id: "REC-002", medicamentoId: "MED-002", hora: "08:00", activo: false },
    { id: "REC-003", medicamentoId: "MED-003", hora: "12:00", activo: true },
  ],
  dashboard: {
    pacienteId: "PAC-001",
    ultimoRegistro: { id: "SV-003", fecha: "2024-03-10T11:15:00Z", peso: 76.0, estatura: 175, temperatura: 36.6, frecuenciaCardiaca: 70, presionSistolica: 115, presionDiastolica: 75, grasaCorporal: 17.2, indiceMasaCorporal: 24.8 },
    ultimoDiagnostico: { id: "DX-002", pacienteId: "PAC-001", fecha: "2024-02-20", descripcion: "Sobrepeso leve", tratamiento: "Plan nutricional, actividad física 30 min/día.", severidad: "Leve" },
    proximaCita: { id: "CIT-002", pacienteId: "PAC-001", doctorId: "DOC-001", fecha: "2024-05-15", hora: "09:30", motivo: "Seguimiento de hipertensión", estado: "Confirmada" },
    medicamentosActivos: [
      { id: "MED-001", pacienteId: "PAC-001", nombre: "Losartán", dosis: "25 mg", frecuencia: "1 vez al día (mañana)", fechaInicio: "2024-01-15" },
      { id: "MED-003", pacienteId: "PAC-001", nombre: "Vitamina D3", dosis: "1000 UI", frecuencia: "1 vez al día", fechaInicio: "2024-02-20" },
    ],
  },
};

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

const MESES = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
const MESES_LARGO = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
const DIAS_SEMANA = ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"];

function fmtFecha(fecha: string, opts?: { weekday?: boolean; corto?: boolean }) {
  const d = new Date(fecha.includes("T") ? fecha : fecha + "T12:00:00");
  const dia = d.getUTCDate().toString().padStart(2, "0");
  const mes = opts?.corto ? MESES[d.getUTCMonth()] : MESES_LARGO[d.getUTCMonth()];
  const anio = d.getUTCFullYear();
  if (opts?.weekday) return `${DIAS_SEMANA[d.getUTCDay()]}, ${dia} de ${mes} de ${anio}`;
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
  if (imc < 18.5) return { label: "Bajo peso", cls: "text-blue-500" };
  if (imc < 25) return { label: "Normal", cls: "text-emerald-500" };
  if (imc < 30) return { label: "Sobrepeso", cls: "text-amber-600" };
  return { label: "Obesidad", cls: "text-red-500" };
}

function presionCategoria(sis: number, dia: number) {
  if (sis < 120 && dia < 80) return { label: "Normal", cls: "text-emerald-500" };
  if (sis < 130 && dia < 80) return { label: "Elevada", cls: "text-amber-600" };
  return { label: "Alta", cls: "text-red-500" };
}

// ─────────────────────────────────────────────
// API FORM DRAWER
// ─────────────────────────────────────────────

type FieldDef = {
  key: string;
  label: string;
  type?: "text" | "number" | "textarea" | "select";
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  hidden?: boolean;
};

type ApiStatus = "idle" | "loading" | "success" | "error";

function ApiDrawer({
  open,
  onClose,
  title,
  endpoint,
  method,
  fields,
  defaultValues,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  endpoint: string;
  method: "POST" | "PUT";
  fields: FieldDef[];
  defaultValues?: Record<string, string>;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<ApiStatus>("idle");
  const [responseMsg, setResponseMsg] = useState("");
  const drawerRef = useRef<HTMLDivElement>(null);

  const visibleFields = fields.filter((f) => !f.hidden);

  useEffect(() => {
    if (open) {
      const initial: Record<string, string> = {};
      fields.forEach((f) => {
        initial[f.key] = defaultValues?.[f.key] ?? "";
      });
      setValues(initial);
      setStatus("idle");
      setResponseMsg("");
    }
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setResponseMsg("");
    const body: Record<string, string | number> = {};
    fields.forEach((f) => {
      const raw = values[f.key] ?? "";
      if (f.hidden && raw === "") return;
      body[f.key] = f.type === "number" ? Number(raw) : raw;
    });
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus("success");
        setResponseMsg(data?.message ?? "Registrado correctamente.");
      } else {
        setStatus("error");
        setResponseMsg(data?.message ?? `Error ${res.status}: ${res.statusText}`);
      }
    } catch (err) {
      setStatus("error");
      setResponseMsg(err instanceof Error ? err.message : "Error de red. Verifica la conexión.");
    }
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`fixed right-0 top-0 h-full z-50 w-full max-w-[420px] bg-card border-l border-border shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Send className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground leading-tight">{title}</p>
            <p className="text-[11px] text-muted-foreground leading-none">
              {method} {BASE_URL}{endpoint}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form id="api-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {visibleFields.map((field) => (
            <div key={field.key} className="space-y-1.5">
              <label htmlFor={field.key} className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                {field.label}
                {field.required && <span className="text-red-400">*</span>}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  id={field.key}
                  value={values[field.key] ?? ""}
                  onChange={(e) => setValues((p) => ({ ...p, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  required={field.required}
                  rows={3}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2.5 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors resize-none"
                />
              ) : field.type === "select" ? (
                <select
                  id={field.key}
                  value={values[field.key] ?? ""}
                  onChange={(e) => setValues((p) => ({ ...p, [field.key]: e.target.value }))}
                  required={field.required}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2.5 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
                >
                  <option value="">Seleccionar...</option>
                  {field.options?.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              ) : (
                <input
                  id={field.key}
                  type={field.type === "number" ? "number" : "text"}
                  value={values[field.key] ?? ""}
                  onChange={(e) => setValues((p) => ({ ...p, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  required={field.required}
                  step={field.type === "number" ? "any" : undefined}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2.5 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
                />
              )}
            </div>
          ))}

          {status === "success" && (
            <div className="flex items-start gap-2.5 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
              <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <p className="text-sm text-emerald-700">{responseMsg}</p>
            </div>
          )}
          {status === "error" && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-600">{responseMsg}</p>
            </div>
          )}
        </form>

        <div className="px-5 py-4 border-t border-border shrink-0 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 text-sm font-medium border border-border rounded-lg py-2.5 text-muted-foreground hover:bg-muted transition-colors"
          >
            Cancelar
          </button>
          <button
            form="api-form"
            type="submit"
            disabled={status === "loading"}
            className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold bg-primary text-white rounded-lg py-2.5 hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {status === "loading" ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
            ) : (
              <><Send className="w-4 h-4" /> {method === "POST" ? "Guardar" : "Actualizar"}</>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// AVATAR
// ─────────────────────────────────────────────

function AvatarPaciente({ edad, sexo, size = "md" }: {
  edad: number; sexo: "Masculino" | "Femenino" | "Otro"; size?: "sm" | "md" | "lg";
}) {
  const isMasc = sexo === "Masculino";
  const isFem = sexo === "Femenino";
  const skinTone = "#f4c591";
  const hairColor = isMasc ? "#4a3728" : isFem ? "#8b4513" : "#5a5a5a";
  const shirtColor = isMasc ? "#3b82f6" : isFem ? "#ec4899" : "#6b7280";
  const pantColor = isMasc ? "#1e40af" : isFem ? "#9d174d" : "#374151";
  const sizeMap = { sm: { outer: "w-9 h-9", svg: 34 }, md: { outer: "w-14 h-14", svg: 52 }, lg: { outer: "w-20 h-20", svg: 72 } };
  const { outer, svg } = sizeMap[size];

  return (
    <div className={`${outer} rounded-full bg-muted border-2 border-border flex items-center justify-center overflow-hidden shrink-0`}>
      <svg viewBox="0 0 64 64" width={svg} height={svg} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="22" y="44" width="9" height="16" rx="3.5" fill={pantColor} />
        <rect x="33" y="44" width="9" height="16" rx="3.5" fill={pantColor} />
        {isFem
          ? <path d="M18 30 Q18 44 22 46 L42 46 Q46 44 46 30 Q40 34 32 34 Q24 34 18 30 Z" fill={shirtColor} />
          : <rect x="18" y="30" width="28" height="16" rx="5" fill={shirtColor} />}
        <rect x="6" y="31" width="13" height="7" rx="3.5" fill={shirtColor} />
        <rect x="45" y="31" width="13" height="7" rx="3.5" fill={shirtColor} />
        <circle cx="6" cy="34.5" r="4.5" fill={skinTone} />
        <circle cx="58" cy="34.5" r="4.5" fill={skinTone} />
        <rect x="28" y="23" width="8" height="9" rx="3" fill={skinTone} />
        <ellipse cx="32" cy="16" rx="12" ry="14" fill={skinTone} />
        {isFem ? (
          <>
            <ellipse cx="32" cy="4" rx="12" ry="6" fill={hairColor} />
            <ellipse cx="20" cy="14" rx="3" ry="11" fill={hairColor} />
            <ellipse cx="44" cy="14" rx="3" ry="11" fill={hairColor} />
          </>
        ) : (
          <>
            <ellipse cx="32" cy="4" rx="12" ry="6" fill={hairColor} />
            <rect x="20" y="3" width="24" height="7" rx="3" fill={hairColor} />
          </>
        )}
        <ellipse cx="26.5" cy="16" rx="2.8" ry="2.8" fill="#1a1a1a" />
        <ellipse cx="37.5" cy="16" rx="2.8" ry="2.8" fill="#1a1a1a" />
        <circle cx="27.5" cy="15" r="1.1" fill="white" />
        <circle cx="38.5" cy="15" r="1.1" fill="white" />
        <path d="M27.5 25 Q32 28.5 36.5 25" stroke="#c0725a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────
// SHARED MINI-COMPONENTS
// ─────────────────────────────────────────────

function SectionCard({ icon, title, children, accent, action }: {
  icon: React.ReactNode; title: string; children: React.ReactNode; accent?: string; action?: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-3">
        <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${accent ?? "bg-primary/10 text-primary"}`}>
          {icon}
        </span>
        <h3 className="text-sm font-semibold text-foreground flex-1">{title}</h3>
        {action && action}
      </div>
      {children}
    </div>
  );
}

function FieldItem({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="space-y-0.5">
      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{label}</p>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  );
}

function AddButton({ onClick, label = "Agregar" }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 text-xs font-medium text-primary border border-primary/30 bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors"
    >
      <Plus className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}

const estadoConfig: Record<string, { cls: string; dot: string }> = {
  Pendiente:  { cls: "bg-amber-50 text-amber-800 border-amber-200",       dot: "bg-amber-500" },
  Confirmada: { cls: "bg-blue-50 text-blue-700 border-blue-200",          dot: "bg-blue-500" },
  Cancelada:  { cls: "bg-red-50 text-red-700 border-red-200",             dot: "bg-red-500" },
  Completada: { cls: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
};

const severidadConfig: Record<string, { cls: string; dot: string }> = {
  Leve:     { cls: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  Moderado: { cls: "bg-amber-50 text-amber-800 border-amber-200",       dot: "bg-amber-500" },
  Grave:    { cls: "bg-red-50 text-red-700 border-red-200",             dot: "bg-red-500" },
};

// ─────────────────────────────────────────────
// API FIELD DEFINITIONS
// ─────────────────────────────────────────────

const FIELDS_DATOS_MEDICOS: FieldDef[] = [
  { key: "patient_id",       label: "ID del paciente",      hidden: true, required: true },
  { key: "blood_type",       label: "Tipo de sangre",       type: "select", required: true,
    options: ["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((v) => ({ value: v, label: v })) },
  { key: "allergies",        label: "Alergias",             type: "textarea", placeholder: "Penicilina, látex..." },
  { key: "chronic_diseases", label: "Enfermedades crónicas",type: "textarea", placeholder: "Diabetes tipo 2..." },
  { key: "surgeries",        label: "Cirugías",             type: "textarea", placeholder: "Apendicectomía..." },
  { key: "medications",      label: "Medicamentos",         type: "textarea", placeholder: "Metformina 500mg..." },
  { key: "family_history",   label: "Antecedentes familiares", type: "textarea", placeholder: "Hipertensión arterial..." },
];

const FIELDS_SIGNOS_VITALES: FieldDef[] = [
  { key: "patient_id",       label: "ID del paciente",    hidden: true, required: true },
  { key: "doctor_id",        label: "ID del doctor",      hidden: true, required: true },
  { key: "appointment_id",   label: "ID de cita",         hidden: true, type: "number" },
  { key: "blood_pressure",   label: "Presión arterial",   placeholder: "120/80", required: true },
  { key: "heart_rate",       label: "Frecuencia cardíaca",type: "number", placeholder: "72", required: true },
  { key: "respiratory_rate", label: "Frec. respiratoria", type: "number", placeholder: "18" },
  { key: "temperature",      label: "Temperatura (°C)",   type: "number", placeholder: "36.5", required: true },
  { key: "oxygen_saturation",label: "Saturación O₂ (%)",  type: "number", placeholder: "98" },
  { key: "weight",           label: "Peso (kg)",          type: "number", placeholder: "84.5", required: true },
  { key: "height",           label: "Estatura (m)",       type: "number", placeholder: "1.78", required: true },
  { key: "bmi",              label: "IMC",                type: "number", placeholder: "26.67" },
  { key: "glucose",          label: "Glucosa (mg/dL)",    type: "number", placeholder: "95" },
  { key: "notes",            label: "Notas",              type: "textarea", placeholder: "Paciente estable..." },
];

const FIELDS_SOAP: FieldDef[] = [
  { key: "patient_id",    label: "ID del paciente",  hidden: true, required: true },
  { key: "doctor_id",     label: "ID del doctor",    hidden: true, required: true },
  { key: "appointment_id",label: "ID de cita",       hidden: true, type: "number" },
  { key: "subjective",    label: "Subjetivo (S)",    type: "textarea", placeholder: "Dolor de cabeza desde hace 3 días...", required: true },
  { key: "objective",     label: "Objetivo (O)",     type: "textarea", placeholder: "TA 120/80, FC 72...", required: true },
  { key: "assessment",    label: "Análisis (A)",     type: "textarea", placeholder: "Cefalea tensional...", required: true },
  { key: "plan",          label: "Plan (P)",         type: "textarea", placeholder: "Reposo e hidratación...", required: true },
  { key: "diagnosis",     label: "Diagnóstico",      placeholder: "Cefalea tensional" },
  { key: "prescription",  label: "Prescripción",     type: "textarea", placeholder: "Paracetamol 500mg..." },
  { key: "observations",  label: "Observaciones",    type: "textarea", placeholder: "Paciente orientado..." },
];

const FIELDS_ALERGIAS: FieldDef[] = [
  { key: "patient_id",  label: "ID del paciente", hidden: true, required: true },
  { key: "allergy_type",label: "Tipo de alergia", type: "select", required: true,
    options: [
      { value: "MEDICAMENTO", label: "Medicamento" },
      { value: "ALIMENTO",    label: "Alimento" },
      { value: "AMBIENTAL",   label: "Ambiental" },
      { value: "OTRO",        label: "Otro" },
    ] },
  { key: "allergen",    label: "Alérgeno",        placeholder: "Penicilina", required: true },
  { key: "reaction",    label: "Reacción",        type: "textarea", placeholder: "Erupción cutánea..." },
  { key: "severity",    label: "Severidad",       type: "select", required: true,
    options: [
      { value: "LEVE",    label: "Leve" },
      { value: "MODERADA",label: "Moderada" },
      { value: "SEVERA",  label: "Severa" },
    ] },
  { key: "notes",       label: "Notas",           type: "textarea", placeholder: "Detectada en la infancia..." },
];

const FIELDS_PRESCRIPCION: FieldDef[] = [
  { key: "patient_id",      label: "ID del paciente",   hidden: true, required: true },
  { key: "doctor_id",       label: "ID del doctor",     hidden: true, required: true },
  { key: "appointment_id",  label: "ID de cita",        hidden: true, type: "number" },
  { key: "medication_type", label: "Tipo de medicamento", type: "select", required: true,
    options: [
      { value: "COMERCIAL", label: "Comercial" },
      { value: "GENERICO",  label: "Genérico" },
    ] },
  { key: "medication_name", label: "Nombre del medicamento", placeholder: "Tempra", required: true },
  { key: "dosage",          label: "Dosis",             placeholder: "500 mg", required: true },
  { key: "route",           label: "Vía de administración", type: "select", required: true,
    options: [
      { value: "ORAL",       label: "Oral" },
      { value: "INTRAVENOSA",label: "Intravenosa" },
      { value: "INTRAMUSCULAR", label: "Intramuscular" },
      { value: "TOPICA",     label: "Tópica" },
      { value: "SUBLINGUAL", label: "Sublingual" },
    ] },
  { key: "frequency_hours", label: "Frecuencia (horas)", type: "number", placeholder: "8", required: true },
  { key: "duration_days",   label: "Duración (días)",   type: "number", placeholder: "5" },
  { key: "instructions",    label: "Indicaciones",      type: "textarea", placeholder: "Tomar después de los alimentos..." },
];

const ID_DEFAULTS = {
  patient_id: CONTEXT_IDS.pacienteId,
  doctor_id: CONTEXT_IDS.doctorId,
  appointment_id: CONTEXT_IDS.citaId,
};

// ─────────────────────────────────────────────
// VITAL CARD
// ─────────────────────────────────────────────

function VitalCard({ icon, label, value, unit, status }: {
  icon: React.ReactNode; label: string; value: string; unit?: string;
  status?: { label: string; cls: string } | null;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex items-start gap-3">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider leading-tight">{label}</p>
        <p className="text-lg font-bold text-foreground leading-tight mt-0.5">
          {value}
          {unit && <span className="text-xs font-normal text-muted-foreground ml-1">{unit}</span>}
        </p>
        {status && <p className={`text-[11px] font-semibold mt-0.5 ${status.cls}`}>{status.label}</p>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// TAB: DASHBOARD
// ─────────────────────────────────────────────

function DashboardTab({ dashboard }: { dashboard: MiniDashboard }) {
  const sv = dashboard.ultimoRegistro;
  const vitales = [
    { icon: <Heart className="w-5 h-5 text-rose-500" />,        label: "Presión arterial", value: `${sv.presionSistolica}/${sv.presionDiastolica}`, unit: "mmHg", status: presionCategoria(sv.presionSistolica, sv.presionDiastolica) },
    { icon: <Activity className="w-5 h-5 text-primary" />,      label: "Frec. cardíaca",   value: `${sv.frecuenciaCardiaca}`,                        unit: "bpm",  status: null },
    { icon: <Thermometer className="w-5 h-5 text-amber-500" />, label: "Temperatura",      value: `${sv.temperatura}`,                               unit: "°C",   status: null },
    { icon: <Scale className="w-5 h-5 text-blue-500" />,        label: "Peso",             value: `${sv.peso}`,                                      unit: "kg",   status: null },
    { icon: <TrendingDown className="w-5 h-5 text-emerald-500" />, label: "IMC",           value: sv.indiceMasaCorporal ? sv.indiceMasaCorporal.toFixed(1) : "—", unit: "", status: sv.indiceMasaCorporal ? imcCategoria(sv.indiceMasaCorporal) : null },
    { icon: <Scale className="w-5 h-5 text-slate-400" />,       label: "Grasa corporal",   value: sv.grasaCorporal ? `${sv.grasaCorporal}` : "—",    unit: sv.grasaCorporal ? "%" : "", status: null },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full font-medium">
          Último registro — {fmtFecha(sv.fecha)}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {vitales.map((v) => <VitalCard key={v.label} {...v} />)}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {dashboard.proximaCita && (
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-semibold text-foreground">Próxima cita</h3>
            </div>
            <p className="font-semibold text-foreground text-sm leading-snug">{dashboard.proximaCita.motivo}</p>
            <p className="text-sm text-muted-foreground mt-1">{fmtFecha(dashboard.proximaCita.fecha)} — {dashboard.proximaCita.hora}</p>
            <div className="mt-3">
              <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${estadoConfig[dashboard.proximaCita.estado]?.cls}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${estadoConfig[dashboard.proximaCita.estado]?.dot}`} />
                {dashboard.proximaCita.estado}
              </span>
            </div>
          </div>
        )}
        {dashboard.ultimoDiagnostico && (
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Stethoscope className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-semibold text-foreground">Último diagnóstico</h3>
            </div>
            <p className="font-semibold text-foreground text-sm leading-snug">{dashboard.ultimoDiagnostico.descripcion}</p>
            <p className="text-xs text-muted-foreground mt-1">{fmtFecha(dashboard.ultimoDiagnostico.fecha)}</p>
            {dashboard.ultimoDiagnostico.severidad && (
              <div className="mt-3">
                <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-semibold ${severidadConfig[dashboard.ultimoDiagnostico.severidad]?.cls}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${severidadConfig[dashboard.ultimoDiagnostico.severidad]?.dot}`} />
                  {dashboard.ultimoDiagnostico.severidad}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
      {dashboard.medicamentosActivos.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Pill className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-semibold text-foreground">Medicamentos activos</h3>
            <span className="ml-auto text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {dashboard.medicamentosActivos.length}
            </span>
          </div>
          <div>
            {dashboard.medicamentosActivos.map((med, i) => (
              <div key={med.id} className={`flex items-center justify-between py-3 ${i < dashboard.medicamentosActivos.length - 1 ? "border-b border-border" : ""}`}>
                <div>
                  <p className="text-sm font-medium text-foreground">{med.nombre}</p>
                  <p className="text-xs text-muted-foreground">{med.dosis} — {med.frecuencia}</p>
                </div>
                <span className="inline-flex items-center text-xs px-2.5 py-1 rounded-full border font-medium bg-emerald-50 text-emerald-700 border-emerald-200">Activo</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// TAB: DATOS GENERALES
// ─────────────────────────────────────────────

function DatosGeneralesTab({ datosPersonales, direccion, contacto, datosFiscales }: {
  datosPersonales: DatosPersonales; direccion: Direccion; contacto: Contacto; datosFiscales?: DatosFiscales;
}) {
  const edad = calcularEdad(datosPersonales.fechaNacimiento);
  const nombreCompleto = [datosPersonales.nombre, datosPersonales.apellidoPaterno, datosPersonales.apellidoMaterno].filter(Boolean).join(" ");
  const [drawer, setDrawer] = useState<"datosMedicos" | "alergia" | null>(null);

  return (
    <>
      <div className="grid md:grid-cols-2 gap-4">
        <SectionCard
          icon={<User className="w-4 h-4" />}
          title="Datos Personales"
          accent="bg-primary/10 text-primary"
          action={
            <AddButton
              onClick={() => setDrawer("datosMedicos")}
              label="Datos médicos"
            />
          }
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><FieldItem label="Nombre completo" value={nombreCompleto} /></div>
            <FieldItem label="Edad" value={`${edad} años`} />
            <FieldItem label="Género" value={datosPersonales.sexo} />
            <FieldItem label="Donador" value="No" />
            <FieldItem label="CURP" value={datosPersonales.curp} />
            <div className="col-span-2"><FieldItem label="RFC" value={datosPersonales.rfc} /></div>
          </div>
        </SectionCard>

        <SectionCard icon={<Phone className="w-4 h-4" />} title="Identificación" accent="bg-primary/10 text-primary">
          <div className="grid grid-cols-2 gap-4">
            <FieldItem label="CURP" value={datosPersonales.curp} />
            <FieldItem label="RFC" value={datosPersonales.rfc} />
            <FieldItem label="Fecha de nacimiento" value={fmtFecha(datosPersonales.fechaNacimiento)} />
          </div>
        </SectionCard>

        <SectionCard icon={<Phone className="w-4 h-4" />} title="Contacto de Emergencia" accent="bg-primary/10 text-primary">
          <div className="grid grid-cols-2 gap-4">
            <FieldItem label="Nombre" value={contacto.nombreContactoEmergencia} />
            <FieldItem label="Teléfono" value={contacto.telefonoEmergencia} />
            <FieldItem label="Correo electrónico" value={contacto.email} />
            <FieldItem label="Teléfono principal" value={contacto.telefono} />
          </div>
        </SectionCard>

        <SectionCard
          icon={<MapPin className="w-4 h-4" />}
          title="Alergias"
          accent="bg-red-50 text-red-500"
          action={<AddButton onClick={() => setDrawer("alergia")} />}
        >
          <div className="space-y-2">
            {[
              { nombre: "Penicilina", tipo: "Medicamento", reaccion: "Urticaria generalizada, angioedema", severidad: "Grave" },
              { nombre: "Mariscos (camarón, ostión)", tipo: "Alimento", reaccion: "Náuseas, eritema en piel", severidad: "Moderado" },
            ].map((alergia) => {
              const sev = severidadConfig[alergia.severidad];
              return (
                <div key={alergia.nombre} className="flex items-start justify-between gap-3 border border-border rounded-lg px-4 py-3">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-foreground">{alergia.nombre}</span>
                      <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{alergia.tipo}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{alergia.reaccion}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium shrink-0 ${sev?.cls.includes("red") ? "text-red-600" : sev?.cls.includes("amber") ? "text-amber-600" : "text-emerald-600"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${sev?.dot}`} />
                    {alergia.severidad}
                  </span>
                </div>
              );
            })}
          </div>
        </SectionCard>

        {datosFiscales && (
          <SectionCard icon={<Receipt className="w-4 h-4" />} title="Datos fiscales" accent="bg-primary/10 text-primary">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2"><FieldItem label="Razón social" value={datosFiscales.razonSocial} /></div>
              <FieldItem label="RFC" value={datosFiscales.rfc} />
              <FieldItem label="Régimen fiscal" value={datosFiscales.regimenFiscal} />
              <div className="col-span-2"><FieldItem label="Uso de CFDI" value={datosFiscales.usoCFDI} /></div>
            </div>
          </SectionCard>
        )}
      </div>

      <ApiDrawer
        open={drawer === "datosMedicos"}
        onClose={() => setDrawer(null)}
        title="Registrar datos médicos"
        endpoint="/datosmedicos"
        method="POST"
        fields={FIELDS_DATOS_MEDICOS}
        defaultValues={{ patient_id: ID_DEFAULTS.patient_id }}
      />
      <ApiDrawer
        open={drawer === "alergia"}
        onClose={() => setDrawer(null)}
        title="Registrar alergia"
        endpoint="/patientalergias"
        method="POST"
        fields={FIELDS_ALERGIAS}
        defaultValues={{ patient_id: ID_DEFAULTS.patient_id }}
      />
    </>
  );
}

// ─────────────────────────────────────────────
// TAB: SIGNOS VITALES
// ─────────────────────────────────────────────

function SignosVitalesTab({ signosVitales }: { signosVitales: SignosVitales[] }) {
  const ordenados = [...signosVitales].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  const ultimo = ordenados[0];
  const [drawerOpen, setDrawerOpen] = useState(false);

  const vitales = ultimo ? [
    { icon: <Heart className="w-5 h-5 text-rose-500" />,        label: "Presión arterial", value: `${ultimo.presionSistolica}/${ultimo.presionDiastolica}`, unit: "mmHg", status: presionCategoria(ultimo.presionSistolica, ultimo.presionDiastolica) },
    { icon: <Activity className="w-5 h-5 text-primary" />,      label: "Frec. cardíaca",   value: `${ultimo.frecuenciaCardiaca}`,                           unit: "bpm",  status: null },
    { icon: <Thermometer className="w-5 h-5 text-amber-500" />, label: "Temperatura",      value: `${ultimo.temperatura}`,                                  unit: "°C",   status: null },
    { icon: <Scale className="w-5 h-5 text-blue-500" />,        label: "Peso",             value: `${ultimo.peso}`,                                         unit: "kg",   status: null },
    { icon: <Ruler className="w-5 h-5 text-slate-400" />,       label: "Estatura",         value: `${ultimo.estatura}`,                                     unit: "cm",   status: null },
    { icon: <TrendingDown className="w-5 h-5 text-emerald-500" />, label: "IMC",           value: ultimo.indiceMasaCorporal ? `${ultimo.indiceMasaCorporal.toFixed(1)}` : "—", unit: "", status: ultimo.indiceMasaCorporal ? imcCategoria(ultimo.indiceMasaCorporal) : null },
  ] : [];

  return (
    <>
      <div className="space-y-6">
        {ultimo && (
          <section>
            <div className="flex items-center justify-between gap-3 mb-4">
              <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full font-medium">
                Último registro — {fmtFechaHora(ultimo.fecha)}
              </span>
              <AddButton onClick={() => setDrawerOpen(true)} label="Nuevo registro" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {vitales.map((v) => <VitalCard key={v.label} {...v} />)}
            </div>
          </section>
        )}
        <section>
          <h3 className="text-sm font-semibold text-foreground mb-4">Historial de registros</h3>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    {["Fecha", "Peso", "Presión", "F.C.", "Temp.", "IMC"].map((h) => (
                      <th key={h} className={`px-4 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest ${h === "Fecha" ? "text-left" : "text-right"}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ordenados.map((sv, i) => (
                    <tr key={sv.id} className={`border-b border-border last:border-0 hover:bg-muted/20 transition-colors ${i === 0 ? "bg-primary/5" : ""}`}>
                      <td className="px-4 py-3 text-foreground">
                        <div className="flex items-center gap-2">
                          {i === 0 && <span className="text-[10px] bg-primary text-white rounded-md px-1.5 py-0.5 font-bold">Actual</span>}
                          <span className="text-sm">{fmtFechaHora(sv.fecha)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-foreground">{sv.peso} kg</td>
                      <td className="px-4 py-3 text-right font-bold text-foreground">{sv.presionSistolica}/{sv.presionDiastolica} <span className="text-xs font-normal text-muted-foreground">mmHg</span></td>
                      <td className="px-4 py-3 text-right text-foreground">{sv.frecuenciaCardiaca} bpm</td>
                      <td className="px-4 py-3 text-right text-foreground">{sv.temperatura} °C</td>
                      <td className="px-4 py-3 text-right font-bold text-foreground">{sv.indiceMasaCorporal ? sv.indiceMasaCorporal.toFixed(1) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      <ApiDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Registrar signos vitales"
        endpoint="/signosvitales"
        method="POST"
        fields={FIELDS_SIGNOS_VITALES}
        defaultValues={{ patient_id: ID_DEFAULTS.patient_id, doctor_id: ID_DEFAULTS.doctor_id, appointment_id: ID_DEFAULTS.appointment_id }}
      />
    </>
  );
}

// ─────────────────────────────────────────────
// TAB: CONSULTA (SOAP)
// ─────────────────────────────────────────────

function ConsultaTab() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const soapMock = [
    { id: "SOAP-001", fecha: "2024-03-10", subjective: "Dolor de cabeza desde hace 3 días", objective: "TA 120/80, FC 72", assessment: "Cefalea tensional", plan: "Reposo e hidratación", diagnosis: "Cefalea tensional", prescription: "Paracetamol 500mg c/8h por 3 días" },
    { id: "SOAP-002", fecha: "2024-02-20", subjective: "Seguimiento de presión arterial", objective: "TA 118/78, FC 68, peso 77.2 kg", assessment: "Hipertensión leve bajo control", plan: "Continuar losartán, dieta baja en sodio", diagnosis: "Hipertensión arterial leve", prescription: "Losartán 25mg c/24h" },
  ];

  return (
    <>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Notas de consulta (SOAP)</h2>
          <AddButton onClick={() => setDrawerOpen(true)} label="Nueva consulta" />
        </div>
        {soapMock.map((soap) => (
          <div key={soap.id} className="bg-card border border-border rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{soap.diagnosis}</p>
                <p className="text-[11px] text-muted-foreground">{fmtFecha(soap.fecha)}</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-primary uppercase tracking-wider">S — Subjetivo</p>
                <p className="text-sm text-foreground">{soap.subjective}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">O — Objetivo</p>
                <p className="text-sm text-foreground">{soap.objective}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">A — Análisis</p>
                <p className="text-sm text-foreground">{soap.assessment}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">P — Plan</p>
                <p className="text-sm text-foreground">{soap.plan}</p>
              </div>
            </div>
            {soap.prescription && (
              <div className="flex items-start gap-2 bg-muted/50 rounded-lg px-3 py-2.5">
                <Pill className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-foreground">{soap.prescription}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <ApiDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Registrar nota SOAP"
        endpoint="/soap"
        method="POST"
        fields={FIELDS_SOAP}
        defaultValues={{ patient_id: ID_DEFAULTS.patient_id, doctor_id: ID_DEFAULTS.doctor_id, appointment_id: ID_DEFAULTS.appointment_id }}
      />
    </>
  );
}

// ─────────────────────────────────────────────
// TAB: VISITAS
// ─────────────────────────────────────────────

interface CitaAgendada {
  id: string; doctorId: string; fecha: string; horaInicio: string; horaCierre: string;
  tipo: "disponible" | "cita" | "urgencia"; primeraVez: boolean; tipoConsulta: string;
  especialidad: string; seguro: string; servicios: string[]; cupon: string;
  descuento: number; precioBase: number; precioFinal: number;
}

const citasExistentesMock: CitaAgendada[] = [
  { id: "CITA-001", doctorId: "DOC-001", fecha: "2024-02-15", horaInicio: "10:00", horaCierre: "10:30", tipo: "cita", primeraVez: false, tipoConsulta: "Consulta de seguimiento", especialidad: "Cardiología", seguro: "IMSS", servicios: ["consulta"], cupon: "", descuento: 0, precioBase: 800, precioFinal: 800 },
  { id: "CITA-002", doctorId: "DOC-002", fecha: "2024-02-18", horaInicio: "14:00", horaCierre: "14:30", tipo: "urgencia", primeraVez: false, tipoConsulta: "Urgencia", especialidad: "Medicina General", seguro: "Sin seguro (Particular)", servicios: ["consulta", "laboratorio"], cupon: "DESC10", descuento: 10, precioBase: 2000, precioFinal: 1800 },
];

function VisitasTab({ visitas }: { visitas: Visita[] }) {
  const [citasAgendadas, setCitasAgendadas] = useState<CitaAgendada[]>(citasExistentesMock);
  const [mesActual, setMesActual] = useState(new Date());

  useEffect(() => {
    patientService.getMyAppointments().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        const mapeadas: CitaAgendada[] = data.map((c: Record<string, unknown>) => {
          const scheduled = c.scheduledAt ? new Date(c.scheduledAt as string) : new Date();
          const end = c.endAt ? new Date(c.endAt as string) : null;
          const hh = (d: Date) => `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
          return { id: String(c.id ?? `CITA-${Math.random()}`), doctorId: String(c.doctorId ?? c.doctor_id ?? ""), fecha: scheduled.toISOString().substring(0, 10), horaInicio: hh(scheduled), horaCierre: end ? hh(end) : hh(scheduled), tipo: (c.modality === "URGENCIA" ? "urgencia" : "cita") as "cita" | "urgencia", primeraVez: false, tipoConsulta: String(c.notes ?? "Consulta"), especialidad: "", seguro: "", servicios: [], cupon: "", descuento: 0, precioBase: Number(c.price ?? 0), precioFinal: Number(c.price ?? 0) };
        });
        setCitasAgendadas(mapeadas);
      }
    }).catch(() => {});
  }, []);

  const generarDiasMes = (fecha: Date) => {
    const año = fecha.getFullYear(); const mes = fecha.getMonth();
    const primerDia = new Date(año, mes, 1); const ultimoDia = new Date(año, mes + 1, 0);
    const diasEnMes = ultimoDia.getDate(); const diaInicioSemana = primerDia.getDay();
    const dias: Array<{ fecha: string; dia: number; esOtroMes: boolean }> = [];
    const diasMesAnterior = new Date(año, mes, 0).getDate();
    for (let i = diaInicioSemana - 1; i >= 0; i--) {
      dias.push({ fecha: `${año}-${String(mes).padStart(2, "0")}-${String(diasMesAnterior - i).padStart(2, "0")}`, dia: diasMesAnterior - i, esOtroMes: true });
    }
    for (let dia = 1; dia <= diasEnMes; dia++) {
      dias.push({ fecha: `${año}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`, dia, esOtroMes: false });
    }
    for (let dia = 1; dia <= 42 - dias.length; dia++) {
      dias.push({ fecha: `${año}-${String(mes + 2).padStart(2, "0")}-${String(dia).padStart(2, "0")}`, dia, esOtroMes: true });
    }
    return dias;
  };

  const diasMes = generarDiasMes(mesActual);
  const nombresMeses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const nombresDias = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
  const obtenerEstadoDia = (fechaStr: string) => citasAgendadas.find((c) => c.fecha === fechaStr)?.tipo ?? "disponible";
  const irMesAnterior = () => setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() - 1, 1));
  const irMesSiguiente = () => setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 1));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3 p-4 bg-card border border-border rounded-xl">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Leyenda:</span>
        {[{ color: "bg-amber-400", label: "Cita programada" }, { color: "bg-red-400", label: "Urgencia" }].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded ${color}`} />
            <span className="text-sm text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-5">
          <button onClick={irMesAnterior} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-muted transition-colors" aria-label="Mes anterior">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h3 className="text-base font-bold text-foreground">{nombresMeses[mesActual.getMonth()]} {mesActual.getFullYear()}</h3>
          <button onClick={irMesSiguiente} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-muted transition-colors" aria-label="Mes siguiente">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-1">
          {nombresDias.map((dia) => (
            <div key={dia} className="text-center text-[10px] font-bold text-muted-foreground py-2 uppercase tracking-wider">{dia}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {diasMes.map(({ fecha, dia, esOtroMes }, index) => {
            const estado = !esOtroMes ? obtenerEstadoDia(fecha) : null;
            const esHoy = fecha === new Date().toISOString().substring(0, 10);
            let colorFondo = "";
            if (!esOtroMes && estado) {
              if (estado === "cita") colorFondo = "bg-amber-100 text-amber-800 font-bold";
              else if (estado === "urgencia") colorFondo = "bg-red-100 text-red-800 font-bold";
            }
            return (
              <div key={index} className={`aspect-square flex items-center justify-center text-sm rounded-xl transition-colors ${esOtroMes ? "text-muted-foreground/20" : "text-foreground"} ${!esOtroMes && !colorFondo ? "hover:bg-muted/50" : ""} ${!esOtroMes ? colorFondo : ""} ${esHoy && !esOtroMes ? "ring-2 ring-primary ring-offset-1 font-black" : ""}`}>
                {dia}
              </div>
            );
          })}
        </div>
      </div>
      {citasAgendadas.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">Citas programadas</h3>
            <span className="text-xs font-bold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">{citasAgendadas.length}</span>
          </div>
          <div className="space-y-3">
            {citasAgendadas.map((cita) => (
              <div key={cita.id} className={`bg-card border rounded-xl p-4 ${cita.tipo === "urgencia" ? "border-red-200" : "border-border"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${cita.tipo === "urgencia" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                        {cita.tipo === "urgencia" ? "Urgencia" : "Cita"}
                      </span>
                      {cita.primeraVez && <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 uppercase tracking-wider">Primera vez</span>}
                    </div>
                    <p className="font-semibold text-foreground">{cita.tipoConsulta}</p>
                    {cita.especialidad && <p className="text-sm text-muted-foreground">{cita.especialidad}</p>}
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" />{fmtFecha(cita.fecha)}</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{cita.horaInicio} - {cita.horaCierre}</span>
                    </div>
                  </div>
                  {cita.precioFinal > 0 && (
                    <div className="text-right shrink-0">
                      {cita.descuento > 0 && <p className="text-xs text-muted-foreground line-through">${cita.precioBase.toLocaleString()} MXN</p>}
                      <p className="text-xl font-black text-primary">${cita.precioFinal.toLocaleString()}<span className="text-xs font-normal text-muted-foreground ml-1">MXN</span></p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground bg-card border border-border rounded-xl">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="text-sm font-medium">No tienes citas programadas</p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// TAB: MEDICAMENTOS
// ─────────────────────────────────────────────

function MedicamentosTab({ medicamentos, recordatorios }: {
  medicamentos: Medicamento[]; recordatorios: Recordatorio[];
}) {
  const activos = medicamentos.filter((m) => !m.fechaFin || new Date(m.fechaFin) >= new Date());
  const finalizados = medicamentos.filter((m) => m.fechaFin && new Date(m.fechaFin) < new Date());
  const getRecs = (medId: string) => recordatorios.filter((r) => r.medicamentoId === medId);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const renderMed = (med: Medicamento, esActivo: boolean) => {
    const recs = getRecs(med.id);
    return (
      <div key={med.id} className={`bg-card border rounded-xl p-5 space-y-3 ${esActivo ? "border-border" : "border-border/40 opacity-60"}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${esActivo ? "bg-primary/10" : "bg-muted"}`}>
              <Pill className={`w-5 h-5 ${esActivo ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <div>
              <p className="font-semibold text-foreground">{med.nombre}</p>
              <p className="text-sm text-muted-foreground">{med.dosis} — {med.frecuencia}</p>
            </div>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full border font-medium shrink-0 ${esActivo ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-muted text-muted-foreground border-border"}`}>
            {esActivo ? "Activo" : "Finalizado"}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" />Inicio: {fmtFecha(med.fechaInicio, { corto: true })}</span>
          {med.fechaFin && <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" />Fin: {fmtFecha(med.fechaFin, { corto: true })}</span>}
        </div>
        {recs.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {recs.map((rec) => (
              <span key={rec.id} className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${rec.activo ? "bg-primary/8 text-primary border-primary/20" : "bg-muted text-muted-foreground border-border"}`}>
                {rec.activo ? <Bell className="w-3 h-3" /> : <BellOff className="w-3 h-3" />}
                {rec.hora}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="space-y-8">
        {activos.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Pill className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-semibold text-foreground">Medicamentos activos</h3>
              <span className="ml-auto text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">{activos.length}</span>
              <AddButton onClick={() => setDrawerOpen(true)} label="Prescripción" />
            </div>
            <div className="space-y-3">{activos.map((m) => renderMed(m, true))}</div>
          </section>
        )}
        {finalizados.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-xl bg-muted text-muted-foreground flex items-center justify-center">
                <Pill className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-semibold text-foreground">Medicamentos anteriores</h3>
              <span className="ml-auto text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">{finalizados.length}</span>
            </div>
            <div className="space-y-3">{finalizados.map((m) => renderMed(m, false))}</div>
          </section>
        )}
        {medicamentos.length === 0 && (
          <div className="text-center py-16 text-muted-foreground bg-card border border-border rounded-xl">
            <Pill className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm font-medium">No hay medicamentos registrados</p>
          </div>
        )}
      </div>

      <ApiDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Registrar prescripción"
        endpoint="/prescripcion"
        method="POST"
        fields={FIELDS_PRESCRIPCION}
        defaultValues={{ patient_id: ID_DEFAULTS.patient_id, doctor_id: ID_DEFAULTS.doctor_id, appointment_id: ID_DEFAULTS.appointment_id }}
      />
    </>
  );
}

// ─────────────────────────────────────────────
// TABS CONFIG
// ─────────────────────────────────────────────

const tabs = [
  { id: "dashboard",    label: "Resumen",         icon: LayoutDashboard, desc: "Vista general" },
  { id: "datos",        label: "Datos generales", icon: User,            desc: "Información personal" },
  { id: "signos",       label: "Signos vitales",  icon: Activity,        desc: "Mediciones clínicas" },
  { id: "consulta",     label: "Consulta",        icon: FileText,        desc: "Notas SOAP" },
  { id: "visitas",      label: "Visitas",         icon: Calendar,        desc: "Citas y consultas" },
  { id: "medicamentos", label: "Medicamentos",    icon: Pill,            desc: "Tratamientos activos" },
] as const;

type TabId = (typeof tabs)[number]["id"];

// ─────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────

function Sidebar({
  activeTab, setActiveTab, collapsed, setCollapsed,
  mobileOpen, setMobileOpen, onLogout,
}: {
  activeTab: TabId; setActiveTab: (t: TabId) => void;
  collapsed: boolean; setCollapsed: (v: boolean) => void;
  mobileOpen: boolean; setMobileOpen: (v: boolean) => void;
  onLogout: () => void;
}) {
  const handleTabClick = (id: TabId) => { setActiveTab(id); setMobileOpen(false); };

  const inner = (isMobile = false) => (
    <div className="flex flex-col h-full overflow-hidden">
      <div className={`flex items-center gap-3 px-4 py-5 shrink-0 ${collapsed && !isMobile ? "justify-center px-2" : ""}`}>
        <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center shrink-0">
          <Stethoscope className="w-5 h-5 text-white" />
        </div>
        {(!collapsed || isMobile) && (
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-bold text-sidebar-foreground leading-tight">MediRecord</p>
            <p className="text-[11px] text-muted-foreground leading-tight">Sistema de Expedientes</p>
          </div>
        )}
        {!isMobile && !collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="w-6 h-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground transition-colors shrink-0"
            aria-label="Colapsar menú"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
        {!isMobile && collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="absolute left-[52px] top-5 w-6 h-6 flex items-center justify-center rounded-full bg-card border border-border shadow-sm text-muted-foreground hover:text-foreground transition-all z-10"
            aria-label="Expandir menú"
          >
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
        {isMobile && (
          <button onClick={() => setMobileOpen(false)} className="w-7 h-7 flex items-center justify-center rounded text-muted-foreground hover:text-foreground transition-colors ml-auto">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 py-1 space-y-0.5 overflow-y-auto" aria-label="Navegación principal">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => handleTabClick(id)}
              className={`w-full flex items-center gap-3 rounded-lg text-left transition-all duration-150
                ${collapsed && !isMobile ? "px-0 py-3 justify-center" : "px-3 py-2.5"}
                ${isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
              title={collapsed && !isMobile ? label : undefined}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="w-[17px] h-[17px] shrink-0" />
              {(!collapsed || isMobile) && (
                <span className="text-[13.5px]">{label}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="px-3 pb-4 pt-3 space-y-0.5 shrink-0">
        {(!collapsed || isMobile) && (
          <div className="flex items-center justify-between px-3 py-2 text-xs text-muted-foreground mb-1">
            <span>Tema</span>
          </div>
        )}
        <button className={`w-full flex items-center gap-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-150 ${collapsed && !isMobile ? "px-0 py-3 justify-center" : "px-3 py-2.5"}`} title={collapsed && !isMobile ? "Configuración" : undefined}>
          <Settings className="w-[17px] h-[17px] shrink-0" />
          {(!collapsed || isMobile) && (
            <div className="flex items-center justify-between flex-1 min-w-0">
              <span className="text-[13.5px]">Configuración</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </div>
          )}
        </button>
        <div className="border-t border-border my-1" />
        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-3 rounded-lg text-red-500 hover:bg-red-50 transition-all duration-150 ${collapsed && !isMobile ? "px-0 py-3 justify-center" : "px-3 py-2.5"}`}
          title={collapsed && !isMobile ? "Cerrar sesión" : undefined}
        >
          <LogOut className="w-[17px] h-[17px] shrink-0" />
          {(!collapsed || isMobile) && <span className="text-[13.5px] font-medium">Cerrar sesión</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className={`hidden md:flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out shrink-0 h-screen sticky top-0 relative ${collapsed ? "w-[60px]" : "w-[260px]"}`}>
        {inner(false)}
      </aside>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} aria-hidden="true" />
      )}

      <aside className={`md:hidden fixed left-0 top-0 h-full z-50 w-[260px] bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {inner(true)}
      </aside>
    </>
  );
}

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────

export default function Page() {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const router = useRouter();
  const {
    user,
    logout,
    isAuthenticated,
    loading,
  } = useAuth();

  // Redirigir al login si no está autenticado
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  // Mostrar loading mientras se verifica autenticación
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, no renderizar nada (el useEffect redirigirá)
  if (!isAuthenticated) {
    return null;
  }

  const paciente = pacienteMock;
  const dp = paciente.datosPersonales;
  const nombreCompleto = [dp.nombre, dp.apellidoPaterno, dp.apellidoMaterno].filter(Boolean).join(" ");
  const edad = calcularEdad(dp.fechaNacimiento);
  const currentTab = tabs.find((t) => t.id === activeTab);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-background font-sans overflow-hidden">
      <Sidebar
        activeTab={activeTab} setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="sticky top-0 z-30 bg-card border-b border-border px-4 md:px-6 h-14 flex items-center gap-3 shrink-0">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
            aria-label="Abrir menú"
          >
            <Menu className="w-4 h-4" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-semibold text-foreground leading-tight">{currentTab?.label}</h1>
            <p className="text-[11px] text-muted-foreground leading-none">Expediente de {nombreCompleto}</p>
            {/* Mostrar información del usuario autenticado */}
            {user && (
              <div className="text-[10px] text-muted-foreground mt-0.5">
                {user.email && <span className="mr-2">📧 {user.email}</span>}
                {user.phone && <span>📱 {user.phone}</span>}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors" aria-label="Notificaciones">
              <Bell className="w-4 h-4 text-muted-foreground" />
            </button>
            <div className="flex items-center gap-2">
              <AvatarPaciente edad={edad} sexo={dp.sexo} size="sm" />
              <div className="hidden sm:block min-w-0">
                <p className="text-xs font-medium text-foreground leading-tight truncate max-w-[120px]">{edad} años</p>
                <p className="text-[10px] text-emerald-600 font-medium leading-tight">Sin alergias</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 md:p-7 bg-background">
          <div className="max-w-5xl mx-auto">
            {activeTab === "dashboard"    && paciente.dashboard && <DashboardTab dashboard={paciente.dashboard} />}
            {activeTab === "datos"        && <DatosGeneralesTab datosPersonales={paciente.datosPersonales} direccion={paciente.direccion} contacto={paciente.contacto} datosFiscales={paciente.datosFiscales} />}
            {activeTab === "signos"       && <SignosVitalesTab signosVitales={paciente.signosVitales} />}
            {activeTab === "consulta"     && <ConsultaTab />}
            {activeTab === "visitas"      && <VisitasTab visitas={paciente.visitas} />}
            {activeTab === "medicamentos" && <MedicamentosTab medicamentos={paciente.medicamentos} recordatorios={paciente.recordatorios} />}
          </div>
        </main>
      </div>
    </div>
  );
}