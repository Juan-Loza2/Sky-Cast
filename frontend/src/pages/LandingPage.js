"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Cloud,
  Flame,
  Wind,
  Activity,
  ArrowRight,
  Database,
  Users,
  MapPin,
  Phone,
  Mail,
  Globe,
  ChevronDown,
  Menu,
  X,
  Award,
  Target,
  Eye,
  Facebook,
  Twitter,
} from "lucide-react"

const LandingPage = () => {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleAccessDashboard = () => {
    navigate("/dashboard")
  }

  const services = [
    {
      icon: Cloud,
      title: "Modelo WRF",
      description: "Datos meteorológicos de alta resolución para pronósticos precisos",
      color: "blue",
    },
    {
      icon: Flame,
      title: "Índice FWI",
      description: "Monitoreo del peligro de incendios forestales en tiempo real",
      color: "red",
    },
    {
      icon: Wind,
      title: "Vientos en Rutas",
      description: "Alertas de ráfagas de viento para seguridad vial",
      color: "purple",
    },
    {
      icon: Activity,
      title: "Gases Atmosféricos",
      description: "Medición de calidad del aire y contaminantes",
      color: "green",
    },
  ]

  const stats = [
    { number: "24/7", label: "Monitoreo Continuo" },
    { number: "4", label: "Tipos de Datos" },
    { number: "100+", label: "Variables Medidas" },
    { number: "API", label: "Acceso REST" },
  ]

  const getColorClasses = (color) => {
    const colors = {
      blue: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
      red: "from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
      purple: "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
      green: "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <Cloud className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">OHMC</h1>
                <p className="text-xs text-gray-600">Sky cast</p>
              </div>
            </div>
            {/* ...resto del código del usuario... */}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Monitoreo de Calidad del Aire y Meteorología
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Accede a datos meteorológicos de alta resolución y monitoreo de calidad del aire en tiempo real.
              Nuestro sistema te permite predecir condiciones climáticas y monitorear contaminantes.
            </p>
            <button
              onClick={handleAccessDashboard}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Acceder al Dashboard
            </button>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                  <service.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-700">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</p>
              <p className="text-gray-700">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">OHMC</h3>
            <p className="text-gray-400">
              Somos líderes en monitoreo de calidad del aire y meteorología.
              Ofrecemos datos precisos y confiables para una mejor toma de decisiones.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Enlaces Rápidos</h3>
            <ul>
              <li className="mb-3">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Inicio
                </a>
              </li>
              <li className="mb-3">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Servicios
                </a>
              </li>
              <li className="mb-3">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Contacto</h3>
            <ul>
              <li className="flex items-center mb-3">
                <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                <span>Av. Principal 123, Ciudad</span>
              </li>
              <li className="flex items-center mb-3">
                <Phone className="h-5 w-5 text-gray-500 mr-2" />
                <a href="tel:+1234567890" className="text-gray-400 hover:text-white transition-colors">
                  +123 456 7890
                </a>
              </li>
              <li className="flex items-center mb-3">
                <Mail className="h-5 w-5 text-gray-500 mr-2" />
                <a href="mailto:info@ohmc.com" className="text-gray-400 hover:text-white transition-colors">
                  info@ohmc.com
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Síguenos</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Globe className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-16 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} OHMC. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  )
}

export default LandingPage 