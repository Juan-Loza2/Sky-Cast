import React from "react"
import Header from "../components/Header"
import WeatherCard from "../components/WeatherCard"
import { Cloud } from "lucide-react"

const DatosMeteorologicos = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      <Header />
      <main className="flex flex-col items-center justify-center flex-1 py-12 px-4 pt-32">
        <h1 className="text-3xl font-extrabold text-[var(--color-text)] mb-8 tracking-tight drop-shadow">Datos Meteorológicos</h1>
        <div className="w-full max-w-md mx-auto">
          <WeatherCard />
        </div>
      </main>
      {/* Degradé de azul a gris antes del footer */}
      <footer className="bg-[var(--color-bg)] text-[var(--color-text)] py-12 w-full mt-auto">
        <div className="grid md:grid-cols-3 gap-8 px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <Cloud className="h-8 w-8 text-[var(--color-text)]" />
              </div>
              <div>
                <h3 className="text-xl font-bold">OHMC</h3>
                <p className="text-[var(--color-text)] text-sm">Sky cast</p>
              </div>
            </div>
            <p className="text-[var(--color-text)]">
              Observatorio Hidrometeorologico de la Provincia de Cordoba - Monitoreo meteorológico avanzado para la prevención de riesgos ambientales.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Enlaces Rápidos</h4>
            <div className="space-y-2">
              <a href="/" className="block text-[var(--color-text)] hover:text-[var(--color-text)] transition-colors">Inicio</a>
              <a href="/landing" className="block text-[var(--color-text)] hover:text-[var(--color-text)] transition-colors">Landing</a>
              <a href="/quienes-somos" className="block text-[var(--color-text)] hover:text-[var(--color-text)] transition-colors">Quienes Somos</a>
              <a href="/" className="block text-[var(--color-text)] hover:text-[var(--color-text)] transition-colors">Dashboard</a>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Servicios</h4>
            <div className="space-y-2">
              <p className="text-[var(--color-text)]">Modelo WRF</p>
              <p className="text-[var(--color-text)]">Índice FWI</p>
              <p className="text-[var(--color-text)]">Vientos en Rutas</p>
              <p className="text-[var(--color-text)]">Gases Atmosféricos</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center px-4 sm:px-6 lg:px-8">
          <p className="text-[var(--color-text)]">
            © {new Date().getFullYear()} OHMC - Sky cast. Todos los derechos reservados. Desarrollado con fines educativos.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default DatosMeteorologicos 