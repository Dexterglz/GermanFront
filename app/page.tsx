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
            Extraño a mi ex 
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {["Nosotros", "Características", "Precios", "Contacto"].map(
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
                {["Nosotros", "Características", "Precios", "Contacto"].map(
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
              Extraño a mi ex 
            </h3>
            <p className="text-gray-300 text-sm">
              Transformando la atención médica a través de la tecnología
            </p>
          </motion.div>

          {[
            {
              title: "Producto",
              links: [
                "Características",
                "Precios",
                "Seguridad",
              ],
            },
            {
              title: "Empresa",
              links: ["Nosotros", "Blog", "Contacto", "Soporte"],
            },
            {
              title: "Legal",
              links: [
                "Privacidad",
                "Términos",
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
                    key={link}
                    whileHover={{ x: 4 }}
                    className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {link}
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
      <CTASection />
      <Footer />
    </main>
  )
}
