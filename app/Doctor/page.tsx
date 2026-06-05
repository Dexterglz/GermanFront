"use client";

import React, { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
  AlertTriangle,
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
  FileCheck,
  Folder,
  Menu,
  Settings,
  Mail,
  ShieldCheck,
  Sun,
  Moon,
  Monitor,
  Globe,
  Lock,
  Printer,
  Database,
  Eye,
  User2,
  Volume2,
  VolumeX,
  Laptop,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";

const ChevronRightIcon = ChevronRight;

// ─────────────────────────────────────────────
// DOCTOR SERVICE
// ─────────────────────────────────────────────

const BASE_URL = "http://localhost:3000/api";

const getAuthHeaders = (isMultipart = false): HeadersInit => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";
  const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
  if (!isMultipart) headers["Content-Type"] = "application/json";
  return headers;
};

const doctorService = {
  // Citas
  createAppointment: (data: Record<string, unknown>) =>
    fetch(`${BASE_URL}/appointments`, { method: "POST", headers: getAuthHeaders(), body: JSON.stringify(data) }).then((r) => r.json()),

  createRecurringAppointments: (data: Record<string, unknown>) =>
    fetch(`${BASE_URL}/appointments/recurring`, { method: "POST", headers: getAuthHeaders(), body: JSON.stringify(data) }).then((r) => r.json()),

  confirmAppointment: (appointmentId: string) =>
    fetch(`${BASE_URL}/appointments/${appointmentId}/confirm`, { method: "POST", headers: getAuthHeaders() }).then((r) => r.json()),

  rescheduleAppointment: (appointmentId: string, data: Record<string, unknown>) =>
    fetch(`${BASE_URL}/appointments/${appointmentId}/reschedule`, { method: "POST", headers: getAuthHeaders(), body: JSON.stringify(data) }).then((r) => r.json()),

  cancelAppointment: (appointmentId: string, reason: string) =>
    fetch(`${BASE_URL}/appointments/${appointmentId}/cancel`, { method: "POST", headers: getAuthHeaders(), body: JSON.stringify({ reason }) }).then((r) => r.json()),

  // Panel y agenda
  getDoctorSummary: () =>
    fetch(`${BASE_URL}/dashboard/doctor/summary`, { method: "GET", headers: getAuthHeaders() }).then((r) => r.json()),

  getDoctorPatients: () =>
    fetch(`${BASE_URL}/dashboard/doctor/patients`, { method: "GET", headers: getAuthHeaders() }).then((r) => r.json()),

  // Perfil, horarios y expedientes
  updateProfile: (formData: FormData) =>
    fetch(`${BASE_URL}/doctors/profile`, { method: "PUT", headers: getAuthHeaders(true), body: formData }).then((r) => r.json()),

  setAvailability: (schedulesArray: unknown[]) =>
    fetch(`${BASE_URL}/doctors/availability`, { method: "POST", headers: getAuthHeaders(), body: JSON.stringify({ schedules: schedulesArray }) }).then((r) => r.json()),

  createPatientFile: (patientData: Record<string, unknown>) =>
    fetch(`${BASE_URL}/patients`, { method: "POST", headers: getAuthHeaders(), body: JSON.stringify(patientData) }).then((r) => r.json()),

  // ─────────────────────────────────────────────
  // NUEVAS APIS - Consulta y Signos Vitales
  // ─────────────────────────────────────────────

  // Datos médicos del paciente
  saveDatosMedicos: (data: {
    patient_id: string;
    blood_type?: string;
    allergies?: string;
    chronic_diseases?: string;
    surgeries?: string;
    medications?: string;
    family_history?: string;
  }) =>
    fetch(`${BASE_URL}/datosmedicos`, { method: "POST", headers: getAuthHeaders(), body: JSON.stringify(data) }).then((r) => r.json()),

  // Signos vitales
  saveSignosVitales: (data: {
    patient_id: string;
    doctor_id: string;
    appointment_id?: number;
    blood_pressure?: string;
    heart_rate?: number;
    respiratory_rate?: number;
    temperature?: number;
    oxygen_saturation?: number;
    weight?: number;
    height?: number;
    bmi?: number;
    glucose?: number;
    notes?: string;
  }) =>
    fetch(`${BASE_URL}/signosvitales`, { method: "POST", headers: getAuthHeaders(), body: JSON.stringify(data) }).then((r) => r.json()),

  // Nota SOAP
  saveSOAP: (data: {
    patient_id: string;
    doctor_id: string;
    appointment_id?: number;
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
    diagnosis?: string;
    prescription?: string;
    observations?: string;
  }) =>
    fetch(`${BASE_URL}/soap`, { method: "POST", headers: getAuthHeaders(), body: JSON.stringify(data) }).then((r) => r.json()),

  // Alergias del paciente
  savePatientAlergia: (data: {
    patient_id: string;
    allergy_type: string;
    allergen: string;
    reaction?: string;
    severity: string;
    notes?: string;
  }) =>
    fetch(`${BASE_URL}/patientalergias`, { method: "POST", headers: getAuthHeaders(), body: JSON.stringify(data) }).then((r) => r.json()),

  // Alergias (endpoint alternativo)
  saveAlergia: (data: {
    patient_id: string;
    allergy_type: string;
    allergen: string;
    reaction?: string;
    severity: string;
    notes?: string;
  }) =>
    fetch(`${BASE_URL}/alergias`, { method: "POST", headers: getAuthHeaders(), body: JSON.stringify(data) }).then((r) => r.json()),

  // Prescripciones
  savePrescripcion: (data: {
    patient_id: string;
    doctor_id: string;
    appointment_id?: number;
    medication_type: string;
    medication_name: string;
    dosage: string;
    route: string;
    frequency_hours: number;
    duration_days: number;
    indications?: string;
  }) =>
    fetch(`${BASE_URL}/prescripcionprenscripciones`, { method: "POST", headers: getAuthHeaders(), body: JSON.stringify(data) }).then((r) => r.json()),
};

// ─────────────────────────────────────────────
// TRANSLATIONS
// ─────────────────────────────────────────────

type Idioma = "es" | "en";

const translations = {
  es: {
    // App
    appName: "MediRecord",
    appSubtitle: "Sistema de Expedientes",
    yearsOld: "años",

    // Tabs
    dashboard: "Resumen",
    generalData: "Datos Generales",
    vitalSigns: "Signos Vitales",
    appointments: "Citas",
    consultation: "Consulta",
    medicalRecord: "Expediente",
    visits: "Visitas",
    medications: "Medicamentos",

    // Common
    save: "Guardar",
    cancel: "Cancelar",
    delete: "Eliminar",
    edit: "Editar",
    add: "Agregar",
    search: "Buscar",
    filter: "Filtrar",
    print: "Imprimir",
    close: "Cerrar",
    new: "Nuevo",

    // Dashboard
    nextAppointment: "Próxima cita",
    lastDiagnosis: "Último diagnóstico",
    activeMedications: "Medicamentos activos",
    latestVitals: "Últimos signos vitales",

    // Vital Signs
    weight: "Peso",
    height: "Estatura",
    temperature: "Temperatura",
    heartRate: "Frecuencia cardíaca",
    bloodPressure: "Presión arterial",
    bodyFat: "Grasa corporal",
    bmi: "IMC",

    // Appointments
    pending: "Pendiente",
    confirmed: "Confirmada",
    cancelled: "Cancelada",
    completed: "Completada",
    scheduleAppointment: "Agendar cita",
    appointmentType: "Tipo de cita",
    urgency: "Urgencia",
    firstTime: "Primera vez",
    followUp: "Seguimiento",
    specialty: "Especialidad",
    insurance: "Seguro",
    services: "Servicios",
    coupon: "Cupón",
    discount: "Descuento",
    basePrice: "Precio base",
    finalPrice: "Precio final",

    // Consultation
    consultationReason: "Motivo de consulta",
    clinicalData: "Datos clínicos",
    physicalExam: "Exploración física",
    diagnosis: "Diagnóstico",
    treatment: "Tratamiento",
    medicalNote: "Nota médica",
    saveConsultation: "Guardar consulta",

    // Medical Record
    medicalHistory: "Historial médico",
    diagnoses: "Diagnósticos",
    Visits: "Visitas",
    notes: "Notas",
    date: "Fecha",

    // Medications
    medication: "Medicamento",
    dose: "Dosis",
    frequency: "Frecuencia",
    startDate: "Fecha inicio",
    endDate: "Fecha fin",
    reminders: "Recordatorios",
    active: "Activo",
    inactive: "Inactivo",

    // Patient Data
    personalData: "Datos personales",
    address: "Dirección",
    contact: "Contacto",
    taxData: "Datos fiscales",
    fullName: "Nombre completo",
    birthDate: "Fecha de nacimiento",
    sex: "Sexo",
    male: "Masculino",
    female: "Femenino",
    other: "Otro",
    phone: "Teléfono",
    emergencyPhone: "Teléfono de emergencia",
    email: "Correo electrónico",
    emergencyContact: "Contacto de emergencia",
    street: "Calle",
    exteriorNumber: "Número exterior",
    interiorNumber: "Número interior",
    neighborhood: "Colonia",
    city: "Ciudad",
    state: "Estado",
    postalCode: "Código postal",
    country: "País",

    // Settings
    settings: "Configuración",
    customizeExperience: "Personaliza tu experiencia",
    appearance: "Apariencia",
    doctorProfile: "Perfil del médico",
    notifications: "Notificaciones",
    record: "Expediente",
    security: "Seguridad",
    interfaceTheme: "Tema de la interfaz",
    themeDescription: "Elige entre modo claro, oscuro o automático según tu sistema.",
    light: "Claro",
    dark: "Oscuro",
    system: "Sistema",
    textSize: "Tamaño del texto",
    textSizeDescription: "Ajusta el tamaño de fuente en toda la aplicación.",
    small: "Pequeño",
    normal: "Normal",
    large: "Grande",
    language: "Idioma",
    languageDescription: "Idioma de la interfaz del sistema.",
    doctorData: "Datos del médico",
    doctorName: "Nombre completo",
    medicalLicense: "Cédula profesional",
    clinicHospital: "Clínica / Hospital",
    recordDisplay: "Visualización del expediente",
    showPatientAge: "Mostrar edad del paciente",
    visibleInSidebar: "Visible en el encabezado del sidebar",
    showCURP: "Mostrar CURP",
    visibleInPatientData: "Visible en datos del paciente",
    notificationPreferences: "Preferencias de notificaciones",
    medicationReminders: "Recordatorios de medicamentos",
    alertWhenDose: "Alerta cuando sea hora de una toma",
    appointmentReminders: "Recordatorios de citas",
    appointmentAlerts: "Aviso de citas confirmadas y pendientes",
    notificationSound: "Sonido de notificaciones",
    playSoundOnAlert: "Reproduce un tono al recibir alertas",
    currentStatus: "Estado actual",
    activated: "activas",
    deactivated: "inactivas",
    soundOn: "activado",
    soundOff: "desactivado",
    printHeader: "Membrete en impresiones",
    printHeaderDescription: "Incluir datos del médico al imprimir",
    autoSave: "Guardado automático",
    autoSaveDescription: "Guardar cambios automáticamente",
    rememberSession: "Recordar sesión",
    rememberSessionDescription: "Mantener sesión iniciada",
    changePassword: "Cambiar contraseña",
    exportData: "Exportar datos",

    // Notifications
    notificationsTitle: "Notificaciones",
    newNotifications: "nuevas",
    markAllAsRead: "Marcar todas como leídas",
    noNotifications: "Sin notificaciones",
    viewAllReminders: "Ver todos los recordatorios de medicamentos",

    // Theme
    theme: "Tema",
    openMenu: "Abrir menú",

    // Patient file
    patientFile: "Expediente de",

    // BMI categories
    bmiUnderweight: "Bajo peso",
    bmiNormal: "Normal",
    bmiOverweight: "Sobrepeso",
    bmiObesity1: "Obesidad I",
    bmiObesity2: "Obesidad II",
    bmiObesity3: "Obesidad III",
  },
  en: {
    // App
    appName: "MediRecord",
    appSubtitle: "Medical Records System",
    yearsOld: "years old",

    // Tabs
    dashboard: "Dashboard",
    generalData: "General Data",
    vitalSigns: "Vital Signs",
    appointments: "Appointments",
    consultation: "Consultation",
    medicalRecord: "Medical Record",
    visits: "Visits",
    medications: "Medications",
    gynecology: "Gynecology",

    // Common
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    search: "Search",
    filter: "Filter",
    print: "Print",
    close: "Close",
    new: "New",

    // Dashboard
    nextAppointment: "Next appointment",
    lastDiagnosis: "Last diagnosis",
    activeMedications: "Active medications",
    latestVitals: "Latest vital signs",

    // Vital Signs
    weight: "Weight",
    height: "Height",
    temperature: "Temperature",
    heartRate: "Heart rate",
    bloodPressure: "Blood pressure",
    bodyFat: "Body fat",
    bmi: "BMI",

    // Appointments
    pending: "Pending",
    confirmed: "Confirmed",
    cancelled: "Cancelled",
    completed: "Completed",
    scheduleAppointment: "Schedule appointment",
    appointmentType: "Appointment type",
    urgency: "Urgency",
    firstTime: "First time",
    followUp: "Follow-up",
    specialty: "Specialty",
    insurance: "Insurance",
    services: "Services",
    coupon: "Coupon",
    discount: "Discount",
    basePrice: "Base price",
    finalPrice: "Final price",

    // Consultation
    consultationReason: "Reason for consultation",
    clinicalData: "Clinical data",
    physicalExam: "Physical examination",
    diagnosis: "Diagnosis",
    treatment: "Treatment",
    medicalNote: "Medical note",
    saveConsultation: "Save consultation",

    // Medical Record
    medicalHistory: "Medical history",
    diagnoses: "Diagnoses",
    Visits: "Visits",
    notes: "Notes",
    date: "Date",

    // Medications
    medication: "Medication",
    dose: "Dose",
    frequency: "Frequency",
    startDate: "Start date",
    endDate: "End date",
    reminders: "Reminders",
    active: "Active",
    inactive: "Inactive",

    // Patient Data
    personalData: "Personal data",
    address: "Address",
    contact: "Contact",
    taxData: "Tax data",
    fullName: "Full name",
    birthDate: "Date of birth",
    sex: "Sex",
    male: "Male",
    female: "Female",
    other: "Other",
    phone: "Phone",
    emergencyPhone: "Emergency phone",
    email: "Email",
    emergencyContact: "Emergency contact",
    street: "Street",
    exteriorNumber: "Exterior number",
    interiorNumber: "Interior number",
    neighborhood: "Neighborhood",
    city: "City",
    state: "State",
    postalCode: "Postal code",
    country: "Country",

    // Settings
    settings: "Settings",
    customizeExperience: "Customize your experience",
    appearance: "Appearance",
    doctorProfile: "Doctor profile",
    notifications: "Notifications",
    record: "Record",
    security: "Security",
    interfaceTheme: "Interface theme",
    themeDescription: "Choose between light, dark, or automatic mode based on your system.",
    light: "Light",
    dark: "Dark",
    system: "System",
    textSize: "Text size",
    textSizeDescription: "Adjust the font size throughout the application.",
    small: "Small",
    normal: "Normal",
    large: "Large",
    language: "Language",
    languageDescription: "System interface language.",
    doctorData: "Doctor data",
    doctorName: "Full name",
    medicalLicense: "Medical license",
    clinicHospital: "Clinic / Hospital",
    recordDisplay: "Record display",
    showPatientAge: "Show patient age",
    visibleInSidebar: "Visible in sidebar header",
    showCURP: "Show CURP",
    visibleInPatientData: "Visible in patient data",
    notificationPreferences: "Notification preferences",
    medicationReminders: "Medication reminders",
    alertWhenDose: "Alert when it's time for a dose",
    appointmentReminders: "Appointment reminders",
    appointmentAlerts: "Alerts for confirmed and pending appointments",
    notificationSound: "Notification sound",
    playSoundOnAlert: "Play a tone when receiving alerts",
    currentStatus: "Current status",
    activated: "active",
    deactivated: "inactive",
    soundOn: "on",
    soundOff: "off",
    printHeader: "Print header",
    printHeaderDescription: "Include doctor data when printing",
    autoSave: "Auto save",
    autoSaveDescription: "Save changes automatically",
    rememberSession: "Remember session",
    rememberSessionDescription: "Keep session active",
    changePassword: "Change password",
    exportData: "Export data",

    // Notifications
    notificationsTitle: "Notifications",
    newNotifications: "new",
    markAllAsRead: "Mark all as read",
    noNotifications: "No notifications",
    viewAllReminders: "View all medication reminders",

    // Gynecology
    gynecologicalHistory: "Gynecological history",
    saveGynecologicalHistory: "Save gynecological history",
    printHistory: "Print history",
    savedSuccessfully: "Saved successfully",
    menarche: "Menarche",
    menstrualCycle: "Menstrual cycle",
    lastMenstrualPeriod: "Last menstrual period",
    sexualActivity: "Sexual activity",
    pregnancies: "Pregnancies",
    deliveries: "Deliveries",
    cesareans: "Cesareans",
    abortions: "Abortions",
    livingChildren: "Living children",
    contraceptive: "Contraceptive",
    lastPap: "Last Pap smear",
    lastMammogram: "Last mammogram",

    // Theme
    theme: "Theme",
    openMenu: "Open menu",

    // Patient file
    patientFile: "Patient file:",

    // BMI categories
    bmiUnderweight: "Underweight",
    bmiNormal: "Normal",
    bmiOverweight: "Overweight",
    bmiObesity1: "Obesity I",
    bmiObesity2: "Obesity II",
    bmiObesity3: "Obesity III",
  },
} as const;

type TranslationKey = keyof typeof translations.es;

// Context para el idioma
const LanguageContext = React.createContext<{
  idioma: Idioma;
  t: (key: TranslationKey) => string;
}>({
  idioma: "es",
  t: (key) => translations.es[key],
});

function useTranslation() {
  return React.useContext(LanguageContext);
}

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

type ID = string;
type FechaISO = string;

interface Alergia {
  id: ID;
  tipo: "Medicamento" | "Alimento" | "Ambiental" | "Material" | "Otro";
  descripcion: string;
  reaccion: string;
  severidad: "Leve" | "Moderada" | "Grave";
}

interface PatientData {
  userId: string;
  firstName: string;
  lastName: string;
  maternalLastName?: string;
  birthDate: FechaISO;
  gender: "male" | "female" | "other";
  maritalStatus?: string;
  nationality?: string;
  educationLevel?: string;
  occupation?: string;
  religion?: string;
  bloodType?: string;
  donorStatus?: boolean;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRel?: string;
  countryCode?: string;
  nationalIdType?: string;
  nationalId?: string;
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
  patientData: PatientData;
  signosVitales: SignosVitales[];
  citas: Cita[];
  visitas: Visita[];
  diagnosticos: Diagnostico[];
  notas: NotaMedica[];
  medicamentos: Medicamento[];
  recordatorios: Recordatorio[];
  dashboard?: MiniDashboard;
  alergias: Alergia[];
}

type EstatusCita = "pendiente" | "confirmada" | "llego" | "cancelada";

interface CitaAgendada {
  id: string;
  fecha: string;
  horaInicio: string;
  horaCierre: string;
  tipo: "cita" | "urgencia";
  tipoConsultaId: string;
  tipoConsultaNombre: string;
  especialidad: string;
  medicoEspecialista: string;
  seguro: string;
  servicios: string[];
  cupon: string;
  descuento: number;
  precioBase: number;
  precioFinal: number;
  estatus: EstatusCita;
}

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────

