"use client";

import React, { useState, useEffect } from "react";
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
  Baby,
  Syringe,
  ShieldCheck,
  Sun,
  Moon,
  Monitor,
  Globe,
  Lock,
  Printer,
  Database,
  Eye,
  EyeOff,
  User2,
  Languages,
  Volume2,
  VolumeX,
  Laptop,
} from "lucide-react";

const ChevronRightIcon = ChevronRight;

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
    medications: "Medicamentos",
    gynecology: "Ginecología",
    
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
    visits: "Visitas",
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
    
    // Gynecology
    gynecologicalHistory: "Historia ginecológica",
    saveGynecologicalHistory: "Guardar historia ginecológica",
    printHistory: "Imprimir historia",
    savedSuccessfully: "Guardado correctamente",
    menarche: "Menarquia",
    menstrualCycle: "Ciclo menstrual",
    lastMenstrualPeriod: "Última menstruación",
    sexualActivity: "Actividad sexual",
    pregnancies: "Gestaciones",
    deliveries: "Partos",
    cesareans: "Cesáreas",
    abortions: "Abortos",
    livingChildren: "Hijos vivos",
    contraceptive: "Anticonceptivo",
    lastPap: "Último Papanicolaou",
    lastMammogram: "Última mamografía",
    
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
    visits: "Visits",
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

