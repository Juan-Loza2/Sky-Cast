"use client"

import { useState, useEffect } from "react"
import { Flame, AlertTriangle, Info } from "lucide-react"
import { fetchItems } from '../services/api'
import { motion, AnimatePresence } from "framer-motion"
import ZoomableImage from "./ZoomableImage"

const FWISection = ({ loading: initialLoading }) => {
  const [producto, setProducto] = useState(null)
  const [loading, setLoading] = useState(initialLoading)
  const [showInfo, setShowInfo] = useState(false)

  useEffect(() => {
    loadFWIData()
  }, [])

  const loadFWIData = async () => {
    try {
      setLoading(true)
      const response = await fetchItems({ tipo: "FWI" })
      const productos = response.results || response
      setProducto(productos[0] || null)
    } catch (error) {
      console.error("Error loading FWI data:", error)
    } finally {
      setLoading(false)
    }
  }

  const riskLevels = [
    { level: "Bajo", color: "bg-green-500", range: "0-8", description: "Condiciones favorables, riesgo mínimo" },
    { level: "Moderado", color: "bg-yellow-500", range: "9-16", description: "Precaución necesaria" },
    { level: "Alto", color: "bg-orange-500", range: "17-24", description: "Condiciones peligrosas" },
    { level: "Muy Alto", color: "bg-red-500", range: "25-32", description: "Condiciones muy peligrosas" },
    { level: "Extremo", color: "bg-purple-600", range: "33+", description: "Condiciones extremas" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-2">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-gradient-to-r from-orange-500 to-orange-700 p-2 rounded-lg">
            <Flame className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--color-text)]">Índice de Peligro de Incendio (FWI)</h2>
          <div className="relative">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-2 rounded-full bg-gray-600 hover:bg-gray-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-colors duration-200"
            >
              <Info className="h-5 w-5" />
            </button>
            
            <AnimatePresence>
              {showInfo && (
                <motion.div
                  className="absolute top-full right-0 mt-2 w-80 sm:w-96 md:w-[420px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Header con gradiente */}
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 sm:p-4 text-white">
                    <div className="flex items-center gap-2">
                      <Flame className="h-4 w-4 sm:h-5 sm:w-5" />
                      <h4 className="font-bold text-base sm:text-lg">Fire Weather Index (FWI)</h4>
                    </div>
                    <p className="text-blue-100 text-xs sm:text-sm mt-1">Sistema de clasificación del peligro de incendio forestal</p>
                  </div>
                  
                  <div className="p-3 sm:p-4 md:p-5">
                    <div className="space-y-3 sm:space-y-4">
                      {/* Componentes */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-3 sm:p-4">
                        <h5 className="font-bold text-blue-900 dark:text-blue-100 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          Componentes del FWI
                        </h5>
                        <div className="grid grid-cols-1 gap-1 sm:gap-2 text-xs sm:text-sm">
                          <div className="flex justify-between items-center py-1 border-b border-blue-200 dark:border-blue-700">
                            <span className="font-semibold text-blue-800 dark:text-blue-200">FFMC</span>
                            <span className="text-blue-600 dark:text-blue-300 text-xs">Combustible fino</span>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b border-blue-200 dark:border-blue-700">
                            <span className="font-semibold text-blue-800 dark:text-blue-200">DMC</span>
                            <span className="text-blue-600 dark:text-blue-300 text-xs">Combustible medio</span>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b border-blue-200 dark:border-blue-700">
                            <span className="font-semibold text-blue-800 dark:text-blue-200">DC</span>
                            <span className="text-blue-600 dark:text-blue-300 text-xs">Combustible grueso</span>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b border-blue-200 dark:border-blue-700">
                            <span className="font-semibold text-blue-800 dark:text-blue-200">ISI</span>
                            <span className="text-blue-600 dark:text-blue-300 text-xs">Propagación inicial</span>
                          </div>
                          <div className="flex justify-between items-center py-1">
                            <span className="font-semibold text-blue-800 dark:text-blue-200">BUI</span>
                            <span className="text-blue-600 dark:text-blue-300 text-xs">Combustible disponible</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Factores */}
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-3 sm:p-4">
                        <h5 className="font-bold text-green-900 dark:text-green-100 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Factores Meteorológicos
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-green-700 dark:text-green-300">Temperatura</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-green-700 dark:text-green-300">Humedad</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-green-700 dark:text-green-300">Velocidad del viento</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-green-700 dark:text-green-300">Precipitación</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Nota informativa */}
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-2 sm:p-3 border-l-4 border-orange-400">
                        <p className="text-amber-800 dark:text-amber-200 text-xs sm:text-sm font-medium">
                          💡 El FWI evalúa el riesgo de incendios forestales basándose en condiciones meteorológicas actuales y previstas.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Flecha */}
                  <div className="absolute top-0 right-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-blue-500 transform -translate-y-full"></div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <p className="opacity-90">
          El <b>Fire Weather Index (FWI)</b> es un sistema de clasificación numérica del peligro de incendio forestal basado en
          las condiciones meteorológicas.
        </p>
      </div>

      {/* Risk Scale */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">📊 Escala de Riesgo</h3>
        <div className="flex flex-col gap-5 md:grid md:grid-cols-5 md:gap-4">
          {riskLevels.map((risk, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.12, duration: 0.6, type: 'spring', stiffness: 120 }}
            >
              <div
                className={`w-full ${risk.color} text-[var(--color-text)] py-5 px-2 rounded-2xl shadow-xl flex flex-col items-center justify-center mb-2 transition-transform hover:scale-105`}
                style={{ minWidth: 120 }}
              >
                <span className="font-extrabold text-xl md:text-2xl tracking-tight drop-shadow">{risk.level}</span>
                <span className="text-base md:text-lg font-semibold opacity-90">{risk.range}</span>
              </div>
              <p className="text-sm text-[var(--color-text)] font-medium mt-1 md:mt-2 text-center max-w-[180px]">{risk.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FWI Image */}
      <motion.div
        className="rounded-2xl shadow-2xl p-6"
        style={{
          background: '[var(--color-bg)]',
          backdropFilter: 'blur(8px)',
          border: document.documentElement.getAttribute('data-theme') === 'dark' ? '1.5px solid #2b3a5e' : 'none',
        }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
      >
        <div className="flex items-center space-x-3 mb-4">
          <Flame className="h-6 w-6 text-orange-400" />
          <h3 className="text-lg font-semibold text-[var(--color-text)]">Mapa Actual de Peligro de Incendio</h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : producto ? (
          <div className="text-center">
            <ZoomableImage
              src={producto.url_imagen || "/placeholder.svg"}
              alt="Índice de Peligro de Incendio"
              className="max-w-full h-auto rounded-lg shadow-md mx-auto"
            />
            <div className="mt-4 text-sm text-[var(--color-text)]">
              Última actualización: {producto.ultima_fecha || "No disponible"}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-[var(--color-text)]">No hay datos disponibles</p>
            </div>
          </div>
        )}
      </motion.div>




    </div>
  )
}

export default FWISection
