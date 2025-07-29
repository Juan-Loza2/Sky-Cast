"use client"

import { useState, useEffect } from "react"
import TabNavigation from "../components/TabNavigation"
import WRFSection from "../components/WRFSection"
import GasesSection from "../components/GasesSection"
import FWISection from "../components/FWISection"
import VientosSection from "../components/VientosSection"
import { fetchEstadisticas } from "../services/api"
import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Globe, Facebook, Twitter, Cloud } from "lucide-react"

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(() => {
    // Leer la pestaña activa desde localStorage o usar "WRF" por defecto
    return localStorage.getItem('activeTab') || "WRF"
  })
  const [estadisticas, setEstadisticas] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchEstadisticas()
        setEstadisticas(data)
      } catch (err) {
        setError("Error al cargar las estadísticas")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const renderActiveSection = () => {
    let SectionComponent = null;
    switch (activeTab) {
      case "WRF":
        SectionComponent = <WRFSection />; break;
      case "FWI":
        SectionComponent = <FWISection />; break;
      case "Gases":
        SectionComponent = <GasesSection />; break;
      case "Vientos":
        SectionComponent = <VientosSection />; break;
      default:
        SectionComponent = <WRFSection />;
    }
    return (
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="rounded-2xl shadow-2xl p-6 min-h-[320px] text-[var(--color-text)]"
        style={{ background: '[var(--color-bg)]', backdropFilter: 'blur(6px)', boxShadow: '0 8px 12px 0 rgba(0,0,0,0.35)' }}
      >
        {SectionComponent}
      </motion.div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="text-center py-8">
            <div className="text-red-600 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{error}</h3>
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Reintentar</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 space-y-6 animate-fade-in">
        <TabNavigation 
          activeTab={activeTab} 
          onTabChange={(tab) => {
            setActiveTab(tab);
            localStorage.setItem('activeTab', tab);
          }} 
          estadisticas={estadisticas} 
        />
        {renderActiveSection()}
      </div>
      
      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-[var(--color-bg)] text-[var(--color-text)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg mr-3">
                <Cloud className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[var(--color-text)]">OHMC</h3>
                <p className="text-gray-500 text-sm">Sky cast</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm">
              Observatorio Hidrometeorologico de la Provincia de Cordoba - Monitoreo meteorológico avanzado para la prevención de riesgos ambientales.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-[var(--color-text)] mb-3">Enlaces Rápidos</h3>
              <ul className="space-y-1">
                <li>
                  <a href="/landing" className="text-gray-500 hover:text-gray-700 transition-colors text-sm">
                    Inicio
                  </a>
                </li>
                <li>
                  <a href="/datos-meteorologicos" className="text-gray-500 hover:text-gray-700 transition-colors text-sm">
                    Datos Meteorológicos
                  </a>
                </li>
                <li>
                  <a href="/quienes-somos" className="text-gray-500 hover:text-gray-700 transition-colors text-sm">
                    Quienes Somos
                  </a>
                </li>
                <li>
                  <a href="/" className="text-gray-500 hover:text-gray-700 transition-colors text-sm">
                    Dashboard
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--color-text)] mb-3">Servicios</h3>
              <ul className="space-y-1">
                <li>
                  <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors text-sm">
                    Modelo WRF
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors text-sm">
                    Índice FWI
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors text-sm">
                    Vientos en Rutas
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors text-sm">
                    Gases Atmosféricos
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-[var(--color-border)]">
          <div className="text-center text-gray-500 text-sm">
            © 2025 OHMC - Sky cast. Todos los derechos reservados. Desarrollado con fines educativos.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Dashboard
