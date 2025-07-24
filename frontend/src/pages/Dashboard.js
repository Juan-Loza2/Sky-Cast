"use client"

import { useState, useEffect } from "react"
import TabNavigation from "../components/TabNavigation"
import WRFSection from "../components/WRFSection"
import GasesSection from "../components/GasesSection"
import FWISection from "../components/FWISection"
import VientosSection from "../components/VientosSection"
import { fetchEstadisticas } from "../services/api"
import { motion } from "framer-motion";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("WRF")
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
        className="rounded-2xl shadow-2xl p-6 min-h-[320px] text-white"
        style={{ background: '#243b6b', backdropFilter: 'blur(6px)', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.35)' }}
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
    <div className="space-y-6 animate-fade-in">
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} estadisticas={estadisticas} />
      {renderActiveSection()}
    </div>
  )
}

export default Dashboard
