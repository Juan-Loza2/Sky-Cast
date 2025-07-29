"use client"

import { useState, useEffect } from "react"
import { Calendar, Activity, TrendingUp, Info } from "lucide-react"
import DatePicker from "react-datepicker"
import { format, subDays } from "date-fns"
import { es } from "date-fns/locale"
import { fetchItems } from '../services/api'
import ZoomableImage from "./ZoomableImage"
import "react-datepicker/dist/react-datepicker.css"
import { motion, AnimatePresence } from "framer-motion"

const GasesSection = ({ loading: initialLoading }) => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(initialLoading)
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showInfo, setShowInfo] = useState(false)

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
      <div className="mb-2">
        <div className="flex items-center gap-3 mb-3">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
          <Activity className="h-7 w-7 text-white" />
        </div>
          <h2 className="text-2xl font-bold text-[var(--color-text)]">Medición de Gases de Efecto Invernadero</h2>
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
                      <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
                      <h4 className="font-bold text-base sm:text-lg">Gases de Efecto Invernadero</h4>
                    </div>
                    <p className="text-blue-100 text-xs sm:text-sm mt-1">Mediciones atmosféricas con analizador Picarro</p>
                  </div>
                  
                  <div className="p-3 sm:p-4 md:p-5">
                    <div className="space-y-3 sm:space-y-4">
                      {/* CO2 */}
                      <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg p-3 sm:p-4">
                        <h5 className="font-bold text-red-900 dark:text-red-100 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          Dióxido de Carbono (CO₂)
                        </h5>
                        <p className="text-red-700 dark:text-red-300 text-xs sm:text-sm">
                          Principal gas de efecto invernadero. Las mediciones muestran las variaciones diarias de concentración en la atmósfera local.
                        </p>
                      </div>
                      
                      {/* CH4 */}
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-3 sm:p-4">
                        <h5 className="font-bold text-green-900 dark:text-green-100 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Metano (CH₄)
                        </h5>
                        <p className="text-green-700 dark:text-green-300 text-xs sm:text-sm">
                          Segundo gas de efecto invernadero más importante. Tiene un potencial de calentamiento global mayor que el CO₂.
                        </p>
                      </div>
                      
                      {/* Información técnica */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-3 sm:p-4">
                        <h5 className="font-bold text-blue-900 dark:text-blue-100 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          Información Técnica
                        </h5>
                        <div className="space-y-2 text-xs sm:text-sm text-blue-700 dark:text-blue-300">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                            <span>Analizador: Picarro</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                            <span>Actualización: Diaria a las 10:30 h</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                            <span>Ubicación: OHMC</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Nota informativa */}
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-2 sm:p-3 border-l-4 border-orange-400">
                        <p className="text-amber-800 dark:text-amber-200 text-xs sm:text-sm font-medium">
                          💡 Los gases de efecto invernadero son fundamentales para entender el cambio climático y sus impactos en el medio ambiente.
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
          Visualizaciones diarias de gases de efecto invernadero medidos por el <b>analizador Picarro</b> en el OHMC. Datos actualizados diariamente a las 10:30 h.
        </p>
      </div>

      {/* Date Selector custom */}
      <div>
        <div className="flex items-center space-x-3 mb-4">
          <Calendar className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-[var(--color-text)]">Seleccionar fecha</h3>
        </div>
        <div className="max-w-xs">
          <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Fecha</label>
          <div className="relative">
            <button
              type="button"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-[var(--color-bg)] pr-10 flex items-center gap-2 text-[var(--color-text)] text-left"
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
                background: '[var(--color-bg)]',
                backdropFilter: 'blur(8px)',
                border: document.documentElement.getAttribute('data-theme') === 'dark' ? '1.5px solid #2b3a5e' : 'none',
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
                  <h3 className="text-lg font-semibold text-[var(--color-text)]">{gasType.name}</h3>
                  <p className="text-sm text-[var(--color-text)]-200">{gasType.symbol}</p>
                </div>
              </div>
              <p className="text-sm text-[var(--color-text)] mb-4">{gasType.description}</p>
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
                  <div className="mt-3 text-sm text-[var(--color-text)] bg-[var(--color-bg)] p-2 rounded">
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


    </div>
  )
}

export default GasesSection
