export type ID = string;
export type FechaISO = string;

export interface DatosPersonales {
  id: ID;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  fechaNacimiento: FechaISO;
  sexo: "Masculino" | "Femenino" | "Otro";
  curp?: string;
  rfc?: string;
}

export interface Direccion {
  calle: string;
  numeroExterior: string;
  numeroInterior?: string;
  colonia: string;
  ciudad: string;
  estado: string;
  codigoPostal: string;
  pais: string;
}

export interface Contacto {
  telefono: string;
  telefonoEmergencia?: string;
  email?: string;
  nombreContactoEmergencia?: string;
}

export interface DatosFiscales {
  razonSocial?: string;
  rfc?: string;
  usoCFDI?: string;
  regimenFiscal?: string;
  direccionFiscal?: Direccion;
}

export interface SignosVitales {
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

export interface Cita {
  id: ID;
  pacienteId: ID;
  fecha: FechaISO;
  hora: string;
  motivo: string;
  estado: "Pendiente" | "Confirmada" | "Cancelada" | "Completada";
  notas?: string;
}

export interface Visita {
  id: ID;
  pacienteId: ID;
  fecha: FechaISO;
  motivo: string;
  observaciones: string;
  signosVitales: SignosVitales;
}

export interface Diagnostico {
  id: ID;
  pacienteId: ID;
  fecha: FechaISO;
  descripcion: string;
  tratamiento?: string;
  severidad?: "Leve" | "Moderado" | "Grave";
}

export interface NotaMedica {
  id: ID;
  pacienteId: ID;
  fecha: FechaISO;
  contenido: string;
}

export interface Medicamento {
  id: ID;
  pacienteId: ID;
  nombre: string;
  dosis: string;
  frecuencia: string;
  fechaInicio: FechaISO;
  fechaFin?: FechaISO;
}

export interface Recordatorio {
  id: ID;
  medicamentoId: ID;
  hora: string;
  activo: boolean;
}

export interface MiniDashboard {
  pacienteId: ID;
  ultimoRegistro: SignosVitales;
  ultimoDiagnostico?: Diagnostico;
  proximaCita?: Cita;
  medicamentosActivos: Medicamento[];
}

export interface Paciente {
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