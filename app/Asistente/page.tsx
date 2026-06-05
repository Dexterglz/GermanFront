"use client";

import { useState, useEffect } from "react";
import type React from "react";
import {
  LayoutDashboard,
  User,
  Activity,
  Calendar,
  Stethoscope,
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
  Bell,
  BellOff,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react";

// ─────────────────────────────────────────────
// PATIENT SERVICE (SOLO LECTURA)
// ─────────────────────────────────────────────

const BASE_URL = "http://localhost:3000/api";

const getAuthHeaders = (): HeadersInit => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
};

const patientService = {
  getMyAppointments: () =>
    fetch(`${BASE_URL}/appointments`, { method: "GET", headers: getAuthHeaders() }).then((r) => r.json()),
  getMyDatosMedicos: (patientId: string) =>
    fetch(`${BASE_URL}/datosmedicos/${patientId}`, { method: "GET", headers: getAuthHeaders() }).then((r) => r.json()),
  getMySignosVitales: (patientId: string) =>
    fetch(`${BASE_URL}/signosvitales/${patientId}`, { method: "GET", headers: getAuthHeaders() }).then((r) => r.json()),
  getMySOAP: (patientId: string) =>
    fetch(`${BASE_URL}/soap/${patientId}`, { method: "GET", headers: getAuthHeaders() }).then((r) => r.json()),
  getMyAlergias: (patientId: string) =>
    fetch(`${BASE_URL}/patientalergias/${patientId}`, { method: "GET", headers: getAuthHeaders() }).then((r) => r.json()),
  getMyPrescripciones: (patientId: string) =>
    fetch(`${BASE_URL}/prescripcionprenscripciones/${patientId}`, { method: "GET", headers: getAuthHeaders() }).then((r) => r.json()),
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
    { id: "MED-001", pacienteId: "PAC-001", nombre: "Losartán",     dosis: "25 mg",    frecuencia: "1 vez al día (mañana)", fechaInicio: "2024-01-15" },
    { id: "MED-002", pacienteId: "PAC-001", nombre: "Ácido fólico", dosis: "400 mcg",  frecuencia: "1 vez al día",          fechaInicio: "2024-01-15", fechaFin: "2024-04-15" },
    { id: "MED-003", pacienteId: "PAC-001", nombre: "Vitamina D3",  dosis: "1000 UI",  frecuencia: "1 vez al día",          fechaInicio: "2024-02-20" },
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
  const etapa = edad <= 2 ? "bebe" : edad <= 11 ? "nino" : edad <= 17 ? "adolescente" : "adulto";
  const isMasc = sexo === "Masculino";
  const isFem = sexo === "Femenino";
  const skinTone = "#f4c591";
  const hairColor = isMasc ? "#4a3728" : isFem ? "#8b4513" : "#5a5a5a";
  const shirtColor = isMasc ? "#3b82f6" : isFem ? "#ec4899" : "#6b7280";
  const pantColor = isMasc ? "#1e40af" : isFem ? "#9d174d" : "#374151";
  const etapaLabel =
    etapa === "bebe" ? "Bebé" :
    etapa === "nino" ? (isFem ? "Niña" : "Niño") :
    etapa === "adolescente" ? "Adolescente" :
    isFem ? "Adulta" : "Adulto";

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-14 h-14 rounded-full bg-sidebar-accent/60 border-2 border-sidebar-border flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 64 64" width="52" height="52" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          {etapa === "bebe" && (
            <>
              <ellipse cx="32" cy="50" rx="14" ry="10" fill={shirtColor} opacity="0.9" />
              <circle cx="32" cy="28" r="14" fill={skinTone} />
              <ellipse cx="32" cy="16" rx="7" ry="4" fill={hairColor} />
              <circle cx="27" cy="28" r="2" fill="#1a1a1a" />
              <circle cx="37" cy="28" r="2" fill="#1a1a1a" />
              <circle cx="28" cy="27" r="0.8" fill="white" />
              <circle cx="38" cy="27" r="0.8" fill="white" />
              <path d="M28 33 Q32 37 36 33" stroke="#c0725a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <circle cx="23" cy="32" r="3" fill="#f4a0a0" opacity="0.5" />
              <circle cx="41" cy="32" r="3" fill="#f4a0a0" opacity="0.5" />
            </>
          )}
          {etapa === "nino" && (
            <>
              <rect x="24" y="46" width="7" height="12" rx="3" fill={pantColor} />
              <rect x="33" y="46" width="7" height="12" rx="3" fill={pantColor} />
              <rect x="20" y="32" width="24" height="16" rx="5" fill={shirtColor} />
              <rect x="10" y="33" width="11" height="6" rx="3" fill={shirtColor} />
              <rect x="43" y="33" width="11" height="6" rx="3" fill={shirtColor} />
              <circle cx="10" cy="36" r="3.5" fill={skinTone} />
              <circle cx="54" cy="36" r="3.5" fill={skinTone} />
              <rect x="29" y="27" width="6" height="7" rx="2" fill={skinTone} />
              <circle cx="32" cy="20" r="12" fill={skinTone} />
              {isFem ? (
                <>
                  <ellipse cx="32" cy="9" rx="12" ry="6" fill={hairColor} />
                  <ellipse cx="20" cy="18" rx="4" ry="8" fill={hairColor} />
                  <ellipse cx="44" cy="18" rx="4" ry="8" fill={hairColor} />
                </>
              ) : (
                <ellipse cx="32" cy="9" rx="12" ry="6" fill={hairColor} />
              )}
              <circle cx="27" cy="20" r="2.2" fill="#1a1a1a" />
              <circle cx="37" cy="20" r="2.2" fill="#1a1a1a" />
              <circle cx="27.8" cy="19.2" r="0.9" fill="white" />
              <circle cx="37.8" cy="19.2" r="0.9" fill="white" />
              <ellipse cx="32" cy="23" rx="1.5" ry="1" fill="#d4956a" />
              <path d="M28 27 Q32 31 36 27" stroke="#c0725a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <circle cx="22" cy="24" r="3" fill="#f4a0a0" opacity="0.45" />
              <circle cx="42" cy="24" r="3" fill="#f4a0a0" opacity="0.45" />
            </>
          )}
          {etapa === "adolescente" && (
            <>
              <rect x="23" y="44" width="8" height="16" rx="3" fill={pantColor} />
              <rect x="33" y="44" width="8" height="16" rx="3" fill={pantColor} />
              <rect x="19" y="30" width="26" height="16" rx="5" fill={shirtColor} />
              <rect x="8" y="31" width="12" height="6" rx="3" fill={shirtColor} />
              <rect x="44" y="31" width="12" height="6" rx="3" fill={shirtColor} />
              <circle cx="8" cy="34" r="4" fill={skinTone} />
              <circle cx="56" cy="34" r="4" fill={skinTone} />
              <rect x="28.5" y="24" width="7" height="8" rx="2.5" fill={skinTone} />
              <ellipse cx="32" cy="17" rx="11" ry="13" fill={skinTone} />
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
              <ellipse cx="27" cy="17" rx="2.5" ry="2.5" fill="#1a1a1a" />
              <ellipse cx="37" cy="17" rx="2.5" ry="2.5" fill="#1a1a1a" />
              <circle cx="27.8" cy="16" r="1" fill="white" />
              <circle cx="37.8" cy="16" r="1" fill="white" />
              <path d="M30.5 20 Q32 22 33.5 20" stroke="#d4956a" strokeWidth="1.2" fill="none" />
              <path d="M28.5 24 Q32 27.5 35.5 24" stroke="#c0725a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </>
          )}
          {etapa === "adulto" && (
            <>
              <rect x="22" y="44" width="9" height="16" rx="3.5" fill={pantColor} />
              <rect x="33" y="44" width="9" height="16" rx="3.5" fill={pantColor} />
              {isFem ? (
                <path d="M18 30 Q18 44 22 46 L42 46 Q46 44 46 30 Q40 34 32 34 Q24 34 18 30 Z" fill={shirtColor} />
              ) : (
                <rect x="18" y="30" width="28" height="16" rx="5" fill={shirtColor} />
              )}
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
                  <path d="M22 24 Q32 30 42 24" stroke={hairColor} strokeWidth="2" fill="none" opacity="0.4" />
                </>
              )}
              <ellipse cx="26.5" cy="16" rx="2.8" ry="2.8" fill="#1a1a1a" />
              <ellipse cx="37.5" cy="16" rx="2.8" ry="2.8" fill="#1a1a1a" />
              <circle cx="27.5" cy="15" r="1.1" fill="white" />
              <circle cx="38.5" cy="15" r="1.1" fill="white" />
              <path d="M30 20 Q32 23 34 20" stroke="#d4956a" strokeWidth="1.3" fill="none" />
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
// TAB: VISITAS (Agendar citas)
// ─────────────────────────────────────────────

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

