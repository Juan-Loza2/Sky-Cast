import React, { useState, useEffect } from "react"
import Header from "../components/Header"
import WeatherCard from "../components/WeatherCard"
import { Cloud, Droplets, Wind, Gauge, Activity, Sun, Moon, Thermometer } from "lucide-react"
import { motion } from "framer-motion"

const DatosMeteorologicos = () => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-AR', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('es-AR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const getTimeOfDay = () => {
    const hour = currentTime.getHours()
    if (hour >= 6 && hour < 12) return { icon: Sun, label: "Mañana", color: "text-yellow-500" }
    if (hour >= 12 && hour < 18) return { icon: Sun, label: "Tarde", color: "text-orange-500" }
    if (hour >= 18 && hour < 22) return { icon: Sun, label: "Atardecer", color: "text-red-500" }
    return { icon: Moon, label: "Noche", color: "text-blue-400" }
  }

  const timeOfDay = getTimeOfDay()
  const TimeIcon = timeOfDay.icon

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      <Header />
      <main className="flex flex-col items-center justify-center flex-1 py-12 px-4 pt-32">
        <div className="w-full max-w-6xl mx-auto">
          {/* Grid de widgets meteorológicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            
            {/* Widget del clima actual */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <WeatherCard />
            </motion.div>



            {/* Contenedor para Humedad y Viento lado a lado */}
            <div className="flex gap-4 w-full">
              {/* Widget de humedad */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
                className="rounded-2xl shadow-xl p-6 flex-1 text-white flex flex-col gap-2 relative overflow-hidden group"
                style={{background: '#243b6b', backdropFilter: 'blur(6px)'}}
              >
                {/* Efecto de brillo */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                {/* Partículas flotantes */}
                <div className="absolute inset-0 pointer-events-none">
                  <motion.div
                    className="absolute w-2 h-2 bg-blue-300 rounded-full opacity-60"
                    animate={{ 
                      x: [0, 20, 0],
                      y: [0, -15, 0],
                      opacity: [0.6, 1, 0.6]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    style={{ top: '20%', left: '10%' }}
                  />
                  <motion.div
                    className="absolute w-1 h-1 bg-cyan-300 rounded-full opacity-40"
                    animate={{ 
                      x: [0, -15, 0],
                      y: [0, 20, 0],
                      opacity: [0.4, 0.8, 0.4]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    style={{ top: '60%', left: '80%' }}
                  />
                </div>
                
                <div className="flex justify-between items-start mb-2 relative z-10">
                  <motion.span 
                    className="text-4xl font-extrabold leading-none"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                  >
                    65%
                  </motion.span>
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Droplets className="h-6 w-6 text-blue-200 mt-1" />
                  </motion.div>
                </div>
                <div className="text-lg font-bold flex items-center gap-2 mb-1 relative z-10">
                  Humedad Relativa
                </div>
                
                {/* Barra de progreso animada */}
                <div className="w-full bg-white/20 rounded-full h-2 mb-2 relative z-10">
                  <motion.div 
                    className="bg-gradient-to-r from-blue-400 to-cyan-400 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "65%" }}
                    transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
                  />
                </div>
                
                <div className="text-sm opacity-90 mb-1 relative z-10">
                  Punto de rocío: 18°C
                </div>
              </motion.div>

              {/* Widget de viento */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ duration: 0.6, delay: 0.3, type: "spring" }}
                className="rounded-2xl shadow-xl p-6 flex-1 text-white flex flex-col gap-2 relative overflow-hidden group"
                style={{background: '#243b6b', backdropFilter: 'blur(6px)'}}
              >
                {/* Efecto de brillo */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                {/* Líneas de viento animadas */}
                <div className="absolute inset-0 pointer-events-none">
                  <motion.div
                    className="absolute h-0.5 bg-white/30 rounded-full"
                    animate={{ 
                      x: [-20, 100],
                      opacity: [0, 1, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    style={{ top: '30%', width: '20px' }}
                  />
                  <motion.div
                    className="absolute h-0.5 bg-white/20 rounded-full"
                    animate={{ 
                      x: [-20, 100],
                      opacity: [0, 1, 0]
                    }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 0.5 }}
                    style={{ top: '50%', width: '15px' }}
                  />
                  <motion.div
                    className="absolute h-0.5 bg-white/25 rounded-full"
                    animate={{ 
                      x: [-20, 100],
                      opacity: [0, 1, 0]
                    }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "linear", delay: 1 }}
                    style={{ top: '70%', width: '25px' }}
                  />
                </div>
                
                <div className="flex justify-between items-start mb-2 relative z-10">
                  <motion.span 
                    className="text-4xl font-extrabold leading-none"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  >
                    12 km/h
                  </motion.span>
                  <div>
                    <Wind className="h-6 w-6 text-white mt-1" />
                  </div>
                </div>
                <div className="text-lg font-bold flex items-center gap-2 mb-1 relative z-10">
                  Velocidad del Viento
                </div>
                
                {/* Indicador de dirección */}
                <div className="flex items-center gap-2 mb-2 relative z-10">
                  <motion.div 
                    className="w-8 h-8 border-2 border-white/30 rounded-full flex items-center justify-center"
                    animate={{ rotate: 45 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                  >
                    <div className="w-1 h-3 bg-white rounded-full transform rotate-45"></div>
                  </motion.div>
                  <span className="text-sm opacity-90">NE (45°)</span>
                </div>
                
                <div className="text-sm opacity-90 mb-1 relative z-10">
                  Dirección: NE (45°)
                </div>
              </motion.div>
            </div>

            {/* Contenedor para Presión y Calidad del Aire lado a lado */}
            <div className="flex gap-4 w-full">
              {/* Widget de presión atmosférica */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ duration: 0.6, delay: 0.4, type: "spring" }}
                className="rounded-2xl shadow-xl p-6 flex-1 text-white flex flex-col gap-2 relative overflow-hidden group"
                style={{background: '#243b6b', backdropFilter: 'blur(6px)'}}
              >
                {/* Efecto de brillo */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                {/* Ondas de presión */}
                <div className="absolute inset-0 pointer-events-none">
                  <motion.div
                    className="absolute w-8 h-8 border border-white/20 rounded-full"
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 0, 0.3]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
                    style={{ top: '25%', left: '15%' }}
                  />
                  <motion.div
                    className="absolute w-6 h-6 border border-white/15 rounded-full"
                    animate={{ 
                      scale: [1, 1.8, 1],
                      opacity: [0.2, 0, 0.2]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeOut", delay: 1 }}
                    style={{ top: '65%', left: '75%' }}
                  />
                </div>
                
                <div className="flex justify-between items-start mb-2 relative z-10">
                  <motion.span 
                    className="text-4xl font-extrabold leading-none"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                  >
                    1013 hPa
                  </motion.span>
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Gauge className="h-6 w-6 text-white mt-1" />
                  </motion.div>
                </div>
                <div className="text-lg font-bold flex items-center gap-2 mb-1 relative z-10">
                  Presión Atmosférica
                </div>
                
                {/* Indicador de tendencia */}
                <div className="flex items-center gap-2 mb-2 relative z-10">
                  <motion.div 
                    className="w-3 h-3 bg-green-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-sm opacity-90">Tendencia: Estable</span>
                </div>
                
                <div className="text-sm opacity-90 mb-1 relative z-10">
                  Tendencia: Estable
                </div>
              </motion.div>

              {/* Widget de calidad del aire */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ duration: 0.6, delay: 0.5, type: "spring" }}
                className="rounded-2xl shadow-xl p-6 flex-1 text-white flex flex-col gap-2 relative overflow-hidden group"
                style={{background: '#243b6b', backdropFilter: 'blur(6px)'}}
              >
                {/* Efecto de brillo */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                {/* Partículas de aire limpio */}
                <div className="absolute inset-0 pointer-events-none">
                  <motion.div
                    className="absolute w-1 h-1 bg-green-300 rounded-full"
                    animate={{ 
                      y: [0, -20, 0],
                      opacity: [0.4, 1, 0.4],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    style={{ top: '20%', left: '20%' }}
                  />
                  <motion.div
                    className="absolute w-1 h-1 bg-green-200 rounded-full"
                    animate={{ 
                      y: [0, -15, 0],
                      opacity: [0.3, 0.8, 0.3],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                    style={{ top: '60%', left: '70%' }}
                  />
                  <motion.div
                    className="absolute w-1 h-1 bg-green-400 rounded-full"
                    animate={{ 
                      y: [0, -25, 0],
                      opacity: [0.5, 1, 0.5],
                      scale: [1, 1.3, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                    style={{ top: '40%', left: '85%' }}
                  />
                </div>
                
                <div className="flex justify-between items-start mb-2 relative z-10">
                  <motion.span 
                    className="text-4xl font-extrabold leading-none"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                  >
                    Buena
                  </motion.span>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Activity className="h-6 w-6 text-white mt-1" />
                  </motion.div>
                </div>
                <div className="text-lg font-bold flex items-center gap-2 mb-1 relative z-10">
                  Índice AQI: 45
                </div>
                
                {/* Barra de calidad del aire */}
                <div className="w-full bg-white/20 rounded-full h-2 mb-2 relative z-10">
                  <motion.div 
                    className="bg-gradient-to-r from-green-400 to-yellow-400 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "45%" }}
                    transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
                  />
                </div>
                
                <div className="text-sm opacity-90 mb-1 relative z-10">
                  PM2.5: 12 µg/m³
                </div>
              </motion.div>
            </div>

            {/* Contenedor para Radiación UV y Temperatura Percibida lado a lado */}
            <div className="flex gap-4 w-full">
              {/* Widget de radiación UV */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ duration: 0.6, delay: 0.6, type: "spring" }}
                className="rounded-2xl shadow-xl p-6 flex-1 text-white flex flex-col gap-2 relative overflow-hidden group"
                style={{background: '#243b6b', backdropFilter: 'blur(6px)'}}
              >
                {/* Efecto de brillo */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                {/* Rayos de sol */}
                <div className="absolute inset-0 pointer-events-none">
                  <motion.div
                    className="absolute w-0.5 h-6 bg-yellow-300 rounded-full"
                    animate={{ 
                      rotate: [0, 360],
                      opacity: [0.3, 0.8, 0.3]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    style={{ top: '15%', left: '25%', transformOrigin: 'center bottom' }}
                  />
                  <motion.div
                    className="absolute w-0.5 h-4 bg-orange-300 rounded-full"
                    animate={{ 
                      rotate: [0, -360],
                      opacity: [0.4, 0.9, 0.4]
                    }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "linear", delay: 0.5 }}
                    style={{ top: '25%', left: '75%', transformOrigin: 'center bottom' }}
                  />
                  <motion.div
                    className="absolute w-0.5 h-5 bg-yellow-400 rounded-full"
                    animate={{ 
                      rotate: [0, 360],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: 1 }}
                    style={{ top: '65%', left: '15%', transformOrigin: 'center bottom' }}
                  />
                </div>
                
                <div className="flex justify-between items-start mb-2 relative z-10">
                  <motion.span 
                    className="text-4xl font-extrabold leading-none"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                  >
                    5
                  </motion.span>
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Sun className="h-6 w-6 text-white mt-1" />
                  </motion.div>
                </div>
                <div className="text-lg font-bold flex items-center gap-2 mb-1 relative z-10">
                  Índice UV
                </div>
                
                {/* Barra de intensidad UV */}
                <div className="w-full bg-white/20 rounded-full h-2 mb-2 relative z-10">
                  <motion.div 
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "50%" }}
                    transition={{ delay: 0.9, duration: 1, ease: "easeOut" }}
                  />
                </div>
                
                <div className="text-sm opacity-90 mb-1 relative z-10">
                  Protección recomendada
                </div>
              </motion.div>

              {/* Widget de temperatura sentida */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ duration: 0.6, delay: 0.7, type: "spring" }}
                className="rounded-2xl shadow-xl p-6 flex-1 text-white flex flex-col gap-2 relative overflow-hidden group"
                style={{background: '#243b6b', backdropFilter: 'blur(6px)'}}
              >
                {/* Efecto de brillo */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                {/* Ondas de calor */}
                <div className="absolute inset-0 pointer-events-none">
                  <motion.div
                    className="absolute w-12 h-1 bg-gradient-to-r from-transparent via-purple-300/30 to-transparent rounded-full"
                    animate={{ 
                      y: [0, -10, 0],
                      opacity: [0.2, 0.6, 0.2],
                      scaleX: [0.8, 1.2, 0.8]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    style={{ top: '30%', left: '10%' }}
                  />
                  <motion.div
                    className="absolute w-10 h-1 bg-gradient-to-r from-transparent via-blue-300/40 to-transparent rounded-full"
                    animate={{ 
                      y: [0, -8, 0],
                      opacity: [0.3, 0.7, 0.3],
                      scaleX: [0.9, 1.1, 0.9]
                    }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                    style={{ top: '60%', left: '20%' }}
                  />
                  <motion.div
                    className="absolute w-8 h-1 bg-gradient-to-r from-transparent via-purple-400/35 to-transparent rounded-full"
                    animate={{ 
                      y: [0, -12, 0],
                      opacity: [0.25, 0.65, 0.25],
                      scaleX: [0.7, 1.3, 0.7]
                    }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                    style={{ top: '75%', left: '60%' }}
                  />
                </div>
                
                <div className="flex justify-between items-start mb-2 relative z-10">
                  <motion.span 
                    className="text-4xl font-extrabold leading-none"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.0, type: "spring", stiffness: 200 }}
                  >
                    28°C
                  </motion.span>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Thermometer className="h-6 w-6 text-white mt-1" />
                  </motion.div>
                </div>
                <div className="text-lg font-bold flex items-center gap-2 mb-1 relative z-10">
                  Temperatura Percibida
                </div>
                
                {/* Indicador de sensación térmica */}
                <div className="flex items-center gap-2 mb-2 relative z-10">
                  <motion.div 
                    className="w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                    animate={{ 
                      boxShadow: [
                        "0 0 0 0 rgba(147, 51, 234, 0.4)",
                        "0 0 0 10px rgba(147, 51, 234, 0)",
                        "0 0 0 0 rgba(147, 51, 234, 0)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-sm opacity-90">Factor viento-humedad</span>
                </div>
                
                <div className="text-sm opacity-90 mb-1 relative z-10">
                  Factor viento-humedad
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </main>
      {/* Degradé de azul a gris antes del footer */}
      <footer className="bg-[var(--color-bg)] text-[var(--color-text)] py-12 w-full mt-auto">
        <div className="grid md:grid-cols-2 gap-8 px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <Cloud className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">OHMC</h3>
                <p className="text-gray-400 text-sm">Sky cast</p>
              </div>
            </div>
            <p className="text-gray-400">
              Observatorio Hidrometeorologico de la Provincia de Cordoba - Monitoreo meteorológico avanzado para la prevención de riesgos ambientales.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Enlaces Rápidos</h4>
              <div className="space-y-2">
                <a href="/landing" className="block text-gray-400 hover:text-white transition-colors">Inicio</a>
                <a href="/datos-meteorologicos" className="block text-gray-400 hover:text-white transition-colors">Datos Meteorológicos</a>
                <a href="/quienes-somos" className="block text-gray-400 hover:text-white transition-colors">Quienes Somos</a>
                <a href="/" className="block text-gray-400 hover:text-white transition-colors">Dashboard</a>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Servicios</h4>
              <div className="space-y-2">
                <p className="text-gray-400">Modelo WRF</p>
                <p className="text-gray-400">Índice FWI</p>
                <p className="text-gray-400">Vientos en Rutas</p>
                <p className="text-gray-400">Gases Atmosféricos</p>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center px-4 sm:px-6 lg:px-8">
          <p className="text-gray-400">
            © {new Date().getFullYear()} OHMC - Sky cast. Todos los derechos reservados. Desarrollado con fines educativos.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default DatosMeteorologicos 