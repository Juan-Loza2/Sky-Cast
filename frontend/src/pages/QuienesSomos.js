import React from "react"
import { Users, Info, Cloud } from "lucide-react"
import { motion } from "framer-motion"
import Header from "../components/Header"

const QuienesSomos = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a174e]">
      <Header />
      <main className="flex flex-col items-center justify-center flex-1 py-12 px-4 pt-32">
        <motion.div
          className="rounded-2xl shadow-2xl p-8 max-w-2xl w-full"
          style={{
            background: 'linear-gradient(120deg, rgba(36,59,107,0.95) 60%, rgba(44,62,80,0.85) 100%)',
            backdropFilter: 'blur(8px)',
            border: '1.5px solid #2b3a5e',
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="flex items-center gap-4 mb-6">
            <Users className="h-10 w-10 text-blue-200" />
            <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow">¿Quiénes Somos?</h1>
          </div>
          <p className="text-blue-100 text-lg mb-6">
            Sky Cast es una plataforma desarrollada por el Observatorio Hidrometeorológico de Córdoba (OHMC) para brindar información meteorológica avanzada, visualizaciones interactivas y monitoreo ambiental en tiempo real para la provincia de Córdoba y la región.
          </p>
          <motion.hr className="border-blue-900/40 my-6" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ delay: 0.5, duration: 0.5 }} />
          <div className="flex items-center gap-3 mb-2">
            <Info className="h-6 w-6 text-blue-300" />
            <h2 className="text-xl font-bold text-white">Nuestro equipo</h2>
          </div>
          <ul className="text-blue-100 text-base list-disc list-inside mb-4">
            <li>Especialistas en meteorología, informática y visualización de datos.</li>
            <li>Comprometidos con la ciencia abierta y el acceso público a la información ambiental.</li>
            <li>Colaboración entre el OHMC, universidades y organismos provinciales.</li>
          </ul>
          <div className="text-blue-200 text-sm mt-4">
            <p>Para más información, contactanos a <a href="mailto:info@ohmc.com" className="underline text-blue-300">info@ohmc.com</a></p>
          </div>
        </motion.div>
      </main>
      {/* Degradé de azul a gris antes del footer */}
      <div className="w-full h-24 bg-gradient-to-b from-[#0a174e] to-[#1e293b]" />
      <footer className="bg-[#1e293b] text-white py-12 w-full mt-auto">
        <div className="grid md:grid-cols-3 gap-8 px-4 sm:px-6 lg:px-8">
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
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Enlaces Rápidos</h4>
            <div className="space-y-2">
              <a href="/" className="block text-gray-400 hover:text-white transition-colors">Inicio</a>
              <a href="/landing" className="block text-gray-400 hover:text-white transition-colors">Landing</a>
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