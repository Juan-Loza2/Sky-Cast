"use client"

import { useState, useEffect } from "react"
import { Calendar, Activity, TrendingUp } from "lucide-react"
import DatePicker from "react-datepicker"
import { format, subDays } from "date-fns"
import { es } from "date-fns/locale"
import { fetchItems } from '../services/api'
import ZoomableImage from "./ZoomableImage"
import "react-datepicker/dist/react-datepicker.css"
import { motion } from "framer-motion"

const GasesSection = ({ loading: initialLoading }) => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(initialLoading)
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  const gasTypes = [
    {
      id: "CO2",
      name: "Dióxido de Carbono",
      symbol: "CO₂",
      filename: "CO2_webvisualizer_v4.png",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      description: "Concentración de CO₂ medida por el analizador Picarro",
    },
    {
      id: "CH4",
      name: "Metano",
      symbol: "CH₄",
      filename: "CH4_webvisualizer_v4.png",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      description: "Concentración de CH₄ medida por el analizador Picarro",
    },
  ]

  useEffect(() => {
    loadGasesData()
  }, [selectedDate])

  const loadGasesData = async () => {
    try {
      setLoading(true)
      const dateStr = format(selectedDate, "yyyy-MM-dd")
      const response = await fetchItems({
        tipo: "MedicionAire",
        fecha: dateStr,
      })

      setProductos(response.results || response)
    } catch (error) {
      console.error("Error loading gases data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getImageForGas = (gasType) => {
    return productos.find((p) => p.nombre_archivo === gasType.filename)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-2 flex items-center gap-3">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
          <Activity className="h-7 w-7 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Medición de Gases de Efecto Invernadero</h2>
          <p className="text-blue-100">
            Visualizaciones diarias de gases de efecto invernadero medidos por el analizador Picarro en el OHMC. Datos actualizados diariamente a las 10:30 h.
          </p>
        </div>
      </div>

      {/* Date Selector custom */}
      <div>
        <div className="flex items-center space-x-3 mb-4">
          <Calendar className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-white">Seleccionar fecha</h3>
        </div>
        <div className="max-w-xs">
          <label className="block text-sm font-medium text-white mb-2">Fecha</label>
          <div className="relative">
            <button
              type="button"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white pr-10 flex items-center gap-2 text-gray-900 text-left"
              onClick={() => setShowDateDropdown((v) => !v)}
            >
              <Calendar className="h-5 w-5 text-blue-600 mr-2" />
              <span>{format(selectedDate, "dd/MM/yyyy", { locale: es })}</span>
            </button>
            {showDateDropdown && (
              <div className="absolute z-50 mt-2 w-full rounded-lg p-0 shadow-xl">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => { setSelectedDate(date); setShowDateDropdown(false); }}
                  dateFormat="dd/MM/yyyy"
                  locale={es}
                  maxDate={new Date()}
                  minDate={subDays(new Date(), 30)}
                  inline
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gas Visualizations */}
      <div className="flex flex-col md:grid md:grid-cols-2 gap-6 px-2 md:px-0 max-w-4xl mx-auto w-full">
        {gasTypes.map((gasType) => {
          const producto = getImageForGas(gasType)
          return (
            <motion.div
              key={gasType.id}
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
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${gasType.bgColor} border ${gasType.borderColor}`}>
                  <Activity className={`h-6 w-6 ${gasType.color}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{gasType.name}</h3>
                  <p className="text-sm text-blue-200">{gasType.symbol}</p>
                </div>
              </div>
              <p className="text-sm text-blue-100 mb-4">{gasType.description}</p>
              {loading ? (
                <div className="flex items-center justify-center h-64 bg-gray-900/30 rounded-lg">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : producto ? (
                <div>
                  <ZoomableImage
                    src={producto.url_imagen}
                    alt={`${gasType.name} - ${format(selectedDate, "dd/MM/yyyy")}`}
                    className="w-full"
                  />
                  <div className="mt-3 text-sm text-blue-100 bg-blue-900/30 p-2 rounded">
                    Última actualización: {producto.ultima_fecha || "No disponible"}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 bg-gray-900/30 rounded-lg border-2 border-dashed border-blue-900/40">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-blue-400 mx-auto mb-2" />
                    <p className="text-blue-200">No hay datos disponibles para esta fecha</p>
                  </div>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Info Panel */}
      <motion.div
        className="rounded-2xl p-6 border border-blue-400 shadow-xl"
        style={{
          background: 'linear-gradient(120deg, rgba(36,59,107,0.15) 60%, rgba(44,62,80,0.10) 100%)',
          backdropFilter: 'blur(2px)',
        }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
      >
        <h3 className="text-lg font-semibold text-blue-200 mb-3">ℹ️ Información sobre las mediciones</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-100">
          <div>
            <h4 className="font-semibold mb-2">Dióxido de Carbono (CO₂)</h4>
            <p>
              Principal gas de efecto invernadero. Las mediciones muestran las variaciones diarias de concentración en la atmósfera local.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Metano (CH₄)</h4>
            <p>
              Segundo gas de efecto invernadero más importante. Tiene un potencial de calentamiento global mayor que el CO₂.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default GasesSection
