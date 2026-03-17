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
} from "lucide-react";
import { Cita, Contacto, DatosFiscales, DatosPersonales, Diagnostico, Direccion, Medicamento, MiniDashboard, NotaMedica, Paciente, Recordatorio, SignosVitales, Visita } from "@/app/types/paciente";
import { pacienteMock } from "@/app/mocks/pacienteMock";


// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
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
  if (imc < 18.5) return { label: "Bajo peso",  cls: "text-blue-600" };
  if (imc < 25)   return { label: "Normal",      cls: "text-emerald-600" };
  if (imc < 30)   return { label: "Sobrepeso",   cls: "text-amber-700" };
  return           { label: "Obesidad",          cls: "text-red-600" };
}

function presionCategoria(sis: number, dia: number) {
  if (sis < 120 && dia < 80) return { label: "Normal",  cls: "text-emerald-600" };
  if (sis < 130 && dia < 80) return { label: "Elevada", cls: "text-amber-700" };
  return                      { label: "Alta",          cls: "text-red-600" };
}

// ─────────────────────────────────────────────
// SHARED MINI-COMPONENTS
// ─────────────────────────────────────────────

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
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

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs text-muted-foreground leading-relaxed">{label}</p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

const estadoConfig: Record<string, { cls: string; dot: string }> = {
  Pendiente:  { cls: "bg-amber-50 text-amber-800 border-amber-200",    dot: "bg-amber-500" },
  Confirmada: { cls: "bg-blue-50 text-blue-700 border-blue-200",       dot: "bg-blue-600" },
  Cancelada:  { cls: "bg-red-50 text-red-700 border-red-200",          dot: "bg-red-500" },
  Completada: { cls: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
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
    { icon: <Heart className="w-5 h-5 text-destructive" />,              label: "Presión arterial",  value: `${sv.presionSistolica}/${sv.presionDiastolica}`, unit: "mmHg" },
    { icon: <Activity className="w-5 h-5 text-accent" />,                label: "Frec. cardíaca",    value: `${sv.frecuenciaCardiaca}`,                        unit: "bpm" },
    { icon: <Thermometer className="w-5 h-5 text-amber-500" />,          label: "Temperatura",       value: `${sv.temperatura}`,                               unit: "°C" },
    { icon: <Scale className="w-5 h-5 text-blue-600" />,                 label: "Peso",               value: `${sv.peso}`,                                      unit: "kg" },
    { icon: <TrendingDown className="w-5 h-5 text-emerald-600" />,       label: "IMC",                value: sv.indiceMasaCorporal ? sv.indiceMasaCorporal.toFixed(1) : "—", unit: "" },
    { icon: <Scale className="w-5 h-5 text-muted-foreground" />,         label: "Grasa corporal",    value: sv.grasaCorporal ? `${sv.grasaCorporal}` : "—",   unit: sv.grasaCorporal ? "%" : "" },
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
          <div className="col-span-2"><Field label="Nombre completo" value={nombreCompleto} /></div>
          <Field label="Fecha de nacimiento" value={fmtFecha(datosPersonales.fechaNacimiento)} />
          <Field label="Edad" value={`${edad} años`} />
          <Field label="Sexo" value={datosPersonales.sexo} />
          <Field label="CURP" value={datosPersonales.curp} />
          <Field label="RFC" value={datosPersonales.rfc} />
        </div>
      </SectionCard>

      <SectionCard icon={<Phone className="w-4 h-4" />} title="Contacto">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Teléfono" value={contacto.telefono} />
          <Field label="Correo electrónico" value={contacto.email} />
          <Field label="Contacto de emergencia" value={contacto.nombreContactoEmergencia} />
          <Field label="Tel. emergencias" value={contacto.telefonoEmergencia} />
        </div>
      </SectionCard>

      <SectionCard icon={<MapPin className="w-4 h-4" />} title="Domicilio">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Field label="Calle y número" value={`${direccion.calle} #${direccion.numeroExterior}${direccion.numeroInterior ? ` Int. ${direccion.numeroInterior}` : ""}`} />
          </div>
          <Field label="Colonia" value={direccion.colonia} />
          <Field label="Ciudad" value={direccion.ciudad} />
          <Field label="Estado" value={direccion.estado} />
          <Field label="CP" value={direccion.codigoPostal} />
          <Field label="País" value={direccion.pais} />
        </div>
      </SectionCard>

      {datosFiscales && (
        <SectionCard icon={<Receipt className="w-4 h-4" />} title="Datos fiscales">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><Field label="Razón social" value={datosFiscales.razonSocial} /></div>
            <Field label="RFC" value={datosFiscales.rfc} />
            <Field label="Régimen fiscal" value={datosFiscales.regimenFiscal} />
            <div className="col-span-2"><Field label="Uso de CFDI" value={datosFiscales.usoCFDI} /></div>
          </div>
        </SectionCard>
      )}
    </div>
  );
}

