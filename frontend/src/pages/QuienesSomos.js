import React from "react"
import { Users, Info, Cloud, Globe, Database, Shield, Award, Mail, MapPin, Clock } from "lucide-react"
import { motion } from "framer-motion"
import Header from "../components/Header"

const QuienesSomos = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      <Header />
      <main className="flex-1 py-12 px-4 pt-32">
        <div className="max-w-6xl mx-auto">
          
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full mb-6"
            >
              <Users className="h-10 w-10 text-white" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-5xl md:text-6xl font-extrabold text-[var(--color-text)] tracking-tight mb-6"
            >
              ¿Quiénes Somos?
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-xl md:text-2xl text-[var(--color-text)]/80 max-w-4xl mx-auto leading-relaxed"
            >
              Sky Cast es una plataforma desarrollada por el Observatorio Hidrometeorológico de Córdoba (OHMC) para brindar información meteorológica avanzada, visualizaciones interactivas y monitoreo ambiental en tiempo real para la provincia de Córdoba y la región.
            </motion.p>
          </motion.div>

          {/* Misión y Visión */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="grid md:grid-cols-2 gap-8 mb-16"
          >
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="relative p-8 rounded-2xl bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border border-blue-500/30 overflow-hidden group"
            >
              {/* Efecto de brillo */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.1, type: "spring" }}
                  className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6"
                >
                  <Globe className="h-8 w-8 text-white" />
                </motion.div>
                
                <h3 className="text-2xl font-bold text-[var(--color-text)] mb-4">Nuestra Misión</h3>
                <p className="text-[var(--color-text)]/80 text-lg leading-relaxed">
                  Democratizar el acceso a la información meteorológica de alta calidad, proporcionando herramientas innovadoras para la toma de decisiones informadas en materia ambiental y climática.
                </p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="relative p-8 rounded-2xl bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 overflow-hidden group"
            >
              {/* Efecto de brillo */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.3, type: "spring" }}
                  className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6"
                >
                  <Shield className="h-8 w-8 text-white" />
                </motion.div>
                
                <h3 className="text-2xl font-bold text-[var(--color-text)] mb-4">Nuestra Visión</h3>
                <p className="text-[var(--color-text)]/80 text-lg leading-relaxed">
                  Ser líderes en la innovación tecnológica aplicada a la meteorología, contribuyendo al desarrollo sostenible y la resiliencia climática de nuestra región.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Equipo y Especialidades */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="mb-16"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-[var(--color-text)] mb-4">Nuestro Equipo</h2>
              <p className="text-xl text-[var(--color-text)]/70 max-w-3xl mx-auto">
                Especialistas comprometidos con la excelencia científica y la innovación tecnológica
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Database,
                  title: "Meteorología Avanzada",
                  description: "Especialistas en meteorología, informática y visualización de datos con años de experiencia en el campo.",
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  icon: Award,
                  title: "Ciencia Abierta",
                  description: "Comprometidos con la ciencia abierta y el acceso público a la información ambiental para todos.",
                  color: "from-green-500 to-emerald-500"
                },
                {
                  icon: Users,
                  title: "Colaboración",
                  description: "Colaboración entre el OHMC y un grupo de estudiantes de programación del Instituto Técnico Salesiano Villada para el desarrollo y la integración de datos en conjunto.",
                  color: "from-purple-500 to-pink-500"
                }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 + index * 0.2, duration: 0.6 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className={`relative p-8 rounded-2xl overflow-hidden group ${
                    index === 0 
                      ? 'bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border border-blue-500/30' 
                      : index === 1 
                        ? 'bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30'
                        : 'bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border border-emerald-500/30'
                  }`}
                >
                  {/* Efecto de brillo */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  <div className="relative z-10 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.7 + index * 0.2, type: "spring" }}
                      className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mx-auto mb-4`}
                    >
                      <item.icon className="h-8 w-8 text-white" />
                    </motion.div>
                    
                    <h3 className="text-xl font-bold text-[var(--color-text)] mb-3">{item.title}</h3>
                    <p className="text-[var(--color-text)]/70 leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Información de Contacto */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 0.8 }}
            className="relative p-8 rounded-2xl bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border border-blue-500/30 overflow-hidden group"
          >
            {/* Efecto de brillo */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            <div className="relative z-10 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.9, type: "spring" }}
                className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Mail className="h-10 w-10 text-white" />
              </motion.div>
              
              <h3 className="text-2xl font-bold text-[var(--color-text)] mb-4">Contáctanos</h3>
              <p className="text-[var(--color-text)]/80 text-lg mb-6">
                Para más información sobre nuestros servicios y colaboraciones
              </p>
              
              <motion.a
                href="mailto:info@ohmc.com"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Mail className="h-5 w-5" />
                info@ohmc.com
              </motion.a>
            </div>
          </motion.div>
        </div>
      </main>
      {/* Degradé de azul a gris antes del footer */}
      <footer className="bg-[var(--color-bg)] text-[var(--color-text)] py-12 w-full mt-auto">
        <div className="grid md:grid-cols-2 gap-8 px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <Cloud className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">OHMC</h3>
                <p className="text-gray-400 text-sm">Sky cast</p>
              </div>
            </div>
            <p className="text-gray-400">
              Observatorio Hidrometeorologico de la Provincia de Cordoba - Monitoreo meteorológico avanzado para la prevención de riesgos ambientales.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Enlaces Rápidos</h4>
              <div className="space-y-2">
                <a href="/landing" className="block text-gray-400 hover:text-white transition-colors">Inicio</a>
                <a href="/datos-meteorologicos" className="block text-gray-400 hover:text-white transition-colors">Datos Meteorológicos</a>
                <a href="/quienes-somos" className="block text-gray-400 hover:text-white transition-colors">Quienes Somos</a>
                <a href="/" className="block text-gray-400 hover:text-white transition-colors">Dashboard</a>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Servicios</h4>
              <div className="space-y-2">
                <p className="text-gray-400">Modelo WRF</p>
                <p className="text-gray-400">Índice FWI</p>
                <p className="text-gray-400">Vientos en Rutas</p>
                <p className="text-gray-400">Gases Atmosféricos</p>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center px-4 sm:px-6 lg:px-8">
          <p className="text-gray-400">
            © {new Date().getFullYear()} OHMC - Sky cast. Todos los derechos reservados. Desarrollado con fines educativos.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default QuienesSomos 