interface CitaAgendada {
  id: string;
  fecha: string;
  horaInicio: string;
  horaCierre: string;
  tipo: "cita" | "urgencia";
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

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────

const pacienteMock: Paciente = {
  id: "PAC-001",
  datosPersonales: {
    id: "DP-001",
    nombre: "María Fernanda",
    apellidoPaterno: "González",
    apellidoMaterno: "Martínez",
    fechaNacimiento: "1992-03-15",
    sexo: "Femenino",
    curp: "GOMF920315MDFRRT01",
    rfc: "GOMF920315AB1",
  },
  direccion: {
    calle: "Av. Paseo de la Reforma",
    numeroExterior: "505",
    numeroInterior: "12A",
    colonia: "Cuauhtémoc",
    ciudad: "Ciudad de México",
    estado: "CDMX",
    codigoPostal: "06500",
    pais: "México",
  },
  contacto: {
    telefono: "55 8765 4321",
    telefonoEmergencia: "55 1234 5678",
    email: "maria.gonzalez@email.com",
    nombreContactoEmergencia: "Roberto González (Padre)",
  },
  datosFiscales: {
    razonSocial: "María Fernanda González Martínez",
    rfc: "GOMF920315AB1",
    usoCFDI: "G03 - Gastos en general",
    regimenFiscal: "612 - Personas Físicas con Actividades Empresariales",
  },
  signosVitales: [
    { id: "SV-001", fecha: "2023-06-10T09:00:00Z", peso: 64.0, estatura: 165, temperatura: 36.4, frecuenciaCardiaca: 72, presionSistolica: 118, presionDiastolica: 75, grasaCorporal: 24.0, indiceMasaCorporal: 23.5 },
    { id: "SV-002", fecha: "2023-09-18T10:30:00Z", peso: 63.2, estatura: 165, temperatura: 36.5, frecuenciaCardiaca: 70, presionSistolica: 114, presionDiastolica: 73, grasaCorporal: 23.1, indiceMasaCorporal: 23.2 },
    { id: "SV-003", fecha: "2024-01-15T09:30:00Z", peso: 62.5, estatura: 165, temperatura: 36.4, frecuenciaCardiaca: 68, presionSistolica: 115, presionDiastolica: 72, grasaCorporal: 22.5, indiceMasaCorporal: 22.9 },
    { id: "SV-004", fecha: "2024-02-20T10:00:00Z", peso: 61.8, estatura: 165, temperatura: 36.5, frecuenciaCardiaca: 70, presionSistolica: 112, presionDiastolica: 70, grasaCorporal: 21.8, indiceMasaCorporal: 22.7 },
    { id: "SV-005", fecha: "2024-03-10T11:15:00Z", peso: 61.2, estatura: 165, temperatura: 36.6, frecuenciaCardiaca: 66, presionSistolica: 110, presionDiastolica: 68, grasaCorporal: 21.2, indiceMasaCorporal: 22.5 },
    { id: "SV-006", fecha: "2024-06-05T09:00:00Z", peso: 63.5, estatura: 165, temperatura: 36.7, frecuenciaCardiaca: 76, presionSistolica: 116, presionDiastolica: 74, grasaCorporal: 22.0, indiceMasaCorporal: 23.3 },
    { id: "SV-007", fecha: "2024-09-12T10:00:00Z", peso: 65.0, estatura: 165, temperatura: 36.5, frecuenciaCardiaca: 78, presionSistolica: 118, presionDiastolica: 76, grasaCorporal: 22.8, indiceMasaCorporal: 23.9 },
    { id: "SV-008", fecha: "2024-12-03T09:30:00Z", peso: 64.2, estatura: 165, temperatura: 36.4, frecuenciaCardiaca: 69, presionSistolica: 113, presionDiastolica: 71, grasaCorporal: 22.3, indiceMasaCorporal: 23.6 },
    { id: "SV-009", fecha: "2025-03-08T10:00:00Z", peso: 63.0, estatura: 165, temperatura: 36.6, frecuenciaCardiaca: 67, presionSistolica: 111, presionDiastolica: 69, grasaCorporal: 21.5, indiceMasaCorporal: 23.1 },
    { id: "SV-010", fecha: "2025-06-20T09:15:00Z", peso: 62.8, estatura: 165, temperatura: 36.5, frecuenciaCardiaca: 71, presionSistolica: 112, presionDiastolica: 70, grasaCorporal: 21.3, indiceMasaCorporal: 23.0 },
    { id: "SV-011", fecha: "2025-10-14T10:30:00Z", peso: 63.5, estatura: 165, temperatura: 36.3, frecuenciaCardiaca: 68, presionSistolica: 110, presionDiastolica: 68, grasaCorporal: 21.0, indiceMasaCorporal: 23.3 },
    { id: "SV-012", fecha: "2026-01-20T09:00:00Z", peso: 62.3, estatura: 165, temperatura: 36.6, frecuenciaCardiaca: 65, presionSistolica: 109, presionDiastolica: 67, grasaCorporal: 20.8, indiceMasaCorporal: 22.9 },
    { id: "SV-013", fecha: "2026-04-10T10:00:00Z", peso: 62.0, estatura: 165, temperatura: 36.5, frecuenciaCardiaca: 67, presionSistolica: 110, presionDiastolica: 68, grasaCorporal: 20.5, indiceMasaCorporal: 22.8 },
  ],
  citas: [
    { id: "CIT-001", pacienteId: "PAC-001", fecha: "2023-06-10", hora: "09:00", motivo: "Revisión ginecológica anual", estado: "Completada", notas: "Examen pélvico normal. Papanicolaou realizado. Colposcopia diferida para siguiente ciclo." },
    { id: "CIT-002", pacienteId: "PAC-001", fecha: "2023-09-18", hora: "10:30", motivo: "Resultado Papanicolaou y colposcopia", estado: "Completada", notas: "Resultado Pap: LEIBG (lesión escamosa intraepitelial de bajo grado). Colposcopia: zona de transformación tipo 1 visible. Biopsia tomada." },
    { id: "CIT-003", pacienteId: "PAC-001", fecha: "2024-01-15", hora: "09:00", motivo: "Control seguimiento CIN I", estado: "Completada", notas: "Biopsia confirma NIC I. Conducta expectante. Citología en 6 meses." },
    { id: "CIT-004", pacienteId: "PAC-001", fecha: "2024-06-05", hora: "09:00", motivo: "Citología de control — 6 meses", estado: "Completada", notas: "Citología NILM (negativa para lesión intraepitelial). Excelente respuesta. Control anual." },
    { id: "CIT-005", pacienteId: "PAC-001", fecha: "2024-09-12", hora: "10:00", motivo: "Asesoría anticonceptiva", estado: "Completada", notas: "Paciente solicita cambio de método anticonceptivo. Se prescribe píldora de baja dosis (Levonorgestrel/Etinilestradiol 0.15/0.03 mg). Se orienta sobre uso correcto y efectos secundarios." },
    { id: "CIT-006", pacienteId: "PAC-001", fecha: "2024-12-03", hora: "09:30", motivo: "Dismenorrea severa — Valoración", estado: "Completada", notas: "Paciente refiere dolor pélvico cíclico 8/10 desde hace 3 meses. Se solicita ultrasonido pélvico transvaginal y laparoscopia diagnóstica. Sospecha de endometriosis." },
    { id: "CIT-007", pacienteId: "PAC-001", fecha: "2025-03-08", hora: "10:00", motivo: "Resultados laparoscopia — Diagnóstico endometriosis estadio II", estado: "Completada", notas: "Laparoscopia confirma endometriosis estadio II (clasificación AFS revisada). Focos en ovario izquierdo y ligamentos uterosacros. Se realizó vaporización láser de focos. Inicio de tratamiento hormonal." },
    { id: "CIT-008", pacienteId: "PAC-001", fecha: "2025-06-20", hora: "09:15", motivo: "Control endometriosis — 3 meses post cirugía", estado: "Completada", notas: "Paciente refiere mejoría significativa del dolor (EVA 3/10). Continúa con dienogest 2mg/día. Ultrasonido sin evidencia de endometriomas. Control en 3 meses." },
    { id: "CIT-009", pacienteId: "PAC-001", fecha: "2025-10-14", hora: "10:30", motivo: "Control endometriosis y revisión anticonceptiva", estado: "Completada", notas: "Sin dolor intermenstrual. Ciclos regulares bajo tratamiento. Se decide continuar dienogest. Se solicita perfil hormonal y AMH para valoración de fertilidad futura." },
    { id: "CIT-010", pacienteId: "PAC-001", fecha: "2026-01-20", hora: "09:00", motivo: "Resultados perfil hormonal — Asesoría de fertilidad", estado: "Completada", notas: "AMH 2.8 ng/mL (reserva ovárica normal para edad). FSH 6.5 mUI/mL. LH 4.2 mUI/mL. Estradiol 42 pg/mL. Se orienta sobre opciones de preservación de fertilidad ante diagnóstico de endometriosis." },
    { id: "CIT-011", pacienteId: "PAC-001", fecha: "2026-04-10", hora: "10:00", motivo: "Control prenatal — 8 semanas de gestación", estado: "Completada", notas: "Embarazo de 8 semanas confirmado por ultrasonido. Embrión con actividad cardíaca positiva. FCF: 172 lpm. Se inicia protocolo prenatal completo." },
    { id: "CIT-012", pacienteId: "PAC-001", fecha: "2026-04-24", hora: "10:30", motivo: "Control prenatal — 10 semanas", estado: "Confirmada" },
    { id: "CIT-013", pacienteId: "PAC-001", fecha: "2026-05-15", hora: "16:00", motivo: "Ultrasonido estructural del primer trimestre", estado: "Pendiente" },
    { id: "CIT-014", pacienteId: "PAC-001", fecha: "2026-06-08", hora: "09:00", motivo: "Control prenatal — 16 semanas + Amniocentesis", estado: "Pendiente" },
  ],
  visitas: [
    {
      id: "VIS-001", pacienteId: "PAC-001", fecha: "2023-06-10T09:00:00Z", motivo: "Revisión ginecológica anual",
      observaciones: "Examen físico sin alteraciones. Mamas simétricas sin nódulos palpables. Abdomen blando depresible. Genitales externos normales. Especuloscopia: cérvix sin lesiones visibles. Papanicolaou tomado. Se orienta sobre prevención de ITS y uso de anticonceptivos de barrera.",
      signosVitales: { id: "SV-001", fecha: "2023-06-10T09:00:00Z", peso: 64.0, estatura: 165, temperatura: 36.4, frecuenciaCardiaca: 72, presionSistolica: 118, presionDiastolica: 75, grasaCorporal: 24.0, indiceMasaCorporal: 23.5 },
    },
    {
      id: "VIS-002", pacienteId: "PAC-001", fecha: "2023-09-18T10:30:00Z", motivo: "Resultado Papanicolaou y colposcopia",
      observaciones: "Se informa resultado Pap LEIBG. Colposcopia: zona de transformación tipo 1. Se toman 2 biopsias dirigidas en horario 6 y 9. Paciente tolera procedimiento sin complicaciones. Se indica abstinencia sexual por 1 semana y vigilancia de sangrado.",
      signosVitales: { id: "SV-002", fecha: "2023-09-18T10:30:00Z", peso: 63.2, estatura: 165, temperatura: 36.5, frecuenciaCardiaca: 70, presionSistolica: 114, presionDiastolica: 73, grasaCorporal: 23.1, indiceMasaCorporal: 23.2 },
    },
    {
      id: "VIS-003", pacienteId: "PAC-001", fecha: "2024-01-15T09:30:00Z", motivo: "Control seguimiento NIC I y revisión prenatal",
      observaciones: "Biopsia confirma neoplasia intraepitelial cervical grado I (NIC I). Prueba VPH positiva para genotipo 31. Conducta expectante con citología en 6 meses. Paciente ansiosa, se brinda apoyo emocional. Inicio de suplementación prenatal: ácido fólico 5mg y sulfato ferroso.",
      signosVitales: { id: "SV-003", fecha: "2024-01-15T09:30:00Z", peso: 62.5, estatura: 165, temperatura: 36.4, frecuenciaCardiaca: 68, presionSistolica: 115, presionDiastolica: 72, grasaCorporal: 22.5, indiceMasaCorporal: 22.9 },
    },
    {
      id: "VIS-004", pacienteId: "PAC-001", fecha: "2024-02-20T10:00:00Z", motivo: "Seguimiento nutricional y vitamina D",
      observaciones: "Mejoría notable en hábitos alimenticios. Déficit de vitamina D corregido parcialmente (25-OH vitamina D: 28 ng/mL, meta >30). Se ajusta dosis de vitamina D3 a 4000 UI diarias por 8 semanas adicionales. Paciente en buen estado de ánimo.",
      signosVitales: { id: "SV-004", fecha: "2024-02-20T10:00:00Z", peso: 61.8, estatura: 165, temperatura: 36.5, frecuenciaCardiaca: 70, presionSistolica: 112, presionDiastolica: 70, grasaCorporal: 21.8, indiceMasaCorporal: 22.7 },
    },
    {
      id: "VIS-005", pacienteId: "PAC-001", fecha: "2024-06-05T09:00:00Z", motivo: "Citología de control a los 6 meses",
      observaciones: "Citología NILM. Regresión espontánea de NIC I. Excelente evolución. Control anual. Se orienta sobre vacuna VPH nonavalente, se aplica primera dosis.",
      signosVitales: { id: "SV-005", fecha: "2024-06-05T09:00:00Z", peso: 63.5, estatura: 165, temperatura: 36.7, frecuenciaCardiaca: 76, presionSistolica: 116, presionDiastolica: 74, grasaCorporal: 22.0, indiceMasaCorporal: 23.3 },
    },
    {
      id: "VIS-006", pacienteId: "PAC-001", fecha: "2024-09-12T10:00:00Z", motivo: "Asesoría anticonceptiva",
      observaciones: "Paciente solicita método hormonal de alta eficacia. Se descutan anticonceptivos orales combinados, parche, anillo vaginal y DIU hormonal. Se elige ACO combinada de baja dosis. Se prescribe Microgynon (levonorgestrel 0.15mg/etinilestradiol 0.03mg) por 6 meses inicialmente.",
      signosVitales: { id: "SV-006", fecha: "2024-09-12T10:00:00Z", peso: 65.0, estatura: 165, temperatura: 36.5, frecuenciaCardiaca: 78, presionSistolica: 118, presionDiastolica: 76, grasaCorporal: 22.8, indiceMasaCorporal: 23.9 },
    },
    {
      id: "VIS-007", pacienteId: "PAC-001", fecha: "2024-12-03T09:30:00Z", motivo: "Dismenorrea severa — Primera valoración",
      observaciones: "Paciente refiere dismenorrea EVA 8/10, diarrea y náuseas durante el primer día del ciclo. Dolor pélvico intermenstrual leve. Dispareunia profunda ocasional. Exploración: útero en retroversión, movilización dolorosa. Anexos con resistencia en fondo de saco. Alta sospecha clínica de endometriosis. Se solicita eco TV y laparoscopia diagnóstica.",
      signosVitales: { id: "SV-007", fecha: "2024-12-03T09:30:00Z", peso: 64.2, estatura: 165, temperatura: 36.4, frecuenciaCardiaca: 69, presionSistolica: 113, presionDiastolica: 71, grasaCorporal: 22.3, indiceMasaCorporal: 23.6 },
    },
    {
      id: "VIS-008", pacienteId: "PAC-001", fecha: "2025-03-08T10:00:00Z", motivo: "Diagnóstico endometriosis — Resultados laparoscopia",
      observaciones: "Laparoscopia confirma endometriosis estadio II. Implantes peritoneales en ovario izquierdo (endometrioma 2.1 cm), ligamentos uterosacros bilaterales y fondo de saco de Douglas. Se realizó vaporización CO2 de focos superficiales y drenaje de endometrioma. Inicio: dienogest 2mg/día.",
      signosVitales: { id: "SV-008", fecha: "2025-03-08T10:00:00Z", peso: 63.0, estatura: 165, temperatura: 36.6, frecuenciaCardiaca: 67, presionSistolica: 111, presionDiastolica: 69, grasaCorporal: 21.5, indiceMasaCorporal: 23.1 },
    },
    {
      id: "VIS-009", pacienteId: "PAC-001", fecha: "2025-06-20T09:15:00Z", motivo: "Control endometriosis — 3 meses post cirugía",
      observaciones: "Paciente refiere mejoría notable: dismenorrea EVA 3/10. Sin dispareunia. Sangrado escaso bajo dienogest. Eco TV: ovario izquierdo sin endometrioma visible. Fondo de saco libre. Se indica continuar dienogest y cita en 3 meses.",
      signosVitales: { id: "SV-009", fecha: "2025-06-20T09:15:00Z", peso: 62.8, estatura: 165, temperatura: 36.5, frecuenciaCardiaca: 71, presionSistolica: 112, presionDiastolica: 70, grasaCorporal: 21.3, indiceMasaCorporal: 23.0 },
    },
    {
      id: "VIS-010", pacienteId: "PAC-001", fecha: "2025-10-14T10:30:00Z", motivo: "Control endometriosis y asesoría de fertilidad",
      observaciones: "Sin sintomatología pélvica activa. Ciclos regulares bajo progestágeno. Se solicita perfil hormonal reproductivo (FSH, LH, estradiol, AMH) para valorar reserva ovárica. Se orienta sobre opciones de fertilización in vitro preventiva.",
      signosVitales: { id: "SV-010", fecha: "2025-10-14T10:30:00Z", peso: 63.5, estatura: 165, temperatura: 36.3, frecuenciaCardiaca: 68, presionSistolica: 110, presionDiastolica: 68, grasaCorporal: 21.0, indiceMasaCorporal: 23.3 },
    },
    {
      id: "VIS-011", pacienteId: "PAC-001", fecha: "2026-01-20T09:00:00Z", motivo: "Resultados perfil hormonal y asesoría reproductiva",
      observaciones: "Perfil hormonal dentro de parámetros normales para la edad. AMH 2.8 ng/mL indica reserva ovárica adecuada. Se orienta sobre criopreservación de ovocitos como opción de preservación de fertilidad. Paciente refiere deseo de embarazo en el corto plazo, se inicia seguimiento para concepción.",
      signosVitales: { id: "SV-011", fecha: "2026-01-20T09:00:00Z", peso: 62.3, estatura: 165, temperatura: 36.6, frecuenciaCardiaca: 65, presionSistolica: 109, presionDiastolica: 67, grasaCorporal: 20.8, indiceMasaCorporal: 22.9 },
    },
    {
      id: "VIS-012", pacienteId: "PAC-001", fecha: "2026-04-10T10:00:00Z", motivo: "Primera consulta prenatal — 8 SDG",
      observaciones: "Embarazo de 8.2 semanas por FUM y ultrasonido. Embrión único, FCF 172 lpm, CRL 16.2 mm. Saco gestacional y vitelino normales. Se inicia protocolo prenatal: ácido fólico, vitaminas prenatales, calcio. Se solicita BHC, glucosa, tipo y Rh, VDRL, VIH, hepatitis B, TSH, urocultivo, cultivo vaginal. Próxima cita 10 SDG.",
      signosVitales: { id: "SV-012", fecha: "2026-04-10T10:00:00Z", peso: 62.0, estatura: 165, temperatura: 36.5, frecuenciaCardiaca: 67, presionSistolica: 110, presionDiastolica: 68, grasaCorporal: 20.5, indiceMasaCorporal: 22.8 },
    },
  ],
  diagnosticos: [
    { id: "DX-001", pacienteId: "PAC-001", fecha: "2023-06-10", descripcion: "Revisión ginecológica anual normal (Z01.4)", tratamiento: "Continuación de medidas preventivas. Papanicolaou anual. Mastografía a los 40 años. Suplementación con ácido fólico 400 mcg/día.", severidad: "Leve" },
    { id: "DX-002", pacienteId: "PAC-001", fecha: "2023-09-18", descripcion: "Lesión Escamosa Intraepitelial de Bajo Grado (LEIBG) — VPH genotipo 31", tratamiento: "Conducta expectante. Citología de control en 6 meses. Abstención de relaciones sexuales sin protección. Vacuna VPH nonavalente.", severidad: "Leve" },
    { id: "DX-003", pacienteId: "PAC-001", fecha: "2024-01-15", descripcion: "Neoplasia Intraepitelial Cervical grado I (NIC I)", tratamiento: "Seguimiento estricto. Citología cervical cada 6 meses. Colposcopia en caso de progresión. Primera dosis de vacuna VPH nonavalente.", severidad: "Leve" },
    { id: "DX-004", pacienteId: "PAC-001", fecha: "2024-02-20", descripcion: "Deficiencia de vitamina D (E55.9)", tratamiento: "Vitamina D3 4000 UI diarias por 8 semanas. Exposición solar moderada 20 min/día. Control sérico en 8 semanas.", severidad: "Leve" },
    { id: "DX-005", pacienteId: "PAC-001", fecha: "2024-06-05", descripcion: "Citología cervical negativa para lesión intraepitelial (NILM) — Regresión NIC I", tratamiento: "Alta de seguimiento especial. Citología anual de rutina. Segunda dosis vacuna VPH nonavalente.", severidad: "Leve" },
    { id: "DX-006", pacienteId: "PAC-001", fecha: "2024-12-03", descripcion: "Dismenorrea severa con sospecha de endometriosis (N80.9)", tratamiento: "Antiinflamatorios AINEs durante menstruación (naproxeno 500mg c/8h). Solicitud de ultrasonido pélvico transvaginal y laparoscopia diagnóstica. Diario de dolor.", severidad: "Moderado" },
    { id: "DX-007", pacienteId: "PAC-001", fecha: "2025-03-08", descripcion: "Endometriosis estadio II — Ovario izquierdo y ligamentos uterosacros (N80.1)", tratamiento: "Laparoscopia quirúrgica completada (vaporización CO2). Dienogest 2 mg/día de forma continua. Control ecográfico trimestral. Analgesia: ibuprofeno 400mg PRN.", severidad: "Moderado" },
    { id: "DX-008", pacienteId: "PAC-001", fecha: "2025-06-20", descripcion: "Endometriosis en remisión bajo tratamiento hormonal (N80.1)", tratamiento: "Continuar dienogest 2mg/día. Eco TV de control trimestral. Evaluar suspensión de tratamiento ante deseo gestacional.", severidad: "Leve" },
    { id: "DX-009", pacienteId: "PAC-001", fecha: "2025-10-14", descripcion: "Seguimiento endometriosis — Reserva ovárica normal (AMH 2.8 ng/mL)", tratamiento: "Continuar dienogest hasta deseo gestacional. Asesoría reproductiva. Perfil hormonal anual. Criopreservación de ovocitos como opción.", severidad: "Leve" },
    { id: "DX-010", pacienteId: "PAC-001", fecha: "2026-04-10", descripcion: "Embarazo intrauterino de 8 semanas — Primer trimestre (Z34.0)", tratamiento: "Ácido fólico 5mg/día. Vitaminas prenatales. Calcio 1200mg/día. Control prenatal mensual. Restricción de actividades de riesgo. Dieta balanceada.", severidad: "Leve" },
  ],
  notas: [
    { id: "NM-001", pacienteId: "PAC-001", fecha: "2023-06-10T09:45:00Z", contenido: "Paciente acude a revisión ginecológica anual de rutina. Refiere ciclos menstruales regulares cada 28 días, duración 4-5 días, flujo moderado. Niega dispareunia, leucorrea patológica o sangrado intermenstrual. Última citología hace 13 meses, normal. Método anticonceptivo: preservativo. Se realiza papanicolaou y toma de muestra para VPH." },
    { id: "NM-002", pacienteId: "PAC-001", fecha: "2023-09-18T11:00:00Z", contenido: "Paciente acude a recibir resultado de citología. Se informa LEIBG. Colposcopia realizada en consultorio. Se explica procedimiento antes de realizarlo. Paciente comprende y acepta. Dos biopsias tomadas. Resultado preliminar: zona de transformación tipo 1 con cambios koilocíticos. Se explica pronóstico favorable y conducta expectante. Muy ansiosa, se dedica tiempo para resolución de dudas." },
    { id: "NM-003", pacienteId: "PAC-001", fecha: "2024-01-15T09:45:00Z", contenido: "Biopsia confirma NIC I. Se explica a paciente que NIC I tiene regresión espontánea en 60-80% de casos en 2 años. Se discute manejo expectante vs tratamiento ablativo. Paciente prefiere observación. Se indica citología en 6 meses. Se solicita genotipificación VPH (resultado: VPH 31 positivo). Se prescribe vacuna VPH nonavalente. Inicio de suplementación prenatal a solicitud de paciente que planifica embarazo en el futuro." },
    { id: "NM-004", pacienteId: "PAC-001", fecha: "2024-06-05T09:30:00Z", contenido: "Excelente noticia para la paciente: citología NILM. Se confirma regresión completa del NIC I a los 6 meses. Paciente muy aliviada. Se aplica segunda dosis de vacuna VPH nonavalente. Se explica que el seguimiento anual es suficiente. Se aprovecha la consulta para orientación sobre métodos anticonceptivos de mayor eficacia." },
    { id: "NM-005", pacienteId: "PAC-001", fecha: "2024-09-12T10:30:00Z", contenido: "Paciente acude solicitando cambio de método anticonceptivo. Actualmente usa preservativo. Desea iniciar hormonal para mayor eficacia. Sin contraindicaciones para estrógenos (no fumadora, normotensa, sin migraña con aura, sin antecedente trombótico). Se inicia ACO combinada baja dosis. Se instruye sobre inicio el primer día del ciclo, toma diaria sin omisiones, efectos secundarios esperados (manchado los primeros 3 meses, sensibilidad mamaria) y señales de alarma." },
    { id: "NM-006", pacienteId: "PAC-001", fecha: "2024-12-03T10:00:00Z", contenido: "Paciente refiere desde hace 3 meses dolor menstrual incapacitante (EVA 8/10) que no cede con AINEs habituales. Náuseas y vómito el primer día. Falta al trabajo por el dolor. Menciona también dispareunia profunda ocasional durante relaciones sexuales y molestia pélvica en los días previos a la menstruación. Exploración con datos clínicos altamente sugestivos de endometriosis. Se discuten opciones diagnósticas. Paciente acepta laparoscopia." },
    { id: "NM-007", pacienteId: "PAC-001", fecha: "2025-03-08T10:45:00Z", contenido: "Post-laparoscopia (realizada 15/02/2025): hallazgos confirman endometriosis estadio II según clasificación revisada de la AFS. Focos activos en ovario izquierdo (endometrioma 2.1 cm drenado), ligamentos uterosacros bilaterales y peritoneo pélvico posterior. Procedimiento sin complicaciones intraoperatorias. Inicio de dienogest 2mg/día como tratamiento médico coadyuvante. Paciente recuperada satisfactoriamente." },
    { id: "NM-008", pacienteId: "PAC-001", fecha: "2025-06-20T09:45:00Z", contenido: "Control a 3 meses de cirugía. Mejoría muy significativa: EVA 3/10 durante menstruación, sin dispareunia, sin dolor intermenstrual. Sangrado muy escaso bajo dienogest (amenorrea funcional). Ecografía transvaginal sin evidencia de recurrencia. Paciente satisfecha con el tratamiento. Comenta interés en embarazo para el año próximo. Se discuten implicaciones del embarazo en endometriosis y opciones." },
    { id: "NM-009", pacienteId: "PAC-001", fecha: "2025-10-14T11:00:00Z", contenido: "Perfil hormonal completo solicitado para valoración de reserva ovárica previo a planificación de embarazo. Se habla sobre impacto de endometriosis en fertilidad (15-40% de mujeres infértiles tienen endometriosis). Se orienta sobre suspensión de dienogest 1-2 meses antes de intentar concebir y el potencial beneficio del embarazo como tratamiento natural de la endometriosis." },
    { id: "NM-010", pacienteId: "PAC-001", fecha: "2026-01-20T09:30:00Z", contenido: "Resultados de laboratorio muy alentadores. AMH 2.8 ng/mL (normal >1.0 para su edad). FSH, LH y estradiol en rango folicular normal. Se orienta sobre suspensión de dienogest y búsqueda de embarazo. Se instruye sobre signos tempranos de embarazo y solicitud de primera consulta prenatal al confirmar embarazo. Próxima cita en caso de embarazo confirmado." },
    { id: "NM-011", pacienteId: "PAC-001", fecha: "2026-04-10T10:30:00Z", contenido: "Primera consulta prenatal. Embarazo de 8.2 semanas confirmado. Paciente emocionada. Ultrasonido: embrión único intrauterino, FCF 172 lpm, CRL 16.2 mm, saco gestacional regular. Se realizan biometría y evaluación de estructuras embrionarias para la edad gestacional, todo dentro de parámetros normales. Se inicia protocolo completo de atención prenatal. Se orienta sobre síntomas normales del primer trimestre (náuseas, fatiga, sensibilidad mamaria) y señales de alarma." },
  ],
  medicamentos: [
    { id: "MED-001", pacienteId: "PAC-001", nombre: "Ácido fólico", dosis: "5 mg", frecuencia: "1 vez al día (mañana)", fechaInicio: "2024-01-15" },
    { id: "MED-002", pacienteId: "PAC-001", nombre: "Sulfato ferroso", dosis: "300 mg", frecuencia: "1 vez al día con alimentos", fechaInicio: "2024-01-15", fechaFin: "2024-04-15" },
    { id: "MED-003", pacienteId: "PAC-001", nombre: "Vitamina D3", dosis: "4000 UI", frecuencia: "1 vez al día", fechaInicio: "2024-02-20", fechaFin: "2024-04-20" },
    { id: "MED-004", pacienteId: "PAC-001", nombre: "Levonorgestrel/Etinilestradiol (Microgynon)", dosis: "0.15 mg/0.03 mg", frecuencia: "1 comprimido diario por 21 días, descanso 7 días", fechaInicio: "2024-09-12", fechaFin: "2025-01-20" },
    { id: "MED-005", pacienteId: "PAC-001", nombre: "Naproxeno sódico", dosis: "500 mg", frecuencia: "Cada 8 horas durante menstruación (máx. 3 días)", fechaInicio: "2024-12-03", fechaFin: "2025-03-07" },
    { id: "MED-006", pacienteId: "PAC-001", nombre: "Dienogest", dosis: "2 mg", frecuencia: "1 vez al día de forma continua", fechaInicio: "2025-03-08", fechaFin: "2025-12-10" },
    { id: "MED-007", pacienteId: "PAC-001", nombre: "Ácido fólico", dosis: "5 mg", frecuencia: "1 vez al día (mañana)", fechaInicio: "2026-04-10" },
    { id: "MED-008", pacienteId: "PAC-001", nombre: "Multivitamínico prenatal", dosis: "1 cápsula", frecuencia: "1 vez al día con el desayuno", fechaInicio: "2026-04-10" },
    { id: "MED-009", pacienteId: "PAC-001", nombre: "Calcio + Vitamina D3", dosis: "600 mg / 400 UI", frecuencia: "2 veces al día con alimentos", fechaInicio: "2026-04-10" },
    { id: "MED-010", pacienteId: "PAC-001", nombre: "Ibuprofeno", dosis: "400 mg", frecuencia: "PRN dolor (máx. cada 8 horas)", fechaInicio: "2025-03-08", fechaFin: "2026-03-01" },
  ],
  recordatorios: [
    { id: "REC-001", medicamentoId: "MED-007", hora: "08:00", activo: true },
    { id: "REC-002", medicamentoId: "MED-008", hora: "08:00", activo: true },
    { id: "REC-003", medicamentoId: "MED-009", hora: "08:00", activo: true },
    { id: "REC-004", medicamentoId: "MED-009", hora: "20:00", activo: true },
  ],
  dashboard: {
    pacienteId: "PAC-001",
    ultimoRegistro: { id: "SV-012", fecha: "2026-04-10T10:00:00Z", peso: 62.0, estatura: 165, temperatura: 36.5, frecuenciaCardiaca: 67, presionSistolica: 110, presionDiastolica: 68, grasaCorporal: 20.5, indiceMasaCorporal: 22.8 },
    ultimoDiagnostico: { id: "DX-010", pacienteId: "PAC-001", fecha: "2026-04-10", descripcion: "Embarazo intrauterino de 8 semanas — Primer trimestre (Z34.0)", tratamiento: "Ácido fólico 5mg/día. Vitaminas prenatales. Calcio 1200mg/día. Control prenatal mensual.", severidad: "Leve" },
    proximaCita: { id: "CIT-012", pacienteId: "PAC-001", fecha: "2026-04-24", hora: "10:30", motivo: "Control prenatal — 10 semanas", estado: "Confirmada" },
    medicamentosActivos: [
      { id: "MED-007", pacienteId: "PAC-001", nombre: "Ácido fólico", dosis: "5 mg", frecuencia: "1 vez al día (mañana)", fechaInicio: "2026-04-10" },
      { id: "MED-008", pacienteId: "PAC-001", nombre: "Multivitamínico prenatal", dosis: "1 cápsula", frecuencia: "1 vez al día con el desayuno", fechaInicio: "2026-04-10" },
      { id: "MED-009", pacienteId: "PAC-001", nombre: "Calcio + Vitamina D3", dosis: "600 mg / 400 UI", frecuencia: "2 veces al día con alimentos", fechaInicio: "2026-04-10" },
    ],
  },
};

// Datos para citas
const especialidades = [
  "Medicina General",
  "Ginecología y Obstetricia",
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
  "IMSS",
  "ISSSTE",
  "Seguro Popular",
  "GNP Seguros",
  "Metlife",
  "AXA Seguros",
  "Allianz",
  "Mapfre",
  "Otro",
];

const serviciosDisponibles = [
  { id: "consulta", nombre: "Consulta ginecológica", precio: 900 },
  { id: "consulta_prenatal", nombre: "Consulta prenatal", precio: 950 },
  { id: "ultrasonido_tv", nombre: "Ultrasonido transvaginal", precio: 1400 },
  { id: "ultrasonido_obs", nombre: "Ultrasonido obstétrico", precio: 1500 },
  { id: "papanicolaou", nombre: "Papanicolaou", precio: 500 },
  { id: "colposcopia", nombre: "Colposcopía + biopsia", precio: 1800 },
  { id: "laboratorio", nombre: "Estudios de laboratorio", precio: 600 },
  { id: "perfil_hormonal", nombre: "Perfil hormonal completo", precio: 1200 },
  { id: "amh", nombre: "Hormona Antimülleriana (AMH)", precio: 900 },
  { id: "vph", nombre: "Prueba VPH + genotipificación", precio: 1100 },
  { id: "biopsia", nombre: "Biopsia endometrial", precio: 1600 },
  { id: "insercion_diu", nombre: "Inserción de DIU", precio: 2200 },
];

const cuponesValidos: Record<string, number> = {
  "PROMO10": 10,
  "NUEVO20": 20,
  "VIP15": 15,
  "DESCUENTO25": 25,
};

// Catálogos para consulta
const catalogoCIE10: Record<string, string> = {
  // Ginecología y Obstetricia
  "N80": "Endometriosis",
  "N80.0": "Endometriosis del útero (adenomiosis)",
  "N80.1": "Endometriosis del ovario",
  "N80.2": "Endometriosis de la trompa de Falopio",
  "N80.3": "Endometriosis del peritoneo pélvico",
  "N80.4": "Endometriosis del tabique rectovaginal y de la vagina",
  "N81": "Prolapso genital femenino",
  "N83": "Trastornos no inflamatorios del ovario, trompa de Falopio y ligamento ancho",
  "N83.0": "Quiste folicular del ovario",
  "N83.1": "Quiste del cuerpo lúteo",
  "N83.2": "Otros quistes ováricos y los no especificados",
  "N84": "Pólipo del tracto genital femenino",
  "N85": "Otras enfermedades no inflamatorias del útero, excepto el cuello",
  "N85.0": "Hiperplasia endometrial",
  "N85.2": "Hipertrofia del útero",
  "N86": "Erosión y ectropión del cuello del útero (cervicitis)",
  "N87": "Displasia cervical",
  "N87.0": "Displasia leve del cuello del útero (NIC I)",
  "N87.1": "Displasia moderada del cuello del útero (NIC II)",
  "N87.2": "Displasia severa del cuello del útero (NIC III / CIS)",
  "N88": "Otras enfermedades no inflamatorias del cuello del útero",
  "N91": "Menstruación ausente, escasa y poco frecuente",
  "N91.0": "Amenorrea primaria",
  "N91.1": "Amenorrea secundaria",
  "N91.3": "Oligomenorrea primaria",
  "N92": "Menstruación excesiva, frecuente e irregular",
  "N92.0": "Menstruación excesiva y frecuente con ciclo regular (hipermenorrea)",
  "N92.1": "Menstruación excesiva e irregular (menometrorragia)",
  "N92.3": "Hemorragia uterina disfuncional ovulatoria",
  "N94": "Dolor y otras afecciones relacionadas con los órganos genitales femeninos y el ciclo menstrual",
  "N94.0": "Dolor intermenstrual (mittelschmerz)",
  "N94.4": "Dismenorrea primaria",
  "N94.5": "Dismenorrea secundaria",
  "N94.6": "Dismenorrea no especificada",
  "N95": "Trastornos menopáusicos y perimenopáusicos",
  "N95.1": "Estados menopáusicos y climatéricos femeninos",
  "N97": "Infertilidad femenina",
  "N97.0": "Infertilidad femenina asociada con anovulación",
  "O00": "Embarazo ectópico",
  "O02": "Otros productos anormales de la concepción",
  "O20": "Hemorragia precoz del embarazo",
  "O26": "Atención materna por otras enfermedades del embarazo",
  "O28": "Hallazgos anormales en investigación prenatal de la madre",
  "Z34": "Supervisión de embarazo normal",
  "Z34.0": "Supervisión de primer embarazo normal",
  "Z34.1": "Supervisión de embarazo normal, gestación múltiple",
  "Z35": "Supervisión de embarazo de alto riesgo",
  // ITS y tracto genital
  "A50": "Sífilis congénita",
  "A54": "Infección gonocócica",
  "A56": "Otras enfermedades de transmisión sexual por clamidias",
  "A59": "Tricomoniasis",
  "A63": "Otras enfermedades de transmisión predominantemente sexual",
  "B37.3": "Candidiasis vulvar y vaginal",
  "B97.7": "Papilomavirus como causa de enfermedades clasificadas en otro lugar (VPH)",
  "N70": "Salpingitis y ooforitis",
  "N71": "Enfermedad inflamatoria del útero, excepto el cuello",
  "N72": "Enfermedad inflamatoria del cuello del útero",
  "N73": "Otras enfermedades inflamatorias pélvicas femeninas",
  "N76": "Otras enfermedades inflamatorias de la vagina y de la vulva",
  "N76.0": "Vaginitis aguda (colpitis)",
  "N76.1": "Vaginitis subaguda y crónica",
  "N89": "Otras enfermedades no inflamatorias de la vagina",
  // Generales
  "A00": "Cólera",
  "A01": "Fiebres tifoidea y paratifoidea",
  "A09": "Diarrea y gastroenteritis de presunto origen infeccioso",
  "B15": "Hepatitis aguda tipo A",
  "B16": "Hepatitis aguda tipo B",
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
  "Z01.4": "Examen ginecológico (general) de rutina",
  "Z13.8": "Examen de cribado para otras enfermedades especificadas",
};

const catalogoMedicamentos = [
  // Anticonceptivos y hormonales
  { nombre: "Ácido fólico", presentaciones: ["400 mcg", "5 mg"], vias: ["Oral"] },
  { nombre: "Dienogest", presentaciones: ["2 mg"], vias: ["Oral"] },
  { nombre: "Levonorgestrel/Etinilestradiol (Microgynon)", presentaciones: ["0.15 mg/0.03 mg"], vias: ["Oral"] },
  { nombre: "Desogestrel/Etinilestradiol", presentaciones: ["0.15 mg/0.02 mg"], vias: ["Oral"] },
  { nombre: "Norelgestromina/Etinilestradiol (Parche)", presentaciones: ["6mg/0.75mg por parche"], vias: ["Transdérmica"] },
  { nombre: "Etonogestrel (Implante subdérmico)", presentaciones: ["68 mg"], vias: ["Subdérmica"] },
  { nombre: "Levonorgestrel (DIU hormonal)", presentaciones: ["52 mg"], vias: ["Intrauterina"] },
  { nombre: "Levonorgestrel (Anticoncepción emergencia)", presentaciones: ["1.5 mg"], vias: ["Oral"] },
  { nombre: "Progesterona micronizada", presentaciones: ["100 mg", "200 mg"], vias: ["Oral", "Vaginal"] },
  { nombre: "Medroxiprogesterona (inyectable)", presentaciones: ["150 mg/mL"], vias: ["Intramuscular"] },
  { nombre: "Valerato de estradiol", presentaciones: ["1 mg", "2 mg"], vias: ["Oral"] },
  { nombre: "Estradiol (gel transdérmico)", presentaciones: ["0.5 mg/g gel"], vias: ["Transdérmica"] },
  { nombre: "Tibolona", presentaciones: ["2.5 mg"], vias: ["Oral"] },
  // Prenatal y embarazo
  { nombre: "Multivitamínico prenatal", presentaciones: ["1 cápsula"], vias: ["Oral"] },
  { nombre: "Calcio + Vitamina D3", presentaciones: ["500mg/200UI", "600mg/400UI"], vias: ["Oral"] },
  { nombre: "Sulfato ferroso", presentaciones: ["300 mg"], vias: ["Oral"] },
  { nombre: "Hierro polimaltosado", presentaciones: ["100 mg"], vias: ["Oral"] },
  { nombre: "Vitamina D3", presentaciones: ["400 UI", "1000 UI", "4000 UI"], vias: ["Oral"] },
  { nombre: "Ácido docosahexaenoico (DHA)", presentaciones: ["200 mg", "400 mg"], vias: ["Oral"] },
  { nombre: "Metildopa", presentaciones: ["250 mg", "500 mg"], vias: ["Oral"] },
  { nombre: "Labetalol", presentaciones: ["100 mg", "200 mg"], vias: ["Oral"] },
  { nombre: "Nifedipino (retard)", presentaciones: ["10 mg", "30 mg"], vias: ["Oral"] },
  { nombre: "Progesterona vaginal (profilaxis parto prematuro)", presentaciones: ["200 mg", "400 mg"], vias: ["Vaginal"] },
  // Antibióticos ginecológicos
  { nombre: "Metronidazol", presentaciones: ["250 mg", "500 mg", "500 mg óvulos"], vias: ["Oral", "Vaginal"] },
  { nombre: "Clindamicina", presentaciones: ["300 mg", "600 mg", "2% crema vaginal"], vias: ["Oral", "Vaginal"] },
  { nombre: "Fluconazol", presentaciones: ["150 mg", "200 mg"], vias: ["Oral"] },
  { nombre: "Clotrimazol", presentaciones: ["100 mg óvulo", "500 mg óvulo", "1% crema"], vias: ["Vaginal", "Tópica"] },
  { nombre: "Doxiciclina", presentaciones: ["100 mg"], vias: ["Oral"] },
  { nombre: "Azitromicina", presentaciones: ["250 mg", "500 mg", "1 g monodosis"], vias: ["Oral"] },
  { nombre: "Ceftriaxona", presentaciones: ["500 mg", "1 g"], vias: ["Intramuscular", "Intravenosa"] },
  { nombre: "Amoxicilina + Ácido clavulánico", presentaciones: ["500/125 mg", "875/125 mg"], vias: ["Oral"] },
  // Analgésicos y AINEs
  { nombre: "Naproxeno sódico", presentaciones: ["275 mg", "550 mg"], vias: ["Oral"] },
  { nombre: "Ibuprofeno", presentaciones: ["200 mg", "400 mg", "600 mg", "800 mg"], vias: ["Oral"] },
  { nombre: "Paracetamol", presentaciones: ["500 mg", "1 g"], vias: ["Oral"] },
  { nombre: "Diclofenaco", presentaciones: ["50 mg", "75 mg", "100 mg"], vias: ["Oral", "Intramuscular"] },
  { nombre: "Ketorolaco", presentaciones: ["10 mg", "30 mg"], vias: ["Oral", "Intramuscular", "Intravenosa"] },
  // Otros ginecológicos
  { nombre: "Ácido tranexámico", presentaciones: ["250 mg", "500 mg"], vias: ["Oral", "Intravenosa"] },
  { nombre: "Misoprostol", presentaciones: ["200 mcg"], vias: ["Oral", "Vaginal", "Sublingual"] },
  { nombre: "Oxitocina", presentaciones: ["5 UI/mL", "10 UI/mL"], vias: ["Intravenosa", "Intramuscular"] },
  { nombre: "Letrozol", presentaciones: ["2.5 mg"], vias: ["Oral"] },
  { nombre: "Clomifeno", presentaciones: ["50 mg"], vias: ["Oral"] },
  { nombre: "Bromocriptina", presentaciones: ["2.5 mg"], vias: ["Oral"] },
  { nombre: "Cabergolina", presentaciones: ["0.5 mg"], vias: ["Oral"] },
  { nombre: "Omeprazol", presentaciones: ["20 mg", "40 mg"], vias: ["Oral"] },
  { nombre: "Metoclopramida", presentaciones: ["10 mg"], vias: ["Oral", "Intramuscular"] },
  { nombre: "Ondansetrón", presentaciones: ["4 mg", "8 mg"], vias: ["Oral", "Intravenosa"] },
  // Generales
  { nombre: "Amoxicilina", presentaciones: ["250 mg", "500 mg", "875 mg"], vias: ["Oral"] },
  { nombre: "Losartán", presentaciones: ["25 mg", "50 mg", "100 mg"], vias: ["Oral"] },
  { nombre: "Metformina", presentaciones: ["500 mg", "850 mg", "1000 mg"], vias: ["Oral"] },
  { nombre: "Atorvastatina", presentaciones: ["10 mg", "20 mg", "40 mg"], vias: ["Oral"] },
  { nombre: "Salbutamol", presentaciones: ["100 mcg/dosis"], vias: ["Inhalada"] },
  { nombre: "Prednisona", presentaciones: ["5 mg", "20 mg", "50 mg"], vias: ["Oral"] },
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

// ───���─────────────────────────────────────────
// AVATAR COMPONENT
// ─────────────────────────────────────────────

function AvatarPaciente({ nombre, sexo, size = 48 }: { nombre: string; sexo: "Masculino" | "Femenino" | "Otro"; size?: number }) {
  const initials = nombre.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const bgColor = sexo === "Femenino" ? "from-rose-400 to-pink-500" : sexo === "Masculino" ? "from-sky-400 to-blue-500" : "from-slate-400 to-slate-500";
  const sizeClass = size >= 56 ? "w-14 h-14 rounded-2xl text-xl" : "w-10 h-10 rounded-xl text-sm";

  if (sexo === "Femenino") {
    return (
      <div className={`${sizeClass} overflow-hidden shadow-lg shadow-primary/20 shrink-0 border-2 border-white/30`}>
        <Image
          src="/avatar-paciente.jpg"
          alt={`Foto de ${nombre}`}
          width={size}
          height={size}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`${sizeClass} bg-gradient-to-br ${bgColor} flex items-center justify-center shadow-lg shadow-primary/20 shrink-0`}>
      <span className={`font-bold text-white tracking-tight`}>{initials}</span>
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

function CitasTab() {
  const [mesActual, setMesActual] = useState(new Date());
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [citasAgendadas, setCitasAgendadas] = useState<CitaAgendada[]>([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>("");
  
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

  const calcularPrecioBase = () => formCita.servicios.reduce((total, servId) => {
    const servicio = serviciosDisponibles.find((s) => s.id === servId);
    return total + (servicio?.precio || 0);
  }, 0);

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
        <span className="text-sm font-medium text-foreground">Leyenda:</span>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-emerald-400"></span>
          <span className="text-sm text-muted-foreground">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-amber-400"></span>
          <span className="text-sm text-muted-foreground">Parcial</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-red-400"></span>
          <span className="text-sm text-muted-foreground">Lleno</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-muted"></span>
          <span className="text-sm text-muted-foreground">No disponible</span>
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
                  if (!esOtroMes && puedeAgendar) {
                    setFechaSeleccionada(fecha);
                    setMostrarFormulario(true);
                  }
                }}
                disabled={esOtroMes || !puedeAgendar}
                className={`
                  min-h-[80px] flex flex-col items-start justify-start p-2 text-sm rounded-xl transition-all w-full border
                  ${esOtroMes ? "text-muted-foreground/30 cursor-not-allowed border-transparent" : ""}
                  ${!esOtroMes ? colorFondo : ""}
                  ${!esOtroMes && puedeAgendar ? "cursor-pointer" : "cursor-not-allowed"}
                  ${esHoy && !esOtroMes ? "ring-2 ring-primary ring-offset-1" : ""}
                  ${estaSeleccionado ? "ring-2 ring-primary bg-primary/20" : ""}
                `}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className={`text-xs font-bold leading-none ${esHoy && !esOtroMes ? "text-primary" : textColor}`}>
                    {dia}
                  </span>
                  {!esOtroMes && estadoDia && estadoDia.tipo !== "pasado" && estadoDia.tipo !== "domingo" && (
                    <span className={`text-[9px] font-semibold px-1 py-0.5 rounded ${
                      estadoDia.tipo === "disponible" ? "bg-emerald-200 text-emerald-800" :
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
                        className={`text-[9px] leading-tight font-medium truncate w-full px-1 py-0.5 rounded ${
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
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-primary" />
                  Tipo de paciente
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setFormCita({ ...formCita, primeraVez: true })}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
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
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
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

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-primary" />
                  Tipo de consulta
                </label>
                <select
                  value={formCita.tipoConsulta}
                  onChange={(e) => setFormCita({ ...formCita, tipoConsulta: e.target.value })}
                  className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option>Consulta general</option>
                  <option>Consulta de seguimiento</option>
                  <option>Consulta de especialidad</option>
                  <option>Chequeo preventivo</option>
                  <option>Urgencia</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" />
                  Especialidad
                </label>
                <select
                  value={formCita.especialidad}
                  onChange={(e) => setFormCita({ ...formCita, especialidad: e.target.value })}
                  className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {especialidades.map((esp) => (
                    <option key={esp}>{esp}</option>
                  ))}
                </select>
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
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Tag className="w-4 h-4 text-primary" />
                  Servicios
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {serviciosDisponibles.map((servicio) => (
                    <button
                      key={servicio.id}
                      onClick={() => toggleServicio(servicio.id)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl border text-sm transition-colors ${
                        formCita.servicios.includes(servicio.id)
                          ? "bg-primary/10 border-primary text-foreground"
                          : "bg-background border-border text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      <span className="truncate">{servicio.nombre}</span>
                      <span className="text-xs font-semibold shrink-0 ml-2">${servicio.precio}</span>
                    </button>
                  ))}
                </div>
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
                    className={`flex-1 border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 uppercase ${
                      cuponValido === true ? "border-emerald-500" : cuponValido === false ? "border-red-500" : "border-border"
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
                disabled={!fechaSeleccionada || formCita.servicios.length === 0}
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
  { id: "datosclinicos", label: "Datos Clínicos", icon: Activity },
  { id: "diagnostico", label: "Diagnóstico", icon: Stethoscope },
  { id: "notas", label: "Notas", icon: FileEdit },
  { id: "prescripcion", label: "Prescripción", icon: Pill },
  { id: "resumen", label: "Resumen", icon: FileCheck },
] as const;

type SubTabConsultaId = (typeof subTabsConsulta)[number]["id"];

function ConsultaTab() {
  const [activeSubTab, setActiveSubTab] = useState<SubTabConsultaId>("datosclinicos");
  
  const [datosClinicosForm, setDatosClinicosForm] = useState<DatosClinicosForm>({
    peso: "", estatura: "", frecuenciaCardiaca: "", presionSistolica: "", presionDiastolica: "",
    imc: "", masaCorporal: "", grasaCorporal: "", frecuenciaRespiratoria: "", temperatura: "",
  });
  
  const [diagnosticos, setDiagnosticos] = useState<DiagnosticoItem[]>([]);
  const [nuevaClave, setNuevaClave] = useState("");
  const [nuevoDiagnostico, setNuevoDiagnostico] = useState("");
  const [sugerenciasCIE, setSugerenciasCIE] = useState<Array<{clave: string; descripcion: string}>>([]);
  
  const [notas, setNotas] = useState<NotaItem[]>([]);
  const [nuevaNota, setNuevaNota] = useState("");
  
  const [prescripciones, setPrescripciones] = useState<PrescripcionItem[]>([]);
  const [prescripcionForm, setPrescripcionForm] = useState({
    medicamento: "", dosis: "", frecuencia: "", duracion: "", via: "", indicaciones: "",
  });
  const [busquedaMedicamento, setBusquedaMedicamento] = useState("");
  const [sugerenciasMedicamento, setSugerenciasMedicamento] = useState<typeof catalogoMedicamentos>([]);

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

  return (
    <div className="space-y-6">
      <div className="border-b border-border">
        <nav className="flex gap-1 overflow-x-auto pb-px" aria-label="Secciones de consulta">
          {subTabsConsulta.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSubTab(id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors rounded-t-xl ${
                activeSubTab === id
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

            <button className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
              <Save className="w-4 h-4" />
              Guardar Datos Clínicos
            </button>
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
              <p className="text-sm font-medium text-foreground">Agregar diagnóstico (CIE-10)</p>
              
              <div className="grid md:grid-cols-2 gap-4">
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

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <ClipboardList className="w-3.5 h-3.5" /> Diagnóstico
                  </label>
                  <input
                    type="text"
                    value={nuevoDiagnostico}
                    onChange={(e) => setNuevoDiagnostico(e.target.value)}
                    className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Se autocompleta al ingresar clave"
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
              <h3 className="text-lg font-semibold text-foreground">Notas Médicas</h3>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Nueva nota</label>
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

            {notas.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Notas registradas ({notas.length})</p>
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
                <p className="text-sm">No hay notas registradas</p>
              </div>
            )}
          </div>
        )}

        {activeSubTab === "prescripcion" && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Pill className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Prescripción Médica</h3>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1.5 relative md:col-span-2 lg:col-span-1">
                  <label className="text-xs font-medium text-muted-foreground">Medicamento</label>
                  <input
                    type="text"
                    value={busquedaMedicamento}
                    onChange={(e) => handleBusquedaMedicamento(e.target.value)}
                    className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Buscar medicamento..."
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
                    <option value="3 días">3 días</option>
                    <option value="5 días">5 días</option>
                    <option value="7 días">7 días</option>
                    <option value="10 días">10 días</option>
                    <option value="14 días">14 días</option>
                    <option value="30 días">30 días</option>
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

                <button className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                  <Save className="w-4 h-4" />
                  Guardar Receta
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
              <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
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
                    className={`inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-xl border transition-all cursor-pointer select-none ${
                      estaActivo
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
// TAB: GINECOLOGÍA
// ─────────────────────────────────────────────

interface HistoriaGinecologica {
  menarca: string;
  cicloRegular: string;
  duracionCiclo: string;
  duracionSangrado: string;
  fechaUltimaRegla: string;
  dismenorrea: string;
  dismenorreaNivel: string;
  menopausia: string;
  fechaMenopausia: string;
  // Anticonceptivos
  metodoActual: string;
  tiempoUso: string;
  metodosAnteriores: string;
  // Obstétrica
  gestaciones: string;
  partos: string;
  cesareas: string;
  abortos: string;
  nacidosVivos: string;
  // Citología
  fechaUltimoPap: string;
  resultadoUltimoPap: string;
  fechaUltimaColpo: string;
  resultadoUltimaColpo: string;
  vph: string;
  genotipovph: string;
  vacunaVPH: string;
  // Mama
  autoexamen: string;
  mastografia: string;
  fechaUltimaMastografia: string;
  // Antecedentes
  enfermedadesPelvicas: string;
  cirugiasPelvicas: string;
  detallesCirugias: string;
  its: string;
  detallesITS: string;
  endometriosis: string;
  sop: string;
  miomatosis: string;
  // Embarazo actual
  embarazoActual: boolean;
  semanasGestacion: string;
  fum: string;
  fpp: string;
  fcf: string;
  numeroControles: string;
}

const historiaGinecologicaInicialMock: HistoriaGinecologica = {
  menarca: "12",
  cicloRegular: "Si",
  duracionCiclo: "28",
  duracionSangrado: "4",
  fechaUltimaRegla: "2026-03-10",
  dismenorrea: "Si",
  dismenorreaNivel: "3",
  menopausia: "No",
  fechaMenopausia: "",
  metodoActual: "Ninguno (embarazo actual)",
  tiempoUso: "",
  metodosAnteriores: "Dienogest 2mg/día (mar 2025 – dic 2025), ACO Microgynon (sep 2024 – ene 2025), preservativo",
  gestaciones: "1",
  partos: "0",
  cesareas: "0",
  abortos: "0",
  nacidosVivos: "0",
  fechaUltimoPap: "2024-06-05",
  resultadoUltimoPap: "NILM (Negativo para lesión intraepitelial)",
  fechaUltimaColpo: "2023-09-18",
  resultadoUltimaColpo: "Zona de transformación tipo 1 — NIC I (regresión espontánea confirmada)",
  vph: "Si (resuelto)",
  genotipovph: "VPH 31 (positivo 2023, seguimiento negativo 2024)",
  vacunaVPH: "Nonavalente — 2 dosis aplicadas (jun y sep 2024)",
  autoexamen: "Mensual",
  mastografia: "Pendiente (inicio a los 40 años)",
  fechaUltimaMastografia: "",
  enfermedadesPelvicas: "Endometriosis estadio II (diagnóstico feb 2025)",
  cirugiasPelvicas: "Si",
  detallesCirugias: "Laparoscopia diagnóstica y quirúrgica (15/02/2025): vaporización CO2 de focos endometriósicos en ovario izquierdo y ligamentos uterosacros, drenaje de endometrioma 2.1 cm",
  its: "VPH (resuelto)",
  detallesITS: "VPH genotipo 31 — Citología LEIBG en 2023, regresión espontánea confirmada en 2024 con citología NILM. Vacunación completa.",
  endometriosis: "Si — Estadio II (AFS revisada)",
  sop: "No",
  miomatosis: "No",
  embarazoActual: true,
  semanasGestacion: "8",
  fum: "2026-02-17",
  fpp: "2026-11-24",
  fcf: "172",
  numeroControles: "1",
};

function GinecologiaTab() {
  const [hg, setHg] = useState<HistoriaGinecologica>(historiaGinecologicaInicialMock);
  const [guardado, setGuardado] = useState(false);
  const [seccionAbierta, setSeccionAbierta] = useState<string>("menstrual");

  const toggleSeccion = (id: string) =>
    setSeccionAbierta((prev) => (prev === id ? "" : id));

  const handleChange = (field: keyof HistoriaGinecologica, value: string | boolean) => {
    setHg((prev) => ({ ...prev, [field]: value }));
    setGuardado(false);
  };

  const handleGuardar = () => {
    setGuardado(true);
    setTimeout(() => setGuardado(false), 3000);
  };

  const inputCls = "w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors";
  const selectCls = `${inputCls}`;
  const labelCls = "block text-xs font-medium text-muted-foreground mb-1";

  const secciones = [
    { id: "menstrual", label: "Historia Menstrual", icon: <Activity className="w-4 h-4" /> },
    { id: "anticonceptivos", label: "Anticoncepción", icon: <Shield className="w-4 h-4" /> },
    { id: "obstetrica", label: "Historia Obstétrica", icon: <Baby className="w-4 h-4" /> },
    { id: "citologia", label: "Citología y VPH", icon: <FileText className="w-4 h-4" /> },
    { id: "mama", label: "Mama y Mastografía", icon: <Heart className="w-4 h-4" /> },
    { id: "antecedentes", label: "Antecedentes Ginecológicos", icon: <ClipboardList className="w-4 h-4" /> },
    { id: "prenatal", label: "Control Prenatal", icon: <Syringe className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
            <Heart className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Historia Ginecológica</h3>
            <p className="text-sm text-muted-foreground">Datos de seguimiento ginecológico y obstétrico</p>
          </div>
        </div>
        <button
          onClick={handleGuardar}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg ${guardado ? "bg-emerald-500 text-white shadow-emerald-200" : "bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary/90"}`}
        >
          {guardado ? <ShieldCheck className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {guardado ? "Guardado" : "Guardar cambios"}
        </button>
      </div>

      {/* Tarjeta resumen embarazo */}
      {hg.embarazoActual && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
            <Baby className="w-6 h-6 text-rose-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-rose-800">Embarazo en curso — {hg.semanasGestacion} semanas de gestación</p>
            <p className="text-sm text-rose-600">FUM: {hg.fum ? fmtFecha(hg.fum) : "—"} &nbsp;·&nbsp; FPP: {hg.fpp ? fmtFecha(hg.fpp) : "—"} &nbsp;·&nbsp; FCF: {hg.fcf ? `${hg.fcf} lpm` : "—"}</p>
          </div>
          <span className="px-3 py-1.5 bg-rose-100 text-rose-700 rounded-full text-xs font-semibold border border-rose-200 shrink-0">
            {hg.numeroControles} control(es)
          </span>
        </div>
      )}

      {/* Secciones acordeón */}
      <div className="space-y-3">
        {secciones.map(({ id, label, icon }) => {
          const isOpen = seccionAbierta === id;
          return (
            <div key={id} className={`border rounded-2xl overflow-hidden transition-all duration-200 ${isOpen ? "border-primary/40 shadow-md" : "border-border"}`}>
              <button
                onClick={() => toggleSeccion(id)}
                className="w-full text-left flex items-center justify-between gap-4 px-5 py-4 bg-card hover:bg-muted/30 transition-colors"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isOpen ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {icon}
                  </div>
                  <span className="font-medium text-foreground text-sm">{label}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
              </button>

              {isOpen && (
                <div className="px-5 pb-6 pt-2 border-t border-border bg-card">
                  {/* MENSTRUAL */}
                  {id === "menstrual" && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                      <div>
                        <label className={labelCls}>Edad de menarca (años)</label>
                        <input type="number" className={inputCls} value={hg.menarca} onChange={(e) => handleChange("menarca", e.target.value)} min={8} max={20} />
                      </div>
                      <div>
                        <label className={labelCls}>Ciclo regular</label>
                        <select className={selectCls} value={hg.cicloRegular} onChange={(e) => handleChange("cicloRegular", e.target.value)}>
                          <option value="">Seleccionar</option>
                          <option value="Si">Sí</option>
                          <option value="No">No</option>
                          <option value="Irregular">Irregular</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Duración del ciclo (días)</label>
                        <input type="number" className={inputCls} value={hg.duracionCiclo} onChange={(e) => handleChange("duracionCiclo", e.target.value)} min={21} max={45} />
                      </div>
                      <div>
                        <label className={labelCls}>Duración del sangrado (días)</label>
                        <input type="number" className={inputCls} value={hg.duracionSangrado} onChange={(e) => handleChange("duracionSangrado", e.target.value)} min={1} max={10} />
                      </div>
                      <div>
                        <label className={labelCls}>Fecha de última regla (FUR)</label>
                        <input type="date" className={inputCls} value={hg.fechaUltimaRegla} onChange={(e) => handleChange("fechaUltimaRegla", e.target.value)} />
                      </div>
                      <div>
                        <label className={labelCls}>Dismenorrea</label>
                        <select className={selectCls} value={hg.dismenorrea} onChange={(e) => handleChange("dismenorrea", e.target.value)}>
                          <option value="">Seleccionar</option>
                          <option value="No">No</option>
                          <option value="Leve">Leve</option>
                          <option value="Si">Sí — moderada/severa</option>
                        </select>
                      </div>
                      {hg.dismenorrea === "Si" && (
                        <div>
                          <label className={labelCls}>Intensidad del dolor (EVA 1-10)</label>
                          <input type="range" min={1} max={10} className="w-full" value={hg.dismenorreaNivel} onChange={(e) => handleChange("dismenorreaNivel", e.target.value)} />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>1 — Leve</span>
                            <span className="font-semibold text-primary">{hg.dismenorreaNivel}/10</span>
                            <span>10 — Severo</span>
                          </div>
                        </div>
                      )}
                      <div>
                        <label className={labelCls}>Menopausia</label>
                        <select className={selectCls} value={hg.menopausia} onChange={(e) => handleChange("menopausia", e.target.value)}>
                          <option value="">Seleccionar</option>
                          <option value="No">No</option>
                          <option value="Perimenopausia">Perimenopausia</option>
                          <option value="Si">Sí</option>
                        </select>
                      </div>
                      {hg.menopausia === "Si" && (
                        <div>
                          <label className={labelCls}>Fecha de menopausia</label>
                          <input type="date" className={inputCls} value={hg.fechaMenopausia} onChange={(e) => handleChange("fechaMenopausia", e.target.value)} />
                        </div>
                      )}
                    </div>
                  )}

                  {/* ANTICONCEPTIVOS */}
                  {id === "anticonceptivos" && (
                    <div className="grid md:grid-cols-2 gap-4 pt-4">
                      <div>
                        <label className={labelCls}>Método anticonceptivo actual</label>
                        <select className={selectCls} value={hg.metodoActual} onChange={(e) => handleChange("metodoActual", e.target.value)}>
                          <option value="">Seleccionar</option>
                          <option value="Ninguno">Ninguno</option>
                          <option value="Ninguno (embarazo actual)">Ninguno (embarazo actual)</option>
                          <option value="ACO combinada">ACO combinada</option>
                          <option value="Progestágeno solo">Progestágeno solo (minipíldora)</option>
                          <option value="Dienogest">Dienogest (endometriosis)</option>
                          <option value="DIU de cobre">DIU de cobre</option>
                          <option value="DIU hormonal (Mirena)">DIU hormonal (Mirena)</option>
                          <option value="Implante subdérmico">Implante subdérmico</option>
                          <option value="Inyectable mensual">Inyectable mensual</option>
                          <option value="Inyectable trimestral">Inyectable trimestral</option>
                          <option value="Parche anticonceptivo">Parche anticonceptivo</option>
                          <option value="Anillo vaginal">Anillo vaginal (NuvaRing)</option>
                          <option value="Preservativo">Preservativo</option>
                          <option value="Ligadura de trompas">Ligadura de trompas</option>
                          <option value="Vasectomia pareja">Vasectomía de la pareja</option>
                          <option value="Abstinencia">Abstinencia / método natural</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Tiempo de uso</label>
                        <input type="text" className={inputCls} value={hg.tiempoUso} onChange={(e) => handleChange("tiempoUso", e.target.value)} placeholder="Ej: 2 años, 6 meses..." />
                      </div>
                      <div className="md:col-span-2">
                        <label className={labelCls}>Métodos anticonceptivos anteriores</label>
                        <textarea rows={3} className={`${inputCls} resize-none`} value={hg.metodosAnteriores} onChange={(e) => handleChange("metodosAnteriores", e.target.value)} placeholder="Descripción de métodos previos y duración..." />
                      </div>
                    </div>
                  )}

                  {/* OBSTÉTRICA */}
                  {id === "obstetrica" && (
                    <div className="space-y-4 pt-4">
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                        {(
                          [
                            { field: "gestaciones", label: "Gestaciones (G)" },
                            { field: "partos", label: "Partos (P)" },
                            { field: "cesareas", label: "Cesáreas (C)" },
                            { field: "abortos", label: "Abortos (A)" },
                            { field: "nacidosVivos", label: "Nacidos vivos" },
                          ] as { field: keyof HistoriaGinecologica; label: string }[]
                        ).map(({ field, label }) => (
                          <div key={String(field)}>
                            <label className={labelCls}>{label}</label>
                            <input
                              type="number"
                              min={0}
                              className={inputCls}
                              value={String(hg[field])}
                              onChange={(e) => handleChange(field, e.target.value)}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="bg-muted/30 rounded-xl p-4">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Fórmula obstétrica</p>
                        <p className="font-mono text-lg font-bold text-foreground">
                          G{hg.gestaciones} P{hg.partos} C{hg.cesareas} A{hg.abortos} V{hg.nacidosVivos}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* CITOLOGÍA */}
                  {id === "citologia" && (
                    <div className="grid md:grid-cols-2 gap-4 pt-4">
                      <div>
                        <label className={labelCls}>Fecha último Papanicolaou</label>
                        <input type="date" className={inputCls} value={hg.fechaUltimoPap} onChange={(e) => handleChange("fechaUltimoPap", e.target.value)} />
                      </div>
                      <div>
                        <label className={labelCls}>Resultado Papanicolaou</label>
                        <select className={selectCls} value={hg.resultadoUltimoPap} onChange={(e) => handleChange("resultadoUltimoPap", e.target.value)}>
                          <option value="">Seleccionar</option>
                          <option value="NILM (Negativo para lesión intraepitelial)">NILM — Negativo</option>
                          <option value="ASC-US">ASC-US</option>
                          <option value="ASC-H">ASC-H</option>
                          <option value="LEIBG (NIC I)">LEIBG (NIC I)</option>
                          <option value="LEIAG (NIC II-III)">LEIAG (NIC II-III)</option>
                          <option value="Carcinoma">Carcinoma in situ / invasor</option>
                          <option value="No realizado">No realizado</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Fecha última Colposcopía</label>
                        <input type="date" className={inputCls} value={hg.fechaUltimaColpo} onChange={(e) => handleChange("fechaUltimaColpo", e.target.value)} />
                      </div>
                      <div>
                        <label className={labelCls}>Resultado Colposcopía</label>
                        <input type="text" className={inputCls} value={hg.resultadoUltimaColpo} onChange={(e) => handleChange("resultadoUltimaColpo", e.target.value)} placeholder="Ej: Zona de transformación tipo 1, NIC I..." />
                      </div>
                      <div>
                        <label className={labelCls}>Prueba VPH</label>
                        <select className={selectCls} value={hg.vph} onChange={(e) => handleChange("vph", e.target.value)}>
                          <option value="">Seleccionar</option>
                          <option value="Negativo">Negativo</option>
                          <option value="Positivo">Positivo</option>
                          <option value="Si (resuelto)">Positivo previo (resuelto)</option>
                          <option value="No realizado">No realizado</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Genotipo VPH (si aplica)</label>
                        <input type="text" className={inputCls} value={hg.genotipovph} onChange={(e) => handleChange("genotipovph", e.target.value)} placeholder="Ej: VPH 16, VPH 18, VPH 31..." />
                      </div>
                      <div className="md:col-span-2">
                        <label className={labelCls}>Vacuna VPH</label>
                        <select className={selectCls} value={hg.vacunaVPH} onChange={(e) => handleChange("vacunaVPH", e.target.value)}>
                          <option value="">Seleccionar</option>
                          <option value="No aplicada">No aplicada</option>
                          <option value="Bivalente — esquema completo">Bivalente — esquema completo</option>
                          <option value="Tetravalente — esquema completo">Tetravalente — esquema completo</option>
                          <option value="Nonavalente — 1 dosis">Nonavalente — 1 dosis</option>
                          <option value="Nonavalente — 2 dosis aplicadas (jun y sep 2024)">Nonavalente — 2 dosis aplicadas (jun y sep 2024)</option>
                          <option value="Nonavalente — esquema completo">Nonavalente — esquema completo</option>
                          <option value="Incompleta">Incompleta</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* MAMA */}
                  {id === "mama" && (
                    <div className="grid md:grid-cols-2 gap-4 pt-4">
                      <div>
                        <label className={labelCls}>Autoexamen mamario</label>
                        <select className={selectCls} value={hg.autoexamen} onChange={(e) => handleChange("autoexamen", e.target.value)}>
                          <option value="">Seleccionar</option>
                          <option value="Mensual">Mensual</option>
                          <option value="Ocasional">Ocasional</option>
                          <option value="No realiza">No realiza</option>
                          <option value="No sabe">No sabe realizarlo</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Mastografía</label>
                        <select className={selectCls} value={hg.mastografia} onChange={(e) => handleChange("mastografia", e.target.value)}>
                          <option value="">Seleccionar</option>
                          <option value="Normal">Normal</option>
                          <option value="BIRADS 0">BIRADS 0 — Estudio incompleto</option>
                          <option value="BIRADS 1">BIRADS 1 — Normal</option>
                          <option value="BIRADS 2">BIRADS 2 — Hallazgos benignos</option>
                          <option value="BIRADS 3">BIRADS 3 — Probable benigno</option>
                          <option value="BIRADS 4">BIRADS 4 — Sospechoso</option>
                          <option value="BIRADS 5">BIRADS 5 — Altamente sospechoso</option>
                          <option value="Pendiente (inicio a los 40 años)">Pendiente (inicio a los 40 años)</option>
                          <option value="No realizada">No realizada</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Fecha última mastografía</label>
                        <input type="date" className={inputCls} value={hg.fechaUltimaMastografia} onChange={(e) => handleChange("fechaUltimaMastografia", e.target.value)} />
                      </div>
                    </div>
                  )}

                  {/* ANTECEDENTES */}
                  {id === "antecedentes" && (
                    <div className="grid md:grid-cols-2 gap-4 pt-4">
                      <div>
                        <label className={labelCls}>Endometriosis</label>
                        <select className={selectCls} value={hg.endometriosis} onChange={(e) => handleChange("endometriosis", e.target.value)}>
                          <option value="">Seleccionar</option>
                          <option value="No">No</option>
                          <option value="Si — Estadio I">Estadio I — Mínima</option>
                          <option value="Si — Estadio II (AFS revisada)">Estadio II — Leve</option>
                          <option value="Si — Estadio III">Estadio III — Moderada</option>
                          <option value="Si — Estadio IV">Estadio IV — Severa</option>
                          <option value="Sospecha clínica">Sospecha clínica (sin confirmar)</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Síndrome de ovario poliquístico (SOP)</label>
                        <select className={selectCls} value={hg.sop} onChange={(e) => handleChange("sop", e.target.value)}>
                          <option value="">Seleccionar</option>
                          <option value="No">No</option>
                          <option value="Si">Sí</option>
                          <option value="En estudio">En estudio</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Miomatosis uterina</label>
                        <select className={selectCls} value={hg.miomatosis} onChange={(e) => handleChange("miomatosis", e.target.value)}>
                          <option value="">Seleccionar</option>
                          <option value="No">No</option>
                          <option value="Si">Sí</option>
                          <option value="Intramural">Intramural</option>
                          <option value="Submucoso">Submucoso</option>
                          <option value="Subseroso">Subseroso</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Cirugías pélvicas previas</label>
                        <select className={selectCls} value={hg.cirugiasPelvicas} onChange={(e) => handleChange("cirugiasPelvicas", e.target.value)}>
                          <option value="">Seleccionar</option>
                          <option value="No">No</option>
                          <option value="Si">Sí</option>
                        </select>
                      </div>
                      {hg.cirugiasPelvicas === "Si" && (
                        <div className="md:col-span-2">
                          <label className={labelCls}>Detalles de cirugías pélvicas</label>
                          <textarea rows={3} className={`${inputCls} resize-none`} value={hg.detallesCirugias} onChange={(e) => handleChange("detallesCirugias", e.target.value)} placeholder="Fecha, tipo de cirugía, hallazgos..." />
                        </div>
                      )}
                      <div>
                        <label className={labelCls}>Infecciones de transmisión sexual (ITS)</label>
                        <select className={selectCls} value={hg.its} onChange={(e) => handleChange("its", e.target.value)}>
                          <option value="">Seleccionar</option>
                          <option value="Ninguna">Ninguna</option>
                          <option value="VPH (resuelto)">VPH (resuelto)</option>
                          <option value="Herpes genital">Herpes genital</option>
                          <option value="Gonorrea">Gonorrea</option>
                          <option value="Clamidia">Clamidia</option>
                          <option value="Sifilis">Sífilis</option>
                          <option value="VIH">VIH</option>
                          <option value="Vaginosis bacteriana recurrente">Vaginosis bacteriana recurrente</option>
                          <option value="Candidiasis recurrente">Candidiasis recurrente</option>
                        </select>
                      </div>
                      {hg.its !== "Ninguna" && hg.its !== "" && (
                        <div className="md:col-span-2">
                          <label className={labelCls}>Detalles de ITS</label>
                          <textarea rows={2} className={`${inputCls} resize-none`} value={hg.detallesITS} onChange={(e) => handleChange("detallesITS", e.target.value)} placeholder="Tratamiento, evolución, estado actual..." />
                        </div>
                      )}
                      <div className="md:col-span-2">
                        <label className={labelCls}>Otras enfermedades pélvicas relevantes</label>
                        <textarea rows={2} className={`${inputCls} resize-none`} value={hg.enfermedadesPelvicas} onChange={(e) => handleChange("enfermedadesPelvicas", e.target.value)} placeholder="EIP, quistes ováricos, pólipos, etc." />
                      </div>
                    </div>
                  )}

                  {/* PRENATAL */}
                  {id === "prenatal" && (
                    <div className="space-y-4 pt-4">
                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                        <input
                          type="checkbox"
                          id="embarazo-actual"
                          checked={hg.embarazoActual}
                          onChange={(e) => handleChange("embarazoActual", e.target.checked)}
                          className="w-4 h-4 accent-primary"
                        />
                        <label htmlFor="embarazo-actual" className="text-sm font-medium text-foreground cursor-pointer">
                          Embarazo actual en curso
                        </label>
                      </div>

                      {hg.embarazoActual && (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <label className={labelCls}>Semanas de gestación (SDG)</label>
                            <input type="number" min={1} max={42} className={inputCls} value={hg.semanasGestacion} onChange={(e) => handleChange("semanasGestacion", e.target.value)} />
                          </div>
                          <div>
                            <label className={labelCls}>Fecha de última menstruación (FUM)</label>
                            <input type="date" className={inputCls} value={hg.fum} onChange={(e) => handleChange("fum", e.target.value)} />
                          </div>
                          <div>
                            <label className={labelCls}>Fecha probable de parto (FPP)</label>
                            <input type="date" className={inputCls} value={hg.fpp} onChange={(e) => handleChange("fpp", e.target.value)} />
                          </div>
                          <div>
                            <label className={labelCls}>Frecuencia cardíaca fetal (FCF)</label>
                            <input type="text" className={inputCls} value={hg.fcf} onChange={(e) => handleChange("fcf", e.target.value)} placeholder="lpm" />
                          </div>
                          <div>
                            <label className={labelCls}>Número de controles prenatales</label>
                            <input type="number" min={0} className={inputCls} value={hg.numeroControles} onChange={(e) => handleChange("numeroControles", e.target.value)} />
                          </div>
                        </div>
                      )}

                      {!hg.embarazoActual && (
                        <div className="text-center py-10 text-muted-foreground">
                          <Baby className="w-12 h-12 mx-auto mb-3 opacity-20" />
                          <p className="text-sm">Sin embarazo activo registrado</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3 pt-2 border-t border-border">
        <button
          onClick={handleGuardar}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg ${guardado ? "bg-emerald-500 text-white shadow-emerald-200" : "bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary/90"}`}
        >
          {guardado ? <ShieldCheck className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {guardado ? "Guardado correctamente" : "Guardar historia ginecológica"}
        </button>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-border text-foreground rounded-xl text-sm font-medium hover:bg-muted transition-colors">
          <FileText className="w-4 h-4" />
          Imprimir historia
        </button>
      </div>
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
  nombreDoctor: "Dr. Rodríguez",
  especialidad: "Ginecología y Obstetricia",
  cedulaProfesional: "12345678",
  clinica: "Clínica Salud Femenina",
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
                    {t("gynecologicalHistory")}
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

const tabIds = ["dashboard", "datos", "signos", "citas", "consulta", "expediente", "medicamentos", "ginecologia"] as const;
type TabId = (typeof tabIds)[number];

const tabIcons = {
  dashboard: LayoutDashboard,
  datos: User,
  signos: Activity,
  citas: Calendar,
  consulta: Stethoscope,
  expediente: FolderOpen,
  medicamentos: Pill,
  ginecologia: Heart,
};

function useLocalizedTabs(t: (key: TranslationKey) => string) {
  return [
    { id: "dashboard" as const, label: t("dashboard"), icon: LayoutDashboard },
    { id: "datos" as const, label: t("generalData"), icon: User },
    { id: "signos" as const, label: t("vitalSigns"), icon: Activity },
    { id: "citas" as const, label: t("appointments"), icon: Calendar },
    { id: "consulta" as const, label: t("consultation"), icon: Stethoscope },
    { id: "expediente" as const, label: t("medicalRecord"), icon: FolderOpen },
    { id: "medicamentos" as const, label: t("medications"), icon: Pill },
    { id: "ginecologia" as const, label: t("gynecology"), icon: Heart },
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
  const dp = paciente.datosPersonales;
  const nombreCompleto = [dp.nombre, dp.apellidoPaterno, dp.apellidoMaterno].filter(Boolean).join(" ");
  const edad = calcularEdad(dp.fechaNacimiento);

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

          <div className="p-4">
            <div className="bg-sidebar-accent rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <AvatarPaciente nombre={nombreCompleto} sexo={dp.sexo} size={56} />
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-sidebar-foreground text-sm truncate">{nombreCompleto}</h2>
                  <p className="text-xs text-sidebar-foreground/60">{edad} {t("yearsOld")} - {dp.sexo}</p>
                </div>
              </div>
              <div className="text-xs text-sidebar-foreground/50 font-mono truncate">{dp.curp}</div>
            </div>
          </div>

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
                    : id === "ginecologia"
                    ? "text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
                {id === "ginecologia" && activeTab !== "ginecologia" && (
                  <span className="ml-auto px-1.5 py-0.5 text-xs bg-rose-500/20 text-rose-400 rounded-md font-semibold">New</span>
                )}
              </button>
            ))}
          </nav>

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
                  {t("patientFile")} {dp.nombre} {dp.apellidoPaterno}
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
              <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-border">
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-foreground">DR</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-foreground">{config.nombreDoctor}</p>
                  <p className="text-xs text-muted-foreground">{config.especialidad}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8 max-w-7xl">
          {activeTab === "dashboard" && paciente.dashboard && <DashboardTab dashboard={paciente.dashboard} />}
          {activeTab === "datos" && <DatosGeneralesTab datosPersonales={paciente.datosPersonales} direccion={paciente.direccion} contacto={paciente.contacto} datosFiscales={paciente.datosFiscales} />}
          {activeTab === "signos" && <SignosVitalesTab signosVitales={paciente.signosVitales} />}
          {activeTab === "citas" && <CitasTab />}
          {activeTab === "consulta" && <ConsultaTab />}
          {activeTab === "expediente" && <ExpedienteTab diagnosticos={paciente.diagnosticos} citas={paciente.citas} notas={paciente.notas} />}
          {activeTab === "medicamentos" && <MedicamentosTab medicamentos={paciente.medicamentos} recordatorios={paciente.recordatorios} />}
          {activeTab === "ginecologia" && <GinecologiaTab />}
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