// ────────────────────────────────────���────────
// TAB: SIGNOS VITALES
// ─────────────────────────────────────────────

function SignosVitalesTab({ signosVitales }: { signosVitales: SignosVitales[] }) {
  const ordenados = [...signosVitales].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  const ultimo = ordenados[0];

  const vitales = ultimo ? [
    { icon: <Heart className="w-5 h-5 text-destructive" />,             label: "Presión arterial", value: `${ultimo.presionSistolica}/${ultimo.presionDiastolica}`, unit: "mmHg", estado: presionCategoria(ultimo.presionSistolica, ultimo.presionDiastolica) },
    { icon: <Activity className="w-5 h-5 text-accent" />,               label: "Frec. cardíaca",   value: `${ultimo.frecuenciaCardiaca}`,                           unit: "bpm",  estado: null },
    { icon: <Thermometer className="w-5 h-5 text-amber-500" />,         label: "Temperatura",      value: `${ultimo.temperatura}`,                                  unit: "°C",   estado: null },
    { icon: <Scale className="w-5 h-5 text-blue-600" />,                label: "Peso",              value: `${ultimo.peso}`,                                         unit: "kg",   estado: null },
    { icon: <Ruler className="w-5 h-5 text-slate-400" />,               label: "Estatura",          value: `${ultimo.estatura}`,                                     unit: "cm",   estado: null },
    { icon: <TrendingDown className="w-5 h-5 text-emerald-600" />,      label: "IMC",               value: ultimo.indiceMasaCorporal ? `${ultimo.indiceMasaCorporal.toFixed(1)}` : "—", unit: "", estado: ultimo.indiceMasaCorporal ? imcCategoria(ultimo.indiceMasaCorporal) : null },
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
// TAB: CITAS
// ─────────────────────────────────────────────

function CitasTab({ citas }: { citas: Cita[] }) {
  const ordenadas = [...citas].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  const pendientes = ordenadas.filter((c) => c.estado === "Pendiente" || c.estado === "Confirmada");
  const anteriores = ordenadas.filter((c) => c.estado === "Completada" || c.estado === "Cancelada");

  const renderCita = (cita: Cita) => {
    const cfg = estadoConfig[cita.estado] ?? estadoConfig.Pendiente;
    return (
      <div key={cita.id} className="bg-card border border-border rounded-lg p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 flex-1">
            <p className="font-semibold text-foreground text-balance">{cita.motivo}</p>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{fmtFecha(cita.fecha, { weekday: true })}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{cita.hora}</span>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium shrink-0 ${cfg.cls}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />{cita.estado}
          </span>
        </div>
        {cita.notas && (
          <div className="flex gap-2 text-sm text-muted-foreground bg-muted/50 rounded-md px-3 py-2">
            <FileText className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span className="leading-relaxed">{cita.notas}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {pendientes.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />Próximas citas
          </h3>
          <div className="space-y-3">{pendientes.map(renderCita)}</div>
        </section>
      )}
      {anteriores.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />Historial de citas
          </h3>
          <div className="space-y-3">{anteriores.map(renderCita)}</div>
        </section>
      )}
      {citas.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No hay citas registradas</p>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────���────────────────
// TAB: VISITAS
// ─────────────────────────────────────────────

function VisitaCard({ visita }: { visita: Visita }) {
  const [open, setOpen] = useState(false);
  const sv = visita.signosVitales;
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full text-left flex items-start justify-between gap-4 p-5 hover:bg-muted/30 transition-colors"
      >
        <div className="space-y-1 flex-1">
          <p className="font-semibold text-foreground text-balance">{visita.motivo}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{fmtFechaHora(visita.fecha)}</p>
        </div>
        <span className="mt-1 text-muted-foreground shrink-0">
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </span>
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-border pt-4">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Observaciones</p>
            <p className="text-sm text-foreground leading-relaxed">{visita.observaciones}</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Activity className="w-3.5 h-3.5 text-primary" />
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Signos vitales registrados</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                { label: "Peso",              value: `${sv.peso} kg` },
                { label: "Estatura",          value: `${sv.estatura} cm` },
                { label: "Temperatura",       value: `${sv.temperatura} °C` },
                { label: "Presión arterial",  value: `${sv.presionSistolica}/${sv.presionDiastolica} mmHg` },
                { label: "Frec. cardíaca",    value: `${sv.frecuenciaCardiaca} bpm` },
                ...(sv.indiceMasaCorporal ? [{ label: "IMC", value: sv.indiceMasaCorporal.toFixed(1) }] : []),
              ].map((item) => (
                <div key={item.label} className="bg-muted/40 rounded-md px-3 py-2">
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.label}</p>
                  <p className="text-sm font-semibold text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function VisitasTab({ visitas }: { visitas: Visita[] }) {
  const ordenadas = [...visitas].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Stethoscope className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Historial de visitas médicas</h3>
        <span className="ml-auto text-xs text-muted-foreground">{ordenadas.length} registro(s)</span>
      </div>
      {ordenadas.length === 0
        ? <div className="text-center py-12 text-muted-foreground"><Stethoscope className="w-10 h-10 mx-auto mb-3 opacity-30" /><p className="text-sm">No hay visitas registradas</p></div>
        : ordenadas.map((v) => <VisitaCard key={v.id} visita={v} />)
      }
    </div>
  );
}

// ─────────────────────────────────────────────
// TAB: DIAGNÓSTICOS
// ─────────────────────────────────────────────

function DiagnosticosTab({ diagnosticos }: { diagnosticos: Diagnostico[] }) {
  const ordenados = [...diagnosticos].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Stethoscope className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Diagnósticos clínicos</h3>
        <span className="ml-auto text-xs text-muted-foreground">{ordenados.length} registro(s)</span>
      </div>
      {ordenados.length === 0
        ? <div className="text-center py-12 text-muted-foreground"><Stethoscope className="w-10 h-10 mx-auto mb-3 opacity-30" /><p className="text-sm">No hay diagnósticos registrados</p></div>
        : (
          <div className="space-y-3">
            {ordenados.map((dx) => {
              const cfg = dx.severidad ? (severidadConfig[dx.severidad] ?? severidadConfig.Leve) : null;
              return (
                <div key={dx.id} className="bg-card border border-border rounded-lg p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-0.5">
                      <p className="font-semibold text-foreground text-balance">{dx.descripcion}</p>
                      <p className="text-xs text-muted-foreground">{fmtFecha(dx.fecha)}</p>
                    </div>
                    {cfg && (
                      <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium shrink-0 ${cfg.cls}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />{dx.severidad}
                      </span>
                    )}
                  </div>
                  {dx.tratamiento && (
                    <div className="bg-muted/40 rounded-md px-3 py-2">
                      <div className="flex items-center gap-1.5 mb-1">
                        <AlertCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Plan de tratamiento</p>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">{dx.tratamiento}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      }
    </div>
  );
}

// ─────────────────────────────────────────────
// TAB: NOTAS
// ─────────────────────────────────────────────

function NotasTab({ notas }: { notas: NotaMedica[] }) {
  const ordenadas = [...notas].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <FileText className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Notas médicas</h3>
        <span className="ml-auto text-xs text-muted-foreground">{ordenadas.length} nota(s)</span>
      </div>
      {ordenadas.length === 0
        ? <div className="text-center py-12 text-muted-foreground"><FileText className="w-10 h-10 mx-auto mb-3 opacity-30" /><p className="text-sm">No hay notas médicas registradas</p></div>
        : (
          <div className="space-y-3">
            {ordenadas.map((nota, index) => (
              <div key={nota.id} className="bg-card border border-border rounded-lg p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary">{ordenadas.length - index}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{fmtFechaHora(nota.fecha)}</span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{nota.contenido}</p>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}

// ─────────────────────────────────────────────
// TAB: MEDICAMENTOS
// ─────────────────────────────────────────────

function MedicamentosTab({ medicamentos, recordatorios }: { medicamentos: Medicamento[]; recordatorios: Recordatorio[] }) {
  const activos    = medicamentos.filter((m) => !m.fechaFin || new Date(m.fechaFin) >= new Date());
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
  { id: "citas",        label: "Citas",            icon: Calendar },
  { id: "visitas",      label: "Visitas",          icon: Stethoscope },
  { id: "diagnosticos", label: "Diagnósticos",     icon: ClipboardList },
  { id: "notas",        label: "Notas",            icon: FileText },
  { id: "medicamentos", label: "Medicamentos",     icon: Pill },
] as const;

type TabId = (typeof tabs)[number]["id"];

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────

export default function PacienteDashboard({ paciente }: { paciente: Paciente }) {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const dp = paciente.datosPersonales;
  const nombreCompleto = [dp.nombre, dp.apellidoPaterno, dp.apellidoMaterno].filter(Boolean).join(" ");
  const edad = calcularEdad(dp.fechaNacimiento);
  const iniciales = [dp.nombre[0], dp.apellidoPaterno[0]].join("").toUpperCase();
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
        <span className="text-xs text-sidebar-foreground/50">ID: {paciente.id}</span>
      </header>

      {/* Patient banner + tabs */}
      <div className="bg-sidebar border-b border-sidebar-border px-4 md:px-8 pt-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shrink-0">
            <span className="text-primary-foreground text-lg font-bold">{iniciales}</span>
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
          <div className="hidden md:block text-right">
            <p className="text-xs text-sidebar-foreground/50">Teléfono</p>
            <p className="text-sm text-sidebar-foreground font-medium">{paciente.contacto.telefono}</p>
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
        {activeTab === "dashboard"    && paciente.dashboard && <DashboardTab dashboard={paciente.dashboard} />}
        {activeTab === "datos"        && <DatosGeneralesTab datosPersonales={paciente.datosPersonales} direccion={paciente.direccion} contacto={paciente.contacto} datosFiscales={paciente.datosFiscales} />}
        {activeTab === "signos"       && <SignosVitalesTab  signosVitales={paciente.signosVitales} />}
        {activeTab === "citas"        && <CitasTab          citas={paciente.citas} />}
        {activeTab === "visitas"      && <VisitasTab        visitas={paciente.visitas} />}
        {activeTab === "diagnosticos" && <DiagnosticosTab   diagnosticos={paciente.diagnosticos} />}
        {activeTab === "notas"        && <NotasTab          notas={paciente.notas} />}
        {activeTab === "medicamentos" && <MedicamentosTab   medicamentos={paciente.medicamentos} recordatorios={paciente.recordatorios} />}
      </main>
    </div>
  );
}

