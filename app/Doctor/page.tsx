"use client";

import { useState } from "react";
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
  ChevronUp,
  Bell,
  BellOff,
  FolderOpen,
  FileUp,
  Upload,
  Folder,
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
  FileCheck,
  DollarSign,
  Tag,
  Building2,
  Shield,
  UserPlus,
  UserCheck,
  BadgePercent,
} from "lucide-react";
import { LogOutButton } from "@/components/ui/logoutButton";

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

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────

const pacienteMock: Paciente = {
  id: "PAC-001",
  datosPersonales: {
    id: "DP-001",
    nombre: "Carlos Eduardo",
    apellidoPaterno: "Ramírez",
    apellidoMaterno: "Herrera",
    fechaNacimiento: "1985-07-14",
    sexo: "Masculino",
    curp: "RAHC850714HDFMRL09",
    rfc: "RAHC850714AB1",
  },
  direccion: {
    calle: "Av. Insurgentes Sur",
    numeroExterior: "1234",
    numeroInterior: "5B",
    colonia: "Del Valle",
    ciudad: "Ciudad de México",
    estado: "CDMX",
    codigoPostal: "03100",
    pais: "México",
  },
  contacto: {
    telefono: "55 1234 5678",
    telefonoEmergencia: "55 9876 5432",
    email: "carlos.ramirez@email.com",
    nombreContactoEmergencia: "Laura Herrera (Esposa)",
  },
  datosFiscales: {
    razonSocial: "Carlos Eduardo Ramírez Herrera",
    rfc: "RAHC850714AB1",
    usoCFDI: "G03 - Gastos en general",
    regimenFiscal: "601 - General de Ley Personas Morales",
  },
  signosVitales: [
    { id: "SV-001", fecha: "2024-01-15T09:30:00Z", peso: 78.5, estatura: 175, temperatura: 36.8, frecuenciaCardiaca: 72, presionSistolica: 120, presionDiastolica: 80, grasaCorporal: 18.5, indiceMasaCorporal: 25.6 },
    { id: "SV-002", fecha: "2024-02-20T10:00:00Z", peso: 77.2, estatura: 175, temperatura: 36.5, frecuenciaCardiaca: 68, presionSistolica: 118, presionDiastolica: 78, grasaCorporal: 17.8, indiceMasaCorporal: 25.2 },
    { id: "SV-003", fecha: "2024-03-10T11:15:00Z", peso: 76.0, estatura: 175, temperatura: 36.6, frecuenciaCardiaca: 70, presionSistolica: 115, presionDiastolica: 75, grasaCorporal: 17.2, indiceMasaCorporal: 24.8 },
  ],
  citas: [
    { id: "CIT-001", pacienteId: "PAC-001", fecha: "2024-04-05", hora: "10:00", motivo: "Revisión general anual", estado: "Completada", notas: "Paciente en buen estado general." },
    { id: "CIT-002", pacienteId: "PAC-001", fecha: "2024-05-15", hora: "09:30", motivo: "Seguimiento de hipertensión", estado: "Confirmada" },
    { id: "CIT-003", pacienteId: "PAC-001", fecha: "2024-06-20", hora: "11:00", motivo: "Control de medicamentos", estado: "Pendiente" },
  ],
  visitas: [
    {
      id: "VIS-001", pacienteId: "PAC-001", fecha: "2024-01-15T09:30:00Z", motivo: "Revisión de rutina",
      observaciones: "Paciente refiere leve dolor de cabeza recurrente. Se recomienda monitoreo de presión arterial.",
      signosVitales: { id: "SV-001", fecha: "2024-01-15T09:30:00Z", peso: 78.5, estatura: 175, temperatura: 36.8, frecuenciaCardiaca: 72, presionSistolica: 120, presionDiastolica: 80, indiceMasaCorporal: 25.6 },
    },
    {
      id: "VIS-002", pacienteId: "PAC-001", fecha: "2024-02-20T10:00:00Z", motivo: "Seguimiento presión arterial",
      observaciones: "Mejoría notable. Presión arterial estable. Continuar con tratamiento actual.",
      signosVitales: { id: "SV-002", fecha: "2024-02-20T10:00:00Z", peso: 77.2, estatura: 175, temperatura: 36.5, frecuenciaCardiaca: 68, presionSistolica: 118, presionDiastolica: 78, indiceMasaCorporal: 25.2 },
    },
  ],
  diagnosticos: [
    { id: "DX-001", pacienteId: "PAC-001", fecha: "2024-01-15", descripcion: "Hipertensión arterial leve", tratamiento: "Losartán 50mg cada 24 horas. Dieta baja en sodio. Ejercicio moderado.", severidad: "Leve" },
    { id: "DX-002", pacienteId: "PAC-001", fecha: "2024-02-20", descripcion: "Sobrepeso leve", tratamiento: "Plan nutricional, actividad física 30 min/día.", severidad: "Leve" },
  ],
  notas: [
    { id: "NM-001", pacienteId: "PAC-001", fecha: "2024-01-15T09:45:00Z", contenido: "Paciente cooperador. Refiere estrés laboral significativo que puede estar contribuyendo al cuadro hipertensivo. Se recomienda manejo del estrés y seguimiento en 30 días." },
    { id: "NM-002", pacienteId: "PAC-001", fecha: "2024-02-20T10:20:00Z", contenido: "Buena adherencia al tratamiento. Paciente reporta mejora en calidad de sueño. Se ajusta dosis de Losartán a 25mg por mejoría clínica." },
  ],
  medicamentos: [
    { id: "MED-001", pacienteId: "PAC-001", nombre: "Losartán",      dosis: "25 mg",    frecuencia: "1 vez al día (mañana)", fechaInicio: "2024-01-15" },
    { id: "MED-002", pacienteId: "PAC-001", nombre: "Ácido fólico",  dosis: "400 mcg",  frecuencia: "1 vez al día",          fechaInicio: "2024-01-15", fechaFin: "2024-04-15" },
    { id: "MED-003", pacienteId: "PAC-001", nombre: "Vitamina D3",   dosis: "1000 UI",  frecuencia: "1 vez al día",          fechaInicio: "2024-02-20" },
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
    proximaCita: { id: "CIT-002", pacienteId: "PAC-001", fecha: "2024-05-15", hora: "09:30", motivo: "Seguimiento de hipertensión", estado: "Confirmada" },
    medicamentosActivos: [
      { id: "MED-001", pacienteId: "PAC-001", nombre: "Losartán",    dosis: "25 mg",   frecuencia: "1 vez al día (mañana)", fechaInicio: "2024-01-15" },
      { id: "MED-003", pacienteId: "PAC-001", nombre: "Vitamina D3", dosis: "1000 UI", frecuencia: "1 vez al día",          fechaInicio: "2024-02-20" },
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
  if (imc < 25)   return { label: "Normal",    cls: "text-emerald-600" };
  if (imc < 30)   return { label: "Sobrepeso", cls: "text-amber-700" };
  return           { label: "Obesidad",        cls: "text-red-600" };
}

function presionCategoria(sis: number, dia: number) {
  if (sis < 120 && dia < 80) return { label: "Normal",  cls: "text-emerald-600" };
  if (sis < 130 && dia < 80) return { label: "Elevada", cls: "text-amber-700" };
  return                      { label: "Alta",          cls: "text-red-600" };
}

// ─────────────────────────────────────────────
// AVATAR POR EDAD Y SEXO (SVG inline)
// ─────────────────────────────────────────────

function AvatarPaciente({ edad, sexo }: { edad: number; sexo: "Masculino" | "Femenino" | "Otro" }) {
  // Rangos: 0-2 bebé, 3-11 niño, 12-17 adolescente, 18+ adulto
  const etapa = edad <= 2 ? "bebe" : edad <= 11 ? "nino" : edad <= 17 ? "adolescente" : "adulto";

  const isMasc = sexo === "Masculino";
  const isFem = sexo === "Femenino";

  // Colores por sexo
  const skinTone = "#f4c591";
  const hairColor = isMasc ? "#4a3728" : isFem ? "#8b4513" : "#5a5a5a";
  const shirtColor = isMasc ? "#3b82f6" : isFem ? "#ec4899" : "#6b7280";
  const pantColor = isMasc ? "#1e40af" : isFem ? "#9d174d" : "#374151";

  // Etiqueta de etapa
  const etapaLabel =
    etapa === "bebe" ? "Bebé" :
    etapa === "nino" ? (isFem ? "Niña" : "Niño") :
    etapa === "adolescente" ? (isFem ? "Adolescente" : "Adolescente") :
    isFem ? "Adulta" : "Adulto";

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-14 h-14 rounded-full bg-sidebar-accent/60 border-2 border-sidebar-border flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 64 64" width="52" height="52" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          {etapa === "bebe" && (
            <>
              {/* Cuerpo bebé envuelto */}
              <ellipse cx="32" cy="50" rx="14" ry="10" fill={shirtColor} opacity="0.9" />
              {/* Cabeza grande */}
              <circle cx="32" cy="28" r="14" fill={skinTone} />
              {/* Cabello escaso */}
              <ellipse cx="32" cy="16" rx="7" ry="4" fill={hairColor} />
              {/* Ojos */}
              <circle cx="27" cy="28" r="2" fill="#1a1a1a" />
              <circle cx="37" cy="28" r="2" fill="#1a1a1a" />
              {/* Brillos ojos */}
              <circle cx="28" cy="27" r="0.8" fill="white" />
              <circle cx="38" cy="27" r="0.8" fill="white" />
              {/* Boca sonrisa */}
              <path d="M28 33 Q32 37 36 33" stroke="#c0725a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              {/* Mejillas */}
              <circle cx="23" cy="32" r="3" fill="#f4a0a0" opacity="0.5" />
              <circle cx="41" cy="32" r="3" fill="#f4a0a0" opacity="0.5" />
            </>
          )}

          {etapa === "nino" && (
            <>
              {/* Piernas */}
              <rect x="24" y="46" width="7" height="12" rx="3" fill={pantColor} />
              <rect x="33" y="46" width="7" height="12" rx="3" fill={pantColor} />
              {/* Cuerpo */}
              <rect x="20" y="32" width="24" height="16" rx="5" fill={shirtColor} />
              {/* Brazos */}
              <rect x="10" y="33" width="11" height="6" rx="3" fill={shirtColor} />
              <rect x="43" y="33" width="11" height="6" rx="3" fill={shirtColor} />
              {/* Manos */}
              <circle cx="10" cy="36" r="3.5" fill={skinTone} />
              <circle cx="54" cy="36" r="3.5" fill={skinTone} />
              {/* Cuello */}
              <rect x="29" y="27" width="6" height="7" rx="2" fill={skinTone} />
              {/* Cabeza */}
              <circle cx="32" cy="20" r="12" fill={skinTone} />
              {/* Cabello niño */}
              {isFem ? (
                <>
                  <ellipse cx="32" cy="9" rx="12" ry="6" fill={hairColor} />
                  <ellipse cx="20" cy="18" rx="4" ry="8" fill={hairColor} />
                  <ellipse cx="44" cy="18" rx="4" ry="8" fill={hairColor} />
                </>
              ) : (
                <ellipse cx="32" cy="9" rx="12" ry="6" fill={hairColor} />
              )}
              {/* Ojos */}
              <circle cx="27" cy="20" r="2.2" fill="#1a1a1a" />
              <circle cx="37" cy="20" r="2.2" fill="#1a1a1a" />
              <circle cx="27.8" cy="19.2" r="0.9" fill="white" />
              <circle cx="37.8" cy="19.2" r="0.9" fill="white" />
              {/* Nariz */}
              <ellipse cx="32" cy="23" rx="1.5" ry="1" fill="#d4956a" />
              {/* Boca */}
              <path d="M28 27 Q32 31 36 27" stroke="#c0725a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              {/* Mejillas */}
              <circle cx="22" cy="24" r="3" fill="#f4a0a0" opacity="0.45" />
              <circle cx="42" cy="24" r="3" fill="#f4a0a0" opacity="0.45" />
            </>
          )}

          {etapa === "adolescente" && (
            <>
              {/* Piernas más largas */}
              <rect x="23" y="44" width="8" height="16" rx="3" fill={pantColor} />
              <rect x="33" y="44" width="8" height="16" rx="3" fill={pantColor} />
              {/* Cuerpo */}
              <rect x="19" y="30" width="26" height="16" rx="5" fill={shirtColor} />
              {/* Brazos */}
              <rect x="8" y="31" width="12" height="6" rx="3" fill={shirtColor} />
              <rect x="44" y="31" width="12" height="6" rx="3" fill={shirtColor} />
              <circle cx="8" cy="34" r="4" fill={skinTone} />
              <circle cx="56" cy="34" r="4" fill={skinTone} />
              {/* Cuello */}
              <rect x="28.5" y="24" width="7" height="8" rx="2.5" fill={skinTone} />
              {/* Cabeza */}
              <ellipse cx="32" cy="17" rx="11" ry="13" fill={skinTone} />
              {/* Cabello adolescente */}
              {isFem ? (
                <>
                  <ellipse cx="32" cy="6" rx="11" ry="5" fill={hairColor} />
                  <ellipse cx="21" cy="16" rx="3.5" ry="10" fill={hairColor} />
                  <ellipse cx="43" cy="16" rx="3.5" ry="10" fill={hairColor} />
                </>
              ) : (
                <>
                  <ellipse cx="32" cy="6" rx="11" ry="5" fill={hairColor} />
                  <rect x="21" y="5" width="22" height="6" rx="3" fill={hairColor} />
                </>
              )}
              {/* Ojos */}
              <ellipse cx="27" cy="17" rx="2.5" ry="2.5" fill="#1a1a1a" />
              <ellipse cx="37" cy="17" rx="2.5" ry="2.5" fill="#1a1a1a" />
              <circle cx="27.8" cy="16" r="1" fill="white" />
              <circle cx="37.8" cy="16" r="1" fill="white" />
              {/* Nariz */}
              <path d="M30.5 20 Q32 22 33.5 20" stroke="#d4956a" strokeWidth="1.2" fill="none" />
              {/* Boca */}
              <path d="M28.5 24 Q32 27.5 35.5 24" stroke="#c0725a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </>
          )}

          {etapa === "adulto" && (
            <>
              {/* Piernas */}
              <rect x="22" y="44" width="9" height="16" rx="3.5" fill={pantColor} />
              <rect x="33" y="44" width="9" height="16" rx="3.5" fill={pantColor} />
              {/* Cuerpo */}
              {isFem ? (
                <path d="M18 30 Q18 44 22 46 L42 46 Q46 44 46 30 Q40 34 32 34 Q24 34 18 30 Z" fill={shirtColor} />
              ) : (
                <rect x="18" y="30" width="28" height="16" rx="5" fill={shirtColor} />
              )}
              {/* Brazos */}
              <rect x="6" y="31" width="13" height="7" rx="3.5" fill={shirtColor} />
              <rect x="45" y="31" width="13" height="7" rx="3.5" fill={shirtColor} />
              <circle cx="6" cy="34.5" r="4.5" fill={skinTone} />
              <circle cx="58" cy="34.5" r="4.5" fill={skinTone} />
              {/* Cuello */}
              <rect x="28" y="23" width="8" height="9" rx="3" fill={skinTone} />
              {/* Cabeza */}
              <ellipse cx="32" cy="16" rx="12" ry="14" fill={skinTone} />
              {/* Cabello adulto */}
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
                  {/* barba leve adulto masculino */}
                  <path d="M22 24 Q32 30 42 24" stroke={hairColor} strokeWidth="2" fill="none" opacity="0.4" />
                </>
              )}
              {/* Ojos */}
              <ellipse cx="26.5" cy="16" rx="2.8" ry="2.8" fill="#1a1a1a" />
              <ellipse cx="37.5" cy="16" rx="2.8" ry="2.8" fill="#1a1a1a" />
              <circle cx="27.5" cy="15" r="1.1" fill="white" />
              <circle cx="38.5" cy="15" r="1.1" fill="white" />
              {/* Nariz */}
              <path d="M30 20 Q32 23 34 20" stroke="#d4956a" strokeWidth="1.3" fill="none" />
              {/* Boca */}
              <path d="M27.5 25 Q32 28.5 36.5 25" stroke="#c0725a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </>
          )}
        </svg>
      </div>
      <div className="text-center">
        <p className="text-xs font-semibold text-sidebar-foreground/80 leading-tight">{etapaLabel}</p>
        <p className="text-xs text-sidebar-foreground/50 leading-tight">{sexo}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SHARED MINI-COMPONENTS
