"use client"

import { useState, useEffect } from "react"
import { Calendar, Activity, TrendingUp } from "lucide-react"
import DatePicker from "react-datepicker"
import { format, subDays } from "date-fns"
import { es } from "date-fns/locale"
import { fetchProductos } from "../services/api"
import ZoomableImage from "./ZoomableImage"
import "react-datepicker/dist/react-datepicker.css"

const GasesSection = ({ loading: initialLoading }) => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(initialLoading)

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
      const response = await fetchProductos({
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
      <div style={{background: '#171F2F99', borderRadius: '1.5rem', boxShadow: '0 4px 24px 0 rgba(23,31,47,0.10)'}} className="p-6">
        <div className="flex items-center space-x-3 mb-2">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <span className="bg-blue-600 p-2 rounded-lg mr-2 flex items-center justify-center">
              <Activity className="h-6 w-6 text-white" />
            </span>
            Medición de Gases de Efecto Invernadero
          </h2>
        </div>
        <p className="text-gray-200">
          Visualizaciones diarias de gases de efecto invernadero medidos por el analizador Picarro en el OHMC. Datos
          actualizados diariamente a las 10:30 h.
        </p>
      </div>

      {/* Date Selector */}
      <div style={{background: '#171F2F99', borderRadius: '1.5rem', boxShadow: '0 4px 24px 0 rgba(23,31,47,0.10)'}} className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Calendar className="h-5 w-5 text-white" />
          <h3 className="text-lg font-semibold text-white">Seleccionar fecha</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Fecha</label>
            <DatePicker
              selected={selectedDate}
              onChange={setSelectedDate}
              dateFormat="dd/MM/yyyy"
              locale={es}
              maxDate={new Date()}
              minDate={subDays(new Date(), 30)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Fecha seleccionada</label>
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg w-full h-[48px] flex items-center">
              <span className="font-semibold text-blue-800 text-left">{format(selectedDate, "dd/MM/yyyy", { locale: es })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gas Visualizations */}
      <div className="grid md:grid-cols-2 gap-6">
        {gasTypes.map((gasType) => {
          const producto = getImageForGas(gasType)

          return (
            <div key={gasType.id} style={{background: (gasType.id === 'CO2' || gasType.id === 'CH4') ? '#171F2F99' : '' , borderRadius: (gasType.id === 'CO2' || gasType.id === 'CH4') ? '1.5rem' : '', boxShadow: (gasType.id === 'CO2' || gasType.id === 'CH4') ? '0 4px 24px 0 rgba(23,31,47,0.10)' : ''}} className={`p-6 ${(gasType.id === 'CO2' || gasType.id === 'CH4') ? '' : 'card'}`}>
              <div className="flex items-center space-x-3 mb-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${gasType.bgColor} border ${gasType.borderColor}`}
                >
                  <Activity className={`h-6 w-6 ${gasType.color}`} />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${(gasType.id === 'CO2' || gasType.id === 'CH4') ? 'text-white' : 'text-gray-900'}`}>{gasType.name}</h3>
                  <p className={`text-sm ${(gasType.id === 'CO2' || gasType.id === 'CH4') ? 'text-white' : 'text-gray-600'}`}>{gasType.symbol}</p>
                </div>
              </div>

              <p className={`text-sm mb-4 ${(gasType.id === 'CO2' || gasType.id === 'CH4') ? 'text-white' : 'text-gray-600'}`}>{gasType.description}</p>

              {loading ? (
                <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : producto ? (
                <div>
                  <ZoomableImage
                    src={producto.url_imagen}
                    alt={`${gasType.name} - ${format(selectedDate, "dd/MM/yyyy")}`}
                    className="w-full"
                  />
                  <div className="mt-3 text-sm text-gray-500 bg-gray-50 p-2 rounded">
                    Última actualización: {producto.ultima_fecha || "No disponible"}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No hay datos disponibles para esta fecha</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Info Panel */}
      <div className="card bg-blue-50 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">ℹ️ Información sobre las mediciones</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h4 className="font-semibold mb-2">Dióxido de Carbono (CO₂)</h4>
            <p>
              Principal gas de efecto invernadero. Las mediciones muestran las variaciones diarias de concentración en
              la atmósfera local.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Metano (CH₄)</h4>
            <p>
              Segundo gas de efecto invernadero más importante. Tiene un potencial de calentamiento global mayor que el
              CO₂.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GasesSection
