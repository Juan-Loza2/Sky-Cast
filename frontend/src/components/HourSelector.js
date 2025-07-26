"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Clock } from "lucide-react"

const HourSelector = ({ selectedHour, onHourChange, availableHours = [] }) => {
  const [currentHourIndex, setCurrentHourIndex] = useState(0)

  // Usar las horas disponibles o generar un rango por defecto
  const hoursWithData = availableHours.length > 0 ? availableHours : []

  useEffect(() => {
    const index = hoursWithData.findIndex((hour) => hour === selectedHour)
    if (index !== -1) {
      setCurrentHourIndex(index)
    }
  }, [selectedHour, hoursWithData])

  const goToPreviousHour = () => {
    const newIndex = currentHourIndex > 0 ? currentHourIndex - 1 : hoursWithData.length - 1
    setCurrentHourIndex(newIndex)
    onHourChange(hoursWithData[newIndex])
  }

  const goToNextHour = () => {
    const newIndex = currentHourIndex < hoursWithData.length - 1 ? currentHourIndex + 1 : 0
    setCurrentHourIndex(newIndex)
    onHourChange(hoursWithData[newIndex])
  }

  const selectHour = (hour) => {
    const index = hoursWithData.findIndex((h) => h === hour)
    setCurrentHourIndex(index)
    onHourChange(hour)
  }

  if (hoursWithData.length === 0) {
    return (
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <Clock className="h-5 w-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-[var(--color-text)]-500">Hora de Pronóstico</h3>
          <span className="text-sm text-[var(--color-text)] bg-[var(--color-bg)] px-2 py-1 rounded">No hay horas disponibles</span>
        </div>
        <div className="text-center py-8 text-[var(--color-text)]">Selecciona una fecha con datos disponibles</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center space-x-3 mb-4">
        <Clock className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-[var(--color-text)]">Hora de Pronóstico (ARG)</h3>
        <span className="text-sm font-semibold text-white bg-gradient-to-r from-blue-700 to-indigo-600 px-4 py-2 rounded-xl shadow-lg border border-blue-900/40">
          {hoursWithData.length} horas disponibles
        </span>
      </div>

      {/* Navegador principal con botones << >> */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        <button
          onClick={goToPreviousHour}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          disabled={hoursWithData.length <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Anterior</span>
        </button>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg px-6 py-3 min-w-[140px] text-center">
          <div className="text-2xl font-bold text-blue-800">{selectedHour}</div>
          <div className="text-xs text-blue-600">
            {currentHourIndex + 1} de {hoursWithData.length}
          </div>
        </div>

        <button
          onClick={goToNextHour}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          disabled={hoursWithData.length <= 1}
        >
          <span className="hidden sm:inline">Siguiente</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Grid de horas rápidas */}
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2">
        {hoursWithData.map((hour) => (
          <button
            key={hour}
            onClick={() => selectHour(hour)}
            className={`
              px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 border
              ${
                selectedHour === hour
                  ? 'bg-[var(--selected-bg)] text-[var(--selected-text)] border-[var(--selected-border)] shadow-lg font-bold'
                  : 'bg-[var(--unselected-bg)] text-[var(--unselected-text)] hover:bg-[var(--unselected-hover)] border-[var(--unselected-border)]'
              } border rounded-md
            `}
          >
            {hour}
          </button>
        ))}
      </div>

      {/* Información adicional */}
      <div className="mt-4 text-center">
        <div className="text-xs text-blue-500">
          💡 Usa los botones &lt;&lt; &gt;&gt; para navegar rápidamente entre horas
        </div>
        {hoursWithData.length > 0 && (
          <div className="text-xs text-gray-400 mt-1">
            Rango: {hoursWithData[0]} - {hoursWithData[hoursWithData.length - 1]}
          </div>
        )}
      </div>
    </div>
  )
}

export default HourSelector