// ─────────────────────────────────────────────

function SectionCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-lg p-5 space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-primary">{icon}</span>
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function FieldItem({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs text-muted-foreground leading-relaxed">{label}</p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

const estadoConfig: Record<string, { cls: string; dot: string }> = {
  Pendiente:  { cls: "bg-amber-50 text-amber-800 border-amber-200",        dot: "bg-amber-500" },
  Confirmada: { cls: "bg-blue-50 text-blue-700 border-blue-200",           dot: "bg-blue-600" },
  Cancelada:  { cls: "bg-red-50 text-red-700 border-red-200",              dot: "bg-red-500" },
  Completada: { cls: "bg-emerald-50 text-emerald-700 border-emerald-200",  dot: "bg-emerald-500" },
};

const severidadConfig: Record<string, { cls: string; dot: string }> = {
  Leve:     { cls: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  Moderado: { cls: "bg-amber-50 text-amber-800 border-amber-200",       dot: "bg-amber-500" },
  Grave:    { cls: "bg-red-50 text-red-700 border-red-200",             dot: "bg-red-500" },
};

// ─────────────────────────────────────────────
// TAB: DASHBOARD
// ─────────────────────────────────────────────

function DashboardTab({ dashboard }: { dashboard: MiniDashboard }) {
  const sv = dashboard.ultimoRegistro;
  const vitales = [
    { icon: <Heart className="w-5 h-5 text-destructive" />,        label: "Presión arterial", value: `${sv.presionSistolica}/${sv.presionDiastolica}`, unit: "mmHg" },
    { icon: <Activity className="w-5 h-5 text-accent" />,          label: "Frec. cardíaca",   value: `${sv.frecuenciaCardiaca}`,                        unit: "bpm" },
    { icon: <Thermometer className="w-5 h-5 text-amber-500" />,    label: "Temperatura",      value: `${sv.temperatura}`,                               unit: "°C" },
    { icon: <Scale className="w-5 h-5 text-blue-600" />,           label: "Peso",             value: `${sv.peso}`,                                      unit: "kg" },
    { icon: <TrendingDown className="w-5 h-5 text-emerald-600" />, label: "IMC",              value: sv.indiceMasaCorporal ? sv.indiceMasaCorporal.toFixed(1) : "—", unit: "" },
    { icon: <Scale className="w-5 h-5 text-muted-foreground" />,   label: "Grasa corporal",   value: sv.grasaCorporal ? `${sv.grasaCorporal}` : "—",    unit: sv.grasaCorporal ? "%" : "" },
  ];

  return (
    <div className="space-y-6">
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Últimos signos vitales</h3>
          <span className="text-xs text-muted-foreground ml-1">— {fmtFecha(sv.fecha)}</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {vitales.map((v) => (
            <div key={v.label} className="flex items-center gap-3 bg-card border border-border rounded-lg p-4">
              <div className="shrink-0">{v.icon}</div>
              <div>
                <p className="text-xs text-muted-foreground leading-relaxed">{v.label}</p>
                <p className="text-sm font-semibold text-foreground">
                  {v.value}
                  {v.unit && <span className="text-xs font-normal text-muted-foreground ml-1">{v.unit}</span>}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        {dashboard.proximaCita && (
          <section className="bg-card border border-border rounded-lg p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Próxima cita</h3>
            </div>
            <p className="font-medium text-foreground">{dashboard.proximaCita.motivo}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {fmtFecha(dashboard.proximaCita.fecha)} — {dashboard.proximaCita.hora}
            </p>
            <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full border font-medium ${estadoConfig[dashboard.proximaCita.estado]?.cls}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${estadoConfig[dashboard.proximaCita.estado]?.dot}`} />
              {dashboard.proximaCita.estado}
            </span>
          </section>
        )}
        {dashboard.ultimoDiagnostico && (
          <section className="bg-card border border-border rounded-lg p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Último diagnóstico</h3>
            </div>
            <p className="font-medium text-foreground">{dashboard.ultimoDiagnostico.descripcion}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{fmtFecha(dashboard.ultimoDiagnostico.fecha)}</p>
            {dashboard.ultimoDiagnostico.severidad && (
              <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full border font-medium ${severidadConfig[dashboard.ultimoDiagnostico.severidad]?.cls}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${severidadConfig[dashboard.ultimoDiagnostico.severidad]?.dot}`} />
                {dashboard.ultimoDiagnostico.severidad}
              </span>
            )}
          </section>
        )}
      </div>

      {dashboard.medicamentosActivos.length > 0 && (
        <section className="bg-card border border-border rounded-lg p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Pill className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Medicamentos activos</h3>
          </div>
          <div className="space-y-2">
            {dashboard.medicamentosActivos.map((med) => (
              <div key={med.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{med.nombre}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{med.dosis} — {med.frecuencia}</p>
                </div>
                <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full border font-medium bg-emerald-50 text-emerald-700 border-emerald-200">Activo</span>
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
    <div className="grid md:grid-cols-2 gap-5">
      <SectionCard icon={<User className="w-4 h-4" />} title="Datos personales">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2"><FieldItem label="Nombre completo" value={nombreCompleto} /></div>
          <FieldItem label="Fecha de nacimiento" value={fmtFecha(datosPersonales.fechaNacimiento)} />
          <FieldItem label="Edad" value={`${edad} años`} />
          <FieldItem label="Sexo" value={datosPersonales.sexo} />
          <FieldItem label="CURP" value={datosPersonales.curp} />
          <FieldItem label="RFC" value={datosPersonales.rfc} />
        </div>
      </SectionCard>

      <SectionCard icon={<Phone className="w-4 h-4" />} title="Contacto">
        <div className="grid grid-cols-2 gap-3">
          <FieldItem label="Teléfono" value={contacto.telefono} />
          <FieldItem label="Correo electrónico" value={contacto.email} />
          <FieldItem label="Contacto de emergencia" value={contacto.nombreContactoEmergencia} />
          <FieldItem label="Tel. emergencias" value={contacto.telefonoEmergencia} />
        </div>
      </SectionCard>

      <SectionCard icon={<MapPin className="w-4 h-4" />} title="Domicilio">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <FieldItem label="Calle y número" value={`${direccion.calle} #${direccion.numeroExterior}${direccion.numeroInterior ? ` Int. ${direccion.numeroInterior}` : ""}`} />
          </div>
          <FieldItem label="Colonia" value={direccion.colonia} />
          <FieldItem label="Ciudad" value={direccion.ciudad} />
          <FieldItem label="Estado" value={direccion.estado} />
          <FieldItem label="CP" value={direccion.codigoPostal} />
          <FieldItem label="País" value={direccion.pais} />
        </div>
      </SectionCard>

      {datosFiscales && (
        <SectionCard icon={<Receipt className="w-4 h-4" />} title="Datos fiscales">
          <div className="grid grid-cols-2 gap-3">
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
    { icon: <Heart className="w-5 h-5 text-destructive" />,        label: "Presión arterial", value: `${ultimo.presionSistolica}/${ultimo.presionDiastolica}`, unit: "mmHg", estado: presionCategoria(ultimo.presionSistolica, ultimo.presionDiastolica) },
    { icon: <Activity className="w-5 h-5 text-accent" />,          label: "Frec. cardíaca",   value: `${ultimo.frecuenciaCardiaca}`,                           unit: "bpm",  estado: null },
    { icon: <Thermometer className="w-5 h-5 text-amber-500" />,    label: "Temperatura",      value: `${ultimo.temperatura}`,                                  unit: "°C",   estado: null },
    { icon: <Scale className="w-5 h-5 text-blue-600" />,           label: "Peso",             value: `${ultimo.peso}`,                                         unit: "kg",   estado: null },
    { icon: <Ruler className="w-5 h-5 text-slate-400" />,          label: "Estatura",         value: `${ultimo.estatura}`,                                     unit: "cm",   estado: null },
    { icon: <TrendingDown className="w-5 h-5 text-emerald-600" />, label: "IMC",              value: ultimo.indiceMasaCorporal ? `${ultimo.indiceMasaCorporal.toFixed(1)}` : "—", unit: "", estado: ultimo.indiceMasaCorporal ? imcCategoria(ultimo.indiceMasaCorporal) : null },
  ] : [];

  return (
    <div className="space-y-6">
      {ultimo && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Último registro</h3>
            <span className="text-xs text-muted-foreground ml-1">— {fmtFechaHora(ultimo.fecha)}</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {vitales.map((v) => (
              <div key={v.label} className="bg-card border border-border rounded-lg p-4 flex items-start gap-3">
                <div className="mt-0.5 shrink-0">{v.icon}</div>
                <div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{v.label}</p>
                  <p className="text-base font-bold text-foreground">
                    {v.value}
                    {v.unit && <span className="text-xs font-normal text-muted-foreground ml-1">{v.unit}</span>}
                  </p>
                  {v.estado && <p className={`text-xs font-medium ${v.estado.cls}`}>{v.estado.label}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3">Historial de registros</h3>
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  {["Fecha", "Peso", "Presión", "F.C.", "Temp.", "IMC"].map((h) => (
                    <th key={h} className={`px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide ${h === "Fecha" ? "text-left" : "text-right"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ordenados.map((sv, i) => (
                  <tr key={sv.id} className={`border-b border-border last:border-0 ${i === 0 ? "bg-primary/5" : ""}`}>
                    <td className="px-4 py-3 text-foreground">
                      <div className="flex items-center gap-2">
                        {i === 0 && <span className="text-xs bg-primary text-primary-foreground rounded px-1.5 py-0.5 font-medium">Actual</span>}
                        {fmtFechaHora(sv.fecha)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-foreground font-medium">{sv.peso} kg</td>
                    <td className="px-4 py-3 text-right text-foreground font-medium">{sv.presionSistolica}/{sv.presionDiastolica} mmHg</td>
                    <td className="px-4 py-3 text-right text-foreground">{sv.frecuenciaCardiaca} bpm</td>
                    <td className="px-4 py-3 text-right text-foreground">{sv.temperatura} °C</td>
                    <td className="px-4 py-3 text-right text-foreground">{sv.indiceMasaCorporal ? sv.indiceMasaCorporal.toFixed(1) : "—"}</td>
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
// EXPEDIENTE: sub-secciones con acordeón
// ─────────────────────────────────────────────

function CitasContent({ citas }: { citas: Cita[] }) {
  const ordenadas = [...citas].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  const pendientes = ordenadas.filter((c) => c.estado === "Pendiente" || c.estado === "Confirmada");
  const anteriores = ordenadas.filter((c) => c.estado === "Completada" || c.estado === "Cancelada");

  const renderCita = (cita: Cita) => {
    const cfg = estadoConfig[cita.estado] ?? estadoConfig.Pendiente;
    return (
      <div key={cita.id} className="bg-background border border-border rounded-lg p-4 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 flex-1">
            <p className="font-semibold text-foreground text-balance text-sm">{cita.motivo}</p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" />{fmtFecha(cita.fecha, { weekday: true })}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{cita.hora}</span>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full border font-medium shrink-0 ${cfg.cls}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />{cita.estado}
          </span>
        </div>
        {cita.notas && (
          <div className="flex gap-2 text-xs text-muted-foreground bg-muted/40 rounded-md px-3 py-2">
            <FileText className="w-3 h-3 mt-0.5 shrink-0" />
            <span className="leading-relaxed">{cita.notas}</span>
          </div>
        )}
      </div>
    );
  };

  if (citas.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" />
        <p className="text-sm">No hay citas registradas</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pendientes.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-primary" />Próximas citas
          </p>
          <div className="space-y-2">{pendientes.map(renderCita)}</div>
        </div>
      )}
      {anteriores.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />Historial de citas
          </p>
          <div className="space-y-2">{anteriores.map(renderCita)}</div>
        </div>
      )}
    </div>
  );
}

function NotasContent({ notas }: { notas: NotaMedica[] }) {
  const ordenadas = [...notas].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  if (notas.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
        <p className="text-sm">No hay notas médicas registradas</p>
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {ordenadas.map((nota, index) => (
        <div key={nota.id} className="bg-background border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-primary">{ordenadas.length - index}</span>
            </div>
            <span className="text-xs text-muted-foreground">{fmtFechaHora(nota.fecha)}</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">{nota.contenido}</p>
        </div>
      ))}
    </div>
  );
}

function DiagnosticosContent({ diagnosticos }: { diagnosticos: Diagnostico[] }) {
  const ordenados = [...diagnosticos].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  if (diagnosticos.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Stethoscope className="w-8 h-8 mx-auto mb-2 opacity-30" />
        <p className="text-sm">No hay diagnósticos registrados</p>
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {ordenados.map((dx) => {
        const cfg = dx.severidad ? (severidadConfig[dx.severidad] ?? severidadConfig.Leve) : null;
        return (
          <div key={dx.id} className="bg-background border border-border rounded-lg p-4 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-0.5">
                <p className="font-semibold text-foreground text-balance text-sm">{dx.descripcion}</p>
                <p className="text-xs text-muted-foreground">{fmtFecha(dx.fecha)}</p>
              </div>
              {cfg && (
                <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full border font-medium shrink-0 ${cfg.cls}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />{dx.severidad}
                </span>
              )}
            </div>
            {dx.tratamiento && (
              <div className="bg-muted/40 rounded-md px-3 py-2">
                <div className="flex items-center gap-1.5 mb-1">
                  <AlertCircle className="w-3 h-3 text-primary shrink-0" />
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Plan de tratamiento</p>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{dx.tratamiento}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Agrupa registros por fecha (YYYY-MM-DD)
function agruparPorFecha<T extends { fecha: string }>(items: T[]): { fecha: string; items: T[] }[] {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const key = item.fecha.substring(0, 10);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(item);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([fecha, items]) => ({ fecha, items }));
}

function ExpedienteTab({
  diagnosticos, citas, notas,
}: {
  diagnosticos: Diagnostico[];
  citas: Cita[];
  notas: NotaMedica[];
}) {
  const [fechaFiltro, setFechaFiltro] = useState("");

  // Unir todos los registros en una línea de tiempo única por fecha
  type EntradaExpediente =
    | { tipo: "diagnostico"; fecha: string; data: Diagnostico }
    | { tipo: "cita";        fecha: string; data: Cita }
    | { tipo: "nota";        fecha: string; data: NotaMedica };

  const todasLasEntradas: EntradaExpediente[] = [
    ...diagnosticos.map((d) => ({ tipo: "diagnostico" as const, fecha: d.fecha.substring(0, 10), data: d })),
    ...citas.map((c)       => ({ tipo: "cita" as const,         fecha: c.fecha.substring(0, 10), data: c })),
    ...notas.map((n)       => ({ tipo: "nota" as const,         fecha: n.fecha.substring(0, 10), data: n })),
  ];

  const fechasFiltradas = fechaFiltro
    ? todasLasEntradas.filter((e) => e.fecha === fechaFiltro)
    : todasLasEntradas;

  // Agrupar por fecha
  const gruposFecha = new Map<string, EntradaExpediente[]>();
  for (const entrada of fechasFiltradas) {
    if (!gruposFecha.has(entrada.fecha)) gruposFecha.set(entrada.fecha, []);
    gruposFecha.get(entrada.fecha)!.push(entrada);
  }
  const grupos = Array.from(gruposFecha.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([fecha, entradas]) => ({ fecha, entradas }));

  // Fechas únicas disponibles para el filtro
  const fechasDisponibles = Array.from(
    new Set(todasLasEntradas.map((e) => e.fecha))
  ).sort((a, b) => b.localeCompare(a));

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
      const cfg = dx.severidad ? (severidadConfig[dx.severidad] ?? severidadConfig.Leve) : null;
      return (
        <div key={dx.id} className="bg-background border border-border rounded-lg p-4 space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="p-1.5 rounded bg-primary/10 shrink-0">
                <ClipboardList className="w-3.5 h-3.5 text-primary" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Diagnóstico</p>
                <p className="font-semibold text-foreground text-sm text-balance">{dx.descripcion}</p>
              </div>
            </div>
            {cfg && (
              <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full border font-medium shrink-0 ${cfg.cls}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />{dx.severidad}
              </span>
            )}
          </div>
          {dx.tratamiento && (
            <div className="bg-muted/40 rounded-md px-3 py-2 ml-8">
              <div className="flex items-center gap-1.5 mb-1">
                <AlertCircle className="w-3 h-3 text-primary shrink-0" />
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Plan de tratamiento</p>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{dx.tratamiento}</p>
            </div>
          )}
        </div>
      );
    }

    if (entrada.tipo === "cita") {
      const cita = entrada.data;
      const cfg = estadoConfig[cita.estado] ?? estadoConfig.Pendiente;
      return (
        <div key={cita.id} className="bg-background border border-border rounded-lg p-4 space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="p-1.5 rounded bg-blue-50 shrink-0">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Cita — {cita.hora}</p>
                <p className="font-semibold text-foreground text-sm text-balance">{cita.motivo}</p>
              </div>
            </div>
            <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full border font-medium shrink-0 ${cfg.cls}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />{cita.estado}
            </span>
          </div>
          {cita.notas && (
            <div className="flex gap-2 text-xs text-muted-foreground bg-muted/40 rounded-md px-3 py-2 ml-8">
              <FileText className="w-3 h-3 mt-0.5 shrink-0" />
              <span className="leading-relaxed">{cita.notas}</span>
            </div>
          )}
        </div>
      );
    }

    // nota
    const nota = entrada.data as NotaMedica;
    return (
      <div key={nota.id} className="bg-background border border-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="p-1.5 rounded bg-amber-50 shrink-0">
            <FileText className="w-3.5 h-3.5 text-amber-600" />
          </span>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Nota médica — {fmtFechaHora(nota.fecha).split(", ")[1]}</p>
        </div>
        <p className="text-sm text-foreground leading-relaxed ml-8">{nota.contenido}</p>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header + filtro */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Expediente clínico</h3>
          <span className="text-xs text-muted-foreground">— {todasLasEntradas.length} registro(s)</span>
        </div>

        {/* Filtro por fecha */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <select
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
            className="text-xs border border-border rounded-md px-2 py-1.5 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
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
              className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Quitar filtro"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Grupos por fecha */}
      {grupos.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <FolderOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No hay registros para la fecha seleccionada</p>
        </div>
      ) : (
        grupos.map(({ fecha, entradas }) => {
          const isOpen = gruposAbiertos.has(fecha);
          const badges = {
            diagnostico: entradas.filter((e) => e.tipo === "diagnostico").length,
            cita:        entradas.filter((e) => e.tipo === "cita").length,
            nota:        entradas.filter((e) => e.tipo === "nota").length,
          };
          return (
            <div
              key={fecha}
              className={`border rounded-lg overflow-hidden transition-all ${isOpen ? "border-primary/40 shadow-sm" : "border-border"}`}
            >
              {/* Cabecera de carpeta */}
              <button
                onClick={() => toggleGrupo(fecha)}
                className="w-full text-left flex items-center justify-between gap-4 px-5 py-4 bg-card hover:bg-muted/30 transition-colors"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <span className={`p-2 rounded-md ${isOpen ? "bg-primary/10" : "bg-muted"}`}>
                    <Folder className={`w-4 h-4 ${isOpen ? "text-primary" : "text-muted-foreground"}`} />
                  </span>
                  <div className="text-left">
                    <p className="font-semibold text-foreground text-sm">{fmtFecha(fecha, { weekday: true })}</p>
                    <div className="flex flex-wrap gap-2 mt-0.5">
                      {badges.diagnostico > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <ClipboardList className="w-3 h-3" />{badges.diagnostico} diagnóstico{badges.diagnostico !== 1 ? "s" : ""}
                        </span>
                      )}
                      {badges.cita > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />{badges.cita} cita{badges.cita !== 1 ? "s" : ""}
                        </span>
                      )}
                      {badges.nota > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <FileText className="w-3 h-3" />{badges.nota} nota{badges.nota !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Contenido de la carpeta */}
              {isOpen && (
                <div className="px-5 pb-5 pt-4 border-t border-border bg-card space-y-3">
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
// TAB: VISITAS (Agendar citas)
// ─────────────────────────────────────────────

// Especialidades médicas
const especialidades = [
  "Medicina General",
  "Cardiología",
  "Dermatología",
  "Endocrinología",
  "Gastroenterología",
  "Ginecología",
  "Neurología",
  "Oftalmología",
  "Ortopedia",
  "Otorrinolaringología",
  "Pediatría",
  "Psiquiatría",
  "Urología",
];

// Tipos de seguro
const tiposSeguros = [
  "Sin seguro (Particular)",
  "IMSS",
  "ISSSTE",
  "Seguro Popular",
  "GNP Seguros",
  "AXA Seguros",
  "Metlife",
  "Mapfre",
  "Allianz",
  "Otro",
];

// Servicios disponibles
const serviciosDisponibles = [
  { id: "consulta", nombre: "Consulta médica", precio: 800 },
  { id: "revision", nombre: "Revisión general", precio: 600 },
  { id: "laboratorio", nombre: "Estudios de laboratorio", precio: 1200 },
  { id: "rayosx", nombre: "Rayos X", precio: 500 },
  { id: "ultrasonido", nombre: "Ultrasonido", precio: 900 },
  { id: "electrocardiograma", nombre: "Electrocardiograma", precio: 450 },
  { id: "curacion", nombre: "Curación", precio: 350 },
  { id: "vacunacion", nombre: "Vacunación", precio: 250 },
];

// Cupones de descuento mock
const cuponesValidos: Record<string, number> = {
  "DESC10": 10,
  "DESC20": 20,
  "NUEVO25": 25,
  "VIP30": 30,
  "PROMO15": 15,
};

interface CitaAgendada {
  id: string;
  fecha: string;
  horaInicio: string;
  horaCierre: string;
  tipo: "disponible" | "cita" | "urgencia";
  primeraVez: boolean;
  tipoConsulta: string;
  especialidad: string;
  seguro: string;
  servicios: string[];
  cupon: string;
  descuento: number;
  precioBase: number;
  precioFinal: number;
}

// Datos mock de citas existentes
const citasExistentesMock: CitaAgendada[] = [
  {
    id: "CITA-001",
    fecha: "2024-02-15",
    horaInicio: "10:00",
    horaCierre: "10:30",
    tipo: "cita",
    primeraVez: false,
    tipoConsulta: "Consulta de seguimiento",
    especialidad: "Cardiología",
    seguro: "IMSS",
    servicios: ["consulta"],
    cupon: "",
    descuento: 0,
    precioBase: 800,
    precioFinal: 800,
  },
  {
    id: "CITA-002",
    fecha: "2024-02-18",
    horaInicio: "14:00",
    horaCierre: "14:30",
    tipo: "urgencia",
    primeraVez: false,
    tipoConsulta: "Urgencia",
    especialidad: "Medicina General",
    seguro: "Sin seguro (Particular)",
    servicios: ["consulta", "laboratorio"],
    cupon: "DESC10",
    descuento: 10,
    precioBase: 2000,
    precioFinal: 1800,
  },
];

function VisitasTab({ visitas }: { visitas: Visita[] }) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [citasAgendadas, setCitasAgendadas] = useState<CitaAgendada[]>(citasExistentesMock);
  
  // Estado del calendario
  const [mesActual, setMesActual] = useState(new Date());
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>("");
  
  // Estado del formulario
  const [formCita, setFormCita] = useState({
    primeraVez: true,
    tipoConsulta: "Consulta general",
    especialidad: "Medicina General",
    seguro: "Sin seguro (Particular)",
    servicios: ["consulta"] as string[],
    cupon: "",
    horaInicio: "09:00",
    horaCierre: "09:30",
  });
  const [descuentoAplicado, setDescuentoAplicado] = useState(0);
  const [cuponValido, setCuponValido] = useState<boolean | null>(null);

  // Generar días del mes
  const generarDiasMes = (fecha: Date) => {
    const año = fecha.getFullYear();
    const mes = fecha.getMonth();
    const primerDia = new Date(año, mes, 1);
    const ultimoDia = new Date(año, mes + 1, 0);
    const diasEnMes = ultimoDia.getDate();
    const diaInicioSemana = primerDia.getDay();
    
    const dias: Array<{ fecha: string; dia: number; esOtroMes: boolean }> = [];
    
    // Días del mes anterior
    const mesAnterior = new Date(año, mes, 0);
    const diasMesAnterior = mesAnterior.getDate();
    for (let i = diaInicioSemana - 1; i >= 0; i--) {
      const diaNum = diasMesAnterior - i;
      const fechaStr = `${año}-${String(mes).padStart(2, "0")}-${String(diaNum).padStart(2, "0")}`;
      dias.push({ fecha: fechaStr, dia: diaNum, esOtroMes: true });
    }
    
    // Días del mes actual
    for (let dia = 1; dia <= diasEnMes; dia++) {
      const fechaStr = `${año}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
      dias.push({ fecha: fechaStr, dia, esOtroMes: false });
    }
    
    // Días del mes siguiente para completar la grilla
    const diasRestantes = 42 - dias.length;
    for (let dia = 1; dia <= diasRestantes; dia++) {
      const fechaStr = `${año}-${String(mes + 2).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
      dias.push({ fecha: fechaStr, dia, esOtroMes: true });
    }
    
    return dias;
  };

  const diasMes = generarDiasMes(mesActual);
  const nombresMeses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  const nombresDias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  // Obtener estado del día
  const obtenerEstadoDia = (fechaStr: string): "disponible" | "cita" | "urgencia" | null => {
    const cita = citasAgendadas.find((c) => c.fecha === fechaStr);
    if (cita) return cita.tipo;
    return "disponible";
  };

  // Navegación del calendario
  const mesAnterior = () => {
    setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() - 1, 1));
  };

  const mesSiguiente = () => {
    setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 1));
  };

  // Validar cupón
  const validarCupon = (codigo: string) => {
    const descuento = cuponesValidos[codigo.toUpperCase()];
    if (descuento) {
      setDescuentoAplicado(descuento);
      setCuponValido(true);
    } else {
      setDescuentoAplicado(0);
      setCuponValido(codigo.length > 0 ? false : null);
    }
  };

  // Calcular precio
  const calcularPrecioBase = () => {
    return formCita.servicios.reduce((total, servId) => {
      const servicio = serviciosDisponibles.find((s) => s.id === servId);
      return total + (servicio?.precio || 0);
    }, 0);
  };

  const precioBase = calcularPrecioBase();
  const precioConDescuento = precioBase * (1 - descuentoAplicado / 100);

  // Manejar servicios
  const toggleServicio = (servicioId: string) => {
    setFormCita((prev) => ({
      ...prev,
      servicios: prev.servicios.includes(servicioId)
        ? prev.servicios.filter((s) => s !== servicioId)
        : [...prev.servicios, servicioId],
    }));
  };

  // Guardar cita
  const guardarCita = () => {
    if (!fechaSeleccionada) return;
    
    const nuevaCita: CitaAgendada = {
      id: `CITA-${Date.now()}`,
      fecha: fechaSeleccionada,
      horaInicio: formCita.horaInicio,
      horaCierre: formCita.horaCierre,
      tipo: "cita",
      primeraVez: formCita.primeraVez,
      tipoConsulta: formCita.tipoConsulta,
      especialidad: formCita.especialidad,
      seguro: formCita.seguro,
      servicios: formCita.servicios,
      cupon: formCita.cupon,
      descuento: descuentoAplicado,
      precioBase: precioBase,
      precioFinal: precioConDescuento,
    };
    
    setCitasAgendadas([...citasAgendadas, nuevaCita]);
    setMostrarFormulario(false);
    setFechaSeleccionada("");
    setFormCita({
      primeraVez: true,
      tipoConsulta: "Consulta general",
      especialidad: "Medicina General",
      seguro: "Sin seguro (Particular)",
      servicios: ["consulta"],
      cupon: "",
      horaInicio: "09:00",
      horaCierre: "09:30",
    });
    setDescuentoAplicado(0);
    setCuponValido(null);
  };

  // Horas disponibles
  const horasDisponibles = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Agenda de Citas</h2>
        </div>
        <button
          onClick={() => setMostrarFormulario(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <CalendarPlus className="w-4 h-4" />
          Agregar Cita
        </button>
      </div>

      {/* Leyenda de colores */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-card border border-border rounded-lg">
        <span className="text-sm font-medium text-foreground">Leyenda:</span>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-emerald-500"></span>
          <span className="text-sm text-muted-foreground">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-amber-500"></span>
          <span className="text-sm text-muted-foreground">Cita programada</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-red-500"></span>
          <span className="text-sm text-muted-foreground">Urgencia</span>
        </div>
      </div>

      {/* Calendario */}
      <div className="bg-card border border-border rounded-lg p-5">
        {/* Navegación del mes */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={mesAnterior}
            className="p-2 hover:bg-muted rounded-md transition-colors"
            aria-label="Mes anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-semibold text-foreground">
            {nombresMeses[mesActual.getMonth()]} {mesActual.getFullYear()}
          </h3>
          <button
            onClick={mesSiguiente}
            className="p-2 hover:bg-muted rounded-md transition-colors"
            aria-label="Mes siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {nombresDias.map((dia) => (
            <div key={dia} className="text-center text-xs font-semibold text-muted-foreground py-2">
              {dia}
            </div>
          ))}
        </div>

        {/* Días del mes */}
        <div className="grid grid-cols-7 gap-1">
          {diasMes.map(({ fecha, dia, esOtroMes }, index) => {
            const estado = !esOtroMes ? obtenerEstadoDia(fecha) : null;
            const esHoy = fecha === new Date().toISOString().substring(0, 10);
            const estaSeleccionado = fecha === fechaSeleccionada;
            
            let colorFondo = "";
            if (!esOtroMes && estado) {
              switch (estado) {
                case "disponible":
                  colorFondo = "bg-emerald-100 hover:bg-emerald-200 text-emerald-800";
                  break;
                case "cita":
                  colorFondo = "bg-amber-100 hover:bg-amber-200 text-amber-800";
                  break;
                case "urgencia":
                  colorFondo = "bg-red-100 hover:bg-red-200 text-red-800";
                  break;
              }
            }
            
            return (
              <button
                key={index}
                onClick={() => {
                  if (!esOtroMes) {
                    setFechaSeleccionada(fecha);
                    setMostrarFormulario(true);
                  }
                }}
                disabled={esOtroMes}
                className={`
                  aspect-square flex items-center justify-center text-sm font-medium rounded-md transition-all
                  ${esOtroMes ? "text-muted-foreground/30 cursor-not-allowed" : "cursor-pointer"}
                  ${!esOtroMes && colorFondo}
                  ${esHoy && !esOtroMes ? "ring-2 ring-primary ring-offset-1" : ""}
                  ${estaSeleccionado ? "ring-2 ring-primary bg-primary/20" : ""}
                `}
              >
                {dia}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lista de citas agendadas */}
      {citasAgendadas.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Citas Programadas ({citasAgendadas.length})
          </h3>
          <div className="space-y-2">
            {citasAgendadas.map((cita) => (
              <div
                key={cita.id}
                className={`bg-card border rounded-lg p-4 ${
                  cita.tipo === "urgencia" ? "border-red-300" : "border-border"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        cita.tipo === "urgencia" 
                          ? "bg-red-100 text-red-700" 
                          : "bg-amber-100 text-amber-700"
                      }`}>
                        {cita.tipo === "urgencia" ? "URGENCIA" : "CITA"}
                      </span>
                      {cita.primeraVez && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                          Primera vez
                        </span>
                      )}
                    </div>
                    <p className="font-semibold text-foreground">{cita.tipoConsulta}</p>
                    <p className="text-sm text-muted-foreground">{cita.especialidad}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {fmtFecha(cita.fecha)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {cita.horaInicio} - {cita.horaCierre}
                      </span>
                      <span className="flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        {cita.seguro}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    {cita.descuento > 0 && (
                      <p className="text-xs text-muted-foreground line-through">
                        ${cita.precioBase.toLocaleString()} MXN
                      </p>
                    )}
                    <p className="text-lg font-bold text-primary">
                      ${cita.precioFinal.toLocaleString()} MXN
                    </p>
                    {cita.cupon && (
                      <span className="text-xs text-emerald-600">-{cita.descuento}%</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal formulario de cita */}
      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Agendar Nueva Cita</h3>
                {fechaSeleccionada && (
                  <p className="text-sm text-muted-foreground">
                    Fecha: {fmtFecha(fechaSeleccionada, { weekday: true })}
                  </p>
                )}
              </div>
              <button
                onClick={() => {
                  setMostrarFormulario(false);
                  setFechaSeleccionada("");
                }}
                className="p-2 hover:bg-muted rounded-md transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Tipo de paciente */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-primary" />
                  Tipo de paciente
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setFormCita({ ...formCita, primeraVez: true })}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                      formCita.primeraVez
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-background border-border text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    <UserPlus className="w-4 h-4" />
                    Primera vez
                  </button>
                  <button
                    onClick={() => setFormCita({ ...formCita, primeraVez: false })}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                      !formCita.primeraVez
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-background border-border text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    <UserCheck className="w-4 h-4" />
                    Seguimiento
                  </button>
                </div>
              </div>

              {/* Tipo de consulta */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-primary" />
                  Tipo de consulta
                </label>
                <select
                  value={formCita.tipoConsulta}
                  onChange={(e) => setFormCita({ ...formCita, tipoConsulta: e.target.value })}
                  className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option>Consulta general</option>
                  <option>Consulta de seguimiento</option>
                  <option>Consulta de especialidad</option>
                  <option>Chequeo preventivo</option>
                  <option>Urgencia</option>
                </select>
              </div>

              {/* Especialidad */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" />
                  Especialidad
                </label>
                <select
                  value={formCita.especialidad}
                  onChange={(e) => setFormCita({ ...formCita, especialidad: e.target.value })}
                  className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {especialidades.map((esp) => (
                    <option key={esp}>{esp}</option>
                  ))}
                </select>
              </div>

              {/* Tipo de seguro */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  Tipo de seguro
                </label>
                <select
                  value={formCita.seguro}
                  onChange={(e) => setFormCita({ ...formCita, seguro: e.target.value })}
                  className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {tiposSeguros.map((seg) => (
                    <option key={seg}>{seg}</option>
                  ))}
                </select>
              </div>

              {/* Servicios */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Tag className="w-4 h-4 text-primary" />
                  Servicios
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {serviciosDisponibles.map((servicio) => (
                    <button
                      key={servicio.id}
                      onClick={() => toggleServicio(servicio.id)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg border text-sm transition-colors ${
                        formCita.servicios.includes(servicio.id)
                          ? "bg-primary/10 border-primary text-foreground"
                          : "bg-background border-border text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      <span className="truncate">{servicio.nombre}</span>
                      <span className="text-xs font-semibold shrink-0 ml-2">
                        ${servicio.precio}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cupón de descuento */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <BadgePercent className="w-4 h-4 text-primary" />
                  Cupón de descuento
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formCita.cupon}
                    onChange={(e) => {
                      setFormCita({ ...formCita, cupon: e.target.value });
                      validarCupon(e.target.value);
                    }}
                    className={`flex-1 border rounded-md px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 uppercase ${
                      cuponValido === true ? "border-emerald-500" : cuponValido === false ? "border-red-500" : "border-border"
                    }`}
                    placeholder="Ingresa tu cupón"
                  />
                  {cuponValido === true && (
                    <span className="flex items-center px-3 text-sm font-semibold text-emerald-600 bg-emerald-50 rounded-md">
                      -{descuentoAplicado}%
                    </span>
                  )}
                </div>
                {cuponValido === false && (
                  <p className="text-xs text-red-500">Cupón no válido</p>
                )}
              </div>

              {/* Fecha y hora */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={fechaSeleccionada}
                    onChange={(e) => setFechaSeleccionada(e.target.value)}
                    className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Hora inicio
                  </label>
                  <select
                    value={formCita.horaInicio}
                    onChange={(e) => setFormCita({ ...formCita, horaInicio: e.target.value })}
                    className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {horasDisponibles.map((h) => (
                      <option key={h}>{h}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Hora cierre
                  </label>
                  <select
                    value={formCita.horaCierre}
                    onChange={(e) => setFormCita({ ...formCita, horaCierre: e.target.value })}
                    className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {horasDisponibles.map((h) => (
                      <option key={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Precio total */}
              <div className="bg-muted/30 border border-border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Servicios seleccionados:</span>
                  <span className="font-medium text-foreground">{formCita.servicios.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-medium text-foreground">${precioBase.toLocaleString()} MXN</span>
                </div>
                {descuentoAplicado > 0 && (
                  <div className="flex items-center justify-between text-sm text-emerald-600">
                    <span>Descuento ({descuentoAplicado}%):</span>
                    <span>-${(precioBase - precioConDescuento).toLocaleString()} MXN</span>
                  </div>
                )}
                <div className="border-t border-border pt-2 flex items-center justify-between">
                  <span className="font-semibold text-foreground flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-primary" />
                    Precio Total:
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    ${precioConDescuento.toLocaleString()} MXN
                  </span>
                </div>
              </div>
            </div>

            {/* Footer del modal */}
            <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setMostrarFormulario(false);
                  setFechaSeleccionada("");
                }}
                className="px-4 py-2 border border-border rounded-md text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={guardarCita}
                disabled={!fechaSeleccionada || formCita.servicios.length === 0}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                Guardar Cita
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// TAB: CONSULTA (antes DOCUMENTOS)
// Con sub-tabs: Datos Clínicos, Diagnóstico, Notas, Prescripción
// ─────────────────────────────────────────────

// Catálogo de enfermedades CIE-10 (OMS) para autocompletado
const catalogoCIE10: Record<string, string> = {
  "A00": "Cólera",
  "A01": "Fiebres tifoidea y paratifoidea",
  "A09": "Diarrea y gastroenteritis de presunto origen infeccioso",
  "B15": "Hepatitis aguda tipo A",
  "B16": "Hepatitis aguda tipo B",
  "B17": "Otras hepatitis virales agudas",
  "E10": "Diabetes mellitus tipo 1",
  "E11": "Diabetes mellitus tipo 2",
  "E66": "Obesidad",
  "E78": "Trastornos del metabolismo de las lipoproteínas y otras lipidemias",
  "G43": "Migraña",
  "G44": "Otros síndromes de cefalea",
  "I10": "Hipertensión esencial (primaria)",
  "I11": "Enfermedad cardíaca hipertensiva",
  "I20": "Angina de pecho",
  "I21": "Infarto agudo de miocardio",
  "I25": "Enfermedad isquémica crónica del corazón",
  "I50": "Insuficiencia cardíaca",
  "J00": "Rinofaringitis aguda (resfriado común)",
  "J02": "Faringitis aguda",
  "J03": "Amigdalitis aguda",
  "J06": "Infecciones agudas de las vías respiratorias superiores",
  "J18": "Neumonía, organismo no especificado",
  "J20": "Bronquitis aguda",
  "J45": "Asma",
  "K21": "Enfermedad por reflujo gastroesofágico",
  "K25": "Úlcera gástrica",
  "K29": "Gastritis y duodenitis",
  "K30": "Dispepsia funcional",
  "K59": "Otros trastornos funcionales del intestino",
  "M54": "Dorsalgia",
  "M79": "Otros trastornos de los tejidos blandos, no clasificados en otra parte",
  "N39": "Otros trastornos del sistema urinario",
  "R10": "Dolor abdominal y pélvico",
  "R50": "Fiebre de origen desconocido",
  "R51": "Cefalea",
  "Z00": "Examen general e investigación de personas sin quejas o diagnóstico informado",
};

// Catálogo de medicamentos para prescripción
const catalogoMedicamentos = [
  { nombre: "Paracetamol", presentaciones: ["500mg", "1g"], vias: ["Oral"] },
  { nombre: "Ibuprofeno", presentaciones: ["200mg", "400mg", "600mg"], vias: ["Oral"] },
  { nombre: "Omeprazol", presentaciones: ["20mg", "40mg"], vias: ["Oral"] },
  { nombre: "Losartán", presentaciones: ["25mg", "50mg", "100mg"], vias: ["Oral"] },
  { nombre: "Metformina", presentaciones: ["500mg", "850mg", "1000mg"], vias: ["Oral"] },
  { nombre: "Atorvastatina", presentaciones: ["10mg", "20mg", "40mg"], vias: ["Oral"] },
  { nombre: "Amoxicilina", presentaciones: ["250mg", "500mg", "875mg"], vias: ["Oral"] },
  { nombre: "Azitromicina", presentaciones: ["250mg", "500mg"], vias: ["Oral"] },
  { nombre: "Ciprofloxacino", presentaciones: ["250mg", "500mg"], vias: ["Oral"] },
  { nombre: "Salbutamol", presentaciones: ["100mcg/dosis"], vias: ["Inhalada"] },
  { nombre: "Prednisona", presentaciones: ["5mg", "20mg", "50mg"], vias: ["Oral"] },
  { nombre: "Diclofenaco", presentaciones: ["50mg", "75mg", "100mg"], vias: ["Oral", "Intramuscular"] },
  { nombre: "Ketorolaco", presentaciones: ["10mg", "30mg"], vias: ["Oral", "Intramuscular"] },
  { nombre: "Ranitidina", presentaciones: ["150mg", "300mg"], vias: ["Oral"] },
  { nombre: "Loratadina", presentaciones: ["10mg"], vias: ["Oral"] },
  { nombre: "Vitamina D3", presentaciones: ["400UI", "1000UI", "2000UI"], vias: ["Oral"] },
  { nombre: "Ácido fólico", presentaciones: ["400mcg", "5mg"], vias: ["Oral"] },
];

interface DatosClinicosForm {
  peso: string;
  estatura: string;
  frecuenciaCardiaca: string;
  presionSistolica: string;
  presionDiastolica: string;
  imc: string;
  masaCorporal: string;
  grasaCorporal: string;
  frecuenciaRespiratoria: string;
  temperatura: string;
}

interface DiagnosticoItem {
  id: string;
  clave: string;
  descripcion: string;
  fecha: string;
}

interface NotaItem {
  id: string;
  contenido: string;
  fecha: string;
}

interface PrescripcionItem {
  id: string;
  medicamento: string;
  dosis: string;
  frecuencia: string;
  duracion: string;
  via: string;
  indicaciones: string;
}

const subTabsConsulta = [
  { id: "datosclinicos", label: "Datos Clínicos", icon: Activity },
  { id: "diagnostico", label: "Diagnóstico", icon: Stethoscope },
  { id: "notas", label: "Notas", icon: FileEdit },
  { id: "prescripcion", label: "Prescripción", icon: Pill },
  { id: "resumen", label: "Resumen", icon: FileCheck },
] as const;

type SubTabConsultaId = (typeof subTabsConsulta)[number]["id"];

function ConsultaTab() {
  const [activeSubTab, setActiveSubTab] = useState<SubTabConsultaId>("datosclinicos");
  
  // Estados para Datos Clínicos
  const [datosClinicosForm, setDatosClinicosForm] = useState<DatosClinicosForm>({
    peso: "",
    estatura: "",
    frecuenciaCardiaca: "",
    presionSistolica: "",
    presionDiastolica: "",
    imc: "",
    masaCorporal: "",
    grasaCorporal: "",
    frecuenciaRespiratoria: "",
    temperatura: "",
  });
  
  // Estados para Diagnóstico
  const [diagnosticos, setDiagnosticos] = useState<DiagnosticoItem[]>([]);
  const [nuevaClave, setNuevaClave] = useState("");
  const [nuevoDiagnostico, setNuevoDiagnostico] = useState("");
  const [sugerenciasCIE, setSugerenciasCIE] = useState<Array<{clave: string; descripcion: string}>>([]);
  
  // Estados para Notas
  const [notas, setNotas] = useState<NotaItem[]>([]);
  const [nuevaNota, setNuevaNota] = useState("");
  
  // Estados para Prescripción
  const [prescripciones, setPrescripciones] = useState<PrescripcionItem[]>([]);
  const [prescripcionForm, setPrescripcionForm] = useState({
    medicamento: "",
    dosis: "",
    frecuencia: "",
    duracion: "",
    via: "",
    indicaciones: "",
  });
  const [busquedaMedicamento, setBusquedaMedicamento] = useState("");
  const [sugerenciasMedicamento, setSugerenciasMedicamento] = useState<typeof catalogoMedicamentos>([]);

  // Calcular IMC automáticamente
  const calcularIMC = (peso: string, estatura: string) => {
    const pesoNum = parseFloat(peso);
    const estaturaNum = parseFloat(estatura) / 100; // convertir cm a m
    if (pesoNum > 0 && estaturaNum > 0) {
      const imc = pesoNum / (estaturaNum * estaturaNum);
      return imc.toFixed(1);
    }
    return "";
  };

  const handleDatosClinicosChange = (field: keyof DatosClinicosForm, value: string) => {
    const newForm = { ...datosClinicosForm, [field]: value };
    
    // Calcular IMC cuando cambia peso o estatura
    if (field === "peso" || field === "estatura") {
      newForm.imc = calcularIMC(
        field === "peso" ? value : newForm.peso,
        field === "estatura" ? value : newForm.estatura
      );
    }
    
    setDatosClinicosForm(newForm);
  };

  // Buscar CIE-10 mientras escribe
  const handleClaveChange = (value: string) => {
    setNuevaClave(value.toUpperCase());
    
    if (value.length >= 1) {
      const coincidencias = Object.entries(catalogoCIE10)
        .filter(([clave]) => clave.startsWith(value.toUpperCase()))
        .map(([clave, descripcion]) => ({ clave, descripcion }))
        .slice(0, 5);
      setSugerenciasCIE(coincidencias);
      
      // Autocompletar diagnóstico si hay coincidencia exacta
      const exacta = catalogoCIE10[value.toUpperCase()];
      if (exacta) {
        setNuevoDiagnostico(exacta);
      }
    } else {
      setSugerenciasCIE([]);
      setNuevoDiagnostico("");
    }
  };

  const seleccionarCIE = (clave: string, descripcion: string) => {
    setNuevaClave(clave);
    setNuevoDiagnostico(descripcion);
    setSugerenciasCIE([]);
  };

  const agregarDiagnostico = () => {
    if (nuevaClave && nuevoDiagnostico) {
      setDiagnosticos([
        ...diagnosticos,
        {
          id: `DX-${Date.now()}`,
          clave: nuevaClave,
          descripcion: nuevoDiagnostico,
          fecha: new Date().toISOString(),
        },
      ]);
      setNuevaClave("");
      setNuevoDiagnostico("");
    }
  };

  const eliminarDiagnostico = (id: string) => {
    setDiagnosticos(diagnosticos.filter((d) => d.id !== id));
  };

  // Agregar nota
  const agregarNota = () => {
    if (nuevaNota.trim()) {
      setNotas([
        ...notas,
        {
          id: `NOTA-${Date.now()}`,
          contenido: nuevaNota.trim(),
          fecha: new Date().toISOString(),
        },
      ]);
      setNuevaNota("");
    }
  };

  const eliminarNota = (id: string) => {
    setNotas(notas.filter((n) => n.id !== id));
  };

  // Buscar medicamentos
  const handleBusquedaMedicamento = (value: string) => {
    setBusquedaMedicamento(value);
    setPrescripcionForm({ ...prescripcionForm, medicamento: value });
    
    if (value.length >= 2) {
      const coincidencias = catalogoMedicamentos.filter((m) =>
        m.nombre.toLowerCase().includes(value.toLowerCase())
      );
      setSugerenciasMedicamento(coincidencias);
    } else {
      setSugerenciasMedicamento([]);
    }
  };

  const seleccionarMedicamento = (med: typeof catalogoMedicamentos[0]) => {
    setPrescripcionForm({
      ...prescripcionForm,
      medicamento: med.nombre,
      dosis: med.presentaciones[0] || "",
      via: med.vias[0] || "",
    });
    setBusquedaMedicamento(med.nombre);
    setSugerenciasMedicamento([]);
  };

  const agregarPrescripcion = () => {
    if (prescripcionForm.medicamento && prescripcionForm.dosis) {
      setPrescripciones([
        ...prescripciones,
        {
          id: `RX-${Date.now()}`,
          ...prescripcionForm,
        },
      ]);
      setPrescripcionForm({
        medicamento: "",
        dosis: "",
        frecuencia: "",
        duracion: "",
        via: "",
        indicaciones: "",
      });
      setBusquedaMedicamento("");
    }
  };

  const eliminarPrescripcion = (id: string) => {
    setPrescripciones(prescripciones.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-5">
      {/* Sub-tabs */}
      <div className="border-b border-border">
        <nav className="flex gap-1 overflow-x-auto pb-px" aria-label="Secciones de consulta">
          {subTabsConsulta.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSubTab(id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeSubTab === id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido de sub-tabs */}
      <div className="pt-2">
        {/* DATOS CLÍNICOS */}
        {activeSubTab === "datosclinicos" && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-primary" />
              <h3 className="text-base font-semibold text-foreground">Datos Clínicos</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Peso */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5" /> Peso (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={datosClinicosForm.peso}
                  onChange={(e) => handleDatosClinicosChange("peso", e.target.value)}
                  className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="70.5"
                />
              </div>
              
              {/* Estatura */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5" /> Estatura (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={datosClinicosForm.estatura}
                  onChange={(e) => handleDatosClinicosChange("estatura", e.target.value)}
                  className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="175"
                />
              </div>

              {/* Frecuencia Cardíaca */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5" /> Frec. Cardíaca (bpm)
                </label>
                <input
                  type="number"
                  value={datosClinicosForm.frecuenciaCardiaca}
                  onChange={(e) => handleDatosClinicosChange("frecuenciaCardiaca", e.target.value)}
                  className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="72"
                />
              </div>

              {/* Presión Sistólica */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5" /> Presión Sistólica (mmHg)
                </label>
                <input
                  type="number"
                  value={datosClinicosForm.presionSistolica}
                  onChange={(e) => handleDatosClinicosChange("presionSistolica", e.target.value)}
                  className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="120"
                />
              </div>

              {/* Presión Diastólica */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5" /> Presión Diastólica (mmHg)
                </label>
                <input
                  type="number"
                  value={datosClinicosForm.presionDiastolica}
                  onChange={(e) => handleDatosClinicosChange("presionDiastolica", e.target.value)}
                  className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="80"
                />
              </div>

              {/* IMC (calculado automáticamente) */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <TrendingDown className="w-3.5 h-3.5" /> IMC
                </label>
                <input
                  type="text"
                  value={datosClinicosForm.imc}
                  readOnly
                  className="w-full border border-border rounded-md px-3 py-2 text-sm bg-muted/50 text-foreground cursor-not-allowed"
                  placeholder="Calculado"
                />
              </div>

              {/* % Masa Corporal */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5" /> % Masa Corporal
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={datosClinicosForm.masaCorporal}
                  onChange={(e) => handleDatosClinicosChange("masaCorporal", e.target.value)}
                  className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="45.5"
                />
              </div>

              {/* Grasa Corporal */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5" /> Grasa Corporal (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={datosClinicosForm.grasaCorporal}
                  onChange={(e) => handleDatosClinicosChange("grasaCorporal", e.target.value)}
                  className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="18.5"
                />
              </div>

              {/* Frecuencia Respiratoria */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5" /> Frec. Respiratoria (rpm)
                </label>
                <input
                  type="number"
                  value={datosClinicosForm.frecuenciaRespiratoria}
                  onChange={(e) => handleDatosClinicosChange("frecuenciaRespiratoria", e.target.value)}
                  className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="16"
                />
              </div>

              {/* Temperatura */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5" /> Temperatura (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={datosClinicosForm.temperatura}
                  onChange={(e) => handleDatosClinicosChange("temperatura", e.target.value)}
                  className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="36.5"
                />
              </div>
            </div>

            {/* Resumen de presión arterial */}
            {datosClinicosForm.presionSistolica && datosClinicosForm.presionDiastolica && (
              <div className="mt-4 p-4 bg-card border border-border rounded-lg">
                <p className="text-sm font-medium text-foreground">
                  Presión Arterial: {datosClinicosForm.presionSistolica}/{datosClinicosForm.presionDiastolica} mmHg
                  <span className={`ml-2 text-xs font-medium ${presionCategoria(
                    parseInt(datosClinicosForm.presionSistolica),
                    parseInt(datosClinicosForm.presionDiastolica)
                  ).cls}`}>
                    ({presionCategoria(
                      parseInt(datosClinicosForm.presionSistolica),
                      parseInt(datosClinicosForm.presionDiastolica)
                    ).label})
                  </span>
                </p>
              </div>
            )}

            {/* Resumen de IMC */}
            {datosClinicosForm.imc && (
              <div className="p-4 bg-card border border-border rounded-lg">
                <p className="text-sm font-medium text-foreground">
                  IMC: {datosClinicosForm.imc}
                  <span className={`ml-2 text-xs font-medium ${imcCategoria(parseFloat(datosClinicosForm.imc)).cls}`}>
                    ({imcCategoria(parseFloat(datosClinicosForm.imc)).label})
                  </span>
                </p>
              </div>
            )}

            <button className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
              <Save className="w-4 h-4" />
              Guardar Datos Clínicos
            </button>
          </div>
        )}

        {/* DIAGNÓSTICO */}
        {activeSubTab === "diagnostico" && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 mb-4">
              <Stethoscope className="w-5 h-5 text-primary" />
              <h3 className="text-base font-semibold text-foreground">Diagnóstico</h3>
            </div>

            {/* Formulario de nuevo diagnóstico */}
            <div className="bg-card border border-border rounded-lg p-5 space-y-4">
              <p className="text-sm font-medium text-foreground">Agregar diagnóstico (CIE-10)</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                {/* Campo de clave CIE-10 */}
                <div className="space-y-1.5 relative">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5" /> Clave CIE-10
                  </label>
                  <input
                    type="text"
                    value={nuevaClave}
                    onChange={(e) => handleClaveChange(e.target.value)}
                    className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 uppercase"
                    placeholder="Ej: I10, J45, E11..."
                  />
                  {/* Sugerencias */}
                  {sugerenciasCIE.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
                      {sugerenciasCIE.map(({ clave, descripcion }) => (
                        <button
                          key={clave}
                          type="button"
                          onClick={() => seleccionarCIE(clave, descripcion)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-muted/50 transition-colors flex items-center gap-2"
                        >
                          <span className="font-mono font-semibold text-primary">{clave}</span>
                          <span className="text-foreground truncate">{descripcion}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Campo de diagnóstico (autocompletado) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <ClipboardList className="w-3.5 h-3.5" /> Diagnóstico
                  </label>
                  <input
                    type="text"
                    value={nuevoDiagnostico}
                    onChange={(e) => setNuevoDiagnostico(e.target.value)}
                    className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Se autocompleta al ingresar clave"
                  />
                </div>
              </div>

              <button
                onClick={agregarDiagnostico}
                disabled={!nuevaClave || !nuevoDiagnostico}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                Agregar Diagnóstico
              </button>
            </div>

            {/* Lista de diagnósticos agregados */}
            {diagnosticos.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Diagnósticos agregados ({diagnosticos.length})</p>
                <div className="space-y-2">
                  {diagnosticos.map((dx) => (
                    <div key={dx.id} className="flex items-center justify-between gap-3 bg-card border border-border rounded-lg p-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded font-mono text-sm font-semibold shrink-0">
                          {dx.clave}
                        </span>
                        <span className="text-sm text-foreground truncate">{dx.descripcion}</span>
                      </div>
                      <button
                        onClick={() => eliminarDiagnostico(dx.id)}
                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors shrink-0"
                        aria-label="Eliminar diagnóstico"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {diagnosticos.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Stethoscope className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No hay diagnósticos agregados</p>
                <p className="text-xs mt-1">Ingresa una clave CIE-10 para comenzar</p>
              </div>
            )}
          </div>
        )}

        {/* NOTAS */}
        {activeSubTab === "notas" && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 mb-4">
              <FileEdit className="w-5 h-5 text-primary" />
              <h3 className="text-base font-semibold text-foreground">Notas Médicas</h3>
            </div>

            {/* Formulario de nueva nota */}
            <div className="bg-card border border-border rounded-lg p-5 space-y-4">
              <label className="text-sm font-medium text-foreground">Nueva nota</label>
              <textarea
                value={nuevaNota}
                onChange={(e) => setNuevaNota(e.target.value)}
                rows={4}
                className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                placeholder="Escriba sus observaciones, indicaciones o notas clínicas aquí..."
              />
              <button
                onClick={agregarNota}
                disabled={!nuevaNota.trim()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                Agregar Nota
              </button>
            </div>

            {/* Lista de notas */}
            {notas.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Notas guardadas ({notas.length})</p>
                <div className="space-y-2">
                  {notas.map((nota, index) => (
                    <div key={nota.id} className="bg-card border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-primary">{notas.length - index}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground mb-1">
                              {fmtFechaHora(nota.fecha)}
                            </p>
                            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                              {nota.contenido}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => eliminarNota(nota.id)}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors shrink-0"
                          aria-label="Eliminar nota"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {notas.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No hay notas registradas</p>
                <p className="text-xs mt-1">Agregue notas clínicas para este paciente</p>
              </div>
            )}
          </div>
        )}

        {/* PRESCRIPCIÓN */}
        {activeSubTab === "prescripcion" && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 mb-4">
              <Pill className="w-5 h-5 text-primary" />
              <h3 className="text-base font-semibold text-foreground">Prescripción de Medicamentos</h3>
            </div>

            {/* Formulario de nueva prescripción */}
            <div className="bg-card border border-border rounded-lg p-5 space-y-4">
              <p className="text-sm font-medium text-foreground">Agregar medicamento</p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Medicamento con búsqueda */}
                <div className="space-y-1.5 relative md:col-span-2 lg:col-span-1">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5" /> Medicamento
                  </label>
                  <input
                    type="text"
                    value={busquedaMedicamento}
                    onChange={(e) => handleBusquedaMedicamento(e.target.value)}
                    className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Buscar medicamento..."
                  />
                  {sugerenciasMedicamento.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
                      {sugerenciasMedicamento.map((med) => (
                        <button
                          key={med.nombre}
                          type="button"
                          onClick={() => seleccionarMedicamento(med)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-muted/50 transition-colors"
                        >
                          <span className="font-medium text-foreground">{med.nombre}</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            {med.presentaciones.join(", ")}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Dosis */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Dosis</label>
                  <input
                    type="text"
                    value={prescripcionForm.dosis}
                    onChange={(e) => setPrescripcionForm({ ...prescripcionForm, dosis: e.target.value })}
                    className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="500mg"
                  />
                </div>

                {/* Vía */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Vía</label>
                  <select
                    value={prescripcionForm.via}
                    onChange={(e) => setPrescripcionForm({ ...prescripcionForm, via: e.target.value })}
                    className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Seleccionar</option>
                    <option value="Oral">Oral</option>
                    <option value="Intramuscular">Intramuscular</option>
                    <option value="Intravenosa">Intravenosa</option>
                    <option value="Subcutánea">Subcutánea</option>
                    <option value="Tópica">Tópica</option>
                    <option value="Inhalada">Inhalada</option>
                    <option value="Sublingual">Sublingual</option>
                  </select>
                </div>

                {/* Frecuencia */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Frecuencia</label>
                  <select
                    value={prescripcionForm.frecuencia}
                    onChange={(e) => setPrescripcionForm({ ...prescripcionForm, frecuencia: e.target.value })}
                    className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Seleccionar</option>
                    <option value="Cada 4 horas">Cada 4 horas</option>
                    <option value="Cada 6 horas">Cada 6 horas</option>
                    <option value="Cada 8 horas">Cada 8 horas</option>
                    <option value="Cada 12 horas">Cada 12 horas</option>
                    <option value="Cada 24 horas">Cada 24 horas</option>
                    <option value="Dosis única">Dosis única</option>
                    <option value="PRN (según necesidad)">PRN (según necesidad)</option>
                  </select>
                </div>

                {/* Duración */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Duración</label>
                  <select
                    value={prescripcionForm.duracion}
                    onChange={(e) => setPrescripcionForm({ ...prescripcionForm, duracion: e.target.value })}
                    className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Seleccionar</option>
                    <option value="3 días">3 días</option>
                    <option value="5 días">5 días</option>
                    <option value="7 días">7 días</option>
                    <option value="10 días">10 días</option>
                    <option value="14 días">14 días</option>
                    <option value="30 días">30 días</option>
                    <option value="Indefinido">Indefinido</option>
                  </select>
                </div>

                {/* Indicaciones */}
                <div className="space-y-1.5 md:col-span-2 lg:col-span-3">
                  <label className="text-xs font-medium text-muted-foreground">Indicaciones adicionales</label>
                  <input
                    type="text"
                    value={prescripcionForm.indicaciones}
                    onChange={(e) => setPrescripcionForm({ ...prescripcionForm, indicaciones: e.target.value })}
                    className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Tomar con alimentos, no mezclar con alcohol, etc."
                  />
                </div>
              </div>

              <button
                onClick={agregarPrescripcion}
                disabled={!prescripcionForm.medicamento || !prescripcionForm.dosis}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                Agregar Medicamento
              </button>
            </div>

            {/* Lista de prescripciones */}
            {prescripciones.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Medicamentos prescritos ({prescripciones.length})</p>
                <div className="space-y-2">
                  {prescripciones.map((rx) => (
                    <div key={rx.id} className="bg-card border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Pill className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-foreground">{rx.medicamento}</p>
                            <div className="flex flex-wrap gap-2 mt-1 text-xs text-muted-foreground">
                              <span className="px-2 py-0.5 bg-muted rounded-full">{rx.dosis}</span>
                              {rx.via && <span className="px-2 py-0.5 bg-muted rounded-full">{rx.via}</span>}
                              {rx.frecuencia && <span className="px-2 py-0.5 bg-muted rounded-full">{rx.frecuencia}</span>}
                              {rx.duracion && <span className="px-2 py-0.5 bg-muted rounded-full">{rx.duracion}</span>}
                            </div>
                            {rx.indicaciones && (
                              <p className="text-xs text-muted-foreground mt-2 italic">
                                {rx.indicaciones}
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => eliminarPrescripcion(rx.id)}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors shrink-0"
                          aria-label="Eliminar prescripción"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                  <Save className="w-4 h-4" />
                  Guardar Receta
                </button>
              </div>
            )}

            {prescripciones.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Pill className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No hay medicamentos prescritos</p>
                <p className="text-xs mt-1">Busque un medicamento para agregarlo a la receta</p>
              </div>
            )}
          </div>
        )}

        {/* RESUMEN */}
        {activeSubTab === "resumen" && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <FileCheck className="w-5 h-5 text-primary" />
              <h3 className="text-base font-semibold text-foreground">Resumen de la Consulta</h3>
            </div>

            {/* Resumen de Datos Clínicos */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="bg-muted/50 px-5 py-3 border-b border-border">
                <h4 className="font-semibold text-foreground flex items-center gap-2 text-sm">
                  <Activity className="w-4 h-4 text-primary" />
                  Datos Clínicos
                </h4>
              </div>
              <div className="p-5">
                {(datosClinicosForm.peso || datosClinicosForm.estatura || datosClinicosForm.frecuenciaCardiaca || datosClinicosForm.temperatura) ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {datosClinicosForm.peso && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Peso</p>
                        <p className="font-semibold text-foreground">{datosClinicosForm.peso} kg</p>
                      </div>
                    )}
                    {datosClinicosForm.estatura && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Estatura</p>
                        <p className="font-semibold text-foreground">{datosClinicosForm.estatura} cm</p>
                      </div>
                    )}
                    {datosClinicosForm.imc && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">IMC</p>
                        <p className="font-semibold text-foreground">
                          {datosClinicosForm.imc}
                          <span className={`ml-2 text-xs ${imcCategoria(parseFloat(datosClinicosForm.imc)).cls}`}>
                            ({imcCategoria(parseFloat(datosClinicosForm.imc)).label})
                          </span>
                        </p>
                      </div>
                    )}
                    {datosClinicosForm.frecuenciaCardiaca && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Frec. Cardíaca</p>
                        <p className="font-semibold text-foreground">{datosClinicosForm.frecuenciaCardiaca} bpm</p>
                      </div>
                    )}
                    {(datosClinicosForm.presionSistolica && datosClinicosForm.presionDiastolica) && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Presión Arterial</p>
                        <p className="font-semibold text-foreground">
                          {datosClinicosForm.presionSistolica}/{datosClinicosForm.presionDiastolica} mmHg
                          <span className={`ml-2 text-xs ${presionCategoria(
                            parseInt(datosClinicosForm.presionSistolica),
                            parseInt(datosClinicosForm.presionDiastolica)
                          ).cls}`}>
                            ({presionCategoria(
                              parseInt(datosClinicosForm.presionSistolica),
                              parseInt(datosClinicosForm.presionDiastolica)
                            ).label})
                          </span>
                        </p>
                      </div>
                    )}
                    {datosClinicosForm.frecuenciaRespiratoria && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Frec. Respiratoria</p>
                        <p className="font-semibold text-foreground">{datosClinicosForm.frecuenciaRespiratoria} rpm</p>
                      </div>
                    )}
                    {datosClinicosForm.temperatura && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Temperatura</p>
                        <p className="font-semibold text-foreground">{datosClinicosForm.temperatura} °C</p>
                      </div>
                    )}
                    {datosClinicosForm.masaCorporal && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">% Masa Corporal</p>
                        <p className="font-semibold text-foreground">{datosClinicosForm.masaCorporal}%</p>
                      </div>
                    )}
                    {datosClinicosForm.grasaCorporal && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Grasa Corporal</p>
                        <p className="font-semibold text-foreground">{datosClinicosForm.grasaCorporal}%</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No se han registrado datos clínicos</p>
                )}
              </div>
            </div>

            {/* Resumen de Diagnósticos */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="bg-muted/50 px-5 py-3 border-b border-border">
                <h4 className="font-semibold text-foreground flex items-center gap-2 text-sm">
                  <Stethoscope className="w-4 h-4 text-primary" />
                  Diagnósticos ({diagnosticos.length})
                </h4>
              </div>
              <div className="p-5">
                {diagnosticos.length > 0 ? (
                  <div className="space-y-2">
                    {diagnosticos.map((dx) => (
                      <div key={dx.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded font-mono text-sm font-semibold shrink-0">
                          {dx.clave}
                        </span>
                        <span className="text-sm text-foreground">{dx.descripcion}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No se han registrado diagnósticos</p>
                )}
              </div>
            </div>

            {/* Resumen de Notas */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="bg-muted/50 px-5 py-3 border-b border-border">
                <h4 className="font-semibold text-foreground flex items-center gap-2 text-sm">
                  <FileEdit className="w-4 h-4 text-primary" />
                  Notas Médicas ({notas.length})
                </h4>
              </div>
              <div className="p-5">
                {notas.length > 0 ? (
                  <div className="space-y-3">
                    {notas.map((nota) => (
                      <div key={nota.id} className="p-3 bg-muted/30 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">{fmtFechaHora(nota.fecha)}</p>
                        <p className="text-sm text-foreground whitespace-pre-wrap">{nota.contenido}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No se han registrado notas médicas</p>
                )}
              </div>
            </div>

            {/* Resumen de Prescripciones */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="bg-muted/50 px-5 py-3 border-b border-border">
                <h4 className="font-semibold text-foreground flex items-center gap-2 text-sm">
                  <Pill className="w-4 h-4 text-primary" />
                  Prescripciones ({prescripciones.length})
                </h4>
              </div>
              <div className="p-5">
                {prescripciones.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase">Medicamento</th>
                          <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase">Dosis</th>
                          <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase">Vía</th>
                          <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase">Frecuencia</th>
                          <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase">Duración</th>
                        </tr>
                      </thead>
                      <tbody>
                        {prescripciones.map((rx) => (
                          <tr key={rx.id} className="border-b border-border last:border-0">
                            <td className="py-2 px-3 font-medium text-foreground">{rx.medicamento}</td>
                            <td className="py-2 px-3 text-foreground">{rx.dosis}</td>
                            <td className="py-2 px-3 text-foreground">{rx.via || "-"}</td>
                            <td className="py-2 px-3 text-foreground">{rx.frecuencia || "-"}</td>
                            <td className="py-2 px-3 text-foreground">{rx.duracion || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No se han prescrito medicamentos</p>
                )}
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                <Save className="w-4 h-4" />
                Guardar Consulta
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2 border border-border text-foreground rounded-md text-sm font-medium hover:bg-muted transition-colors">
                <FileText className="w-4 h-4" />
                Imprimir Resumen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// TAB: MEDICAMENTOS
// ─────────────────────────────────────────────

function MedicamentosTab({ medicamentos, recordatorios }: { medicamentos: Medicamento[]; recordatorios: Recordatorio[] }) {
  const activos     = medicamentos.filter((m) => !m.fechaFin || new Date(m.fechaFin) >= new Date());
  const finalizados = medicamentos.filter((m) => m.fechaFin && new Date(m.fechaFin) < new Date());
  const getRecs = (medId: string) => recordatorios.filter((r) => r.medicamentoId === medId);

  const renderMed = (med: Medicamento, esActivo: boolean) => {
    const recs = getRecs(med.id);
    return (
      <div key={med.id} className={`bg-card border rounded-lg p-5 space-y-3 ${esActivo ? "border-border" : "border-border/50 opacity-70"}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${esActivo ? "bg-primary/10" : "bg-muted"}`}>
              <Pill className={`w-4 h-4 ${esActivo ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <div>
              <p className="font-semibold text-foreground">{med.nombre}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{med.dosis} — {med.frecuencia}</p>
            </div>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full border font-medium shrink-0 ${esActivo ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-muted text-muted-foreground border-border"}`}>
            {esActivo ? "Activo" : "Finalizado"}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Inicio: {fmtFecha(med.fechaInicio, { corto: true })}</span>
          {med.fechaFin && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Fin: {fmtFecha(med.fechaFin, { corto: true })}</span>}
        </div>
        {recs.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {recs.map((rec) => (
              <span key={rec.id} className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full border ${rec.activo ? "bg-accent/10 text-accent border-accent/30" : "bg-muted text-muted-foreground border-border"}`}>
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
    <div className="space-y-6">
      {activos.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Pill className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Medicamentos activos</h3>
            <span className="ml-auto text-xs text-muted-foreground">{activos.length}</span>
          </div>
          <div className="space-y-3">{activos.map((m) => renderMed(m, true))}</div>
        </section>
      )}
      {finalizados.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Pill className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Medicamentos anteriores</h3>
            <span className="ml-auto text-xs text-muted-foreground">{finalizados.length}</span>
          </div>
          <div className="space-y-3">{finalizados.map((m) => renderMed(m, false))}</div>
        </section>
      )}
      {medicamentos.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Pill className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No hay medicamentos registrados</p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// TABS CONFIG
// ─────────────────────────────────────────────

const tabs = [
  { id: "dashboard",    label: "Resumen",         icon: LayoutDashboard },
  { id: "datos",        label: "Datos generales", icon: User },
  { id: "signos",       label: "Signos vitales",  icon: Activity },
  { id: "expediente",   label: "Expediente",      icon: FolderOpen },
  { id: "visitas",      label: "Visitas",         icon: Stethoscope },
  { id: "medicamentos", label: "Medicamentos",    icon: Pill },
  { id: "consulta",     label: "Consulta",        icon: ClipboardList },
] as const;

type TabId = (typeof tabs)[number]["id"];

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────

export default function Page() {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const paciente = pacienteMock;
  const dp = paciente.datosPersonales;
  const nombreCompleto = [dp.nombre, dp.apellidoPaterno, dp.apellidoMaterno].filter(Boolean).join(" ");
  const edad = calcularEdad(dp.fechaNacimiento);

  return (
    <div className="min-h-screen flex bg-background font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col justify-between">
        
        {/* Top logo */}
        <div className="p-4 flex items-center gap-3 border-b border-sidebar-border">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <Stethoscope className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-sidebar-foreground font-semibold text-sm tracking-tight">
            Expediente Clínico
          </span>
        </div>

        {/* Tabs (navigation) */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                activeTab === id
                  ? "bg-sidebar-accent text-sidebar-foreground"
                  : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-sidebar-border">
          <LogOutButton />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1">
        
        {/* Patient banner */}
        <div className="bg-sidebar border-b border-sidebar-border px-4 md:px-8 py-5">
          <div className="flex items-center gap-4">
            <div className="shrink-0">
              <AvatarPaciente edad={edad} sexo={dp.sexo} />
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-sidebar-foreground text-balance">
                {nombreCompleto}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-sidebar-foreground/60">
                <span>{dp.sexo}</span>
                <span className="hidden sm:inline">·</span>
                <span>{edad} años</span>
                <span className="hidden sm:inline">·</span>
                {dp.curp && <span className="font-mono text-xs">{dp.curp}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="px-4 md:px-8 py-6 max-w-6xl mx-auto">
          {activeTab === "dashboard"    && paciente.dashboard && <DashboardTab dashboard={paciente.dashboard} />}
          {activeTab === "datos"        && <DatosGeneralesTab datosPersonales={paciente.datosPersonales} direccion={paciente.direccion} contacto={paciente.contacto} datosFiscales={paciente.datosFiscales} />}
          {activeTab === "signos"       && <SignosVitalesTab  signosVitales={paciente.signosVitales} />}
          {activeTab === "expediente"   && <ExpedienteTab     diagnosticos={paciente.diagnosticos} citas={paciente.citas} notas={paciente.notas} />}
          {activeTab === "visitas"      && <VisitasTab        visitas={paciente.visitas} />}
          {activeTab === "medicamentos" && <MedicamentosTab   medicamentos={paciente.medicamentos} recordatorios={paciente.recordatorios} />}
          {activeTab === "consulta"     && <ConsultaTab />}
        </main>
      </div>
    </div>
  );
}