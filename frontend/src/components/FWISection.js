"use client"

import { useState, useEffect } from "react"
import { Flame, AlertTriangle, Info } from "lucide-react"
import { fetchItems } from '../services/api'
import { motion } from "framer-motion"
import ZoomableImage from "./ZoomableImage"

const FWISection = ({ loading: initialLoading }) => {
  const [producto, setProducto] = useState(null)
  const [loading, setLoading] = useState(initialLoading)

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
      <div className="mb-2 flex items-center gap-3">
        <div className="bg-gradient-to-r from-orange-500 to-orange-700 p-2 rounded-lg">
          <Flame className="h-7 w-7 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-text)] mb-1">Índice de Peligro de Incendio (FWI)</h2>
          <p className="text-[var(--color-text)]-100">
            El Fire Weather Index (FWI) es un sistema de clasificación numérica del peligro de incendio forestal basado en
            las condiciones meteorológicas. 
          </p>
        </div>
      </div>

      {/* Risk Scale */}
      <motion.div
        className="rounded-2xl shadow-2xl p-6"
        style={{
          background: '[var(--color-bg)]',
          backdropFilter: 'blur(8px)',
          border: '1.5px solid #2b3a5e',
        }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
      >
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
      </motion.div>

      {/* FWI Image */}
      <motion.div
        className="rounded-2xl shadow-2xl p-6"
        style={{
          background: '[var(--color-bg)]',
          backdropFilter: 'blur(8px)',
          border: '1.5px solid #2b3a5e',
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

      {/* Information Panel */}
      <motion.div
        className="rounded-2xl p-6 border border-orange-400 shadow-xl"
        style={{
          background: 'linear-gradient(120deg, rgba(255,140,0,0.10) 60%, rgba(255,255,255,0.05) 100%)',
          backdropFilter: 'blur(2px)',
        }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
      >
        <div className="flex items-start space-x-3">
          <Info className="h-6 w-6 text-orange-600 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-orange-700 mb-3">Información sobre el FWI</h3>
            <div className="space-y-2 text-sm text-orange-700">
              <p>
                <strong>Componentes del FWI:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  <strong>FFMC:</strong> Contenido de humedad del combustible fino
                </li>
                <li>
                  <strong>DMC:</strong> Contenido de humedad del combustible medio
                </li>
                <li>
                  <strong>DC:</strong> Contenido de humedad del combustible grueso
                </li>
                <li>
                  <strong>ISI:</strong> Índice de propagación inicial
                </li>
                <li>
                  <strong>BUI:</strong> Índice de combustible disponible
                </li>
              </ul>
              <p className="mt-3">
                <strong>Factores considerados:</strong> Temperatura, humedad relativa, velocidad del viento y
                precipitación.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default FWISection
