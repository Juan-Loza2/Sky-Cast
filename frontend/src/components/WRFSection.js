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
import { fetchItems } from "../services/api"
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
  const variables_permitidas = ["t2", "ppnaccum", "rh2", "max_dbz", "wdir10", "wspd10"];
  const variables = [
    {
      id: "t2",
      name: "Temperatura a 2m",
      icon: Thermometer,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-gray-300",
      description: "Temperatura del aire a 2 metros sobre el suelo, expresada en grados Celsius (°C).",
      category: "Temperatura",
    },
    {
      id: "ppnaccum",
      name: "Precipitación Acumulada",
      icon: CloudRain,
      color: "text-blue-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-300",
      description: "Suma total de la precipitación (lluvia) caída desde el inicio de la corrida del modelo, en milímetros (mm).",
      category: "Precipitación",
    },
    {
      id: "rh2",
      name: "Humedad Relativa",
      icon: Droplets,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      description: "Porcentaje de humedad relativa del aire a 2 metros de altura. Indica cuán saturado está el aire de vapor de agua, clave para evaluar sensación térmica y riesgo de nieblas.",
      category: "Humedad",
    },
    {
      id: "max_dbz",
      name: "Reflectividad Máxima",
      icon: Zap,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      description: "Valor máximo de reflectividad radar simulado por el modelo (dBZ). Se asocia a la intensidad de la precipitación y la presencia de tormentas fuertes.",
      category: "Radar",
    },
    {
      id: "wdir10",
      name: "Dirección del Viento",
      icon: Wind,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      description: "Dirección desde la cual sopla el viento a 10 metros de altura, expresada en grados.",
      category: "Viento",
    },
    {
      id: "wspd10",
      name: "Velocidad del Viento",
      icon: Wind,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      description: "Velocidad del viento a 10 metros de altura, en metros por segundo (m/s). Importante para evaluar riesgos de ráfagas, dispersión de contaminantes y seguridad.",
      category: "Viento",
    },
  ].filter(v => variables_permitidas.includes(v.id));

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
        fetchItems({
          tipo: "wrf_cba",
          fecha: dateStr,
          variable: selectedVariable,
        }),
        fetchItems({
          tipo: "wrf_cba",
          fecha: prevDateStr,
          variable: selectedVariable,
        }).catch(() => ({ results: [] })),
        fetchItems({
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
          // Solo incluir si la fecha del pronóstico coincide con la fecha seleccionada
          if (selectedDateStr === dateTimeInfo.dateStr) {
            // Solo incluir si hay imagen disponible
            const imageUrl = p.imagen_url || p.url_imagen
            if (imageUrl && imageUrl !== "" && imageUrl !== null && imageUrl !== undefined) {
              return {
                argTime: dateTimeInfo.time,
                offset: Number.parseInt(offset),
                runHour: Number.parseInt(runHour),
                filename: p.nombre_archivo,
                forecastDate: dateTimeInfo.date,
                producto: p,
                imageUrl,
              }
            }
          }
        }
        return null
      })
      .filter(Boolean)
    // Filtrar solo horas entre 00:00 y 24:00 inclusive
    .filter((h) => {
      const hour = Number.parseInt(h.argTime.split(":")[0])
      return hour >= 0 && hour <= 24
    })

  // Filtrar horas únicas por argTime
  const uniqueHoursMap = new Map()
  hoursInfo.forEach((h) => {
    if (!uniqueHoursMap.has(h.argTime)) {
      uniqueHoursMap.set(h.argTime, h)
    }
  })
  const uniqueHours = Array.from(uniqueHoursMap.values())
    .map((h) => h.argTime)
    .sort((a, b) => {
      const hourA = Number.parseInt(a.split(":")[0])
      const hourB = Number.parseInt(b.split(":")[0])
      return hourA - hourB
    })

  setAvailableHours(uniqueHours)

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
    // Buscar el producto que corresponde a la hora ARG seleccionada en la fecha correcta y que tenga imagen
    const matchingProduct = allProductos.find((p) => {
      const match = p.nombre_archivo.match(/(\d{4}-\d{2}-\d{2})_(\d{2})\+(\d{2})/)
      if (match) {
        const [, date, runHour, offset] = match
        const baseDate = new Date(date + "T00:00:00")
        const dateTimeInfo = offsetToArgDateTime(offset, runHour, baseDate)
        const imageUrl = p.imagen_url || p.url_imagen
        return dateTimeInfo.time === selectedTime && selectedDateStr === dateTimeInfo.dateStr && imageUrl && imageUrl !== "" && imageUrl !== null && imageUrl !== undefined
      }
      return false
    })

    if (matchingProduct) {
      const imageUrl = matchingProduct.imagen_url || matchingProduct.url_imagen
      setCurrentImage(imageUrl)
    } else {
      setCurrentImage(null)
    }
  }

  // Obtener la variable seleccionada
  const selectedVariableData = variables.find((v) => v.id === selectedVariable)

  const variableGroups = [
    { label: "🌡️ Temperatura", category: "Temperatura" },
    { label: "🌧️ Precipitación", category: "Precipitación" },
    { label: "💨 Viento", category: "Viento" },
    { label: "📡 Radar", category: "Radar" },
    { label: "💧 Humedad", category: "Humedad" },
  ];

  const variableGroupsWithOptions = variableGroups
    .map(group => ({
      ...group,
      options: variables.filter(v => v.category === group.category)
    }))
    .filter(group => group.options.length > 0);

  return (
    <div className="space-y-6 text-[var(--color-text)]">
      {/* Header */}
      <div className="mb-2">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
            <Thermometer className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold">Modelo WRF</h2>
        </div>
        <p className="opacity-90">
          El <b>Modelo WRF (Weather Research and Forecasting)</b> es un sistema numérico avanzado utilizado para simular y predecir el estado de la atmósfera.<br/>
          <br/>
          Selecciona la variable meteorológica y el horario de interés para visualizar mapas interactivos.
        </p>
      </div>
      {/* Variable Selector */}
      <div className="mb-2 text-[var(--color-text)]">
        {/* Date Selector */}
        <div className="flex items-center space-x-3 mb-4 text-[var(--color-text)]">
          <Calendar className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-[var(--color-text)]">Fecha</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Seleccionar fecha</label>
            <div className="relative">
              <button
                type="button"
                className="w-full input p-3 rounded-lg pr-10 flex items-center gap-2 text-left text-[var(--color-text)]"
                onClick={() => setShowDateDropdown((v) => !v)}
              >
                <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                <span>{format(selectedDate, "dd/MM/yyyy", { locale: es })}</span>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </button>
              {showDateDropdown && (
                <div className="absolute z-50 mt-2 w-full rounded-lg p-0 ">
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
            className="flex items-center gap-5 mb-6 p-5 rounded-2xl bg-[var(--color-card)] text-[var(--color-text)]"
            style={{
              backdropFilter: 'blur(8px)',
              border: '1.5px solid #2b3a5e',
            }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            {selectedVariableData && (
              <motion.div
                className="bg-gradient-to-br from-blue-600 to-indigo-600 p-4 rounded-full flex items-center justify-center border-4 border-white/10 text-[var(--color-text)]"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <selectedVariableData.icon className="h-10 w-10 text-white drop-shadow-lg" />
              </motion.div>
            )}
            <div className="flex flex-col justify-center text-[var(--color-text)]">
              <motion.h3
                className="text-3xl font-extrabold text-[var(--color-text)] mb-1 tracking-tight drop-shadow"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {selectedVariableData?.name || "Variable Meteorológica"}
              </motion.h3>
              {selectedVariableData?.description && (
                <motion.p
                  className="text-base text-[var(--color-text)]-200 opacity-90 font-medium"
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
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Seleccionar variable</label>
              <div className="relative">
                <button
                  type="button"
                  className="w-full input p-3 rounded-lg pr-10 flex items-center gap-2 text-left"
                  onClick={() => setShowVariableDropdown((v) => !v)}
                >
                  {selectedVariableData && (
                    <selectedVariableData.icon className="h-5 w-5 text-blue-600 mr-2" />
                  )}
                  <span>{selectedVariableData?.name || "Seleccionar variable"}</span>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </button>
                {showVariableDropdown && (
                  <div className="absolute z-50 mt-2 w-full rounded-lg shadow-lg border border-gray-300 max-h-72 overflow-y-auto">
                    {variableGroupsWithOptions.map((group) => (
                      <div key={group.label}>
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">{group.label}</div>
                        {group.options.map((variable) => (
                          <button
                            key={variable.id}
                            onClick={() => { setSelectedVariable(variable.id); setShowVariableDropdown(false); }}
                            className={`w-full flex items-center gap-2 px-4 py-2 text-sm transition ${
                              selectedVariable === variable.id 
                                ? 'button-primary font-bold' 
                                : 'button'
                            }`}

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
          </div>
        </div>
      </div>

      {/* Hour Selector with Navigation */}
      <HourSelector selectedHour={selectedTime} onHourChange={setSelectedTime} availableHours={availableHours} textColor="text-[var(--color-text)]"/>

      {/* Image Display */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[var(--color-text)]">
            {selectedVariableData?.name || "Variable Meteorológica"}
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-[var(--color-text)] bg-[var(--color-bg)] px-3 py-1 rounded-full">{selectedTime} ARG</span>
            {currentImage && (
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">🔍 Click para zoom</span>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-96 bg-[var(--color-bg)] rounded-lg">
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
              <p className="text-sm text-[var(--color-text)]">
                📅 {format(selectedDate, "dd/MM/yyyy")} • 🕐 {selectedTime} ARG • 📊 {selectedVariable.toUpperCase()}
              </p>
              <p className="text-xs text-[var(--color-text)]-600 mt-1">
                💡 Haz click en la imagen para hacer zoom y explorar en detalle
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-96 bg-[var(--color-bg)] rounded-lg border-2 border-dashed border-[var(--color-border)]">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-[var(--color-text)] mx-auto mb-2" />
              <p className="text-[var(--color-text)] mb-2">No hay datos disponibles para la fecha y hora seleccionadas</p>
              <p className="text-sm text-[var(--color-text)]">
                Productos encontrados: {productos.length} | Fecha: {format(selectedDate, "dd/MM/yyyy")} | Variable:{" "}
                {selectedVariable} | Hora: {selectedTime}
              </p>
                <p className="text-xs text-[var(--color-text)] mt-2">Horas disponibles: {availableHours.join(", ") || "Ninguna"}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WRFSection