const pacienteMock: Paciente = {
  id: "",
  patientData: {
    userId: "",
    firstName: "",
    lastName: "",
    maternalLastName: "",
    birthDate: "",
    gender: "female",
    maritalStatus: "",
    nationality: "",
    educationLevel: "",
    occupation: "",
    religion: "",
    bloodType: "",
    donorStatus: false,
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRel: "",
    countryCode: "",
    nationalIdType: "",
    nationalId: "",
  },
  signosVitales: [],
  citas: [],
  visitas: [],
  diagnosticos: [],
  notas: [],
  medicamentos: [],
  recordatorios: [],
  dashboard: undefined,
  alergias: [],
};

// Datos para citas
const especialidades = [
  "Medicina General",
  "Pediatría",
  "Cardiología",
  "Dermatología",
  "Neurología",
  "Traumatología",
  "Oftalmología",
  "Otorrinolaringología",
  "Psiquiatría",
];

const tiposSeguros = [
  "Sin seguro (Particular)",
  "GNP Seguros",
  "Metlife",
  "AXA Seguros",
  "Allianz",
  "Mapfre",
  "Seguros Monterrey",
  "Qualitas",
  "Otro",
];

// Catálogo de médicos especialistas
const medicosEspecialistas = [
  {
    nombre: "Dra. Ana María López",
    especialidad: "Medicina General",
    cedula: "23456789",
    tiposConsultaId: ["consulta_general", "consulta_seguimiento", "chequeo_preventivo", "urgencia"],
    serviciosId: ["laboratorio_general", "analisis_sangre", "rayos_x", "ekg", "presion"]
  },
  {
    nombre: "Dr. Roberto Martínez",
    especialidad: "Cardiología",
    cedula: "34567890",
    tiposConsultaId: ["consulta_general", "consulta_especialidad", "consulta_seguimiento"],
    serviciosId: ["ekg", "ecocardiograma", "prueba_esfuerzo", "holter", "analisis_lipidos"]
  },
  {
    nombre: "Dra. Patricia Hernández",
    especialidad: "Pediatría",
    cedula: "45678901",
    tiposConsultaId: ["consulta_general", "consulta_seguimiento", "chequeo_preventivo"],
    serviciosId: ["vacunas", "desarrollo", "laboratorio_pediatrico", "ultrasonido_abdominal"]
  },
  {
    nombre: "Dr. Eduardo Sánchez",
    especialidad: "Neurología",
    cedula: "56789012",
    tiposConsultaId: ["consulta_general", "consulta_especialidad", "consulta_seguimiento"],
    serviciosId: ["eeg", "resonancia", "tomografia", "test_neuropsicologico"]
  },
  {
    nombre: "Dra. Sofía Ramírez",
    especialidad: "Dermatología",
    cedula: "67890123",
    tiposConsultaId: ["consulta_general", "consulta_especialidad", "consulta_seguimiento"],
    serviciosId: ["biopsia_piel", "microscopia", "fotografia", "analisis_lunar"]
  },
  {
    nombre: "Dr. Javier Torres",
    especialidad: "Traumatología",
    cedula: "78901234",
    tiposConsultaId: ["consulta_general", "consulta_especialidad", "consulta_seguimiento"],
    serviciosId: ["rayos_x", "resonancia_musculo", "ultrasonido_musculo", "infiltracion"]
  },
  {
    nombre: "Dra. Laura Medina",
    especialidad: "Oftalmología",
    cedula: "89012345",
    tiposConsultaId: ["consulta_general", "consulta_especialidad", "consulta_seguimiento"],
    serviciosId: ["refraccion", "tonometria", "campo_visual", "tomografia_ocular"]
  },
  {
    nombre: "Dr. Miguel Ángel Flores",
    especialidad: "Otorrinolaringología",
    cedula: "90123456",
    tiposConsultaId: ["consulta_general", "consulta_especialidad", "consulta_seguimiento"],
    serviciosId: ["audiometria", "impedanciometria", "videoendoscopia", "timpanometria"]
  },
  {
    nombre: "Dra. Isabel Vega",
    especialidad: "Psiquiatría",
    cedula: "01234567",
    tiposConsultaId: ["consulta_general", "consulta_especialidad", "consulta_seguimiento"],
    serviciosId: ["evaluacion_psicologica", "test_personalidad", "manejo_conducta"]
  },
  {
    nombre: "Dr. Fernando Gutiérrez",
    especialidad: "Endocrinología",
    cedula: "11223344",
    tiposConsultaId: ["consulta_general", "consulta_especialidad", "consulta_seguimiento"],
    serviciosId: ["glucosa", "hemoglobina_glicada", "perfil_tiroideo", "analisis_insulina"]
  },
  {
    nombre: "Dra. Carmen Ortiz",
    especialidad: "Reumatología",
    cedula: "22334455",
    tiposConsultaId: ["consulta_general", "consulta_especialidad", "consulta_seguimiento"],
    serviciosId: ["factor_reumatoide", "ana", "esr", "ultrasonido_articular"]
  },
];

// Catálogo ÚNICO de servicios disponibles
const serviciosDisponibles = [
  // Medicina General
  { id: "laboratorio_general", nombre: "Estudios de laboratorio básicos", precio: 600 },
  { id: "analisis_sangre", nombre: "Análisis de sangre completo", precio: 800 },
  { id: "rayos_x", nombre: "Radiografía simple", precio: 400 },
  { id: "ekg", nombre: "Electrocardiograma", precio: 350 },
  { id: "presion", nombre: "Monitoreo de presión arterial", precio: 200 },

  // Cardiología
  { id: "ecocardiograma", nombre: "Ecocardiograma", precio: 1500 },
  { id: "prueba_esfuerzo", nombre: "Prueba de esfuerzo", precio: 1200 },
  { id: "holter", nombre: "Monitor Holter (24h)", precio: 800 },
  { id: "analisis_lipidos", nombre: "Análisis de lípidos", precio: 600 },

  // Pediatría
  { id: "vacunas", nombre: "Administración de vacunas", precio: 300 },
  { id: "desarrollo", nombre: "Evaluación del desarrollo", precio: 600 },
  { id: "laboratorio_pediatrico", nombre: "Estudios de laboratorio pediátricos", precio: 700 },
  { id: "ultrasonido_abdominal", nombre: "Ultrasonido abdominal", precio: 800 },

  // Neurología
  { id: "eeg", nombre: "Electroencefalograma", precio: 900 },
  { id: "resonancia", nombre: "Resonancia magnética", precio: 2500 },
  { id: "tomografia", nombre: "Tomografía computada", precio: 1800 },
  { id: "test_neuropsicologico", nombre: "Test neuropsicológico", precio: 1200 },

  // Dermatología
  { id: "biopsia_piel", nombre: "Biopsia de piel", precio: 1000 },
  { id: "microscopia", nombre: "Microscopía dermoscópica", precio: 600 },
  { id: "fotografia", nombre: "Fotografía dermatológica", precio: 400 },
  { id: "analisis_lunar", nombre: "Análisis de lunares", precio: 800 },

  // Traumatología
  { id: "resonancia_musculo", nombre: "Resonancia de tejido blando", precio: 2200 },
  { id: "ultrasonido_musculo", nombre: "Ultrasonido musculoesquelético", precio: 900 },
  { id: "infiltracion", nombre: "Infiltración articular", precio: 1500 },

  // Oftalmología
  { id: "refraccion", nombre: "Refracción óptica", precio: 300 },
  { id: "tonometria", nombre: "Tonometría (glaucoma)", precio: 400 },
  { id: "campo_visual", nombre: "Campo visual automatizado", precio: 600 },
  { id: "tomografia_ocular", nombre: "Tomografía OCT", precio: 1200 },

  // Otorrinolaringología
  { id: "audiometria", nombre: "Audiometría", precio: 600 },
  { id: "impedanciometria", nombre: "Impedanciometría", precio: 400 },
  { id: "videoendoscopia", nombre: "Videoendoscopia nasofaríngea", precio: 900 },
  { id: "timpanometria", nombre: "Timpanometría", precio: 350 },

  // Psiquiatría
  { id: "evaluacion_psicologica", nombre: "Evaluación psicológica", precio: 1000 },
  { id: "test_personalidad", nombre: "Test de personalidad", precio: 800 },
  { id: "manejo_conducta", nombre: "Manejo de conducta", precio: 1200 },

  // Endocrinología
  { id: "glucosa", nombre: "Prueba de glucosa", precio: 200 },
  { id: "hemoglobina_glicada", nombre: "Hemoglobina glicada", precio: 400 },
  { id: "perfil_tiroideo", nombre: "Perfil tiroideo completo", precio: 700 },
  { id: "analisis_insulina", nombre: "Análisis de insulina", precio: 600 },

  // Reumatología
  { id: "factor_reumatoide", nombre: "Factor reumatoide", precio: 500 },
  { id: "ana", nombre: "Anticuerpos antinucleares (ANA)", precio: 800 },
  { id: "esr", nombre: "Velocidad de sedimentación", precio: 300 },
  { id: "ultrasonido_articular", nombre: "Ultrasonido articular", precio: 900 },
];


// Catálogo de tipos de consulta con precio base
const catalogoTiposConsulta = [
  { id: "consulta_general", nombre: "Consulta general", precio: 800 },
  { id: "consulta_seguimiento", nombre: "Consulta de seguimiento", precio: 650 },
  { id: "consulta_especialidad", nombre: "Consulta de especialidad", precio: 1200 },
  { id: "consulta_prenatal", nombre: "Control prenatal", precio: 950 },
  { id: "chequeo_preventivo", nombre: "Chequeo preventivo", precio: 700 },
  { id: "urgencia", nombre: "Urgencia", precio: 1500 },
  { id: "consulta_virtual", nombre: "Consulta virtual / Telemedicina", precio: 500 },
  { id: "segunda_opinion", nombre: "Segunda opinión", precio: 1000 },
];

// Catálogo de servicios por especialidad
const serviciosPorEspecialidad: Record<string, Array<{ id: string; nombre: string; precio: number }>> = {
  "Medicina General": [
    { id: "laboratorio_general", nombre: "Estudios de laboratorio básicos", precio: 600 },
    { id: "analisis_sangre", nombre: "Análisis de sangre completo", precio: 800 },
    { id: "rayos_x", nombre: "Radiografía simple", precio: 400 },
    { id: "ekg", nombre: "Electrocardiograma", precio: 350 },
    { id: "presion", nombre: "Monitoreo de presión arterial", precio: 200 },
  ],
  "Cardiología": [
    { id: "ekg", nombre: "Electrocardiograma", precio: 350 },
    { id: "ecocardiograma", nombre: "Ecocardiograma", precio: 1500 },
    { id: "prueba_esfuerzo", nombre: "Prueba de esfuerzo", precio: 1200 },
    { id: "holter", nombre: "Monitor Holter (24h)", precio: 800 },
    { id: "analisis_lipidos", nombre: "Análisis de lípidos", precio: 600 },
  ],
  "Pediatría": [
    { id: "vacunas", nombre: "Administración de vacunas", precio: 300 },
    { id: "desarrollo", nombre: "Evaluación del desarrollo", precio: 600 },
    { id: "laboratorio_pediatrico", nombre: "Estudios de laboratorio pediátricos", precio: 700 },
    { id: "ultrasonido_abdominal", nombre: "Ultrasonido abdominal", precio: 800 },
  ],
  "Neurología": [
    { id: "eeg", nombre: "Electroencefalograma", precio: 900 },
    { id: "resonancia", nombre: "Resonancia magnética", precio: 2500 },
    { id: "tomografia", nombre: "Tomografía computada", precio: 1800 },
    { id: "test_neuropsicologico", nombre: "Test neuropsicológico", precio: 1200 },
  ],
  "Dermatología": [
    { id: "biopsia_piel", nombre: "Biopsia de piel", precio: 1000 },
    { id: "microscopia", nombre: "Microscopía dermoscópica", precio: 600 },
    { id: "fotografia", nombre: "Fotografía dermatológica", precio: 400 },
    { id: "analisis_lunar", nombre: "Análisis de lunares", precio: 800 },
  ],
  "Traumatología": [
    { id: "rayos_x", nombre: "Radiografía simple", precio: 400 },
    { id: "resonancia_musculo", nombre: "Resonancia de tejido blando", precio: 2200 },
    { id: "ultrasonido_musculo", nombre: "Ultrasonido musculoesquelético", precio: 900 },
    { id: "infiltracion", nombre: "Infiltración articular", precio: 1500 },
  ],
  "Oftalmología": [
    { id: "refraccion", nombre: "Refracción óptica", precio: 300 },
    { id: "tonometria", nombre: "Tonometría (glaucoma)", precio: 400 },
    { id: "campo_visual", nombre: "Campo visual automatizado", precio: 600 },
    { id: "tomografia_ocular", nombre: "Tomografía OCT", precio: 1200 },
  ],
  "Otorrinolaringología": [
    { id: "audiometria", nombre: "Audiometría", precio: 600 },
    { id: "impedanciometria", nombre: "Impedanciometría", precio: 400 },
    { id: "videoendoscopia", nombre: "Videoendoscopia nasofaríngea", precio: 900 },
    { id: "timpanometria", nombre: "Timpanometría", precio: 350 },
  ],
  "Psiquiatría": [
    { id: "evaluacion_psicologica", nombre: "Evaluación psicológica", precio: 1000 },
    { id: "test_personalidad", nombre: "Test de personalidad", precio: 800 },
    { id: "manejo_conducta", nombre: "Manejo de conducta", precio: 1200 },
  ],
  "Endocrinología": [
    { id: "glucosa", nombre: "Prueba de glucosa", precio: 200 },
    { id: "hemoglobina_glicada", nombre: "Hemoglobina glicada", precio: 400 },
    { id: "perfil_tiroideo", nombre: "Perfil tiroideo completo", precio: 700 },
    { id: "analisis_insulina", nombre: "Análisis de insulina", precio: 600 },
  ],
  "Reumatología": [
    { id: "factor_reumatoide", nombre: "Factor reumatoide", precio: 500 },
    { id: "ana", nombre: "Anticuerpos antinucleares (ANA)", precio: 800 },
    { id: "esr", nombre: "Velocidad de sedimentación", precio: 300 },
    { id: "ultrasonido_articular", nombre: "Ultrasonido articular", precio: 900 },
  ],
};

const cuponesValidos: Record<string, number> = {
  "PROMO10": 10,
  "NUEVO20": 20,
  "VIP15": 15,
  "DESCUENTO25": 25,
};

// Catálogos para consulta
const catalogoCIE10: Record<string, string> = {
  // Infecciones
  "A00": "Cólera",
  "A01": "Fiebres tifoidea y paratifoidea",
  "A09": "Diarrea y gastroenteritis de presunto origen infeccioso",
  "A50": "Sífilis congénita",
  "A54": "Infección gonocócica",
  "A56": "Otras enfermedades de transmisión sexual por clamidias",
  "A59": "Tricomoniasis",
  "A63": "Otras enfermedades de transmisión predominantemente sexual",
  "B15": "Hepatitis aguda tipo A",
  "B16": "Hepatitis aguda tipo B",
  "B37.3": "Candidiasis",
  // Metabólicas
  "E10": "Diabetes mellitus tipo 1",
  "E11": "Diabetes mellitus tipo 2",
  "E55": "Deficiencia de vitamina D",
  "E55.9": "Deficiencia de vitamina D no especificada",
  "E66": "Obesidad",
  "G43": "Migraña",
  "G44": "Otros síndromes de cefalea",
  "I10": "Hipertensión esencial (primaria)",
  "I11": "Enfermedad cardíaca hipertensiva",
  "I20": "Angina de pecho",
  "I21": "Infarto agudo de miocardio",
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
  "M54": "Dorsalgia",
  "N39": "Otros trastornos del sistema urinario",
  "R10": "Dolor abdominal y pélvico",
  "R50": "Fiebre de origen desconocido",
  "R51": "Cefalea",
  "Z00": "Examen general e investigación de personas sin quejas",
  "Z13.8": "Examen de cribado para otras enfermedades especificadas",
};

const catalogoMedicamentos = [
  // Analgésicos y antiinflamatorios
  { nombre: "Naproxeno sódico", presentaciones: ["275 mg", "550 mg"], vias: ["Oral"] },
  { nombre: "Ibuprofeno", presentaciones: ["200 mg", "400 mg", "600 mg", "800 mg"], vias: ["Oral"] },
  { nombre: "Paracetamol", presentaciones: ["500 mg", "1 g"], vias: ["Oral"] },
  { nombre: "Diclofenaco", presentaciones: ["50 mg", "75 mg", "100 mg"], vias: ["Oral", "Intramuscular"] },
  { nombre: "Ketorolaco", presentaciones: ["10 mg", "30 mg"], vias: ["Oral", "Intramuscular", "Intravenosa"] },
  // Antibióticos
  { nombre: "Metronidazol", presentaciones: ["250 mg", "500 mg"], vias: ["Oral"] },
  { nombre: "Clindamicina", presentaciones: ["300 mg", "600 mg"], vias: ["Oral"] },
  { nombre: "Fluconazol", presentaciones: ["150 mg", "200 mg"], vias: ["Oral"] },
  { nombre: "Doxiciclina", presentaciones: ["100 mg"], vias: ["Oral"] },
  { nombre: "Azitromicina", presentaciones: ["250 mg", "500 mg", "1 g monodosis"], vias: ["Oral"] },
  { nombre: "Ceftriaxona", presentaciones: ["500 mg", "1 g"], vias: ["Intramuscular", "Intravenosa"] },
  { nombre: "Amoxicilina + Ácido clavulánico", presentaciones: ["500/125 mg", "875/125 mg"], vias: ["Oral"] },
  { nombre: "Amoxicilina", presentaciones: ["250 mg", "500 mg", "875 mg"], vias: ["Oral"] },
  // Gastrointestinales
  { nombre: "Omeprazol", presentaciones: ["20 mg", "40 mg"], vias: ["Oral"] },
  { nombre: "Metoclopramida", presentaciones: ["10 mg"], vias: ["Oral", "Intramuscular"] },
  { nombre: "Ondansetrón", presentaciones: ["4 mg", "8 mg"], vias: ["Oral", "Intravenosa"] },
  // Cardiovasculares
  { nombre: "Losartán", presentaciones: ["25 mg", "50 mg", "100 mg"], vias: ["Oral"] },
  { nombre: "Atorvastatina", presentaciones: ["10 mg", "20 mg", "40 mg"], vias: ["Oral"] },
  // Metabólicos
  { nombre: "Metformina", presentaciones: ["500 mg", "850 mg", "1000 mg"], vias: ["Oral"] },
  // Respiratorios
  { nombre: "Salbutamol", presentaciones: ["100 mcg/dosis"], vias: ["Inhalada"] },
  { nombre: "Prednisona", presentaciones: ["5 mg", "20 mg", "50 mg"], vias: ["Oral"] },
  // Vitaminas y suplementos
  { nombre: "Ácido fólico", presentaciones: ["400 mcg", "5 mg"], vias: ["Oral"] },
  { nombre: "Calcio + Vitamina D3", presentaciones: ["500mg/200UI", "600mg/400UI"], vias: ["Oral"] },
  { nombre: "Sulfato ferroso", presentaciones: ["300 mg"], vias: ["Oral"] },
  { nombre: "Hierro polimaltosado", presentaciones: ["100 mg"], vias: ["Oral"] },
  { nombre: "Vitamina D3", presentaciones: ["400 UI", "1000 UI", "4000 UI"], vias: ["Oral"] },
];

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

// Obtener tipos de consulta disponibles para un médico
const getTiposConsultaPorMedico = (nombreMedico: string) => {
  const medico = medicosEspecialistas.find((m) => m.nombre === nombreMedico);
  if (!medico) return [];

  return catalogoTiposConsulta.filter((tc) =>
    medico.tiposConsultaId.includes(tc.id)
  );
};

// Obtener servicios disponibles para un médico
const getServiciosPorMedico = (nombreMedico: string) => {
  const medico = medicosEspecialistas.find((m) => m.nombre === nombreMedico);
  if (!medico) return [];

  return serviciosDisponibles.filter((servicio) =>
    medico.serviciosId.includes(servicio.id)
  );
};

