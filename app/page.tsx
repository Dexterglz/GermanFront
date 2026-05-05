"use client"

import {
  ClipboardList,
  Shield,
  Clock,
  Users,
  FileText,
  Activity,
  Heart,
  ChevronRight,
  Menu,
  X,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion"

// Hook para animaciones al hacer scroll
function useScrollAnimation(threshold = 0.2) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: threshold })
  return { ref, isInView }
}

// Partículas flotantes para el hero
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-primary/20 rounded-full"
          animate={{
            y: [0, -20, 0],
            x: [0, 20, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + i * 10}%`,
          }}
        />
      ))}
    </div>
  )
}

// Contador animado
function AnimatedCounter({ end }: { end: number }) {
  const [count, setCount] = useState(0)
  const nodeRef = useRef(null)
  const { isInView: inView } = useScrollAnimation()

  useEffect(() => {
    if (!inView) return

    let current = 0
    const increment = end / 30
    const timer = setInterval(() => {
      current += increment
      if (current >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, 30)

    return () => clearInterval(timer)
  }, [end, inView])

  return (
    <div ref={nodeRef}>
      {count}
      <span className="text-primary">+</span>
    </div>
  )
}

// Sección Hero con Background Animado
function HeroSection() {
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background to-accent/5 pt-20">
      <FloatingParticles />

      {/* Círculos de fondo animados */}
      <motion.div
        className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
        animate={{
          y: [0, 30, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
        animate={{
          y: [0, -40, 0],
          x: [0, -20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance"
        >
          Tu{" "}
          <motion.span
            className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ["0%", "100%", "0%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          >
            Clínica Digital
          </motion.span>
          <br /> Comienza Hoy
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-xl text-muted-foreground mb-8 text-balance max-w-2xl mx-auto"
        >
          Gestiona expedientes clínicos electrónicos de forma segura, rápida y
          confiable. La solución integral para modernizar tu atención médica.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors shadow-lg"
          >
            Comenzar Ahora
          </motion.button>
      
        </motion.div>

        {/* Estadísticas animadas */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="grid grid-cols-3 gap-6 mt-12 max-w-2xl mx-auto"
        >
          {[
            { label: "Clínicas Activas", value: 250 },
            { label: "Pacientes", value: 50000 },
            { label: "Expedientes", value: 150000 },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 + idx * 0.1, ease: "easeOut" }}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                <AnimatedCounter end={stat.value} />
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

// Header con navegación
function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()
  const headerBg = useTransform(
    scrollY,
    [0, 100],
    ["rgba(248, 250, 252, 0)", "rgba(248, 250, 252, 0.95)"]
  )

  return (
    <motion.header
      style={{ backgroundColor: headerBg }}
      className="fixed top-0 w-full z-50 border-b border-border/50 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ rotate: 5 }}
            className="flex items-center gap-2 font-bold text-xl text-primary"
          >
            <Heart className="w-6 h-6" />
            Expediente Clínico
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
{["Nosotros", "Características", "Precios", "Términos", "Contacto"].map(
              (item) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  whileHover={{ y: -2 }}
                  className="text-foreground hover:text-primary transition-colors"
                >
                  {item}
                </motion.a>
              )
            )}
          </nav>

          {/* Desktop Buttons */}
            <div className="hidden md:flex items-center gap-4">
      <Link href="/login">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 text-primary hover:bg-primary/5 rounded-lg transition-colors"
        >
          Iniciar Sesión
        </motion.button>
      </Link>
    </div>
    
          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border"
            >
              <div className="px-4 py-4 space-y-3">
{["Nosotros", "Características", "Precios", "Términos", "Contacto"].map(
                  (item) => (
                    <motion.a
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      whileHover={{ x: 4 }}
                      className="block text-foreground hover:text-primary py-2"
                    >
                      {item}
                    </motion.a>
                  )
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold mt-4"
                >
                  Prueba Gratis
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}

// Sección Nosotros
function AboutUsSection() {
  const { ref, isInView } = useScrollAnimation()

  return (
    <section
      ref={ref}
      id="nosotros"
      className="py-20 bg-gradient-to-b from-background to-secondary/30"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
          className="text-center mb-16"
        >
          <motion.h2
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance"
          >
            Nosotros
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance"
          >
            Transformamos la manera en que los profesionales de la salud
            gestionan la información de sus pacientes
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Nuestra Misión
              </h3>
              <p className="text-muted-foreground">
                Digitalizar la atención médica mediante tecnología accesible,
                segura y confiable que mejore la experiencia de médicos y
                pacientes.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Nuestros Valores
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                {["Innovación", "Seguridad", "Confiabilidad", "Accesibilidad"].map(
                  (value) => (
                    <motion.li
                      key={value}
                      whileHover={{ x: 8 }}
                      className="flex items-center gap-3"
                    >
                      <span className="w-2 h-2 bg-primary rounded-full" />
                      {value}
                    </motion.li>
                  )
                )}
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { icon: Shield, label: "100% Seguro" },
              { icon: Clock, label: "Acceso 24/7" },
              { icon: Users, label: "Equipo Experto" },
              { icon: Activity, label: "Soporte Activo" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05, y: -8 }}
                className="p-6 bg-white rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <item.icon className="w-8 h-8 text-primary mb-3" />
                <p className="font-semibold text-foreground">{item.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Sección Acerca de la App
function AboutAppSection() {
  const { ref, isInView } = useScrollAnimation()

  return (
    <section
      ref={ref}
      id="características"
      className="py-20 bg-background"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
          className="text-center mb-16"
        >
          <motion.h2
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance"
          >
            Acerca de Nuestra App
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance"
          >
            Descubre todas las características que hacen de MediRecord la
            solución ideal para tu clínica
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
          className="grid md:grid-cols-3 gap-8"
        >
          {[
            {
              icon: ClipboardList,
              title: "Expedientes Digitales",
              description: "Acceso rápido a toda la información médica de tus pacientes",
            },
            {
              icon: Shield,
              title: "Seguridad de Datos",
              description: "Encriptación de nivel empresarial y cumplimiento HIPAA",
            },
            {
              icon: Clock,
              title: "Disponibilidad 24/7",
              description: "Tu clínica siempre en línea, en cualquier momento",
            },
            {
              icon: Users,
              title: "Multiusuario",
              description: "Colaboración segura entre tu equipo médico",
            },
            {
              icon: FileText,
              title: "Historial Completo",
              description: "Registro detallado de todos los encuentros clínicos",
            },
            {
              icon: Activity,
              title: "Reportes Avanzados",
              description: "Análisis y estadísticas de tu práctica médica",
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
              whileHover={{
                y: -8,
                boxShadow: "0 20px 30px rgba(0, 0, 0, 0.1)",
              }}
              className="p-8 bg-white rounded-xl border border-border shadow-sm transition-all cursor-pointer"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="mb-4"
              >
                <feature.icon className="w-10 h-10 text-primary" />
              </motion.div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// Sección Features Detalladas
function FeaturesSection() {
  const { ref, isInView } = useScrollAnimation()

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-background to-accent/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
          className="text-center mb-16"
        >
          <motion.h2
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance"
          >
            Funcionalidades Principales
          </motion.h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
          className="space-y-6"
        >
          {[
            "Registro integral de pacientes con datos personales y médicos",
            "Notas clínicas estructuradas con plantillas personalizables",
            "Prescripciones electrónicas con seguimiento de medicamentos",
            "Agenda de citas interactiva con recordatorios automáticos",
            "Interconsultas y referencias entre profesionales",
            "Portal de pacientes para acceso seguro a sus registros",
            "Alertas y avisos de medicamentos contraindicados",
            "Generación de reportes y auditorías de cumplimiento",
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ x: 8 }}
              className="flex items-start gap-4 p-4 rounded-lg hover:bg-accent/5 transition-colors cursor-pointer"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0 mt-1"
              >
                {idx + 1}
              </motion.div>
              <p className="text-lg text-foreground pt-1">{feature}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// Sección CTA
function CTASection() {
  const { ref, isInView } = useScrollAnimation()

  return (
    <section ref={ref} className="relative py-20 overflow-hidden">
      {/* Círculos animados de fondo */}
      <motion.div
        className="absolute top-10 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl"
        animate={{
          y: [0, 40, 0],
          x: [0, -20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-80 h-80 bg-accent/20 rounded-full blur-3xl"
        animate={{
          y: [0, -40, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
          className="bg-gradient-to-r from-primary to-accent rounded-2xl p-12 text-center text-white shadow-2xl"
        >
          <motion.h2
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl font-bold mb-4 text-balance"
          >
            ¿Listo para Transformar tu Clínica?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl mb-8 text-balance opacity-90"
          >
            Únete a cientos de clínicas que ya están digitalizando sus
            expedientes con MediRecord
          </motion.p>
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-4 bg-white text-primary rounded-lg font-bold text-lg hover:shadow-lg transition-shadow"
          >
            Comenzar
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

// Sección de Términos y Condiciones
function TermsSection() {
  const { ref, isInView } = useScrollAnimation()
  const [expandedTerm, setExpandedTerm] = useState<number | null>(null)

  const terms = [
    {
      title: "1. Aceptación de los Términos",
      content: "Al acceder y utilizar MediRecord, usted acepta estar sujeto a estos Términos y Condiciones de uso, todas las leyes y regulaciones aplicables, y acepta que es responsable del cumplimiento de las leyes locales aplicables. Si no está de acuerdo con alguno de estos términos, tiene prohibido usar o acceder a este sitio. Los materiales contenidos en este sitio web están protegidos por las leyes de derechos de autor y marcas comerciales aplicables."
    },
    {
      title: "2. Uso de la Licencia",
      content: "Se concede permiso para descargar temporalmente una copia de los materiales (información o software) en el sitio web de MediRecord para visualización transitoria personal y no comercial únicamente. Esta es la concesión de una licencia, no una transferencia de título, y bajo esta licencia usted no puede: modificar o copiar los materiales; usar los materiales para cualquier propósito comercial o para cualquier exhibición pública; intentar descompilar o realizar ingeniería inversa de cualquier software contenido en el sitio web de MediRecord."
    },
    {
      title: "3. Privacidad y Protección de Datos",
      content: "MediRecord se compromete a proteger la privacidad de los datos de sus usuarios conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) y normativas de salud aplicables. Los expedientes clínicos electrónicos son tratados con estricta confidencialidad. Implementamos medidas de seguridad técnicas, administrativas y físicas para proteger la información contra acceso no autorizado, alteración, divulgación o destrucción."
    },
    {
      title: "4. Responsabilidades del Usuario",
      content: "El usuario es responsable de mantener la confidencialidad de su cuenta y contraseña. Usted acepta notificar inmediatamente a MediRecord sobre cualquier uso no autorizado de su cuenta. El usuario es completamente responsable de todas las actividades que ocurran bajo su cuenta. MediRecord no será responsable de ninguna pérdida que pueda incurrir como resultado del uso de su contraseña o cuenta por parte de un tercero."
    },
    {
      title: "5. Confidencialidad Médica",
      content: "Toda la información médica almacenada en MediRecord está sujeta a las disposiciones de la NOM-024-SSA3-2012 para el intercambio de información en salud y otras normativas aplicables. Los profesionales de la salud que utilicen la plataforma deben cumplir con el secreto profesional médico y las obligaciones éticas de su profesión. El acceso a expedientes clínicos está restringido únicamente al personal autorizado."
    },
    {
      title: "6. Disponibilidad del Servicio",
      content: "MediRecord se esfuerza por mantener el servicio disponible las 24 horas del día, los 7 días de la semana. Sin embargo, no garantizamos que el servicio sea ininterrumpido o libre de errores. Nos reservamos el derecho de suspender temporalmente el servicio para mantenimiento, actualizaciones o por causas de fuerza mayor. En caso de interrupciones programadas, se notificará a los usuarios con anticipación."
    },
    {
      title: "7. Propiedad Intelectual",
      content: "Todos los contenidos, diseños, logos, marcas y software de MediRecord son propiedad exclusiva de Equipo Umisumi o sus licenciantes. Está prohibida la reproducción, distribución, modificación o uso de cualquier material sin autorización previa por escrito. Los expedientes clínicos generados pertenecen al paciente y al profesional de salud tratante conforme a la legislación aplicable."
    },
    {
      title: "8. Limitación de Responsabilidad",
      content: "MediRecord es una herramienta de gestión de expedientes clínicos y no proporciona asesoramiento médico. Las decisiones clínicas son responsabilidad exclusiva del profesional de salud. En ningún caso MediRecord, sus directores, empleados o afiliados serán responsables por daños directos, indirectos, incidentales, especiales o consecuentes que resulten del uso o la imposibilidad de usar el servicio."
    },
    {
      title: "9. Modificaciones a los Términos",
      content: "MediRecord se reserva el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio web. El uso continuado del servicio después de cualquier cambio constituye su aceptación de los nuevos términos. Se recomienda revisar periódicamente esta página para estar informado de cualquier actualización."
    },
    {
      title: "10. Cancelación y Terminación",
      content: "Usted puede cancelar su cuenta en cualquier momento contactando a nuestro equipo de soporte. MediRecord se reserva el derecho de suspender o terminar su acceso al servicio sin previo aviso si incumple estos términos. En caso de terminación, se proporcionará acceso temporal para la exportación de datos conforme a las obligaciones legales de conservación de expedientes clínicos."
    },
  ]

  return (
    <section
      ref={ref}
      id="terminos"
      className="py-20 bg-gradient-to-b from-background to-secondary/30"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
          className="text-center mb-16"
        >
          <motion.h2
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance"
          >
            Términos y Condiciones
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance"
          >
            Lea detenidamente los siguientes términos antes de utilizar nuestros servicios
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          className="space-y-4"
        >
          {terms.map((term, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="bg-white rounded-xl border border-border overflow-hidden shadow-sm"
            >
              <motion.button
                onClick={() => setExpandedTerm(expandedTerm === idx ? null : idx)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-accent/5 transition-colors"
                whileHover={{ x: 4 }}
              >
                <span className="font-semibold text-foreground">{term.title}</span>
                <motion.div
                  animate={{ rotate: expandedTerm === idx ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="w-5 h-5 text-primary" />
                </motion.div>
              </motion.button>
              <AnimatePresence>
                {expandedTerm === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 pt-2 text-muted-foreground leading-relaxed border-t border-border/50">
                      {term.content}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 p-6 bg-primary/5 rounded-xl border border-primary/20"
        >
          <div className="flex items-start gap-4">
            <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-foreground mb-2">Compromiso con tu Seguridad</h4>
              <p className="text-muted-foreground text-sm">
                En MediRecord nos tomamos muy en serio la protección de tus datos. Cumplimos con todas las normativas de salud y protección de datos aplicables. Si tienes alguna duda sobre estos términos, no dudes en contactarnos.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-muted-foreground mt-8"
        >
          Última actualización: Abril 2026
        </motion.p>
      </div>
    </section>
  )
}

// Footer
function Footer() {
  const { ref, isInView } = useScrollAnimation()

  return (
    <footer ref={ref} className="bg-foreground text-white py-12 border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
          className="grid md:grid-cols-4 gap-8 mb-12"
        >
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Expediente Clínico
            </h3>
            <p className="text-gray-300 text-sm">
              Transformando la atención médica a través de la tecnología
            </p>
          </motion.div>

{[
            {
              title: "Producto",
              links: [
                { name: "Características", href: "#características" },
                { name: "Precios", href: "#precios" },
                { name: "Seguridad", href: "#nosotros" },
              ],
            },
            {
              title: "Empresa",
              links: [
                { name: "Nosotros", href: "#nosotros" },
                { name: "Blog", href: "#" },
                { name: "Contacto", href: "#contacto" },
                { name: "Soporte", href: "#" },
              ],
            },
            {
              title: "Legal",
              links: [
                { name: "Privacidad", href: "#terminos" },
                { name: "Términos y Condiciones", href: "#terminos" },
              ],
            },
          ].map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
              transition={{ duration: 0.6, delay: (idx + 1) * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <h3 className="font-bold text-lg mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <motion.li
                    key={link.name}
                    whileHover={{ x: 4 }}
                    className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <a href={link.href}>{link.name}</a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="border-t border-gray-700 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-gray-400 text-sm">
            © 2026 Equipo Umisumi. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            {["Facebook","Instagram"].map((social) => (
              <motion.a
                key={social}
                whileHover={{ y: -2 }}
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                {social}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

// Página Principal
export default function Home() {
  return (
    <main className="overflow-hidden">
<Header />
      <HeroSection />
      <AboutUsSection />
      <AboutAppSection />
      <FeaturesSection />
      <TermsSection />
      <CTASection />
      <Footer />
    </main>
  )
}
