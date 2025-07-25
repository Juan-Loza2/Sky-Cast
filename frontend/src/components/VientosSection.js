"use client"

import { useState, useEffect } from "react"
import { Wind, AlertTriangle } from "lucide-react"
import { fetchProductos } from "../services/api"
import { motion } from "framer-motion"

const VientosSection = ({ loading: initialLoading }) => {
  const [producto, setProducto] = useState(null)
  const [loading, setLoading] = useState(initialLoading)

  useEffect(() => {
    loadVientosData()
  }, [])

  const loadVientosData = async () => {
    try {
      setLoading(true)
      const response = await fetchProductos({ tipo: "rutas_caminera" })
      const productos = response.results || response
      setProducto(productos[0] || null)
    } catch (error) {
      console.error("Error loading vientos data:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-2 flex items-center gap-3">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
          <Wind className="h-7 w-7 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Ráfagas de Viento en Rutas</h2>
          <p className="text-blue-100">
            Animación de ráfagas de viento sobre rutas provinciales para apoyo vial. Información actualizada diariamente a las 11:00 UTC para la seguridad en el transporte.
          </p>
        </div>
      </div>

      {/* Wind Scale */}
      <motion.div
        className="rounded-2xl shadow-2xl p-6"
        style={{
          background: 'linear-gradient(120deg, rgba(36,59,107,0.95) 60%, rgba(44,62,80,0.85) 100%)',
          backdropFilter: 'blur(8px)',
          border: '1.5px solid #2b3a5e',
        }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <h3 className="text-lg font-semibold text-white mb-4">💨 Escala de Intensidad del Viento</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-600/20 p-4 rounded-lg border border-green-400">
            <div className="flex items-center space-x-2 mb-2">
              <Wind className="h-5 w-5 text-green-400" />
              <span className="font-semibold text-green-200">Suave</span>
            </div>
            <p className="text-sm text-green-100">0-20</p>
          </div>
          {/* Additional wind scale categories can be added here */}
        </div>
      </motion.div>

      {/* Product Display */}
      {producto && (
        <motion.div
          className="rounded-2xl shadow-2xl p-6"
          style={{
            background: 'linear-gradient(120deg, rgba(36,59,107,0.95) 60%, rgba(44,62,80,0.85) 100%)',
            backdropFilter: 'blur(8px)',
            border: '1.5px solid #2b3a5e',
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Producto de Viento</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-md font-semibold text-blue-200">Nombre</h4>
              <p className="text-white">{producto.nombre}</p>
            </div>
            <div>
              <h4 className="text-md font-semibold text-blue-200">Descripción</h4>
              <p className="text-white">{producto.descripcion}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <motion.div
          className="rounded-2xl shadow-2xl p-6 flex justify-center items-center"
          style={{
            background: 'linear-gradient(120deg, rgba(36,59,107,0.95) 60%, rgba(44,62,80,0.85) 100%)',
            backdropFilter: 'blur(8px)',
            border: '1.5px solid #2b3a5e',
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <span className="text-blue-100">Cargando...</span>
        </motion.div>
      )}

      {/* Error Indicator */}
      {!loading && !producto && (
        <motion.div
          className="rounded-2xl shadow-2xl p-6 flex justify-center items-center"
          style={{
            background: 'linear-gradient(120deg, rgba(36,59,107,0.95) 60%, rgba(44,62,80,0.85) 100%)',
            backdropFilter: 'blur(8px)',
            border: '1.5px solid #2b3a5e',
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
          <span className="text-blue-100">No se pudo cargar la información del viento.</span>
        </motion.div>
      )}
    </div>
  )
}

export default VientosSection