const citasExistentesMock: CitaAgendada[] = [
  {
    id: "CITA-001", fecha: "2024-02-15", horaInicio: "10:00", horaCierre: "10:30",
    tipo: "cita", primeraVez: false, tipoConsulta: "Consulta de seguimiento",
    especialidad: "Cardiología", seguro: "IMSS", servicios: ["consulta"],
    cupon: "", descuento: 0, precioBase: 800, precioFinal: 800,
  },
  {
    id: "CITA-002", fecha: "2024-02-18", horaInicio: "14:00", horaCierre: "14:30",
    tipo: "urgencia", primeraVez: false, tipoConsulta: "Urgencia",
    especialidad: "Medicina General", seguro: "Sin seguro (Particular)",
    servicios: ["consulta", "laboratorio"], cupon: "DESC10",
    descuento: 10, precioBase: 2000, precioFinal: 1800,
  },
];

const horasDisponibles = [
  "08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30",
  "12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30",
  "16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30",
];

function VisitasTab({ visitas }: { visitas: Visita[] }) {
  const [citasAgendadas, setCitasAgendadas] = useState<CitaAgendada[]>(citasExistentesMock);
  const [mesActual, setMesActual] = useState(new Date());

  // Cargar las citas del paciente desde la API (solo lectura)
  useEffect(() => {
    patientService
      .getMyAppointments()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapeadas: CitaAgendada[] = data.map((c: Record<string, unknown>) => {
            const scheduled = c.scheduledAt ? new Date(c.scheduledAt as string) : new Date();
            const end = c.endAt ? new Date(c.endAt as string) : null;
            const hh = (d: Date) => `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
            return {
              id: String(c.id ?? `CITA-${Math.random()}`),
              fecha: scheduled.toISOString().substring(0, 10),
              horaInicio: hh(scheduled),
              horaCierre: end ? hh(end) : hh(scheduled),
              tipo: (c.modality === "URGENCIA" ? "urgencia" : "cita") as "cita" | "urgencia",
              primeraVez: false,
              tipoConsulta: String(c.notes ?? "Consulta"),
              especialidad: "",
              seguro: "",
              servicios: [],
              cupon: "",
              descuento: 0,
              precioBase: Number(c.price ?? 0),
              precioFinal: Number(c.price ?? 0),
            };
          });
          setCitasAgendadas(mapeadas);
        }
      })
      .catch(() => {
        // Si la API no responde, se mantienen los datos mock
      });
  }, []);

  const generarDiasMes = (fecha: Date) => {
    const año = fecha.getFullYear();
    const mes = fecha.getMonth();
    const primerDia = new Date(año, mes, 1);
    const ultimoDia = new Date(año, mes + 1, 0);
    const diasEnMes = ultimoDia.getDate();
    const diaInicioSemana = primerDia.getDay();
    const dias: Array<{ fecha: string; dia: number; esOtroMes: boolean }> = [];
    const mesAnteriorDate = new Date(año, mes, 0);
    const diasMesAnterior = mesAnteriorDate.getDate();
    for (let i = diaInicioSemana - 1; i >= 0; i--) {
      const diaNum = diasMesAnterior - i;
      const fechaStr = `${año}-${String(mes).padStart(2, "0")}-${String(diaNum).padStart(2, "0")}`;
      dias.push({ fecha: fechaStr, dia: diaNum, esOtroMes: true });
    }
    for (let dia = 1; dia <= diasEnMes; dia++) {
      const fechaStr = `${año}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
      dias.push({ fecha: fechaStr, dia, esOtroMes: false });
    }
    const diasRestantes = 42 - dias.length;
    for (let dia = 1; dia <= diasRestantes; dia++) {
      const fechaStr = `${año}-${String(mes + 2).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
      dias.push({ fecha: fechaStr, dia, esOtroMes: true });
    }
    return dias;
  };

  const diasMes = generarDiasMes(mesActual);
  const nombresMeses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const nombresDias = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];

  const obtenerEstadoDia = (fechaStr: string): "disponible" | "cita" | "urgencia" | null => {
    const cita = citasAgendadas.find((c) => c.fecha === fechaStr);
    if (cita) return cita.tipo;
    return "disponible";
  };

  const irMesAnterior = () => setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() - 1, 1));
  const irMesSiguiente = () => setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 1));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Mis Citas</h2>
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-card border border-border rounded-lg">
        <span className="text-sm font-medium text-foreground">Leyenda:</span>
        {[
          { color: "bg-amber-500", label: "Cita programada" },
          { color: "bg-red-500",   label: "Urgencia" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <span className={`w-4 h-4 rounded ${color}`} />
            <span className="text-sm text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      {/* Calendario solo lectura */}
      <div className="bg-card border border-border rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <button onClick={irMesAnterior} className="p-2 hover:bg-muted rounded-md transition-colors" aria-label="Mes anterior">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-semibold text-foreground">
            {nombresMeses[mesActual.getMonth()]} {mesActual.getFullYear()}
          </h3>
          <button onClick={irMesSiguiente} className="p-2 hover:bg-muted rounded-md transition-colors" aria-label="Mes siguiente">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {nombresDias.map((dia) => (
            <div key={dia} className="text-center text-xs font-semibold text-muted-foreground py-2">{dia}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {diasMes.map(({ fecha, dia, esOtroMes }, index) => {
            const estado = !esOtroMes ? obtenerEstadoDia(fecha) : null;
            const esHoy = fecha === new Date().toISOString().substring(0, 10);
            let colorFondo = "";
            if (!esOtroMes && estado) {
              if (estado === "cita")      colorFondo = "bg-amber-100 text-amber-800";
              else if (estado === "urgencia") colorFondo = "bg-red-100 text-red-800";
            }
            return (
              <div
                key={index}
                className={`aspect-square flex items-center justify-center text-sm font-medium rounded-md ${esOtroMes ? "text-muted-foreground/30" : ""} ${!esOtroMes ? colorFondo : ""} ${esHoy && !esOtroMes ? "ring-2 ring-primary ring-offset-1" : ""}`}
              >
                {dia}
              </div>
            );
          })}
        </div>
      </div>

      {/* Lista de citas agendadas */}
      {citasAgendadas.length > 0 ? (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Citas Programadas ({citasAgendadas.length})
          </h3>
          <div className="space-y-2">
            {citasAgendadas.map((cita) => (
              <div key={cita.id} className={`bg-card border rounded-lg p-4 ${cita.tipo === "urgencia" ? "border-red-300" : "border-border"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cita.tipo === "urgencia" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                        {cita.tipo === "urgencia" ? "URGENCIA" : "CITA"}
                      </span>
                      {cita.primeraVez && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Primera vez</span>
                      )}
                    </div>
                    <p className="font-semibold text-foreground">{cita.tipoConsulta}</p>
                    {cita.especialidad && <p className="text-sm text-muted-foreground">{cita.especialidad}</p>}
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{fmtFecha(cita.fecha)}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{cita.horaInicio} - {cita.horaCierre}</span>
                    </div>
                  </div>
                  {cita.precioFinal > 0 && (
                    <div className="text-right shrink-0">
                      {cita.descuento > 0 && (
                        <p className="text-xs text-muted-foreground line-through">${cita.precioBase.toLocaleString()} MXN</p>
                      )}
                      <p className="text-lg font-bold text-primary">${cita.precioFinal.toLocaleString()} MXN</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No tienes citas programadas</p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// TAB: MEDICAMENTOS
// ─────────────────────────────────────────────

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
  { id: "dashboard", label: "Resumen",         icon: LayoutDashboard },
  { id: "datos",     label: "Datos generales", icon: User },
  { id: "signos",    label: "Signos vitales",  icon: Activity },
  { id: "visitas",   label: "Visitas",         icon: Stethoscope },
  { id: "medicamentos", label: "Medicamentos", icon: Pill },
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
    <div className="min-h-screen bg-background font-sans">
      {/* Topbar */}
      <header className="bg-sidebar border-b border-sidebar-border px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <Stethoscope className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-sidebar-foreground font-semibold text-sm tracking-tight">Expediente Clínico</span>
        </div>
        <span />
      </header>

      {/* Patient banner + tabs */}
      <div className="bg-sidebar border-b border-sidebar-border px-4 md:px-8 pt-5">
        <div className="flex items-center gap-4">
          <div className="shrink-0">
            <AvatarPaciente edad={edad} sexo={dp.sexo} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-sidebar-foreground text-balance">{nombreCompleto}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-sidebar-foreground/60">
              <span>{dp.sexo}</span>
              <span className="hidden sm:inline">·</span>
              <span>{edad} años</span>
              <span className="hidden sm:inline">·</span>
              {dp.curp && <span className="font-mono text-xs">{dp.curp}</span>}
            </div>
          </div>
        </div>

        <nav
          className="mt-5 -mb-px flex gap-1 overflow-x-auto"
          aria-label="Secciones del expediente"
          style={{ scrollbarWidth: "none" }}
        >
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-md border-b-2 whitespace-nowrap transition-colors ${
                activeTab === id
                  ? "border-primary text-sidebar-foreground bg-sidebar-accent"
                  : "border-transparent text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <main className="px-4 md:px-8 py-6 max-w-6xl mx-auto">
        {activeTab === "dashboard"     && paciente.dashboard && <DashboardTab dashboard={paciente.dashboard} />}
        {activeTab === "datos"         && <DatosGeneralesTab datosPersonales={paciente.datosPersonales} direccion={paciente.direccion} contacto={paciente.contacto} datosFiscales={paciente.datosFiscales} />}
        {activeTab === "signos"        && <SignosVitalesTab  signosVitales={paciente.signosVitales} />}
        {activeTab === "visitas"       && <VisitasTab        visitas={paciente.visitas} />}
        {activeTab === "medicamentos"  && <MedicamentosTab   medicamentos={paciente.medicamentos} recordatorios={paciente.recordatorios} />}
      </main>
    </div>
  );
}
