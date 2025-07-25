"use client"

import { useState, useEffect } from "react"
import {
  Calendar,
  Thermometer,
  CloudRain,
  Wind,
  Droplets,
  AlertTriangle,
  Activity,
  Zap,
  Eye,
  Snowflake,
  ChevronDown,
} from "lucide-react"
import DatePicker from "react-datepicker"
import { format, subDays, addDays } from "date-fns"
import { es } from "date-fns/locale"
import { fetchProductos } from "../services/api"
import ZoomableImage from "./ZoomableImage"
import HourSelector from "./HourSelector"
import "react-datepicker/dist/react-datepicker.css"
import { motion } from "framer-motion"

const WRFSection = ({ loading: initialLoading }) => {
  const [selectedDate, setSelectedDate] = useState(subDays(new Date(), 1))
  const [selectedTime, setSelectedTime] = useState("12:00")
  const [selectedVariable, setSelectedVariable] = useState("t2")
  const [productos, setProductos] = useState([])
  const [allProductos, setAllProductos] = useState([]) // Productos de múltiples días
  const [availableHours, setAvailableHours] = useState([])
  const [loading, setLoading] = useState(initialLoading)
  const [currentImage, setCurrentImage] = useState(null)
  const [debugInfo, setDebugInfo] = useState("")
  const [showVariableDropdown, setShowVariableDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  // TODAS las variables WRF disponibles según el JSON
  const variables = [
    {
      id: "t2",
      name: "Temperatura a 2m",
      icon: Thermometer,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      description: "Temperatura del aire a 2 metros sobre el suelo (°C)",
      category: "Temperatura",
    },
    {
      id: "cl",
      name: "Cobertura Nubosa",
      icon: Eye,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      description: "Fracción de cobertura nubosa total",
      category: "Nubes",
    },
    {
      id: "ctt",
      name: "Temperatura Tope Nubes",
      icon: CloudRain,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      description: "Temperatura en el tope de las nubes (°C)",
      category: "Nubes",
    },
    {
      id: "dbz_altura",
      name: "Reflectividad en Altura",
      icon: Activity,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      description: "Simulación de reflectividad radar (dBZ) a diferentes niveles",
      category: "Radar",
    },
    {
      id: "hail",
      name: "Granizo",
      icon: Snowflake,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200",
      description: "Probabilidad o intensidad de granizo",
      category: "Precipitación",
    },
    {
      id: "max_dbz",
      name: "Reflectividad Máxima",
      icon: Zap,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      description: "Máxima reflectividad radar en la columna (dBZ)",
      category: "Radar",
    },
    {
      id: "mcape",
      name: "CAPE Máximo",
      icon: Activity,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      description: "Energía potencial convectiva disponible máxima (J/kg)",
      category: "Convección",
    },
    {
      id: "ppn",
      name: "Precipitación Horaria",
      icon: CloudRain,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      description: "Tasa instantánea de precipitación (mm/h)",
      category: "Precipitación",
    },
    {
      id: "ppnaccum",
      name: "Precipitación Acumulada",
      icon: CloudRain,
      color: "text-blue-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-300",
      description: "Acumulado total de precipitación desde el inicio (mm)",
      category: "Precipitación",
    },
    {
      id: "rh2",
      name: "Humedad Relativa",
      icon: Droplets,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      description: "Porcentaje de humedad relativa a 2 metros",
      category: "Humedad",
    },
    {
      id: "riesgos_vientos",
      name: "Riesgo por Viento",
      icon: Wind,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      description: "Áreas con riesgo de viento fuerte o ráfagas intensas",
      category: "Viento",
    },
    {
      id: "snow",
      name: "Nieve",
      icon: Snowflake,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      description: "Acumulación de nieve o probabilidad de nevadas",
      category: "Precipitación",
    },
    {
      id: "wdir10",
      name: "Dirección del Viento",
      icon: Wind,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      description: "Dirección desde donde sopla el viento (°) a 10m",
      category: "Viento",
    },
    {
      id: "wspd10",
      name: "Velocidad del Viento",
      icon: Wind,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      description: "Velocidad del viento (m/s) a 10 m de altura",
      category: "Viento",
    },
    {
      id: "wspd_altura",
      name: "Velocidad Viento en Altura",
      icon: Wind,
      color: "text-green-700",
      bgColor: "bg-green-50",
      borderColor: "border-green-300",
      description: "Velocidad del viento a diferentes niveles de altura",
      category: "Viento",
    },
  ]

  useEffect(() => {
    loadWRFData()
  }, [selectedDate, selectedVariable])

  useEffect(() => {
    // Cuando cambian los productos, actualizar horas disponibles y buscar imagen
    updateAvailableHours()
    findImageForSelectedTime()
  }, [allProductos, selectedTime, selectedDate])

  const loadWRFData = async () => {
    try {
      setLoading(true)
      const dateStr = format(selectedDate, "yyyy-MM-dd")

      // También cargar el día anterior y siguiente para capturar todas las horas
      const prevDateStr = format(subDays(selectedDate, 1), "yyyy-MM-dd")
      const nextDateStr = format(addDays(selectedDate, 1), "yyyy-MM-dd")

      console.log("Buscando productos WRF para:", {
        fechas: [prevDateStr, dateStr, nextDateStr],
        variable: selectedVariable,
      })

      // Cargar productos de 3 días para asegurar que tenemos todas las horas
      const [currentResponse, prevResponse, nextResponse] = await Promise.all([
        fetchProductos({
          tipo: "wrf_cba",
          fecha: dateStr,
          variable: selectedVariable,
        }),
        fetchProductos({
          tipo: "wrf_cba",
          fecha: prevDateStr,
          variable: selectedVariable,
        }).catch(() => ({ results: [] })),
        fetchProductos({
          tipo: "wrf_cba",
          fecha: nextDateStr,
          variable: selectedVariable,
        }).catch(() => ({ results: [] })),
      ])

      const currentProductos = currentResponse.results || currentResponse
      const prevProductos = prevResponse.results || prevResponse
      const nextProductos = nextResponse.results || nextResponse

      // Combinar todos los productos
      const todosLosProductos = [...prevProductos, ...currentProductos, ...nextProductos]

      console.log("Productos encontrados:", {
        anterior: prevProductos.length,
        actual: currentProductos.length,
        siguiente: nextProductos.length,
        total: todosLosProductos.length,
      })

      setProductos(currentProductos) // Para mostrar estadísticas
      setAllProductos(todosLosProductos) // Para calcular horas disponibles

      setDebugInfo(
        `Productos: ${currentProductos.length} (${todosLosProductos.length} total) | Variable: ${selectedVariable}`,
      )
    } catch (error) {
      console.error("Error loading WRF data:", error)
      setDebugInfo(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Función para convertir offset de archivo a hora ARG y fecha
  const offsetToArgDateTime = (offset, runHour, baseDate) => {
    // runHour es la hora de inicio de la corrida (06 o 18 UTC)
    // offset es el número después del + en el nombre del archivo
    // baseDate es la fecha base de la corrida

    const utcHour = Number.parseInt(runHour) + Number.parseInt(offset)
    let argHour = utcHour - 3 // Argentina es UTC-3
    let dayOffset = 0

    // Manejar el cambio de día
    if (argHour < 0) {
      argHour += 24
      dayOffset = -1 // Día anterior
    } else if (argHour >= 24) {
      argHour -= 24
      dayOffset = 1 // Día siguiente
    }

    // Calcular la fecha real del pronóstico
    const forecastDate = new Date(baseDate)
    forecastDate.setDate(forecastDate.getDate() + dayOffset)

    return {
      time: `${argHour.toString().padStart(2, "0")}:00`,
      date: forecastDate,
      dateStr: format(forecastDate, "yyyy-MM-dd"),
    }
  }

  const updateAvailableHours = () => {
    if (allProductos.length === 0) {
      setAvailableHours([])
      return
    }

    const selectedDateStr = format(selectedDate, "yyyy-MM-dd")

    // Extraer información de los nombres de archivos
    const hoursInfo = allProductos
      .map((p) => {
        // Buscar patrón de corrida y offset: YYYY-MM-DD_HH+HH
        const match = p.nombre_archivo.match(/(\d{4}-\d{2}-\d{2})_(\d{2})\+(\d{2})/)
        if (match) {
          const [, date, runHour, offset] = match
          const baseDate = new Date(date + "T00:00:00")
          const dateTimeInfo = offsetToArgDateTime(offset, runHour, baseDate)

          console.log(`Archivo: ${p.nombre_archivo} -> Hora ARG: ${dateTimeInfo.time}, Fecha: ${dateTimeInfo.dateStr}`)

          // Solo incluir si la fecha del pronóstico coincide con la fecha seleccionada
          if (selectedDateStr === dateTimeInfo.dateStr) {
            return {
              argTime: dateTimeInfo.time,
              offset: Number.parseInt(offset),
              runHour: Number.parseInt(runHour),
              filename: p.nombre_archivo,
              forecastDate: dateTimeInfo.date,
              producto: p,
            }
          }
        }
        return null
      })
      .filter(Boolean)

    // Obtener horas únicas y ordenarlas
    const uniqueHours = [...new Set(hoursInfo.map((h) => h.argTime))].sort((a, b) => {
      const hourA = Number.parseInt(a.split(":")[0])
      const hourB = Number.parseInt(b.split(":")[0])
      return hourA - hourB
    })

    setAvailableHours(uniqueHours)

    console.log("Horas disponibles (ARG) para fecha seleccionada:", uniqueHours)
    console.log("Información de archivos filtrada:", hoursInfo.length)

    // Si la hora seleccionada no está disponible, seleccionar la primera disponible
    if (uniqueHours.length > 0 && !uniqueHours.includes(selectedTime)) {
      setSelectedTime(uniqueHours[0])
    }
  }

  const findImageForSelectedTime = () => {
    if (allProductos.length === 0) {
      setCurrentImage(null)
      return
    }

    const selectedDateStr = format(selectedDate, "yyyy-MM-dd")
    console.log("Buscando imagen para hora ARG:", selectedTime, "fecha:", selectedDateStr)

    // Buscar el producto que corresponde a la hora ARG seleccionada en la fecha correcta
    const matchingProduct = allProductos.find((p) => {
      // Extraer información del nombre del archivo
      const match = p.nombre_archivo.match(/(\d{4}-\d{2}-\d{2})_(\d{2})\+(\d{2})/)
      if (match) {
        const [, date, runHour, offset] = match
        const baseDate = new Date(date + "T00:00:00")
        const dateTimeInfo = offsetToArgDateTime(offset, runHour, baseDate)

        return dateTimeInfo.time === selectedTime && selectedDateStr === dateTimeInfo.dateStr
      }
      return false
    })

    console.log("Producto encontrado:", matchingProduct?.nombre_archivo)

    if (matchingProduct) {
      // Usar imagen_url (imagen guardada) o url_imagen (externa) como fallback
      const imageUrl = matchingProduct.imagen_url || matchingProduct.url_imagen
      setCurrentImage(imageUrl)
      console.log("URL de imagen:", imageUrl)
    } else {
      setCurrentImage(null)
    }
  }

  // Obtener la variable seleccionada
  const selectedVariableData = variables.find((v) => v.id === selectedVariable)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-2 flex items-center gap-3">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
          <Thermometer className="h-7 w-7 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-1">Modelo WRF</h2>
          <p className="opacity-90">
            Pronóstico meteorológico de alta resolución para la provincia de Córdoba. Selecciona la variable y el horario para ver los mapas.
          </p>
        </div>
      </div>
      {/* Variable Selector */}
      <div className="mb-2">
        {/* Date Selector */}
        <div className="flex items-center space-x-3 mb-4">
          <Calendar className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-white">Fecha</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Seleccionar fecha</label>
            <div className="relative">
              <button
                type="button"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white pr-10 flex items-center gap-2 text-gray-900 text-left"
                onClick={() => setShowDateDropdown((v) => !v)}
              >
                <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                <span>{format(selectedDate, "dd/MM/yyyy", { locale: es })}</span>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </button>
              {showDateDropdown && (
                <div className="absolute z-50 mt-2 w-full rounded-lg p-0 shadow-xl">
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => { setSelectedDate(date); setShowDateDropdown(false); }}
                    dateFormat="dd/MM/yyyy"
                    locale={es}
                    maxDate={new Date()}
                    minDate={new Date(2020, 0, 1)}
                    inline
                    showYearDropdown
                    showMonthDropdown
                    dropdownMode="select"
                  />
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Espacio entre selector de fecha y variable */}
        <div className="mt-8" />

        {/* Variable Selector - Dropdown */}
        <div>
          {/* Rediseño avanzado con animaciones */}
          <motion.div
            className="flex items-center gap-5 mb-6 p-5 rounded-2xl shadow-2xl"
            style={{
              background: 'linear-gradient(120deg, rgba(36,59,107,0.95) 60%, rgba(44,62,80,0.85) 100%)',
              backdropFilter: 'blur(8px)',
              border: '1.5px solid #2b3a5e',
            }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            {selectedVariableData && (
              <motion.div
                className="bg-gradient-to-br from-blue-600 to-indigo-600 p-4 rounded-full shadow-xl flex items-center justify-center border-4 border-white/10"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <selectedVariableData.icon className="h-10 w-10 text-white drop-shadow-lg" />
              </motion.div>
            )}
            <div className="flex flex-col justify-center">
              <motion.h3
                className="text-3xl font-extrabold text-white mb-1 tracking-tight drop-shadow"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {selectedVariableData?.name || "Variable Meteorológica"}
              </motion.h3>
              {selectedVariableData?.description && (
                <motion.p
                  className="text-base text-blue-200 opacity-90 font-medium"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45, duration: 0.5 }}
                >
                  {selectedVariableData.description}
                </motion.p>
              )}
            </div>
          </motion.div>
          <motion.hr className="border-blue-900/40 my-4" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ delay: 0.7, duration: 0.5 }} />

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Seleccionar variable</label>
              <div className="relative">
                <button
                  type="button"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white pr-10 flex items-center gap-2 text-gray-900 text-left"
                  onClick={() => setShowVariableDropdown((v) => !v)}
                >
                  {selectedVariableData && (
                    <selectedVariableData.icon className="h-5 w-5 text-blue-600 mr-2" />
                  )}
                  <span>{selectedVariableData?.name || "Seleccionar variable"}</span>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </button>
                {showVariableDropdown && (
                  <div className="absolute z-50 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-72 overflow-y-auto">
                    {[
                      { label: "🌡️ Temperatura", options: variables.filter((v) => v.category === "Temperatura") },
                      { label: "🌧️ Precipitación", options: variables.filter((v) => v.category === "Precipitación") },
                      { label: "💨 Viento", options: variables.filter((v) => v.category === "Viento") },
                      { label: "☁️ Nubes", options: variables.filter((v) => v.category === "Nubes") },
                      { label: "📡 Radar", options: variables.filter((v) => v.category === "Radar") },
                      { label: "💧 Humedad", options: variables.filter((v) => v.category === "Humedad") },
                      { label: "⚡ Convección", options: variables.filter((v) => v.category === "Convección") },
                    ].map((group) => (
                      <div key={group.label}>
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">{group.label}</div>
                        {group.options.map((variable) => (
                          <button
                            key={variable.id}
                            onClick={() => { setSelectedVariable(variable.id); setShowVariableDropdown(false); }}
                            className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-blue-50 transition ${selectedVariable === variable.id ? 'bg-blue-100 text-blue-700 font-bold' : 'text-gray-700'}`}
                          >
                            <variable.icon className="h-4 w-4 mr-2" />
                            {variable.name}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {selectedVariableData && (
              <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                <p className="text-sm text-gray-700">{selectedVariableData.description}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                    {selectedVariableData.category}
                  </span>
                  <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    {selectedVariable.toUpperCase()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hour Selector with Navigation */}
      <HourSelector selectedHour={selectedTime} onHourChange={setSelectedTime} availableHours={availableHours} />

      {/* Image Display */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">
            {selectedVariableData?.name || "Variable Meteorológica"}
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{selectedTime} ARG</span>
            {currentImage && (
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">🔍 Click para zoom</span>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : currentImage ? (
          <div>
            <ZoomableImage
              src={currentImage}
              alt={`${selectedVariable} - ${format(selectedDate, "dd/MM/yyyy")} ${selectedTime}`}
              className="w-full"
            />
            <div className="mt-3 text-center">
              <p className="text-sm text-white">
                📅 {format(selectedDate, "dd/MM/yyyy")} • 🕐 {selectedTime} ARG • 📊 {selectedVariable.toUpperCase()}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                💡 Haz click en la imagen para hacer zoom y explorar en detalle
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 mb-2">No hay datos disponibles para la fecha y hora seleccionadas</p>
              <p className="text-sm text-gray-400">
                Productos encontrados: {productos.length} | Fecha: {format(selectedDate, "dd/MM/yyyy")} | Variable:{" "}
                {selectedVariable} | Hora: {selectedTime}
              </p>
              <p className="text-xs text-gray-400 mt-2">Horas disponibles: {availableHours.join(", ") || "Ninguna"}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WRFSection