// ─────────────────────────────────────────────
// AVATAR COMPONENT (ANIMATED)
// ─────────────────────────────────────────────

function AvatarPaciente({ nombre, sexo, size = 48, animated = true }: { nombre: string; sexo: "Masculino" | "Femenino" | "Otro"; size?: number; animated?: boolean }) {
  const initials = nombre.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const bgColor = sexo === "Femenino" ? "from-rose-400 to-pink-500" : sexo === "Masculino" ? "from-sky-400 to-blue-500" : "from-slate-400 to-slate-500";
  const sizeClass = size >= 56 ? "w-14 h-14 rounded-2xl text-xl" : "w-10 h-10 rounded-xl text-sm";

  return (
    <div className="relative group">
      {/* Animated ring around avatar */}
      {animated && (
        <div
          className={`absolute -inset-1 bg-gradient-to-r from-primary via-pink-500 to-primary rounded-2xl opacity-0 group-hover:opacity-75 blur transition-all duration-500`}
          style={{ animation: animated ? 'spin 3s linear infinite' : 'none' }}
        />
      )}

      <div
        className={`${sizeClass} bg-gradient-to-br ${bgColor} flex items-center justify-center shadow-lg shadow-primary/20 shrink-0 relative overflow-hidden border-2 border-white/30 transition-all duration-300 group-hover:scale-105`}
        style={{ animation: animated ? 'pulse 2s ease-in-out infinite' : 'none' }}
      >
        {/* Animated background shimmer */}
        {animated && (
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            style={{ animation: 'shimmer 2s ease-in-out infinite', transform: 'translateX(-100%)' }}
          />
        )}

        {/* Face emoji based on sex with subtle animation */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          <span
            className={`${size >= 56 ? 'text-2xl' : 'text-lg'}`}
            style={{ animation: animated ? 'bounce 1s ease-in-out infinite' : 'none' }}
          >
            {sexo === "Femenino" ? "👩" : sexo === "Masculino" ? "👨" : "🧑"}
          </span>
        </div>

        {/* Subtle floating particles */}
        {animated && (
          <>
            <span className="absolute w-1 h-1 bg-white/40 rounded-full top-1 left-2" style={{ animation: 'float 3s ease-in-out infinite' }} />
            <span className="absolute w-0.5 h-0.5 bg-white/30 rounded-full bottom-2 right-1" style={{ animation: 'float 4s ease-in-out infinite 0.5s' }} />
            <span className="absolute w-1 h-1 bg-white/20 rounded-full top-3 right-2" style={{ animation: 'float 5s ease-in-out infinite 1s' }} />
          </>
        )}
      </div>

      {/* Online indicator pulse */}
      {animated && (
        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-lg">
          <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
        </span>
      )}

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.4; }
          50% { transform: translateY(-4px) translateX(2px); opacity: 0.8; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
      `}</style>
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
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {vitales.map((v) => (
            <StatCard key={v.label} {...v} />
          ))}
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
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

      {dashboard.medicamentosActivos.length > 0 && (
        <section className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Pill className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Medicamentos Activos</h3>
              <p className="text-sm text-muted-foreground">{dashboard.medicamentosActivos.length} medicamento(s)</p>
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

const severidadAlergiaConfig: Record<string, { cls: string; bg: string; dot: string }> = {
  Leve: { cls: "text-amber-700", bg: "bg-amber-50 border-amber-200", dot: "bg-amber-500" },
  Moderada: { cls: "text-orange-700", bg: "bg-orange-50 border-orange-200", dot: "bg-orange-500" },
  Grave: { cls: "text-red-700", bg: "bg-red-50 border-red-200", dot: "bg-red-500" },
};

const tipoAlergiaIconos: Record<string, string> = {
  Medicamento: "💊",
  Alimento: "🍽️",
  Ambiental: "🌿",
  Material: "🧤",
  Otro: "⚠️",
};

function DatosGeneralesTab({
  patientData,
}: {
  patientData: PatientData;
}) {
  const edad = calcularEdad(patientData.birthDate);
  const nombreCompleto = [patientData.firstName, patientData.lastName, patientData.maternalLastName].filter(Boolean).join(" ");
  const genderLabels: Record<string, string> = { male: "Masculino", female: "Femenino", other: "Otro" };

  const [alergias, setAlergias] = useState<Alergia[]>([
    { id: "AL-001", tipo: "Medicamento", descripcion: "Penicilina", reaccion: "Urticaria generalizada, angioedema", severidad: "Grave" },
    { id: "AL-002", tipo: "Alimento", descripcion: "Mariscos (camarón, ostión)", reaccion: "Náuseas, eritema en piel", severidad: "Moderada" },
    { id: "AL-003", tipo: "Ambiental", descripcion: "Polen de gramíneas", reaccion: "Rinitis alérgica, estornudos", severidad: "Leve" },
  ]);

  const [mostrarFormAlergia, setMostrarFormAlergia] = useState(false);
  const [nuevaAlergia, setNuevaAlergia] = useState<Omit<Alergia, "id">>({
    tipo: "Medicamento",
    descripcion: "",
    reaccion: "",
    severidad: "Leve",
  });

  const agregarAlergia = () => {
    if (nuevaAlergia.descripcion.trim()) {
      setAlergias([...alergias, { id: `AL-${Date.now()}`, ...nuevaAlergia }]);
      setNuevaAlergia({ tipo: "Medicamento", descripcion: "", reaccion: "", severidad: "Leve" });
      setMostrarFormAlergia(false);
    }
  };

  const eliminarAlergia = (id: string) => setAlergias(alergias.filter((a) => a.id !== id));

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <SectionCard icon={<User className="w-5 h-5" />} title="Datos Personales">
          <div className="grid grid-cols-2 gap-5">
            <div className="col-span-2"><FieldItem label="Nombre completo" value={nombreCompleto} /></div>
            <FieldItem label="Fecha de nacimiento" value={patientData.birthDate ? fmtFecha(patientData.birthDate) : ""} />
            <FieldItem label="Edad" value={`${edad} años`} />
            <FieldItem label="Género" value={genderLabels[patientData.gender] || patientData.gender} />
            <FieldItem label="Estado civil" value={patientData.maritalStatus} />
            <FieldItem label="Nacionalidad" value={patientData.nationality} />
            <FieldItem label="Nivel educativo" value={patientData.educationLevel} />
            <FieldItem label="Ocupación" value={patientData.occupation} />
            <FieldItem label="Religión" value={patientData.religion} />
            <FieldItem label="Tipo de sangre" value={patientData.bloodType} />
            <FieldItem label="Donador" value={patientData.donorStatus ? "Sí" : "No"} />
          </div>
        </SectionCard>

        <SectionCard icon={<Shield className="w-5 h-5" />} title="Identificación">
          <div className="grid grid-cols-2 gap-5">
            <FieldItem label="Código de país" value={patientData.countryCode} />
            <FieldItem label="Tipo de ID" value={patientData.nationalIdType} />
            <div className="col-span-2"><FieldItem label="ID Nacional" value={patientData.nationalId} /></div>
          </div>
        </SectionCard>

        <SectionCard icon={<Phone className="w-5 h-5" />} title="Contacto de Emergencia">
          <div className="grid grid-cols-2 gap-5">
            <FieldItem label="Nombre" value={patientData.emergencyContactName} />
            <FieldItem label="Teléfono" value={patientData.emergencyContactPhone} icon={<Phone className="w-3 h-3" />} />
            <div className="col-span-2"><FieldItem label="Relación" value={patientData.emergencyContactRel} /></div>
          </div>
        </SectionCard>
      </div>

      {/* ALERGIAS */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">Alergias</h3>
              <p className="text-xs text-muted-foreground">{alergias.length} alergia(s) registrada(s)</p>
            </div>
          </div>
          <button
            onClick={() => setMostrarFormAlergia((v) => !v)}
            className="inline-flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-sm font-medium hover:bg-primary/20 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Agregar
          </button>
        </div>

        {mostrarFormAlergia && (
          <div className="mb-5 p-4 bg-muted/30 border border-border rounded-xl space-y-4">
            <p className="text-sm font-medium text-foreground">Nueva alergia</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Tipo</label>
                <select
                  value={nuevaAlergia.tipo}
                  onChange={(e) => setNuevaAlergia({ ...nuevaAlergia, tipo: e.target.value as Alergia["tipo"] })}
                  className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {(["Medicamento", "Alimento", "Ambiental", "Material", "Otro"] as Alergia["tipo"][]).map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1 col-span-2 md:col-span-1">
                <label className="text-xs font-medium text-muted-foreground">Descripción / Agente</label>
                <input
                  type="text"
                  value={nuevaAlergia.descripcion}
                  onChange={(e) => setNuevaAlergia({ ...nuevaAlergia, descripcion: e.target.value })}
                  className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Ej: Penicilina, Camarón..."
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Reacción</label>
                <input
                  type="text"
                  value={nuevaAlergia.reaccion}
                  onChange={(e) => setNuevaAlergia({ ...nuevaAlergia, reaccion: e.target.value })}
                  className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Urticaria, edema..."
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Severidad</label>
                <select
                  value={nuevaAlergia.severidad}
                  onChange={(e) => setNuevaAlergia({ ...nuevaAlergia, severidad: e.target.value as Alergia["severidad"] })}
                  className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option>Leve</option>
                  <option>Moderada</option>
                  <option>Grave</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={agregarAlergia}
                disabled={!nuevaAlergia.descripcion.trim()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                Guardar
              </button>
              <button
                onClick={() => setMostrarFormAlergia(false)}
                className="px-4 py-2 border border-border rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {alergias.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="w-10 h-10 mx-auto mb-2 opacity-20" />
            <p className="text-sm">Sin alergias registradas</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alergias.map((al) => {
              const cfg = severidadAlergiaConfig[al.severidad];
              return (
                <div key={al.id} className={`flex items-center justify-between gap-3 p-4 rounded-xl border ${cfg.bg}`}>
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-white/70 flex items-center justify-center text-base shrink-0 shadow-sm">
                      {tipoAlergiaIconos[al.tipo] ?? "⚠️"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <p className={`font-semibold text-sm ${cfg.cls}`}>{al.descripcion}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${cfg.bg} ${cfg.cls}`}>
                          {al.tipo}
                        </span>
                      </div>
                      {al.reaccion && (
                        <p className="text-xs text-muted-foreground">{al.reaccion}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${cfg.bg} ${cfg.cls}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {al.severidad}
                    </span>
                    <button
                      onClick={() => eliminarAlergia(al.id)}
                      className="p-1.5 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      aria-label="Eliminar alergia"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// TAB: SIGNOS VITALES
// ────────────────────────────────��────────────

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
// TAB: CITAS (con calendario y formulario)
// ─────────────────────────────────────────────

// Función para obtener especialidades únicas de los médicos
const obtenerEspecialidadesMedicos = () => {
  const especialidadesUnicas = new Set(medicosEspecialistas.map((m) => m.especialidad));
  return Array.from(especialidadesUnicas).sort();
};

// Función para obtener médicos filtrados por especialidad
const getMedicosPorEspecialidad = (especialidadFiltro: string) => {
  if (!especialidadFiltro) return medicosEspecialistas;
  return medicosEspecialistas.filter((m) => m.especialidad === especialidadFiltro);
};

function CitasTab() {
  const [mesActual, setMesActual] = useState(new Date());
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [citasAgendadas, setCitasAgendadas] = useState<CitaAgendada[]>([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>("");

  const [formCita, setFormCita] = useState({
    tipoConsultaId: "consulta_general",
    especialidad: "Medicina General",
    medicoEspecialista: medicosEspecialistas[0].nombre,
    seguro: "Sin seguro (Particular)",
    servicios: [] as string[],
    cupon: "",
    horaInicio: "09:00",
    horaCierre: "09:30",
    // Nuevos campos para motivo y datos del paciente
    motivo: "",
    pacienteNombre: "",
    pacienteApellidoPaterno: "",
    pacienteApellidoMaterno: "",
    pacienteTelefono: "",
    pacienteEmail: "",
    pacienteFechaNacimiento: "",
    pacienteSexo: "Femenino" as "Masculino" | "Femenino" | "Otro",
    especialidadMedico: "",

  });
  const [descuentoAplicado, setDescuentoAplicado] = useState(0);
  const [cuponValido, setCuponValido] = useState<boolean | null>(null);

  // Panel de citas del día
  const [diaSeleccionadoPanel, setDiaSeleccionadoPanel] = useState<string | null>(null);

  // Reprogramación
  const [citaReprogramando, setCitaReprogramando] = useState<CitaAgendada | null>(null);
  const [reprog, setReprog] = useState({ fecha: "", horaInicio: "09:00", horaCierre: "09:30" });

  const estatusConfig: Record<EstatusCita, { label: string; cls: string; dot: string }> = {
    pendiente: { label: "Pendiente", cls: "bg-amber-50  text-amber-700  border-amber-200", dot: "bg-amber-400" },
    confirmada: { label: "Confirmada", cls: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-400" },
    llego: { label: "Llegó", cls: "bg-blue-50   text-blue-700   border-blue-200", dot: "bg-blue-400" },
    cancelada: { label: "Cancelada", cls: "bg-red-50    text-red-700    border-red-200", dot: "bg-red-400" },
  };

  const cambiarEstatus = (id: string, estatus: EstatusCita) => {
    setCitasAgendadas((prev) => prev.map((c) => c.id === id ? { ...c, estatus } : c));
    if (estatus === "confirmada") {
      doctorService.confirmAppointment(id).catch(console.error);
    } else if (estatus === "cancelada") {
      doctorService.cancelAppointment(id, "Cancelada por el médico").catch(console.error);
    }
  };

  const guardarReprogramacion = () => {
    if (!citaReprogramando || !reprog.fecha || !reprog.horaInicio || !reprog.horaCierre) return;
    setCitasAgendadas((prev) =>
      prev.map((c) =>
        c.id === citaReprogramando.id
          ? { ...c, fecha: reprog.fecha, horaInicio: reprog.horaInicio, horaCierre: reprog.horaCierre, estatus: "pendiente" }
          : c
      )
    );
    doctorService.rescheduleAppointment(citaReprogramando.id, {
      fecha: reprog.fecha,
      hora: reprog.horaInicio,
    }).catch(console.error);
    setCitaReprogramando(null);
  };

  // Función para obtener servicios según especialidad
  const getServiciosPorEspecialidad = (especialidad: string) => {
    return serviciosPorEspecialidad[especialidad] || serviciosPorEspecialidad["Medicina General"] || [];
  };

  const todasLasHoras = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
  ];

  const generarDiasMes = (fecha: Date) => {
    const año = fecha.getFullYear();
    const mes = fecha.getMonth();
    const primerDia = new Date(año, mes, 1);
    const ultimoDia = new Date(año, mes + 1, 0);
    const diasEnMes = ultimoDia.getDate();
    const diaInicioSemana = primerDia.getDay();

    const dias: Array<{ fecha: string; dia: number; esOtroMes: boolean }> = [];

    const mesAnterior = new Date(año, mes, 0);
    const diasMesAnterior = mesAnterior.getDate();
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
  const nombresMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const nombresDias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const obtenerCitasDelDia = (fechaStr: string): CitaAgendada[] => citasAgendadas.filter((c) => c.fecha === fechaStr);

  const obtenerHorasOcupadas = (fechaStr: string): string[] => {
    const citasDelDia = obtenerCitasDelDia(fechaStr);
    const horasOcupadas: string[] = [];
    citasDelDia.forEach((cita) => {
      const inicioIndex = todasLasHoras.indexOf(cita.horaInicio);
      const cierreIndex = todasLasHoras.indexOf(cita.horaCierre);
      if (inicioIndex !== -1 && cierreIndex !== -1) {
        for (let i = inicioIndex; i < cierreIndex; i++) {
          horasOcupadas.push(todasLasHoras[i]);
        }
      } else if (inicioIndex !== -1) {
        horasOcupadas.push(cita.horaInicio);
      }
    });
    return horasOcupadas;
  };

  const obtenerHorasLibres = (fechaStr: string): string[] => {
    const horasOcupadas = obtenerHorasOcupadas(fechaStr);
    return todasLasHoras.filter((h) => !horasOcupadas.includes(h));
  };

  const obtenerEstadoDia = (fechaStr: string) => {
    const citasDelDia = obtenerCitasDelDia(fechaStr);
    const horasLibres = obtenerHorasLibres(fechaStr);
    const tieneUrgencia = citasDelDia.some((c) => c.tipo === "urgencia");

    const fecha = new Date(fechaStr + "T12:00:00");
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fecha < hoy) return { tipo: "pasado" as const, citasCount: citasDelDia.length, horasLibres: 0 };
    if (fecha.getDay() === 0) return { tipo: "domingo" as const, citasCount: 0, horasLibres: 0 };
    if (tieneUrgencia) return { tipo: "urgencia" as const, citasCount: citasDelDia.length, horasLibres: horasLibres.length };
    if (citasDelDia.length === 0) return { tipo: "disponible" as const, citasCount: 0, horasLibres: horasLibres.length };
    if (horasLibres.length === 0) return { tipo: "lleno" as const, citasCount: citasDelDia.length, horasLibres: 0 };
    return { tipo: "parcial" as const, citasCount: citasDelDia.length, horasLibres: horasLibres.length };
  };

  const mesAnterior = () => setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() - 1, 1));
  const mesSiguiente = () => setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 1));

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

  const calcularPrecioBase = () => {
    const precioConsulta = catalogoTiposConsulta.find((c) => c.id === formCita.tipoConsultaId)?.precio || 0;
    const serviciosActuales = getServiciosPorEspecialidad(formCita.especialidad);
    const precioServicios = formCita.servicios.reduce((total, servId) => {
      const servicio = serviciosActuales.find((s) => s.id === servId);
      return total + (servicio?.precio || 0);
    }, 0);
    return precioConsulta + precioServicios;
  };

  const precioBase = calcularPrecioBase();
  const precioConDescuento = precioBase * (1 - descuentoAplicado / 100);

  const toggleServicio = (servicioId: string) => {
    setFormCita((prev) => ({
      ...prev,
      servicios: prev.servicios.includes(servicioId)
        ? prev.servicios.filter((s) => s !== servicioId)
        : [...prev.servicios, servicioId],
    }));
  };

  const guardarCita = async () => {
    if (!fechaSeleccionada) return;

    const tipoConsulta = catalogoTiposConsulta.find((c) => c.id === formCita.tipoConsultaId);
    const nuevaCita: CitaAgendada = {
      id: `CITA-${Date.now()}`,
      fecha: fechaSeleccionada,
      horaInicio: formCita.horaInicio,
      horaCierre: formCita.horaCierre,
      tipo: formCita.tipoConsultaId === "urgencia" ? "urgencia" : "cita",
      tipoConsultaId: formCita.tipoConsultaId,
      tipoConsultaNombre: tipoConsulta?.nombre || "",
      especialidad: formCita.especialidad,
      medicoEspecialista: formCita.medicoEspecialista,
      seguro: formCita.seguro,
      servicios: formCita.servicios,
      cupon: formCita.cupon,
      descuento: descuentoAplicado,
      precioBase: precioBase,
      precioFinal: precioConDescuento,
      estatus: "pendiente" as EstatusCita,
    };

    // Crear expediente del paciente si se llenaron sus datos
    if (formCita.pacienteNombre && formCita.pacienteApellidoPaterno) {
      await doctorService.createPatientFile({
        nombre: formCita.pacienteNombre,
        apellidoPaterno: formCita.pacienteApellidoPaterno,
        apellidoMaterno: formCita.pacienteApellidoMaterno,
        fechaNacimiento: formCita.pacienteFechaNacimiento,
        sexo: formCita.pacienteSexo,
        telefono: formCita.pacienteTelefono,
        email: formCita.pacienteEmail,
      }).catch(console.error);
    }

    // Crear la cita en el servidor
    await doctorService.createAppointment({
      fecha: fechaSeleccionada,
      hora: formCita.horaInicio,
      motivo: formCita.motivo || tipoConsulta?.nombre || "",
      especialidad: formCita.especialidad,
      medicoEspecialista: formCita.medicoEspecialista,
      tipoConsultaId: formCita.tipoConsultaId,
      seguro: formCita.seguro,
      servicios: formCita.servicios,
      cupon: formCita.cupon,
      descuento: descuentoAplicado,
      precioFinal: precioConDescuento,
    }).catch(console.error);

    setCitasAgendadas([...citasAgendadas, nuevaCita]);
    setMostrarFormulario(false);
    setFechaSeleccionada("");
    setFormCita({
      especialidadMedico: "",
      tipoConsultaId: "consulta_general",
      especialidad: "Medicina General",
      medicoEspecialista: medicosEspecialistas[0].nombre,
      seguro: "Sin seguro (Particular)",
      servicios: [],
      cupon: "",
      horaInicio: "09:00",
      horaCierre: "09:30",
      motivo: "",
      pacienteNombre: "",
      pacienteApellidoPaterno: "",
      pacienteApellidoMaterno: "",
      pacienteTelefono: "",
      pacienteEmail: "",
      pacienteFechaNacimiento: "",
      pacienteSexo: "Femenino" as "Masculino" | "Femenino" | "Otro",

    });
    setDescuentoAplicado(0);
    setCuponValido(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Agenda de Citas</h3>
        </div>
        <button
          onClick={() => setMostrarFormulario(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
        >
          <CalendarPlus className="w-4 h-4" />
          Agregar Cita
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4 p-4 bg-card border border-border rounded-2xl">
        <span className="text-sm font-medium text-foreground">Disponibilidad:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-emerald-400"></span>
          <span className="text-xs text-muted-foreground">Disponible</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-amber-400"></span>
          <span className="text-xs text-muted-foreground">Parcial</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-red-400"></span>
          <span className="text-xs text-muted-foreground">Lleno</span>
        </div>
        <span className="text-muted-foreground/40 text-sm">|</span>
        <span className="text-sm font-medium text-foreground">Citas:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-amber-300"></span>
          <span className="text-xs text-muted-foreground">Pendiente</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-emerald-300"></span>
          <span className="text-xs text-muted-foreground">Confirmada</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-blue-300"></span>
          <span className="text-xs text-muted-foreground">Llegó</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-red-300"></span>
          <span className="text-xs text-muted-foreground">Cancelada</span>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={mesAnterior} className="p-2 hover:bg-muted rounded-xl transition-colors" aria-label="Mes anterior">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-bold text-foreground">
            {nombresMeses[mesActual.getMonth()]} {mesActual.getFullYear()}
          </h3>
          <button onClick={mesSiguiente} className="p-2 hover:bg-muted rounded-xl transition-colors" aria-label="Mes siguiente">
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
            const estadoDia = !esOtroMes ? obtenerEstadoDia(fecha) : null;
            const citasDelDia = !esOtroMes ? obtenerCitasDelDia(fecha) : [];
            const esHoy = fecha === new Date().toISOString().substring(0, 10);
            const estaSeleccionado = fecha === fechaSeleccionada;
            const puedeAgendar = !esOtroMes && estadoDia && (estadoDia.tipo === "disponible" || estadoDia.tipo === "parcial");

            let colorFondo = "";
            let textColor = "text-foreground";

            if (!esOtroMes && estadoDia) {
              switch (estadoDia.tipo) {
                case "disponible":
                  colorFondo = "bg-emerald-50 hover:bg-emerald-100 border-emerald-200";
                  textColor = "text-emerald-800";
                  break;
                case "parcial":
                  colorFondo = "bg-amber-50 hover:bg-amber-100 border-amber-200";
                  textColor = "text-amber-800";
                  break;
                case "lleno":
                  colorFondo = "bg-red-50 hover:bg-red-100 border-red-200";
                  textColor = "text-red-800";
                  break;
                case "urgencia":
                  colorFondo = "bg-red-100 hover:bg-red-200 border-red-300";
                  textColor = "text-red-900";
                  break;
                case "pasado":
                  colorFondo = "bg-muted/50";
                  textColor = "text-muted-foreground/60";
                  break;
                case "domingo":
                  colorFondo = "bg-muted/30";
                  textColor = "text-muted-foreground/40";
                  break;
              }
            }

            return (
              <button
                key={index}
                onClick={() => {
                  if (esOtroMes) return;
                  if (citasDelDia.length > 0) {
                    setDiaSeleccionadoPanel(fecha === diaSeleccionadoPanel ? null : fecha);
                  } else if (puedeAgendar) {
                    setFechaSeleccionada(fecha);
                    setMostrarFormulario(true);
                  }
                }}
                disabled={esOtroMes}
                className={`
                  min-h-[80px] flex flex-col items-start justify-start p-2 text-sm rounded-xl transition-all w-full border
                  ${esOtroMes ? "text-muted-foreground/30 cursor-not-allowed border-transparent" : ""}
                  ${!esOtroMes ? colorFondo : ""}
                  ${!esOtroMes && (puedeAgendar || citasDelDia.length > 0) ? "cursor-pointer" : !esOtroMes ? "cursor-not-allowed" : ""}
                  ${esHoy && !esOtroMes ? "ring-2 ring-primary ring-offset-1" : ""}
                  ${estaSeleccionado || (!esOtroMes && fecha === diaSeleccionadoPanel) ? "ring-2 ring-primary bg-primary/20" : ""}
                `}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className={`text-xs font-bold leading-none ${esHoy && !esOtroMes ? "text-primary" : textColor}`}>
                    {dia}
                  </span>
                  {!esOtroMes && estadoDia && estadoDia.tipo !== "pasado" && estadoDia.tipo !== "domingo" && (
                    <span className={`text-[9px] font-semibold px-1 py-0.5 rounded ${estadoDia.tipo === "disponible" ? "bg-emerald-200 text-emerald-800" :
                        estadoDia.tipo === "parcial" ? "bg-amber-200 text-amber-800" :
                          estadoDia.tipo === "lleno" ? "bg-red-200 text-red-800" :
                            "bg-red-300 text-red-900"
                      }`}>
                      {estadoDia.tipo === "disponible" ? "Libre" :
                        estadoDia.tipo === "parcial" ? `${estadoDia.horasLibres}h` :
                          estadoDia.tipo === "lleno" ? "Lleno" : "Urg"}
                    </span>
                  )}
                </div>

                {!esOtroMes && citasDelDia.length > 0 && (
                  <div className="w-full space-y-0.5 overflow-hidden flex-1">
                    {citasDelDia.slice(0, 2).map((cita) => (
                      <div
                        key={cita.id}
                        className={`text-[9px] leading-tight font-medium truncate w-full px-1 py-0.5 rounded ${cita.estatus === "cancelada" ? "bg-red-200 text-red-900 line-through" :
                            cita.estatus === "confirmada" ? "bg-emerald-200 text-emerald-900" :
                              cita.estatus === "llego" ? "bg-blue-200 text-blue-900" :
                                cita.tipo === "urgencia" ? "bg-red-200 text-red-900" : "bg-amber-200 text-amber-900"
                          }`}
                      >
                        {cita.horaInicio}-{cita.horaCierre}
                      </div>
                    ))}
                    {citasDelDia.length > 2 && (
                      <span className="text-[9px] text-muted-foreground">+{citasDelDia.length - 2} más</span>
                    )}
                  </div>
                )}

                {!esOtroMes && citasDelDia.length === 0 && estadoDia?.tipo === "disponible" && (
                  <div className="flex-1 flex items-center justify-center w-full">
                    <span className="text-[9px] text-emerald-600 font-medium">Agendar</span>
                  </div>
                )}

                {!esOtroMes && estadoDia?.tipo === "domingo" && (
                  <div className="flex-1 flex items-center justify-center w-full">
                    <span className="text-[9px] text-muted-foreground/50">Cerrado</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Panel de citas del día */}
      {diaSeleccionadoPanel && (() => {
        const citasDelPanel = citasAgendadas.filter((c) => c.fecha === diaSeleccionadoPanel);
        if (citasDelPanel.length === 0) return null;
        return (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{fmtFecha(diaSeleccionadoPanel, { weekday: true })}</p>
                  <p className="text-xs text-muted-foreground">{citasDelPanel.length} cita(s) agendada(s)</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setFechaSeleccionada(diaSeleccionadoPanel); setMostrarFormulario(true); }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-xs font-medium hover:bg-primary/20 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Agregar
                </button>
                <button
                  onClick={() => setDiaSeleccionadoPanel(null)}
                  className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="divide-y divide-border">
              {citasDelPanel
                .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio))
                .map((cita) => {
                  const cfg = estatusConfig[cita.estatus];
                  return (
                    <div key={cita.id} className="p-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                      {/* Hora */}
                      <div className="flex items-center gap-2 shrink-0 w-28">
                        <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="text-sm font-bold text-foreground">{cita.horaInicio}</span>
                        <span className="text-xs text-muted-foreground">– {cita.horaCierre}</span>
                      </div>
                      {/* Detalle */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                          <p className="text-sm font-semibold text-foreground truncate">{cita.tipoConsultaNombre}</p>
                          {cita.tipo === "urgencia" && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-700 rounded-full font-bold">URG</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{cita.medicoEspecialista} · {cita.especialidad}</p>
                        <p className="text-xs font-semibold text-primary mt-0.5">${cita.precioFinal.toLocaleString()} MXN</p>
                      </div>
                      {/* Estatus badge */}
                      <div className="shrink-0">
                        <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${cfg.cls}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                      </div>
                      {/* Acciones de estatus */}
                      <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                        {cita.estatus !== "confirmada" && cita.estatus !== "cancelada" && (
                          <button
                            onClick={() => cambiarEstatus(cita.id, "confirmada")}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-medium hover:bg-emerald-100 transition-colors"
                            title="Marcar como confirmada"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Confirmar
                          </button>
                        )}
                        {cita.estatus !== "llego" && cita.estatus !== "cancelada" && (
                          <button
                            onClick={() => cambiarEstatus(cita.id, "llego")}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 text-xs font-medium hover:bg-blue-100 transition-colors"
                            title="Marcar que llegó"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            Llegó
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setCitaReprogramando(cita);
                            setReprog({ fecha: cita.fecha, horaInicio: cita.horaInicio, horaCierre: cita.horaCierre });
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 text-xs font-medium hover:bg-amber-100 transition-colors"
                          title="Reprogramar cita"
                        >
                          <CalendarPlus className="w-3.5 h-3.5" />
                          Reprogramar
                        </button>
                        {cita.estatus !== "cancelada" && (
                          <button
                            onClick={() => cambiarEstatus(cita.id, "cancelada")}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs font-medium hover:bg-red-100 transition-colors"
                            title="Cancelar cita"
                          >
                            <X className="w-3.5 h-3.5" />
                            Cancelar
                          </button>
                        )}
                        {cita.estatus === "cancelada" && (
                          <button
                            onClick={() => cambiarEstatus(cita.id, "pendiente")}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-border bg-muted text-muted-foreground text-xs font-medium hover:bg-muted/70 transition-colors"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Reactivar
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        );
      })()}

      {/* Modal reprogramación */}
      {citaReprogramando && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h3 className="text-base font-semibold text-foreground">Reprogramar cita</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{citaReprogramando.tipoConsultaNombre} · {citaReprogramando.medicoEspecialista}</p>
              </div>
              <button onClick={() => setCitaReprogramando(null)} className="p-2 hover:bg-muted rounded-xl transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-3 bg-muted/40 border border-border rounded-xl text-xs text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Fecha y horario actual</p>
                <p>{fmtFecha(citaReprogramando.fecha, { weekday: true })} · {citaReprogramando.horaInicio} – {citaReprogramando.horaCierre}</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Nueva fecha
                </label>
                <input
                  type="date"
                  value={reprog.fecha}
                  onChange={(e) => setReprog({ ...reprog, fecha: e.target.value })}
                  className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Hora inicio
                  </label>
                  <select
                    value={reprog.horaInicio}
                    onChange={(e) => setReprog({ ...reprog, horaInicio: e.target.value })}
                    className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {reprog.fecha ? obtenerHorasLibres(reprog.fecha).map((h) => (
                      <option key={h} value={h}>{h}</option>
                    )) : <option>Selecciona fecha primero</option>}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Hora cierre
                  </label>
                  <select
                    value={reprog.horaCierre}
                    onChange={(e) => setReprog({ ...reprog, horaCierre: e.target.value })}
                    className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {reprog.fecha && reprog.horaInicio ? obtenerHorasLibres(reprog.fecha)
                      .filter((h) => h > reprog.horaInicio)
                      .map((h) => (
                        <option key={h} value={h}>{h}</option>
                      )) : <option>Selecciona hora inicio</option>}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
              <button
                onClick={() => setCitaReprogramando(null)}
                className="px-4 py-2.5 border border-border rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={guardarReprogramacion}
                disabled={!reprog.fecha || !reprog.horaInicio || !reprog.horaCierre}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
              >
                <Save className="w-4 h-4" />
                Guardar reprogramación
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Agendar Nueva Cita</h3>
                {fechaSeleccionada && (
                  <p className="text-sm text-muted-foreground">{fmtFecha(fechaSeleccionada, { weekday: true })}</p>
                )}
              </div>
              <button
                onClick={() => { setMostrarFormulario(false); setFechaSeleccionada(""); }}
                className="p-2 hover:bg-muted rounded-xl transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Datos del paciente */}
              <div className="bg-muted/30 border border-border rounded-xl p-4 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                  <UserPlus className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">Datos del Paciente</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Nombre(s)</label>
                    <input
                      type="text"
                      value={formCita.pacienteNombre}
                      onChange={(e) => setFormCita({ ...formCita, pacienteNombre: e.target.value })}
                      className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Nombre"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Apellido Paterno</label>
                    <input
                      type="text"
                      value={formCita.pacienteApellidoPaterno}
                      onChange={(e) => setFormCita({ ...formCita, pacienteApellidoPaterno: e.target.value })}
                      className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Apellido paterno"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Apellido Materno</label>
                    <input
                      type="text"
                      value={formCita.pacienteApellidoMaterno}
                      onChange={(e) => setFormCita({ ...formCita, pacienteApellidoMaterno: e.target.value })}
                      className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Apellido materno"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Fecha de nacimiento</label>
                    <input
                      type="date"
                      value={formCita.pacienteFechaNacimiento}
                      onChange={(e) => setFormCita({ ...formCita, pacienteFechaNacimiento: e.target.value })}
                      className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Sexo</label>
                    <select
                      value={formCita.pacienteSexo}
                      onChange={(e) => setFormCita({ ...formCita, pacienteSexo: e.target.value as "Masculino" | "Femenino" | "Otro" })}
                      className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="Femenino">Femenino</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Telefono</label>
                    <input
                      type="tel"
                      value={formCita.pacienteTelefono}
                      onChange={(e) => setFormCita({ ...formCita, pacienteTelefono: e.target.value })}
                      className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="55 1234 5678"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Correo electronico</label>
                  <input
                    type="email"
                    value={formCita.pacienteEmail}
                    onChange={(e) => setFormCita({ ...formCita, pacienteEmail: e.target.value })}
                    className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
              </div>

              {/* Especialidad del Médico - NUEVO CAMPO */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-primary" />
                  Especialidad del Médico
                </label>
                <select
                  value={formCita.especialidadMedico}
                  onChange={(e) => {
                    setFormCita({
                      ...formCita,
                      especialidadMedico: e.target.value,
                      medicoEspecialista: "", // Limpiar selección de médico
                      especialidad: e.target.value // Actualizar especialidad
                    });
                  }}
                  className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">Seleccionar especialidad</option>
                  {obtenerEspecialidadesMedicos().map((esp) => (
                    <option key={esp} value={esp}>{esp}</option>
                  ))}
                </select>
              </div>


              {/* Médico especialista */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <User2 className="w-4 h-4 text-primary" />
                  Médico
                </label>
                <select
                  value={formCita.medicoEspecialista}
                  onChange={(e) => {
                    const med = getMedicosPorEspecialidad(formCita.especialidadMedico).find(
                      (m) => m.nombre === e.target.value
                    );
                    setFormCita({
                      ...formCita,
                      medicoEspecialista: e.target.value,
                      especialidad: med?.especialidad || formCita.especialidad,
                      tipoConsultaId: "", // AGREGAR ESTA LÍNEA - resetea el tipo de consulta
                      servicios: []
                    });
                  }}
                  className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  disabled={!formCita.especialidadMedico}
                >
                  <option value="">
                    {formCita.especialidadMedico ? "Seleccionar médico" : "Primero selecciona una especialidad"}
                  </option>
                  {getMedicosPorEspecialidad(formCita.especialidadMedico).map((med) => (
                    <option key={med.nombre} value={med.nombre}>
                      {med.nombre}
                    </option>
                  ))}
                </select>
                {(() => {
                  const medicosFiltrados = getMedicosPorEspecialidad(formCita.especialidadMedico);
                  const med = medicosFiltrados.find((m) => m.nombre === formCita.medicoEspecialista);
                  return med ? (
                    <div className="flex items-center gap-2 flex-wrap pt-0.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-xl text-xs font-medium">
                        <Stethoscope className="w-3 h-3" />
                        {med.especialidad}
                      </span>
                      <span className="text-xs text-muted-foreground">Cédula: {med.cedula}</span>
                    </div>
                  ) : null;
                })()}
              </div>

              {/* Tipo de consulta - FILTRADO POR MÉDICO */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-primary" />
                  Tipo de consulta
                </label>

                {!formCita.medicoEspecialista ? (
                  <div className="p-4 bg-muted/30 border border-border rounded-xl text-center text-muted-foreground text-sm">
                    Selecciona un médico primero para ver sus tipos de consulta
                  </div>
                ) : getTiposConsultaPorMedico(formCita.medicoEspecialista).length === 0 ? (
                  <div className="p-4 bg-muted/30 border border-border rounded-xl text-center text-muted-foreground text-sm">
                    Este médico no tiene tipos de consulta disponibles
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {getTiposConsultaPorMedico(formCita.medicoEspecialista).map((tc) => (
                      <button
                        key={tc.id}
                        onClick={() => setFormCita({ ...formCita, tipoConsultaId: tc.id })}
                        className={`flex items-center justify-center px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${formCita.tipoConsultaId === tc.id
                            ? "bg-primary/10 border-primary text-foreground"
                            : "bg-background border-border text-muted-foreground hover:bg-muted/50"
                          }`}
                      >
                        <span>{tc.nombre}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>


              {/* Motivo de la cita */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-primary" />
                  Motivo de la cita
                </label>
                <textarea
                  value={formCita.motivo}
                  onChange={(e) => setFormCita({ ...formCita, motivo: e.target.value })}
                  rows={3}
                  className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  placeholder="Describe el motivo de la consulta..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  Tipo de seguro
                </label>
                <select
                  value={formCita.seguro}
                  onChange={(e) => setFormCita({ ...formCita, seguro: e.target.value })}
                  className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {tiposSeguros.map((seg) => (
                    <option key={seg}>{seg}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Tag className="w-4 h-4 text-primary" />
                    Servicios adicionales
                  </label>
                  <span className="text-xs text-muted-foreground">
                    {!formCita.medicoEspecialista
                      ? "Selecciona un médico"
                      : `${getServiciosPorMedico(formCita.medicoEspecialista).length} disponibles`
                    }
                  </span>
                </div>

                {!formCita.medicoEspecialista ? (
                  <div className="p-4 bg-muted/30 border border-border rounded-xl text-center text-muted-foreground text-sm">
                    Selecciona un médico primero para ver los servicios disponibles
                  </div>
                ) : getServiciosPorMedico(formCita.medicoEspecialista).length === 0 ? (
                  <div className="p-4 bg-muted/30 border border-border rounded-xl text-center text-muted-foreground text-sm">
                    Este médico no tiene servicios adicionales disponibles
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {getServiciosPorMedico(formCita.medicoEspecialista).map((servicio) => (
                      <button
                        key={servicio.id}
                        onClick={() => toggleServicio(servicio.id)}
                        className={`flex flex-col items-start justify-between px-3 py-2.5 rounded-xl border text-sm transition-colors ${formCita.servicios.includes(servicio.id)
                            ? "bg-primary/10 border-primary text-foreground"
                            : "bg-background border-border text-muted-foreground hover:bg-muted/50"
                          }`}
                      >
                        <span className="truncate text-left w-full">{servicio.nombre}</span>
                        <span className="text-xs font-semibold mt-1">${servicio.precio.toLocaleString()}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

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
                    className={`flex-1 border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 uppercase ${cuponValido === true ? "border-emerald-500" : cuponValido === false ? "border-red-500" : "border-border"
                      }`}
                    placeholder="Ingresa tu cupón"
                  />
                  {cuponValido === true && (
                    <span className="flex items-center px-3 text-sm font-semibold text-emerald-600 bg-emerald-50 rounded-xl">
                      -{descuentoAplicado}%
                    </span>
                  )}
                </div>
                {cuponValido === false && <p className="text-xs text-red-500">Cupón no válido</p>}
              </div>

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
                    className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
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
                    className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Seleccionar</option>
                    {fechaSeleccionada && obtenerHorasLibres(fechaSeleccionada).map((h) => (
                      <option key={h} value={h}>{h}</option>
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
                    className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Seleccionar</option>
                    {fechaSeleccionada && formCita.horaInicio && obtenerHorasLibres(fechaSeleccionada)
                      .filter((h) => h > formCita.horaInicio)
                      .map((h) => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="bg-muted/30 border border-border rounded-xl p-4 space-y-2">
                {(() => {
                  const tc = catalogoTiposConsulta.find((c) => c.id === formCita.tipoConsultaId);
                  return tc ? (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Consulta ({tc.nombre}):</span>
                      <span className="font-medium text-foreground">${tc.precio.toLocaleString()} MXN</span>
                    </div>
                  ) : null;
                })()}
                {formCita.servicios.length > 0 && (() => {
                  const serviciosActuales = getServiciosPorEspecialidad(formCita.especialidad);
                  const precioServicios = formCita.servicios.reduce((t, s) => t + (serviciosActuales.find(x => x.id === s)?.precio || 0), 0);
                  return (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Servicios adicionales ({formCita.servicios.length}):</span>
                      <span className="font-medium text-foreground">${precioServicios.toLocaleString()} MXN</span>
                    </div>
                  );
                })()}
                <div className="flex items-center justify-between text-sm border-t border-border/50 pt-2">
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
                  <span className="text-2xl font-bold text-primary">${precioConDescuento.toLocaleString()} MXN</span>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => { setMostrarFormulario(false); setFechaSeleccionada(""); }}
                className="px-4 py-2.5 border border-border rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={guardarCita}
                disabled={!fechaSeleccionada || !formCita.tipoConsultaId}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
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
// TAB: CONSULTA (con sub-tabs)
// ─────────────────────────────────────────────

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
  { id: "visitas", label: "Visitas Clínicas", icon: UserCheck },
  { id: "datosclinicos", label: "Datos Clínicos", icon: Activity },
  { id: "soap", label: "SOAP", icon: ClipboardList },
  { id: "alergias", label: "Alergias", icon: AlertTriangle },
  { id: "diagnostico", label: "Diagnóstico", icon: Stethoscope },
  { id: "notas", label: "Notas", icon: FileEdit },
  { id: "prescripcion", label: "Prescripción", icon: Pill },
  { id: "resumen", label: "Resumen", icon: FileCheck },
] as const;

// SOAP interface
interface SOAPNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

// Visita clínica status
type VisitaClinicaEstatus = "esperando" | "llegó" | "en_consulta" | "atendido";

interface VisitaClinica {
  id: string;
  pacienteNombre: string;
  pacienteSexo: "Masculino" | "Femenino" | "Otro";
  horaLlegada?: string;
  horaCita: string;
  motivo: string;
  estatus: VisitaClinicaEstatus;
  especialidad: string;
}

type SubTabConsultaId = (typeof subTabsConsulta)[number]["id"];

// Mock visitas clínicas (pacientes esperando/llegados)
const visitasClinicasMock: VisitaClinica[] = [];

function ConsultaTab() {
  const [activeSubTab, setActiveSubTab] = useState<SubTabConsultaId>("visitas");

  // Estado para visitas clínicas
  const [visitasClinicas, setVisitasClinicas] = useState<VisitaClinica[]>(visitasClinicasMock);

  // Estado para SOAP
  const [soapNote, setSoapNote] = useState<SOAPNote>({
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
  });

  const [datosClinicosForm, setDatosClinicosForm] = useState<DatosClinicosForm>({
    peso: "", estatura: "", frecuenciaCardiaca: "", presionSistolica: "", presionDiastolica: "",
    imc: "", masaCorporal: "", grasaCorporal: "", frecuenciaRespiratoria: "", temperatura: "",
  });

  const [diagnosticos, setDiagnosticos] = useState<DiagnosticoItem[]>([]);
  const [nuevaClave, setNuevaClave] = useState("");
  const [nuevoDiagnostico, setNuevoDiagnostico] = useState("");
  const [sugerenciasCIE, setSugerenciasCIE] = useState<Array<{ clave: string; descripcion: string }>>([]);
  const [busquedaDiagPor, setBusquedaDiagPor] = useState<"clave" | "nombre">("clave");
  const [sugerenciasNombre, setSugerenciasNombre] = useState<Array<{ clave: string; descripcion: string }>>([]);

  // Búsqueda por nombre de diagnóstico
  const handleNombreChange = (value: string) => {
    setNuevoDiagnostico(value);
    if (value.length >= 2) {
      const coincidencias = Object.entries(catalogoCIE10)
        .filter(([, descripcion]) => descripcion.toLowerCase().includes(value.toLowerCase()))
        .map(([clave, descripcion]) => ({ clave, descripcion }))
        .slice(0, 8);
      setSugerenciasNombre(coincidencias);
    } else {
      setSugerenciasNombre([]);
    }
  };

  // Estado para tipo de medicamento: comercial vs principio activo
  const [tipoMedicamento, setTipoMedicamento] = useState<"comercial" | "principioActivo">("comercial");

  const [notas, setNotas] = useState<NotaItem[]>([]);
  const [nuevaNota, setNuevaNota] = useState("");

  const [prescripciones, setPrescripciones] = useState<PrescripcionItem[]>([]);
  const [prescripcionForm, setPrescripcionForm] = useState({
    medicamento: "", dosis: "", frecuencia: "", duracion: "", via: "", indicaciones: "",
  });
  const [busquedaMedicamento, setBusquedaMedicamento] = useState("");
  const [sugerenciasMedicamento, setSugerenciasMedicamento] = useState<typeof catalogoMedicamentos>([]);

  // Alergias (editable por el doctor en consulta)
  const [alergiasConsulta, setAlergiasConsulta] = useState<Alergia[]>([]);
  const [mostrarFormAlergiaConsulta, setMostrarFormAlergiaConsulta] = useState(false);
  const [nuevaAlergiaConsulta, setNuevaAlergiaConsulta] = useState<Omit<Alergia, "id">>({
    tipo: "Medicamento", descripcion: "", reaccion: "", severidad: "Leve",
  });

  const agregarAlergiaConsulta = () => {
    if (nuevaAlergiaConsulta.descripcion.trim()) {
      setAlergiasConsulta([...alergiasConsulta, { id: `AL-${Date.now()}`, ...nuevaAlergiaConsulta }]);
      setNuevaAlergiaConsulta({ tipo: "Medicamento", descripcion: "", reaccion: "", severidad: "Leve" });
      setMostrarFormAlergiaConsulta(false);
    }
  };

  const eliminarAlergiaConsulta = (id: string) => setAlergiasConsulta(alergiasConsulta.filter((a) => a.id !== id));

  const calcularIMC = (peso: string, estatura: string) => {
    const pesoNum = parseFloat(peso);
    const estaturaNum = parseFloat(estatura) / 100;
    if (pesoNum > 0 && estaturaNum > 0) return (pesoNum / (estaturaNum * estaturaNum)).toFixed(1);
    return "";
  };

  const handleDatosClinicosChange = (field: keyof DatosClinicosForm, value: string) => {
    const newForm = { ...datosClinicosForm, [field]: value };
    if (field === "peso" || field === "estatura") {
      newForm.imc = calcularIMC(field === "peso" ? value : newForm.peso, field === "estatura" ? value : newForm.estatura);
    }
    setDatosClinicosForm(newForm);
  };

  const handleClaveChange = (value: string) => {
    setNuevaClave(value.toUpperCase());
    if (value.length >= 1) {
      const coincidencias = Object.entries(catalogoCIE10)
        .filter(([clave]) => clave.startsWith(value.toUpperCase()))
        .map(([clave, descripcion]) => ({ clave, descripcion }))
        .slice(0, 5);
      setSugerenciasCIE(coincidencias);
      const exacta = catalogoCIE10[value.toUpperCase()];
      if (exacta) setNuevoDiagnostico(exacta);
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
      setDiagnosticos([...diagnosticos, { id: `DX-${Date.now()}`, clave: nuevaClave, descripcion: nuevoDiagnostico, fecha: new Date().toISOString() }]);
      setNuevaClave("");
      setNuevoDiagnostico("");
    }
  };

  const eliminarDiagnostico = (id: string) => setDiagnosticos(diagnosticos.filter((d) => d.id !== id));

  const agregarNota = () => {
    if (nuevaNota.trim()) {
      setNotas([...notas, { id: `NOTA-${Date.now()}`, contenido: nuevaNota.trim(), fecha: new Date().toISOString() }]);
      setNuevaNota("");
    }
  };

  const eliminarNota = (id: string) => setNotas(notas.filter((n) => n.id !== id));

  const handleBusquedaMedicamento = (value: string) => {
    setBusquedaMedicamento(value);
    setPrescripcionForm({ ...prescripcionForm, medicamento: value });
    if (value.length >= 2) {
      setSugerenciasMedicamento(catalogoMedicamentos.filter((m) => m.nombre.toLowerCase().includes(value.toLowerCase())));
    } else {
      setSugerenciasMedicamento([]);
    }
  };

  const seleccionarMedicamento = (med: typeof catalogoMedicamentos[0]) => {
    setPrescripcionForm({ ...prescripcionForm, medicamento: med.nombre, dosis: med.presentaciones[0] || "", via: med.vias[0] || "" });
    setBusquedaMedicamento(med.nombre);
    setSugerenciasMedicamento([]);
  };

  const agregarPrescripcion = () => {
    if (prescripcionForm.medicamento && prescripcionForm.dosis) {
      setPrescripciones([...prescripciones, { id: `RX-${Date.now()}`, ...prescripcionForm }]);
      setPrescripcionForm({ medicamento: "", dosis: "", frecuencia: "", duracion: "", via: "", indicaciones: "" });
      setBusquedaMedicamento("");
    }
  };

  const eliminarPrescripcion = (id: string) => setPrescripciones(prescripciones.filter((p) => p.id !== id));

  // ─────────────────────────────────────────────
  // FUNCIONES DE GUARDADO CON API
  // ─────────────────────────────────────────────

  const [guardandoSOAP, setGuardandoSOAP] = useState(false);
  const [guardandoDatosClinicos, setGuardandoDatosClinicos] = useState(false);
  const [guardandoPrescripcion, setGuardandoPrescripcion] = useState(false);

  // Guardar Nota SOAP
  const handleGuardarSOAP = async () => {
    setGuardandoSOAP(true);
    try {
      await doctorService.saveSOAP({
        patient_id: "PAT001", // TODO: Obtener del paciente actual
        doctor_id: "DOC001", // TODO: Obtener del doctor actual
        appointment_id: 1,
        subjective: soapNote.subjective,
        objective: soapNote.objective,
        assessment: soapNote.assessment,
        plan: soapNote.plan,
        diagnosis: diagnosticos.map(d => d.descripcion).join(", "),
        prescription: prescripciones.map(p => `${p.medicamento} ${p.dosis}`).join(", "),
        observations: notas.map(n => n.contenido).join("\n"),
      });
      alert("Nota SOAP guardada exitosamente");
    } catch (error) {
      console.error("Error al guardar SOAP:", error);
      alert("Error al guardar la nota SOAP");
    } finally {
      setGuardandoSOAP(false);
    }
  };

  // Guardar Datos Clínicos / Signos Vitales
  const handleGuardarDatosClinicos = async () => {
    setGuardandoDatosClinicos(true);
    try {
      const bloodPressure = datosClinicosForm.presionSistolica && datosClinicosForm.presionDiastolica
        ? `${datosClinicosForm.presionSistolica}/${datosClinicosForm.presionDiastolica}`
        : undefined;

      await doctorService.saveSignosVitales({
        patient_id: "PAT001", // TODO: Obtener del paciente actual
        doctor_id: "DOC001", // TODO: Obtener del doctor actual
        appointment_id: 1,
        blood_pressure: bloodPressure,
        heart_rate: datosClinicosForm.frecuenciaCardiaca ? parseInt(datosClinicosForm.frecuenciaCardiaca) : undefined,
        respiratory_rate: datosClinicosForm.frecuenciaRespiratoria ? parseInt(datosClinicosForm.frecuenciaRespiratoria) : undefined,
        temperature: datosClinicosForm.temperatura ? parseFloat(datosClinicosForm.temperatura) : undefined,
        weight: datosClinicosForm.peso ? parseFloat(datosClinicosForm.peso) : undefined,
        height: datosClinicosForm.estatura ? parseFloat(datosClinicosForm.estatura) / 100 : undefined, // Convertir cm a m
        bmi: datosClinicosForm.imc ? parseFloat(datosClinicosForm.imc) : undefined,
        notes: "Registro de signos vitales en consulta",
      });
      alert("Datos clínicos guardados exitosamente");
    } catch (error) {
      console.error("Error al guardar datos clínicos:", error);
      alert("Error al guardar los datos clínicos");
    } finally {
      setGuardandoDatosClinicos(false);
    }
  };

  // Guardar Alergia con API
  const handleGuardarAlergiaConsulta = async () => {
    if (!nuevaAlergiaConsulta.descripcion.trim()) return;
    
    try {
      // Mapear tipo de alergia al formato de la API
      const tipoMap: Record<string, string> = {
        "Medicamento": "MEDICAMENTO",
        "Alimento": "ALIMENTO",
        "Ambiental": "AMBIENTAL",
        "Material": "MATERIAL",
        "Otro": "OTRO",
      };
      
      // Mapear severidad al formato de la API
      const severidadMap: Record<string, string> = {
        "Leve": "LEVE",
        "Moderada": "MODERADA",
        "Grave": "SEVERA",
      };

      await doctorService.savePatientAlergia({
        patient_id: "PAT001", // TODO: Obtener del paciente actual
        allergy_type: tipoMap[nuevaAlergiaConsulta.tipo] || "OTRO",
        allergen: nuevaAlergiaConsulta.descripcion,
        reaction: nuevaAlergiaConsulta.reaccion || undefined,
        severity: severidadMap[nuevaAlergiaConsulta.severidad] || "LEVE",
        notes: "",
      });

      // Agregar a la lista local
      setAlergiasConsulta([...alergiasConsulta, { id: `AL-${Date.now()}`, ...nuevaAlergiaConsulta }]);
      setNuevaAlergiaConsulta({ tipo: "Medicamento", descripcion: "", reaccion: "", severidad: "Leve" });
      setMostrarFormAlergiaConsulta(false);
      alert("Alergia guardada exitosamente");
    } catch (error) {
      console.error("Error al guardar alergia:", error);
      alert("Error al guardar la alergia");
    }
  };

  // Guardar Prescripción con API
  const handleGuardarPrescripcion = async () => {
    if (prescripciones.length === 0) return;
    
    setGuardandoPrescripcion(true);
    try {
      // Mapear frecuencia a horas
      const frecuenciaToHours: Record<string, number> = {
        "Cada 4 horas": 4,
        "Cada 6 horas": 6,
        "Cada 8 horas": 8,
        "Cada 12 horas": 12,
        "Cada 24 horas": 24,
        "PRN (según necesidad)": 0,
      };

      // Mapear duración a días
      const duracionToDays: Record<string, number> = {
        "Dosis única": 1,
        "1 día": 1,
        "3 días": 3,
        "5 días": 5,
        "7 días": 7,
        "10 días": 10,
        "14 días": 14,
        "21 días": 21,
        "30 días": 30,
        "60 días": 60,
        "90 días": 90,
        "Indefinido": 365,
      };

      // Mapear vía al formato de la API
      const viaMap: Record<string, string> = {
        "Oral": "ORAL",
        "Intramuscular": "INTRAMUSCULAR",
        "Intravenosa": "INTRAVENOSA",
        "Tópica": "TOPICA",
        "Inhalada": "INHALADA",
      };

      // Guardar cada prescripción
      for (const rx of prescripciones) {
        await doctorService.savePrescripcion({
          patient_id: "PAT001", // TODO: Obtener del paciente actual
          doctor_id: "DOC001", // TODO: Obtener del doctor actual
          appointment_id: 1,
          medication_type: tipoMedicamento === "comercial" ? "COMERCIAL" : "GENERICO",
          medication_name: rx.medicamento,
          dosage: rx.dosis,
          route: viaMap[rx.via] || "ORAL",
          frequency_hours: frecuenciaToHours[rx.frecuencia] || 8,
          duration_days: duracionToDays[rx.duracion] || 5,
          indications: rx.indicaciones || undefined,
        });
      }
      alert("Prescripciones guardadas exitosamente");
    } catch (error) {
      console.error("Error al guardar prescripciones:", error);
      alert("Error al guardar las prescripciones");
    } finally {
      setGuardandoPrescripcion(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-border">
        <nav className="flex gap-1 overflow-x-auto pb-px" aria-label="Secciones de consulta">
          {subTabsConsulta.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSubTab(id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors rounded-t-xl ${activeSubTab === id
                  ? "border-primary text-foreground bg-primary/5"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div className="pt-2">
        {/* VISITAS CLÍNICAS - Pacientes antes/durante consulta */}
        {activeSubTab === "visitas" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Visitas Clínicas del Día</h3>
                  <p className="text-xs text-muted-foreground">{visitasClinicas.length} paciente(s) programados</p>
                </div>
              </div>
            </div>

            {/* Resumen de estados */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { estatus: "esperando" as const, label: "Esperando", color: "bg-amber-50 border-amber-200 text-amber-700", icon: Clock },
                { estatus: "llegó" as const, label: "Llegó", color: "bg-blue-50 border-blue-200 text-blue-700", icon: UserCheck },
                { estatus: "en_consulta" as const, label: "En Consulta", color: "bg-primary/10 border-primary/20 text-primary", icon: Stethoscope },
                { estatus: "atendido" as const, label: "Atendido", color: "bg-emerald-50 border-emerald-200 text-emerald-700", icon: CheckCircle2 },
              ].map(({ estatus, label, color, icon: Icon }) => (
                <div key={estatus} className={`p-4 rounded-xl border ${color}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-semibold">{label}</span>
                  </div>
                  <p className="text-2xl font-bold">{visitasClinicas.filter(v => v.estatus === estatus).length}</p>
                </div>
              ))}
            </div>

            {/* Lista de pacientes */}
            <div className="space-y-3">
              {visitasClinicas.map((visita) => {
                const estatusConfig: Record<VisitaClinicaEstatus, { bg: string; text: string; label: string }> = {
                  esperando: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", label: "Esperando" },
                  "llegó": { bg: "bg-blue-50 border-blue-200", text: "text-blue-700", label: "Llegó" },
                  en_consulta: { bg: "bg-primary/10 border-primary/20", text: "text-primary", label: "En Consulta" },
                  atendido: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", label: "Atendido" },
                };
                const cfg = estatusConfig[visita.estatus];

                return (
                  <div key={visita.id} className={`p-4 rounded-2xl border ${cfg.bg} transition-all hover:shadow-md`}>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <AvatarPaciente nombre={visita.pacienteNombre} sexo={visita.pacienteSexo} size={48} />
                        <div>
                          <p className="font-semibold text-foreground">{visita.pacienteNombre}</p>
                          <p className="text-sm text-muted-foreground">{visita.motivo}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Cita: {visita.horaCita}
                            </span>
                            {visita.horaLlegada && (
                              <span className="flex items-center gap-1 text-blue-600">
                                <UserCheck className="w-3 h-3" />
                                Llegó: {visita.horaLlegada}
                              </span>
                            )}
                            <span className="px-2 py-0.5 bg-muted rounded-full text-xs">{visita.especialidad}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text}`}>
                          {cfg.label}
                        </span>

                        {/* Acciones según estado */}
                        <div className="flex gap-1">
                          {visita.estatus === "esperando" && (
                            <button
                              onClick={() => setVisitasClinicas(prev => prev.map(v =>
                                v.id === visita.id ? { ...v, estatus: "llegó" as const, horaLlegada: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) } : v
                              ))}
                              className="px-3 py-1.5 bg-blue-500 text-white rounded-xl text-xs font-medium hover:bg-blue-600 transition-colors"
                            >
                              Marcar Llegó
                            </button>
                          )}
                          {visita.estatus === "llegó" && (
                            <button
                              onClick={() => setVisitasClinicas(prev => prev.map(v =>
                                v.id === visita.id ? { ...v, estatus: "en_consulta" as const } : v
                              ))}
                              className="px-3 py-1.5 bg-primary text-white rounded-xl text-xs font-medium hover:bg-primary/90 transition-colors"
                            >
                              Iniciar Consulta
                            </button>
                          )}
                          {visita.estatus === "en_consulta" && (
                            <button
                              onClick={() => setVisitasClinicas(prev => prev.map(v =>
                                v.id === visita.id ? { ...v, estatus: "atendido" as const } : v
                              ))}
                              className="px-3 py-1.5 bg-emerald-500 text-white rounded-xl text-xs font-medium hover:bg-emerald-600 transition-colors"
                            >
                              Finalizar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SOAP - Notas médicas estructuradas */}
        {activeSubTab === "soap" && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Nota SOAP</h3>
                <p className="text-xs text-muted-foreground">Subjetivo, Objetivo, Análisis, Plan</p>
              </div>
            </div>

            <div className="grid gap-4">
              {/* Subjetivo */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">S</span>
                  <div>
                    <h4 className="font-semibold text-foreground">Subjetivo</h4>
                    <p className="text-xs text-muted-foreground">Síntomas, motivo de consulta, historia del paciente</p>
                  </div>
                </div>
                <textarea
                  value={soapNote.subjective}
                  onChange={(e) => setSoapNote({ ...soapNote, subjective: e.target.value })}
                  rows={4}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  placeholder="¿Qué refiere el paciente? Síntomas principales, duración, factores agravantes..."
                />
              </div>

              {/* Objetivo */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">O</span>
                  <div>
                    <h4 className="font-semibold text-foreground">Objetivo</h4>
                    <p className="text-xs text-muted-foreground">Hallazgos del examen físico, signos vitales, resultados de laboratorio</p>
                  </div>
                </div>
                <textarea
                  value={soapNote.objective}
                  onChange={(e) => setSoapNote({ ...soapNote, objective: e.target.value })}
                  rows={4}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  placeholder="Signos vitales, exploración física, resultados de estudios..."
                />
              </div>

              {/* Análisis/Assessment */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-sm">A</span>
                  <div>
                    <h4 className="font-semibold text-foreground">Análisis</h4>
                    <p className="text-xs text-muted-foreground">Diagnóstico, diagnósticos diferenciales, interpretación</p>
                  </div>
                </div>
                <textarea
                  value={soapNote.assessment}
                  onChange={(e) => setSoapNote({ ...soapNote, assessment: e.target.value })}
                  rows={4}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  placeholder="Impresión diagnóstica, diagnósticos diferenciales, severidad..."
                />
              </div>

              {/* Plan */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">P</span>
                  <div>
                    <h4 className="font-semibold text-foreground">Plan</h4>
                    <p className="text-xs text-muted-foreground">Tratamiento, estudios a solicitar, seguimiento</p>
                  </div>
                </div>
                <textarea
                  value={soapNote.plan}
                  onChange={(e) => setSoapNote({ ...soapNote, plan: e.target.value })}
                  rows={4}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  placeholder="Tratamiento indicado, estudios solicitados, próxima cita..."
                />
              </div>
            </div>

            <button 
              onClick={handleGuardarSOAP}
              disabled={guardandoSOAP}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed">
              <Save className="w-4 h-4" />
              {guardandoSOAP ? "Guardando..." : "Guardar Nota SOAP"}
            </button>
          </div>
        )}

        {activeSubTab === "datosclinicos" && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Datos Clínicos</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { field: "peso", label: "Peso (kg)", icon: Scale, placeholder: "70.5" },
                { field: "estatura", label: "Estatura (cm)", icon: Ruler, placeholder: "175" },
                { field: "frecuenciaCardiaca", label: "Frec. Cardíaca", icon: Heart, placeholder: "72" },
                { field: "presionSistolica", label: "P. Sistólica", icon: Droplets, placeholder: "120" },
                { field: "presionDiastolica", label: "P. Diastólica", icon: Droplets, placeholder: "80" },
                { field: "temperatura", label: "Temperatura (°C)", icon: Thermometer, placeholder: "36.5" },
                { field: "frecuenciaRespiratoria", label: "Frec. Respiratoria", icon: Wind, placeholder: "16" },
                { field: "grasaCorporal", label: "Grasa Corporal (%)", icon: Scale, placeholder: "18.5" },
                { field: "masaCorporal", label: "Masa Corporal (%)", icon: Scale, placeholder: "45.5" },
                { field: "imc", label: "IMC (calculado)", icon: TrendingDown, placeholder: "Calculado", readOnly: true },
              ].map(({ field, label, icon: Icon, placeholder, readOnly }) => (
                <div key={field} className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5" /> {label}
                  </label>
                  <input
                    type={readOnly ? "text" : "number"}
                    step="0.1"
                    value={datosClinicosForm[field as keyof DatosClinicosForm]}
                    onChange={(e) => handleDatosClinicosChange(field as keyof DatosClinicosForm, e.target.value)}
                    readOnly={readOnly}
                    className={`w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${readOnly ? "bg-muted/50 cursor-not-allowed" : ""}`}
                    placeholder={placeholder}
                  />
                </div>
              ))}
            </div>

            {datosClinicosForm.imc && (
              <div className="p-4 bg-card border border-border rounded-xl">
                <p className="text-sm font-medium text-foreground">
                  IMC: {datosClinicosForm.imc}
                  <span className={`ml-2 text-xs font-semibold ${imcCategoria(parseFloat(datosClinicosForm.imc)).cls}`}>
                    ({imcCategoria(parseFloat(datosClinicosForm.imc)).label})
                  </span>
                </p>
              </div>
            )}

            <button 
              onClick={handleGuardarDatosClinicos}
              disabled={guardandoDatosClinicos}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed">
              <Save className="w-4 h-4" />
              {guardandoDatosClinicos ? "Guardando..." : "Guardar Datos Clínicos"}
            </button>
          </div>
        )}

        {activeSubTab === "alergias" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Alergias</h3>
                  <p className="text-xs text-muted-foreground">{alergiasConsulta.length} alergia(s) registrada(s)</p>
                </div>
              </div>
              <button
                onClick={() => setMostrarFormAlergiaConsulta((v) => !v)}
                className="inline-flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-sm font-medium hover:bg-primary/20 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Agregar alergia
              </button>
            </div>

            {mostrarFormAlergiaConsulta && (
              <div className="p-5 bg-muted/30 border border-border rounded-2xl space-y-4">
                <p className="text-sm font-semibold text-foreground">Nueva alergia</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Tipo</label>
                    <select
                      value={nuevaAlergiaConsulta.tipo}
                      onChange={(e) => setNuevaAlergiaConsulta({ ...nuevaAlergiaConsulta, tipo: e.target.value as Alergia["tipo"] })}
                      className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      {(["Medicamento", "Alimento", "Ambiental", "Material", "Otro"] as Alergia["tipo"][]).map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Agente / Descripción</label>
                    <input
                      type="text"
                      value={nuevaAlergiaConsulta.descripcion}
                      onChange={(e) => setNuevaAlergiaConsulta({ ...nuevaAlergiaConsulta, descripcion: e.target.value })}
                      className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Ej: Penicilina, Camarón..."
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Reacción</label>
                    <input
                      type="text"
                      value={nuevaAlergiaConsulta.reaccion}
                      onChange={(e) => setNuevaAlergiaConsulta({ ...nuevaAlergiaConsulta, reaccion: e.target.value })}
                      className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Urticaria, dificultad respiratoria..."
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Severidad</label>
                    <select
                      value={nuevaAlergiaConsulta.severidad}
                      onChange={(e) => setNuevaAlergiaConsulta({ ...nuevaAlergiaConsulta, severidad: e.target.value as Alergia["severidad"] })}
                      className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option>Leve</option>
                      <option>Moderada</option>
                      <option>Grave</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleGuardarAlergiaConsulta}
                    disabled={!nuevaAlergiaConsulta.descripcion.trim()}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    <Save className="w-4 h-4" />
                    Guardar
                  </button>
                  <button
                    onClick={() => setMostrarFormAlergiaConsulta(false)}
                    className="px-4 py-2.5 border border-border rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {alergiasConsulta.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm font-medium">Sin alergias registradas</p>
                <p className="text-xs mt-1">Use el botón &quot;Agregar alergia&quot; para registrar una nueva</p>
              </div>
            ) : (
              <div className="space-y-3">
                {alergiasConsulta.map((al) => {
                  const cfg = severidadAlergiaConfig[al.severidad];
                  return (
                    <div key={al.id} className={`flex items-center justify-between gap-3 p-4 rounded-2xl border ${cfg.bg}`}>
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-white/70 flex items-center justify-center text-lg shrink-0 shadow-sm">
                          {tipoAlergiaIconos[al.tipo] ?? "⚠️"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <p className={`font-semibold text-sm ${cfg.cls}`}>{al.descripcion}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${cfg.bg} ${cfg.cls}`}>
                              {al.tipo}
                            </span>
                          </div>
                          {al.reaccion && (
                            <p className="text-xs text-muted-foreground">{al.reaccion}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${cfg.bg} ${cfg.cls}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {al.severidad}
                        </span>
                        <button
                          onClick={() => eliminarAlergiaConsulta(al.id)}
                          className="p-1.5 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          aria-label="Eliminar alergia"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeSubTab === "diagnostico" && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Diagnóstico</h3>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
              {/* Selector de modo: Clave o Nombre */}
              <div className="flex items-center gap-3 mb-4">
                <p className="text-sm font-medium text-foreground">Buscar por:</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setBusquedaDiagPor("clave")}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${busquedaDiagPor === "clave"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/70"
                      }`}
                  >
                    Clave CIE-10
                  </button>
                  <button
                    onClick={() => setBusquedaDiagPor("nombre")}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${busquedaDiagPor === "nombre"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/70"
                      }`}
                  >
                    Nombre
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {busquedaDiagPor === "clave" ? (
                  <div className="space-y-1.5 relative">
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5" /> Clave CIE-10
                    </label>
                    <input
                      type="text"
                      value={nuevaClave}
                      onChange={(e) => handleClaveChange(e.target.value)}
                      className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 uppercase"
                      placeholder="Ej: I10, J45, E11..."
                    />
                    {sugerenciasCIE.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-xl shadow-lg max-h-48 overflow-y-auto">
                        {sugerenciasCIE.map(({ clave, descripcion }) => (
                          <button
                            key={clave}
                            type="button"
                            onClick={() => seleccionarCIE(clave, descripcion)}
                            className="w-full text-left px-3 py-2.5 text-sm hover:bg-muted/50 transition-colors flex items-center gap-2"
                          >
                            <span className="font-mono font-semibold text-primary">{clave}</span>
                            <span className="text-foreground truncate">{descripcion}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1.5 relative">
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5" /> Buscar por nombre
                    </label>
                    <input
                      type="text"
                      value={nuevoDiagnostico}
                      onChange={(e) => handleNombreChange(e.target.value)}
                      className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Ej: Diabetes, Hipertensión, Endometriosis..."
                    />
                    {sugerenciasNombre.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-xl shadow-lg max-h-48 overflow-y-auto">
                        {sugerenciasNombre.map(({ clave, descripcion }) => (
                          <button
                            key={clave}
                            type="button"
                            onClick={() => seleccionarCIE(clave, descripcion)}
                            className="w-full text-left px-3 py-2.5 text-sm hover:bg-muted/50 transition-colors flex items-center gap-2"
                          >
                            <span className="font-mono font-semibold text-primary">{clave}</span>
                            <span className="text-foreground truncate">{descripcion}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <ClipboardList className="w-3.5 h-3.5" /> {busquedaDiagPor === "clave" ? "Diagnóstico" : "Clave CIE-10"}
                  </label>
                  <input
                    type="text"
                    value={busquedaDiagPor === "clave" ? nuevoDiagnostico : nuevaClave}
                    onChange={(e) => busquedaDiagPor === "clave" ? setNuevoDiagnostico(e.target.value) : setNuevaClave(e.target.value)}
                    className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder={busquedaDiagPor === "clave" ? "Se autocompleta al ingresar clave" : "Se autocompleta al buscar nombre"}
                    readOnly={busquedaDiagPor === "nombre"}
                  />
                </div>
              </div>

              <button
                onClick={agregarDiagnostico}
                disabled={!nuevaClave || !nuevoDiagnostico}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
              >
                <Plus className="w-4 h-4" />
                Agregar Diagnóstico
              </button>
            </div>

            {diagnosticos.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Diagnósticos agregados ({diagnosticos.length})</p>
                <div className="space-y-2">
                  {diagnosticos.map((dx) => (
                    <div key={dx.id} className="flex items-center justify-between gap-3 bg-card border border-border rounded-xl p-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-lg font-mono text-sm font-semibold shrink-0">
                          {dx.clave}
                        </span>
                        <span className="text-sm text-foreground truncate">{dx.descripcion}</span>
                      </div>
                      <button
                        onClick={() => eliminarDiagnostico(dx.id)}
                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors shrink-0"
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
                <Stethoscope className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No hay diagnósticos agregados</p>
              </div>
            )}
          </div>
        )}

        {activeSubTab === "notas" && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileEdit className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Historia Clínica</h3>
                <p className="text-xs text-muted-foreground">Notas médicas con historial de citas y especialidades</p>
              </div>
            </div>

            {/* Historia clínica resumida - Citas pasadas por especialidad */}
            <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-accent/5 border border-primary/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-primary" />
                <h4 className="font-semibold text-foreground">Historial de Citas por Especialidad</h4>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { especialidad: "Medicina General", citas: 8, ultimaCita: "2026-04-10", medico: "Dra. Ana María López" },
                  { especialidad: "Cardiología", citas: 3, ultimaCita: "2024-02-20", medico: "Dr. Roberto Martínez" },
                  { especialidad: "Nutrición", citas: 2, ultimaCita: "2024-06-05", medico: "Lic. Martha Jiménez" },
                ].map((hist) => (
                  <div key={hist.especialidad} className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Stethoscope className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-foreground text-sm">{hist.especialidad}</span>
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {hist.citas} citas totales
                      </p>
                      <p className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Última: {fmtFecha(hist.ultimaCita, { corto: true })}
                      </p>
                      <p className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {hist.medico}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nueva nota */}
            <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Nueva nota clínica</label>
                <textarea
                  value={nuevaNota}
                  onChange={(e) => setNuevaNota(e.target.value)}
                  rows={4}
                  className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  placeholder="Escriba sus observaciones, notas clínicas, indicaciones..."
                />
              </div>

              <button
                onClick={agregarNota}
                disabled={!nuevaNota.trim()}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
              >
                <Plus className="w-4 h-4" />
                Agregar Nota
              </button>
            </div>

            {/* Notas registradas */}
            {notas.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Notas de esta consulta ({notas.length})</p>
                <div className="space-y-2">
                  {notas.map((nota) => (
                    <div key={nota.id} className="bg-card border border-border rounded-xl p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground mb-2">{fmtFechaHora(nota.fecha)}</p>
                          <p className="text-sm text-foreground whitespace-pre-wrap">{nota.contenido}</p>
                        </div>
                        <button
                          onClick={() => eliminarNota(nota.id)}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors shrink-0"
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
                <FileEdit className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No hay notas registradas en esta consulta</p>
              </div>
            )}
          </div>
        )}

        {activeSubTab === "prescripcion" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Pill className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Prescripción Médica</h3>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
              {/* Selector de tipo de medicamento */}
              <div className="flex items-center gap-3 mb-4">
                <p className="text-sm font-medium text-foreground">Tipo:</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTipoMedicamento("comercial")}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${tipoMedicamento === "comercial"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/70"
                      }`}
                  >
                    Nombre Comercial
                  </button>
                  <button
                    onClick={() => setTipoMedicamento("principioActivo")}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${tipoMedicamento === "principioActivo"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/70"
                      }`}
                  >
                    Principio Activo
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1.5 relative md:col-span-2 lg:col-span-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    {tipoMedicamento === "comercial" ? "Nombre Comercial" : "Principio Activo"}
                  </label>
                  <input
                    type="text"
                    value={busquedaMedicamento}
                    onChange={(e) => handleBusquedaMedicamento(e.target.value)}
                    className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder={tipoMedicamento === "comercial" ? "Ej: Microgynon, Omeprazol..." : "Ej: Levonorgestrel, Omeprazol..."}
                  />
                  {sugerenciasMedicamento.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-xl shadow-lg max-h-48 overflow-y-auto">
                      {sugerenciasMedicamento.map((med) => (
                        <button
                          key={med.nombre}
                          type="button"
                          onClick={() => seleccionarMedicamento(med)}
                          className="w-full text-left px-3 py-2.5 text-sm hover:bg-muted/50 transition-colors"
                        >
                          <span className="font-medium text-foreground">{med.nombre}</span>
                          <span className="text-xs text-muted-foreground ml-2">({med.presentaciones.join(", ")})</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Dosis</label>
                  <input
                    type="text"
                    value={prescripcionForm.dosis}
                    onChange={(e) => setPrescripcionForm({ ...prescripcionForm, dosis: e.target.value })}
                    className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="500mg"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Vía</label>
                  <select
                    value={prescripcionForm.via}
                    onChange={(e) => setPrescripcionForm({ ...prescripcionForm, via: e.target.value })}
                    className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Seleccionar</option>
                    <option value="Oral">Oral</option>
                    <option value="Intramuscular">Intramuscular</option>
                    <option value="Intravenosa">Intravenosa</option>
                    <option value="Tópica">Tópica</option>
                    <option value="Inhalada">Inhalada</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Frecuencia</label>
                  <select
                    value={prescripcionForm.frecuencia}
                    onChange={(e) => setPrescripcionForm({ ...prescripcionForm, frecuencia: e.target.value })}
                    className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Seleccionar</option>
                    <option value="Cada 4 horas">Cada 4 horas</option>
                    <option value="Cada 6 horas">Cada 6 horas</option>
                    <option value="Cada 8 horas">Cada 8 horas</option>
                    <option value="Cada 12 horas">Cada 12 horas</option>
                    <option value="Cada 24 horas">Cada 24 horas</option>
                    <option value="PRN (según necesidad)">PRN</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Duración</label>
                  <select
                    value={prescripcionForm.duracion}
                    onChange={(e) => setPrescripcionForm({ ...prescripcionForm, duracion: e.target.value })}
                    className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Seleccionar</option>
                    <option value="Dosis única">Dosis única</option>
                    <option value="1 día">1 día</option>
                    <option value="3 días">3 días</option>
                    <option value="5 días">5 días</option>
                    <option value="7 días">7 días</option>
                    <option value="10 días">10 días</option>
                    <option value="14 días">14 días</option>
                    <option value="21 días">21 días</option>
                    <option value="30 días">30 días</option>
                    <option value="60 días">60 días</option>
                    <option value="90 días">90 días</option>
                    <option value="Indefinido">Indefinido</option>
                  </select>
                </div>

                <div className="space-y-1.5 md:col-span-2 lg:col-span-3">
                  <label className="text-xs font-medium text-muted-foreground">Indicaciones adicionales</label>
                  <input
                    type="text"
                    value={prescripcionForm.indicaciones}
                    onChange={(e) => setPrescripcionForm({ ...prescripcionForm, indicaciones: e.target.value })}
                    className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Tomar con alimentos, no mezclar con alcohol, etc."
                  />
                </div>
              </div>

              <button
                onClick={agregarPrescripcion}
                disabled={!prescripcionForm.medicamento || !prescripcionForm.dosis}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
              >
                <Plus className="w-4 h-4" />
                Agregar Medicamento
              </button>
            </div>

            {prescripciones.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Medicamentos prescritos ({prescripciones.length})</p>
                <div className="space-y-2">
                  {prescripciones.map((rx) => (
                    <div key={rx.id} className="bg-card border border-border rounded-xl p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <Pill className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-foreground">{rx.medicamento}</p>
                            <div className="flex flex-wrap gap-2 mt-1 text-xs text-muted-foreground">
                              <span className="px-2 py-0.5 bg-muted rounded-full">{rx.dosis}</span>
                              {rx.via && <span className="px-2 py-0.5 bg-muted rounded-full">{rx.via}</span>}
                              {rx.frecuencia && <span className="px-2 py-0.5 bg-muted rounded-full">{rx.frecuencia}</span>}
                              {rx.duracion && <span className="px-2 py-0.5 bg-muted rounded-full">{rx.duracion}</span>}
                            </div>
                            {rx.indicaciones && <p className="text-xs text-muted-foreground mt-2 italic">{rx.indicaciones}</p>}
                          </div>
                        </div>
                        <button
                          onClick={() => eliminarPrescripcion(rx.id)}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors shrink-0"
                          aria-label="Eliminar prescripción"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={handleGuardarPrescripcion}
                  disabled={guardandoPrescripcion}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed">
                  <Save className="w-4 h-4" />
                  {guardandoPrescripcion ? "Guardando..." : "Guardar Receta"}
                </button>
              </div>
            )}

            {prescripciones.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Pill className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No hay medicamentos prescritos</p>
              </div>
            )}
          </div>
        )}

        {activeSubTab === "resumen" && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileCheck className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Resumen de la Consulta</h3>
            </div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="bg-muted/50 px-5 py-3 border-b border-border">
                <h4 className="font-semibold text-foreground flex items-center gap-2 text-sm">
                  <Activity className="w-4 h-4 text-primary" />
                  Datos Clínicos
                </h4>
              </div>
              <div className="p-5">
                {(datosClinicosForm.peso || datosClinicosForm.estatura) ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {datosClinicosForm.peso && <div className="space-y-1"><p className="text-xs text-muted-foreground">Peso</p><p className="font-semibold text-foreground">{datosClinicosForm.peso} kg</p></div>}
                    {datosClinicosForm.estatura && <div className="space-y-1"><p className="text-xs text-muted-foreground">Estatura</p><p className="font-semibold text-foreground">{datosClinicosForm.estatura} cm</p></div>}
                    {datosClinicosForm.imc && <div className="space-y-1"><p className="text-xs text-muted-foreground">IMC</p><p className="font-semibold text-foreground">{datosClinicosForm.imc} <span className={`text-xs ${imcCategoria(parseFloat(datosClinicosForm.imc)).cls}`}>({imcCategoria(parseFloat(datosClinicosForm.imc)).label})</span></p></div>}
                    {datosClinicosForm.temperatura && <div className="space-y-1"><p className="text-xs text-muted-foreground">Temperatura</p><p className="font-semibold text-foreground">{datosClinicosForm.temperatura} °C</p></div>}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No se han registrado datos clínicos</p>
                )}
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden">
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
                      <div key={dx.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                        <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-lg font-mono text-sm font-semibold shrink-0">{dx.clave}</span>
                        <span className="text-sm text-foreground">{dx.descripcion}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No se han registrado diagnósticos</p>
                )}
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden">
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
                          <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase">Frecuencia</th>
                          <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase">Duración</th>
                        </tr>
                      </thead>
                      <tbody>
                        {prescripciones.map((rx) => (
                          <tr key={rx.id} className="border-b border-border last:border-0">
                            <td className="py-2 px-3 font-medium text-foreground">{rx.medicamento}</td>
                            <td className="py-2 px-3 text-foreground">{rx.dosis}</td>
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

            <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
              <button
                onClick={async () => {
                  await doctorService.createAppointment({
                    fecha: new Date().toISOString().split("T")[0],
                    hora: new Date().toTimeString().slice(0, 5),
                    motivo: soapNote.assessment || "Consulta",
                    diagnosticos: diagnosticos.map((d) => ({ clave: d.clave, descripcion: d.descripcion })),
                    prescripciones: prescripciones,
                    notas: notas.map((n) => n.contenido),
                    signosVitales: datosClinicosForm,
                  }).catch(console.error);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                <Save className="w-4 h-4" />
                Guardar Consulta
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-border text-foreground rounded-xl text-sm font-medium hover:bg-muted transition-colors">
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
              className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Quitar filtro"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

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
            <div key={fecha} className={`border rounded-2xl overflow-hidden transition-all duration-200 ${isOpen ? "border-primary/40 shadow-md" : "border-border"}`}>
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
// TAB: VISITAS DEL PACIENTE
// ─────────────────────────────────────────────

function VisitasTab({ visitas }: { visitas: Visita[] }) {
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [visitaExpandida, setVisitaExpandida] = useState<string | null>(null);

  const visitasOrdenadas = [...visitas].sort((a, b) =>
    new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );

  const visitasFiltradas = fechaFiltro
    ? visitasOrdenadas.filter((v) => v.fecha.substring(0, 10) === fechaFiltro)
    : visitasOrdenadas;

  const fechasDisponibles = Array.from(
    new Set(visitas.map((v) => v.fecha.substring(0, 10)))
  ).sort((a, b) => b.localeCompare(a));

  const toggleVisita = (id: string) => {
    setVisitaExpandida(visitaExpandida === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Historial de Visitas</h3>
            <p className="text-sm text-muted-foreground">{visitas.length} visita(s) registrada(s)</p>
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
            <option value="">Todas las visitas</option>
            {fechasDisponibles.map((f) => (
              <option key={f} value={f}>{fmtFecha(f)}</option>
            ))}
          </select>
          {fechaFiltro && (
            <button
              onClick={() => setFechaFiltro("")}
              className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Quitar filtro"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Lista de visitas */}
      {visitasFiltradas.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <ClipboardList className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-base font-medium">No hay visitas registradas</p>
          {fechaFiltro && (
            <p className="text-sm mt-2">Prueba quitando el filtro de fecha</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {visitasFiltradas.map((visita) => {
            const isExpanded = visitaExpandida === visita.id;
            const sv = visita.signosVitales;

            return (
              <div
                key={visita.id}
                className={`border rounded-2xl overflow-hidden transition-all duration-200 ${isExpanded ? "border-primary/40 shadow-md" : "border-border"
                  }`}
              >
                {/* Header de la visita */}
                <button
                  onClick={() => toggleVisita(visita.id)}
                  className="w-full text-left flex items-center justify-between gap-4 px-6 py-5 bg-card hover:bg-muted/30 transition-colors"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isExpanded ? "bg-primary/10" : "bg-muted"
                      }`}>
                      <Stethoscope className={`w-5 h-5 ${isExpanded ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-foreground">{visita.motivo}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {fmtFecha(visita.fecha, { weekday: true })}
                      </p>
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""
                    }`} />
                </button>

                {/* Contenido expandido */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-4 border-t border-border bg-card space-y-5">
                    {/* Observaciones */}
                    <div className="bg-muted/30 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="w-4 h-4 text-primary" />
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Observaciones
                        </p>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">
                        {visita.observaciones}
                      </p>
                    </div>

                    {/* Signos vitales de la visita */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Activity className="w-4 h-4 text-primary" />
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Signos Vitales Registrados
                        </p>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        <div className="bg-background border border-border rounded-xl p-3">
                          <p className="text-xs text-muted-foreground mb-1">Peso</p>
                          <p className="text-lg font-semibold text-foreground">{sv.peso} <span className="text-sm font-normal text-muted-foreground">kg</span></p>
                        </div>
                        <div className="bg-background border border-border rounded-xl p-3">
                          <p className="text-xs text-muted-foreground mb-1">Estatura</p>
                          <p className="text-lg font-semibold text-foreground">{sv.estatura} <span className="text-sm font-normal text-muted-foreground">cm</span></p>
                        </div>
                        <div className="bg-background border border-border rounded-xl p-3">
                          <p className="text-xs text-muted-foreground mb-1">Temperatura</p>
                          <p className="text-lg font-semibold text-foreground">{sv.temperatura} <span className="text-sm font-normal text-muted-foreground">°C</span></p>
                        </div>
                        <div className="bg-background border border-border rounded-xl p-3">
                          <p className="text-xs text-muted-foreground mb-1">Frec. Cardíaca</p>
                          <p className="text-lg font-semibold text-foreground">{sv.frecuenciaCardiaca} <span className="text-sm font-normal text-muted-foreground">bpm</span></p>
                        </div>
                        <div className="bg-background border border-border rounded-xl p-3">
                          <p className="text-xs text-muted-foreground mb-1">Presi��n Arterial</p>
                          <p className="text-lg font-semibold text-foreground">
                            {sv.presionSistolica}/{sv.presionDiastolica}
                            <span className="text-sm font-normal text-muted-foreground ml-1">mmHg</span>
                          </p>
                          <p className={`text-xs mt-1 ${presionCategoria(sv.presionSistolica, sv.presionDiastolica).cls}`}>
                            {presionCategoria(sv.presionSistolica, sv.presionDiastolica).label}
                          </p>
                        </div>
                        {sv.indiceMasaCorporal && (
                          <div className="bg-background border border-border rounded-xl p-3">
                            <p className="text-xs text-muted-foreground mb-1">IMC</p>
                            <p className="text-lg font-semibold text-foreground">{sv.indiceMasaCorporal.toFixed(1)}</p>
                            <p className={`text-xs mt-1 ${imcCategoria(sv.indiceMasaCorporal).cls}`}>
                              {imcCategoria(sv.indiceMasaCorporal).label}
                            </p>
                          </div>
                        )}
                        {sv.grasaCorporal && (
                          <div className="bg-background border border-border rounded-xl p-3">
                            <p className="text-xs text-muted-foreground mb-1">Grasa Corporal</p>
                            <p className="text-lg font-semibold text-foreground">{sv.grasaCorporal} <span className="text-sm font-normal text-muted-foreground">%</span></p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Botón de imprimir */}
                    <div className="flex justify-end pt-2">
                      <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-border text-foreground rounded-xl text-sm font-medium hover:bg-muted transition-colors">
                        <Printer className="w-4 h-4" />
                        Imprimir Visita
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
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

  // Local state for toggling reminders on/off
  const [recActivos, setRecActivos] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(recordatorios.map((r) => [r.id, r.activo]))
  );

  const toggleRec = (recId: string) =>
    setRecActivos((prev) => ({ ...prev, [recId]: !prev[recId] }));

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
          <div className="space-y-2 pt-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Recordatorios</p>
            <div className="flex flex-wrap gap-2">
              {recs.map((rec) => {
                const estaActivo = recActivos[rec.id] ?? rec.activo;
                return (
                  <button
                    key={rec.id}
                    onClick={() => toggleRec(rec.id)}
                    title={estaActivo ? "Desactivar recordatorio" : "Activar recordatorio"}
                    className={`inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-xl border transition-all cursor-pointer select-none ${estaActivo
                        ? "bg-primary/5 text-primary border-primary/20 hover:bg-primary/10"
                        : "bg-muted text-muted-foreground border-border hover:bg-muted/70"
                      }`}
                  >
                    {estaActivo ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                    {rec.hora}
                    <span className="text-xs opacity-60">{estaActivo ? "activo" : "inactivo"}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
        {recs.length === 0 && esActivo && (
          <p className="text-xs text-muted-foreground italic">Sin recordatorios configurados</p>
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
// PANEL: CONFIGURACIÓN
// ─────────────────────────────────────────────

type Tema = "claro" | "oscuro" | "sistema";
type TamanoTexto = "pequeno" | "normal" | "grande";

interface ConfiguracionState {
  tema: Tema;
  idioma: Idioma;
  tamanoTexto: TamanoTexto;
  notificacionesMedicamentos: boolean;
  notificacionesCitas: boolean;
  notificacionesSonido: boolean;
  mostrarEdad: boolean;
  mostrarCURP: boolean;
  impresionMembrete: boolean;
  guardadoAutomatico: boolean;
  sesionRecordada: boolean;
  nombreDoctor: string;
  especialidad: string;
  cedulaProfesional: string;
  clinica: string;
}

const configInicial: ConfiguracionState = {
  tema: "claro",
  idioma: "es",
  tamanoTexto: "normal",
  notificacionesMedicamentos: true,
  notificacionesCitas: true,
  notificacionesSonido: false,
  mostrarEdad: true,
  mostrarCURP: true,
  impresionMembrete: true,
  guardadoAutomatico: true,
  sesionRecordada: false,
  nombreDoctor: "Dra. Ana María López",
  especialidad: "Medicina General",
  cedulaProfesional: "23456789",
  clinica: "Clínica Médica Integral",
};

function Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${checked ? "bg-primary" : "bg-muted-foreground/30"}`}
    >
      <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );
}

function ConfiguracionPanel({
  open,
  onClose,
  config,
  onChange,
}: {
  open: boolean;
  onClose: () => void;
  config: ConfiguracionState;
  onChange: (next: Partial<ConfiguracionState>) => void;
}) {
  const { t } = useTranslation();
  const [seccion, setSeccion] = useState<"apariencia" | "perfil" | "notificaciones" | "expediente" | "seguridad">("apariencia");

  const inputCls = "w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors";
  const labelCls = "block text-sm font-medium text-foreground mb-1.5";
  const rowCls = "flex items-center justify-between gap-4 py-3.5 border-b border-border last:border-0";

  const secciones = [
    { id: "apariencia" as const, label: t("appearance"), icon: <Monitor className="w-4 h-4" /> },
    { id: "perfil" as const, label: t("doctorProfile"), icon: <User2 className="w-4 h-4" /> },
    { id: "notificaciones" as const, label: t("notifications"), icon: <Bell className="w-4 h-4" /> },
    { id: "expediente" as const, label: t("record"), icon: <Database className="w-4 h-4" /> },
    { id: "seguridad" as const, label: t("security"), icon: <Lock className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* backdrop */}
      {open && <div className="fixed inset-0 bg-black/40 z-50 transition-opacity" onClick={onClose} />}

      {/* slide-over */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-background border-l border-border z-50 flex flex-col shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>

        {/* header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Settings className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-foreground text-base">{t("settings")}</h2>
              <p className="text-xs text-muted-foreground">{t("customizeExperience")}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition-colors" aria-label={t("close")}>
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* sidebar nav */}
          <div className="w-44 shrink-0 border-r border-border bg-muted/20 py-3">
            {secciones.map((s) => (
              <button
                key={s.id}
                onClick={() => setSeccion(s.id)}
                className={`w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium transition-all ${seccion === s.id ? "bg-background text-foreground border-r-2 border-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"}`}
              >
                {s.icon}
                {s.label}
              </button>
            ))}
          </div>

          {/* content */}
          <div className="flex-1 overflow-y-auto px-6 py-5">

            {/* APARIENCIA */}
            {seccion === "apariencia" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{t("interfaceTheme")}</h3>
                  <p className="text-xs text-muted-foreground mb-4">{t("themeDescription")}</p>
                  <div className="grid grid-cols-3 gap-3">
                    {([
                      { id: "claro", label: t("light"), icon: <Sun className="w-5 h-5" /> },
                      { id: "oscuro", label: t("dark"), icon: <Moon className="w-5 h-5" /> },
                      { id: "sistema", label: t("system"), icon: <Laptop className="w-5 h-5" /> },
                    ] as { id: Tema; label: string; icon: React.ReactNode }[]).map((tema) => (
                      <button
                        key={tema.id}
                        onClick={() => onChange({ tema: tema.id })}
                        className={`flex flex-col items-center gap-2 py-4 rounded-2xl border-2 text-sm font-medium transition-all ${config.tema === tema.id ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30 hover:bg-muted/30"}`}
                      >
                        {tema.icon}
                        {tema.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-1">{t("textSize")}</h3>
                  <p className="text-xs text-muted-foreground mb-4">{t("textSizeDescription")}</p>
                  <div className="grid grid-cols-3 gap-3">
                    {([
                      { id: "pequeno", label: t("small") },
                      { id: "normal", label: t("normal") },
                      { id: "grande", label: t("large") },
                    ] as { id: TamanoTexto; label: string }[]).map((size) => (
                      <button
                        key={size.id}
                        onClick={() => onChange({ tamanoTexto: size.id })}
                        className={`py-3 rounded-2xl border-2 text-sm font-medium transition-all ${config.tamanoTexto === size.id ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30 hover:bg-muted/30"}`}
                      >
                        <span className={size.id === "pequeno" ? "text-xs" : size.id === "grande" ? "text-base" : "text-sm"}>{size.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-1">{t("language")}</h3>
                  <p className="text-xs text-muted-foreground mb-4">{t("languageDescription")}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {([
                      { id: "es", label: "Español" },
                      { id: "en", label: "English" },
                    ] as { id: Idioma; label: string }[]).map((l) => (
                      <button
                        key={l.id}
                        onClick={() => onChange({ idioma: l.id })}
                        className={`flex items-center justify-center gap-2 py-3 rounded-2xl border-2 text-sm font-medium transition-all ${config.idioma === l.id ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30 hover:bg-muted/30"}`}
                      >
                        <Globe className="w-4 h-4" />
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PERFIL */}
            {seccion === "perfil" && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-semibold text-foreground mb-4">{t("doctorData")}</h3>
                  <div className="space-y-4">
                    {([
                      { field: "nombreDoctor" as keyof ConfiguracionState, label: t("doctorName") },
                      { field: "especialidad" as keyof ConfiguracionState, label: t("specialty") },
                      { field: "cedulaProfesional" as keyof ConfiguracionState, label: t("medicalLicense") },
                      { field: "clinica" as keyof ConfiguracionState, label: t("clinicHospital") },
                    ]).map(({ field, label }) => (
                      <div key={field}>
                        <label className={labelCls}>{label}</label>
                        <input
                          type="text"
                          className={inputCls}
                          value={String(config[field])}
                          onChange={(e) => onChange({ [field]: e.target.value })}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-2 border-t border-border">
                  <h3 className="font-semibold text-foreground mb-4">{t("recordDisplay")}</h3>
                  <div className="space-y-1">
                    <div className={rowCls}>
                      <div>
                        <p className="text-sm font-medium text-foreground">{t("showPatientAge")}</p>
                        <p className="text-xs text-muted-foreground">{t("visibleInSidebar")}</p>
                      </div>
                      <Switch checked={config.mostrarEdad} onChange={(v) => onChange({ mostrarEdad: v })} />
                    </div>
                    <div className={rowCls}>
                      <div>
                        <p className="text-sm font-medium text-foreground">{t("showCURP")}</p>
                        <p className="text-xs text-muted-foreground">{t("visibleInPatientData")}</p>
                      </div>
                      <Switch checked={config.mostrarCURP} onChange={(v) => onChange({ mostrarCURP: v })} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* NOTIFICACIONES */}
            {seccion === "notificaciones" && (
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground mb-4">{t("notificationPreferences")}</h3>
                <div className={rowCls}>
                  <div>
                    <p className="text-sm font-medium text-foreground">{t("medicationReminders")}</p>
                    <p className="text-xs text-muted-foreground">{t("alertWhenDose")}</p>
                  </div>
                  <Switch checked={config.notificacionesMedicamentos} onChange={(v) => onChange({ notificacionesMedicamentos: v })} />
                </div>
                <div className={rowCls}>
                  <div>
                    <p className="text-sm font-medium text-foreground">{t("appointmentReminders")}</p>
                    <p className="text-xs text-muted-foreground">{t("appointmentAlerts")}</p>
                  </div>
                  <Switch checked={config.notificacionesCitas} onChange={(v) => onChange({ notificacionesCitas: v })} />
                </div>
                <div className={rowCls}>
                  <div>
                    <p className="text-sm font-medium text-foreground">{t("notificationSound")}</p>
                    <p className="text-xs text-muted-foreground">{t("playSoundOnAlert")}</p>
                  </div>
                  <Switch checked={config.notificacionesSonido} onChange={(v) => onChange({ notificacionesSonido: v })} />
                </div>
                <div className="mt-4 p-4 bg-muted/30 rounded-xl">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">{t("currentStatus")}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${config.notificacionesMedicamentos ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
                      <Pill className="w-3 h-3" />{t("medications")} {config.notificacionesMedicamentos ? t("activated") : t("deactivated")}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${config.notificacionesCitas ? "bg-blue-100 text-blue-700" : "bg-muted text-muted-foreground"}`}>
                      <Calendar className="w-3 h-3" />{t("appointments")} {config.notificacionesCitas ? t("activated") : t("deactivated")}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${config.notificacionesSonido ? "bg-amber-100 text-amber-700" : "bg-muted text-muted-foreground"}`}>
                      {config.notificacionesSonido ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                      {config.notificacionesSonido ? t("soundOn") : t("soundOff")}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* EXPEDIENTE */}
            {seccion === "expediente" && (
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground mb-4">{t("record")}</h3>
                <div className={rowCls}>
                  <div>
                    <p className="text-sm font-medium text-foreground">{t("autoSave")}</p>
                    <p className="text-xs text-muted-foreground">{t("autoSaveDescription")}</p>
                  </div>
                  <Switch checked={config.guardadoAutomatico} onChange={(v) => onChange({ guardadoAutomatico: v })} />
                </div>
                <div className={rowCls}>
                  <div>
                    <p className="text-sm font-medium text-foreground">{t("printHeader")}</p>
                    <p className="text-xs text-muted-foreground">{t("printHeaderDescription")}</p>
                  </div>
                  <Switch checked={config.impresionMembrete} onChange={(v) => onChange({ impresionMembrete: v })} />
                </div>
                <div className="mt-5 pt-4 border-t border-border space-y-3">
                  <h4 className="text-sm font-semibold text-foreground">{t("exportData")}</h4>
                  <button className="w-full flex items-center gap-3 px-4 py-3 border border-border rounded-xl text-sm text-foreground hover:bg-muted/40 transition-colors">
                    <Printer className="w-4 h-4 text-muted-foreground" />
                    {t("print")} {t("medicalRecord")}
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 border border-border rounded-xl text-sm text-foreground hover:bg-muted/40 transition-colors">
                    <Database className="w-4 h-4 text-muted-foreground" />
                    PDF {t("medicalRecord")}
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 border border-border rounded-xl text-sm text-foreground hover:bg-muted/40 transition-colors">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            )}

            {/* SEGURIDAD */}
            {seccion === "seguridad" && (
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground mb-4">{t("security")}</h3>
                <div className={rowCls}>
                  <div>
                    <p className="text-sm font-medium text-foreground">{t("rememberSession")}</p>
                    <p className="text-xs text-muted-foreground">{t("rememberSessionDescription")}</p>
                  </div>
                  <Switch checked={config.sesionRecordada} onChange={(v) => onChange({ sesionRecordada: v })} />
                </div>
                <div className="mt-5 pt-4 border-t border-border space-y-3">
                  <h4 className="text-sm font-semibold text-foreground">{t("changePassword")}</h4>
                  <div>
                    <label className={labelCls}>{config.idioma === "es" ? "Contraseña actual" : "Current password"}</label>
                    <div className="relative">
                      <input type="password" className={`${inputCls} pr-10`} placeholder="••••••••" />
                      <Eye className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>{config.idioma === "es" ? "Nueva contraseña" : "New password"}</label>
                    <div className="relative">
                      <input type="password" className={`${inputCls} pr-10`} placeholder="••••••••" />
                      <Eye className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                  <button className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">
                    <Lock className="w-4 h-4" />
                    {t("changePassword")}
                  </button>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-xl">
                    <p className="text-sm font-semibold text-destructive mb-1">Zona de peligro</p>
                    <p className="text-xs text-muted-foreground mb-3">Estas acciones son irreversibles. Procede con precaución.</p>
                    <button className="text-sm text-destructive hover:underline font-medium">Cerrar sesión en todos los dispositivos</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* footer */}
        <div className="px-6 py-4 border-t border-border shrink-0 bg-muted/20">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">MediRecord v2.0 — Expediente Digital</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Listo
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// TABS CONFIG
// ─────────────────────────────────────────────

const tabIds = ["dashboard", "datos", "signos", "citas", "consulta", "expediente", "visitas", "medicamentos"] as const;
type TabId = (typeof tabIds)[number];

function useLocalizedTabs(t: (key: TranslationKey) => string) {
  return [
    { id: "dashboard" as const, label: t("dashboard"), icon: LayoutDashboard },
    { id: "datos" as const, label: t("generalData"), icon: User },
    { id: "signos" as const, label: t("vitalSigns"), icon: Activity },
    { id: "citas" as const, label: t("appointments"), icon: Calendar },
    { id: "consulta" as const, label: t("consultation"), icon: Stethoscope },
    { id: "expediente" as const, label: t("medicalRecord"), icon: FolderOpen },
    { id: "visitas" as const, label: t("visits"), icon: ClipboardList },
    { id: "medicamentos" as const, label: t("medications"), icon: Pill },
  ];
}

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────

export default function Page() {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [leidas, setLeidas] = useState<Set<string>>(new Set());
  const [config, setConfig] = useState<ConfiguracionState>(configInicial);

  // Translation function
  const t = (key: TranslationKey) => translations[config.idioma][key];
  const tabs = useLocalizedTabs(t);

  const handleConfigChange = (next: Partial<ConfiguracionState>) => {
    setConfig((prev) => ({ ...prev, ...next }));
  };

  // Apply theme to <html> element
  useEffect(() => {
    const html = document.documentElement;
    if (config.tema === "oscuro") {
      html.classList.add("dark");
    } else if (config.tema === "claro") {
      html.classList.remove("dark");
    } else {
      // sistema
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      html.classList.toggle("dark", prefersDark);
    }
  }, [config.tema]);

  // Apply text size
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("text-sm-base", "text-base-base", "text-lg-base");
    if (config.tamanoTexto === "pequeno") html.style.fontSize = "14px";
    else if (config.tamanoTexto === "grande") html.style.fontSize = "17px";
    else html.style.fontSize = "16px";
  }, [config.tamanoTexto]);
  const paciente = pacienteMock;
  const pd = paciente.patientData;
  const genderToSexo = (g: string) => g === "male" ? "Masculino" : g === "female" ? "Femenino" : "Otro";
  const nombreCompleto = [pd.firstName, pd.lastName, pd.maternalLastName].filter(Boolean).join(" ");
  const edad = calcularEdad(pd.birthDate);

  // Build notifications from real data
  const hoy = new Date();
  const notificaciones: { id: string; tipo: "medicamento" | "cita" | "resultado"; titulo: string; descripcion: string; hora?: string }[] = [
    // Active medication reminders
    ...paciente.medicamentos
      .filter((m) => !m.fechaFin || new Date(m.fechaFin) >= hoy)
      .flatMap((m) =>
        paciente.recordatorios
          .filter((r) => r.medicamentoId === m.id && r.activo)
          .map((r) => ({
            id: `rec-${r.id}`,
            tipo: "medicamento" as const,
            titulo: m.nombre,
            descripcion: `${m.dosis} — ${m.frecuencia}`,
            hora: r.hora,
          }))
      ),
    // Upcoming appointments
    ...paciente.citas
      .filter((c) => c.estado === "Confirmada" || c.estado === "Pendiente")
      .map((c) => ({
        id: `cit-${c.id}`,
        tipo: "cita" as const,
        titulo: c.motivo,
        descripcion: `${fmtFecha(c.fecha, { corto: true })} ${config.idioma === "es" ? "a las" : "at"} ${c.hora}`,
        hora: undefined,
      })),
    // Latest diagnosis / result
    ...(paciente.diagnosticos.slice(-1).map((d) => ({
      id: `dx-${d.id}`,
      tipo: "resultado" as const,
      titulo: t("lastDiagnosis"),
      descripcion: d.descripcion,
      hora: undefined,
    }))),
  ];

  const sinLeer = notificaciones.filter((n) => !leidas.has(n.id));

  const marcarTodas = () => setLeidas(new Set(notificaciones.map((n) => n.id)));
  const marcarUna = (id: string) => setLeidas((prev) => new Set([...prev, id]));

  //Cerrar sesión

  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem("rol");
    localStorage.removeItem("token");
    sessionStorage.clear();
    router.replace("/login");
  };

  return (
    <LanguageContext.Provider value={{ idioma: config.idioma, t }}>
      <div className="min-h-screen bg-background font-sans">
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-sidebar-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-sidebar-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-sidebar-foreground tracking-tight">{t("appName")}</h1>
                  <p className="text-xs text-sidebar-foreground/60">{t("appSubtitle")}</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => {
                    setActiveTab(id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === id
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
                <span className="text-xs text-sidebar-foreground/40 font-medium">{t("theme")}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleConfigChange({ tema: "claro" })}
                    className={`p-1.5 rounded-lg transition-colors ${config.tema === "claro" ? "bg-sidebar-accent text-sidebar-foreground" : "text-sidebar-foreground/40 hover:text-sidebar-foreground"}`}
                    aria-label={t("light")}
                  >
                    <Sun className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleConfigChange({ tema: "sistema" })}
                    className={`p-1.5 rounded-lg transition-colors ${config.tema === "sistema" ? "bg-sidebar-accent text-sidebar-foreground" : "text-sidebar-foreground/40 hover:text-sidebar-foreground"}`}
                    aria-label={t("system")}
                  >
                    <Monitor className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleConfigChange({ tema: "oscuro" })}
                    className={`p-1.5 rounded-lg transition-colors ${config.tema === "oscuro" ? "bg-sidebar-accent text-sidebar-foreground" : "text-sidebar-foreground/40 hover:text-sidebar-foreground"}`}
                    aria-label={t("dark")}
                  >
                    <Moon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <button
                onClick={() => { setConfigOpen(true); setSidebarOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all"
              >
                <Settings className="w-5 h-5" />
                {t("settings")}
                <ChevronRightIcon className="w-4 h-4 ml-auto opacity-50" />
              </button>
            </div>
          </div>
        </aside>

        <div className="lg:ml-72">
          <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border px-4 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-xl hover:bg-muted transition-colors"
                  aria-label={t("openMenu")}
                >
                  <Menu className="w-6 h-6" />
                </button>
                <div>
                  <h1 className="text-xl font-bold text-foreground">{tabs.find(tab => tab.id === activeTab)?.label}</h1>
                  <p className="text-sm text-muted-foreground hidden sm:block">
                    {t("patientFile")} {pd.firstName} {pd.lastName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Notification bell */}
                <div className="relative">
                  <button
                    onClick={() => setNotifOpen((o) => !o)}
                    className="relative p-2 rounded-xl hover:bg-muted transition-colors"
                    aria-label={t("notifications")}
                  >
                    <Bell className="w-5 h-5 text-muted-foreground" />
                    {sinLeer.length > 0 && (
                      <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-destructive text-[10px] font-bold text-white rounded-full flex items-center justify-center leading-none">
                        {sinLeer.length > 9 ? "9+" : sinLeer.length}
                      </span>
                    )}
                  </button>

                  {notifOpen && (
                    <>
                      {/* backdrop */}
                      <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                      {/* panel */}
                      <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-card border border-border rounded-2xl shadow-2xl shadow-black/10 z-50 overflow-hidden">
                        {/* header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                          <div className="flex items-center gap-2">
                            <Bell className="w-4 h-4 text-primary" />
                            <span className="font-semibold text-foreground text-sm">{t("notificationsTitle")}</span>
                            {sinLeer.length > 0 && (
                              <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                                {sinLeer.length} {t("newNotifications")}
                              </span>
                            )}
                          </div>
                          {sinLeer.length > 0 && (
                            <button
                              onClick={marcarTodas}
                              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {t("markAllAsRead")}
                            </button>
                          )}
                        </div>

                        {/* list */}
                        <div className="max-h-[420px] overflow-y-auto divide-y divide-border">
                          {notificaciones.length === 0 && (
                            <div className="px-5 py-10 text-center text-muted-foreground text-sm">
                              {t("noNotifications")}
                            </div>
                          )}
                          {notificaciones.map((n) => {
                            const esLeida = leidas.has(n.id);
                            const iconMap = {
                              medicamento: <Pill className="w-4 h-4 text-emerald-600" />,
                              cita: <Calendar className="w-4 h-4 text-primary" />,
                              resultado: <FileText className="w-4 h-4 text-amber-500" />,
                            };
                            const bgMap = {
                              medicamento: "bg-emerald-100",
                              cita: "bg-primary/10",
                              resultado: "bg-amber-100",
                            };
                            return (
                              <button
                                key={n.id}
                                onClick={() => marcarUna(n.id)}
                                className={`w-full text-left flex items-start gap-4 px-5 py-4 hover:bg-muted/50 transition-colors ${esLeida ? "opacity-60" : ""}`}
                              >
                                <div className={`w-9 h-9 rounded-xl ${bgMap[n.tipo]} flex items-center justify-center shrink-0 mt-0.5`}>
                                  {iconMap[n.tipo]}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2">
                                    <p className={`text-sm font-medium text-foreground truncate ${!esLeida ? "font-semibold" : ""}`}>
                                      {n.titulo}
                                    </p>
                                    {n.hora && (
                                      <span className="text-xs text-muted-foreground shrink-0 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />{n.hora}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.descripcion}</p>
                                </div>
                                {!esLeida && (
                                  <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* footer */}
                        <div className="px-5 py-3 border-t border-border bg-muted/30">
                          <button
                            onClick={() => { setActiveTab("medicamentos"); setNotifOpen(false); }}
                            className="text-xs text-primary hover:underline"
                          >
                            {t("viewAllReminders")}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-3 pl-3 border-l border-border">
                  <AvatarPaciente nombre={nombreCompleto} sexo={genderToSexo(pd.gender)} size={48} animated={true} />
                  <div className="hidden sm:block flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{nombreCompleto}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{edad} años</span>

                      {paciente.alergias.length > 0 && (
                        <>
                          <span className="text-xs text-muted-foreground">•</span>

                          {/* Dropdown de Alergias */}
                          <div className="relative group">
                            <button className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-red-50 border border-red-200 hover:bg-red-100 transition-colors group-hover:shadow-md">
                              <AlertTriangle className="w-3 h-3 text-red-600" />
                              <span className="text-xs font-semibold text-red-700">
                                {paciente.alergias.length}
                              </span>
                              <ChevronDown className="w-2.5 h-2.5 text-red-600 group-hover:rotate-180 transition-transform" />
                            </button>

                            {/* Panel desplegable */}
                            <div className="absolute right-0 top-full mt-1 w-[520px] bg-card border border-border rounded-xl shadow-lg shadow-black/10 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right">
                              {/* Header compacto */}
                              <div className="px-3 py-2 border-b border-border bg-muted/30">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                  Alergias ({paciente.alergias.length})
                                </p>
                              </div>

                              {/* Lista horizontal con scroll */}
                              <div className="p-3">
                                <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-hide">
                                  {/* Agrupar alergias por tipo */}
                                  {Object.entries(
                                    paciente.alergias.reduce((acc, alergia) => {
                                      if (!acc[alergia.tipo]) {
                                        acc[alergia.tipo] = [];
                                      }
                                      acc[alergia.tipo].push(alergia);
                                      return acc;
                                    }, {} as Record<string, Alergia[]>)
                                  ).map(([tipo, alergias]) => {
                                    const tipoIconos: Record<string, { icon: string; bg: string; border: string; text: string }> = {
                                      Medicamento: { icon: "💊", bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700" },
                                      Alimento: { icon: "🍽️", bg: "bg-green-50", border: "border-green-200", text: "text-green-700" },
                                      Ambiental: { icon: "🌿", bg: "bg-teal-50", border: "border-teal-200", text: "text-teal-700" },
                                      Material: { icon: "🧤", bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700" },
                                      Otro: { icon: "⚠️", bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-700" },
                                    };
                                    const tipoConfig = tipoIconos[tipo] || tipoIconos["Otro"];

                                    return (
                                      <div
                                        key={tipo}
                                        className={`flex-shrink-0 ${tipoConfig.bg} border ${tipoConfig.border} rounded-lg p-2.5 transition-all hover:shadow-sm min-w-max`}
                                      >
                                        <div className="space-y-1.5">
                                          {/* Encabezado del tipo - más compacto */}
                                          <div className="flex items-center gap-1.5">
                                            <span className="text-base">{tipoConfig.icon}</span>
                                            <h4 className={`text-xs font-bold ${tipoConfig.text}`}>{tipo}</h4>
                                            {alergias.length > 1 && (
                                              <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${tipoConfig.bg} ${tipoConfig.text} border ${tipoConfig.border}`}>
                                                {alergias.length}
                                              </span>
                                            )}
                                          </div>

                                          {/* Lista de alergias del tipo - compacta */}
                                          <div className="space-y-1 pl-5">
                                            {alergias.map((alergia) => {
                                              const severidadDot: Record<string, string> = {
                                                Grave: "bg-red-500",
                                                Moderada: "bg-orange-500",
                                                Leve: "bg-amber-500",
                                              };

                                              return (
                                                <div key={alergia.id} className="flex items-center gap-1.5">
                                                  <div className={`w-1.5 h-1.5 rounded-full ${severidadDot[alergia.severidad]}`} />
                                                  <span className="text-xs text-foreground font-medium">
                                                    {alergia.descripcion}
                                                  </span>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Footer compacto */}
                              <div className="px-3 py-1.5 border-t border-border/50 bg-muted/20 rounded-b-xl">
                                <p className="text-xs text-muted-foreground">⚠️ Revisar antes de prescribir</p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {paciente.alergias.length === 0 && (
                        <span className="text-xs text-emerald-600 font-medium">Sin alergias</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="p-4 lg:p-8 max-w-7xl">
            {activeTab === "dashboard" && paciente.dashboard && <DashboardTab dashboard={paciente.dashboard} />}
            {activeTab === "datos" && <DatosGeneralesTab patientData={paciente.patientData} />}
            {activeTab === "signos" && <SignosVitalesTab signosVitales={paciente.signosVitales} />}
            {activeTab === "citas" && <CitasTab />}
            {activeTab === "consulta" && <ConsultaTab />}
            {activeTab === "expediente" && <ExpedienteTab diagnosticos={paciente.diagnosticos} citas={paciente.citas} notas={paciente.notas} />}
            {activeTab === "visitas" && <VisitasTab visitas={paciente.visitas} />}
            {activeTab === "medicamentos" && <MedicamentosTab medicamentos={paciente.medicamentos} recordatorios={paciente.recordatorios} />}

          </main>
        </div>

        <ConfiguracionPanel
          open={configOpen}
          onClose={() => setConfigOpen(false)}
          config={config}
          onChange={handleConfigChange}
        />
      </div>
    </LanguageContext.Provider>
  );
}
