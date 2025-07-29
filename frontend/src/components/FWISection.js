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
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
          <Flame className="h-7 w-7 text-white" />
        </div>
          <h2 className="text-2xl font-bold text-[var(--color-text)]">Índice de Peligro de Incendio (FWI)</h2>
          <div className="relative">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
            >
              <Info className="h-5 w-5" />
            </button>
            
            <AnimatePresence>
              {showInfo && (
                <motion.div
                  className="absolute top-full right-0 mt-2 w-80 sm:w-96 md:w-[420px] bg-[var(--color-bg)] rounded-xl shadow-2xl border border-[var(--color-border)] z-50 overflow-hidden"
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
                        <h5 className="font-bold text-[var(--color-text)] mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          Componentes del FWI
                        </h5>
                        <div className="grid grid-cols-1 gap-1 sm:gap-2 text-xs sm:text-sm">
                          <div className="flex justify-between items-center py-1 border-b border-blue-200 dark:border-blue-700">
                            <span className="font-semibold text-[var(--color-text)]">FFMC</span>
                            <span className="text-[var(--color-text)]/80 text-xs">Combustible fino</span>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b border-blue-200 dark:border-blue-700">
                            <span className="font-semibold text-[var(--color-text)]">DMC</span>
                            <span className="text-[var(--color-text)]/80 text-xs">Combustible medio</span>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b border-blue-200 dark:border-blue-700">
                            <span className="font-semibold text-[var(--color-text)]">DC</span>
                            <span className="text-[var(--color-text)]/80 text-xs">Combustible grueso</span>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b border-blue-200 dark:border-blue-700">
                            <span className="font-semibold text-[var(--color-text)]">ISI</span>
                            <span className="text-[var(--color-text)]/80 text-xs">Propagación inicial</span>
                          </div>
                          <div className="flex justify-between items-center py-1">
                            <span className="font-semibold text-[var(--color-text)]">BUI</span>
                            <span className="text-[var(--color-text)]/80 text-xs">Combustible disponible</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Factores */}
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-3 sm:p-4">
                        <h5 className="font-bold text-[var(--color-text)] mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Factores Meteorológicos
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-[var(--color-text)]/80">Temperatura</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-[var(--color-text)]/80">Humedad</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-[var(--color-text)]/80">Velocidad del viento</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-[var(--color-text)]/80">Precipitación</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Nota informativa */}
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-2 sm:p-3 border-l-4 border-orange-400">
                        <p className="text-[var(--color-text)] text-xs sm:text-sm font-medium">
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
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-gradient-to-b from-orange-400 to-red-500 rounded-full"></div>
          <h3 className="text-xl font-bold text-[var(--color-text)]">Escala de Riesgo FWI</h3>
        </div>
        
        <div className="flex justify-center">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-6xl">
          {riskLevels.map((risk, index) => (
            <motion.div
              key={index}
              className="group relative h-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.08, duration: 0.5, type: 'spring', stiffness: 100 }}
            >
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 p-3 transition-all duration-300 hover:scale-105 hover:shadow-xl h-full flex flex-col">
                {/* Color indicator */}
                <div className={`absolute top-0 left-0 w-full h-1 ${risk.color} rounded-t-xl`}></div>
                
                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-2 h-2 ${risk.color} rounded-full shadow-md`}></div>
                    <span className="text-xs font-medium text-[var(--color-text)]/60 uppercase tracking-wider">
                      {risk.range}
                    </span>
                  </div>
                  
                  <h4 className="text-sm font-bold text-[var(--color-text)] mb-1">
                    {risk.level}
                  </h4>
                  
                  <p className="text-xs text-[var(--color-text)]/80 leading-tight flex-grow">
                    {risk.description}
                  </p>
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                </div>
              </div>
            </motion.div>
          ))}
          </div>
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
